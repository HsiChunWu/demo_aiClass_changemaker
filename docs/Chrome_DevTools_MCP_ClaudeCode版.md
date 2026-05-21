# Chrome DevTools MCP 設定與操作說明：Claude Code VSCode Extension 版

適用課程：第三階段「前端整合、網頁檢查與部署測試」

## 1. 這是什麼？

Chrome DevTools MCP 是 Google Chrome DevTools 團隊提供的 MCP server。設定完成後，VSCode 裡的 Claude Code extension 可以透過它操作真實 Chrome 瀏覽器，協助檢查網頁、除錯與測試互動流程。

它可以協助：

- 開啟本機或線上網頁
- 點擊按鈕、填寫表單
- 檢查 Console 錯誤
- 截圖
- 模擬手機版畫面
- 檢查 Network request
- 執行 Lighthouse 或效能檢查

官方資料：

- Chrome for Developers: <https://developer.chrome.com/docs/devtools/agents>
- Chrome DevTools MCP GitHub: <https://github.com/ChromeDevTools/chrome-devtools-mcp>

## 2. 安裝前需求

請先確認電腦已有：

```text
1. Visual Studio Code
2. Claude Code VSCode extension
3. Node.js LTS
4. npm
5. Google Chrome 穩定版或更新版本
```

確認 Node.js 與 npm：

```bash
node -v
npm -v
```

如果看得到版本號，就代表已安裝。

## 3. 安裝 Node.js 與 npm

如果執行 `node -v` 或 `npm -v` 時出現「找不到指令」，請先安裝 Node.js。npm 會隨 Node.js 一起安裝。

### Windows 安裝方式

建議使用官方安裝檔：

1. 前往 Node.js 官網：<https://nodejs.org/>
2. 下載 `LTS` 版本。
3. 執行安裝檔。
4. 安裝過程中保留預設選項即可。
5. 安裝完成後，重新啟動 VSCode。
6. 在 VSCode Terminal 執行：

```powershell
node -v
npm -v
```

如果能看到版本號，例如 `v20.x.x` 或 `v22.x.x`，代表安裝成功。

### macOS 安裝方式

方式一：使用官方安裝檔。

1. 前往 Node.js 官網：<https://nodejs.org/>
2. 下載 `LTS` 版本。
3. 執行 `.pkg` 安裝檔。
4. 安裝完成後，重新啟動 VSCode。
5. 在 VSCode Terminal 執行：

```bash
node -v
npm -v
```

方式二：如果已安裝 Homebrew，也可以使用：

```bash
brew install node
```

### 常見問題

如果剛安裝完仍然顯示找不到 `node` 或 `npm`：

- 關閉並重新開啟 VSCode。
- 重新開啟 Terminal。
- Windows 可重新開機一次。
- 確認安裝的是 Node.js LTS，而不是只下載壓縮檔。

## 4. 安裝 Claude Code VSCode Extension

1. 開啟 VSCode。
2. 點左側 Extensions。
3. 搜尋 `Claude Code`。
4. 安裝 Anthropic 提供的 Claude Code extension。
5. 依照畫面指示登入或授權。
6. 重新載入 VSCode。

確認方式：

```text
VSCode 側邊欄或 Chat 區域可以看到 Claude Code 對話入口。
```

## 5. 新增 Chrome DevTools MCP

### 方法 A：使用 VSCode 指令加入

在 VSCode 開啟終端機，執行：

```powershell
code --add-mcp '{"""name""":"""chrome-devtools""","""command""":"""npx""","""args""":["""-y""","""chrome-devtools-mcp@latest"""]}'
```

完成後重新啟動 VSCode。

### 方法 B：使用 VSCode MCP 設定檔

如果你的 VSCode 或 Claude Code extension 支援 MCP 設定檔，可以加入以下設定：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

設定完成後，重新啟動 VSCode，讓 Claude Code extension 載入 MCP server。

## 6. 課堂建議設定：隔離模式

課堂操作時，建議使用隔離模式，避免 MCP 操作到個人平常使用的 Chrome profile。

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--isolated",
        "--no-usage-statistics"
      ]
    }
  }
}
```

參數說明：

| 參數 | 說明 |
|---|---|
| `--isolated` | 使用臨時 Chrome profile，降低個人資料外露風險 |
| `--no-usage-statistics` | 關閉使用統計回傳 |

如果使用 `code --add-mcp` 指令，可改成：

```powershell
code --add-mcp '{"""name""":"""chrome-devtools""","""command""":"""npx""","""args""":["""-y""","""chrome-devtools-mcp@latest""","""--isolated""","""--no-usage-statistics"""]}'
```

## 7. 第一次測試

重新啟動 VSCode 後，打開 Claude Code extension 對話區，輸入：

```text
請使用 Chrome DevTools MCP 檢查 https://developers.chrome.com 的效能。
```

成功時，Claude Code 會透過 MCP 啟動 Chrome，打開網站，並進行檢查。

注意：Chrome 不一定會在 VSCode 啟動時立刻打開，通常是等到 Claude Code 真的需要使用瀏覽器工具時才啟動。

## 8. 課程查詢頁測試流程

如果你的網頁在本機伺服器上，例如：

```text
http://localhost:5500/課程查詢.html
```

可以請 Claude Code 執行：

```text
請使用 Chrome DevTools MCP 打開 http://localhost:5500/課程查詢.html。
請確認頁面是否正常載入，並截圖。
```

測試表單：

```text
請測試這個頁面的表單：
1. 在姓名欄位輸入「測試使用者」
2. 在問題欄位輸入「有沒有適合初學者的 AI 課程？」
3. 點擊送出按鈕
4. 檢查是否出現 loading、成功訊息或錯誤訊息
5. 回報操作過程中發現的問題
```

檢查 Console：

```text
請打開這個頁面後，檢查 console 是否有錯誤。
如果有錯誤，請說明錯誤內容、可能原因，以及需要修改哪個檔案。
```

檢查手機版：

```text
請把瀏覽器寬度調整為手機尺寸，例如 390x844。
檢查頁面是否有文字重疊、按鈕超出、表單太窄或區塊間距不合理的問題。
請列出需要修正的地方。
```

執行 Lighthouse：

```text
請對這個頁面執行 Lighthouse audit。
請用初學者能理解的方式整理：
1. Performance 問題
2. Accessibility 問題
3. Best Practices 問題
4. 最優先修正的 3 件事
```

## 9. 常用任務對照表

| 任務 | 可以怎麼請 Claude Code 做 |
|---|---|
| 開網頁 | 請打開指定 URL |
| 截圖 | 請截圖目前畫面 |
| 填表單 | 請輸入姓名、問題並送出 |
| 檢查錯誤 | 請檢查 console 是否有錯誤 |
| 檢查 API | 請查看 network request 是否成功 |
| 檢查手機版 | 請調整成 390x844 並檢查畫面 |
| 檢查效能 | 請執行 Lighthouse audit |

## 10. 進階：連接已開啟的 Chrome

一般學員不需要做這段。這適合老師示範或需要登入狀態的測試。

先用 remote debugging port 啟動 Chrome。

Windows：

```powershell
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-profile-stable"
```

macOS：

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile-stable
```

MCP 設定：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--browser-url=http://127.0.0.1:9222"
      ]
    }
  }
}
```

安全提醒：開啟 remote debugging port 後，本機其他程式可能連到這個 Chrome。不要在這個瀏覽器中登入敏感帳號或處理個資。

## 11. 常見問題

### Q1：Claude Code extension 找不到 MCP 工具

請確認：

- VSCode 已重新啟動
- MCP 設定名稱為 `chrome-devtools`
- `npx` 可以正常執行
- 網路可以下載 `chrome-devtools-mcp@latest`
- Claude Code extension 支援 MCP 並已載入 MCP server

### Q2：第一次啟動很慢

第一次使用 `npx` 會下載套件，可能需要一點時間。課堂建議老師課前先測一次。

### Q3：Chrome 沒有自動打開

這是正常的。Chrome 通常會在 Claude Code 實際執行「開網頁、截圖、檢查效能」等工具時才啟動。

### Q4：可以用在有個資的頁面嗎？

不建議。課堂測試請使用範例資料或去識別化資料。

## 12. 課堂重點

請記住：

```text
Chrome DevTools MCP 讓 VSCode 裡的 Claude Code 真的打開網頁、操作頁面、看錯誤訊息。
它適合用在前端成果檢查與修正。
```
