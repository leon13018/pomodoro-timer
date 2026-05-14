---
name: differentiation-strategy
description: 針對 Electron Windows 桌面番茄鐘的差異化策略與護城河建議（2026-05 更新）
metadata:
  type: project
---

## 核心定位建議（2026-05 更新）

目標用戶：Windows 上的知識工作者、開發者、學生，需要「設計感強、離線可用、不需帳號、Windows 原生整合」的桌面番茄鐘

定位聲明（精煉版）：「給 Windows 用戶的 Session——無訂閱、無帳號、真正常駐桌面，為開發者和知識工作者而生」

## 產品現況優劣勢評估

已有優勢（2026-05 確認）：
- SVG 圓形進度條（視覺差異化基礎已建立）
- 雙主題（工作紅／休息藍）動態切換（有設計意圖）
- 視窗置頂（桌面常駐體驗）
- 自定義時長（ADHD 友善基礎）
- 安全架構（長期維護可信度）

缺口（需補強）：
- 無 Taskbar Progress Bar（Windows 工具列進度顯示）
- 無 Windows DND 整合
- 無本地統計資料（日/週/歷史記錄）
- 無開機自啟動管理
- 主題系統不完整（只有 2 色主題，缺乏主題庫）

## 三大差異化方向（優先順序）

1. **Windows 原生整合**（優先級最高，護城河最強）
   - 工具列進度顯示（taskbar progress bar）—— Pomotroid 無此功能
   - Windows 11 DND 整合（Focus Sessions 官方也只有 Microsoft To Do）
   - 開機自啟動管理
   - 系統托盤常駐 + 快速控制

2. **本地統計 + 資料主權**（中期，對抗訂閱制）
   - 日/週/月工作階段記錄（heatmap 或 bar chart）
   - CSV 匯出、本地 JSON 儲存
   - 零雲端依賴、零帳號——對 Pomofocus/Session 訂閱的反制

3. **視覺差異化 + 開發者主題**（長期社群建立）
   - 擴充主題系統（Catppuccin、Nord、Dracula、Tokyo Night 等開發者熟悉主題）
   - JSON 自訂主題 API（參考 Pomotroid，但 UX 更友善）
   - 動畫質感提升（SVG 已有基礎，可加過渡動畫）

## 護城河建議

- GitHub 開源社群（參考 Pomotroid 模式，吸引開發者貢獻主題）
- 買斷制 + 終生更新承諾（對抗訂閱疲勞）
- 多語言支援（繁體中文優先，觸達台灣/香港市場；日語次之）
- 積極回應用戶反饋（Pomofocus 最大弱點是開發者沉默）

## 定價建議

- 免費基礎版（計時 + 本地資料，無帳號）
- 終生授權 $9.99-$14.99（進階主題庫、詳細統計圖表、DND 整合等）

**Why:** 市場缺乏有設計感的 Windows 原生桌面番茄鐘，Pomotroid 是主要對手但功能成長有限；買斷制可強化差異化並對抗訂閱疲勞趨勢。

**How to apply:** 每次功能規劃時對照此方向，優先做「Windows 原生整合」再做「統計資料」，最後做「主題系統」；避免向「任務管理合體」方向膨脹（那是 TickTick 的市場）。
