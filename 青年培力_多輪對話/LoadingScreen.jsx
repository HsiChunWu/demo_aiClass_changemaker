// LoadingScreen — shows step-by-step parsing progress while n8n call is in-flight.
// Visual: small node-graph blooming alongside step list.

const STEPS = [
  { id: "parse",   label: "解析你的需求",        desc: "從文字中萃取關鍵詞與目標" },
  { id: "match",   label: "比對知識點",          desc: "從 3,200 個節點中找出最相關的" },
  { id: "graph",   label: "建立你的知識圖譜",    desc: "依照前後關係連結成可走的路徑" },
  { id: "courses", label: "挑選最合適的課程",    desc: "依你的程度與時間排序" },
  { id: "review",  label: "彙整成最終建議",      desc: "加入里程碑與預估時程" },
];

const LoadingScreen = ({ payload, ready, error, onComplete }) => {
  const [stepIdx, setStepIdx] = React.useState(0);
  const [done, setDone] = React.useState(false);

  // Animate steps forward; each step ~1.2s. Hold last step until parent says ready.
  React.useEffect(() => {
    if (done) return;
    const t = setTimeout(() => {
      setStepIdx(i => {
        if (i < STEPS.length - 1) return i + 1;
        return i;
      });
    }, 1200);
    return () => clearTimeout(t);
  }, [stepIdx, done]);

  // When parent says ready AND we've reached last step, complete.
  React.useEffect(() => {
    if (ready && stepIdx >= STEPS.length - 1 && !done) {
      setDone(true);
      // small celebratory hold
      setTimeout(() => onComplete?.(), 500);
    }
  }, [ready, stepIdx, done, onComplete]);

  return (
    <div className="screen" style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "var(--space-12) var(--space-6)",
      background: "radial-gradient(ellipse at top, #FBF2DF 0%, #FAF7F0 60%)",
    }}>
      <div style={{
        maxWidth: 880, width: "100%",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-16)",
        alignItems: "center",
      }}>
        {/* Left: live "graph being built" */}
        <BuildingGraph stepIdx={stepIdx} />

        {/* Right: step list */}
        <div>
          <div className="t-eyebrow" style={{ marginBottom: 12 }}>
            為「{payload?.name || "你"}」生成路徑中
          </div>
          <h2 className="t-h1" style={{ margin: 0, marginBottom: 28 }}>
            {error ? (
              <span style={{ color: "var(--ember-300)" }}>連線出了點問題</span>
            ) : (
              <span className="shimmer-text">正在彙整知識圖譜…</span>
            )}
          </h2>

          {error && (
            <div style={{
              padding: 14, borderRadius: 10, marginBottom: 20,
              background: "var(--ember-50)", border: "1px solid var(--ember-100)",
              color: "var(--ember-500)", fontSize: 14,
            }}>
              {error}
              <div style={{ marginTop: 6, fontSize: 13, color: "var(--ink-3)" }}>
                已自動切換為示範資料繼續展示。
              </div>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {STEPS.map((s, i) => {
              const stepDone = i < stepIdx || done;
              const active = i === stepIdx && !done;
              const pending = i > stepIdx;
              return (
                <div key={s.id} style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  opacity: pending ? 0.45 : 1,
                  transition: "opacity 320ms var(--ease-out)",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: stepDone ? "var(--moss-500)" : active ? "var(--paper-1)" : "var(--paper-2)",
                    border: active ? "2px solid var(--moss-500)" : `1px solid ${stepDone ? "var(--moss-500)" : "var(--paper-3)"}`,
                    color: stepDone ? "var(--paper-1)" : "var(--ink-3)",
                    transition: "all 320ms var(--ease-out)",
                    position: "relative",
                    marginTop: 2,
                  }}>
                    {stepDone ? (
                      <Icon name="check" size={14} color="#FAF7F0" strokeWidth={2.5} />
                    ) : active ? (
                      <span style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "var(--moss-500)",
                        animation: "pulseDot 1.4s ease-in-out infinite",
                      }} />
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{i + 1}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, paddingTop: 2 }}>
                    <div style={{
                      fontWeight: 600, fontSize: 15,
                      color: stepDone || active ? "var(--ink-1)" : "var(--ink-3)",
                    }}>{s.label}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 32, fontSize: 13, color: "var(--ink-4)" }}>
            通常需要 20–40 秒。請保持頁面開啟。
          </div>
        </div>
      </div>
    </div>
  );
};

// A small svg that "grows" a graph as the step index increases.
const BuildingGraph = ({ stepIdx }) => {
  // Pre-defined node positions for a nice constellation
  const nodes = [
    { id: "n1", x: 80,  y: 80,  step: 0, cat: "tech",  size: 22 },
    { id: "n2", x: 200, y: 50,  step: 0, cat: "tech",  size: 26 },
    { id: "n3", x: 150, y: 170, step: 0, cat: "data",  size: 20 },
    { id: "n4", x: 290, y: 130, step: 1, cat: "tech",  size: 30 },
    { id: "n5", x: 90,  y: 240, step: 1, cat: "tools", size: 22 },
    { id: "n6", x: 230, y: 250, step: 2, cat: "career",size: 26 },
    { id: "n7", x: 360, y: 220, step: 2, cat: "data",  size: 22 },
    { id: "n8", x: 320, y: 320, step: 3, cat: "tech",  size: 28 },
    { id: "n9", x: 180, y: 340, step: 3, cat: "tools", size: 24 },
    { id: "n0", x: 290, y: 50,  step: 4, cat: "milestone", size: 40 },
  ];
  const edges = [
    ["n1","n2",0], ["n1","n3",0], ["n2","n4",1], ["n3","n4",1],
    ["n3","n5",1], ["n5","n6",2], ["n4","n6",2], ["n4","n7",2],
    ["n7","n8",3], ["n6","n8",3], ["n6","n9",3], ["n9","n8",3],
    ["n2","n0",4], ["n4","n0",4], ["n8","n0",4],
  ];
  const CAT_COLOR = window.CAT_COLOR_RESULT;
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  return (
    <div style={{
      position: "relative",
      background: "var(--paper-1)",
      border: "1px solid var(--paper-3)",
      borderRadius: "var(--radius-xl)",
      boxShadow: "var(--shadow-sm)",
      padding: 16,
      aspectRatio: "1 / 1",
      overflow: "hidden",
    }}>
      {/* dot grid */}
      <svg width="100%" height="100%" viewBox="0 0 440 400"
           style={{ position: "absolute", inset: 16, width: "calc(100% - 32px)", height: "calc(100% - 32px)" }}>
        <defs>
          <pattern id="ldots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#E6E0D1" />
          </pattern>
        </defs>
        <rect width="440" height="400" fill="url(#ldots)" opacity="0.6" />

        {/* edges */}
        {edges.map(([a, b, step], i) => {
          const visible = step <= stepIdx;
          if (!visible) return null;
          const na = nodeMap[a], nb = nodeMap[b];
          return (
            <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke="#B7CDB8" strokeWidth="1.5" opacity="0.7"
                  style={{
                    animation: `fadeInUp 480ms var(--ease-out) both`,
                    animationDelay: `${(i % 5) * 60}ms`,
                  }} />
          );
        })}

        {/* nodes */}
        {nodes.map((n, i) => {
          if (n.step > stepIdx) return null;
          const color = CAT_COLOR[n.cat] || "#3F7D5A";
          const isMilestone = n.cat === "milestone";
          return (
            <g key={n.id} style={{
              animation: `nodePop 480ms var(--ease-spring) both`,
              animationDelay: `${i * 60}ms`,
              transformOrigin: `${n.x}px ${n.y}px`,
            }}>
              {isMilestone && (
                <circle cx={n.x} cy={n.y} r={n.size/2 + 6} fill="none"
                        stroke={color} strokeWidth="1.5"
                        strokeDasharray="3 3" opacity="0.5">
                  <animateTransform attributeName="transform" type="rotate"
                    from={`0 ${n.x} ${n.y}`} to={`360 ${n.x} ${n.y}`}
                    dur="14s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={n.x} cy={n.y} r={n.size/2} fill={color} />
              {isMilestone && (
                <polygon
                  points={`${n.x},${n.y-7} ${n.x+2},${n.y-2.5} ${n.x+7},${n.y-2} ${n.x+3},${n.y+1.5} ${n.x+4.5},${n.y+7} ${n.x},${n.y+4} ${n.x-4.5},${n.y+7} ${n.x-3},${n.y+1.5} ${n.x-7},${n.y-2} ${n.x-2},${n.y-2.5}`}
                  fill="#1B1F1A" />
              )}
            </g>
          );
        })}
      </svg>

      <div style={{
        position: "absolute", left: 20, bottom: 16,
        fontSize: 11, color: "var(--ink-4)",
        letterSpacing: "0.08em", textTransform: "uppercase",
        fontWeight: 600,
      }}>
        Building your graph
      </div>
    </div>
  );
};

window.LoadingScreen = LoadingScreen;
