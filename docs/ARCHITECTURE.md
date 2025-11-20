# 架構設計 (Architecture)

## 系統架構

### MVC 分層

```
Controller (GameController)
    ↓
├─→ Model (GameState, DataLoader)
├─→ Logic (InventoryManager, SceneManager, EventManager)
└─→ View (GameRenderer)
```

### 核心組件

**Model 層：**
- `GameState` - 遊戲狀態管理
- `DataLoader` - 數據載入（支持內嵌 JS 和 JSON 兩種模式）

**Logic 層：**
- `InventoryManager` - 物資評估、重量計算
- `SceneManager` - 場景管理、動態選項生成
- `EventManager` - 隨機事件選擇

**View 層：**
- `GameRenderer` - UI 渲染

**Controller 層：**
- `GameController` - 協調所有組件

## 數據結構

### 配置 (config)
```javascript
{
  maxWeight: 10,              // 最大承重
  rankThresholds: {...},      // 評級門檻
  scores: {...},              // 評分規則
  eventProbability: {...}     // 事件機率
}
```

### 物資 (items)
```javascript
{
  id: "water",
  name: "飲用水",
  icon: "💧",
  weight: 3,
  correct: true,
  category: "survival"
}
```

### 場景 (scenes)
```javascript
{
  title: "場景標題",
  emoji: "🏠",
  text: "場景描述",
  type: "normal|inventory|random|summary",
  dynamicOptions: false,      // 是否根據物資動態生成選項
  options: [...]
}
```

## 數據載入策略

### 雙模式設計

```javascript
// 優先使用內嵌數據（靜態部署）
if (window.GAME_DATA) {
    return this.loadFromEmbedded();
}
// 否則從 JSON 載入（開發模式）
return await this.loadFromJSON();
```

**靜態模式：** 數據內嵌在 `data/game-data.js`，無需服務器
**開發模式：** 數據存於 JSON 文件，需要 HTTP 服務器

## 動態選項系統

場景選項根據玩家攜帶的物資動態生成：

```javascript
// 颱風停電場景
if (hasFlashlight && hasRadio) {
    // 提供最佳選項
} else if (hasFlashlight) {
    // 提供次佳選項
} else {
    // 只能摸黑
}
```

## 文件結構

```
├── index.html                  # 主入口
├── css/styles.css             # 樣式
├── js/
│   ├── models/                # 數據模型
│   ├── logic/                 # 業務邏輯
│   ├── views/                 # UI 渲染
│   └── controllers/           # 主控制器
├── data/
│   ├── game-data.js          # 內嵌數據（自動生成）
│   ├── disaster-scenes.js    # 災難場景
│   └── *.json                # JSON 數據源
└── docs/                      # 文檔
```

## 擴展指南

### 添加新物資

1. 編輯 `data/items.json`
2. 編輯 `data/item-events.json`
3. 運行 `node docs/sync-data.js`

### 添加新災難

1. 編輯 `data/disasters.json`
2. 在 `data/disaster-scenes.js` 添加場景
3. 在 `SceneManager.js` 添加動態選項方法（如需要）

### 修改配置

1. 編輯 `data/config.json`
2. 運行 `node docs/sync-data.js`

## 部署

### 靜態部署（推薦）
直接部署所有文件到靜態主機（GitHub Pages、Netlify 等）

### 開發模式
需要 HTTP 服務器：`python -m http.server 8000`

## 資料庫遷移準備

當前數據結構已為資料庫遷移做好準備：

```sql
-- 物資表
CREATE TABLE items (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    weight DECIMAL(3,1),
    correct BOOLEAN,
    category VARCHAR(50)
);

-- 場景表
CREATE TABLE scenes (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100),
    text TEXT,
    scene_type VARCHAR(50)
);

-- 場景選項表
CREATE TABLE scene_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    scene_id VARCHAR(50),
    option_text TEXT,
    next_scene VARCHAR(50),
    impact JSON
);
```

只需將 `DataLoader` 改為從 API 載入即可。
