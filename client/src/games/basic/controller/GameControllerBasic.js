/**
 * Created by Jiyou Mo on 2017/11/24.
 */
// 游戏公用控件基类
var GameControllerBasic = cc.Class.extend({

    _node           : null,         // 本节点

    /**
     * 构造 (必须重写)
     * @return {boolean}
     */
    ctor : function () {
        return true;
    },

    /**
     * 内部初始化函数 (必须重写)
     * @private
     */
    _init : function () {},

    /**
     * 重置  (必须重写)
     */
    reset : function () {},

    /**
     * 是否显示该对象 (不能重写)
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 添加到节点位置 (不能重写)
     * @param uiNode        // 被添加的节点
     * @param position      // 被添加的位置 世界坐标系
     */
    addToNode : function (uiNode, position) {
        this._node.removeFromParent(false);
        position = uiNode.convertToNodeSpace(position);
        uiNode.addChild(this._node, 100000);
        this._node.setPosition(position);
    },

    /**
     * 添加到节点位置(不能重写)
     * @param uiNode        // 被添加的节点
     * @param position      // 被添加的位置 本地坐标
     */
    addToNodeWithLocalPosition : function (uiNode, position) {
        this._node.removeFromParent(false);
        position = position || cc.p(0, 0);
        uiNode.addChild(this._node);
        this._node.setPosition(position);
    },

    /**
     * 设置层级
     * @param zOrder
     */
    setZOrder: function (zOrder) {
        this._node.setLocalZOrder(zOrder);
    }
});