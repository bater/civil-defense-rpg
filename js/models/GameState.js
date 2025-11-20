/**
 * GameState Model
 * Manages all game state data
 */
class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.hp = 100;
        this.sanity = 100;
        this.supplies = [];
        this.score = 0;
        this.currentScene = 'intro';
        this.currentDisaster = null;
        this.history = [];
        this.lastFeedback = null;
        this.missingItems = [];
        this.totalWeight = 0;
    }

    applyImpact(impact) {
        if (!impact) return;
        
        if (impact.hp) this.hp = Math.max(0, Math.min(100, this.hp + impact.hp));
        if (impact.sanity) this.sanity = Math.max(0, Math.min(100, this.sanity + impact.sanity));
        if (impact.score) this.score += impact.score;
    }

    addHistory(scene, action, feedback) {
        this.history.push({ scene, action, feedback });
    }

    isDead() {
        return this.hp <= 0;
    }

    calculateFinalScore() {
        return this.score + this.hp + this.sanity;
    }

    getRank(config) {
        const finalScore = this.calculateFinalScore();
        const thresholds = config.game.rankThresholds;
        
        for (const [rank, threshold] of Object.entries(thresholds)) {
            if (finalScore >= threshold) return rank;
        }
        return 'C';
    }

    toJSON() {
        return {
            hp: this.hp,
            sanity: this.sanity,
            supplies: this.supplies,
            score: this.score,
            currentScene: this.currentScene,
            currentDisaster: this.currentDisaster,
            history: this.history,
            totalWeight: this.totalWeight
        };
    }

    fromJSON(data) {
        Object.assign(this, data);
    }
}
