/**
 * Created by pander on 2018/5/16.
 */
// ==== 麻将游戏 特殊牌控件 ===================================
GameWindowMahjong.SpecialCards = cc.Class.extend({
    _node               : null,         // 本节点

    _uiIndex            : 0,            // 方位的值

    _cards              : [],           // 牌的对象数组

    _type               : 0,            // 特殊组合牌的类型
    _arrows             : [],           // 箭头

    _labelName          : null,         // 玩家的昵称

    ctor : function (uiIndex, node) {
        this._uiIndex = uiIndex;
        this._node = node;
        this._init();
        return true;
    },

    _init : function () {
        this._cards = [];
        for (var i = 1; i < 5; ++i) {
            this._cards.push(new GameWindowMahjong.SpecialCard(this._uiIndex, game.findUI(this._node, "" + i)));
        }

        var arrowNode = game.findUI(this._node, "ND_Arrow");
        this._arrows = [];
        for (var j = 0; j <= 3; ++j) {
            this._arrows.push(game.findUI(arrowNode, "" + j));
        }

        this._labelName = game.findUI(this._node, "TXT_Name");
    },

    reset : function () {
        this._cards.forEach(function (card) {
            card.reset();
        });

        this._type = GameWindowMahjong.SpecialCards.type.NONE;

        this.showArrow(-1);
        this.showName(-1);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置特殊牌的牌型以及牌的值
     * @param type
     * @param cardsArray
     * @param targetIndex
     */
    setTypeAndCardsValues : function (type, cardsArray, targetIndex) {
        this._type = type;
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < cardsArray.length) {
                this._cards[i].setValue(cardsArray[i]);
            } else {
                this._cards[i].reset();
            }
        }
    },

    /**
     * 获取特殊牌的牌型
     * @returns {number}
     */
    getType : function () {
        return this._type;
    },

    /**
     * 获取特殊牌值的数组
     * @returns {Array}
     */
    getCardsValuesArray : function () {
        var array = [];
        for (var i = 0; i < this._cards.length; ++i) {
            var value = this._cards[i].getValue();
            if (value != -1) {
                array.push(value);
            }
        }

        return array;
    },

    /**
     * 显示箭头
     * @param index 玩家逻辑坐标
     */
    showArrow: function (index) {

        for (var i = 0; i < this._arrows.length; ++i) {
            this._arrows[i].setVisible(false);
        }
        var gameData = game.procedure.Mahjong.getGameData();
        if (index == -1 || gameData.getPlayerNum() == 2) {
            return;
        }
        var diff = index - gameData.playerIndex;
        if (diff < 0) {
            diff += 4;
        }
        this._arrows[diff].setVisible(true);
    },

    /**
     * 显示被操作玩家的昵称
     * @param index
     */
    showName : function (index) {
        this._labelName.setVisible(false);
        if (index < 1) {
            return;
        }
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[index];
        var name = player.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._labelName.setString(name);    // 只截取4个字符
        this._labelName.setVisible(true);
    },

    /**
     * 显示高亮的牌
     * @param value
     */
    showLightCards : function (value) {
        if (this._cards.length < 1) {
            return;
        }
        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].showLight(this._cards[i].getValue() == value);
        }
    },

    /**
     * 隐藏高亮的牌
     */
    hideLightCards : function () {
        if (this._cards.length < 1) {
            return;
        }
        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].showLight(false);
        }
    }
});

GameWindowMahjong.SpecialCards.type = {
    NONE    : 0,            // 无类型
    CHI     : 1,            // 吃
    PENG    : 2,            // 碰
    GANG    : 3             // 杠
};