/**
 * Created by lyndon on 2018.05.18.
 *  桌面消息显示
 */

GameWindowPinShi.TableTip = cc.Class.extend({

    _parentNode : null,
    _node       : null,

    _tips       : [],

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinShi/TableTip/TableTip.json").node;
        this._init();
        this._parentNode.addChild(this._node);
    },

    _init: function () {
        this._tips = [];
        var tipTemp = null;
        for (var i = 1; i <= 6; ++i) {
            tipTemp = game.findUI(this._node, "ND_TableTip_" + i);
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
     * @param tip 1 请抢庄 2 请选择分数 3 请亮牌
     *            4 等待其他人抢庄 5 等待其他人下注
     *            6 等待他人亮牌
     */
    showTableTip: function (tip) {
        for (var i = 0; i < this._tips.length; ++i) {
            this._tips[i].setVisible(tip == i+1);
        }
    }
});