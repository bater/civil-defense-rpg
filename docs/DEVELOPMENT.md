# 開發指引 (Development Guide)

## 快速開始

### 運行遊戲
```bash
# 直接打開（推薦）
open index.html

# 或使用服務器（開發模式）
python -m http.server 8000
```

### 修改數據
```bash
# 1. 編輯 JSON
vim data/items.json

# 2. 同步到 JS
node docs/sync-data.js

# 3. 測試
open index.html
```

## 核心機制

### 重量系統
- 最大承重：10 kg
- 正確物資總重：15.5 kg
- 玩家只能選 4-6 個物品

### 評分系統
```
最終分數 = 物資分數 + 事件分數 + 應對分數 + HP + Sanity

S 級：250+
A 級：200-249
B 級：150-199
C 級：0-149
```

### 隨機事件
- 正確物資：60% 正面，40% 負面
- 錯誤物資：100% 負面

### 動態選項
場景選項根據玩家物資動態生成，有物資 → 正面結果，無物資 → 負面結果

## 數據文件

### config.json - 遊戲配置
```json
{
  "game": {
    "maxWeight": 10,
    "rankThresholds": { "S": 250, "A": 200, "B": 150 },
    "scores": {
      "correctItem": 10,
      "missingItem": -5,
      "wrongItem": -10
    }
  }
}
```

### items.json - 物資清單
```json
{
  "items": [
    {
      "id": "water",
      "name": "飲用水 (3公升)",
      "icon": "💧",
      "weight": 3,
      "correct": true,
      "category": "survival"
    }
  ]
}
```

### item-events.json - 物資事件
```json
{
  "events": {
    "water": {
      "positive": {
        "title": "分享水源",
        "text": "...",
        "impact": { "score": 15, "sanity": 10 },
        "feedback": "..."
      },
      "negative": { ... }
    }
  }
}
```

### disasters.json - 災難類型
```json
{
  "disasters": {
    "earthquake": {
      "name": "地震",
      "startScene": "earthquake_start"
    }
  }
}
```

### disaster-scenes.js - 災難場景
```javascript
window.DISASTER_SCENES_DATA = {
    earthquake: {
        earthquake_start: {
            title: "警報：強烈地震",
            emoji: "📉",
            text: "...",
            options: [...]
        }
    }
};
```

## 常用任務

### 添加新物資
```bash
# 1. 編輯 items.json
{
  "id": "new_item",
  "name": "新物品",
  "icon": "🎯",
  "weight": 2,
  "correct": true
}

# 2. 編輯 item-events.json
{
  "new_item": {
    "positive": { ... },
    "negative": { ... }
  }
}

# 3. 同步
node docs/sync-data.js
```

### 添加新災難
```bash
# 1. 編輯 disasters.json
{
  "flood": {
    "name": "洪水",
    "startScene": "flood_start"
  }
}

# 2. 編輯 disaster-scenes.js
window.DISASTER_SCENES_DATA.flood = {
    flood_start: {
        title: "警報：洪水來襲",
        emoji: "🌊",
        text: "...",
        options: [...]
    }
};

# 3. 在 SceneManager.js 添加動態選項（如需要）
```

### 修改重量限制
```bash
# 編輯 config.json
"maxWeight": 12

# 同步
node docs/sync-data.js
```

### 調整評分
```bash
# 編輯 config.json
"scores": {
  "correctItem": 15,
  "missingItem": -3,
  "wrongItem": -15
}

# 同步
node docs/sync-data.js
```

## 調試技巧

### 瀏覽器控制台
```javascript
// 查看遊戲狀態
console.log(game.state);

// 查看物資
console.log(game.state.supplies);

// 查看分數
console.log(game.state.score);

// 手動觸發選擇
game.makeChoice(0);

// 跳到特定場景
game.loadScene('typhoon_start');
```

### 測試特定場景
```javascript
// 設置物資
game.state.supplies = ['water', 'food', 'radio'];

// 跳到災難
game.loadScene('random_event');
```

## 代碼規範

### 命名規範
- 類別：PascalCase (`GameState`)
- 方法：camelCase (`loadScene`)
- 常量：UPPER_CASE (`MAX_WEIGHT`)
- 文件：kebab-case (`game-data.js`)

### 文件組織
- Model：數據模型，無業務邏輯
- Logic：業務邏輯，無 UI 操作
- View：UI 渲染，無業務邏輯
- Controller：協調各層

### 添加新功能
1. 在對應的 Manager 添加邏輯
2. 在 Controller 添加控制方法
3. 在 Renderer 添加視圖方法
4. 更新數據文件（如需要）

## 測試

### 手動測試清單
- [ ] 物資選擇（重量限制）
- [ ] 隨機事件觸發
- [ ] 災難場景流程
- [ ] 動態選項生成
- [ ] 最終評分計算

### 架構測試
訪問 `docs/test-architecture.html` 查看組件測試結果

## 部署

### GitHub Pages
```bash
git add .
git commit -m "Update game"
git push origin main
# 在 Settings → Pages 啟用
```

### Netlify
拖放整個文件夾到 Netlify

### 本地分發
直接複製整個文件夾，用戶可雙擊 `index.html` 使用

## 性能優化

### 當前性能
- 初始載入：~200ms
- 記憶體使用：~2.5MB
- 文件大小：~50KB

### 優化建議
- 壓縮 JavaScript：`terser data/game-data.js -o data/game-data.min.js`
- 啟用 Gzip（靜態主機通常自動啟用）
- 使用 CDN（GitHub Pages、Netlify 自帶）

## 常見問題

**Q: 為什麼需要同步數據？**
A: 為了支持靜態部署（無需服務器），數據需要內嵌在 JavaScript 中。

**Q: 可以只用 JSON 嗎？**
A: 可以，但需要 HTTP 服務器。移除 `index.html` 中的 `game-data.js` 載入即可。

**Q: 如何添加新的動態選項？**
A: 在 `SceneManager.js` 的 `generateDynamicScene()` 方法中添加邏輯。

**Q: 數據同步會覆蓋手動修改嗎？**
A: 會覆蓋 `game-data.js`，但不會影響 JSON 文件。建議只編輯 JSON。

## 工作流程

### 推薦流程
```bash
# 1. 開發：編輯 JSON
vim data/items.json

# 2. 同步：生成 JS
node docs/sync-data.js

# 3. 測試：本地測試
open index.html

# 4. 提交：推送到 Git
git add .
git commit -m "Add new item"
git push
```

### 快速修改流程
```bash
# 直接編輯 game-data.js（不推薦，但快速）
vim data/game-data.js

# 測試
open index.html
```
