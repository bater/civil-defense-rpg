# 補充說明 (Additional Notes)

## 遊戲設計

### 物資分級

**Tier S（必備）：**
- 水 (3kg) - 生存基本需求
- 手電筒 (1kg) - 多場景通用

**Tier A（重要）：**
- 食物 (2kg) - 維持體力
- 急救箱 (2kg) - 處理傷勢
- 收音機 (2kg) - 接收資訊

**Tier B（情境）：**
- 保暖衣物 (2kg) - 避難所禦寒
- 繩索 (2kg) - 救援用途
- 行動電源 (1kg) - 通訊需求

**Tier C（輔助）：**
- 證件 (0.5kg) - 避難所登記

### 推薦配置

**均衡型（9.5kg）：**
水 + 食物 + 收音機 + 急救箱 + 證件

**生存型（10kg）：**
水 + 手電筒 + 急救箱 + 食物 + 繩索

**資訊型（9.5kg）：**
水 + 收音機 + 手電筒 + 行動電源 + 保暖衣物 + 證件

### 災難對應

**地震：** 哨子、收音機、急救箱
**颱風：** 手電筒、收音機、食物/水
**空襲：** 水、食物、收音機、證件、保暖衣物

## 教育重點

### 地震應對
- ✅ 趴下、掩護、穩住 (DCH)
- ❌ 立刻往外跑
- ❌ 搖晃中移動

### 颱風應對
- ✅ 待在室內
- ✅ 使用電池設備
- ❌ 點蠟燭
- ❌ 外出

### 空襲應對
- ✅ 採避難姿勢
- ✅ 遠離窗戶
- ❌ 搭電梯
- ❌ 到頂樓觀看

## 技術細節

### 為什麼使用內嵌數據？

**問題：** 瀏覽器的 CORS 政策阻止直接載入本地 JSON 文件

**解決：** 將數據內嵌在 JavaScript 中，作為全局變數

**優點：**
- 無需 HTTP 服務器
- 可直接打開 HTML
- 完全靜態部署

**缺點：**
- 數據修改需要重新生成 JS
- 文件稍大（但可接受）

### 雙模式載入

```javascript
// DataLoader 自動檢測
if (window.GAME_DATA) {
    // 靜態模式：使用內嵌數據
    loadFromEmbedded();
} else {
    // 開發模式：從 JSON 載入
    loadFromJSON();
}
```

這樣設計的好處：
- 開發時可以編輯 JSON（易讀）
- 部署時使用 JavaScript（無需服務器）
- 自動切換，無需配置

### 數據同步腳本

`sync-data.js` 的作用：
1. 讀取所有 JSON 文件
2. 合併成一個 JavaScript 對象
3. 寫入 `game-data.js`

運行：`node docs/sync-data.js`

## 平衡性設計

### 重量限制
```
正確物資總重：15.5 kg
最大承重：10 kg
缺口：5.5 kg

→ 必須放棄至少 5.5 kg
→ 約只能選 5-6 個物品
→ 每次遊戲需要不同策略
```

### 評分平衡
```
物資選擇：-50 ~ +80 分
隨機事件：-30 ~ +25 分
災難應對：-30 ~ +60 分
HP：0 ~ 100 分
Sanity：0 ~ 100 分

總分範圍：0 ~ 365 分
S 級門檻：250 分（約 68%）
```

### 事件機率
- 正確物資：60% 正面（鼓勵正確選擇）
- 錯誤物資：100% 負面（懲罰錯誤選擇）

## 未來擴展

### 短期
- 添加更多物資（醫療用品、工具等）
- 添加更多災難（火災、洪水等）
- 添加成就系統

### 中期
- REST API
- 用戶系統
- 雲端存檔
- 排行榜

### 長期
- 資料庫遷移
- 內容管理系統
- 多語言支持
- 移動端優化

## 已知限制

### 當前限制
- 災難場景仍為 JS 文件（未來可轉 JSON）
- 無自動測試（僅手動測試）
- 無存檔功能（計劃添加）

### 不是問題
- 需要同步數據（這是設計選擇）
- 文件稍大（~50KB 可接受）
- 初始載入稍慢（~200ms 可接受）

## 貢獻指南

### 添加內容
1. Fork 專案
2. 編輯 JSON 文件
3. 運行 `node docs/sync-data.js`
4. 測試功能
5. 提交 Pull Request

### 報告問題
- 使用 GitHub Issues
- 提供詳細的錯誤信息
- 包含瀏覽器版本

### 建議功能
- 使用 GitHub Discussions
- 說明使用場景
- 提供設計想法

## 授權

教育用途。旨在推廣台灣的災難準備意識。

## 資源連結

### 官方資源
- [消防防災e點通](https://www.nfa.gov.tw/)
- [內政部消防署](https://www.nfa.gov.tw/)
- [中央氣象局](https://www.cwb.gov.tw/)

### 技術資源
- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript ES6+](https://es6-features.org/)
- [MVC Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)

## 快速參考

### 文件位置
- 主程式：`index.html`
- 舊版本：`index-old.html`（參考用）
- 樣式：`css/styles.css`
- 邏輯：`js/` 目錄
- 數據：`data/` 目錄
- 文檔：`docs/` 目錄

### 常用命令
```bash
# 運行遊戲
open index.html

# 同步數據
node docs/sync-data.js

# 啟動服務器（開發模式，可選）
./start-server.sh
```

### 調試
```javascript
// 查看狀態
console.log(game.state);

// 查看數據
console.log(game.dataLoader);

// 跳到場景
game.loadScene('scene_id');

// 設置物資測試
game.state.supplies = ['water', 'food', 'radio'];
```

## 項目結構

```
civil-defense-rpg/
├── index.html              # 主程式（新版本）
├── index-old.html          # 舊版本（單文件，保留參考）
├── README.md               # 專案說明
├── start-server.sh         # 啟動腳本（可選）
│
├── css/
│   └── styles.css         # 所有樣式
│
├── js/
│   ├── models/            # 數據模型
│   ├── logic/             # 業務邏輯
│   ├── views/             # UI 渲染
│   └── controllers/       # 主控制器
│
├── data/
│   ├── *.json            # JSON 數據源
│   ├── game-data.js      # 內嵌數據（自動生成）
│   └── disaster-scenes.js # 災難場景
│
├── docs/
│   ├── ARCHITECTURE.md   # 架構設計
│   ├── DEVELOPMENT.md    # 開發指引
│   ├── NOTES.md          # 本文檔
│   └── sync-data.js      # 數據同步工具
│
└── tests/                # 測試文件（如有）
```

## 版本說明

### 新版本 (index.html)
- MVC 架構
- 模組化設計
- 數據分離
- 支持靜態部署
- 易於維護和擴展

### 舊版本 (index-old.html)
- 單一 HTML 文件
- 所有代碼內嵌
- 簡單直接
- 保留作為參考

**推薦使用新版本**，舊版本僅供參考或緊急使用。

## 重要提示

### 數據同步
- 編輯 JSON 後必須運行 `node docs/sync-data.js`
- 這會將 JSON 數據同步到 `game-data.js`
- 不同步的話，遊戲不會反映 JSON 的修改

### 靜態部署
- 新版本完全靜態，無需服務器
- 可直接打開 `index.html` 使用
- 可部署到任何靜態主機

### 開發模式
- 如果想使用純 JSON（不用內嵌數據）
- 需要移除 `index.html` 中的 `game-data.js` 載入
- 並啟動 HTTP 服務器

---

**三份文檔說明：**
- `ARCHITECTURE.md` - 系統架構、數據結構、擴展方法
- `DEVELOPMENT.md` - 開發流程、數據修改、常用任務
- `NOTES.md` - 遊戲設計、教育重點、補充信息
