// app.jsx — orchestrates the full intake → matching → clarify → loading → result flow.
// Single webhook URL with action-based body. Supports multi-round clarification.

const WEBHOOK_URL = "https://classtest.flyinmoon0217.workers.dev";

const App = () => {
  // Phases: input | matching | clarify | loading | result
  const [phase, setPhase]     = React.useState("input");
  const [payload, setPayload] = React.useState(null);
  const [result, setResult]   = React.useState(null);
  const [error, setError]     = React.useState(null);
  const [ready, setReady]     = React.useState(false);

  // Multi-round clarification thread + current assistant turn
  const [clarificationMessages, setClarificationMessages] = React.useState([]);
  const [currentClarification, setCurrentClarification]   = React.useState(null);
  const [clarifyAttempt, setClarifyAttempt]               = React.useState(0);
  const [usingMockClarify, setUsingMockClarify]           = React.useState(false);

  const onLoadingComplete = React.useCallback(() => {
    setPhase("result");
  }, []);

  // ------------------------------------------------------------------
  // Normalize webhook response into one of: { kind: 'clarify' | 'matched' | null }
  // Supports new format (status + result) and legacy format (direct summary/graph/courses).
  // ------------------------------------------------------------------
  const normalize = (raw) => {
    if (!raw || typeof raw !== "object") return null;

    // Unwrap common n8n wrappers
    if (Array.isArray(raw)) raw = raw[0] || {};
    if (raw.json && typeof raw.json === "object") raw = raw.json;
    if (raw.data && typeof raw.data === "object" && !raw.status && !raw.summary) {
      raw = raw.data;
    }

    // New format — needs_clarification
    if (raw.status === "needs_clarification") {
      return {
        kind: "clarify",
        assistant: {
          role: "assistant",
          content: raw.question || "可以再多說一點你的需求嗎？",
          reason: raw.reason || "",
          suggestedReplies: Array.isArray(raw.suggestedReplies) ? raw.suggestedReplies : [],
          nearbyCourses:    Array.isArray(raw.nearbyCourses)    ? raw.nearbyCourses    : [],
        },
      };
    }

    // New format — matched (result is nested)
    if (raw.status === "matched" && raw.result) {
      const r = raw.result;
      if (r.summary && r.graph && r.courses) {
        return { kind: "matched", result: r, match: raw.match || null };
      }
    }

    // Legacy / direct format — treat as matched
    if (raw.summary && raw.graph && raw.courses) {
      return { kind: "matched", result: raw, match: null };
    }

    return null;
  };

  // ------------------------------------------------------------------
  // Call webhook with action + payload + clarificationMessages
  // ------------------------------------------------------------------
  const matchOrGenerate = async (data, messages) => {
    setPhase("matching");
    setError(null);

    const body = {
      action: "match_or_generate",
      payload: data,
      clarificationMessages: messages,
    };

    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 45000);
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!res.ok) throw new Error(`Webhook 回應 ${res.status}`);
      const raw = await res.json();
      const norm = normalize(raw);
      if (!norm) throw new Error("回傳格式不符");
      handleNormalized(norm, messages);
      setUsingMockClarify(false);
    } catch (err) {
      console.warn("webhook failed, using mock fallback:", err);
      handleMockFallback(data, messages, err?.message || "連線失敗");
    }
  };

  const handleNormalized = (norm, messages) => {
    if (norm.kind === "clarify") {
      const nextMessages = [...messages, norm.assistant];
      setClarificationMessages(nextMessages);
      setCurrentClarification(norm.assistant);
      setClarifyAttempt(a => a + 1);
      // Small delay so matching screen doesn't flash too fast
      setTimeout(() => setPhase("clarify"), 600);
      return;
    }
    if (norm.kind === "matched") {
      const r = { ...norm.result };
      // Preserve name in summary for the result header
      if (r.summary && payload?.name && !r.summary.name) r.summary.name = payload.name;
      setResult(r);
      setReady(false);
      setPhase("loading");
      // Loading screen will mark itself ready as data arrives
      setTimeout(() => setReady(true), 100);
    }
  };

  // Use mock data as a graceful fallback so the demo flow keeps working
  // even when the webhook is offline or returns unexpected shapes.
  const handleMockFallback = (data, messages, errMsg) => {
    setError(errMsg);
    setUsingMockClarify(true);

    // Count how many assistant turns we've already shown to pick the next mock turn
    const assistantTurns = messages.filter(m => m.role === "assistant").length;
    const mockTurn = window.MOCK_CLARIFICATIONS?.[assistantTurns];

    if (mockTurn) {
      // Still ask a clarifying question
      const norm = normalize(mockTurn);
      handleNormalized(norm, messages);
      return;
    }

    // Out of mock turns → return the matched mock result
    const mockResult = JSON.parse(JSON.stringify(window.MOCK_RESULT));
    if (mockResult.summary && data?.name) mockResult.summary.name = data.name;
    if (mockResult.summary && data?.hours) mockResult.summary.hoursPerWeek = data.hours;
    setResult(mockResult);
    setReady(false);
    setPhase("loading");
    setTimeout(() => setReady(true), 800);
  };

  // ------------------------------------------------------------------
  // Event handlers
  // ------------------------------------------------------------------
  const submit = (data) => {
    setPayload(data);
    setClarificationMessages([]);
    setCurrentClarification(null);
    setClarifyAttempt(0);
    setResult(null);
    matchOrGenerate(data, []);
  };

  const submitClarification = (text) => {
    const userMsg = { role: "user", content: text };
    const next = [...clarificationMessages, userMsg];
    setClarificationMessages(next);
    matchOrGenerate(payload, next);
  };

  const reset = () => {
    setPhase("input");
    setClarificationMessages([]);
    setCurrentClarification(null);
    setClarifyAttempt(0);
    setError(null);
  };

  const backToIntakeFromClarify = () => {
    setPhase("input");
    // Keep clarificationMessages so user can resume if they want; cleared on next submit
  };

  // ------------------------------------------------------------------
  return (
    <>
      <header className="app-header">
        <a href="#" onClick={(e) => { e.preventDefault(); if (phase !== "input") reset(); }}
           style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={(typeof window !== "undefined" && window.__resources && window.__resources.logo) || "assets/logo.svg"} alt="青聚點" className="logo" />
        </a>
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <a href="#" style={navLinkStyle(false)}>關於</a>
          <a href="#" style={navLinkStyle(false)}>路徑庫</a>
          <a href="#" style={navLinkStyle(false)}>導師</a>
          <a href="#" style={navLinkStyle(false)}>登入</a>
        </nav>
        <div style={{ width: 1 }} />
      </header>

      {phase === "input" && (
        <IntakeForm defaultValues={payload} onSubmit={submit} />
      )}

      {phase === "matching" && (
        <MatchingScreen
          payload={payload}
          attempt={clarifyAttempt + 1}
        />
      )}

      {phase === "clarify" && (
        <ClarifyScreen
          payload={payload}
          messages={clarificationMessages}
          currentAssistant={currentClarification}
          attemptNumber={clarifyAttempt}
          onSubmit={submitClarification}
          onBackToIntake={backToIntakeFromClarify}
        />
      )}

      {phase === "loading" && (
        <LoadingScreen
          payload={payload}
          ready={ready}
          error={error && !usingMockClarify ? error : null}
          onComplete={onLoadingComplete}
        />
      )}

      {phase === "result" && result && (
        <ResultScreen payload={payload} result={result} onReset={reset} />
      )}
    </>
  );
};

const navLinkStyle = (active) => ({
  fontSize: 14,
  fontWeight: active ? 700 : 500,
  color: active ? "var(--ink-1)" : "var(--ink-2)",
  textDecoration: "none",
  transition: "color 220ms var(--ease-out)",
});

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
