# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用指令

```powershell
npm start        # 啟動 Electron 應用程式
```

目前未設定任何建置步驟、Linter 或測試套件。

## 架構說明

這是一個單視窗 Electron 應用程式，採用標準三層結構：

- **`main.js`** — 主程序。建立固定尺寸（400×580）且啟用 sandbox 的 `BrowserWindow`（`backgroundColor: '#1C1C28'`、`nativeTheme.themeSource = 'dark'`）。處理兩個 IPC 頻道：`show-notification`（`Notification` API，`silent: true`）與 `toggle-always-on-top`。
- **`preload.js`** — 橋接層。透過 `contextBridge` 將 `window.electronAPI.showNotification()` 和 `window.electronAPI.toggleAlwaysOnTop()` 暴露給渲染程序。
- **`renderer/`** — 渲染程序（無法存取 Node.js）。
  - `index.html` — UI 結構，含 CSP（`script-src 'self'`、`media-src 'none'`）。
  - `styles.css` — Precision Dark 主題，以 CSS 自訂屬性實作。工作模式使用 `--accent-work`（`#ED4F34`）；body 加上 `break-mode` class 時切換為 `--accent-break`（`#00BAB2`）。
  - `renderer.js` — 所有計時邏輯、音效與 UI 更新，無框架。

## renderer.js 重點細節

- **音效**：`AudioContext` 首次點擊時才初始化（懶初始化），符合 Chromium autoplay 政策。音調透過 `OscillatorNode` + `GainNode` 合成，`linearRampToValueAtTime` 淡入淡出防爆音。
- **SVG 進度環**：半徑 `r=88`，`CIRCUMFERENCE = 2π×88 ≈ 552.92`，進度由 `stroke-dashoffset` 驅動。`initTickMarks()` 在初始化時動態生成 60 個 `<line>` 刻度（每 5 格為 major tick）。計時進行中，`el.progressRing` 加上 `running` class 觸發 glow 動畫。
- **狀態管理**：以單一可變的 `STATE` 物件管理（`phase`、`secondsLeft`、`totalSeconds`、`isRunning`、`completedPomodoros`、`intervalId`）。`CONFIG` 儲存各階段時長，可在執行時透過設定面板修改。
- **階段流程**：工作 → 短休息（每完成 4 個番茄後進入長休息）→ 工作。`enterPhase()` 是所有階段切換的唯一入口，負責更新 `el.phaseLabel` 與 `break-mode` class。
- **設定面板**：`max-height: 0 → 300px` transition 實作展開動畫（非 `hidden` 屬性），toggle 透過 `.open` class 控制。

## Skills 系統

`.claude/skills/` 目錄存放 Claude Code Skills。`skills-lock.json` 記錄 CLI 安裝的 skill 來源與 hash。

已安裝 skills（共 8 個）：
- **手動放置**（真實目錄，已 commit 至 `.claude/skills/`）：`frontend-design`、`pptx`、`qiuzhi-creative`、`qiuzhi-skill-creator`、`skill-creator`
- **CLI 安裝**（`.agents/skills/` 真實檔案 + `.claude/skills/` Junction，Junction 已列入 `.gitignore`）：`ai-image-generation`、`find-skills`、`karpathy-guidelines`
