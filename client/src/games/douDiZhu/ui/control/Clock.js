/**
 * Created by lyndon on 2018/06/25.
 *  斗地主
 */
GameWindowDouDiZhu.Clock = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点

    _fntTime            : null,         // 倒计时数字节点
    _numTime            : 0,            // 时间

    shakeStrengthX      : 3,            // 抖动x范围
    shakeStrengthY      : 1,            // 抖动y范围
    nodeInitialPos      : null,         // 闹钟初始位置
    bindCallback        : null,         // 抖动回调
    dtCost              : 0,            // 已经抖动的时间
    duration            : 0.5,          // 抖动间隔

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/Clock/Clock.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },
    
    _init: function () {
        this._fntTime = game.findUI(this._node, "Fnt_Clock");

        this.nodeInitialPos = this._node.getPosition();
    },
    
    reset: function () {
        this._fntTime.stopAllActions();
        this._fntTime.setString(0);
        this._node.unschedule(this.bindCallback);
        this._node.setPosition(this.nodeInitialPos);
    },
    
    show: function (bool) {
        this._node.setVisible(bool);
    },

    start: function (time, pos) {
        this.reset();
        if (pos != null && pos != undefined) {
            this._parentNode.setPosition(pos);
        }
        this._numTime = time < 0 ? 0 : time;
        this._fntTime.setString("" + this._numTime);

        var doDelay = cc.DelayTime(1.0);
        var doCall = cc.CallFunc(function () {
            this.updateTime();
        }, this);

        this._fntTime.stopAllActions();
        this._fntTime.runAction(cc.sequence(doDelay, doCall).repeatForever());
    },

    updateTime: function () {
        this._numTime -= 1;

        if (this._numTime <= 5 && this._numTime >= 0) {
            var gameData = game.procedure.DouDiZhu.getGameData();

            this.doShake();
            if (gameData.curPlay == gameData.playerIndex){
                // 声音
                game.Audio.ddzPlayAlarm();
            }
        }


        if (this._numTime < 1) {
            this._numTime = 0;
            this._fntTime.stopAllActions();
        }
        this._fntTime.setString("" + this._numTime);
    },

    // 抖动功能
    doShake: function () {
        this.dtCost = 0;
        this.bindCallback = this.doSchedule.bind(this);
        this._node.unschedule(this.bindCallback);
        this._node.schedule(this.bindCallback,0,cc.REPEAT_FOREVER,0);
    },
    /**
     * 计时器
     * @param dt
     */
    doSchedule: function (dt) {
        var dt2 = dt * 30;
        var randX = this.getRandomStrength(-this.shakeStrengthX, this.shakeStrengthX) * dt2;
        var randY = this.getRandomStrength(-this.shakeStrengthY, this.shakeStrengthY) * dt2;
        this._node.setPosition(cc.pAdd(this.nodeInitialPos, cc.p(randX, randY)));
        this.dtCost += dt;
        if (this.dtCost >= this.duration) {
            this._node.unschedule(this.bindCallback);
            this._node.setPosition(this.nodeInitialPos);
        }
    },
    /**
     * 获取随机位置
     * @param min
     * @param max
     * @returns {*}
     */
    getRandomStrength: function (min, max) {
        return Math.random() * (max - min + 1) + min;
    }

});