/**
 * Created by lyndon on 2018/05/16.
 *  其他玩家单张手牌：不可点击
 */
GameWindowPinShi.OtherCard = cc.Class.extend({
    _node               : null,         // 本节点

    _value              : -1,           // 当前牌值
    _sprite             : null,         // 牌面图片

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init: function () {
        this._sprite = game.findUI(this._node, "ND_Card");
    },

    reset: function () {
        this.setValue(-1);
    },
    /**
     * 设置牌面
     * @param value
     */
    setValue: function (value) {
        // cc.log("===================1 " + value);
        this._value = value;
        if (this._value == -1) {
            this._sprite.setVisible(false);
            return;
        }
        var path = GameWindowPinShi.OtherCard.RES_PATH + this._value + ".png";
        // cc.log("===================2 " + path);
        this._sprite.setTexture(path);
        this._sprite.setVisible(true);
    },
    /**
     * 获取当前牌面的值
     * @returns {number|*}
     */
    getValue: function () {
        return this._value;
    }
});

GameWindowPinShi.OtherCard.RES_PATH = "res/Games/PinShi/Pokers/";