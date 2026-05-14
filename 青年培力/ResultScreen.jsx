// ResultScreen — summary card + knowledge graph + course map.
// Composes GraphView + CourseMap + NodeDetail. Manages selectedNodeId.

const ResultScreen = ({ payload, result, onReset }) => {
  const [selectedId, setSelectedId] = React.useState(null);

  const handleSelect = (id) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  const selectedNode = result.graph.nodes.find(n => n.id === selectedId);

  return (
    <div className="screen">
      {/* Top: summary header */}
      <SummaryHeader payload={payload} result={result} onReset={onReset} />

      {/* Graph + milestones row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 280px",
        gap: 0,
        height: "660px",
        borderBottom: "1px solid var(--paper-3)",
      }}>
        <div style={{ position: "relative", borderRight: "1px solid var(--paper-3)" }}>
          <GraphView
            data={result.graph}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>
        <MilestonesRail milestones={result.milestones} totalWeeks={result.summary.estimatedWeeks} />
      </div>

      {/* Course map */}
      <CourseMap
        courses={result.courses}
        graphNodes={result.graph.nodes}
        selectedNodeId={selectedId}
        onSelectNode={handleSelect}
      />

      {/* Node detail drawer */}
      {selectedNode && (
        <NodeDetail
          node={selectedNode}
          allCourses={result.courses}
          graphNodes={result.graph.nodes}
          graphEdges={result.graph.edges}
          onClose={() => setSelectedId(null)}
          onSelectNode={handleSelect}
        />
      )}
    </div>
  );
};

const SummaryHeader = ({ payload, result, onReset }) => {
  const { summary } = result;
  return (
    <div style={{
      background: "radial-gradient(ellipse at top right, #FBF2DF 0%, #FAF7F0 60%)",
      padding: "var(--space-12) var(--space-8) var(--space-10)",
      borderBottom: "1px solid var(--paper-3)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          gap: 32, flexWrap: "wrap",
        }}>
          <div style={{ flex: 1, minWidth: 360 }}>
            <div className="t-eyebrow" style={{ marginBottom: 12, color: "var(--moss-600)" }}>
              為 {payload?.name || "你"} 量身打造
            </div>
            <h1 className="t-display" style={{
              margin: 0, fontSize: 48, lineHeight: 1.15,
              textWrap: "balance",
            }}>
              {summary.headline}
            </h1>
            <p className="t-lead" style={{
              maxWidth: 640, marginTop: 18, color: "var(--ink-2)",
              fontSize: 16, lineHeight: 1.8,
            }}>
              {summary.rationale}
            </p>
          </div>

          {/* Right stat block */}
          <div style={{
            background: "var(--paper-1)",
            border: "1px solid var(--paper-3)",
            borderRadius: "var(--radius-xl)",
            padding: "20px 24px",
            boxShadow: "var(--shadow-sm)",
            display: "grid", gridTemplateColumns: "auto auto auto", gap: 28,
            alignItems: "center",
          }}>
            <BigStat value={summary.estimatedWeeks} unit="週" label="預估完成" />
            <Sep />
            <BigStat value={summary.hoursPerWeek} unit="hr/週" label="投入時間" />
            <Sep />
            <BigStat value={summary.pace} unit="" label="學習節奏" small />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
          <Button variant="primary" size="md" icon="play">
            開始第一個節點
          </Button>
          <Button variant="secondary" size="md" icon="bookmark">
            儲存我的路徑
          </Button>
          <Button variant="ghost" size="md" icon="settings" onClick={onReset}>
            重新調整需求
          </Button>
        </div>
      </div>
    </div>
  );
};

const BigStat = ({ value, unit, label, small }) => (
  <div>
    <div style={{
      fontFamily: "var(--font-display)",
      fontSize: small ? 26 : 36,
      fontWeight: 700, color: "var(--ink-1)", lineHeight: 1,
      letterSpacing: "-0.02em",
    }}>
      {value}
      {unit && <span style={{
        fontSize: 14, color: "var(--ink-3)", fontWeight: 500,
        fontFamily: "var(--font-body)", marginLeft: 4,
      }}>{unit}</span>}
    </div>
    <div style={{
      fontSize: 12, color: "var(--ink-3)", marginTop: 6,
      fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
    }}>{label}</div>
  </div>
);
const Sep = () => <div style={{ width: 1, height: 38, background: "var(--paper-3)" }} />;

const MilestonesRail = ({ milestones, totalWeeks }) => {
  return (
    <div style={{
      background: "var(--paper-1)",
      padding: "24px 22px",
      display: "flex", flexDirection: "column", gap: 4,
      overflowY: "auto",
    }}>
      <div className="t-eyebrow" style={{ marginBottom: 14 }}>里程碑</div>
      <h3 className="t-h3" style={{ margin: 0, marginBottom: 18, fontSize: 20 }}>
        共 4 個關卡，{totalWeeks} 週走完
      </h3>

      <div style={{ position: "relative", paddingLeft: 22 }}>
        {/* Vertical line */}
        <div style={{
          position: "absolute", left: 9, top: 8, bottom: 8,
          width: 2, background: "var(--paper-3)",
        }} />
        {milestones.map((m, i) => (
          <div key={m.id} style={{ position: "relative", paddingBottom: 24 }}>
            <div style={{
              position: "absolute", left: -22, top: 2,
              width: 20, height: 20, borderRadius: "50%",
              border: "2px solid var(--moss-500)",
              background: "var(--paper-1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--moss-600)" }}>{i + 1}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--ink-3)", fontWeight: 600, letterSpacing: "0.04em" }}>
              第 {m.week} 週
            </div>
            <div style={{
              fontWeight: 600, fontSize: 15, color: "var(--ink-1)",
              marginTop: 2, lineHeight: 1.4,
            }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.ResultScreen = ResultScreen;
