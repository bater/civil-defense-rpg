/**
 * GameController
 * Main game controller coordinating all components
 */
class GameController {
    constructor() {
        this.container = document.getElementById('game-container');
        this.dataLoader = new DataLoader();
        this.state = new GameState();
        this.renderer = null;
        this.inventoryManager = null;
        this.sceneManager = null;
        this.eventManager = null;
        this.currentScene = null;
    }

    async initialize() {
        this.renderer = new GameRenderer(this.container, this.state, { game: {} });
        this.renderer.showLoading();

        const success = await this.dataLoader.loadAll();
        
        if (!success) {
            this.renderer.showError('無法載入遊戲資料，請檢查網路連線或重新整理頁面。');
            return false;
        }

        // Initialize managers with loaded data
        this.renderer = new GameRenderer(this.container, this.state, this.dataLoader.config);
        this.inventoryManager = new InventoryManager(this.dataLoader, this.dataLoader.config);
        this.sceneManager = new SceneManager(this.dataLoader, this.state);
        this.eventManager = new EventManager(this.dataLoader, this.dataLoader.config);

        return true;
    }

    async start() {
        const initialized = await this.initialize();
        if (!initialized) return;

        this.loadScene('intro');
    }

    loadScene(sceneId) {
        const scene = this.sceneManager.getScene(sceneId);
        if (!scene) return;

        this.state.currentScene = sceneId;
        this.currentScene = scene;

        // Handle special scene types
        if (scene.type === 'inventory') {
            this.renderer.renderInventorySelection(this.dataLoader.items);
            return;
        }

        if (scene.type === 'item_event') {
            this.triggerRandomItemEvent();
            return;
        }

        if (scene.type === 'random') {
            const nextScene = this.sceneManager.selectRandomDisaster();
            this.loadScene(nextScene);
            return;
        }

        if (scene.type === 'summary') {
            this.renderer.renderSummary(this.inventoryManager, this.state.isDead());
            return;
        }

        this.renderer.renderScene(scene);
    }

    updateWeight() {
        const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedIds = Array.from(checkedBoxes).map(cb => cb.value);
        const totalWeight = this.inventoryManager.calculateTotalWeight(selectedIds);
        const maxWeight = this.dataLoader.config.game.maxWeight;
        const weightPercent = (totalWeight / maxWeight) * 100;

        // Update UI
        const weightFill = document.getElementById('weight-fill');
        const weightText = document.getElementById('weight-text');
        const currentWeightSpan = document.getElementById('current-weight');
        const confirmBtn = document.getElementById('confirm-btn');

        if (currentWeightSpan) currentWeightSpan.textContent = totalWeight.toFixed(1);
        if (weightFill) {
            weightFill.style.width = Math.min(weightPercent, 100) + '%';
            if (totalWeight > maxWeight) {
                weightFill.classList.add('overweight');
            } else {
                weightFill.classList.remove('overweight');
            }
        }
        if (weightText) weightText.textContent = Math.round(weightPercent) + '%';

        // Disable items that would exceed weight limit
        const allItems = document.querySelectorAll('.inv-item');
        allItems.forEach(itemEl => {
            const checkbox = itemEl.querySelector('input[type="checkbox"]');
            const itemWeight = parseFloat(itemEl.dataset.weight);
            
            if (!checkbox.checked && totalWeight + itemWeight > maxWeight) {
                itemEl.classList.add('disabled');
                checkbox.disabled = true;
            } else if (!checkbox.checked) {
                itemEl.classList.remove('disabled');
                checkbox.disabled = false;
            }
        });

        // Enable/disable confirm button
        if (confirmBtn) {
            if (totalWeight > 0 && totalWeight <= maxWeight) {
                confirmBtn.disabled = false;
                confirmBtn.textContent = '確認打包';
                confirmBtn.style.opacity = '1';
            } else if (totalWeight > maxWeight) {
                confirmBtn.disabled = true;
                confirmBtn.textContent = `超重！請減少 ${(totalWeight - maxWeight).toFixed(1)} kg`;
                confirmBtn.style.opacity = '0.5';
            } else {
                confirmBtn.disabled = true;
                confirmBtn.textContent = '請選擇物品';
                confirmBtn.style.opacity = '0.5';
            }
        }
    }

    confirmInventory() {
        const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
        const selectedIds = Array.from(checkedBoxes).map(cb => cb.value);
        
        if (this.inventoryManager.isOverweight(selectedIds)) {
            const totalWeight = this.inventoryManager.calculateTotalWeight(selectedIds);
            alert(`背包超重！當前 ${totalWeight.toFixed(1)} kg，上限 ${this.dataLoader.config.game.maxWeight} kg`);
            return;
        }

        this.state.supplies = selectedIds;
        this.state.totalWeight = this.inventoryManager.calculateTotalWeight(selectedIds);
        
        const evaluation = this.inventoryManager.evaluateSelection(selectedIds);
        this.state.score += evaluation.score;
        this.state.missingItems = evaluation.missingItems;

        this.loadScene('check_inventory');
    }

    triggerRandomItemEvent() {
        const eventData = this.eventManager.selectRandomItemEvent(this.state.supplies);
        
        if (!eventData) {
            // No items with events, skip to disaster
            this.loadScene('random_event');
            return;
        }

        const { item, event } = eventData;

        // Apply impact
        this.state.applyImpact(event.impact);
        
        // Store feedback
        if (event.feedback) {
            this.state.lastFeedback = event.feedback;
            this.state.addHistory(event.title, `使用了${item.name}`, event.feedback);
        }

        // Render the event scene
        const eventScene = this.eventManager.createEventScene(eventData);
        this.currentScene = eventScene;
        this.renderer.renderScene(eventScene);
    }

    makeChoice(optionIndex) {
        if (!this.currentScene || !this.currentScene.options) return;

        const option = this.currentScene.options[optionIndex];
        
        // Apply impact
        this.state.applyImpact(option.impact);

        // Check for death
        if (this.state.isDead()) {
            this.state.lastFeedback = "你受了致命傷，無法繼續行動。";
            this.renderer.renderSummary(this.inventoryManager, true);
            return;
        }

        // Store feedback and history
        if (option.feedback) {
            this.state.lastFeedback = option.feedback;
            this.state.addHistory(this.currentScene.title, option.text, option.feedback);
        }

        this.loadScene(option.next);
    }

    // Save/Load functionality for future use
    saveGame() {
        const saveData = {
            state: this.state.toJSON(),
            timestamp: Date.now()
        };
        localStorage.setItem('survival_game_save', JSON.stringify(saveData));
    }

    loadGame() {
        const saveData = localStorage.getItem('survival_game_save');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.state.fromJSON(data.state);
            this.loadScene(this.state.currentScene);
            return true;
        }
        return false;
    }
}
