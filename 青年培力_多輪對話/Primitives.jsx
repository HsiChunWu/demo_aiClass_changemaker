// Shared primitives for 青聚點 UI Kit
// Export to window so other Babel scripts can read them.

const Icon = ({ name, size = 18, color = "currentColor", strokeWidth = 1.75 }) => {
  const paths = {
    map: <><path d="M9 6 3 4v14l6 2 6-2 6 2V6l-6-2z" /><path d="M9 6v14" /><path d="M15 4v14" /></>,
    book: <><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></>,
    user: <><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></>,
    users: <><circle cx="9" cy="8" r="4" /><path d="M3 21a6 6 0 0 1 12 0" /><circle cx="17" cy="9" r="3" /><path d="M22 20a5 5 0 0 0-5-5" /></>,
    star: <><polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" /></>,
    search: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    chevronRight: <><polyline points="9 18 15 12 9 6" /></>,
    chevronLeft: <><polyline points="15 18 9 12 15 6" /></>,
    chevronDown: <><polyline points="6 9 12 15 18 9" /></>,
    check: <><polyline points="5 12 10 17 19 7" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    close: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    play: <><polygon points="6 4 20 12 6 20" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    bookmark: <><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></>,
    sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8" /></>,
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></>,
    zoomIn: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></>,
    zoomOut: <><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

const Button = ({ variant = "primary", size = "md", children, icon, iconRight, onClick, disabled, style }) => {
  const variants = {
    primary:   { bg: "var(--moss-500)", color: "var(--paper-1)", border: "transparent", hoverBg: "var(--moss-600)" },
    secondary: { bg: "var(--paper-1)",  color: "var(--ink-1)",   border: "var(--paper-4)", hoverBg: "var(--paper-2)" },
    ghost:     { bg: "transparent",     color: "var(--moss-600)",border: "transparent", hoverBg: "var(--moss-50)" },
    dark:      { bg: "var(--ink-1)",    color: "var(--paper-1)", border: "transparent", hoverBg: "var(--ink-2)" },
  };
  const sizes = {
    sm: { padding: "6px 12px", fontSize: 13, radius: 8 },
    md: { padding: "10px 18px", fontSize: 14, radius: 10 },
    lg: { padding: "14px 24px", fontSize: 16, radius: 12 },
  };
  const v = variants[variant], s = sizes[size];
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: s.fontSize, padding: s.padding,
        borderRadius: s.radius, border: `1px solid ${v.border}`,
        background: hover && !disabled ? v.hoverBg : v.bg, color: v.color,
        opacity: disabled ? 0.5 : 1, transition: "all 220ms var(--ease-out)", lineHeight: 1,
        whiteSpace: "nowrap", ...style,
      }}>
      {icon && <Icon name={icon} size={s.fontSize + 2} />}
      <span style={{ whiteSpace: "nowrap" }}>{children}</span>
      {iconRight && <Icon name={iconRight} size={s.fontSize + 2} />}
    </button>
  );
};

const Badge = ({ children, tone = "neutral", style }) => {
  const tones = {
    moss:    { bg: "#D9E4DA", color: "#2A5A40" },
    sun:     { bg: "#F6E2B6", color: "#A66820" },
    sky:     { bg: "#BCD0DB", color: "#2C5470" },
    berry:   { bg: "#D4BCD5", color: "#5E3A60" },
    ember:   { bg: "#F4C9B9", color: "#8A3A24" },
    neutral: { bg: "#F2EEE4", color: "#3A4137" },
    dark:    { bg: "#1B1F1A", color: "#FAF7F0" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px",
      borderRadius: 9999, fontSize: 12, fontWeight: 600, lineHeight: 1.4,
      background: t.bg, color: t.color, whiteSpace: "nowrap", ...style,
    }}>{children}</span>
  );
};

const Avatar = ({ name, size = 36, color = "#3F7D5A", textColor = "#FAF7F0" }) => {
  const initial = name ? name.slice(0, 1) : "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: color, color: textColor,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.4, flexShrink: 0,
    }}>{initial}</div>
  );
};

const Card = ({ children, style, hover = true, onClick }) => {
  const [h, setH] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setH(true)}
      onMouseLeave={() => hover && setH(false)}
      style={{
        background: "var(--paper-1)", border: "1px solid var(--paper-3)",
        borderRadius: 14, padding: 20,
        boxShadow: h ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: h ? "translateY(-2px)" : "none",
        transition: "all 220ms var(--ease-out)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>
      {children}
    </div>
  );
};

const ProgressBar = ({ value, max = 100, color = "var(--moss-500)", height = 6 }) => (
  <div style={{ height, background: "var(--paper-3)", borderRadius: 9999, overflow: "hidden" }}>
    <div style={{
      height: "100%", width: `${(value / max) * 100}%`, background: color,
      borderRadius: 9999, transition: "width 360ms var(--ease-out)",
    }} />
  </div>
);

const ProgressRing = ({ value, max = 100, size = 56, stroke = 4, color = "var(--moss-500)" }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / max);
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--paper-3)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
              strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset}
              transform={`rotate(-90 ${size/2} ${size/2})`}
              style={{ transition: "stroke-dashoffset 360ms var(--ease-out)" }} />
    </svg>
  );
};

Object.assign(window, { Icon, Button, Badge, Avatar, Card, ProgressBar, ProgressRing });
