/**
 * Author       : lyndon
 * Date         : 2018-10-30
 * Description  : 作弊窗口
 */
var CheatWindow = cc.Layer.extend({

    _node: null,

    _sv: null,
    _cards: [],
    _ids: [],

    _w: 90,
    _h: 126,

    _selCard: null,
    _location: null,

    ctor: function () {
        this._super();
        this._node = ccs.load("res/Games/Mahjong/CheatWin/CheatWin.json").node;
        this._init();
        this.addChild(this._node);
        return true;
    },

    _init: function () {

        this._sv = game.findUI(this._node, "CardView");
        this._sv.setScrollBarAutoHideEnabled(false);
        var layer = new cc.LayerColor(cc.color(0, 0, 0, 0));
        this._sv.addChild(layer, 99);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this),
            onTouchEnded: this.onTouchEnded.bind(this)
        }, layer);

        var btnConfirm = game.findUI(this._node, "Btn_Confirm");
        btnConfirm.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.reqUpdate();
            }
        }, this);

        var btnClose = game.findUI(this._node, "Btn_Close");
        btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.UISystem.closePopupWindow(this);
            }
        }, this);
    },

    reset: function () {

    },

    initCards: function (cards) {
        this._cards = [];
        this._ids = [];
        for (var i = 0; i < cards.length; ++i) {
            var path = "res/Games/Mahjong/CardsImages/HandCards/South/";
            var temp = new cc.Sprite(path + cards[i] + ".png");
            temp.index = i;
            temp.id = cards[i];
            this._sv.addChild(temp, 100);
            this._cards.push(temp);
            this._ids.push(cards[i]);
        }

        this._layOut();
    },

    _layOut: function () {
        var curRow = Math.round(this._cards.length / 10);
        var max = Math.max(520, 130 * curRow);
        this._sv.setInnerContainerSize(cc.size(1200, max));
        var x = -118 + this._w / 2;
        var y = max - this._h / 2;
        for (var i = 0; i < this._cards.length; ++i) {
            if (i > 0 && i % 10 == 0) {// 每行6个
                y -= 130;
                x = -118 + this._w / 2;
            }
            x += 118;
            this._cards[i].setPosition(x, y);
        }
    },

    /**
     * 点击事件
     * @param touch
     * @param event
     * @returns {boolean}
     */
    onTouchBegan: function (touch, event) {
        // cc.log("=== TouchBegan ===");
        var location = this._sv.convertTouchToNodeSpace(touch);
        return this.getCard(location);
    },

    onTouchMoved: function (touch, event) {
        // cc.log("=== TouchMoved ===");
        var location = this._sv.convertTouchToNodeSpace(touch);
        var movePos = this._sv.getInnerContainer().getPosition();
        var distance = cc.pDistance(location, this._location);
        if (this._selCard && distance > 20){
            location.y -= movePos.y;
            this._selCard.setPosition(location);
        }
    },

    onTouchEnded: function (touch, event) {
        // cc.log("=== TouchEnded ===");
        if (this._selCard){
            // cc.log("================== A " + this._ids);
            var location = this._sv.convertTouchToNodeSpace(touch);
            var movePos = this._sv.getInnerContainer().getPosition();
            var x = location.x;
            var y = location.y - movePos.y;
            var index = this._selCard.index;
            this._ids.splice(index, 1); // 先删除删除选中牌的id
            // cc.log("================== B " + this._ids);
            var id = this._selCard.id;
            var flag = false; // 是否发生交换
            for (var i = 0; i < this._cards.length; ++i) {
                var card = this._cards[i];
                var pos = card.getPosition();
                var xx = pos.x;
                var yy = pos.y;
                if (x < xx + 10 && y > yy - 20) {
                    this._ids.splice(i, 0, id); // 发生交换 则添加选中牌的id到交换牌的位置
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                this._ids.splice(index, 0, id); // 未发生交换 则重新添加选中牌的id
            }
            // cc.log("================== C " + this._ids);
            var path = "res/Games/Mahjong/CardsImages/HandCards/South/";
            for (i = 0; i < this._cards.length; ++i) {
                this._cards[i].setTexture(path + this._ids[i] + ".png");
                this._cards[i].id = this._ids[i];
                this._cards[i].index = i;
            }

            this._selCard.setPosition(this._location);
            this._selCard.setOpacity(255);
            this._selCard.setLocalZOrder(100);
            this._location = null;
            this._selCard = null;
        }
    },

    getCard: function (location) {
        var movePos = this._sv.getInnerContainer().getPosition();
        location.y -= movePos.y;
        // cc.log("=== TouchBegan ===A " + JSON.stringify(movePos));
        // cc.log("=== TouchBegan ===B " + JSON.stringify(location));
        for(var i = 0; i < this._cards.length; ++i){
            var card = this._cards[i];
            var pos = card.getPosition();
            // cc.log("=== TouchBegan ===C " + JSON.stringify(pos));
            var rect = cc.rect(pos.x - this._w / 2, pos.y - this._h / 2, this._w, this._h);
            if (cc.rectContainsPoint(rect, location)){
                card.setLocalZOrder(200);
                this._location = pos;
                this._selCard = card;
                this._selCard.setOpacity(180);
                return true;
            }
        }
        return false;
    },

    reqUpdate: function () {
        game.UISystem.closeWindow(this);
        game.gameNet.sendMessage(protocol.ProtoID.CHEAT_UPDATE_CARDS, {
            cards: this._ids,
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId
        });
    }

});

CheatWindow.popup = function (cards) {
    var win = new CheatWindow();
    win.initCards(cards);
    game.UISystem.showWindow(win);
};