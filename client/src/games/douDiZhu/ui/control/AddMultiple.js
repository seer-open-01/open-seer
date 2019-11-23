/**
 * Created by lyndon on 2017/11/20.
 */
// 叫地主后 农民加倍按钮控件
GameWindowDouDiZhu.AddMultiple = cc.Class.extend({

    _parentNode: null,         // 父节点
    _node      : null,         // 本节点

    _mendaoNode: null,         //闷倒节点
    _daoNode   : null,         //倒节点
    _laNode    : null,         //拉节点

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/CallDiZhuBtn/AddMultiple.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {
        this._mendaoNode = game.findUI(this._node, "ND_MenDao");
        this._daoNode = game.findUI(this._node, "ND_Dao");
        this._laNode = game.findUI(this._node, "ND_La");

        this.showBtn(GameDataDouDiZhu.Helper.BtnStatus.MENDAO);
    },
    /**
     * 根据按钮状态显示不同的按钮
     */
    showBtn: function (type) {
        this._mendaoNode.setVisible(GameDataDouDiZhu.Helper.BtnStatus.MENDAO == type);
        this._daoNode.setVisible(GameDataDouDiZhu.Helper.BtnStatus.DAO == type);
        this._laNode.setVisible(GameDataDouDiZhu.Helper.BtnStatus.LA == type);
    },
    //注册农民加倍按钮
    registerDaoClick: function (cb1, cb2) {
        var btn1 = game.findUI(this._mendaoNode, "Btn_Mendao");
        var btn2 = game.findUI(this._mendaoNode, "Btn_Budao");
        var btn3 = game.findUI(this._daoNode, "Btn_Dao");
        var btn4 = game.findUI(this._daoNode, "Btn_Budao");

        if (btn1) {
            btn1.id = 1;
            btn1.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    cb1 && cb1(sender.id);
                }
            }, this)
        }
        if (btn2) {
            btn2.id = 2;
            btn2.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    cb2 && cb2(sender.id);
                }
            }, this)
        }
        if (btn3) {
            btn3.id = 1;
            btn3.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    cb1 && cb1(sender.id);
                }
            }, this)
        }
        if (btn4) {
            btn4.id = 2;
            btn4.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    cb2 && cb2(sender.id);
                }
            }, this)
        }


    },
    //注册地主加倍按钮
    registerLaClick: function (cb1, cb2) {
        var btn1 = game.findUI(this._laNode, "Btn_La");
        var btn2 = game.findUI(this._laNode, "Btn_Bula");
        if (btn1) {
            btn1.id = 1;
            btn1.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    cb1 && cb1(sender.id);
                }
            }, this)
        }
        if (btn2) {
            btn2.id = 2;
            btn2.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    cb2 && cb2(sender.id);
                }
            }, this)
        }
    },

    reset: function () {
        this._daoNode.setVisible(false);
        this._laNode.setVisible(false);
        this._mendaoNode.setVisible(false);
    }
});