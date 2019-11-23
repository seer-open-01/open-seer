/**
 * Created by Jiyou Mo on 2017/12/5.
 */
// 手牌牌型管理对象
GameWindowPinSan.CardsPattern = cc.Class.extend({

    _node               : null,             // 本节点

    _img1               : null,             // 散牌图片
    _img2               : null,             // 对子图片
    _img3               : null,             // 顺子图片
    _img4               : null,             // 同花图片
    _img5               : null,             // 同花顺图片
    _img6               : null,             // 豹子图片
    _img7               : null,             // 235小牌图片

    ctor : function () {
        this._node = ccs.load("res/Games/PinSan/CardsPattern/CardsPattern.json").node;
        this._init();
        return true;
    },

    _init : function () {
        this._img1 = game.findUI(this._node, "CardsPattern_1");
        this._img2 = game.findUI(this._node, "CardsPattern_2");
        this._img3 = game.findUI(this._node, "CardsPattern_3");
        this._img4 = game.findUI(this._node, "CardsPattern_4");
        this._img5 = game.findUI(this._node, "CardsPattern_5");
        this._img6 = game.findUI(this._node, "CardsPattern_6");
        this._img7 = game.findUI(this._node, "CardsPattern_7");
    },

    reset : function () {
        this.show(false);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 添加节点到指定位置
     * @param uiNode
     * @param position
     */
    addToNode : function (uiNode, position) {
        position = position || cc.p(0, 0);
        this._node.removeFromParent();
        this._node.setPosition(position);
        uiNode.addChild(this._node);
    },

    /**
     * 显示牌型
     * @param pattern
     * @param showForever       // 是否永久显示 true永久显示 false显示4秒
     */
    showPattern : function (pattern, showForever) {
        this.show(true);
        this._img1.setVisible(pattern == GameDataPinSanHelp.CardsPattern.Single);
        this._img2.setVisible(pattern == GameDataPinSanHelp.CardsPattern.Pair);
        this._img3.setVisible(pattern == GameDataPinSanHelp.CardsPattern.Straight);
        this._img4.setVisible(pattern == GameDataPinSanHelp.CardsPattern.GoldenFlower);
        this._img5.setVisible(pattern == GameDataPinSanHelp.CardsPattern.StraightFlush);
        this._img6.setVisible(pattern == GameDataPinSanHelp.CardsPattern.BaoZi);
        this._img7.setVisible(pattern == GameDataPinSanHelp.CardsPattern.Diff235);
        // 4秒后隐藏显示牌型
        if (!showForever) {
            setTimeout(function () {
                this.show(false);
            }.bind(this), 4000);
        }
    }
});
