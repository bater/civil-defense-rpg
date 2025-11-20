/**
 * EventManager
 * Business logic for random item events
 */
class EventManager {
    constructor(dataLoader, config) {
        this.dataLoader = dataLoader;
        this.config = config;
    }

    selectRandomItemEvent(supplies) {
        // Select a random item from player's supplies
        const eligibleItems = supplies.filter(itemId => 
            this.dataLoader.getItemEvent(itemId)
        );
        
        if (eligibleItems.length === 0) {
            return null;
        }

        const randomItemId = eligibleItems[Math.floor(Math.random() * eligibleItems.length)];
        const item = this.dataLoader.getItem(randomItemId);
        const itemEvent = this.dataLoader.getItemEvent(randomItemId);
        
        // Determine if positive or negative event
        const event = this.selectEventType(item, itemEvent);
        
        return {
            item,
            event,
            itemId: randomItemId
        };
    }

    selectEventType(item, itemEvent) {
        if (!item.correct) {
            // Wrong items always trigger negative events
            return itemEvent.negative;
        }
        
        if (itemEvent.positive && itemEvent.negative) {
            // Use configured probability for positive events
            const positiveChance = this.config.game.eventProbability.positiveForCorrectItems;
            return Math.random() < positiveChance ? itemEvent.positive : itemEvent.negative;
        }
        
        return itemEvent.positive || itemEvent.negative;
    }

    createEventScene(eventData) {
        const { item, event } = eventData;
        
        return {
            title: event.title,
            emoji: event.emoji,
            text: event.text,
            impact: event.impact,
            feedback: event.feedback,
            options: [
                { text: "繼續", next: "random_event" }
            ]
        };
    }
}
