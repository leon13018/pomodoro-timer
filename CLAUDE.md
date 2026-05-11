# CLAUDE.md

## 指令

```powershell
npm start   # 啟動 Electron
```

## 不要做的事

**修改範圍：**
- 不改任務範圍外的程式碼、格式或注釋。
- 不新增沒被要求的功能、抽象或錯誤處理。
- 非你造成的死碼——只提及，不刪除。

**溝通：**
- 有多種實作方式時，列出差異後等確認再動手。
- 任務模糊時，先說出假設，不要靜默地做選擇。

**Electron 安全（不可破壞）：**
- 渲染程序只能透過 preload IPC 存取主程序——不可直接用 Node.js。
- 不設 `nodeIntegration: true` 或 `contextIsolation: false`。

**Git 操作：**
- 不用 `git add .`——Junction 目錄會被穿透追蹤，改用具名 `git add`。
- CLI 安裝的 skill 在 `.claude/skills/` 下是 Junction，加 `.gitignore` 之前若已被 tracked 需先 `git rm --cached`。
- `New-Item -ItemType Junction` 重複執行需加 `-Force`，否則報錯。

**Skills：**
- `skills-lock.json` 只記錄 CLI 安裝（`npx skills add`）的 skill；手動放置的不出現是正常的。
- `npx skills update` 在路徑含空格（如 `LIN HONG`）時靜默失敗（DEP0190 bug）。更新方式：刪除 Junction → `npx skills add` 重裝。

## Skills（10 個）

手動放置（真實目錄，已 commit）：`frontend-design` `pptx` `qiuzhi-creative` `qiuzhi-skill-creator` `skill-creator` `web-design-engineer`

CLI 安裝（`.agents/skills/` 真實檔 + `.claude/skills/` Junction，Junction 已 gitignore）：`ai-image-generation` `axi-front-design` `find-skills` `karpathy-guidelines`
