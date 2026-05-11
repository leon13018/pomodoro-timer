---
name: 專案狀態
description: 番茄鐘 Electron 專案的已完成工作、技術決策、skills 與 memory 架構
type: project
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
- **CLI 安裝**（`.agents/skills/` 真實檔案 + `.claude/skills/` Junction，Junction 已 gitignore）：`ai-image-generation`、`find-skills`、`karpathy-guidelines`

## Auto-Memory 架構

`memory/` 資料夾已 commit 至 repo 根目錄。`~/.claude/projects/.../memory/` 是指向此處的 Junction。Claude Code 讀寫 auto-memory 時會自動落到 repo 裡，`git push` 即同步。

新機器 clone 後需手動建立 Junction，執行以下指令（在專案目錄下）：

**Memory Junction**
```powershell
$repoPath = (Get-Location).Path
$encoded = $repoPath -replace ':', '-' -replace '\\', '-' -replace ' ', '-'
$target = "$env:USERPROFILE\.claude\projects\$encoded"
New-Item -ItemType Directory -Path $target -Force
New-Item -ItemType Junction -Path "$target\memory" -Target "$repoPath\memory"
```

**CLI Skills Junction**
```powershell
$base = (Get-Location).Path
New-Item -ItemType Junction -Path "$base\.claude\skills\ai-image-generation" -Target "$base\.agents\skills\ai-image-generation"
New-Item -ItemType Junction -Path "$base\.claude\skills\find-skills" -Target "$base\.agents\skills\find-skills"
New-Item -ItemType Junction -Path "$base\.claude\skills\karpathy-guidelines" -Target "$base\.agents\skills\karpathy-guidelines"
```

## 關鍵技術陷阱（已踩過）

- **Windows Junction + git**：git 會穿透 Junction 追蹤其中的檔案。CLI 安裝的 skill 在 `.claude/skills/` 下是 Junction，必須加入 `.gitignore` 且已被 `git rm --cached` 解除追蹤，否則會重複出現在 GitHub 上。
- **skills-lock.json**：CLI 安裝時自動更新，刪除 skill 時需手動移除對應條目。
- **Junction 無箭頭圖示**：VS Code 不顯示 Junction 標記，但功能正常（`Get-Item -Force` 可確認 `LinkType: Junction`）。

## 待辦 / 尚未開始

目前無明確待辦。UI 曾使用 `/frontend-design` skill 優化過，核心計時功能完整可用。
