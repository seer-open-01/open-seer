/**
 * Created by pander on 2018/5/16.
 */
// ==== 麻将游戏 花牌 =========================
GameWindowMahjong.FlowerCard = cc.Class.extend({
    _node           : null,         // 本节点

    _uiIndex        : 0,            // 当前牌所用的方位

    _value          : -1,           // 当前牌的值

    ctor : function (uiIndex, node) {
        this._uiIndex = uiIndex;
        this._node = node;
        this._init();
        return true;
    },

    _init : function () {},

    reset : function () {
        this.setValue(-1);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    setValue : function (value) {
        this._value = value;
        if (this._value < 0) {
            this.show(false);
            return;
        }

        var gameData = game.procedure.Mahjong.getGameData();
        var path = GameWindowMahjong.FlowerCard.RES_PAHT + gameData.getDirectionString(this._uiIndex)
            + "/" + this._value + ".png";

        this._node.setTexture(path);

        this.show(true);
    },

    /**
     * 获取牌的值
     * @returns {number|*}
     */
    getValue : function () {
        return this._value
    }
});

GameWindowMahjong.FlowerCard.RES_PAHT = "res/Games/Mahjong/CardsImages/TableCards/";