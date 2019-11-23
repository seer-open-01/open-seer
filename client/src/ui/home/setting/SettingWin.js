/**
 * Created by lyndon on 2018.04.17.
 *
 *  大厅--设置界面弹窗
 */
game.ui.SettingWin = game.ui.PopupWindow.extend({

    _node               : null,

    _labelVer           : null,             // 游戏版本号
    _ndMusic            : null,             // 音乐节点
    _ndEffect           : null,             // 音效节点

    _btnClose           : null,             // 关闭按钮
    _btnChange          : null,             // 切换账号按钮
    _btnLogout          : null,             // 注销账号按钮

    ctor: function () {
        this._super();
        this._node = ccs.load("res/Home/Setting/SettingWin.json").node;
        this.addChild(this._node);
        this._init();

        return true;
    },

    _init: function() {

        this._labelVer = game.findUI(this._node, "ND_Version");

        this._ndMusic = game.findUI(this._node, "ND_Music");
        this._ndEffect = game.findUI(this._node, "ND_Effect");

        this._btnClose = game.findUI(this._node, "BTN_Close");
        this._btnChange = game.findUI(this._node, "BTN_Change");
        this._btnLogout = game.findUI(this._node, "BTN_Logout");

        if(!Utils.isCurrentVersionIOS(game.config.APP_VERSION)) {
            this._btnLogout.setVisible(false);
            this._labelVer.setVisible(false);
            this._btnChange.setPosition(cc.p(423, 112));
        }

        this.setGameVer();
        this.registerLoadingBar();
        this.registerBtnClick();
    },

    // 设置游戏版本
    setGameVer: function () {
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
                    game.Audio.setMusicVolume(percent / 100);
                    break;
                default:
                    break;
            }
        }, this);

        musicChk.addEventListener(function (sender, type) {
            game.Audio.playBtnClickEffect();
            switch (type) {
                case  ccui.CheckBox.EVENT_UNSELECTED:
                    var musVol = game.LocalDB.get("CUR_MUS_VOL") || 0;
                    musicBar.setPercent(musVol);
                    game.Audio.setMusicVolume(musVol / 100);
                    break;
                case ccui.CheckBox.EVENT_SELECTED:
                    game.LocalDB.set("CUR_MUS_VOL", musicBar.getPercent());
                    musicBar.setPercent(0);
                    game.Audio.setMusicVolume(0);
                    break;
                default:
                    break;
            }
        }.bind(this));

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
                    game.Audio.setEffectVolume(percent / 100);
                    break;
                default:
                    break;
            }
        }, this);

        effChk.addEventListener(function (sender, type) {
            game.Audio.playBtnClickEffect();
            switch (type) {
                case  ccui.CheckBox.EVENT_UNSELECTED:
                    var effVol = game.LocalDB.get("CUR_EFF_VOL") || 0;
                    effBar.setPercent(effVol);
                    game.Audio.setEffectVolume(effVol / 100);
                    break;
                case ccui.CheckBox.EVENT_SELECTED:
                    game.LocalDB.set("CUR_EFF_VOL", effBar.getPercent());
                    effBar.setPercent(0);
                    game.Audio.setEffectVolume(0);
                    break;
                default:
                    break;
            }
        }.bind(this));
    },

    // 注册按钮监听
    registerBtnClick: function () {

        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        this._btnChange.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.log("==>退出账号");
                game.Audio.playBtnClickEffect();
                game.LocalDB.set("LoginWithWechat", false, true);
                game.LocalDB.save();

                game.Audio.savePersist();
                game.logout();

                game.UISystem.closePopupWindow(this);
            }
        }, this);


        this._btnLogout.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.log("==>退出游戏");
                game.Audio.playBtnClickEffect();
                game.Audio.savePersist();
                game.UISystem.closePopupWindow(this);
                Platform.exitGame();
            }
        }, this);


        //game.addTouchEventHandler(nodeActions, "ND_GPS", function (sender, type) {
        //    // 开启GPS
        //    cc.log("==>开启GPS");
        //    Platform.openSettingWindow();
        //    game.UISystem.closePopupWindow(this);
        //}.bind(this));
        //
        //game.addTouchEventHandler(uiNode, "ND_Feedback", function (sender, type) {
        //    game.ui.FeedbackWin.popup();
        //}.bind(this));
        //var ndLang = game.findUI(uiNode, "ND_Language");

        // 语言
        //var langBtns = [];
        //langBtns[0] = { ctrl: game.findUI(ndLang, "ND_FangYan"), value : 1 };
        //langBtns[1] = { ctrl: game.findUI(ndLang, "ND_PuTong"), value : 2 };
        //this._langGroup = new game.ui.RadioGroup("Lang",
        //    langBtns, game.config.FANG_YAN ? 0 : 1, function(args){
        //        game.config.FANG_YAN = (args.value == 1);
        //        cc.log("==> 设置语言：" + (game.config.FANG_YAN ? "方言" : "普通话"));
        //        game.LocalDB.set("FANG_YAN", game.config.FANG_YAN);
        //        game.Audio.setFangYan(game.config.FANG_YAN);
        //    }.bind(this)
        //);
    }
});

/**
 * 弹出设置窗口
 */
game.ui.SettingWin.popup = function() {
    var win = new game.ui.SettingWin();
    game.UISystem.popupWindow(win);
};

