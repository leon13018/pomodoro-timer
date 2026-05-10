---
name: qiuzhi-creative
description: Generates creative design concepts and actual image files for 秋芝餐廳 (Qiuzhi Restaurant) marketing materials. Use when the user asks to design or create visuals for 秋芝, including menus, social media graphics, and packaging. Triggers on phrases like "幫秋芝設計", "為秋芝餐廳做一張", "設計一張秋芝的".
---

# 秋芝餐廳 創意設計 Skill

## 品牌資訊

- **餐廳名稱**: 秋芝餐廳 (Qiuzhi Restaurant)
- **風格定位**: 現代簡約
- **物料範圍**: 菜單、社群推廣圖（IG/FB）、包裝與隨附小物
- **品牌參考圖**: `assets/logo_mint.jpg`、`assets/logo_white.jpg`（預設作為參考圖傳入 API）

## 用戶輸入

每次觸發時，**依序**向用戶收集以下四項資訊（若對話中已提供則跳過）：

| # | 項目 | 說明 | 範例 |
|---|------|------|------|
| 1 | **物料類型** | 要做什麼 | 「菜單封面」「IG 方形貼文」 |
| 2 | **具體內容** | 圖片要呈現什麼主題或內容，這是生圖品質的關鍵 | 「主打招牌松露炒飯，搭配秋季紅葉意象」「推廣週年慶活動，突出九折優惠」 |
| 3 | **設計風格偏好** | 色調、排版、氛圍等描述 | 「簡潔留白、米白底色」「溫暖食欲感、深色背景」 |
| 4 | **尺寸規格** | 物料種類或指定比例（可從物料類型推斷） | 「IG 方形」或 `1:1` |

## 工作流程

1. **依序確認四項輸入** — 每項若未提供則主動詢問，**不可跳過「具體內容」直接生圖**
2. **生成英文圖像 Prompt** — 結合以下元素撰寫：
   - 物料用途（menu cover / Instagram post / packaging label 等）
   - 具體內容（菜色、活動、文案重點等，直接翻譯並融入 prompt）
   - 用戶的風格偏好
   - 品牌一致性提示（incorporate brand logo as reference）
3. **呼叫生圖腳本**，指定比例
4. **回報結果**，說明生成的圖片路徑

## 呼叫腳本

```bash
python .claude/skills/qiuzhi-creative/scripts/generate_image.py \
  --prompt "YOUR_PROMPT_HERE" \
  --ratio 1:1 \
  --size 2K \
  --out outputs/qiuzhi_output.png
```

**常用比例對照：**
| 物料 | 建議比例 | 建議解析度 |
|------|---------|-----------|
| IG 方形貼文 | 1:1 | 2K |
| IG 直式貼文 | 4:5 | 2K |
| FB 橫幅 | 16:9 | 2K |
| 菜單封面 | 3:4 | 2K |
| 包裝貼紙 | 1:1 | 1K |

若不需要傳入 assets/ 素材，加上 `--no-assets` 參數。

## API 說明

詳見 [references/nano_banana_pro_api.md](references/nano_banana_pro_api.md)。
API Key 存放於專案根目錄 `.env` 文件（`GEMINI_API_KEY`）。
