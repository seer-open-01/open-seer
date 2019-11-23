// 登陆界面UI
game.ui.HomeWindow = cc.Layer.extend({

    _node               : null,
    _eff                : null,
    //=== 主要UI模块 ===
    _ndTop              : null,         // 上方UI节点
    _topUI              : null,         // 上方UI
    _ndBottom           : null,         // 下方UI节点
    _bottomUI           : null,         // 下方UI
    _ndLeft             : null,         // 左侧UI节点
    _leftUI             : null,         // 左侧UI
    _ndRight            : null,         // 右侧UI节点
    _rightUI            : null,         // 右侧UI

    ctor: function () {
        this._super();

        cc.log("==> 大厅001 " + (new Date).format("h:m:s.S"));
        this._node = ccs.load("res/Home/Home.json").node;
        this.addChild(this._node);
        this.initUI();
        this.retain();

        return true;
    },

    initUI : function(){
        cc.log("==> 大厅002 " + (new Date).format("h:m:s.S"));
        
        this._ndTop = game.findUI(this._node, "ND_Top");
        this._topUI = new game.ui.HomeTop(this._ndTop);

        this._ndBottom = game.findUI(this._node, "ND_Bottom");
        this._bottomUI = new game.ui.HomeBottom(this._ndBottom);

        this._ndLeft = game.findUI(this._node, "ND_Left");
        this._leftUI = new game.ui.HomeLeft(this._ndLeft);

        this._ndRight = game.findUI(this._node, "ND_Right");
        this._rightUI = new game.ui.HomeRight(this._ndRight);

        this._eff = game.findUI(this._node, "ND_Crab");

    },

    // 更新UI界面
    updateInfo : function () {
        this._topUI.updateInfo();

        // this.crabMove();
    },
    // 更新邮件小红点
    updateMailStatus: function (vis) {
        this._bottomUI.showMailDot(vis);
    },
    // 更新任务小红点
    updateTaskStatus: function (vis) {
        this._bottomUI.showTaskDot(vis);
    },
    // 更新好友小红点
    updateFriendStatus: function (vis) {
        this._bottomUI.showFriendDot(vis);
    },
    // 更新大喇叭消息
    updateHorns: function (data) {
        this._leftUI.updateHorns(data);
    },
    // 获取上方UI控件
    getTopUI: function () {
        return this._topUI;
    },
    // 获取下方UI控件
    getBottomUI: function () {
        return this._bottomUI;
    },
    // 获取左边UI控件
    getLeftUI: function () {
        return this._leftUI;
    },
    // 获取右边UI控件
    getRightUI: function () {
        return this._rightUI;
    },
    // 螃蟹爬爬
    crabMove: function () {
        // 播放动画
        var action = ccs.load("res/Animations/EffHall/EffPangXie.json").action;
        action.play("animation0", true);
        this._eff.setPosition(cc.p(1360, 60));
        this._eff.stopAllActions();
        var move = cc.MoveTo(36, cc.p(-60, 60));
        this._eff.runAction(action);
        this._eff.runAction(cc.Sequence(move, cc.CallFunc(function () {
            this._eff.setPosition(cc.p(1360, 60));
        }, this), cc.DelayTime(1.0)).repeatForever());
    },
    // 播放窗口中的持续动效
    playWindowEffectAnimation : function () {
        this._rightUI.playButtonEffect();
        this._bottomUI.playButtonEffect();
    },
    // 进入大厅UI动画
    playEnterAnimation: function (callback) {
        // 上部
        var topEPos = cc.p(0, 580);
        var topBPos = cc.p(0, 800);
        this._ndTop.setPosition(topBPos);
        // 下部
        var bottomEPos = cc.p(0, -8);
        var bottomBPos = cc.p(0, -800);
        this._ndBottom.setPosition(bottomBPos);
        // 左边
        var leftEPos = cc.p(0, 152);
        var leftBPos = cc.p(-400, 152);
        this._ndLeft.setPosition(leftBPos);
        // 右边
        var rightEPos = cc.p(449, 120);
        var rightBPos = cc.p(1300, 120);
        this._ndRight.setPosition(rightBPos);

        this._doMoveEffect(this._ndTop, topEPos, 0, null);
        this._doMoveEffect(this._ndBottom, bottomEPos, 0.1, null);
        this._doMoveEffect(this._ndLeft, leftEPos, 0.2, null);
        this._doMoveEffect(this._ndRight, rightEPos, 0.2, function () {
            callback && callback();
        }.bind(this));

    },
    
    // 离开大厅UI动画
    playLeaveAnimation: function (callback) {
        // 上部
        var topBPos = cc.p(0, 580);
        var topEPos = cc.p(0, 800);
        this._ndTop.setPosition(topBPos);
        // 下部
        var bottomBPos = cc.p(0, -8);
        var bottomEPos = cc.p(0, -800);
        this._ndBottom.setPosition(bottomBPos);
        // 左边
        var leftBPos = cc.p(0, 152);
        var leftEPos = cc.p(-400, 152);
        this._ndLeft.setPosition(leftBPos);
        // 右边
        var rightBPos = cc.p(449, 120);
        var rightEPos = cc.p(1300, 120);
        this._ndRight.setPosition(rightBPos);

        this._doMoveEffect(this._ndRight, rightEPos, 0, null);
        this._doMoveEffect(this._ndLeft, leftEPos, 0.1, null);
        this._doMoveEffect(this._ndBottom, bottomEPos, 0.2, null);
        this._doMoveEffect(this._ndTop, topEPos, 0.2, function () {
            callback && callback();
        }.bind(this));
    },

    // 动画封装
    _doMoveEffect: function (node, ePos, delayTime, callback) {
        node.stopAllActions();
        var doMove = cc.MoveTo(0.2, ePos).easing(cc.easeIn(0.2));
        var doDelay = cc.DelayTime(delayTime);
        var doCall = cc.CallFunc(function () {
            callback && callback();
        }, this);
        var doSeq = cc.Sequence(doDelay, doMove, doCall);
        node.runAction(doSeq)
    }
});