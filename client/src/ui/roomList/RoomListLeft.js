/**
 * Created by lyndon on 2019-07-31
 * 房间列表左边UI
 */
game.ui.RoomListWindow.Left = cc.Class.extend({

    _node           : null,         // 当前节点
    _sv             : null,         // 滚动容器
    _btnArray       : [],           // 按钮数组

    _callback       : null,         // 点击回调
    _lastClickTime  : 0,          // 上次点击的时间

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init: function () {
        this._sv = game.findUI(this._node, "ND_Sv");

        this._btnArray = [];
        for (var i = 0; i <= 8; ++i) {
            var btn = game.findUI(this._sv, "BTN_GameType" + i);
            if (btn) {
                btn.gameType = i;
                this._btnArray.push(btn);
            }
        }

        this._btnArray.forEach(function (btn) {
            btn.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    game.Audio.playBtnClickEffect();
                    var now = new Date();
                    if (now - this._lastClickTime < 500) {
                        return;
                    }
                    this._lastClickTime = now;
                    this.setGameType(sender.gameType);
                    this._callback && this._callback(sender.gameType);
                }
            }, this);
        }, this);
    },

    /**
     * 绑定游戏类型按钮点击回调
     * @param callback          回传参数 gameType
     */
    onGameTypeBtnClick: function (callback) {
        this._callback = callback;
    },

    /**
     * 设置当前选择的游戏类型
     * @param gameType
     */
    setGameType: function (gameType) {
        this._btnArray.forEach(function (btn) {
            btn.setEnabled(btn.gameType != gameType);
        });
        if (gameType == 7 || gameType == 2) {
            this._sv.scrollToBottom(0.1, true);
        } else {
            this._sv.scrollToTop(0.1, true);
        }
    }
});