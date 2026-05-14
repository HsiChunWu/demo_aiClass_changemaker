// app.jsx — top-level state machine for the 青聚點 intake → result flow.
// States: 'input' | 'loading' | 'result'.

const App = () => {
  const [phase, setPhase]       = React.useState("input"); // input | loading | result
  const [payload, setPayload]   = React.useState(null);
  const [result, setResult]     = React.useState(null);
  const [error, setError]       = React.useState(null);
  const [ready, setReady]       = React.useState(false);

  const webhookUrl = "https://classtest.flyinmoon0217.workers.dev";

  // When the loading screen finishes its visual sequence AND data is ready, move on.
  const onLoadingComplete = React.useCallback(() => {
    setPhase("result");
  }, []);

  // Validate / normalize a response from n8n into the shape ResultScreen expects.
  // If the response is missing required keys, fall back to mock.
  const normalize = (raw) => {
    if (!raw || typeof raw !== "object") return null;
    // n8n often returns [{ json: {...} }] — unwrap if needed
    if (Array.isArray(raw)) raw = raw[0] || {};
    if (raw.json && typeof raw.json === "object") raw = raw.json;
    if (raw.data && typeof raw.data === "object") raw = raw.data;
    if (!raw.graph || !raw.courses || !raw.summary) return null;
    return raw;
  };

  const submit = async (data) => {
    setPayload(data);
    setError(null);
    setReady(false);
    setResult(null);
    setPhase("loading");

    if (!webhookUrl) {
      // Use mock; pretend the call takes a realistic amount of time.
      await new Promise(r => setTimeout(r, 5400));
      const mock = JSON.parse(JSON.stringify(window.MOCK_RESULT));
      mock.summary.name = data.name;
      mock.summary.hoursPerWeek = data.hours;
      setResult(mock);
      setReady(true);
      return;
    }

    try {
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 45000);
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: ctrl.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`Webhook 回應 ${res.status}`);
      const raw = await res.json();
      const normalized = normalize(raw);
      if (!normalized) throw new Error("回傳格式不符，已套用示範資料");
      setResult(normalized);
      setReady(true);
    } catch (err) {
      console.warn("n8n call failed, using mock fallback:", err);
      setError(err?.message || "連線失敗");
      // Still display mock so the demo flow continues
      const mock = JSON.parse(JSON.stringify(window.MOCK_RESULT));
      mock.summary.name = data.name;
      mock.summary.hoursPerWeek = data.hours;
      setResult(mock);
      // small delay so the user sees the error briefly
      setTimeout(() => setReady(true), 800);
    }
  };

  const reset = () => {
    setPhase("input");
    setSelectedReset();
  };
  const setSelectedReset = () => {
    // future: clear any other transient state
  };

  return (
    <>
      {/* Header */}
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

      {/* Phase content */}
      {phase === "input" && (
        <IntakeForm defaultValues={payload} onSubmit={submit} />
      )}
      {phase === "loading" && (
        <LoadingScreen
          payload={payload}
          ready={ready}
          error={error}
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
