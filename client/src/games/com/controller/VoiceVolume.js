/**
 * Created by Jiyou Mo on 2017/10/17.
 */
// 游戏录音 音量显示
GameWindowBasic.VoiceVolume = GameControllerBasic.extend({

    _volumes            : [],

    ctor : function () {
        this._node = ccs.load("res/Games/Com/Voice/Voice.json").node;
        this._node.retain();
        this._init();
        return true;
    },

    _init : function () {
        this._volumes = [];
        for (var i = 1; i <= 5; ++i) {
            var volume = game.findUI(this._node, "Voice" + i);
            volume.setVisible(false);
            this._volumes.push(volume);
        }
    },

    reset : function () {
        this.setVolume(0);
        this.show(false);
    },

    /**
     * 设置显示音量等级
     * @param vol
     */
    setVolume : function (vol) {
        // var showVol = Math.floor(vol * 0.05);
        var showVol = Math.floor(vol);
        for (var i = 0; i < 5; ++i) {
            this._volumes[i].setVisible(i <= showVol);
        }
    }
});

GameWindowBasic.VoiceVolume._instance = null;

/**
 * 获取说话音量显示控件
 * @return {GameWindowBasic.VoiceVolume|*|null}
 */
GameWindowBasic.VoiceVolume.getController = function () {
    if (this._instance == null) {
        this._instance = new GameWindowBasic.VoiceVolume();
    }
    this._instance.reset();
    return this._instance;
};