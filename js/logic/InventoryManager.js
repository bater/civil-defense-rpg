/**
 * InventoryManager
 * Business logic for inventory evaluation
 */
class InventoryManager {
    constructor(dataLoader, config) {
        this.dataLoader = dataLoader;
        this.config = config;
    }

    evaluateSelection(selectedIds) {
        let score = 0;
        const missingItems = [];
        const scores = this.config.game.scores;

        this.dataLoader.items.forEach(item => {
            const isSelected = selectedIds.includes(item.id);
            
            if (item.correct && isSelected) {
                score += scores.correctItem;
            } else if (item.correct && !isSelected) {
                score += scores.missingItem;
                missingItems.push(item.name);
            } else if (!item.correct && isSelected) {
                score += scores.wrongItem;
            }
        });

        return { score, missingItems };
    }

    hasWrongItems(supplies) {
        const wrongItems = ['ps5', 'beer', 'gold'];
        return wrongItems.some(item => supplies.includes(item));
    }

    calculateTotalWeight(selectedIds) {
        return selectedIds.reduce((total, id) => {
            const item = this.dataLoader.getItem(id);
            return total + (item ? item.weight : 0);
        }, 0);
    }

    isOverweight(selectedIds) {
        return this.calculateTotalWeight(selectedIds) > this.config.game.maxWeight;
    }

    getAvailableItems(currentSelectedIds) {
        const currentWeight = this.calculateTotalWeight(currentSelectedIds);
        const maxWeight = this.config.game.maxWeight;

        return this.dataLoader.items.map(item => ({
            ...item,
            canSelect: currentSelectedIds.includes(item.id) || 
                      (currentWeight + item.weight <= maxWeight)
        }));
    }
}
