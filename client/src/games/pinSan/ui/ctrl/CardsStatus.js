/**
 * Created by Jiyou Mo on 2017/12/5.
 */
// 牌操作状态显示对象
GameWindowPinSan.CardsStatus = cc.Class.extend({
    
    _node               : null,         // 本节点

    _img1               : null,         // 未看牌图片
    _img2               : null,         // 已看牌图片
    _img3               : null,         // 弃牌图片
    _img4               : null,         // 比牌输图片
    
    ctor : function () {
        this._node = ccs.load("res/Games/PinSan/CardsStatus/CardsStatus.json").node;
        this._init();
        return true;
    },
    
    _init : function () {
        this._img1 = game.findUI(this._node, "CardsStatus_1");
        this._img2 = game.findUI(this._node, "CardsStatus_2");
        this._img3 = game.findUI(this._node, "CardsStatus_3");
        this._img4 = game.findUI(this._node, "CardsStatus_4");
    },
    
    reset : function () {
        this.showStatus(0);
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
     * 显示状态
     * @param statusValue 状态的值
     */
    showStatus : function (statusValue) {
        this._img1.setVisible(statusValue == GameDataPinSanHelp.CardsStatus.NotToSee);
        this._img2.setVisible(statusValue == GameDataPinSanHelp.CardsStatus.HaveToSee);
        this._img3.setVisible(statusValue == GameDataPinSanHelp.CardsStatus.Fold);
        this._img4.setVisible(statusValue == GameDataPinSanHelp.CardsStatus.CompareLost);
    }
});
