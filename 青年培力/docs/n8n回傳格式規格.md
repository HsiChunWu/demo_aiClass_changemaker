# 青年培力 — n8n Webhook 回傳格式規格書

> 此文件描述 n8n webhook 應該回傳給前端的 JSON 結構。  
> 前端會以 `POST` 將使用者輸入送至 webhook，n8n 處理完後須以 **JSON** 回傳下述結構。  
> Webhook URL（已內建於前端）：`https://classtest.flyinmoon0217.workers.dev`

---

## 0. 前端送出的 Request Body（n8n 收到的資料）

```json
{
  "name":     "李宜庭",
  "role":     "前端工程師",
  "interest": "我想從前端轉成全端，主要想補後端與資料庫；半年內希望能獨立完成一個有後台的專案。",
  "goals":    ["轉職換跑道", "補強弱項"],
  "level":    "intermediate",
  "hours":    6
}
```

| 欄位       | 型別       | 說明                                                              | 可填入的值（範例）                                                                                       |
|------------|------------|-------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| `name`     | `string`   | 使用者姓名（必填）                                                | 任意字串，如 "李宜庭"、"王小明"                                                                          |
| `role`     | `string`   | 目前職業 / 身份（可空）                                          | "前端工程師"、"學生"、"自由接案"、"產品經理"                                                              |
| `interest` | `string`   | 學習需求（自由輸入，必填）— n8n 應從此欄解析關鍵詞              | 一兩句自然語言描述                                                                                       |
| `goals`    | `string[]` | 主要目標（多選，至少 1 個）                                       | `"轉職換跑道"`、`"升等準備"`、`"補強弱項"`、`"拓展新領域"`、`"個人興趣"`、`"創業 / 副業"`                  |
| `level`    | `string`   | 目前程度（單選）                                                  | `"beginner"`（初學者）、`"intermediate"`（有些基礎）、`"advanced"`（進階）                                |
| `hours`    | `number`   | 每週可投入時數                                                    | 整數，範圍 1–20                                                                                          |

---

## 1. 回傳 JSON 頂層結構

```jsonc
{
  "summary":    { ... },   // 結果頁標題與摘要
  "milestones": [ ... ],   // 右側時間軸里程碑
  "graph":      { "nodes": [...], "edges": [...] },  // 知識圖譜
  "courses":    { "foundation": [...], "core": [...], "advanced": [...] }
}
```

> **包裝相容性**：以下三種外層包裝前端會自動拆開：
> - `{ summary, milestones, graph, courses }`（直接回 object）
> - `{ data: { ... } }`
> - `[{ json: { ... } }]`（n8n 預設輸出格式）

---

## 2. `summary` — 結果頁標題與摘要

```json
{
  "summary": {
    "headline":       "從前端工程師走向資深全端的學習地圖",
    "rationale":      "根據你的目標（轉職為全端工程師）與目前的程度，我們為你挑選了 12 個關鍵知識點與 8 堂核心課程。整體節奏以每週 6 小時計算，預估 14 週可走完核心路徑。",
    "estimatedWeeks": 14,
    "hoursPerWeek":   6,
    "pace":           "穩健"
  }
}
```

| 欄位             | 型別     | 必填 | 說明                                          | 可填入的值                                                                                 |
|------------------|----------|------|-----------------------------------------------|--------------------------------------------------------------------------------------------|
| `headline`       | `string` | ✅   | 結果頁主標（顯示大字）                        | 一句話，建議 ≤ 26 字。可用 `<br/>` 換行（會顯示為空白）                                    |
| `rationale`      | `string` | ✅   | 解釋為何這樣安排（lead paragraph）            | 1–3 句自然語言，建議 ≤ 120 字                                                              |
| `estimatedWeeks` | `number` | ✅   | 預估完成週數                                  | 正整數，建議 4–52                                                                          |
| `hoursPerWeek`   | `number` | ✅   | 每週投入時數（通常等於 request 的 `hours`）   | 正整數，1–40                                                                               |
| `pace`           | `string` | ✅   | 學習節奏的形容詞                              | `"輕鬆"`、`"穩健"`、`"密集"`、`"挑戰"`（或其他 2–4 字的形容詞）                            |

---

## 3. `milestones` — 里程碑時間軸

右側時間軸顯示，建議 3–5 個。

```json
{
  "milestones": [
    { "id": "m1", "week": 3,  "label": "打穩 JS 與型別基礎" },
    { "id": "m2", "week": 7,  "label": "能獨立完成中型 React 專案" },
    { "id": "m3", "week": 11, "label": "掌握後端 API 與資料庫" },
    { "id": "m4", "week": 14, "label": "完成全端作品集專案" }
  ]
}
```

| 欄位    | 型別     | 必填 | 說明                                  | 可填入的值                              |
|---------|----------|------|---------------------------------------|-----------------------------------------|
| `id`    | `string` | ✅   | 唯一識別碼                            | 任意字串，如 `"m1"`、`"milestone-1"`     |
| `week`  | `number` | ✅   | 第幾週可達成                          | 正整數，需 ≤ `summary.estimatedWeeks`   |
| `label` | `string` | ✅   | 里程碑文字描述                        | 建議 ≤ 18 字                            |

---

## 4. `graph` — 知識圖譜

### 4.1 `graph.nodes` — 知識點

```json
{
  "id":     "ts",
  "col":    0,
  "row":    1,
  "cat":    "tech",
  "label":  "TypeScript 入門",
  "status": "current",
  "hours":  10,
  "why":    "全端職位幾乎都要求 TS，先打好型別觀念"
}
```

| 欄位     | 型別     | 必填 | 說明                                                                                  | 可填入的值                                                                                                                              |
|----------|----------|------|---------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `id`     | `string` | ✅   | 唯一識別碼（會被 `edges` 與 `courses[].node` 參照）                                   | 英數小寫加 `-`，如 `"js-core"`、`"react-deep"`                                                                                          |
| `col`    | `number` | ✅   | 圖譜橫向位置（學習階段，0 為起點）                                                    | 整數 0–4（建議最多 5 個 column；超過會跑出畫面）                                                                                        |
| `row`    | `number` | ✅   | 圖譜縱向位置（同 col 內的排序）                                                       | 整數 0–3（建議每 col 最多 3–4 個節點）                                                                                                  |
| `cat`    | `string` | ✅   | 類別（決定節點顏色與圖例分類）                                                        | `"tech"`（綠 · 技術）、`"career"`（橘 · 職涯）、`"tools"`（藍 · 工具）、`"data"`（紫 · 資料）、`"milestone"`（金 · 終點目標，僅用於 1 個節點） |
| `label`  | `string` | ✅   | 節點上顯示的名稱                                                                      | 建議 ≤ 8 字（中文）                                                                                                                     |
| `status` | `string` | ✅   | 節點狀態（決定外觀：勾、脈衝、空心、鎖、星）                                          | `"done"`（已完成 · 實心+勾）、`"current"`（進行中 · 實心+脈衝）、`"available"`（可開始 · 空心）、`"locked"`（尚未開始 · 灰底+鎖）、`"milestone"`（終點 · 實心+星，僅用於 cat=milestone 的節點） |
| `hours`  | `number` | ❌   | 預計學習時數（hover 或選中時顯示）                                                    | 正整數，建議 2–30                                                                                                                       |
| `why`    | `string` | ❌   | 為什麼推薦使用者學這個（點選節點時詳細抽屜會顯示）                                    | 1–2 句自然語言，建議 ≤ 60 字                                                                                                            |

#### `cat` 的視覺對照

| 值           | 顏色（hex）  | 中文標籤   | 用途                                       |
|--------------|--------------|------------|--------------------------------------------|
| `tech`       | `#3F7D5A`    | 技術       | 程式語言、框架、技術主題                   |
| `career`     | `#E8A04A`    | 職涯       | 軟技能、職涯發展、溝通                     |
| `tools`      | `#4A7A99`    | 工具       | Git、CI/CD、部署、開發工具                 |
| `data`       | `#8B5A8C`    | 資料       | SQL、資料庫、數據分析、ML                  |
| `milestone`  | `#E8A04A`    | 里程碑     | 終點目標（建議整張圖只有 1 個 milestone）  |

#### `status` 的視覺對照

| 值           | 外觀                                          | 使用情境                              |
|--------------|-----------------------------------------------|---------------------------------------|
| `done`       | 實心圓 + 白勾                                 | 使用者已掌握的能力                    |
| `current`    | 實心圓 + 外圍脈衝動畫                         | 目前正在學或下一步要學的（建議 1–2 個）|
| `available`  | 空心圓 + 彩色邊                               | 可以開始學的節點                      |
| `locked`     | 灰底 + 鎖頭圖示                               | 尚未解鎖的節點                        |
| `milestone`  | 實心圓 + 星 + 外圈虛線轉動動畫                | 終點目標（搭配 `cat: "milestone"`）   |

### 4.2 `graph.edges` — 知識點連線

```json
{
  "edges": [
    ["js-core", "ts"],
    ["ts", "react-deep"],
    ["react-deep", "state"]
  ]
}
```

| 元素      | 型別                 | 說明                                          |
|-----------|----------------------|-----------------------------------------------|
| `edges[]` | `[string, string][]` | 二元陣列，元素是 `[from_id, to_id]` 的 pair |

- 兩個 `id` 必須在 `nodes[]` 中存在
- 視覺上會被繪製為由左到右的曲線（建議 `from.col < to.col`）
- 選中某節點時，連到該節點的線會被高亮
- 沒有方向性的視覺差異，但 from→to 的順序會影響曲線方向

---

## 5. `courses` — 三層課程地圖

分為三個層級欄位，每個欄位是課程陣列：

```json
{
  "courses": {
    "foundation": [ /* 基礎課程 */ ],
    "core":       [ /* 核心課程 */ ],
    "advanced":   [ /* 進階課程 */ ]
  }
}
```

| 欄位         | 中文標題 | 副標            | 建議課程數 |
|--------------|----------|-----------------|------------|
| `foundation` | 基礎     | 打好底，輕鬆上手 | 1–3        |
| `core`       | 核心     | 你的學習主軸     | 2–5        |
| `advanced`   | 進階     | 邁向終點目標     | 1–4        |

### 5.1 課程物件

```json
{
  "id":       "c-react",
  "title":    "React 進階：Hooks 與效能",
  "provider": "青聚點原創",
  "hours":    12,
  "level":    "進階",
  "node":     "react-deep",
  "tags":     ["前端", "Hooks"],
  "featured": true
}
```

| 欄位       | 型別       | 必填 | 說明                                                                                  | 可填入的值                                                                                |
|------------|------------|------|---------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| `id`       | `string`   | ✅   | 唯一識別碼                                                                            | 英數小寫加 `-`，如 `"c-react"`                                                            |
| `title`    | `string`   | ✅   | 課程名稱                                                                              | 建議 ≤ 20 字                                                                              |
| `provider` | `string`   | ✅   | 提供方                                                                                | `"青聚點原創"`、`"外部夥伴"` 或其他平台名稱                                               |
| `hours`    | `number`   | ✅   | 課程總時數                                                                            | 正整數，建議 2–30                                                                         |
| `level`    | `string`   | ✅   | 課程難度標籤                                                                          | `"初階"`、`"進階"`、`"高階"`（或其他 2–4 字描述）                                         |
| `node`     | `string`   | ✅   | 對應的 `graph.nodes[].id`（點課片會選中對應節點）                                     | 須為 `graph.nodes[]` 中存在的 `id`                                                        |
| `tags`     | `string[]` | ❌   | 小標籤（顯示在課程卡片下方）                                                          | 0–4 個短字串，每個建議 ≤ 6 字                                                             |
| `featured` | `boolean`  | ❌   | 是否為推薦課程（會顯示 ★ 推薦徽章）                                                   | `true` / `false`（預設 `false`）                                                          |

---

## 6. 完整回傳範例

```json
{
  "summary": {
    "headline": "從前端工程師走向資深全端的學習地圖",
    "rationale": "根據你的目標（轉職為全端工程師）與目前的程度，我們為你挑選了 12 個關鍵知識點與 8 堂核心課程。整體節奏以每週 6 小時計算，預估 14 週可走完核心路徑。",
    "estimatedWeeks": 14,
    "hoursPerWeek": 6,
    "pace": "穩健"
  },
  "milestones": [
    { "id": "m1", "week": 3,  "label": "打穩 JS 與型別基礎" },
    { "id": "m2", "week": 7,  "label": "能獨立完成中型 React 專案" },
    { "id": "m3", "week": 11, "label": "掌握後端 API 與資料庫" },
    { "id": "m4", "week": 14, "label": "完成全端作品集專案" }
  ],
  "graph": {
    "nodes": [
      { "id": "js-core",    "col": 0, "row": 0, "cat": "tech",      "label": "JavaScript 核心", "status": "done",      "hours": 8,  "why": "你已具備基本語法，補強 ES2022 特性與非同步處理" },
      { "id": "ts",         "col": 0, "row": 1, "cat": "tech",      "label": "TypeScript 入門", "status": "current",   "hours": 10, "why": "全端職位幾乎都要求 TS，先打好型別觀念" },
      { "id": "git",        "col": 0, "row": 2, "cat": "tools",     "label": "Git 協作",        "status": "done",      "hours": 4,  "why": "你已熟悉，僅補強 rebase 與 PR 流程" },
      { "id": "react-deep", "col": 1, "row": 0, "cat": "tech",      "label": "React 進階",      "status": "available", "hours": 12, "why": "深入理解 hooks、context、效能優化" },
      { "id": "state",      "col": 1, "row": 1, "cat": "tech",      "label": "狀態管理",        "status": "available", "hours": 8,  "why": "Zustand / Redux Toolkit 的取捨" },
      { "id": "testing",    "col": 1, "row": 2, "cat": "career",    "label": "前端測試",        "status": "available", "hours": 8,  "why": "可測試的程式是資深工程師的標誌" },
      { "id": "node",       "col": 2, "row": 0, "cat": "tech",      "label": "Node.js 後端",    "status": "locked",    "hours": 14, "why": "你現有的 JS 知識可以直接遷移到後端" },
      { "id": "api",        "col": 2, "row": 1, "cat": "tech",      "label": "REST 與 GraphQL", "status": "locked",    "hours": 10, "why": "理解 API 設計勝過記憶語法" },
      { "id": "db",         "col": 2, "row": 2, "cat": "data",      "label": "資料庫設計",      "status": "locked",    "hours": 12, "why": "Postgres + ORM 是業界主流組合" },
      { "id": "auth",       "col": 3, "row": 0, "cat": "tech",      "label": "驗證與權限",      "status": "locked",    "hours": 8,  "why": "JWT、Session、OAuth 的場景判斷" },
      { "id": "deploy",     "col": 3, "row": 1, "cat": "tools",     "label": "部署與 CI/CD",    "status": "locked",    "hours": 8,  "why": "從 Vercel 到 Docker 的選擇邏輯" },
      { "id": "fullstack",  "col": 4, "row": 1, "cat": "milestone", "label": "全端作品集",      "status": "milestone", "hours": 20, "why": "整合所學，做出一個能談薪資的作品" }
    ],
    "edges": [
      ["js-core", "ts"], ["js-core", "react-deep"], ["ts", "react-deep"],
      ["react-deep", "state"], ["react-deep", "testing"], ["git", "testing"],
      ["ts", "node"], ["state", "node"], ["testing", "api"],
      ["node", "api"], ["node", "db"], ["api", "db"],
      ["api", "auth"], ["db", "auth"], ["node", "deploy"], ["auth", "deploy"],
      ["deploy", "fullstack"], ["auth", "fullstack"], ["db", "fullstack"]
    ]
  },
  "courses": {
    "foundation": [
      { "id": "c-ts",  "title": "TypeScript 30 天養成", "provider": "青聚點原創", "hours": 10, "level": "初階", "node": "ts",  "tags": ["型別", "TS"], "featured": true },
      { "id": "c-git", "title": "Git 協作流程實戰",     "provider": "外部夥伴",   "hours": 4,  "level": "初階", "node": "git", "tags": ["工具", "團隊"] }
    ],
    "core": [
      { "id": "c-react", "title": "React 進階：Hooks 與效能", "provider": "青聚點原創", "hours": 12, "level": "進階", "node": "react-deep", "tags": ["前端", "Hooks"], "featured": true },
      { "id": "c-node",  "title": "Node.js 後端開發實戰",     "provider": "青聚點原創", "hours": 14, "level": "進階", "node": "node",       "tags": ["後端"],          "featured": true },
      { "id": "c-api",   "title": "API 設計與 GraphQL",       "provider": "外部夥伴",   "hours": 10, "level": "進階", "node": "api",        "tags": ["API"] },
      { "id": "c-db",    "title": "PostgreSQL 與 Prisma",     "provider": "外部夥伴",   "hours": 12, "level": "進階", "node": "db",         "tags": ["資料庫"] }
    ],
    "advanced": [
      { "id": "c-auth",     "title": "驗證與權限設計",      "provider": "青聚點原創", "hours": 8,  "level": "高階", "node": "auth",      "tags": ["安全"] },
      { "id": "c-deploy",   "title": "CI/CD 與生產部署",    "provider": "外部夥伴",   "hours": 8,  "level": "高階", "node": "deploy",    "tags": ["DevOps"] },
      { "id": "c-capstone", "title": "全端作品集 Capstone", "provider": "青聚點原創", "hours": 20, "level": "高階", "node": "fullstack", "tags": ["專案"], "featured": true }
    ]
  }
}
```

---

## 7. 驗證與容錯

前端在收到回應後會做以下檢查（在 `app.jsx` 的 `normalize()`）：

1. 解開常見的 n8n 包裝（`[{json}]` / `{data}` / `{json}`）
2. 確認頂層含有 `summary`、`graph`、`courses` 三個 key
3. 若任一缺失 → 視為格式不符，**自動 fallback 使用內建示範資料**並在 Loading 畫面顯示警示
4. 若 webhook 5xx / timeout（45 秒）/ 網路錯誤 → 同樣 fallback

> 建議：n8n 流程結束時，無論成功與否，都回傳合法的 JSON；錯誤資訊可以加在 `summary.rationale` 中，仍可正常顯示。

---

## 8. 設計建議

| 主題           | 建議                                                                                              |
|----------------|---------------------------------------------------------------------------------------------------|
| 節點數量       | 8–15 個之間最舒適；超過 18 個會擁擠                                                              |
| `col` 範圍     | 最多 5 個階段（0–4）                                                                              |
| 同 `col` 節點  | 不超過 3 個（最多 4 個）                                                                          |
| `milestone`    | 整張圖只有 **1 個**，放在最右側（最大的 `col`）                                                  |
| `current` 節點 | 建議 1–2 個，幫使用者聚焦下一步                                                                  |
| `done` 節點    | 根據使用者已有的能力標記，讓他有「已經走了一半」的成就感                                          |
| 課程數量       | 三層加總 6–10 堂最舒適                                                                            |
| `featured`     | 每層 1 堂課標 `featured: true` 即可，太多反而失去重點                                            |
| 中文長度       | `label` 短、`why` 詳細；節點 label 過長會疊到下一個節點                                          |

---

**文件版本**：v1 · 2026-05-14  
**對應前端版本**：青聚點 學習地圖 (standalone)
