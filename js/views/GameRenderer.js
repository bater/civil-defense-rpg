/**
 * GameRenderer
 * View layer for rendering game UI
 */
class GameRenderer {
    constructor(container, gameState, config) {
        this.container = container;
        this.gameState = gameState;
        this.config = config;
    }

    renderStatusBar() {
        const hpColor = this.gameState.hp < this.config.game.criticalHP ? '#ff4444' : '#4caf50';
        const sanityColor = this.gameState.sanity < this.config.game.criticalSanity ? '#ff9800' : '#2196f3';
        
        return `
            <div class="status-bar">
                <div class="status-item">❤️ 生命: <span style="color:${hpColor}">${this.gameState.hp}</span></div>
                <div class="status-item">🧠 心智: <span style="color:${sanityColor}">${this.gameState.sanity}</span></div>
            </div>
        `;
    }

    renderInventorySelection(items) {
        let html = `
            <div class="status-bar">請選擇要放入「緊急避難包」的物品</div>
            <div class="scene-image">🎒</div>
            <div class="description">你的背包承重有限 (最多 ${this.config.game.maxWeight} kg)。請明智選擇最需要的物品：</div>
            
            <div class="weight-indicator">
                <div>當前重量：<span id="current-weight">0</span> / ${this.config.game.maxWeight} kg</div>
                <div class="weight-bar">
                    <div class="weight-fill" id="weight-fill" style="width: 0%"></div>
                    <div class="weight-text" id="weight-text">0%</div>
                </div>
            </div>

            <div class="inventory-list" id="inventory-list">
        `;
        
        items.forEach(item => {
            html += `
                <label class="inv-item" data-item-id="${item.id}" data-weight="${item.weight}">
                    <input type="checkbox" value="${item.id}" id="check-${item.id}" onchange="game.updateWeight()">
                    <span>${item.icon} ${item.name}</span>
                    <span class="item-weight">${item.weight}kg</span>
                </label>
            `;
        });

        html += `
            </div>
            <button id="confirm-btn" onclick="game.confirmInventory()" style="width:100%; text-align:center; background:var(--accent-color)" disabled>確認打包 (請選擇物品)</button>
        `;
        
        this.container.innerHTML = html;
    }

    renderScene(scene) {
        let html = this.renderStatusBar();
        html += `<div class="scene-image">${scene.emoji}</div>`;
        html += `<h2>${scene.title}</h2>`;
        html += `<div class="description">${scene.text}</div>`;
        
        if (scene.options) {
            html += `<div class="options-grid">`;
            scene.options.forEach((opt, index) => {
                html += `<button onclick="game.makeChoice(${index})">${opt.text}</button>`;
            });
            html += `</div>`;
        }

        if (this.gameState.lastFeedback) {
            html += `<div class="feedback-box" style="display:block">${this.gameState.lastFeedback}</div>`;
            this.gameState.lastFeedback = null;
        }

        this.container.innerHTML = html;
    }

    renderSummary(inventoryManager, isDead = false) {
        const rank = this.gameState.getRank(this.config);
        const finalScore = this.gameState.calculateFinalScore();

        let html = `<h1>${isDead ? "模擬失敗" : "生存報告"}</h1>`;
        html += `<div class="scene-image">${isDead ? "☠️" : "🛡️"}</div>`;
        html += `
            <div class="description">
                <p>最終評級：<strong style="font-size:1.5rem; color:var(--accent-color)">${rank}</strong></p>
                <p>生命狀態: ${this.gameState.hp}% | 心理狀態: ${this.gameState.sanity}%</p>
                <hr style="border-color:#444">
                <h3>物資檢討：</h3>
                <p>${this.gameState.missingItems.length > 0 ? 
                   `<span style="color:var(--warning-color)">你遺漏了重要物資：${this.gameState.missingItems.join(', ')}</span>` : 
                   `<span style="color:var(--accent-color)">你的避難包準備得非常完美！</span>`}
                </p>
                ${inventoryManager.hasWrongItems(this.gameState.supplies) ? 
                '<p style="color:#ff4444">提示：逃生時請勿攜帶遊戲機、酒類或過重的貴重金屬，這些會消耗你的體力。</p>' : ''}
                
                <h3>行動回顧：</h3>
                <ul style="text-align:left; font-size:0.9rem; color:#aaa">
                    ${this.gameState.history.map(h => `<li><strong>${h.scene}</strong>: ${h.action} <br>➥ ${h.feedback}</li>`).join('')}
                </ul>

                <div style="background:#333; padding:15px; margin-top:20px; border-radius:8px;">
                    <strong>📢 台灣民防重點提醒：</strong>
                    <ul style="text-align:left; margin-top:10px;">
                        <li><strong>空襲警報：</strong>聽辨音符（15秒長音、5秒短音），立刻尋找地下室或堅固掩體，遠離窗戶。</li>
                        <li><strong>地震：</strong>趴下(Drop)、掩護(Cover)、穩住(Hold on)。</li>
                        <li><strong>避難包：</strong>水、乾糧、證件影本、現金、急救藥品、手電筒、收音機、保暖衣物。</li>
                        <li><strong>資訊來源：</strong>下載「消防防災e點通」APP 或收聽官方廣播。</li>
                    </ul>
                </div>
            </div>
            <button onclick="location.reload()" style="width:100%; margin-top:20px;">重新開始模擬</button>
        `;
        this.container.innerHTML = html;
    }

    showLoading() {
        this.container.innerHTML = `
            <div style="text-align:center; padding:50px;">
                <h2>載入中...</h2>
                <p>正在準備遊戲資料</p>
            </div>
        `;
    }

    showError(message) {
        this.container.innerHTML = `
            <div style="text-align:center; padding:50px; color:var(--danger-color);">
                <h2>載入失敗</h2>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top:20px;">重新載入</button>
            </div>
        `;
    }
}
