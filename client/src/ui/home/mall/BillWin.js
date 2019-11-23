/**
 * @Author       : Lyndon
 * @Date         : 2019-07-12
 * @Description  : 账单界面
 */
game.ui.BillWin = game.ui.PopupWindow.extend({
    _node       : null,

    _sv         : null,
    items       : [],
    _data       : [],

    _height     : 38,

    ctor: function (data) {
        this._super();
        this._node = ccs.load("res/Home/Mall/Record.json").node;
        this._data = data;
        this._init();
        this.addChild(this._node);
        return true;
    },
    
    _init: function () {
        var btnClose = game.findUI(this._node, "BTN_Close");
        btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.close();
            }
        }, this);

        this._sv = game.findUI(this._node, "ND_Sv");
        this._loadScrollView();
    },

    // 加载数据
    _loadScrollView: function () {
        this._sv.removeAllChildren();

        // 没有充值记录
        if (this._data.length < 1) {
            this._sv.setInnerContainerSize(cc.size(798.0, 300));
            return;
        }

        this._items = [];
        for (var i = 0; i < this._data.length; ++i) {
            var temp = new game.ui.BillWin.Item(this._data[i]);
            this._items.push(temp.getNode());
        }

        this._layOut();
    },

    // 布局
    _layOut: function () {
        var contentHeight = this._items.length * this._height;
        contentHeight = Math.max(contentHeight, 300.0);
        this._sv.setInnerContainerSize(cc.size(798.0, contentHeight));
        this._sv.scrollToTop(0.2, true);
        var posY = contentHeight;
        for (var i = 0; i < this._items.length; ++i) {
            posY -= this._height;
            this._items[i].setPositionY(posY);
            this._sv.addChild(this._items[i]);
        }
    },
    
    close: function () {
        if (game.ui.BillWin.inst) {
            game.UISystem.closeWindow(this);
        }
        game.ui.BillWin.inst = null;
    }
});

game.ui.BillWin.popup = function (data) {
    var win = new game.ui.BillWin(data);
    game.ui.BillWin.inst = win;
    game.UISystem.popupWindow(win);
};

game.ui.BillWin.inst = null;

game.ui.BillWin.Item = cc.Class.extend({

    _node       : null,
    _time       : null,
    _bean       : null,

    _data       : null,
    
    ctor: function (data) {
        this._node = ccs.load("res/Home/Mall/Item.json").node;
        this._data = data;
        this._init();
        
        return true;
    },
    
    _init: function () {
        this._time = game.findUI(this._node, "ND_Time");
        this._bean = game.findUI(this._node, "ND_Bean");

        this._data && this.setInfo();
    },
    
    setInfo: function () {
        this._time.setString(this._data.time);
        var num = Utils.formatCoin2(this._data.num);
        this._bean.setString("x" + num);
    },

    getNode: function () {
        return this._node;
    }
});