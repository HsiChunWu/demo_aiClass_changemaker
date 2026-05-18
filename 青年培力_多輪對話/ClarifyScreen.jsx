// ClarifyScreen — chat-style clarification panel.
// Shows the running thread of assistant + user messages, with the latest assistant
// message exposing reason, nearby courses, and suggested replies. User types or
// clicks a suggested reply, then submits.

const ClarifyScreen = ({
  payload,
  messages,           // [{ role, content, reason?, nearbyCourses?, suggestedReplies? }]
  currentAssistant,   // the latest assistant turn — used to render suggestions
  onSubmit,           // (text) => void
  onBackToIntake,     // () => void
  attemptNumber,      // 1-indexed round number
}) => {
  const [draft, setDraft] = React.useState("");
  const scrollRef = React.useRef(null);

  // Scroll the chat to the bottom when messages change
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const handleSubmit = () => {
    const text = draft.trim();
    if (!text) return;
    onSubmit(text);
    setDraft("");
  };

  const handleSuggestedClick = (reply) => {
    // Fill the textarea so the user can edit before sending, or hit enter to send.
    setDraft(prev => prev ? `${prev}\n${reply}` : reply);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="screen" style={{
      minHeight: "calc(100vh - 64px)",
      background: "radial-gradient(ellipse at top, #FBF2DF 0%, #FAF7F0 60%)",
      padding: "var(--space-10) var(--space-6) var(--space-12)",
    }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div className="t-eyebrow" style={{ marginBottom: 10 }}>
            配對進行中 · 第 {attemptNumber} 輪補充
          </div>
          <h1 className="t-h1" style={{
            margin: 0, fontSize: 36, lineHeight: 1.25, textWrap: "balance",
          }}>
            再補充一點，我們就能<br/>
            <span style={{ color: "var(--moss-600)" }}>幫你配得更準</span>
          </h1>
          <p style={{ color: "var(--ink-3)", marginTop: 10, fontSize: 15, lineHeight: 1.7 }}>
            目前資料庫已找到幾個相近方向，但還需要確認你的實際需求。
          </p>
        </div>

        {/* Conversation card */}
        <div style={{
          background: "var(--paper-1)",
          border: "1px solid var(--paper-3)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-md)",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          {/* Original need recap */}
          <div style={{
            padding: "14px 22px",
            background: "var(--paper-2)",
            borderBottom: "1px solid var(--paper-3)",
            fontSize: 13, color: "var(--ink-3)",
            display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          }}>
            <span style={{ fontWeight: 600, color: "var(--ink-2)" }}>原始需求</span>
            <span style={{
              flex: 1, minWidth: 200, fontStyle: "italic",
              color: "var(--ink-2)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              「{payload?.interest || "（未填寫）"}」
            </span>
            <button
              onClick={onBackToIntake}
              style={{
                background: "transparent", border: "none",
                color: "var(--moss-600)", fontWeight: 600, fontSize: 13,
                cursor: "pointer", padding: 0,
              }}
            >
              修改需求 →
            </button>
          </div>

          {/* Conversation thread */}
          <div ref={scrollRef} style={{
            padding: "24px 22px",
            display: "flex", flexDirection: "column", gap: 18,
            maxHeight: 480, overflowY: "auto",
          }}>
            {messages.map((m, i) => (
              <Message
                key={i}
                message={m}
                isLatestAssistant={
                  m.role === "assistant" &&
                  i === messages.length - 1
                }
              />
            ))}
          </div>

          {/* Composer */}
          <div style={{
            borderTop: "1px solid var(--paper-3)",
            background: "var(--paper-2)",
            padding: "16px 22px 20px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            {/* Suggested replies for latest assistant turn */}
            {currentAssistant?.suggestedReplies?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span style={{
                  fontSize: 12, color: "var(--ink-3)",
                  alignSelf: "center", marginRight: 4, fontWeight: 600,
                  letterSpacing: "0.04em",
                }}>
                  快速回覆：
                </span>
                {currentAssistant.suggestedReplies.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedClick(r)}
                    style={{
                      padding: "6px 12px",
                      border: "1px solid var(--moss-200)",
                      background: "var(--paper-1)",
                      color: "var(--moss-700)",
                      borderRadius: 9999,
                      fontSize: 13, fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 220ms var(--ease-out)",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "var(--moss-50)";
                      e.currentTarget.style.borderColor = "var(--moss-400)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = "var(--paper-1)";
                      e.currentTarget.style.borderColor = "var(--moss-200)";
                    }}
                  >+ {r}</button>
                ))}
              </div>
            )}

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="例如：我想用在表單自動化、客戶通知、資料整理…"
              style={{
                minHeight: 72,
                padding: "12px 14px",
                border: "1px solid var(--paper-3)",
                borderRadius: "var(--radius-md)",
                background: "var(--paper-1)",
                color: "var(--ink-1)",
                outline: "none",
                resize: "vertical",
                lineHeight: 1.7,
              }}
            />

            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", gap: 12, flexWrap: "wrap",
            }}>
              <div style={{ fontSize: 12, color: "var(--ink-4)" }}>
                ⌘ + Enter 快速送出
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Button variant="ghost" size="md" onClick={onBackToIntake}>
                  回到上一頁修改需求
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  iconRight="arrowRight"
                  onClick={handleSubmit}
                  disabled={!draft.trim()}
                >
                  送出補充
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div style={{
          textAlign: "center", marginTop: 20,
          fontSize: 13, color: "var(--ink-4)",
        }}>
          如果經過幾輪補充仍無法精準配對，我們會為你建立一份探索式的學習地圖。
        </div>
      </div>
    </div>
  );
};

const Message = ({ message, isLatestAssistant }) => {
  if (message.role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          maxWidth: "76%",
          background: "var(--moss-500)",
          color: "var(--paper-1)",
          padding: "12px 16px",
          borderRadius: "var(--radius-lg) var(--radius-lg) 4px var(--radius-lg)",
          fontSize: 15, lineHeight: 1.65,
          whiteSpace: "pre-wrap",
          boxShadow: "var(--shadow-xs)",
        }}>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "var(--moss-100)",
        border: "1px solid var(--moss-200)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        color: "var(--moss-700)",
      }}>
        <Icon name="sparkle" size={18} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          background: "var(--paper-2)",
          color: "var(--ink-1)",
          padding: "12px 16px",
          borderRadius: "4px var(--radius-lg) var(--radius-lg) var(--radius-lg)",
          fontSize: 15, lineHeight: 1.7,
          border: "1px solid var(--paper-3)",
        }}>
          <div style={{ fontWeight: 600 }}>{message.content}</div>
          {message.reason && (
            <div style={{
              marginTop: 8, fontSize: 13, color: "var(--ink-3)",
              padding: "8px 10px",
              background: "var(--paper-1)",
              borderRadius: 8,
              borderLeft: "3px solid var(--moss-300)",
            }}>
              <span style={{ fontWeight: 600, color: "var(--moss-700)" }}>為什麼問這個：</span>{" "}
              {message.reason}
            </div>
          )}
        </div>

        {/* Nearby courses — only show on latest assistant turn so older turns stay compact */}
        {isLatestAssistant && message.nearbyCourses?.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div className="t-eyebrow" style={{ marginBottom: 8, color: "var(--ink-3)" }}>
              資料庫中相近的方向（{message.nearbyCourses.length}）
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 10,
            }}>
              {message.nearbyCourses.map(c => (
                <NearbyCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const NearbyCard = ({ course }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "var(--paper-1)",
        border: "1px solid var(--paper-3)",
        borderRadius: "var(--radius-md)",
        padding: "12px 14px",
        boxShadow: hover ? "var(--shadow-sm)" : "var(--shadow-xs)",
        transform: hover ? "translateY(-1px)" : "none",
        transition: "all 220ms var(--ease-out)",
      }}
    >
      {course.tag && (
        <div style={{
          display: "inline-block", fontSize: 10, fontWeight: 700,
          color: "var(--moss-700)", background: "var(--moss-50)",
          padding: "2px 8px", borderRadius: 9999,
          letterSpacing: "0.04em", marginBottom: 6,
        }}>
          {course.tag}
        </div>
      )}
      <div style={{
        fontWeight: 700, fontSize: 14, color: "var(--ink-1)",
        lineHeight: 1.4, marginBottom: 4, textWrap: "balance",
      }}>
        {course.title}
      </div>
      <div style={{
        fontSize: 12, color: "var(--ink-3)", lineHeight: 1.6,
      }}>
        {course.summary}
      </div>
    </div>
  );
};

window.ClarifyScreen = ClarifyScreen;
