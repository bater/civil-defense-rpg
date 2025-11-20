/**
 * DataLoader
 * Handles loading all game data
 * Supports both embedded data (for static files) and JSON loading (for server)
 */
class DataLoader {
    constructor() {
        this.config = null;
        this.items = null;
        this.itemEvents = null;
        this.baseScenes = null;
        this.disasters = null;
        this.disasterScenes = null;
    }

    async loadAll() {
        try {
            // Check if embedded data is available (for static file usage)
            if (window.GAME_DATA) {
                return this.loadFromEmbedded();
            }
            
            // Otherwise, load from JSON files (requires server)
            return await this.loadFromJSON();
        } catch (error) {
            console.error('Failed to load game data:', error);
            return false;
        }
    }

    loadFromEmbedded() {
        try {
            const data = window.GAME_DATA;
            
            this.config = data.config;
            this.items = data.items;
            this.itemEvents = data.itemEvents;
            this.baseScenes = data.baseScenes;
            this.disasters = data.disasters;
            this.disasterScenes = window.DISASTER_SCENES_DATA || {};
            
            console.log('✅ Loaded data from embedded JavaScript');
            return true;
        } catch (error) {
            console.error('Failed to load embedded data:', error);
            return false;
        }
    }

    async loadFromJSON() {
        try {
            const [config, items, itemEvents, baseScenes, disasters] = await Promise.all([
                this.loadJSON('data/config.json'),
                this.loadJSON('data/items.json'),
                this.loadJSON('data/item-events.json'),
                this.loadJSON('data/base-scenes.json'),
                this.loadJSON('data/disasters.json')
            ]);

            this.config = config;
            this.items = items.items;
            this.itemEvents = itemEvents.events;
            this.baseScenes = baseScenes.scenes;
            this.disasters = disasters.disasters;
            this.disasterScenes = window.DISASTER_SCENES_DATA || {};

            console.log('✅ Loaded data from JSON files');
            return true;
        } catch (error) {
            console.error('Failed to load JSON files:', error);
            throw error;
        }
    }

    async loadJSON(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load ${path}: ${response.statusText}`);
        }
        return await response.json();
    }

    getItem(itemId) {
        return this.items.find(item => item.id === itemId);
    }

    getItemEvent(itemId) {
        return this.itemEvents[itemId];
    }

    getScene(sceneId) {
        return this.baseScenes[sceneId];
    }

    getDisaster(disasterId) {
        return this.disasters[disasterId];
    }

    getDisasterScene(disasterId, sceneId) {
        return this.disasterScenes[disasterId]?.[sceneId];
    }
}
