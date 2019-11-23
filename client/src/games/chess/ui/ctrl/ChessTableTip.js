/**
 * Author       : lyndon
 * Date         : 2018-07-28
 * Description  : 桌面提示控件
 */
WindowChess.TableTip = cc.Class.extend({

    _parentNode : null,
    _node       : null,

    _tips       : [],

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/Chess/TableTip/TableTip.json").node;
        this._init();
        this._parentNode.addChild(this._node);
    },

    _init: function () {
        this._tips = [];
        for (var i = 1; i <= 3; ++i) {
            var tipTemp = game.findUI(this._node, "ND_TableTip_" + i);
            this._tips.push(tipTemp);
        }
    },

    reset: function () {
        for (var i = 0; i < this._tips.length; ++i) {
            this._tips[i].setVisible(false);
        }
    },

    /**
     * 显示操作提示
     * @param tip 1 等待其他人加入 2 等待对方准备 3 等待房主开始游戏
     */
    showTableTip: function (tip) {
        for (var i = 0; i < this._tips.length; ++i) {
            this._tips[i].setVisible(tip == i+1);
        }
    }
});