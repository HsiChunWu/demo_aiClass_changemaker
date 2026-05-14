// SettingsDrawer — small slide-down panel to configure the n8n webhook URL.
// Persisted to localStorage so the URL survives refresh.

const WEBHOOK_KEY = "qjd_n8n_webhook_url";

const useWebhookUrl = () => {
  const [url, setUrlState] = React.useState(() => {
    try { return localStorage.getItem(WEBHOOK_KEY) || ""; } catch { return ""; }
  });
  const setUrl = (v) => {
    setUrlState(v);
    try { localStorage.setItem(WEBHOOK_KEY, v); } catch {}
  };
  return [url, setUrl];
};

const SettingsButton = ({ open, hasUrl, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "8px 14px", borderRadius: 9999,
      border: "1px solid var(--paper-3)", background: open ? "var(--paper-2)" : "var(--paper-1)",
      cursor: "pointer", fontSize: 13, fontWeight: 600,
      color: "var(--ink-2)", transition: "all 220ms var(--ease-out)",
    }}
  >
    <span style={{
      width: 8, height: 8, borderRadius: "50%",
      background: hasUrl ? "var(--moss-500)" : "var(--ink-4)",
    }} />
    {hasUrl ? "已連線 n8n" : "尚未連線 n8n"}
    <Icon name="chevronDown" size={12} />
  </button>
);

const SettingsDrawer = ({ open, onClose, url, setUrl }) => {
  const [draft, setDraft] = React.useState(url);
  React.useEffect(() => { setDraft(url); }, [url, open]);

  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(27,31,26,0.18)",
        backdropFilter: "blur(2px)", zIndex: 40,
        animation: "fadeInUp 220ms var(--ease-out) both",
      }} />
      <div style={{
        position: "fixed", top: 72, right: 24, width: 420, maxWidth: "92vw",
        background: "var(--paper-1)",
        border: "1px solid var(--paper-3)", borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-lg)", padding: 22, zIndex: 41,
        animation: "fadeInUp 280ms var(--ease-out) both",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div className="t-eyebrow" style={{ color: "var(--moss-600)" }}>後端設定</div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: 9999,
            border: "1px solid var(--paper-3)", background: "var(--paper-1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--ink-3)",
          }}>
            <Icon name="close" size={12} />
          </button>
        </div>
        <h3 className="t-h3" style={{ margin: 0, marginBottom: 6, fontSize: 20 }}>
          n8n Webhook 連結
        </h3>
        <p style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 0, marginBottom: 16, lineHeight: 1.6 }}>
          設定後，使用者提交表單時將以 POST 送往此網址，並期待回傳含 graph 與 courses 的 JSON。
          若留空或失敗，會自動以示範資料展示流程。
        </p>

        <div className="field">
          <label className="field-label">Webhook URL</label>
          <input
            className="field-input"
            placeholder="https://your-n8n.example.com/webhook/qjd-intake"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
            style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
          />
        </div>

        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--moss-600)" }}>
            預期回傳格式（點開查看）
          </summary>
          <pre style={{
            marginTop: 10, padding: 12, background: "var(--paper-2)",
            border: "1px solid var(--paper-3)", borderRadius: 8,
            fontSize: 11, lineHeight: 1.6, color: "var(--ink-2)",
            overflowX: "auto",
          }}>{`{
  "summary": { "headline": "...", "rationale": "...",
               "estimatedWeeks": 14, "hoursPerWeek": 6, "pace": "穩健" },
  "milestones": [{ "id": "m1", "week": 3, "label": "..." }, ...],
  "graph": {
    "nodes": [{ "id": "ts", "col": 0, "row": 1, "cat": "tech",
                "label": "TypeScript", "status": "current",
                "hours": 10, "why": "..." }, ...],
    "edges": [["js-core", "ts"], ...]
  },
  "courses": {
    "foundation": [...], "core": [...], "advanced": [...]
  }
}`}</pre>
        </details>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}>
          {url && (
            <Button variant="ghost" size="sm" onClick={() => { setUrl(""); setDraft(""); }}>
              清除
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={onClose}>取消</Button>
          <Button variant="primary" size="sm" onClick={() => { setUrl(draft.trim()); onClose(); }}>
            儲存
          </Button>
        </div>
      </div>
    </>
  );
};

window.SettingsButton = SettingsButton;
window.SettingsDrawer = SettingsDrawer;
window.useWebhookUrl = useWebhookUrl;
