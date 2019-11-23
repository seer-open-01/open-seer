/**
 * Created by pander on 2018/6/7.
 */
// 当前风令控件
GameWindowMahjong.DirectionOrder = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点

    _sp1                : null,         // 东令图片
    _sp2                : null,         // 南令图片
    _sp3                : null,         // 西令图片
    _sp4                : null,         // 北令图片

    ctor : function (parentNode) {
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/DirectionOrder/DirectionOrder.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._sp1 = game.findUI(this._node, "SP_1");
        this._sp2 = game.findUI(this._node, "SP_2");
        this._sp3 = game.findUI(this._node, "SP_3");
        this._sp4 = game.findUI(this._node, "SP_4");
    },

    reset : function () {
        this.showDirectionOrder(-1);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 显示指定的令
     * @param value     -1无令 0 东令   1 南令   2 西令   3 北令
     */
    showDirectionOrder : function (value) {
        this._sp1.setVisible(value == 0);
        this._sp2.setVisible(value == 1);
        this._sp3.setVisible(value == 2);
        this._sp4.setVisible(value == 3);
    }
});