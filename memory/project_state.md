---
name: 專案狀態
description: 番茄鐘 Electron 專案的已完成工作、技術決策與 skills 安裝狀態
type: project
originSessionId: dde4abb1-da27-4792-8df1-927c268f1b5b
---
## 專案定位

桌面番茄鐘，使用 Electron + 純 HTML/CSS/JS（無前端框架）。GitHub repo: `leon13018/pomodoro-timer`，主要分支 `main`。

## 已完成的工作

- Electron 主程序（`main.js`）+ preload（`preload.js`）+ renderer 三層架構已實作完成
- Precision Dark 主題：背景 `#1C1C28`，工作模式紅 `#ED4F34`，休息模式青 `#00BAB2`
- SVG 圓形進度環（r=88）、60 個刻度線（`initTickMarks()`）、glow 動畫
- Web Audio API 音效（懶初始化，`OscillatorNode` + `linearRampToValueAtTime` 防爆音）
- 系統通知（IPC `show-notification`，`silent: true`）
- 設定面板（`max-height` transition，`.open` class 控制）
- 階段流程：工作 → 短休息 → 工作，每 4 個番茄後進長休息

## Skills 系統狀態

已安裝 8 個 skill：
- **手動放置**（`.claude/skills/`，已 commit）：`frontend-design`、`pptx`、`qiuzhi-creative`、`qiuzhi-skill-creator`、`skill-creator`
- **CLI 安裝**（`.agents/skills/` 真實檔案 + `.claude/skills/` Junction，Junction 已 gitignore）：
  - `ai-image-generation`：`npx skills add inference-sh-skills/skills --skill ai-image-generation`
  - `find-skills`：`npx skills add https://github.com/vercel-labs/skills --skill find-skills`
  - `karpathy-guidelines`：`npx skills add https://github.com/forrestchang/andrej-karpathy-skills --skill karpathy-guidelines`

新機器重建 CLI skills 只需按上述三條指令執行。`skills-lock.json` 也記錄了 hash 供驗證。

## 關鍵技術陷阱（已踩過）

- **Windows Junction + git**：git 會穿透 Junction 追蹤其中的檔案。CLI 安裝的 skill 在 `.claude/skills/` 下是 Junction，必須加入 `.gitignore` **且** 已被 `git rm --cached` 解除追蹤，否則會重複出現在 GitHub 上。
- **skills-lock.json**：CLI 安裝時自動更新，刪除 skill 時需手動移除對應條目。
- **Junction 標記**：VS Code 不顯示 Junction 箭頭圖示，但功能正常（`Get-Item -Force` 可確認 `LinkType: Junction`）。

## 待辦 / 尚未開始

目前無明確待辦。UI 曾使用 `/frontend-design` skill 優化過，核心計時功能完整可用。
