// CourseMap — 3-tier course recommendation row (foundation / core / advanced)
// Each tier is a column of course cards. Clicking a card focuses its node in the graph.

const TIERS = [
  { key: "foundation", label: "基礎", desc: "打好底，輕鬆上手", color: "var(--moss-300)" },
  { key: "core",       label: "核心", desc: "你的學習主軸",     color: "var(--moss-500)" },
  { key: "advanced",   label: "進階", desc: "邁向終點目標",     color: "var(--sun-300)" },
];

const CourseCard = ({ course, onClick, isSelected }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        background: "var(--paper-1)",
        border: `1px solid ${isSelected ? "var(--moss-500)" : "var(--paper-3)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "16px 18px",
        cursor: "pointer",
        boxShadow: hover ? "var(--shadow-md)" : isSelected ? "0 0 0 3px rgba(63,125,90,0.15)" : "var(--shadow-xs)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "all 220ms var(--ease-out)",
      }}
    >
      {course.featured && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          fontSize: 10, fontWeight: 700, color: "var(--sun-500)",
          letterSpacing: "0.08em",
        }}>★ 推薦</div>
      )}
      <div style={{
        display: "inline-block", fontSize: 11, fontWeight: 600,
        color: "var(--ink-3)", textTransform: "uppercase",
        letterSpacing: "0.08em", marginBottom: 6,
      }}>
        {course.provider}
      </div>
      <div style={{
        fontWeight: 700, fontSize: 16, lineHeight: 1.4,
        color: "var(--ink-1)", marginBottom: 10, textWrap: "balance",
      }}>
        {course.title}
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        fontSize: 12, color: "var(--ink-3)", marginBottom: 12,
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Icon name="clock" size={12} /> {course.hours} 小時
        </span>
        <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--ink-4)" }} />
        <span>{course.level}</span>
      </div>
      {course.tags && course.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {course.tags.map(t => (
            <span key={t} style={{
              fontSize: 11, padding: "2px 8px",
              background: "var(--paper-2)", color: "var(--ink-3)",
              borderRadius: 9999, fontWeight: 500,
            }}>{t}</span>
          ))}
        </div>
      )}
    </div>
  );
};

const CourseMap = ({ courses, graphNodes, selectedNodeId, onSelectNode }) => {
  const nodeMap = Object.fromEntries(graphNodes.map(n => [n.id, n]));
  const totalHours =
    [...courses.foundation, ...courses.core, ...courses.advanced]
      .reduce((sum, c) => sum + c.hours, 0);

  return (
    <div style={{
      padding: "var(--space-10) var(--space-8) var(--space-16)",
      background: "var(--paper-1)",
      borderTop: "1px solid var(--paper-3)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          gap: 24, marginBottom: 28,
        }}>
          <div>
            <div className="t-eyebrow" style={{ marginBottom: 8 }}>課程地圖</div>
            <h2 className="t-h1" style={{ margin: 0 }}>
              依路徑挑好的 <span style={{ color: "var(--moss-600)" }}>{[...courses.foundation, ...courses.core, ...courses.advanced].length} 堂課</span>
            </h2>
            <p style={{ color: "var(--ink-3)", marginTop: 6, fontSize: 15 }}>
              點選任一堂課，可在上方圖譜看見它對應的知識點。
            </p>
          </div>
          <div style={{
            display: "flex", gap: 24, padding: "14px 22px",
            background: "var(--paper-2)", borderRadius: 14,
            border: "1px solid var(--paper-3)",
          }}>
            <Stat label="總時數" value={`${totalHours} 小時`} />
            <Divider />
            <Stat label="課程數" value={[...courses.foundation, ...courses.core, ...courses.advanced].length} />
            <Divider />
            <Stat label="難度" value="初 → 高" />
          </div>
        </div>

        {/* Tier columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {TIERS.map(tier => {
            const list = courses[tier.key] || [];
            return (
              <div key={tier.key}>
                <div style={{
                  display: "flex", alignItems: "baseline", justifyContent: "space-between",
                  marginBottom: 14, paddingBottom: 12,
                  borderBottom: `2px solid ${tier.color}`,
                }}>
                  <div>
                    <div style={{
                      fontFamily: "var(--font-display)", fontSize: 22,
                      fontWeight: 700, color: "var(--ink-1)",
                    }}>{tier.label}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{tier.desc}</div>
                  </div>
                  <div style={{
                    fontSize: 12, color: "var(--ink-3)",
                    background: "var(--paper-2)", padding: "3px 10px",
                    borderRadius: 9999, fontWeight: 600,
                  }}>{list.length} 堂</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {list.map(c => (
                    <CourseCard
                      key={c.id}
                      course={c}
                      isSelected={selectedNodeId === c.node}
                      onClick={() => onSelectNode(c.node)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: "0.08em", fontWeight: 600, textTransform: "uppercase" }}>{label}</div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--ink-1)", lineHeight: 1.1, marginTop: 2 }}>{value}</div>
  </div>
);
const Divider = () => <div style={{ width: 1, background: "var(--paper-3)" }} />;

window.CourseMap = CourseMap;
