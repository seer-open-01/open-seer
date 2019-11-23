/**
 * Created by lyndon on 2018/6/22.
 * 胡牌提示弹窗
 */
GameWindowMahjong.HuTipWindow = cc.Class.extend({
    _parentNode         : null,
    _node               : null,

    _view               : null,           // 背景
    _items              : [],             // 牌数组

    _width              : 70,             // Item宽度
    _isShow             : false,

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/Mahjong/HuTipWindow/HuTipWindow.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {
        this._view = game.findUI(this._node, "ND_Bg");
    },

    reset: function () {
        this.show(false);
    },

    loadView: function (data) {
        this._removeItems();
        this._items = [];
        for (var i = 0; i < data.length; ++i) {
            var item = new GameWindowMahjong.HuTipItem(data[i]);
            this._items.push(item);
        }

        this._layout();
    },

    _layout: function () {
        var width = this._items.length * this._width + 150;
        this._view.setContentSize(cc.size(width, 200));
        var posX = 90;
        for (var i = 0; i < this._items.length; ++i) {
            posX += this._width;
            this._items[i].getNode().setPosition(posX, 104);
            this._view.addChild(this._items[i].getNode());
        }
    },

    _removeItems: function () {
        for (var i = 0; i < this._items.length; ++i) {
            this._items[i].getNode().removeFromParent(true);
        }
    },

    show: function (show) {
        this._isShow = show;
        this._node.setVisible(show);
    },

    isShow: function () {
        return this._isShow;
    }
});

GameWindowMahjong.HuTipItem = cc.Class.extend({

    _node               : null,

    _card               : null,           // 牌面
    _num                : null,           // 张数
    _fan                : null,           // 番数
    _data               : null,           // 数据

    ctor: function (data) {
        this._node = ccs.load("res/Games/Mahjong/HuTipWindow/HuTipItem.json").node;
        this._data = data;
        this._init();
        return true;
    },

    _init: function () {
        this._card = game.findUI(this._node, "ND_Card");
        this._num = game.findUI(this._node, "ND_Num");
        this._fan = game.findUI(this._node, "ND_Fan");

        this._data && this._setInfo();
    },

    _setInfo: function () {
        var cardPath = "res/Games/Mahjong/CardsImages/HandCards/South/" + this._data.card + ".png";
        this._card.setTexture(cardPath);
        this._num.setString(this._data.num + "张");
        if (this._data.huMult == 0 || this._data.huMult == undefined) {
            this._fan.setString("");
            return;
        }
        this._fan.setString(this._data.huMult + "倍")
    },

    getNode: function () {
        return this._node;
    }
});