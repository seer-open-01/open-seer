/**
 * Created by lyndon on 2019-07-31
 * 房间列表右边UI
 */
game.ui.RoomListWindow.Right = cc.Class.extend({
    _node               : null,         // 本节点
    _sv                 : null,         // 滚动容器
    _no                 : null,         // 当前暂无房间
    _items              : [],           // 自由匹配场item数组
    _posArr             : [],           // 自由匹配场item位置数组
    _items2             : [],           // 自建房item数组
    _posArr2            : [],           // 自建房item位置数组

    _btnNext            : null,         // 下一页
    _btnBefore          : null,         // 上一页

    ctor : function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init : function () {
        this._items = [];
        this._posArr = [];
        for (var i = 1; i <= 3; ++i) {
            var item = new game.ui.RoomListWindow.Item(game.findUI(this._node, "S_" + i));
            this._items.push(item);
            this._posArr.push(item.getNode().getPosition());
        }

        this._sv = game.findUI(this._node, "ND_SV");
        this._items2 = [];
        this._posArr2 = [];
        for (i = 1; i <= 4; ++i) {
            item = new game.ui.RoomListWindow.Item2(game.findUI(this._sv, "S_" + i));
            this._items2.push(item);
            this._posArr2.push(item.getNode().getPosition());
        }

        this._no = game.findUI(this._node, "ND_No");
        this._btnNext = game.findUI(this._node, "BTN_Next");
        this._btnBefore = game.findUI(this._node, "BTN_Before");
        this.registerClick();
    },
    // 游戏入口点击
    onGameClick : function (callback) {
        this._items.forEach(function (item) {
            item.onSelectClick(callback);
        });
    },
    // 更新上边Item信息
    updateTop : function (list) {
        var info = [];
        for (var key in list) {
            if (list.hasOwnProperty(key)){
               info.push(list[key]);
            }
        }
        for (var i = 0; i < this._items.length; ++i) {
            this._items[i].setInfo(info[i]);
        }
    },
    // 更新自建房Item信息
    updateBottom: function (list) {
        this.showNo(list.length < 1);
        for (var i = 0; i < this._items2.length; ++i) {
            if (list[i]) {
                this._items2[i].setInfo(list[i]);
                this._items2[i].getNode().setVisible(true);
            }else {
                this._items2[i].getNode().setVisible(false);
            }

        }
    },
    // 隐藏Item
    hideItems: function () {
        for (var i = 0; i < this._items2.length; ++i) {
            var node = this._items2[i].getNode();
            node.setVisible(false);
        }
    },
    // 显示当前暂无房间
    showNo: function (show) {
        this._sv.setVisible(!show);
        this._no.setVisible(show);
    },
    // 切换游戏类型动画
    playSelectAnimation: function () {
        this.initItemPosition();

        var delayTime = 0;
        for (var i = 0; i < this._items.length; ++i) {
            var node = this._items[i].getNode();
            var pos = this._posArr[i];
            node.stopAllActions();
            var moveTo = cc.MoveTo(0.3, pos).easing(cc.easeSineOut(0.3));
            node.runAction(cc.sequence(cc.delayTime(delayTime), moveTo));
            delayTime += 0.1;
        }

        delayTime = 0;
        for (i = 0; i < this._items2.length; ++i) {
            node = this._items2[i].getNode();
            pos = this._posArr2[i];
            node.stopAllActions();
            moveTo = cc.MoveTo(0.3, pos).easing(cc.easeSineOut(0.3));
            node.runAction(cc.sequence(cc.delayTime(delayTime), moveTo));
            delayTime += 0.1;
        }
    },
    // 初始化Item的位置
    initItemPosition: function () {
        this._items.forEach(function (item) {
            var node = item.getNode();
            node.stopAllActions();
            var pos = node.getPosition();
            node.setPositionX(pos.x + 1000);
        });

        this._items2.forEach(function (item) {
            var node = item.getNode();
            node.stopAllActions();
            var pos = node.getPosition();
            node.setPositionX(pos.x + 1000);
        });
    },
    // 注册点击
    registerClick: function () {
        this._btnNext.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.hallNet.sendMessage(protocol.ProtoID.CLIENT_ROOM_LIST_NEXT, {});
            }
        });

        this._btnBefore.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.hallNet.sendMessage(protocol.ProtoID.CLIENT_ROOM_LIST_BEFORE, {});
            }
        });
    }
});