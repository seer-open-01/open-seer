/**
 * Created by Jiyou Mo on 2017/11/27.
 */
// 拼三张 手牌管理类
GameWindowPinSan.HandCards = cc.Class.extend({
    
    _node               : null,         // 本节点

    _cards              : [],           // 牌对象数组

    _shakeActions       : [],           // 抖动的动作数组
    _isShake            : false,        // 当前手牌是否在抖动
    
    ctor : function () {
        this._node = ccs.load("res/Games/PinSan/HandCards/HandCards.json").node;
        this._init();
        return true;
    },

    _init : function () {
        this._cards = [];
        for (var i = 1; i < 4; ++i) {
            var card = new GameWindowPinSan.Card(game.findUI(this._node, "ND_Cards_" + i));
            card.reset();
            this._cards.push(card);
        }
    },
    
    show : function (bool) {
        this._node.setVisible(bool);
    },
    
    reset : function () {
        this.setDarkColor(false);
        this.setCardsValues([]);
        this.orientation();
    },

    /**
     * 添加到节点
     * @param uiNode    被添加的节点
     * @param position  在被添加节点的位置
     */
    addToNode : function (uiNode, position) {
        this._node.setPosition(position || cc.p(0, 0));
        uiNode.addChild(this._node);
    },

    /**
     * 设置拍的值
     * @param values    牌值的数组
     */
    setCardsValues : function (values) {
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < values.length) {
                this._cards[i].setCardValue(values[i]);
            } else {
                this._cards[i].setCardValue(-1);
            }
        }
    },

    /**
     * 添加牌
     * @param values    添加的牌的数组
     */
    addCardsValues : function (values) {
        var thisValues = this.getCardsValues();
        for (var i = 0; i < values.length; ++i) {
            thisValues.push(values[i]);
        }
        this.setCardsValues(thisValues);
    },

    /**
     * 获取当前牌的值数组
     * @return {Array}
     */
    getCardsValues : function () {
        var values = [];
        for (var i = 0; i < this._cards.length; ++i) {
            var value = this._cards[i].getCardValue();
            if (value != -1) {
                values.push(value);
            }
        }

        return values;
    },

    /**
     *
     * @param values
     * @param completeCallback
     */
    setCardsValuesWithTurnPage : function (values, completeCallback) {
        if (values.length < 1) {
            completeCallback && completeCallback();
            return;
        }

        this._cards[0].setCardValueWithTurnPage(values[0], completeCallback);

        for (var i = 1; i < this._cards.length; ++i) {
            if (i < values.length) {
                this._cards[i].setCardValueWithTurnPage(values[i]);
            } else {
                this._cards[i].setCardValue(-1);
            }
        }
    },

    /**
     * 牌还原成扇形
     */
    changeToSector : function () {
        var moveTo = cc.moveTo(0.2, cc.p(-61, -12));
        var rotation = cc.rotateTo(0.2, -16);
        this._cards[0].stopCardAllActions();
        this._cards[0].runCardAction(cc.spawn(moveTo, rotation));
        moveTo = cc.moveTo(0.2, cc.p(61, -12));
        rotation = cc.rotateTo(0.2, 16);
        this._cards[2].stopCardAllActions();
        this._cards[2].runCardAction(cc.spawn(moveTo, rotation));
    },

    /**
     * 还原手牌形状
     */
    orientation : function () {
        this._cards[0].resetOrientation();
        this._cards[2].resetOrientation();
    },
    /**
     * 设置牌是否深色
     * @param bool
     */
    setDarkColor : function (bool) {
        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].setDarkColor(bool);
        }
    }
});
