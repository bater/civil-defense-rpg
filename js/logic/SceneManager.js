/**
 * SceneManager
 * Business logic for scene management and dynamic option generation
 */
class SceneManager {
    constructor(dataLoader, gameState) {
        this.dataLoader = dataLoader;
        this.gameState = gameState;
    }

    getScene(sceneId) {
        // Check base scenes first
        const baseScene = this.dataLoader.getScene(sceneId);
        if (baseScene) {
            return baseScene;
        }

        // Check disaster-specific scenes
        if (this.gameState.currentDisaster) {
            const scene = this.dataLoader.getDisasterScene(
                this.gameState.currentDisaster, 
                sceneId
            );
            
            if (scene) {
                // Generate dynamic options if needed
                if (scene.dynamicOptions) {
                    return this.generateDynamicScene(sceneId, scene);
                }
                return scene;
            }
        }

        console.error(`Scene not found: ${sceneId}`);
        return null;
    }

    selectRandomDisaster() {
        const disasterIds = Object.keys(this.dataLoader.disasters);
        const randomId = disasterIds[Math.floor(Math.random() * disasterIds.length)];
        this.gameState.currentDisaster = randomId;
        return this.dataLoader.disasters[randomId].startScene;
    }

    generateDynamicScene(sceneId, scene) {
        const supplies = this.gameState.supplies;
        const dynamicScene = { ...scene };

        // Typhoon power outage scenario
        if (sceneId === 'typhoon_start') {
            dynamicScene.options = this.generateTyphoonOptions(supplies);
        }

        // Earthquake aftermath scenario
        if (sceneId === 'eq_hide') {
            dynamicScene.options = this.generateEarthquakeAfterOptions(supplies);
        }

        // War shelter scenario
        if (sceneId === 'war_hide') {
            dynamicScene.options = this.generateWarShelterOptions(supplies);
        }

        // Earthquake injury scenario
        if (sceneId === 'eq_run') {
            dynamicScene.options = this.generateInjuryOptions(supplies, 'eq');
        }

        // Typhoon outdoor injury scenario
        if (sceneId === 'ty_out') {
            dynamicScene.options = this.generateInjuryOptions(supplies, 'ty');
        }

        // Earthquake trapped scenario
        if (sceneId === 'eq_trapped') {
            dynamicScene.options = this.generateTrappedOptions(supplies);
        }

        // War evacuation shelter scenario
        if (sceneId === 'war_evacuation') {
            dynamicScene.options = this.generateEvacuationOptions(supplies);
        }

        return dynamicScene;
    }

    generateTyphoonOptions(supplies) {
        const hasFlashlight = supplies.includes('whistle');
        const hasRadio = supplies.includes('radio');
        const hasCandle = supplies.includes('candle');
        const hasLighter = supplies.includes('lighter');
        const hasPhoneCharger = supplies.includes('phone_charger');

        const options = [];

        // 最佳選項：手電筒 + 收音機
        if (hasFlashlight && hasRadio) {
            options.push({
                text: "拿出避難包中的手電筒與收音機",
                next: "ty_safe",
                impact: { sanity: 10, score: 20 },
                feedback: "正確！使用電池供電設備最安全，並透過收音機掌握災情。"
            });
        } 
        // 次佳選項：只有手電筒
        else if (hasFlashlight) {
            options.push({
                text: "拿出手電筒照明",
                next: "ty_partial",
                impact: { sanity: 5, score: 5 },
                feedback: "有手電筒很好，但沒有收音機無法掌握即時災情。"
            });
        }
        // 手機照明（如果有行動電源）
        else if (hasPhoneCharger) {
            options.push({
                text: "用手機照明，靠行動電源維持電力",
                next: "ty_phone_light",
                impact: { sanity: 0, score: 0 },
                feedback: "手機可以照明，但電池消耗快，而且無法同時使用其他功能。"
            });
        }
        // 蠟燭照明（需要蠟燭和打火機）
        if (hasCandle && hasLighter) {
            options.push({
                text: "小心地點燃蠟燭照明",
                next: "ty_candle_safe",
                impact: { sanity: 5, score: 5 },
                feedback: "在通風良好且遠離易燃物的情況下，蠟燭是可行的照明選擇。"
            });
        }
        // 只有蠟燭或只有打火機（無法使用）
        else if (hasCandle || hasLighter) {
            const missing = hasCandle ? "打火機" : "蠟燭";
            options.push({
                text: `想點蠟燭但缺少${missing}`,
                next: "ty_no_light",
                impact: { hp: -20, sanity: -15, score: -5 },
                feedback: `蠟燭和打火機必須同時攜帶才能使用。`
            });
        }
        // 沒有任何照明
        if (!hasFlashlight && !hasPhoneCharger && !(hasCandle && hasLighter)) {
            options.push({
                text: "在黑暗中摸索",
                next: "ty_no_light",
                impact: { hp: -30, sanity: -20, score: -10 },
                feedback: "沒有照明設備讓你在黑暗中受傷。這就是為什麼避難包需要照明設備！"
            });
        }

        // 錯誤選項：外出
        options.push({ 
            text: "趁風雨還沒最大，出去買泡麵", 
            next: "ty_out", 
            impact: { hp: -80 }, 
            feedback: "千萬不要！掉落的招牌與樹木可能致命。" 
        });

        return options;
    }

    generateEarthquakeAfterOptions(supplies) {
        const hasRadio = supplies.includes('radio');

        return [
            { 
                text: "立刻關閉火源與瓦斯，穿上鞋子", 
                next: hasRadio ? "eq_aftershock_prepared" : "eq_aftershock_unprepared",
                impact: hasRadio ? { score: 20, sanity: 10 } : { hp: -20, score: 5 },
                feedback: hasRadio 
                    ? "非常專業！你關閉火源並透過收音機得知餘震警報，及時躲避。" 
                    : "你關閉了火源，但沒有收音機，無法得知餘震警報，被突如其來的餘震嚇到。"
            },
            { 
                text: "馬上打電話給親友報平安", 
                next: "eq_aftershock_unprepared",
                impact: { hp: -25, score: -10 },
                feedback: "佔用緊急救災線路，且沒注意餘震警報，被掉落物品砸傷。" 
            }
        ];
    }

    generateWarShelterOptions(supplies) {
        const hasWater = supplies.includes('water');
        const hasFood = supplies.includes('food');
        const hasRadio = supplies.includes('radio');

        if (hasWater && hasFood && hasRadio) {
            return [{
                text: "使用避難包物資，收聽廣播等待",
                next: "war_informed",
                impact: { score: 30, sanity: 15 },
                feedback: "完美！你有水、食物和收音機，能夠安全且有資訊地等待救援。"
            }];
        } else if (hasWater && hasFood) {
            return [{
                text: "喝水吃東西，等待警報解除",
                next: "war_hydrated",
                impact: { score: 15, sanity: 5 },
                feedback: "你有水和食物維持體力，但沒有收音機無法掌握外界資訊。"
            }];
        } else {
            return [{
                text: "忍受飢渴，等待警報解除",
                next: "war_thirsty",
                impact: { hp: -30, sanity: -15, score: -10 },
                feedback: "沒有水和食物讓你體力下降。避難包應該要有基本的水和乾糧！"
            }];
        }
    }

    generateInjuryOptions(supplies, prefix) {
        const hasFirstAid = supplies.includes('firstaid');

        if (hasFirstAid) {
            return [{
                text: prefix === 'eq' ? "使用急救箱處理傷口" : "用急救箱處理傷口",
                next: prefix === 'eq' ? "eq_treated" : "ty_injured_with_aid",
                impact: prefix === 'eq' ? { hp: -10, score: 10 } : { hp: -40, score: 5 },
                feedback: "幸好有急救箱！及時處理傷口避免了更嚴重的後果。"
            }];
        } else {
            return [{
                text: "簡單包紮傷口",
                next: prefix === 'eq' ? "eq_untreated" : "ty_injured_no_aid",
                impact: prefix === 'eq' ? { hp: -30, sanity: -10, score: -10 } : { hp: -60, sanity: -15, score: -15 },
                feedback: "沒有急救箱讓傷勢惡化。避難包一定要有基本的醫療用品！"
            }];
        }
    }

    generateTrappedOptions(supplies) {
        const hasWhistle = supplies.includes('whistle');

        if (hasWhistle) {
            return [{
                text: "用力吹哨子求救",
                next: "eq_rescued",
                impact: { hp: -15, score: 25, sanity: 10 },
                feedback: "哨子的聲音比人聲更響亮且省力！救難人員很快就找到你了。"
            }];
        } else {
            return [{
                text: "大聲呼救",
                next: "eq_not_found",
                impact: { hp: -40, sanity: -20, score: -15 },
                feedback: "人聲容易沙啞且傳不遠。哨子是避難包的重要工具！"
            }];
        }
    }

    generateEvacuationOptions(supplies) {
        const hasWarmClothes = supplies.includes('warm_clothes');
        const hasIdCard = supplies.includes('id_card');

        if (hasWarmClothes && hasIdCard) {
            return [{
                text: "出示證件登記，穿上保暖衣物",
                next: "war_shelter_prepared",
                impact: { score: 25, sanity: 10 },
                feedback: "完美準備！保暖衣物和證件讓你能快速安置。"
            }];
        } else if (hasIdCard) {
            return [{
                text: "出示證件登記",
                next: "war_shelter_cold",
                impact: { hp: -20, sanity: -10, score: 5 },
                feedback: "有證件很好，但沒有保暖衣物讓你受寒。"
            }];
        } else if (hasWarmClothes) {
            return [{
                text: "穿上保暖衣物，嘗試登記",
                next: "war_shelter_no_id",
                impact: { sanity: -15, score: 0 },
                feedback: "保暖衣物有幫助，但沒有證件讓登記過程很麻煩。"
            }];
        } else {
            return [{
                text: "嘗試進入避難所",
                next: "war_shelter_unprepared",
                impact: { hp: -30, sanity: -20, score: -20 },
                feedback: "沒有保暖衣物和證件讓你陷入困境。這些都是避難包的必需品！"
            }];
        }
    }
}
