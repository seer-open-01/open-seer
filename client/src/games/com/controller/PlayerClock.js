/**
 * 玩家头像倒计时
 */
GameWindowBasic.PlayerClock = cc.Class.extend({

    _node               : null,         // 本节点

    _fntTime            : null,         // 倒计时字体
    _spFrame            : null,         // 边框精灵
    _bgFrame            : null,         // 背景精灵
    _timeNum            : 0,            // 当前的时间

    _timeProcessFrame   : null,         // 倒计时控制边框

    _underFiveCallback  : null,         // 剩下最后5秒的时候执行的回调(每秒调用)

    ctor : function () {
        this._node = ccs.load("res/Games/Com/Clock/Clock.json").node;
        this._node.retain();
        this._init();
        return true;
    },

    _init : function () {
        this._fntTime = game.findUI(this._node, "FNT_Time");
        this._spFrame = game.findUI(this._node, "ND_Frame");
        this._bgFrame = game.findUI(this._node, "BG_Clock");
        this._spFrame.removeFromParent(false);
        this._timeProcessFrame = new cc.ProgressTimer(this._spFrame);
        // this._timeProcessFrame.setPosition(cc.p(-5, -5));
        this._node.addChild(this._timeProcessFrame);
        this._timeProcessFrame.setType(cc.ProgressTimer.TYPE_RADIAL);
        this._timeProcessFrame.setBarChangeRate(cc.p(1, 0));
        this._timeProcessFrame.setReverseDirection(true);
        this._timeNum = 0;
    },

    reset : function () {
        this._timeNum = 0;
        this._fntTime.setString("" + 0);
        this._node.stopAllActions();
        // this._underFiveCallback = null;
    },

    /**
     * 是否显示该对象
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    },

    addToNode : function (uiNode) {
        this._node.removeFromParent(false);
        if (uiNode == null) {
            return;
        }
        uiNode.addChild(this._node);
    },

    /**
     * 设置最后5秒调用的函数
     * @param callback
     */
    setUnderFiveCallback : function (callback) {
        this._underFiveCallback = callback;
    },

    /**
     * 开始倒计时
     * @param time 倒计时的秒数
     * @param durationTime 持续时间
     */
    start : function (time, durationTime) {
        durationTime = durationTime || 60;

        this._timeNum = time;
        this._fntTime.setString("" + this._timeNum);

        var doDelay = cc.delayTime(1.0);
        var doCall = cc.CallFunc(function () {
            this.updateTime();
        },this);

        this._node.stopAllActions();
        this._node.runAction(cc.Sequence(doCall, doDelay).repeatForever());


        var percentage = Math.floor(time / durationTime * 100);
        this._timeProcessFrame.runAction(cc.ProgressFromTo(time, percentage, 0));
    },
    /**
     * 更新倒计时
     */
    updateTime : function () {
        this._timeNum -= 1;
        // cc.log("=================== " + this._timeNum);
        if (this._timeNum <= 5) {
            this._underFiveCallback && this._underFiveCallback(this._timeNum);
        }

        if (this._timeNum <= 5 && this._timeNum > 0) {
            if (game.Procedure.getProcedure() == game.procedure.PinSan) {
                var gameData = game.procedure.PinSan.getGameData();
                if (gameData.curPlayer == gameData.playerIndex)
                    game.Audio.PSZPlayAlarm();
            }
        }

        if (this._timeNum < 1) {
            this._timeNum = 0;
            this._node.stopAllActions();
        }
        this._fntTime.setString("" + this._timeNum);
    },
    
    setGameMode: function (type) {
        if (type == GameTypeConfig.type.CDMJ) {
            this._bgFrame.setVisible(false);
            this._fntTime.setVisible(false);
        }else {
            this._bgFrame.setVisible(true);
            this._fntTime.setVisible(true);
        }
    }
});

GameWindowBasic.PlayerClock._instance = null;

/**
 * 获取倒计时控件
 */
GameWindowBasic.PlayerClock.getController = function () {
    if (this._instance == null) {
        this._instance = new GameWindowBasic.PlayerClock();
        this._instance.reset();
    }
    return this._instance;
};