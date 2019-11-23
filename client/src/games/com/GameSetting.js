/**
 * Created by Jiyou Mo on 2017/10/28.
 */
// 游戏设置面板
game.ui.GameSetting = game.ui.PopupWindow.extend({

    _node               : null,

    _labelVer           : null,             // 游戏版本号
    _ndMusic            : null,             // 音乐节点
    _ndEffect           : null,             // 音效节点

    _btnClose           : null,             // 关闭按钮

    ctor : function () {
        this._super();
        this._node = ccs.load("res/Games/ComWindow/Setting/GameSetting.json").node;
        this.addChild(this._node);
        this._init();
        return true;
    },

    _init : function(){

        this._labelVer = game.findUI(this._node, "ND_Version");
        this._ndMusic = game.findUI(this._node, "ND_Music");
        this._ndEffect = game.findUI(this._node, "ND_Effect");
        this._btnClose = game.findUI(this._node, "BTN_Close");

        if (!Utils.isCurrentVersionIOS(game.config.APP_VERSION)) {
            this._labelVer.setVisible(false);
        }

        this.setGameVer();
        this.registerLoadingBar();
        this.registerBtnClick();
    },

    // 设置游戏版本
    setGameVer : function () {
        var verString = "V" + game.config.MAJOR_VER;
        verString += ".";
        verString += game.config.SUB_VER;
        verString += ".";
        verString += game.config.MINOR_VER;
        this._labelVer.setString("版本号：" + verString);
        this._labelVer.setVisible(true);
    },

    // 注册滑动条监听
    registerLoadingBar: function () {
        // 音乐
        var musicChk = game.findUI(this._ndMusic, "ND_StatBTN");
        var musicBar = game.findUI(this._ndMusic, "ND_Bar");

        var curMusicVolume = Math.floor(game.Audio.getMusicVolume() * 100);
        musicChk.setSelected(curMusicVolume == 0);

        musicBar.setPercent(curMusicVolume);
        musicBar.addEventListener(function(sender, type){
            switch (type) {
                case ccui.Slider.EVENT_PERCENT_CHANGED:
                    var percent = sender.getPercent();
                    musicChk.setSelected(percent == 0);
                    game.Audio.setMusicVolume(percent * 0.01);
                    break;
                default:
                    break;
            }
        });

        musicChk.addEventListener(function (sender, type) {
            game.Audio.playBtnClickEffect();
            switch (type) {
                case  ccui.CheckBox.EVENT_UNSELECTED:
                    var musVol = game.LocalDB.get("CUR_MUS_VOL") || 0;
                    musicBar.setPercent(musVol);
                    game.Audio.setMusicVolume(musVol * 0.01);
                    break;
                case ccui.CheckBox.EVENT_SELECTED:
                    game.LocalDB.set("CUR_MUS_VOL", musicBar.getPercent());
                    musicBar.setPercent(0);
                    game.Audio.setMusicVolume(0);
                    break;
                default:
                    break;
            }
        });

        // 音效
        var effChk = game.findUI(this._ndEffect, "ND_StatBTN");
        var effBar = game.findUI(this._ndEffect, "ND_Bar");

        var curEffVolume = Math.floor(game.Audio.getEffectVolume() * 100);
        effChk.setSelected(curEffVolume == 0);

        effBar.setPercent(curEffVolume);
        effBar.addEventListener(function(sender, type){
            switch (type) {
                case ccui.Slider.EVENT_PERCENT_CHANGED:
                    var percent = sender.getPercent();
                    effChk.setSelected(percent == 0);
                    game.Audio.setEffectVolume(percent * 0.01);
                    break;
                default:
                    break;
            }
        });

        effChk.addEventListener(function (sender, type) {
            game.Audio.playBtnClickEffect();
            switch (type) {
                case  ccui.CheckBox.EVENT_UNSELECTED:
                    var effVol = game.LocalDB.get("CUR_EFF_VOL") || 0;
                    effBar.setPercent(effVol);
                    game.Audio.setEffectVolume(effVol * 0.01);
                    break;
                case ccui.CheckBox.EVENT_SELECTED:
                    game.LocalDB.set("CUR_EFF_VOL", effBar.getPercent());
                    effBar.setPercent(0);
                    game.Audio.setEffectVolume(0);
                    break;
                default:
                    break;
            }
        });
    },

    // 注册按钮监听
    registerBtnClick: function () {
        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this);
    }
});

/**
 * 弹出设置窗口
 */
game.ui.GameSetting.popup = function() {
    var wnd = new game.ui.GameSetting();
    game.UISystem.popupWindow(wnd);
};