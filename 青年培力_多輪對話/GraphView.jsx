// GraphView — hierarchical, left→right knowledge graph for result page.
// Nodes positioned by (col, row); user can pan/zoom; clicking a node selects it.

const GraphView = ({ data, selectedId, onSelect }) => {
  const CAT_COLOR = window.CAT_COLOR_RESULT;
  const [hover, setHover] = React.useState(null);
  const [zoom, setZoom]   = React.useState(1);
  const [pan, setPan]     = React.useState({ x: 0, y: 0 });
  const dragRef = React.useRef(null);
  const didMoveRef = React.useRef(false);

  // Layout — compute (x, y) from (col, row) so the same data can drive layout
  const COL_W = 200;
  const ROW_H = 160;
  const PAD_X = 90;
  const PAD_Y = 90;
  const positioned = React.useMemo(() => {
    return data.nodes.map(n => ({
      ...n,
      x: PAD_X + n.col * COL_W,
      y: PAD_Y + n.row * ROW_H,
    }));
  }, [data]);
  const cols = Math.max(...data.nodes.map(n => n.col)) + 1;
  const rows = Math.max(...data.nodes.map(n => n.row)) + 1;
  const vbW = PAD_X * 2 + (cols - 1) * COL_W;
  const vbH = PAD_Y * 2 + (rows - 1) * ROW_H;

  const nodeMap = Object.fromEntries(positioned.map(n => [n.id, n]));

  const isNeighbor = (id) => {
    if (!selectedId) return false;
    if (id === selectedId) return true;
    return data.edges.some(([a,b]) => (a===selectedId&&b===id) || (b===selectedId&&a===id));
  };
  const edgeIsHot = (a, b) => selectedId && (a === selectedId || b === selectedId);

  const onMouseDown = (e) => {
    dragRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y, startX: e.clientX, startY: e.clientY };
    didMoveRef.current = false;
  };
  const onMouseMove = (e) => {
    if (!dragRef.current) return;
    const dx = Math.abs(e.clientX - dragRef.current.startX);
    const dy = Math.abs(e.clientY - dragRef.current.startY);
    if (dx > 3 || dy > 3) didMoveRef.current = true;
    setPan({ x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y });
  };
  const onMouseUp = () => { dragRef.current = null; };

  const handleNodeClick = (id) => {
    if (didMoveRef.current) return;
    onSelect(id);
  };

  // Build a curved path between two nodes (for nicer look than straight lines)
  const edgePath = (na, nb) => {
    const mx = (na.x + nb.x) / 2;
    return `M ${na.x} ${na.y} C ${mx} ${na.y}, ${mx} ${nb.y}, ${nb.x} ${nb.y}`;
  };

  const renderNode = (n) => {
    const color = CAT_COLOR[n.cat] || "#3F7D5A";
    const sel  = selectedId === n.id;
    const isH  = hover === n.id;
    const dim  = selectedId && !isNeighbor(n.id);

    let fill = color, stroke = "transparent", strokeWidth = 0;
    let inner = null;
    const r = n.size ? n.size / 2 : 22;
    const size = n.size || 44;

    if (n.status === "done") {
      fill = color;
      inner = (
        <g transform={`translate(${n.x - 8}, ${n.y - 8})`} pointerEvents="none">
          <polyline points="3,8 7,12 13,5" fill="none" stroke="#FAF7F0"
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    } else if (n.status === "current") {
      fill = color; stroke = color; strokeWidth = 2;
    } else if (n.status === "available") {
      fill = "var(--paper-1)"; stroke = color; strokeWidth = 2.5;
    } else if (n.status === "locked") {
      fill = "#EDE7D6";
      inner = (
        <g transform={`translate(${n.x - 5}, ${n.y - 6})`} pointerEvents="none">
          <rect x="0" y="4" width="10" height="7" rx="1" fill="#A8AFA4" />
          <path d="M2 4 V3 a3 3 0 0 1 6 0 V4" fill="none" stroke="#A8AFA4" strokeWidth="1.4" />
        </g>
      );
    } else if (n.status === "milestone") {
      fill = color;
      inner = (
        <g transform={`translate(${n.x - 9}, ${n.y - 9})`} pointerEvents="none">
          <polygon points="9,1 11.5,7 18,7.5 13,11.5 14.7,18 9,14 3.3,18 5,11.5 0,7.5 6.5,7"
                   fill="#1B1F1A" />
        </g>
      );
    }

    return (
      <g key={n.id}
         style={{ cursor: "pointer", transition: "opacity 320ms" }}
         opacity={dim ? 0.22 : 1}
         onMouseEnter={() => setHover(n.id)}
         onMouseLeave={() => setHover(null)}
         onClick={() => handleNodeClick(n.id)}>
        {/* milestone halo */}
        {n.status === "milestone" && (
          <circle cx={n.x} cy={n.y} r={r + 9} fill="none" stroke={color}
                  strokeWidth="1.5" strokeDasharray="4 4" opacity="0.55">
            <animateTransform attributeName="transform" type="rotate"
              from={`0 ${n.x} ${n.y}`} to={`360 ${n.x} ${n.y}`}
              dur="18s" repeatCount="indefinite" />
          </circle>
        )}
        {/* current pulse */}
        {n.status === "current" && (
          <circle cx={n.x} cy={n.y} r={r + 6} fill="none" stroke={color}
                  strokeWidth="1.5" opacity="0.5">
            <animate attributeName="r" values={`${r+4};${r+12};${r+4}`} dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2.4s" repeatCount="indefinite" />
          </circle>
        )}
        {(sel || isH) && (
          <circle cx={n.x} cy={n.y} r={r + 8} fill="none"
                  stroke={color} strokeWidth="2" opacity={sel ? 0.55 : 0.3} />
        )}
        <circle cx={n.x} cy={n.y} r={r}
                fill={fill} stroke={stroke} strokeWidth={strokeWidth}
                style={{ transition: "all 220ms" }} />
        {inner}
        <text x={n.x} y={n.y + r + 18} textAnchor="middle"
              fontFamily="Noto Sans TC" fontSize="13"
              fontWeight={sel ? 700 : 500}
              fill={dim ? "#A8AFA4" : (sel ? "#1B1F1A" : "#3A4137")}>
          {n.label}
        </text>
        {/* hours sub-label */}
        {n.hours && (sel || isH) && !dim && (
          <text x={n.x} y={n.y + r + 34} textAnchor="middle"
                fontFamily="Noto Sans TC" fontSize="11"
                fill="#6B7568" fontWeight={500}>
            預計 {n.hours} 小時
          </text>
        )}
      </g>
    );
  };

  return (
    <div style={{
      position: "relative", height: "100%", width: "100%", overflow: "hidden",
      background: "radial-gradient(ellipse at center, #FBF7EC 0%, #FAF7F0 60%, #F2EEE4 100%)",
    }}>
      {/* dot grid */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.45 }}>
        <defs>
          <pattern id="gdots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#D8D1BE" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gdots)" />
      </svg>

      {/* Column eyebrows */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        display: "flex", justifyContent: "space-around", padding: "20px 60px 0",
      }}>
        {["起點", "前端深化", "後端轉換", "上線實作", "目標"].slice(0, cols).map((label, i) => (
          <div key={i} className="t-eyebrow" style={{
            color: "var(--ink-4)", fontSize: 10, fontWeight: 600,
          }}>{`階段 ${i+1} · ${label}`}</div>
        ))}
      </div>

      <svg width="100%" height="100%" viewBox={`0 0 ${vbW} ${vbH}`}
           preserveAspectRatio="xMidYMid meet"
           style={{
             position: "absolute", inset: 0,
             cursor: dragRef.current ? "grabbing" : "grab",
           }}
           onMouseDown={onMouseDown} onMouseMove={onMouseMove}
           onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
        <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
          {/* edges */}
          {data.edges.map(([a, b], i) => {
            const na = nodeMap[a], nb = nodeMap[b];
            if (!na || !nb) return null;
            const hot = edgeIsHot(a, b);
            const dim = selectedId && !(a === selectedId || b === selectedId);
            return (
              <path key={i} d={edgePath(na, nb)} fill="none"
                    stroke={hot ? "#3F7D5A" : "#B7CDB8"}
                    strokeWidth={hot ? 2.2 : 1.5}
                    opacity={dim ? 0.12 : (hot ? 0.92 : 0.5)}
                    style={{ transition: "all 220ms" }} />
            );
          })}
          {/* nodes */}
          {positioned.map(renderNode)}
        </g>
      </svg>

      {/* Zoom controls */}
      <div style={{
        position: "absolute", right: 16, bottom: 16,
        display: "flex", flexDirection: "column",
        background: "var(--paper-1)", border: "1px solid var(--paper-3)",
        borderRadius: 10, boxShadow: "var(--shadow-sm)", overflow: "hidden",
      }}>
        <div onClick={() => setZoom(z => Math.min(2, z + 0.15))}
             style={{ padding: 10, cursor: "pointer", borderBottom: "1px solid var(--paper-3)", color: "var(--ink-2)" }}>
          <Icon name="zoomIn" size={16} />
        </div>
        <div onClick={() => setZoom(z => Math.max(0.5, z - 0.15))}
             style={{ padding: 10, cursor: "pointer", borderBottom: "1px solid var(--paper-3)", color: "var(--ink-2)" }}>
          <Icon name="zoomOut" size={16} />
        </div>
        <div onClick={() => { setZoom(1); setPan({x:0,y:0}); }}
             title="重新置中"
             style={{ padding: 10, cursor: "pointer", color: "var(--ink-2)", fontSize: 11, fontWeight: 600 }}>
          1:1
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: "absolute", left: 16, bottom: 16,
        display: "flex", flexWrap: "wrap", gap: 14, padding: "10px 14px",
        background: "rgba(250, 247, 240, 0.92)", backdropFilter: "blur(8px)",
        border: "1px solid var(--paper-3)", borderRadius: 10,
        boxShadow: "var(--shadow-sm)", maxWidth: 540,
      }}>
        {[
          { c: "#3F7D5A", l: "已完成",   variant: "filled" },
          { c: "#3F7D5A", l: "進行中",   variant: "pulse" },
          { c: "#3F7D5A", l: "可開始",   variant: "outline" },
          { c: "#EDE7D6", l: "尚未開始", variant: "locked" },
          { c: "#E8A04A", l: "終點目標", variant: "milestone" },
        ].map((it, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-2)" }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              background: it.variant === "outline" ? "var(--paper-1)" : it.c,
              border: it.variant === "outline" ? `2px solid ${it.c}` : "none",
              outline: it.variant === "pulse" ? `1.5px solid ${it.c}` : "none",
              outlineOffset: 2,
              position: "relative",
            }} />
            <span>{it.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

window.GraphView = GraphView;
