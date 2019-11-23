/**
 * Created by pander on 2018/5/15.
 */
// ==== 麻将游戏 公牌 控件 =========================================
GameWindowMahjong.PublicCards = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点

    _publicNumber       : null,         // 公牌数量

    ctor : function (parentNode) {
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/PublicCardsNumber/PublicCardsNumber.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },
    
    _init : function () {
        this._publicNumber = game.findUI(this._node, "FNT_Number");
    },

    reset : function () {
        this.setPublicNumber(0);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置公牌的数量
     * @param publicNumber
     */
    setPublicNumber : function (publicNumber) {
        publicNumber = publicNumber || 0;
        if (publicNumber < 0) {
            // 值为-1 表示没有公牌
            return;
        }
        this._publicNumber.setString("" + publicNumber + "z");
    }
});