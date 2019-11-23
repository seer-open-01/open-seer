/**
 * Created by pander on 2018/5/16.
 */
// ==== 麻将游戏 桌牌控件 ===============================================
GameWindowMahjong.TableCards = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点

    _uiIndex            : null,         // 座位方位

    _cards              : [],           // 方位的牌
    
    _cardsNumber        : 0,            // 桌牌的数量

    ctor : function (uiIndex, parentNode) {
        this._uiIndex = uiIndex;
        this._parentNode = parentNode;
        var gameData = game.procedure.Mahjong.getGameData();
        var dirStr = gameData.getDirectionString(this._uiIndex);
        this._node = ccs.load("res/Games/Mahjong/Cards/TableCards" + dirStr + ".json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._cards = [];
        for (var i = 1; i < 25; ++i) {
            this._cards.push(new GameWindowMahjong.TableCard(this._uiIndex, game.findUI(this._node, "" + i)));
        }
    },

    reset : function () {
        this._cards.forEach(function (card) {
            card.reset();
        });
        
        this._cardsNumber = 0;
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置花牌的值
     * @param cardsArray     牌的值的数组
     */
    setCardsValues : function (cardsArray) {
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < cardsArray.length) {
                this._cards[i].setValue(cardsArray[i]);
            } else {
                this._cards[i].reset();
            }
        }
        
        this._cardsNumber = cardsArray.length;
        if (this._cardsNumber > this._cards.length) {
            this._cardsNumber = this._cards.length;
        }
    },

    /**
     * 添加一张牌
     * @param cardValue
     */
    addCard : function (cardValue) {
        this._cards[this._cardsNumber++].setValue(cardValue);
        if (this._cardsNumber > this._cards.length) {
            this._cardsNumber = this._cards.length;
        }

        this.addIndicatorForLastCard();
    },

    /**
     * 移除最后一张牌
     * @returns {*}  移除的这张牌的值
     */
    removeLastCard : function () {
        if (this._cardsNumber < 1) {
            return -1;
        }
        var card = this._cards[--this._cardsNumber];
        var value = card.getValue();
        card.reset();
        return value;
    },

    /**
     * 获取最后一张牌的值
     * @returns {*}
     */
    getLastCardValue : function () {
        if (this._cardsNumber < 1) {
            return -1;
        }

        return this._cards[this._cardsNumber - 1].getValue();
    },

    /**
     * 给最后一张牌添加指示器
     */
    addIndicatorForLastCard : function () {
        if (this._cardsNumber < 1) {
            return;
        }

        this._cards[this._cardsNumber - 1].addIndicator();
    },

    /**
     * 显示高亮的牌
     * @param value
     */
    showLightCards : function (value) {
        if (this._cardsNumber < 1) {
            return;
        }
        for (var i = 0; i < this._cardsNumber; ++i) {
            this._cards[i].showLight(this._cards[i].getValue() == value);
        }
    },

    /**
     * 隐藏高亮的牌
     */
    hideLightCards : function () {
        if (this._cardsNumber < 1) {
            return;
        }
        for (var i = 0; i < this._cardsNumber; ++i) {
            this._cards[i].showLight(false);
        }
    }
});
