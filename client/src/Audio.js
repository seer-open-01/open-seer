/**
 * 声音控件
 */
game.Audio = {
    _engine             : null,         // cocos封装的音乐播放 cc.audioEngine
    _musicVolume        : 0.7,          // 当前音乐的音量 默认值是0.7(70%)
    _effectVolume       : 0.7,          // 当前音效的音量 默认值是0.7(70%)
    _curMusic           : null,         // 当前正在播放的音乐 用于判断是否切换背景音乐 内部用

    /**
     * 初始化
     */
    init : function() {
        this._engine = cc.audioEngine;

        // 初始化音量
        var audioConf = game.LocalDB.get("AppAudioConf", true);
        if (audioConf) {
            cc.log("加载声音数据：" + audioConf);
            audioConf = JSON.parse(audioConf);

            this._musicVolume = +audioConf.m;
            this._effectVolume = +audioConf.e;
            if (isNaN(this._musicVolume))
                this._musicVolume = 0.7;
            if (isNaN(this._effectVolume)) {
                this._effectVolume = 0.7;
            }
        }
        this.setMusicVolume(this._musicVolume);
        this.setEffectVolume(this._effectVolume);
    },

    /**
     * 播放音乐
     * @param musicFile
     * @param loop
     * @param mix
     */
    playMusic : function (musicFile, loop, mix) {
        if (this._curMusic && this._curMusic == musicFile) {
            return;
        }
        if (!mix) {
            this._engine.stopMusic();
        }
        this._curMusic = musicFile;
        this._engine.playMusic(musicFile, loop);
    },

    /**
     * 预加载声音
     */
    preloadSound : function (name) {
        this._engine.preload(name);
    },

    /**
     * 停止音乐
     */
    stopMusic : function () {
        this._engine.stopMusic();
    },

    /**
     * 暂停音效
     */
    pauseMusic : function () {
        this._engine.pauseMusic()
    },

    /**
     * 重新播放音效
     */
    resumeMusic : function () {
        cc.log("==> resumeMusic");
        this._engine.resumeMusic();
    },

    /**
     * 播放音效
     * @param effectFile
     * @param loop
     * @returns {*|Number|null|Boolean}
     */
    playEffect : function (effectFile, loop) {
        return this._engine.playEffect(effectFile, loop);
    },

    /**
     * 停止播放音效
     * @param audio
     */
    stopEffect : function (audio) {
        audio && this._engine.stopEffect(audio);
    },

    /**
     * 设置音乐音量
     * @param volume
     */
    setMusicVolume : function (volume) {
        cc.log("==> setMusicVolume " + volume);
        this._musicVolume = volume;
        this._engine.setMusicVolume(volume);
    },

    /**
     * 设置音效音量
     * @param volume
     */
    setEffectVolume : function (volume) {
        this._effectVolume = volume;
        this._engine.setEffectsVolume(volume);
    },

    /**
     * 获取音乐音量
     * @returns {number}
     */
    getMusicVolume : function () {
        return this._musicVolume;
    },

    /**
     * 获取音效音量
     * @returns {number}
     */
    getEffectVolume : function () {
        return this._effectVolume;
    },

    /**
     * 保存数据
     */
    savePersist : function () {
        var audioStr = JSON.stringify({
            m: this._musicVolume,
            e: this._effectVolume
        });
        cc.log("保存声音数据：" + audioStr);
        game.LocalDB.set("AppAudioConf", audioStr);
        game.LocalDB.save();
    },

    // == 大厅音效 =========================================================================================
    /**
     * 播放登录背景音乐
     */
    playLoginBGMusic : function () {
        if (game.config.BGM_ON)
        game.Audio.playMusic("res/Audio/HomeBgMusic.mp3", true);
    },
    /**
     * 播放大厅背景音乐
     */
    playHomeBGMusic : function () {
        if (game.config.BGM_ON)
        game.Audio.playMusic("res/Audio/HomeBgMusic.mp3", true);
    },
    /**
     * 转盘音效
     */
    playWheelEffect: function () {
        game.Audio.playEffect("res/Audio/LuckyWheel.mp3");
    },
    /**
     * 中奖音效
     */
    playBingoEffect: function () {
        game.Audio.playEffect("res/Audio/Bingo.mp3");
    },
    /**
     * 播放按钮点击音效
     */
    playBtnClickEffect : function () {
        game.Audio.playEffect("res/Audio/Com/btnClick.mp3");
    },

    // === 游戏特效声音 ========================================================================================
    /**
     * 播放动画特效音效
     * @param gameEffectType
     */
    playGameEffectSound : function (gameEffectType) {
        switch (gameEffectType) {
            case GameEffectController.gameEffectType.DDZChunTian :     // 斗地主 春天特效
                this.playEffect("res/Audio/GameEffect/upstar.mp3");
                break;
            case GameEffectController.gameEffectType.DDZFeiJi :        // 斗地主 飞机特效
                this.playEffect("res/Audio/GameEffect/feji.mp3");
                break;
            case GameEffectController.gameEffectType.DDZLianDui :      // 斗地主 连队特效
                this.playEffect("res/Audio/GameEffect/shunzi.mp3");
                break;
            case GameEffectController.gameEffectType.DDZShunZi :       // 斗地主 顺子特效
                this.playEffect("res/Audio/GameEffect/shunzi.mp3");
                break;
            case GameEffectController.gameEffectType.DDZWangZha :      // 斗地主 王炸特效
                this.playEffect("res/Audio/GameEffect/boom.mp3");
                break;
            case GameEffectController.gameEffectType.DDZHuoJian :      // 斗地主 火箭特效
                break;
            case GameEffectController.gameEffectType.DDZZhaDan :       // 斗地主 炸弹特效
                this.playEffect("res/Audio/GameEffect/boom.mp3");
                break;

            case GameEffectController.gameEffectType.MJGang :          // 麻将 杠特效
                break;
            case GameEffectController.gameEffectType.MJHu :             // 麻将 胡
                break;
            case GameEffectController.gameEffectType.MJPeng :           // 麻将 碰
                break;
            case GameEffectController.gameEffectType.MJWIND :           // 麻将 碰
                this.playEffect("res/Audio/GameEffect/wind.mp3");
                break;
            case GameEffectController.gameEffectType.MJRAIN :           // 麻将 碰
                this.playEffect("res/Audio/GameEffect/rain.mp3");
                break;

            case GameEffectController.gameEffectType.KaiJu :            // 公用开局
                this.playEffect("res/Audio/GameEffect/startNewRound.mp3");
                break;
            default : cc.log("未知类型的游戏特效声音:" + gameEffectType); break;
        }
    },

    /**
     * 播放游戏互动表情音效
     * @param type
     */
    playGameGiftSound : function (type) {
        this.playEffect("res/Audio/GameGift/" + type + ".mp3");
    },

    // ==== 短语 ==============================================================================================
    /**
     * 播放短语
     */
    playGamePhrase : function(id, sex) {
        var path = "res/Audio/Phrase/";
        sex == 1 ? path += "Male/" : path += "Female/";
        path += "event_" + id + ".mp3";
        this.playEffect(path, false);
    }
};
