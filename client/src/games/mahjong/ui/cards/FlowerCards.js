/**
 * Created by pander on 2018/5/16.
 */
// ==== 麻将游戏 花牌控件 ==================================================
GameWindowMahjong.FlowerCards = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点

    _uiIndex            : null,         // 座位方位

    _cards              : [],           // 方位的牌

    ctor : function (uiIndex, parentNode) {
        this._uiIndex = uiIndex;
        this._parentNode = parentNode;
        var gameData = game.procedure.Mahjong.getGameData();
        var dirStr = gameData.getDirectionString(this._uiIndex);
        this._node = ccs.load("res/Games/Mahjong/Cards/FlowerCards" + dirStr + ".json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._cards = [];
        for (var i = 1; i < 9; ++i) {
            this._cards.push(new GameWindowMahjong.FlowerCard(this._uiIndex, game.findUI(this._node, "" + i)));
        }
    },

    reset : function () {
        this._cards.forEach(function (card) {
            card.reset();
        });
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
    }
});