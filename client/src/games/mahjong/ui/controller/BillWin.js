/**
 * Author       : lyndon
 * Date         : 2019-08-30
 * Description  : 对局流水
 */

GameWindowMahjong.BillWin = game.ui.PopupWindow.extend({
    _node           : null,

    _fnt            : null,
    _sv             : null,
    _items          : [],
    _data           : null,

    _height         : 30,
    ctor: function (data) {
        this._super();
        this._node = ccs.load("res/Games/Mahjong/Bill/Bill.json").node;
        this._data = data;
        this._init();
        this.addChild(this._node);
        return true;
    },

    _init: function () {
        var btnClose = game.findUI(this._node, "BTN_Close");
        btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this.close();
            }
        }, this);

        this._sv = game.findUI(this._node, "ND_Sv");
        this._fnt = game.findUI(this._node, "Fnt_Bean");
        var num = +this._data.num;
        var bean = Utils.formatCoin(Math.abs(num));
        // cc.log("================ " + bean);
        if (num < 0) {
            this._fnt.setString("-" + bean);
        }else if (num > 0) {
            this._fnt.setString("+" + bean);
        }else {
            this._fnt.setString("0");
        }

        this._loadScrollView();
    },

    // 加载数据
    _loadScrollView: function () {
        this._sv.removeAllChildren();
        var list = this._data.list;
        // 没有流水记录
        if (list.length < 1) {
            this._sv.setInnerContainerSize(cc.size(660.0, 254));
            return;
        }

        this._items = [];
        for (var i = 0; i < list.length; ++i) {
            var temp = new GameWindowMahjong.BillWin.Item(list[i]);
            this._items.push(temp.getNode());
        }
        this._layOut();
    },

    // 布局
    _layOut: function () {
        var contentHeight = this._items.length * this._height;
        contentHeight = Math.max(contentHeight, 254.0);
        this._sv.setInnerContainerSize(cc.size(660.0, contentHeight));
        this._sv.scrollToTop(0.2, true);
        var posY = contentHeight;
        for (var i = 0; i < this._items.length; ++i) {
            posY -= this._height;
            this._items[i].setPositionY(posY);
            this._sv.addChild(this._items[i]);
        }
    },

    // 关闭该窗口
    close: function () {
        GameWindowMahjong.BillWin.inst = null;
        game.UISystem.closePopupWindow(this);
    }
});

GameWindowMahjong.BillWin.inst = null;

GameWindowMahjong.BillWin.popup = function (data) {
    var win = new GameWindowMahjong.BillWin(data);
    GameWindowMahjong.BillWin.inst = win;
    game.UISystem.popupWindow(win);
};

GameWindowMahjong.BillWin.Item = cc.Class.extend({
    _node       : null,

    _label_1    : null, // 牌型
    _label_2    : null, // 倍数
    _label_3    : null, // 输赢
    _label_4    : null, // 玩家

    _data       : null,

    ctor: function (data) {
        this._node = ccs.load("res/Games/Mahjong/Bill/Item.json").node;
        this._data = data;
        this._init();

        return true;
    },

    _init: function () {
        this._label_1 = game.findUI(this._node, "Label_1");
        this._label_2 = game.findUI(this._node, "Label_2");
        this._label_3 = game.findUI(this._node, "Label_3");
        this._label_4 = game.findUI(this._node, "Label_4");
        this._data && this.setInfo();
    },

    setInfo: function () {
        var str1 = "" + this._data['type'];
        var str2 = "";
        if (this._data['multiple'] != "") {
            str2 = "x" + this._data['multiple'];
        }
        var score = +this._data['winLose'];
        var str3 = score >= 0 ? "+" : "";
        str3 += score;
        var str4 = "" + this._data['dirInfo'];
        this._label_1.setString(str1);
        this._label_2.setString(str2);
        this._label_3.setString(str3);
        this._label_4.setString(str4);
    },

    getNode: function () {
        return this._node;
    }
});