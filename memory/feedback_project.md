---
name: 專案回饋
description: 針對番茄鐘專案的操作偏好與回饋
type: feedback
originSessionId: dde4abb1-da27-4792-8df1-927c268f1b5b
---
不要用符號取代文字描述，例如 statusline 的 git 狀態。

回覆語言使用繁體中文。

執行 git commit 時必須呼叫 `/git-commit` skill。

**Why:** 使用者明確要求走完整的 Conventional Commits 工作流程。

**How to apply:** 任何時候需要 commit，先呼叫 `/git-commit` skill，讓它分析 diff、推斷 type/scope，再執行 commit。

**Why:** 使用者明確要求用中文回答。

**How to apply:** 所有回覆一律使用繁體中文，程式碼本身不受影響。

**Why:** 使用者明確表示偏好純文字（`branch main · clean`），而非符號（`⎇ main ✔`）。

**How to apply:** 任何 statusline 或 UI 文字標籤，優先使用描述性文字，避免 Unicode 裝飾符號。
