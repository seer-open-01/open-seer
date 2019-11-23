/**
 * Created by Jiyou Mo on 2017/11/27.
 */
// 拼三张 单张牌的管理
GameWindowPinSan.Card = cc.Class.extend({

    _node               : null,         // 本节点

    _originalPosition   : null,         // 牌的原来位置
    _originalRotation   : null,         // 牌原来的选择角度
    
    _imgCard            : null,         // 图片资源
    _value              : -1,           // 当前图片的值

    ctor : function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init : function () {
        this._imgCard = this._node;
        this._originalPosition = this._node.getPosition();
        this._originalRotation = this._node.getRotation();
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },
    
    reset : function () {
        this.setCardValue(-1);
        this.show(false);
        this.resetOrientation();
    },

    /**
     * 还原方位
     */
    resetOrientation : function () {
        this._node.setPosition(this._originalPosition);
        this._node.setRotation(this._originalRotation);
    },

    /**
     * 运行牌的动画
     * @param action
     * @param completeCallback
     */
    runCardAction : function (action, completeCallback) {
        this._imgCard.runAction(cc.sequence(action, cc.CallFunc(function () {
            completeCallback && completeCallback();
        })));
    },

    /**
     * 停止牌的所有动画
     */
    stopCardAllActions : function () {
        this._imgCard.stopAllActions();
    },

    /**
     * 没有回调的运行动画 (用于持续动画)
     * @param action
     */
    runCardActionWithoutCallback : function (action) {
        this._imgCard.runAction(action);
    },

    /**
     * 停止指定运行的动画
     * @param action
     */
    stopCardAction : function (action) {
        this._imgCard.stopAction(action);
    },

    /**
     * 设置牌的值 并改变牌面显示
     * @param value  -1 会隐藏该牌
     */
    setCardValue : function (value) {
        this._imgCard.setVisible(false);
        this._value = value;
        if (this._value != -1) {
            this._imgCard.loadTexture(GameWindowPinSan.Card.RES_PATH + value + ".png");
            this._imgCard.setVisible(true);
        }
    },

    /**
     * 获取当前牌的值
     * @return {number|*}
     */
    getCardValue : function () {
        return this._value;
    },

    /**
     * 获取当前牌的值 带旋转效果
     * @param value
     * @param completeCallback
     */
    setCardValueWithTurnPage : function (value, completeCallback) {
        this._imgCard.setVisible(false);
        this._value = value;
        if (this._value == -1) {
            completeCallback && completeCallback();
            return;
        }
        this._imgCard.setVisible(true);
        var scaleTo1 = new cc.ScaleTo(0.2, 0, 1);
        var fun1 = cc.CallFunc(function () {
            this._imgCard.loadTexture(GameWindowPinSan.Card.RES_PATH + value + ".png");
        }, this);
        var scaleTo2 = new cc.ScaleTo(0.2, 1, 1);
        var fun2 = cc.CallFunc(function () {
            completeCallback && completeCallback();
        }, this);

        this._imgCard.runAction(cc.sequence(scaleTo1, fun1, scaleTo2, fun2));
    },

    /**
     * 设置该张牌为深色
     * @param bool
     */
    setDarkColor : function (bool) {
        bool ? this._imgCard.setColor(cc.color(128, 128, 128)) : this._imgCard.setColor(cc.color(255, 255, 255));
    }
});

GameWindowPinSan.Card.RES_PATH = "res/Games/PinSan/Pokers/";
