/**
 * Created by lyndon on 2018.04.16.
 *
 *  大厅上方UI控件
 *  1.玩家信息的现实 头像、昵称、ID
 *  2.玩家物资的显示
 *  3.购买、转盘、推广员、客服按钮点击事件的绑定
 *  4.全局公告的节点
 */
game.ui.HomeTop = cc.Class.extend({

    _node               : null,

    //=== 玩家 ===
    _ndHead             : null,         // 玩家头像
    _labelName          : null,         // 玩家昵称
    _labelId            : null,         // 玩家ID

    //=== 物资 ===
    _fntCard            : null,         // 房卡美术字
    _fntBean            : null,         // 金贝美术字

    //=== 按钮 ===
    _btns               : [],           // 按钮组

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },
    
    _init: function () {

        this._ndHead = new game.ui.HeadPic(game.findUI(this._node, "ND_Head"));
        this._labelName = game.findUI(this._node, "Label_Name");
        this._labelId = game.findUI(this._node, "Label_ID");

        this._fntCard = game.findUI(this._node, "Fnt_Card");
        this._fntBean = game.findUI(this._node, "Fnt_Bean");

        this._btnAddCard = game.findUI(this._node, "BTN_Add1");
        this._btnAddBean = game.findUI(this._node, "BTN_Add2");

        this._btns = [];
        for (var i = 0; i <= 3; ++i) {
            var temp = game.findUI(this._node, "BTN_" + i);
            this._btns.push(temp);
        }


        this.updateInfo();
    },

    /**
     * 外部调用更新大厅资源
     */
    updateInfo: function () {
        this._ndHead.setHeadPic(game.DataKernel.headPic);
        var name = game.DataKernel.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._labelName.setString(name);
        this._labelId.setString("ID:" + game.DataKernel.uid);
        var chain_coin = Utils.formatCoin(game.DataKernel.chain_coin);
        this._fntCard.setString("" + chain_coin);
        var bean = Utils.formatCoin(game.DataKernel.bean);
        this._fntBean.setString("" + bean);
    },

    btn_0: function (callback) {
        this._btns[0].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    btn_1: function (callback) {
        this._btns[1].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    btn_2: function (callback) {
        this._btns[2].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    btn_3: function (callback) {
        this._btns[3].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    // 购买点击
    onAddClicked: function (callback, callback2) {
        this._btnAddCard.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);

        this._btnAddBean.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback2 && callback2();
            }
        }, this);

    },

    // 头像点击
    onHeadClicked: function (callback) {
        this._ndHead.setClickedHandler(callback);
    }
});