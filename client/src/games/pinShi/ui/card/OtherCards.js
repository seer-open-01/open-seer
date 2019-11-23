/**
 * Created by lyndon on 2018/05/16.
 *  其他玩家手牌
 */
GameWindowPinShi.OtherCards = cc.Class.extend({
    _parentNode             : null,             // 父节点
    _node                   : null,             // 本节点

    _cards                  : [],               // 手牌对象数组

    ctor: function () {
        this._node = ccs.load("res/Games/PinShi/Card/OtherCards.json").node;
        this._init();
        return true;
    },

    _init: function () {
        this._cards = [];
        var temp = null;
        for (var i = 1; i <= 5; ++i) {
            temp = new GameWindowPinShi.OtherCard(game.findUI(this._node, "ND_Card_" + i));
            this._cards.push(temp);
        }

    },

    reset: function () {
        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].reset();
        }
    },

    show: function (bool) {
        this._node.setVisible(bool);
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
     * 设置手牌
     * @param cards 数组
     */
    setCardsValue: function (cards) {
        // cc.log("========================= " + JSON.stringify(cards));
        for (var i = 0; i < this._cards.length; ++i) {
            if(i >= cards.length){
                this._cards[i].reset();
            }else {
                this._cards[i].setValue(cards[i]);
            }
        }
    },
    /**
     * 添加牌
     * @param values    添加的牌的数组
     */
    addCards: function (values) {
        var thisValues = this.getCardsValue();
        for (var i = 0; i < values.length; ++i) {
            thisValues.push(values[i]);
        }
        this.setCardsValue(thisValues);
    },
    /**
     * 获取当前牌的值数组
     * @return {Array}
     */
    getCardsValue : function () {
        var values = [];
        for (var i = 0; i < this._cards.length; ++i) {
            var value = this._cards[i].getValue();
            if (value != -1) {
                values.push(value);
            }
        }
        return values;
    }
});