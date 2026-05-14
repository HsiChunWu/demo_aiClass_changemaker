// Intake form — collects user's name, role, interests, goal, level, hours/week
// Submits to parent which kicks off n8n call.

const GOAL_OPTIONS = [
  "轉職換跑道",
  "升等準備",
  "補強弱項",
  "拓展新領域",
  "個人興趣",
  "創業 / 副業",
];

const LEVEL_OPTIONS = [
  { value: "beginner",     label: "初學者",   sub: "剛接觸這個領域" },
  { value: "intermediate", label: "有些基礎", sub: "做過幾個小專案" },
  { value: "advanced",     label: "進階",     sub: "工作中持續使用" },
];

const IntakeForm = ({ defaultValues, onSubmit }) => {
  const [name, setName]       = React.useState(defaultValues?.name || "");
  const [role, setRole]       = React.useState(defaultValues?.role || "");
  const [interest, setInterest] = React.useState(defaultValues?.interest || "");
  const [goals, setGoals]     = React.useState(new Set(defaultValues?.goals || []));
  const [level, setLevel]     = React.useState(defaultValues?.level || "intermediate");
  const [hours, setHours]     = React.useState(defaultValues?.hours || 6);
  const [touched, setTouched] = React.useState(false);

  const canSubmit = name.trim().length > 0 && interest.trim().length > 0 && goals.size > 0;

  const toggleGoal = (g) => {
    setGoals(prev => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g); else next.add(g);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    setTouched(true);
    if (!canSubmit) return;
    onSubmit({
      name: name.trim(),
      role: role.trim(),
      interest: interest.trim(),
      goals: [...goals],
      level,
      hours,
    });
  };

  return (
    <div className="screen" style={{
      minHeight: "calc(100vh - 64px)",
      background: "radial-gradient(ellipse at top, #FBF2DF 0%, #FAF7F0 60%)",
      padding: "var(--space-12) var(--space-6) var(--space-16)",
    }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Hero header */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-12)" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px", marginBottom: 20,
            border: "1px solid var(--paper-3)", background: "rgba(250,247,240,0.6)",
            borderRadius: 9999, fontSize: 12, fontWeight: 600,
            color: "var(--moss-600)", letterSpacing: "0.08em",
          }}>
            <span style={{
              display: "inline-block", width: 6, height: 6, borderRadius: "50%",
              background: "var(--moss-500)",
              animation: "pulseDot 1.6s ease-in-out infinite",
            }} />
            AI 學習路徑生成器
          </div>
          <h1 className="t-display" style={{
            margin: 0, fontSize: 52, lineHeight: 1.15,
            textWrap: "balance",
          }}>
            告訴我們你想成為的樣子，<br/>
            <span style={{ color: "var(--moss-600)" }}>我們畫出你的路徑。</span>
          </h1>
          <p className="t-lead" style={{
            marginTop: 20, maxWidth: 540, marginLeft: "auto", marginRight: "auto",
            color: "var(--ink-3)",
          }}>
            填寫幾個問題，我們會為你彙整一張專屬的知識圖譜與課程地圖。
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={handleSubmit} style={{
          background: "var(--paper-1)",
          border: "1px solid var(--paper-3)",
          borderRadius: "var(--radius-xl)",
          padding: "var(--space-10)",
          boxShadow: "var(--shadow-md)",
          display: "flex", flexDirection: "column", gap: "var(--space-8)",
        }}>
          {/* Name + role */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)" }}>
            <div className="field">
              <label className="field-label">姓名 <span style={{ color: "var(--ember-300)" }}>*</span></label>
              <input
                className="field-input"
                placeholder="例如：李宜庭"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={touched && !name.trim() ? { borderColor: "var(--ember-300)" } : null}
              />
            </div>
            <div className="field">
              <label className="field-label">目前職業 / 身份</label>
              <input
                className="field-input"
                placeholder="例如：前端工程師、學生、自由接案"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>

          {/* Interest — the freeform need */}
          <div className="field">
            <label className="field-label">
              你想學什麼？ <span style={{ color: "var(--ember-300)" }}>*</span>
            </label>
            <div className="field-hint">用一兩句話描述。越具體越好——我們會解析成知識點。</div>
            <textarea
              className="field-textarea"
              placeholder="例如：我想從前端轉成全端工程師，主要想補後端與資料庫；半年內希望能獨立完成一個有後台的專案。"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              style={touched && !interest.trim() ? { borderColor: "var(--ember-300)" } : null}
            />
          </div>

          {/* Goals — multi chip */}
          <div className="field">
            <label className="field-label">
              主要目標 <span style={{ color: "var(--ember-300)" }}>*</span>
              <span style={{ fontWeight: 400, color: "var(--ink-3)", marginLeft: 8 }}>
                （可複選）
              </span>
            </label>
            <div className="chip-group">
              {GOAL_OPTIONS.map(g => (
                <div
                  key={g}
                  className={"chip" + (goals.has(g) ? " is-active" : "")}
                  onClick={() => toggleGoal(g)}
                >{g}</div>
              ))}
            </div>
            {touched && goals.size === 0 && (
              <div style={{ fontSize: 13, color: "var(--ember-300)" }}>請至少選一個目標</div>
            )}
          </div>

          {/* Level */}
          <div className="field">
            <label className="field-label">目前程度</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)" }}>
              {LEVEL_OPTIONS.map(opt => {
                const active = level === opt.value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => setLevel(opt.value)}
                    style={{
                      padding: "14px 16px",
                      border: `1px solid ${active ? "var(--moss-500)" : "var(--paper-3)"}`,
                      background: active ? "var(--moss-50)" : "var(--paper-1)",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      transition: "all 220ms var(--ease-out)",
                      boxShadow: active ? "0 0 0 3px rgba(63,125,90,0.12)" : "none",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: "var(--ink-1)", fontSize: 15 }}>{opt.label}</div>
                    <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{opt.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hours slider */}
          <div className="field">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <label className="field-label">每週可投入時間</label>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: "var(--moss-600)" }}>
                {hours} <span style={{ fontSize: 14, color: "var(--ink-3)", fontWeight: 500, fontFamily: "var(--font-body)" }}>小時 / 週</span>
              </div>
            </div>
            <input
              type="range" min={1} max={20} step={1} value={hours}
              onChange={(e) => setHours(+e.target.value)}
              className="slider"
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-4)" }}>
              <span>輕鬆 1h</span><span>標準 6h</span><span>密集 20h</span>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "var(--space-2)" }}>
            <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
              預估產出時間 <strong style={{ color: "var(--ink-1)" }}>約 30 秒</strong>
            </div>
            <Button variant="primary" size="lg" iconRight="arrowRight" onClick={handleSubmit}>
              生成我的學習地圖
            </Button>
          </div>
        </form>

        {/* Footer hint */}
        <div style={{
          textAlign: "center", marginTop: 32, fontSize: 13, color: "var(--ink-3)",
        }}>
          你的資料會傳送至我們的 AI 引擎進行分析，不會儲存於第三方。
        </div>
      </div>
    </div>
  );
};

window.IntakeForm = IntakeForm;
