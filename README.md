# 青聚點 AI 工具實作課程
n8n × Codex，從零打造課程查詢 AI 助理

## 16小時 AI 工具實作課程
本課程為青聚點設計，面向對 AI 工具有興趣但尚無程式背景的新手學員。
課程不從理論出發，而是以「動手做出一個真實可用的系統」為目標，
帶領學員在 16 小時內完成一套課程查詢 AI 助理——
使用者在網頁上輸入問題，系統自動比對向量資料庫並由 AI 整合回覆。

## 課程結構

### 模組一：n8n 基礎與 Google 憑證（4 小時）
從 AI 觀念建立切入，介紹 LLM 與 AI Agent 的差異、Prompt 設計六大規範，
以及用於結構化提問的 PSIO 框架（Purpose / Step / Input / Output）。
接著實際操作 n8n，以 Chat Trigger + AI Agent 節點建立第一個對話工作流，
最後完成 Google Cloud OAuth 憑證申請，串接 Gmail 與 Sheets API。

### 模組二：VSCode + Codex 前端開發（4 小時）
學習如何與 AI 模型協作寫程式：從直接描述需求到使用 PSIO 撰寫完整 prompt，
透過五個漸進式範例（靜態頁面 → 表單驗證 → 互動效果 → 假資料展示 → UI 優化）
建立前端開發的完整流程。最後練習用 AI 清理與整理撰寫成果報告所需的資料。

### 模組三：整合應用（8 小時）
以課程查詢系統為主軸進行端對端整合：
- 向量資料庫概念介紹（Embedding 原理、Qdrant 與其他工具比較）
- 在 n8n 建立 Qdrant 知識庫並設計完整查詢工作流
- 用 Codex 產生前端查詢介面並串接 n8n Webhook
- 功能優化、GitHub Pages 部署上線
- 成果展示與延伸應用討論

## 技術棧

| 工具 | 用途 |
|------|------|
| n8n | 自動化工作流與 AI Agent 編排 |
| VSCode + Codex | AI 輔助前端開發 |
| Google AI Studio API | Embedding 與對話模型 |
| Qdrant | 向量資料庫，語意搜尋課程資料 |
| Google Cloud | Gmail / Sheets API 憑證 |
| GitHub Pages | 前端靜態頁面免費部署 |

## 適合對象

- 無程式開發背景，但想了解 AI 工具實際應用的職場工作者
- 希望能獨立串接 AI 服務、建立自動化流程的初學者
- 對「AI 不只是聊天」有好奇心，想動手驗證想法的學員
