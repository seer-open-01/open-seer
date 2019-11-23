/**
 * Created by Jiyou Mo on 2017/10/17.
 */
// 斗地主 普通牌
GameWindowDouDiZhu.Card = cc.Class.extend({

    _node               : null,             // 本节点

    _value              : null,             // 当前牌的值
    _valueSprite        : null,             // 图片资源
    _markSprite         : null,             // 地主牌标记

    _selected           : false,            // 是否被选中
    _coloured           : false,            // 颜色

    _originalPos        : null,             // 牌的原来位置
    _originalAnchor     : null,             // 牌锚点位置

    ctor : function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init : function () {
        this._valueSprite = game.findUI(this._node, "SP_Value");
        this._markSprite = game.findUI(this._node, "SP_Mark");

        this._originalPos = this._valueSprite.getPosition();
        this._originalAnchor = this._valueSprite.getAnchorPoint();
    },

    /**
     * 重置函数
     */
    reset : function () {
        this.setValue(-1, false);
        this.setSelected(false);
        this.setColoured(false);
    },

    /**
     * 设置牌的值函数
     * @param value     牌的值 -1则不显示牌
     * @param isMark    是否显示地主牌标志
     */
    setValue : function (value, isMark) {
        this._valueSprite.setVisible(false);
        this._markSprite.setVisible(isMark);
        this._value = value;
        if (this._value != -1) {
            this._valueSprite.setTexture(GameWindowDouDiZhu.Card.RES_PATH + this._value + ".png");
            this._valueSprite.setAnchorPoint(this._originalAnchor);
            this._valueSprite.setPosition(this._originalPos);
            this._valueSprite.setVisible(true);
        }
    },

    getValue : function () {
        return this._value;
    },

    /**
     * 设置是否能点击
     * @param bool
     */
    setTouch : function (bool) {

    },

    /**
     * 获取是否能点击
     * @return {boolean}
     */
    getTouch : function () {

        return false;
    },

    /**
     * 设置选中状态
     * @param selected      是否选中
     */
    setSelected : function (selected) {
        this._selected = selected;
        var selectPos = cc.p(this._originalPos.x, this._originalPos.y + 30);
        if (this._selected) {
            this._valueSprite.setPosition(selectPos);
        } else {
            this._valueSprite.setPosition(this._originalPos);
        }
    },

    /**
     * 是否被选中
     * @return {boolean}
     */
    isSelected : function () {
        return this._selected;
    },

    /**
     * 改变选择状态
     */
    changeSelected : function () {
        this.setSelected(!this._selected);
    },

    /**
     * 设置变色
     * @param bool
     */
    setColoured : function (bool) {
        this._coloured = bool;
        if (this._coloured) {
            this._valueSprite.setColor(cc.color(128, 128, 128));
        } else {
            this._valueSprite.setColor(cc.color(255, 255, 255));
        }
    }
});

// 资源路径
GameWindowDouDiZhu.Card.RES_PATH = "res/Games/DouDiZhu/Poker/";