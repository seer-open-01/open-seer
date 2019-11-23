/**
 * Created by pander on 2018/5/16.
 */
// ==== 麻将游戏 特殊牌 单排 ===================================
GameWindowMahjong.SpecialCard = cc.Class.extend({
    _node           : null,         // 本节点

    _uiIndex        : 0,            // 当前牌所用的方位

    _value          : -1,           // 当前牌的值
    _sprite         : null,         // 当前牌的图片
    _light          : null,         // 高光显示图片

    ctor : function (uiIndex, node) {
        this._uiIndex = uiIndex;
        this._node = node;
        this._init();
        return true;
    },

    _init : function () {
        this._sprite = game.findUI(this._node, "Sprite");
        this._light = game.findUI(this._node, "Light");
    },

    reset : function () {
        this.setValue(-1);
        this.showLight(false);
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
        var path = GameWindowMahjong.SpecialCard.RES_PAHT + gameData.getDirectionString(this._uiIndex)
            + "/" + this._value + ".png";

        this._sprite.setTexture(path);

        this.show(true);
    },

    /**
     * 获取牌的值
     * @returns {number|*}
     */
    getValue : function () {
        return this._value
    },

    /**
     * 显示高光
     * @param show
     */
    showLight : function (show) {
        this._light.setVisible(show);
    }
});

GameWindowMahjong.SpecialCard.RES_PAHT = "res/Games/Mahjong/CardsImages/SpecialCards/";