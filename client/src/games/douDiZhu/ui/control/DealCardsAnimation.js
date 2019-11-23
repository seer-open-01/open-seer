/**
 * Author       : lyndon
 * Date         : 2018-08-09
 * Description  : 斗地主发牌动画
 */
GameWindowDouDiZhu.DealCards = cc.Class.extend({
    _node               : null,
    _parentNode         : null,

    _nd_1               : null,
    _nd_2               : null,
    _nd_3               : null,
    _cards_1            : [],           // 牌堆1
    _cards_2            : [],           // 牌堆2
    _cards_3            : [],           // 牌堆3

    _maxRound           : 17,           // 发牌最大圈数

    _time               : 0.3,          // 单张牌动画时长
    _callback           : null,         // 发牌结束回调

    _leftSpawn          : null,
    _rightSpawn         : null,

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/DealCardsAnimation/DealCards.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },
    
    _init: function () {
        this._cards_1 = [];
        this._cards_2 = [];
        this._cards_3 = [];
        this._nd_1 = game.findUI(this._node, "ND_1");
        this._nd_2 = game.findUI(this._node, "ND_2");
        this._nd_3 = game.findUI(this._node, "ND_3");
        for (var i = 1; i <= this._maxRound; ++i) {
            var card1 = this.createOneCard();this._nd_1.addChild(card1);this._cards_1.push(card1);
            var card2 = this.createOneCard();this._nd_2.addChild(card2);this._cards_2.push(card2);
            var card3 = this.createOneCard();this._nd_3.addChild(card3);this._cards_3.push(card3);
        }
        this.reset();
        this.createSpawn();
    },

    reset: function () {
        this._nd_1.setVisible(false);
        this._nd_2.setVisible(false);
        this._nd_3.setVisible(false);
        for (var i = 0; i < this._maxRound; ++i) {
            this.__oneReset(this._cards_1[i]);
            this.__oneReset(this._cards_2[i]);
            this.__oneReset(this._cards_3[i]);
        }

        this._callback = null;
    },
    /**
     * 单张牌初始化动画属性
     * @param sprite
     * @private
     */
    __oneReset: function (sprite) {
        sprite.setScale(0);
        sprite.setPosition(0, 0);
        sprite.setOpacity(150);
        sprite.stopAllActions();
    },
    /**
     * 开始发牌
     * 该接口调用前务必先调用reset(),然后设置callback
     */
    start: function () {
        this._nd_1.setVisible(true);
        this._nd_2.setVisible(true);
        this._nd_3.setVisible(true);
        for (var i = 0; i < this._maxRound; ++i) {
            this.midAct(this._cards_1[i], i);
            this.leftAct(this._cards_2[i], i);
            this.rightAct(this._cards_3[i], i);
        }
        game.Audio.ddzPlayOtherEffect(2);
    },
    /**
     * 离开游戏界面的时候清楚该动画
     */
    clear: function () {
        cc.log("=== 清除发牌动画 ===");
        this._rightSpawn.release();
        this._leftSpawn.release();
    },
    /**
     * 本玩家单张牌运动封装
     * @param sprite
     * @param index
     */
    midAct: function (sprite, index) {
        // cc.log("=============mid " + index);
        var doBezier = this.getBezierAction(this._time, cc.p(0, 0), cc.p(-520 + 60 * index, -430), 1);
        var doFade = cc.FadeIn(this._time);
        var doScale = cc.ScaleTo(this._time, 0.99);
        var doSpawn = cc.Spawn(doBezier, doScale, doFade);
        var doDelay = cc.DelayTime(0.01 * index);

        if (index < this._maxRound - 1) {
            sprite.runAction(cc.Sequence(doDelay, doSpawn));
        }else {
            sprite.runAction(cc.Sequence(doDelay, doSpawn, cc.CallFunc(function () {
                cc.log("=== 发牌动画回调 ===");
                this._callback && this._callback();
                this.reset();
            }, this)));
        }
    },
    /**
     * 左边玩家单张牌运动封装
     * @param sprite
     * @param index
     */
    leftAct: function (sprite, index) {
        // cc.log("=============left " + index);
        var doDelay = cc.DelayTime(0.01 * index);
        sprite.runAction(cc.Sequence(doDelay, this._leftSpawn));
    },
    /**
     * 右边玩家单张牌运动封装
     * @param sprite
     * @param index
     */
    rightAct: function (sprite, index) {
        // cc.log("=============right " + index);
        var doDelay = cc.DelayTime(0.01 * index);
        sprite.runAction(cc.Sequence(doDelay, this._rightSpawn));
    },
    /**
     * 贝塞尔曲线
     */
    getBezierAction: function (time, startPosition, endPosition, biased) {
        // 轨迹的直线向量
        var vec1 = cc.p(endPosition.x - startPosition.x, endPosition.y - startPosition.y);
        // 向量的旋转角度
        var angle = 15;
        // 余角偏移，角度反转
        if (biased == 0) {
            angle = -angle;
        }
        // 向量的角度转换成弧度
        var radian = angle * Math.PI / 180;
        // 向量旋转后的坐标
        var cosAngle = Math.cos(radian);
        var sinAngle = Math.sin(radian);
        var x = vec1.x * cosAngle - vec1.y * sinAngle;
        var y = vec1.x * sinAngle + vec1.y * cosAngle;
        var random = 150;
        if (biased == 1) {
            random = 30;
        }
        var vec2 = cc.p(Math.floor(x * random * 0.01), Math.floor(y * random * 0.01));
        var controlPoint = cc.p(startPosition.x + vec2.x, startPosition.y + vec2.y);
        var bezierToConfig = [
            controlPoint,                 // 起点控制点
            controlPoint,                 // 终点控制点
            cc.p(endPosition.x, endPosition.y)      // 终点
        ];
        return cc.bezierTo(time, bezierToConfig).easing(cc.easeSineOut());
    },
    /**
     * 设置发牌动画结束回调
     * @param callback
     */
    setCallBack: function (callback) {
        this._callback = callback;
    },
    /**
     * 创建一张扑克
     * @returns {*}
     */
    createOneCard: function () {
        return new cc.Sprite("res/Games/DouDiZhu/Poker/100.png");
    },
    /**
     * 预先设置可复用的一些动画
     */
    createSpawn: function () {
        var doBezier1 = this.getBezierAction(this._time, cc.p(0, 0), cc.p(-430, -100), 0);
        var doBezier2 = this.getBezierAction(this._time, cc.p(0, 0), cc.p(420, -100), 2);
        var doFade = cc.FadeIn(this._time);
        var doScale = cc.ScaleTo(this._time, 0.5);
        this._leftSpawn = cc.Spawn(doBezier1, doScale, doFade);
        this._rightSpawn = cc.Spawn(doBezier2, doScale, doFade);
        this._leftSpawn.retain();
        this._rightSpawn.retain();
    }
});
/**
 * 566不洗牌发牌模式
 * 动画不用贝塞尔曲线直接改用move
 */
GameWindowDouDiZhu.DealCardsSub = GameWindowDouDiZhu.DealCards.extend({

    _maxRound               : 3,

    midAct: function (sprite, index) {
        // cc.log("=============mid " + index);
        var doBezier = cc.MoveTo(this._time, cc.p(-300 + 300 * index, -430));
        var doFade = cc.FadeIn(this._time);
        var doScale = cc.ScaleTo(this._time, 0.99);
        var doSpawn = cc.Spawn(doBezier, doScale, doFade);
        var doDelay = cc.DelayTime(0.06 * index);

        if (index < this._maxRound - 1) {
            sprite.runAction(cc.Sequence(doDelay, doSpawn));
        }else {
            sprite.runAction(cc.Sequence(doDelay, doSpawn, cc.CallFunc(function () {
                cc.log("=== 发牌动画回调 ===");
                this._callback && this._callback();
                this.reset();
            }, this)));
        }
    },

    leftAct: function (sprite, index) {
        // cc.log("=============left " + index);
        var doDelay = cc.DelayTime(0.06 * index);
        sprite.runAction(cc.Sequence(doDelay, this._leftSpawn));
    },

    rightAct: function (sprite, index) {
        // cc.log("=============right " + index);
        var doDelay = cc.DelayTime(0.06 * index);
        sprite.runAction(cc.Sequence(doDelay, this._rightSpawn));
    },

    createOneCard: function () {
        return new cc.Sprite("res/Games/DouDiZhu/Poker/t_100.png");
    },

    /**
     * 预先设置可复用的一些动画
     */
    createSpawn: function () {
        var doMove1 = cc.MoveTo(this._time, cc.p(-430, -40));
        var doMove2 = cc.MoveTo(this._time, cc.p(-430, -40));
        var doFade = cc.FadeIn(this._time);
        var doScale = cc.ScaleTo(this._time, 0.5);
        this._leftSpawn = cc.Spawn(doMove1, doScale, doFade);
        this._rightSpawn = cc.Spawn(doMove2, doScale, doFade);
        this._leftSpawn.retain();
        this._rightSpawn.retain();
    }
});