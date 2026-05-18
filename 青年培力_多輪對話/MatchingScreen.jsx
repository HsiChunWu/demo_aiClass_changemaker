// MatchingScreen — quiet, short waiting screen used while we check if the
// webhook can match the user's needs to courses in the database.
// Visually echoes LoadingScreen but smaller and calmer.

const MatchingScreen = ({ payload, attempt = 1 }) => {
  // Cycle between two short status lines so it feels alive without being noisy.
  const lines = [
    "正在比對課程資料庫…",
    "確認你的需求是否能對應到現有課程…",
  ];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % lines.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="screen" style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "var(--space-12) var(--space-6)",
      background: "var(--paper-1)",
    }}>
      <div style={{
        maxWidth: 540, width: "100%", textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 24,
      }}>
        <div style={{ position: "relative", width: 96, height: 96 }}>
          {/* three small node dots circling a center moss dot */}
          <svg viewBox="0 0 96 96" width="96" height="96">
            <circle cx="48" cy="48" r="9" fill="var(--moss-500)" />
            {[0, 1, 2].map(i => (
              <g key={i} style={{
                transformOrigin: "48px 48px",
                animation: `spinNode 3.6s linear ${i * -1.2}s infinite`,
              }}>
                <circle cx="48" cy="14" r="5" fill="var(--moss-300)">
                  <animate attributeName="opacity"
                           values="0.4;1;0.4" dur="3.6s"
                           begin={`${i * -1.2}s`} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
          </svg>
          <style>{`
            @keyframes spinNode {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 28, fontWeight: 700,
          color: "var(--ink-1)", lineHeight: 1.3,
        }}>
          {payload?.name ? `${payload.name}，` : ""}稍等一下
        </div>

        <div style={{
          fontSize: 16, color: "var(--ink-3)", minHeight: 28,
          transition: "opacity 320ms var(--ease-out)",
        }}>
          {lines[idx]}
        </div>

        <div style={{
          marginTop: 4, fontSize: 13, color: "var(--ink-4)",
          maxWidth: 380, lineHeight: 1.7,
        }}>
          我們不會直接硬配課程。如果現有資料不足以判斷，會先請你補充一點細節。
        </div>

        {attempt > 1 && (
          <div style={{
            marginTop: 6, fontSize: 12, color: "var(--moss-600)",
            fontWeight: 600, letterSpacing: "0.06em",
          }}>
            第 {attempt} 次比對
          </div>
        )}
      </div>
    </div>
  );
};

window.MatchingScreen = MatchingScreen;
