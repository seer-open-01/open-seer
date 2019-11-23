/**
 * Created by lyndon on 2018/05/21.
 *  玩家抢庄提示
 */

GameWindowPinShi.RobTip = cc.Class.extend({

    _node               : null,         // 本节点

    _tips               : [],           // 提示图片数组
    _ndRob              : null,         // 抢庄节点
    _ndNoRob            : null,         // 不抢节点

    ctor: function (node) {
        this._node = node;
        this._init();

        return true;
    },

    _init: function () {


        this._ndNoRob = game.findUI(this._node, "ND_NoRob");
        this._tips = [];
        this._robNode = game.findUI(this._node, "ND_Rob");
        for (var i = 1; i <= 4; ++i) {
            this._tips.push(game.findUI(this._robNode, "Rob_" + i));
        }
    },

    reset: function () {
        this.show(false);
        this._robNode.setVisible(false);
        this._ndNoRob.setVisible(false);
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },
    /**
     * 显示抢庄倍数 0不抢 1、2、3、4对应相应倍数
     * @param tip
     */
    showRobTip: function (tip) {
        this._robNode.setVisible(false);
        this._ndNoRob.setVisible(false);
        if (tip != 0) {
            this._robNode.setVisible(true);
            for (var i = 0; i < this._tips.length; ++i) {
                this._tips[i].setVisible(tip == i + 1);
            }
        }else {
            this._ndNoRob.setVisible(true);
        }
    }
});