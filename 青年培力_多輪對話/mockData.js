// Mock fallback data — used when no webhook is reachable or response shape doesn't validate.
// Plus mock CLARIFY responses for the matching/clarify flow demo.

window.MOCK_RESULT = {
  summary: {
    name: "你",
    headline: "從前端工程師走向資深全端的學習地圖",
    rationale: "根據你的目標（轉職為全端工程師）與目前的程度（已有 React 基礎），我們為你挑選了 12 個關鍵知識點與 8 堂核心課程。整體節奏以每週 6 小時計算，預估 14 週可走完核心路徑。",
    estimatedWeeks: 14,
    hoursPerWeek: 6,
    pace: "穩健",
  },
  milestones: [
    { id: "m1", week: 3,  label: "打穩 JS 與型別基礎", reached: false },
    { id: "m2", week: 7,  label: "能獨立完成中型 React 專案", reached: false },
    { id: "m3", week: 11, label: "掌握後端 API 與資料庫", reached: false },
    { id: "m4", week: 14, label: "完成全端作品集專案",   reached: false },
  ],
  graph: {
    nodes: [
      { id: "js-core",       col: 0, row: 0, cat: "tech",   label: "JavaScript 核心",    status: "done",      hours: 8,  why: "你已具備基本語法，補強 ES2022 特性與非同步處理" },
      { id: "ts",            col: 0, row: 1, cat: "tech",   label: "TypeScript 入門",    status: "current",   hours: 10, why: "全端職位幾乎都要求 TS，先打好型別觀念" },
      { id: "git",           col: 0, row: 2, cat: "tools",  label: "Git 協作",           status: "done",      hours: 4,  why: "你已熟悉，僅補強 rebase 與 PR 流程" },
      { id: "react-deep",    col: 1, row: 0, cat: "tech",   label: "React 進階",         status: "available", hours: 12, why: "深入理解 hooks、context、效能優化" },
      { id: "state",         col: 1, row: 1, cat: "tech",   label: "狀態管理",            status: "available", hours: 8,  why: "Zustand / Redux Toolkit 的取捨" },
      { id: "testing",       col: 1, row: 2, cat: "career", label: "前端測試",            status: "available", hours: 8,  why: "可測試的程式是資深工程師的標誌" },
      { id: "node",          col: 2, row: 0, cat: "tech",   label: "Node.js 後端",       status: "locked",    hours: 14, why: "你現有的 JS 知識可以直接遷移到後端" },
      { id: "api",           col: 2, row: 1, cat: "tech",   label: "REST 與 GraphQL",    status: "locked",    hours: 10, why: "理解 API 設計勝過記憶語法" },
      { id: "db",            col: 2, row: 2, cat: "data",   label: "資料庫設計",          status: "locked",    hours: 12, why: "Postgres + ORM 是業界主流組合" },
      { id: "auth",          col: 3, row: 0, cat: "tech",   label: "驗證與權限",          status: "locked",    hours: 8,  why: "JWT、Session、OAuth 的場景判斷" },
      { id: "deploy",        col: 3, row: 1, cat: "tools",  label: "部署與 CI/CD",       status: "locked",    hours: 8,  why: "從 Vercel 到 Docker 的選擇邏輯" },
      { id: "fullstack",     col: 4, row: 1, cat: "milestone", label: "全端作品集",       status: "milestone", hours: 20, why: "整合所學，做出一個能談薪資的作品" },
    ],
    edges: [
      ["js-core", "ts"], ["js-core", "react-deep"], ["ts", "react-deep"],
      ["react-deep", "state"], ["react-deep", "testing"], ["git", "testing"],
      ["ts", "node"], ["state", "node"], ["testing", "api"],
      ["node", "api"], ["node", "db"], ["api", "db"],
      ["api", "auth"], ["db", "auth"], ["node", "deploy"], ["auth", "deploy"],
      ["deploy", "fullstack"], ["auth", "fullstack"], ["db", "fullstack"],
    ],
  },
  courses: {
    foundation: [
      { id: "c-ts",   title: "TypeScript 30 天養成", provider: "青聚點原創", hours: 10, level: "初階", node: "ts",         tags: ["型別", "TS"], featured: true },
      { id: "c-git",  title: "Git 協作流程實戰",     provider: "外部夥伴",   hours: 4,  level: "初階", node: "git",        tags: ["工具", "團隊"] },
    ],
    core: [
      { id: "c-react",  title: "React 進階：Hooks 與效能", provider: "青聚點原創", hours: 12, level: "進階", node: "react-deep", tags: ["前端", "Hooks"], featured: true },
      { id: "c-node",   title: "Node.js 後端開發實戰",     provider: "青聚點原創", hours: 14, level: "進階", node: "node",       tags: ["後端"], featured: true },
      { id: "c-api",    title: "API 設計與 GraphQL",       provider: "外部夥伴",   hours: 10, level: "進階", node: "api",        tags: ["API", "GraphQL"] },
      { id: "c-db",     title: "PostgreSQL 與 Prisma",     provider: "外部夥伴",   hours: 12, level: "進階", node: "db",         tags: ["資料庫"] },
    ],
    advanced: [
      { id: "c-auth",    title: "驗證與權限設計",       provider: "青聚點原創", hours: 8,  level: "高階", node: "auth",      tags: ["安全"] },
      { id: "c-deploy",  title: "CI/CD 與生產部署",     provider: "外部夥伴",   hours: 8,  level: "高階", node: "deploy",    tags: ["DevOps"] },
      { id: "c-capstone",title: "全端作品集 Capstone",  provider: "青聚點原創", hours: 20, level: "高階", node: "fullstack", tags: ["專案", "作品集"], featured: true },
    ],
  },
};

// Mock clarification turns — used as a fallback when webhook fails.
// Round 1: asks about scenario. Round 2: asks about output preference.
// After round 2 → matched (returns MOCK_RESULT).
window.MOCK_CLARIFICATIONS = [
  {
    status: "needs_clarification",
    reason: "目前還無法判斷你偏向流程自動化、AI API 串接或提示設計，這三類在資料庫中對應的學習路徑不太一樣。",
    question: "你比較想把所學用在哪一種工作情境？",
    suggestedReplies: [
      "自動整理表單資料",
      "串接 ChatGPT API",
      "協助生成文案與企劃",
    ],
    nearbyCourses: [
      { id: "c-n8n-basic",    title: "n8n 自動化流程入門", summary: "適合想串接表單、通知、試算表的人。", tag: "流程自動化" },
      { id: "c-api-integ",    title: "AI API 串接實戰",    summary: "適合會點程式、想串 OpenAI 等 API 的人。", tag: "API" },
      { id: "c-prompt-basic", title: "提示設計基礎",        summary: "適合想改善內容產出、企劃與文件生成的人。", tag: "提示設計" },
    ],
  },
  {
    status: "needs_clarification",
    reason: "你提到要做自動化，但還想確認你比較在意「快速看到結果」還是「能客製到細節」，兩種會推薦不同工具組合。",
    question: "你希望優先用哪種風格的工具？",
    suggestedReplies: [
      "視覺化拖拉，越快上手越好",
      "願意寫一點程式換更多彈性",
      "兩者都可以，看實用度",
    ],
    nearbyCourses: [
      { id: "c-make",     title: "Make / Zapier 速通包", summary: "完全不寫程式，30 分鐘做出第一條自動化。", tag: "拖拉式" },
      { id: "c-n8n-pro",  title: "n8n 進階自訂節點",      summary: "可以寫一點 JS，換到接近無限的彈性。",     tag: "可程式化" },
    ],
  },
];

window.CAT_COLOR_RESULT = {
  tech:      "#3F7D5A",  // moss
  career:    "#E8A04A",  // sun
  tools:     "#4A7A99",  // sky
  data:      "#8B5A8C",  // berry
  milestone: "#E8A04A",
};
window.CAT_LABEL = {
  tech: "技術", career: "職涯", tools: "工具", data: "資料", milestone: "里程碑",
};
window.STATUS_LABEL = {
  done: "已完成", current: "進行中", progress: "進行中", available: "可開始", locked: "尚未開始", milestone: "終點目標",
};
