/**
 * Created by lyndon on 2018/04/25.
 */
// 游戏房间下拉按钮
var GameRoomBtnCtrl = GameControllerBasic.extend({

    _btnSwitch          : null,         // 开关按钮
    _menu               : null,         // 按钮菜单


    _btnSetting         : null,         // 设置按钮
    _btnBank            : null,         // 银行按钮
    _btnQuit            : null,         // 离开按钮
    _btnRule            : null,         // 规则按钮(帮助)
    _btnTrust           : null,         // 托管按钮
    _btns               : [],           // 按钮组

    _settingCallback    : null,         // 设置按钮回调
    _bankCallback       : null,         // 保险箱按钮回调
    _quitCallback       : null,         // 退出按钮回调
    _ruleCallback       : null,         // 规则按钮回调
    _trustCallback      : null,         // 托管按钮回调

    _isOpen             : false,         // 当前视窗是否开启
    _lastTime           : new Date(),    // 上一次点击开关按钮的时间
    _clickInterval      : 500,           // 开关按钮点击的时间按钮 间隔500毫秒

    _menuX              : 90,            // 菜单的初始位置
    _btnX               : 260,           // 按钮的初始位置

    _btnClose           : null,          // 点击空白关闭按钮
    
    ctor : function () {
        this._node = ccs.load("res/Games/Com/RoomBtnCtrl/RoomBtnCtrl.json").node;
        this._node.retain();
        this._init();
        return true;
    },
    
    _init : function () {
        this._btnSwitch = game.findUI(this._node, "BTN_Switch");
        this._menu = game.findUI(this._node, "ND_Menu");

        this._btnSetting = game.findUI(this._node, "BTN_Setting");
        this._btnBank = game.findUI(this._node, "BTN_Bank");
        this._btnRule = game.findUI(this._node, "BTN_Rule");
        this._btnQuit = game.findUI(this._node, "BTN_Quit");this._btnQuit.setVisible(false);
        this._btnTrust = game.findUI(this._node, "BTN_Trust");
        this._btns = [this._btnSetting, this._btnBank, this._btnTrust, this._btnRule, this._btnQuit];

        this._btnClose = game.findUI(this._node, "BTN_Close");
        this._btnClose.setVisible(false);

        this.registerBtnClick();
    },
    /**
     * 根据游戏类型重新排版按钮
     * 1、拼三张\象棋               设置 银行 规则 退出
     * 2、拼十                      设置 规则 退出
     * 3、麻将\斗地主                 设置 托管 规则 退出
     */
    _layout : function() {
        var y = 520;
        for (var i = 0; i < this._btns.length; ++i) {
            if (this._btns[i].isVisible()) {
                this._btns[i].setPositionY(y);
                y -= 120;
            }
        }
    },
    /**
     * 隐藏银行按钮
     */
    hideBank: function () {
        this._btnBank.setVisible(false);
        this._layout();
    },
    /**
     * 隐藏托管按钮
     */
    hideTrust: function () {
        this._btnTrust.setVisible(false);
        this._layout();
    },

    reset : function () {
        this._menu.setVisible(false);
        this._btnTrust.setVisible(true);
        this._btnBank.setVisible(true);
        this._btnClose.setVisible(false);
    },
    /**
     * 开关按钮回调函数
     * @private
     */
    _switchBtnClicked : function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            var time = new Date();
            if (time - this._lastTime < this._clickInterval) {
                return;
            }
            this._lastTime = time;
            this.openMenu(!this._isOpen);
        }
    },
    /**
     * 是否开启视窗
     * @param bool true 开启视窗 false关闭视窗
     */
    openMenu : function (bool) {
        if (bool) {
            this._menu.setVisible(true);
            this.playShowMenuAnimation(function () {
                this._btnClose.setVisible(true);
            }.bind(this));
        } else {
            this._btnClose.setVisible(false);
            this.playHideMenuAnimation(function () {
                this._menu.setVisible(false);
            }.bind(this));
        }
        this._isOpen = bool;
    },
    /**
     * 保险箱按钮点击回调
     * @param callback
     */
    onBankClicked : function (callback) {
        this._bankCallback = callback;
    },
    /**
     * 设置按钮点击回调
     * @param callback
     */
    onSettingClicked : function (callback) {
        this._settingCallback = callback;
    },
    /**
     * 退出按钮点击回调
     * @param callback
     */
    onQuitClicked : function (callback) {
        this._quitCallback = callback;
    },
    /**
     * 规则按钮回调 (帮助按钮回调)
     * @param callback
     */
    onRuleClicked : function (callback) {
        this._ruleCallback = callback;
    },
    /**
     * 托管按钮回调
     * @param callback
     */
    onTrustClicked: function (callback) {
        this._trustCallback = callback;
    },
    /**
     * 播放显示菜单动画
     * @param callback
     */
    playShowMenuAnimation: function (callback) {
        this._menu.stopAllActions();
        this._menu.setPositionX(this._menuX);
        var doMove = cc.moveTo(0.4, cc.pAdd(this._menu.getPosition(), cc.p(- 170, 0))).easing(cc.easeIn(0.4));
        var doCall = cc.CallFunc(function () {
            callback && callback();
        }, this);
        var delay_t = 0.1;
        for (var i = 0; i < this._btns.length; ++i) {
            if (this._btns[i].isVisible()) {
                this._btns[i].stopAllActions();
                this._btns[i].setPositionX(this._btnX);
                this._btns[i].runAction(cc.Sequence(cc.DelayTime(i*delay_t),
                    cc.moveTo(0.2, cc.pAdd(this._btns[i].getPosition(), cc.p(-180, 0)))));
            }
        }

        this._menu.runAction(cc.Sequence(doMove, doCall));
    },
    /**
     * 播放隐藏菜单动画
     * @param callback
     */
    playHideMenuAnimation: function (callback) {
        this._menu.stopAllActions();
        this._menu.setPositionX(this._menuX - 170);
        var doMove = cc.moveTo(0.2, cc.pAdd(this._menu.getPosition(), cc.p(170, 0))).easing(cc.easeIn(0.2));
        var doCall = cc.CallFunc(function () {
            callback && callback();
        }, this);
        this._menu.runAction(cc.Sequence(doMove, doCall));
    },
    /**
     * 注册按钮点击
     */
    registerBtnClick: function () {

        this._btnSwitch.addTouchEventListener(this._switchBtnClicked, this);

        this._btnSetting.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.openMenu(false);
                this._settingCallback && this._settingCallback();
            }
        }, this);

        this._btnBank.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._bankCallback && this._bankCallback();
                this.openMenu(false);
            }
        }, this);

        this._btnQuit.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._quitCallback && this._quitCallback();
                this.openMenu(false);
            }
        }, this);

        this._btnRule.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._ruleCallback && this._ruleCallback();
                this.openMenu(false);
            }
        }, this);

        this._btnTrust.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._trustCallback && this._trustCallback();
                this.openMenu(false);
            }
        }, this);

        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.openMenu(false);
            }
        }, this);

    }

});

GameRoomBtnCtrl._instance = null;

/**
 * 获取按钮
 * @return {GameRoomBtnCtrl|null}
 */
GameRoomBtnCtrl.getController = function () {
    if (this._instance == null) {
        this._instance = new GameRoomBtnCtrl();
    }
    this._instance.reset();
    return this._instance;
};
