// Disaster Scenes Data
// This will be converted to JSON files in the future for database migration

window.DISASTER_SCENES_DATA = {
    earthquake: {
        earthquake_start: {
            title: "警報：強烈地震",
            emoji: "📉",
            text: "手機發出巨大的國家級警報聲響！幾秒後，地面開始劇烈搖晃，書架上的書紛紛掉落。你現在位於客廳。",
            options: [
                { 
                    text: "立刻衝出大門逃到戶外！", 
                    next: "eq_run", 
                    impact: { hp: -30, sanity: -10 }, 
                    feedback: "錯誤！地震當下移動非常危險，容易跌倒或被掉落物砸傷。" 
                },
                { 
                    text: "躲在堅固桌子下，抓穩桌腳 (DCH)", 
                    next: "eq_hide", 
                    impact: { hp: 0, sanity: 5 }, 
                    feedback: "正確！趴下(Drop)、掩護(Cover)、穩住(Hold on)是地震保命三步驟。" 
                },
                { 
                    text: "去打開大門，避免變形受困", 
                    next: "eq_open_door", 
                    impact: { hp: -10, sanity: 0 }, 
                    feedback: "危險！只有在晃動極小或停止時才去開門，晃動中移動容易受傷。" 
                }
            ]
        },
        eq_run: {
            title: "戶外更危險",
            emoji: "🤕",
            text: "你跌跌撞撞衝出門，結果被公寓外牆剝落的磁磚砸中肩膀。晃動停止了。",
            dynamicOptions: true
        },
        eq_treated: {
            title: "傷勢穩定",
            emoji: "💊",
            text: "你用急救箱處理傷口，消毒、包紮、服用止痛藥。雖然還是痛，但至少不會惡化。",
            options: [{ text: "尋找安全避難處", next: "end_scene" }]
        },
        eq_untreated: {
            title: "傷勢惡化",
            emoji: "🩸",
            text: "你沒有急救箱，只能用衣服按壓止血。傷口持續流血，疼痛讓你難以行動。",
            options: [{ text: "勉強尋找幫助", next: "end_scene" }]
        },
        eq_hide: {
            title: "晃動停止",
            emoji: "😰",
            text: "搖晃非常劇烈，但桌子保護了你免受掉落燈具的傷害。地震稍停了。",
            dynamicOptions: true
        },
        eq_aftershock_prepared: {
            title: "餘震來襲",
            emoji: "📻",
            text: "你打開收音機，聽到餘震警報。你迅速再次躲到桌下，成功避開了掉落的書架。",
            options: [{ text: "等待救援", next: "end_scene" }]
        },
        eq_aftershock_unprepared: {
            title: "餘震來襲",
            emoji: "😱",
            text: "突然又開始搖晃！你沒有收音機無法得知餘震警報，措手不及被掉落的物品砸傷。",
            options: [{ text: "處理傷勢", next: "end_scene" }]
        },
        eq_open_door: {
            title: "搖晃中跌倒",
            emoji: "💫",
            text: "你試圖走向門口，但劇烈的搖晃讓你站不穩撞到牆壁。好不容易把門打開了一條縫。",
            options: [{ text: "繼續下一步", next: "eq_trapped" }]
        },
        eq_trapped: {
            title: "受困瓦礫",
            emoji: "🏚️",
            text: "餘震導致部分天花板塌陷，你被困在瓦礫中。你的腿被壓住，無法移動。外面很安靜，不知道有沒有人。",
            dynamicOptions: true
        },
        eq_rescued: {
            title: "成功獲救",
            emoji: "🚒",
            text: "你不斷吹哨子，終於有救難人員聽到聲音找到你！他們迅速將你救出。",
            options: [{ text: "接受治療", next: "end_scene" }]
        },
        eq_not_found: {
            title: "漫長等待",
            emoji: "😰",
            text: "你大聲呼救，但聲音微弱。幾個小時後才有人經過聽到你的呼救聲。你已經虛弱不堪。",
            options: [{ text: "終於獲救...", next: "end_scene" }]
        }
    },
    typhoon: {
        typhoon_start: {
            title: "警報：強烈颱風",
            emoji: "🌀",
            text: "超級颱風登陸，窗外風雨交加，電力突然中斷了，室內一片漆黑。水壓也開始下降。",
            dynamicOptions: true
        },
        ty_candle: {
            title: "意外起火",
            emoji: "🔥",
            text: "強風吹倒了蠟燭，窗簾著火了！你手忙腳亂地滅火。",
            options: [{ text: "好不容易滅火，等待風雨過去", next: "end_scene" }]
        },
        ty_no_light: {
            title: "黑暗中摸索",
            emoji: "🌑",
            text: "你在黑暗中摸索，不小心撞到家具，還踩到碎玻璃。你感到恐慌和無助。",
            options: [{ text: "忍痛等待天亮", next: "end_scene" }]
        },
        ty_safe: {
            title: "安然度過",
            emoji: "📻",
            text: "你拿出手電筒照明，打開收音機掌握災情。你吃著存糧，雖然外面風雨很大，但你感到相對安心。",
            options: [{ text: "等待風雨過去", next: "end_scene" }]
        },
        ty_partial: {
            title: "勉強應對",
            emoji: "🔦",
            text: "你有手電筒但沒有收音機，只能靠手機接收資訊，但電量有限。你感到有些不安。",
            options: [{ text: "節省電力，等待風雨過去", next: "end_scene" }]
        },
        ty_out: {
            title: "風雨無情",
            emoji: "🚑",
            text: "你剛出門就被強風吹倒，還差點被看板砸中，只能狼狽地爬回家。",
            dynamicOptions: true
        },
        ty_injured_no_aid: {
            title: "傷勢惡化",
            emoji: "🩹",
            text: "你受傷了但沒有急救箱，只能用衣服簡單包紮。傷口持續疼痛，你擔心會感染。",
            options: [{ text: "忍痛等待救援", next: "end_scene" }]
        },
        ty_injured_with_aid: {
            title: "妥善處理",
            emoji: "💊",
            text: "你受傷了，幸好有急救箱。你清理傷口、消毒、包紮，並服用止痛藥。",
            options: [{ text: "休息等待風雨過去", next: "end_scene" }]
        }
    },
    war: {
        war_start: {
            title: "警報：防空警報",
            emoji: "📢",
            text: "「嗚——」長音15秒、短音5秒的警報聲響徹雲霄。手機收到「飛彈空襲警報」。你住在大樓的五樓。",
            options: [
                { 
                    text: "跑到頂樓看是不是真的有飛彈", 
                    next: "war_roof", 
                    impact: { hp: -100 }, 
                    feedback: "自殺行為！這不是看煙火。" 
                },
                { 
                    text: "立刻搭電梯下樓去地下室", 
                    next: "war_elevator", 
                    impact: { hp: -50 }, 
                    feedback: "危險！空襲可能導致停電，你會被困在電梯裡。" 
                },
                { 
                    text: "採「避難姿勢」躲在無窗的房間或堅固牆角", 
                    next: "war_hide", 
                    impact: { score: 20 }, 
                    feedback: "正確！遠離窗戶（避免玻璃震碎），採跪姿、掩耳、微張嘴（防爆震）。" 
                }
            ]
        },
        war_roof: {
            title: "致命的好奇心",
            emoji: "💀",
            text: "遠處的爆炸衝擊波震碎了所有玻璃，你受了重傷。",
            options: [{ text: "勉強生存...", next: "end_scene" }]
        },
        war_elevator: {
            title: "受困",
            emoji: "🚫",
            text: "電力中斷，你被卡在電梯裡，恐懼感襲來。外面傳來爆炸聲。",
            options: [{ text: "等待救援...", next: "end_scene" }]
        },
        war_hide: {
            title: "漫長的等待",
            emoji: "🧘",
            text: "你聽著外面的巨響，身體因採避難姿勢而痠痛，但你沒有受傷。你的避難包就在手邊。",
            dynamicOptions: true
        },
        war_thirsty: {
            title: "口渴難耐",
            emoji: "🥵",
            text: "警報解除了，但你在避難處待了很久，沒有水喝讓你感到虛弱和頭暈。",
            options: [{ text: "勉強離開避難處", next: "end_scene" }]
        },
        war_hydrated: {
            title: "保持體力",
            emoji: "💧",
            text: "警報解除了。你喝了避難包裡的水，吃了一些能量棒，保持了體力和清醒。",
            options: [{ text: "安全離開避難處", next: "end_scene" }]
        },
        war_informed: {
            title: "掌握資訊",
            emoji: "📻",
            text: "警報解除了。你透過收音機得知安全撤離路線和集結點，並有水和食物維持體力。",
            options: [{ text: "按照指示安全撤離", next: "war_evacuation" }]
        },
        war_evacuation: {
            title: "撤離避難所",
            emoji: "🏃",
            text: "你跟著人群前往臨時避難所。天氣寒冷，許多人在發抖。避難所需要登記身分才能領取物資。",
            dynamicOptions: true
        },
        war_shelter_prepared: {
            title: "順利安置",
            emoji: "🏕️",
            text: "你有保暖衣物禦寒，也有證件順利登記領取物資和安排床位。你感到相對安心。",
            options: [{ text: "等待進一步指示", next: "end_scene" }]
        },
        war_shelter_cold: {
            title: "寒冷難耐",
            emoji: "🥶",
            text: "你沒有保暖衣物，在避難所裡冷得發抖。雖然有證件能領物資，但要等很久才能拿到毛毯。",
            options: [{ text: "忍受寒冷等待", next: "end_scene" }]
        },
        war_shelter_no_id: {
            title: "身分困難",
            emoji: "📋",
            text: "你沒有攜帶證件，登記過程非常麻煩。雖然最終還是能進入，但浪費了很多時間和精力。",
            options: [{ text: "終於完成登記", next: "end_scene" }]
        },
        war_shelter_unprepared: {
            title: "困境重重",
            emoji: "😣",
            text: "你既沒有保暖衣物也沒有證件。你又冷又餓，登記過程困難重重，身心俱疲。",
            options: [{ text: "艱難地等待安置", next: "end_scene" }]
        }
    }
};
