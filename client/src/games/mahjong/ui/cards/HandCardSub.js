/**
 * Created by pander on 2018/5/16.
 */
// ==== 麻将手牌 ====================================================
GameWindowMahjong.HandCardSub = GameWindowMahjong.HandCard.extend({
    _init : function () {},

    /**
     * 设置是否可点击
     * @param bool
     */
    setCardTouch : function (bool) {},

    /**
     * 是否可点击
     * @returns {*|boolean}
     */
    isCardTouch : function () {
        return false;
    },

    /**
     * 设置牌的值
     * @param value
     */
    setValue : function (value) {
        this._value = value;
        if (this._value < 1) {
            this.show(false);
            return;
        }

        var gameData = game.procedure.Mahjong.getGameData();

        var path = GameWindowMahjong.HandCardSub.RES_PAHT + gameData.getDirectionString(this._uiIndex)
            + "/" + this._value + ".png";

        if (this._value == 100) {
            path = GameWindowMahjong.HandCard.RES_PAHT + gameData.getDirectionString(this._uiIndex)
                + "/" + this._value + ".png";
        }

        this._node.setTexture(path);

        this.show(true);
    },

    setHuValue: function (value) {

        this._value = value;
        if (this._value < 1) {
            this.show(false);
            return;
        }

        var gameData = game.procedure.Mahjong.getGameData();
        var path = GameWindowMahjong.HandCardSub.RES_PAHT + gameData.getDirectionString(this._uiIndex)
            + "/" + this._value + ".png";

        this._node.setTexture(path);
        this.setColored(false);
        this.show(true);
    },

    /**
     * 获取牌的值
     * @returns {number|*}
     */
    getValue : function () {
        return this._value;
    },

    /**
     * 设置是否选中
     * @param bool
     */
    setSelected : function (bool) {
        this._isSelected = bool;
    },

    /**
     * 当前状态是否选中
     * @returns {boolean}
     */
    isSelected : function () {
        return this._isSelected;
    }
});

GameWindowMahjong.HandCardSub.RES_PAHT = "res/Games/Mahjong/CardsImages/TableCards/";