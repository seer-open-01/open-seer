/**
 * Created by pander on 2018/5/23.
 */
// ==== 麻将游戏 桌牌出牌指示器 ======
GameWindowMahjong.TableCardIndicator = cc.Class.extend({
    _node: null,         // 本节点
    _spIndicator: null,         // 指示器图片

    ctor : function () {
        this._node = ccs.load("res/Games/Mahjong/TableCardIndicator/Indicator.json").node;
        this._init();
        this._node.retain();
        return true;
    },

    _init : function () {
        this._spIndicator = game.findUI(this._node, "SP_Indicator");
    },

    reset : function () {
        this._node.removeFromParent();
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 添加到指定节点位置
     * @param parentNode
     * @param position
     */
    addToNode : function (parentNode, position) {
        if (!parentNode) {
            return;
        }
        this._node.removeFromParent();
        parentNode.addChild(this._node);
        this._node.setPosition(position);

        this._playAnimation();
    },

    _playAnimation : function () {
        this._spIndicator.stopAllActions();
        this._spIndicator.setPosition(cc.p(0, 0));
        var ac = cc.sequence(cc.moveBy(0.5, 0, 30), cc.moveBy(0.5, 0, -30)).repeatForever();
        this._spIndicator.runAction(ac);
    }
});

GameWindowMahjong.TableCardIndicator._instance = null;

/**
 * 将桌牌指示器添加到制定节点
 * @param parentNode
 * @param position
 */
GameWindowMahjong.TableCardIndicator.addToNode = function (parentNode, position) {
    if (this._instance == null) {
        this._instance = new GameWindowMahjong.TableCardIndicator();
    }
    this._instance.reset();
    this._instance.addToNode(parentNode, position);
};
