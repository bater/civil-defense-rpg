# 生存指南：民防應變模擬

災難準備教育遊戲，學習正確的避難包準備和災難應對知識。

## 快速開始

```bash
# 直接打開
open index.html

# 或雙擊文件
```

就這麼簡單！無需任何配置。

## 遊戲特色

- 🎒 **重量限制系統** - 10kg 承重，必須做出選擇
- 🎲 **隨機事件** - 每個物資都有正面/負面事件
- 🎯 **動態選項** - 選項根據攜帶物資動態生成
- 🌍 **三種災難** - 地震、颱風、空襲
- 📊 **評級系統** - S/A/B/C 四個等級

## 遊戲流程

```
選擇物資 → 隨機事件 → 災難發生 → 應對選擇 → 查看評級
```

## 文檔

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - 系統架構和設計
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - 開發指引和數據修改
- **[NOTES.md](NOTES.md)** - 遊戲設計和補充說明

## 修改數據

```bash
# 1. 編輯 JSON
vim data/items.json

# 2. 同步到遊戲
node docs/sync-data.js

# 3. 測試
open index.html
```

## 文件結構

```
├── index.html              # 主程式
├── css/styles.css         # 樣式
├── js/                    # JavaScript 模組
├── data/                  # 遊戲數據
└── docs/                  # 文檔和工具
```

## 部署

直接部署到任何靜態主機：
- GitHub Pages
- Netlify
- Vercel
- 或本地文件系統

## 技術棧

- Vanilla JavaScript (ES6+)
- MVC 架構
- 純靜態，無需服務器

## 授權

教育用途，推廣災難準備意識。
