/**
 * Created by Jiyou Mo on 2017/12/1.
 */
// 游戏开始前按钮
GameWindowPinSan.PreBegin = cc.Class.extend({
    
    _node               : null,         // 本节点
    _parentNode         : null,         // 父节点
    _nd1                : null,         // 节点1
    _btnReady           : null,         // 准备按钮
    _btnChange          : null,         // 换桌按钮
    _labelTime          : null,         // 倒计时
    _nd2                : null,         // 节点2
    _btnInvite          : null,         // 邀请
    _btnReady2          : null,         // 准备

    _readyCallback      : null,         // 准备按钮回调
    _changeCallback     : null,         // 换桌按钮回调

    _countDown          : 0,            // 当前倒计时的时间

    
    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinSan/PreBegin/PreBegin.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },
    
    _init : function () {
        this._countDown = 0;
        this._nd1 = game.findUI(this._node, "ND_1");
        this._btnReady = game.findUI(this._node, "BTN_Ready");
        this._btnChange = game.findUI(this._node, "BTN_Change");
        this._labelTime = game.findUI(this._node, "ND_Time");

        this._nd2 = game.findUI(this._node, "ND_2");
        this._btnInvite = game.findUI(this._nd2, "BTN_Invite");
        this._btnReady2 = game.findUI(this._nd2, "BTN_Ready");

        var gameData = game.procedure.PinSan.getGameData();
        if (gameData.isCreator()) {
            this._btnReady2.loadTextureNormal("res/Common/Images/Btn_Begin_0.png");
            this._btnReady2.loadTexturePressed("res/Common/Images/Btn_Begin_1.png");
            this._btnReady2.loadTextureDisabled("res/Common/Images/Btn_Begin_2.png");
        }else {
            this._btnReady2.loadTextureNormal("res/Common/Images/Btn_Ready_0.png");
            this._btnReady2.loadTexturePressed("res/Common/Images/Btn_Ready_1.png");
            this._btnReady2.loadTextureDisabled("res/Common/Images/Btn_Ready_0.png");
        }

        this.registerBtnClick();
    },
    
    reset : function () {
        this.startChangeCountDown(1.2);
        this._btnChange.stopAllActions();
        this._btnChange.setPosition(cc.p(-140, 0));
        this._countDown = 0;
        this._updateReadyCountDown();
    },
    
    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 是否显示所有按钮
     */
    showBtnType : function (mod) {
        this._nd1.setVisible(mod == 1);
        this._nd2.setVisible(mod == 2);
    },

    /**
     * 是否显示所有按钮
     * @param bool
     */
    showAllBtns : function (bool) {
        this.showReadyBtn(bool);
        this.showChangeDeskBtn(bool);
    },

    /**
     * 显示准备按钮
     * @param bool
     */
    showReadyBtn : function (bool) {
        this._btnReady.setVisible(bool);
        this._labelTime.setVisible(bool);
        if (!bool) {
            this._btnChange.runAction(cc.moveTo(0.2, 0, 0));
        }
    },

    /**
     * 显示换桌按钮
     * @param bool
     */
    showChangeDeskBtn : function (bool) {
        this._btnChange.setVisible(bool);
    },

    /**
     * 更新准备倒计时的值
     * @private
     */
    _updateReadyCountDown : function () {
        this._countDown -= 1;
        if (this._countDown < 6 && this._countDown > 0) {
            game.Audio.PSZPlayAlarm();
        }
        if (this._countDown < 1) {
            this._countDown = 0;
            this._btnReady.stopAllActions();
        }
        this._labelTime.setString("(" + this._countDown + ")");
    },
    /**
     * 开启准备倒计时
     */
    startReadyCountDown : function () {
        var actionTimer = game.procedure.PinSan.getGameData().getMainPlayer().actionTimer;
        // cc.log("============================= " + JSON.stringify(actionTimer));
        var stamp = actionTimer.stamp;          // 开始时间
        var duration = actionTimer.duration;    // 持续时间
        var serverTime = ServerDate.getOffsetTime(stamp + duration);
        this._countDown = Math.floor(serverTime * 0.001) + 1 || 0;

        var doDelay = cc.DelayTime(1.0);
        var doCall = cc.CallFunc(function () {
            this._updateReadyCountDown();
        }, this);

        this._btnReady.stopAllActions();
        this._btnReady.runAction(cc.Sequence(doCall, doDelay).repeatForever());
    },
    /**
     * 开启换桌倒计时
     */
    startChangeCountDown: function (time) {
        this._node.stopAllActions();
        this._btnChange.setEnabled(false);
        var doDelay = cc.delayTime(time);
        var doCall = cc.CallFunc(function () {
            this._btnChange.setEnabled(true);
        }, this);

        this._node.runAction(cc.sequence(doDelay, doCall));
    },
    stopCountDown: function () {
        this._countDown = 0;
        this._btnReady.stopAllActions();
    },
    /**
     * 准备按钮被点击回调
     * @param callback
     */
    onReadyClicked : function (callback) {
        this._readyCallback = callback;
    },
    /**
     * 换桌按钮被点击回调
     * @param callback
     */
    onChangeDeskClicked : function (callback) {
        this._changeCallback = callback;
    },
    /**
     * 开始按钮置灰接口--房卡场专用
     * @param bool
     */
    setBeginEnabled: function (bool) {
        this._btnReady2.setEnabled(bool);
    },
    /**
     * 注册按钮点击
     */
    registerBtnClick: function () {
        this._btnReady.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.showReadyBtn(false);
                this._readyCallback && this._readyCallback();
            }
        }, this);

        this._btnChange.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.startChangeCountDown(3.0);
                this._changeCallback && this._changeCallback();
            }
        }, this);

        this._btnInvite.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.log("邀请按钮被点击！");
                if (WeChat.isWechatInstalled && WeChat.isWechatInstalled()) {
                    var shareTitle = "《赛亚麻将》:拼三张自建房";
                    var shareMsg = "操作简单，玩法刺激！还在等什么，快来一战到底！";
                    shareMsg +=　"\n房间号：" + game.DataKernel.roomId;
                    WeChat.share(false, game.config.WECHAT_SHARE_URL + game.DataKernel.uid, shareTitle, shareMsg, function (ok) {});
                } else {
                    cc.log("==> 微信没有安装");
                }
            }
        }, this);

        this._btnReady2.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.showReadyBtn(false);
                this._readyCallback && this._readyCallback();
            }
        }, this);
    }
});
