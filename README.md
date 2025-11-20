# 生存指南：民防應變模擬

A disaster preparedness simulation game designed to educate users about emergency response procedures in Taiwan. The game presents various disaster scenarios (earthquakes, typhoons, air raids) and tests players' decision-making skills.

## Project Overview

This is a single-file HTML application with embedded CSS and JavaScript. The game uses a branching narrative structure where players:
1. Select emergency supplies for their survival kit
2. Face a random disaster scenario
3. Make critical decisions that affect their survival
4. Receive feedback and a final evaluation

## Architecture

The codebase follows a modular, class-based architecture for maintainability:

### Core Classes

#### `GameState`
Manages all game state data including HP, sanity, score, supplies, and history.

**Key Methods:**
- `reset()` - Resets game to initial state
- `applyImpact(impact)` - Applies HP/sanity/score changes
- `isDead()` - Checks if player HP reached zero
- `calculateFinalScore()` - Computes final score
- `getRank()` - Determines player rank (S/A/B/C)
- `addHistory(scene, action, feedback)` - Records player choices

#### `SceneManager`
Handles scene retrieval and disaster selection logic.

**Key Methods:**
- `getScene(sceneId)` - Retrieves scene from base scenes or disaster-specific scenes
- `selectRandomDisaster()` - Randomly selects a disaster scenario

#### `InventoryManager`
Static class for inventory evaluation logic.

**Key Methods:**
- `evaluateSelection(selectedIds)` - Scores player's item choices
- `hasWrongItems(supplies)` - Checks if player selected inappropriate items

#### `Renderer`
Handles all UI rendering operations.

**Key Methods:**
- `renderStatusBar()` - Displays HP and sanity
- `renderInventorySelection()` - Shows item selection interface
- `renderScene(scene)` - Renders a story scene with options
- `renderSummary(isDead)` - Shows final results and feedback

#### `Game`
Main controller that coordinates all components.

**Key Methods:**
- `start()` - Initializes the game
- `loadScene(sceneId)` - Loads and displays a scene
- `confirmInventory()` - Processes inventory selection
- `makeChoice(optionIndex)` - Handles player decisions

## Data Structures

### Configuration (`CONFIG`)
```javascript
{
    RANK_THRESHOLDS: { S: 250, A: 200, B: 150, C: 0 },
    CRITICAL_HP: 50,
    CRITICAL_SANITY: 50,
    SCORES: {
        CORRECT_ITEM: 10,
        MISSING_ITEM: -5,
        WRONG_ITEM: -10
    }
}
```

### Inventory Items (`INVENTORY_ITEMS`)
Array of objects with:
- `id` - Unique identifier
- `name` - Display name
- `correct` - Boolean indicating if item is appropriate
- `weight` - Item weight (for future features)

### Disaster Scenarios (`DISASTER_SCENARIOS`)
Object containing disaster types, each with:
- `name` - Disaster name
- `startScene` - Entry point scene ID
- `scenes` - Object containing all scenes for this disaster

### Scene Structure
```javascript
{
    title: "Scene Title",
    emoji: "🏠",
    text: "Scene description",
    type: "normal|inventory|random|summary", // optional
    dynamicOptions: true, // optional - generates options based on player's supplies
    options: [
        {
            text: "Choice text",
            next: "next_scene_id",
            impact: { hp: -10, sanity: 5, score: 10 }, // optional
            feedback: "Feedback message" // optional
        }
    ]
}
```

### Dynamic Options System

The game features a dynamic options system where player choices are affected by their inventory selection. When a scene has `dynamicOptions: true`, the `SceneManager.generateDynamicScene()` method creates different options based on what supplies the player packed.

**Examples:**
- **No flashlight during power outage** → Player must fumble in darkness and gets injured
- **No first aid kit after injury** → Wounds worsen and HP drops significantly  
- **No whistle when trapped** → Rescue takes much longer
- **No radio during earthquake** → Cannot receive aftershock warnings
- **No ID card at shelter** → Registration becomes difficult and time-consuming
- **No warm clothes in cold weather** → Player suffers from cold exposure

## Weight-Based Inventory System

Players face a critical constraint: **maximum carrying capacity of 10 kg**. This forces strategic decision-making about which items to bring.

### Item Weights

| Item | Weight | Type | Icon |
|------|--------|------|------|
| 飲用水 (Water) | 3 kg | Essential | 💧 |
| 罐頭/能量棒 (Food) | 2 kg | Essential | 🥫 |
| 手搖式收音機 (Radio) | 2 kg | Essential | 📻 |
| 急救箱 & 藥品 (First Aid) | 2 kg | Essential | 💊 |
| 保暖衣物 (Warm Clothes) | 2 kg | Essential | 🧥 |
| 救生繩索 (Rope) | 2 kg | Essential | 🪢 |
| 哨子 & 手電筒 (Whistle) | 1 kg | Essential | 🔦 |
| 行動電源 (Phone Charger) | 1 kg | Essential | 🔋 |
| 身分證件 & 現金 (ID Card) | 0.5 kg | Essential | 🪪 |
| 遊戲主機 (PS5) | 4 kg | Wrong | 🎮 |
| 一打啤酒 (Beer) | 5 kg | Wrong | 🍺 |
| 沉重的金條 (Gold) | 6 kg | Wrong | 🪙 |

**Strategic Choices:**
- Can only select 4-5 essential items due to weight limit
- Must prioritize based on anticipated disaster type (unknown at selection time)
- Wrong items consume valuable weight capacity

## Supply-Dependent Gameplay

### Disaster Response
Each inventory item has specific uses in disaster scenarios:

| Item | Use Cases |
|------|-----------|
| 飲用水 (Water) | Maintain hydration during long shelter stays |
| 罐頭/能量棒 (Food) | Maintain energy and morale |
| 手搖式收音機 (Radio) | Receive emergency broadcasts, aftershock warnings, evacuation routes |
| 急救箱 & 藥品 (First Aid) | Treat injuries from falls, debris, accidents |
| 哨子 & 手電筒 (Whistle & Flashlight) | Signal for rescue when trapped, navigate in darkness |
| 保暖衣物/輕便雨衣 (Warm Clothes) | Protection from cold in shelters, rain protection |
| 身分證件影本 & 現金 (ID & Cash) | Register at shelters, access services, purchase supplies |
| 行動電源 (Phone Charger) | Keep communication devices powered |
| 救生繩索 (Rope) | Rescue operations, securing items |

Wrong items (PS5, beer, gold bars) add weight and reduce score but don't provide benefits.

### Random Item Events

Before the disaster strikes, a random event occurs based on one of the player's selected items:

**Positive Events (60% chance for correct items):**
- Sharing water with dehydrated person → gain information
- Using first aid to help injured child → receive supplies
- Using flashlight to guide rescue team → increase score
- Warm clothes during cold night → restore HP and sanity

**Negative Events (40% chance for correct items, 100% for wrong items):**
- Water bottle leaks → reduced effectiveness
- Food expired → HP loss
- Radio battery low → sanity loss
- PS5/Beer/Gold → significant penalties

This adds unpredictability and replayability while teaching that even correct items need maintenance.

## How to Extend

### Adding a New Disaster Scenario

1. Add a new entry to `DISASTER_SCENARIOS`:

```javascript
DISASTER_SCENARIOS.flood = {
    name: '洪水',
    startScene: 'flood_start',
    scenes: {
        flood_start: {
            title: "警報：洪水來襲",
            emoji: "🌊",
            text: "大雨不斷，河水暴漲...",
            options: [
                {
                    text: "往高處移動",
                    next: "flood_high_ground",
                    impact: { score: 20 },
                    feedback: "正確！洪水時應立即往高處避難。"
                },
                {
                    text: "開車逃離",
                    next: "flood_car",
                    impact: { hp: -40 },
                    feedback: "危險！車輛容易被洪水沖走。"
                }
            ]
        },
        flood_high_ground: {
            title: "安全地帶",
            emoji: "🏔️",
            text: "你成功到達高處，等待救援。",
            options: [{ text: "等待救援", next: "end_scene" }]
        },
        flood_car: {
            title: "車輛受困",
            emoji: "🚗",
            text: "洪水淹沒了道路，車輛熄火了。",
            options: [{ text: "棄車逃生", next: "end_scene" }]
        }
    }
};
```

2. The new disaster will automatically be included in the random selection pool.

### Adding New Inventory Items

Add to `INVENTORY_ITEMS` array:

```javascript
{
    id: 'rope',
    name: '救生繩索',
    correct: true,
    weight: 2
}
```

### Adding New Base Scenes

Add to `SceneManager.baseScenes`:

```javascript
tutorial: {
    title: "教學",
    emoji: "📖",
    text: "這是一個教學場景...",
    options: [
        { text: "開始遊戲", next: "intro" }
    ]
}
```

### Modifying Scoring System

Update `CONFIG.SCORES` or `CONFIG.RANK_THRESHOLDS`:

```javascript
CONFIG.SCORES = {
    CORRECT_ITEM: 15,  // Increased reward
    MISSING_ITEM: -3,  // Reduced penalty
    WRONG_ITEM: -15    // Increased penalty
};

CONFIG.RANK_THRESHOLDS = {
    S: 300,  // Harder to achieve
    A: 220,
    B: 160,
    C: 0
};
```

### Adding New Scene Types

1. Add type to scene definition
2. Handle in `Game.loadScene()`:

```javascript
if (scene.type === 'quiz') {
    this.renderer.renderQuiz(scene);
    return;
}
```

3. Implement rendering method in `Renderer` class

### Adding Random Item Events

To add new random events for items:

1. Add event definition to `ITEM_EVENTS`:

```javascript
ITEM_EVENTS.new_item = {
    positive: {
        title: "Event Title",
        emoji: "🎯",
        text: "Event description...",
        impact: { hp: 10, score: 15 },
        feedback: "Feedback message"
    },
    negative: {
        title: "Negative Event",
        emoji: "⚠️",
        text: "Negative description...",
        impact: { hp: -10, sanity: -5 },
        feedback: "Warning message"
    }
};
```

2. Events trigger automatically before disasters (60% positive for correct items, 100% negative for wrong items)

### Adding Supply-Dependent Scenes

To create scenes where options change based on player inventory:

1. Set `dynamicOptions: true` in the scene definition
2. Add logic in `SceneManager.generateDynamicScene()`:

```javascript
if (sceneId === 'your_scene_id') {
    const hasItem = supplies.includes('item_id');
    
    if (hasItem) {
        dynamicScene.options = [{
            text: "Use the item",
            next: "success_scene",
            impact: { score: 20 },
            feedback: "Having the right tool made all the difference!"
        }];
    } else {
        dynamicScene.options = [{
            text: "Try without the item",
            next: "failure_scene",
            impact: { hp: -30, score: -10 },
            feedback: "You struggled without the proper equipment."
        }];
    }
}
```

3. Create corresponding success/failure scenes in your disaster scenario

### Adding Conditional Logic

For scenes with dynamic behavior, add logic to scene options:

```javascript
options: [
    {
        text: "使用急救箱",
        next: "healed",
        condition: () => game.state.supplies.includes('firstaid'),
        impact: { hp: 20 }
    }
]
```

Then check condition in `Game.makeChoice()` before displaying.

## Best Practices for AI Agents

### When Adding Content

1. **Maintain consistency** - Follow existing naming conventions (scene IDs use snake_case)
2. **Provide feedback** - Every impactful choice should have feedback text
3. **Balance difficulty** - Test that scenarios are neither too easy nor impossible
4. **Cultural sensitivity** - Ensure content is appropriate for Taiwan context
5. **Educational value** - Prioritize teaching real emergency procedures

### When Modifying Code

1. **Don't break encapsulation** - Use class methods, avoid direct state manipulation
2. **Update all related parts** - If changing scene structure, update renderer too
3. **Test edge cases** - Check death scenarios, zero HP, missing items
4. **Preserve game flow** - Ensure all scenes have valid next scenes
5. **Maintain single file** - Keep everything in index.html for portability

### Common Tasks

**Change game difficulty:**
```javascript
// Easier game
CONFIG.SCORES.MISSING_ITEM = -2;
CONFIG.RANK_THRESHOLDS.S = 200;

// Harder game
CONFIG.SCORES.WRONG_ITEM = -20;
CONFIG.RANK_THRESHOLDS.A = 250;
```

**Add new status metric:**
```javascript
// In GameState constructor
this.hunger = 100;

// In applyImpact
if (impact.hunger) this.hunger = Math.max(0, Math.min(100, this.hunger + impact.hunger));

// In renderStatusBar
<div class="status-item">🍽️ 飢餓: <span>${this.gameState.hunger}</span></div>
```

**Create branching paths:**
```javascript
// Scene with multiple outcomes based on inventory
{
    title: "需要工具",
    emoji: "🔧",
    text: "你需要破門而入...",
    options: [
        {
            text: "使用哨子求救",
            next: game.state.supplies.includes('whistle') ? "rescue_arrives" : "no_response",
            impact: { sanity: -10 }
        }
    ]
}
```

## Gameplay Example

**Scenario 1: Well-Prepared Player (Strategic Selection)**
1. **Inventory (9.5 kg):** Water (3kg), Food (2kg), Radio (2kg), First Aid (2kg), ID Card (0.5kg)
2. **Random Event:** Food event (positive) → Energy boost (+15 HP, +10 sanity, +10 score)
3. **Disaster:** Typhoon hits → Has radio → Safely monitors situation (+20 score, +10 sanity)
4. **Injury:** Gets hurt → Has first aid kit → Treats wound properly (-10 HP instead of -60)
5. **Final Score:** High rank (A or S)

**Scenario 2: Unprepared Player (Poor Choices)**
1. **Inventory (10 kg):** PS5 (4kg), Beer (5kg), Whistle (1kg) - wasted weight on wrong items
2. **Random Event:** Beer event (negative) → Alcohol dehydration (-20 HP, -10 sanity, -25 score)
3. **Disaster:** Typhoon hits → No flashlight/radio → Fumbles in darkness (-30 HP, -20 sanity, -10 score)
4. **Injury:** Gets hurt → No first aid kit → Wound worsens (-60 HP)
5. **Final Score:** Low rank (C or death)

**Scenario 3: Difficult Trade-offs**
1. **Inventory (10 kg):** Water (3kg), Whistle (1kg), Warm Clothes (2kg), Rope (2kg), Charger (1kg), ID (0.5kg)
   - Chose variety over food/first aid
2. **Random Event:** Rope event (positive) → Rescue someone (+25 score, +10 sanity)
3. **Disaster:** Earthquake → Gets trapped → Has whistle → Quick rescue (+25 score)
4. **Problem:** No food during long wait → Hunger (-15 HP)
5. **Final Score:** Medium-High rank (B or A) - survived but with trade-offs

This demonstrates how weight constraints force meaningful choices and create different survival outcomes.

## Testing

Open `index.html` in a browser and test:
- All disaster scenarios appear randomly
- Inventory selection affects final score
- Death scenarios trigger properly
- All scene transitions work
- Feedback displays correctly
- Final summary shows accurate data

## Future Enhancement Ideas

- Save/load game progress
- Multiple difficulty levels
- Achievement system
- Multiplayer scenarios
- Time-based challenges
- Resource management mechanics
- More disaster types (fire, chemical spill, etc.)
- Localization support
- Sound effects and animations
- Mobile-optimized UI

## File Structure

```
.
├── index.html          # Complete game (HTML + CSS + JS)
└── README.md          # This file
```

## License

Educational use. Designed to promote disaster preparedness awareness in Taiwan.
