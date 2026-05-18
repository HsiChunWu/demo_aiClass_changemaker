// NodeDetail — right-rail drawer that shows when a graph node or course is selected.
// Displays node label, category, status, hours, "why this", linked courses, prereqs.

const NodeDetail = ({ node, allCourses, graphNodes, graphEdges, onClose, onSelectNode }) => {
  if (!node) return null;
  const CAT_COLOR = window.CAT_COLOR_RESULT;
  const CAT_LABEL = window.CAT_LABEL;
  const STATUS_LABEL = window.STATUS_LABEL;

  // Find linked courses
  const allCoursesFlat = [...allCourses.foundation, ...allCourses.core, ...allCourses.advanced];
  const linkedCourses = allCoursesFlat.filter(c => c.node === node.id);

  // Find prerequisites + next steps
  const prereqIds = graphEdges.filter(([, b]) => b === node.id).map(([a]) => a);
  const nextIds   = graphEdges.filter(([a]) => a === node.id).map(([, b]) => b);
  const byId = Object.fromEntries(graphNodes.map(n => [n.id, n]));
  const prereqs = prereqIds.map(id => byId[id]).filter(Boolean);
  const nexts   = nextIds.map(id => byId[id]).filter(Boolean);

  const color = CAT_COLOR[node.cat] || "#3F7D5A";

  return (
    <div style={{
      position: "fixed", top: 64, right: 0, bottom: 0,
      width: 420, maxWidth: "92vw",
      background: "var(--paper-1)",
      borderLeft: "1px solid var(--paper-3)",
      boxShadow: "var(--shadow-lg)",
      zIndex: 30,
      display: "flex", flexDirection: "column",
      animation: "slideInRight 320ms var(--ease-out) both",
    }}>
      {/* Slide-in keyframes scoped via inline style tag — fine for a single component */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "20px 24px 16px",
        borderBottom: "1px solid var(--paper-3)",
        position: "relative",
      }}>
        <button onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            width: 32, height: 32, borderRadius: 9999,
            border: "1px solid var(--paper-3)", background: "var(--paper-1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--ink-3)",
          }}>
          <Icon name="close" size={14} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "3px 10px", borderRadius: 9999,
            background: color + "22", color,
            fontSize: 12, fontWeight: 700,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
            {CAT_LABEL[node.cat] || node.cat}
          </span>
          <span style={{
            padding: "3px 10px", borderRadius: 9999,
            background: "var(--paper-2)", color: "var(--ink-2)",
            fontSize: 12, fontWeight: 600,
          }}>
            {STATUS_LABEL[node.status] || node.status}
          </span>
        </div>

        <h3 className="t-h2" style={{ margin: 0, fontSize: 28 }}>{node.label}</h3>

        {node.hours != null && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            marginTop: 10, fontSize: 13, color: "var(--ink-3)",
          }}>
            <Icon name="clock" size={14} /> 預計 {node.hours} 小時完成
          </div>
        )}
      </div>

      {/* Scrolling body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px 28px" }}>
        {node.why && (
          <Section title="為什麼推薦你學這個">
            <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 15, lineHeight: 1.7 }}>
              {node.why}
            </p>
          </Section>
        )}

        {linkedCourses.length > 0 && (
          <Section title={`推薦課程（${linkedCourses.length}）`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {linkedCourses.map(c => (
                <div key={c.id} style={{
                  padding: "12px 14px",
                  background: "var(--paper-2)",
                  border: "1px solid var(--paper-3)",
                  borderRadius: 10,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink-1)" }}>{c.title}</div>
                    {c.featured && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "var(--sun-500)" }}>★ 推薦</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
                    {c.provider} · {c.hours} 小時 · {c.level}
                  </div>
                </div>
              ))}
              <Button variant="primary" size="md" iconRight="arrowRight" style={{ alignSelf: "flex-start", marginTop: 6 }}>
                開始學習
              </Button>
            </div>
          </Section>
        )}

        {prereqs.length > 0 && (
          <Section title="前置知識點">
            <NodePillRow nodes={prereqs} onClick={onSelectNode} />
          </Section>
        )}

        {nexts.length > 0 && (
          <Section title="完成後可前往">
            <NodePillRow nodes={nexts} onClick={onSelectNode} />
          </Section>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 24 }}>
    <div className="t-eyebrow" style={{ marginBottom: 10 }}>{title}</div>
    {children}
  </div>
);

const NodePillRow = ({ nodes, onClick }) => {
  const CAT_COLOR = window.CAT_COLOR_RESULT;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {nodes.map(n => {
        const color = CAT_COLOR[n.cat] || "#3F7D5A";
        return (
          <div key={n.id} onClick={() => onClick(n.id)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 12px 6px 8px", borderRadius: 9999,
              background: "var(--paper-1)",
              border: "1px solid var(--paper-3)",
              cursor: "pointer", transition: "all 220ms var(--ease-out)",
              fontSize: 13, fontWeight: 500, color: "var(--ink-1)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--paper-3)"; }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
            {n.label}
          </div>
        );
      })}
    </div>
  );
};

window.NodeDetail = NodeDetail;
