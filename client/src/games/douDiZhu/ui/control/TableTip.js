/**
 * Created by lyndon on 2017.11.25.
 */
//桌面消息显示
GameWindowDouDiZhu.TableTip = cc.Class.extend({

    _parentNode : null,
    _node       : null,
    _timer      : null,

    _isShowing  : false,
    _tips       : [],

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/TableTip/TableTip.json").node;
        this._init();
        this._parentNode.addChild(this._node);
    },

    _init: function () {
        this._tips = [];
        var tipTemp = null;
        for (var i = 1; i <= 3; ++i) {
            tipTemp = game.findUI(this._node, "Text_Tip_" + i);
            this._tips.push(tipTemp);
        }
    },

    _tipTimer:function (index) {
        this._isShowing = true;
        this._tips[index].setVisible(true);
        this._timer = setTimeout(function () {
            this._tips[index].setVisible(false);
            this._isShowing = false;
        }.bind(this),1500)

    },

    reset: function () {
        for (var i = 0; i < this._tips.length; ++i) {
            this._tips[i].setVisible(false);
        }
        this._isShowing = false;
        clearTimeout(this._timer);
    },

    /**
     * 显示操作提示
     * @param tip 1 不符合出牌规则 2 没有能大过上家的牌 3 请选择要出的牌
     */
    showTableTip: function (tip) {
        if (this._isShowing) {
            return;
        }
        for (var i = 0; i < this._tips.length; ++i) {
            if (i == tip - 1) {
                this._tipTimer(i);
            } else {
                this._tips[i].setVisible(false);
            }
        }
    }
});