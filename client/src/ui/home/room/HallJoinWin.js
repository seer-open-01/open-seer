/**
 * Author       : lyndon
 * Date         : 2018-10-16
 * Description  : 大厅加入房间弹窗
 */
game.ui.HallJoinWin = game.ui.PopupWindow.extend({

    _node               : null,

    _keyBoard           : null,
    _values             : [],
    _roomId             : "",

    _lastTime           : 0,

    ctor: function () {
        this._super();
        this._node = ccs.load("res/Home/RoomCard/JoinWin.json").node;
        this._init();
        this.addChild(this._node);

        return true;
    },

    _init: function () {

        var numNode = game.findUI(this._node, "ND_Input");
        this._values = [];
        for (var i = 1; i <= 6; ++i) {
            var num = game.findUI(numNode, "num_" + i);
            num.setVisible(false);
            this._values.push(num);
        }

        var keyNode = game.findUI(this._node, "ND_Key");
        this._keyBoard = new game.ui.Keyboard(keyNode);
        this._keyBoard.setKeyDownCallback(this.setRoomId.bind(this));

        var closeBtn = game.findUI(this._node, "Btn_Close");
        closeBtn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
                game.ui.HallJoinWin.inst = null;
            }
        }, this);
    },

    /**
     * 输入房间号
     * @param num
     */
    setRoomId: function (num) {
        if (num == -1) {// 删除一位
            if (this._roomId.length > 0)
                this._roomId = this._roomId.substring(0,this._roomId.length - 1);
        } else if (num == -2) {// 重置所有
            this._roomId = "";
        } else {
            if(this._roomId.length < 6){
                this._roomId += num;
            }
        }

        if (this._roomId.length >= 6) {
            var now = new Date();
            if (now - this._lastTime < 1000) {
                return;
            }

            this._lastTime = now;
            this.reqJoinRoom();
        }

        cc.log("roomId " + this._roomId);
        this.showRoomId();
    },

    /**
     * 请求加入房间
     */
    reqJoinRoom: function () {
        cc.log("请求加入房间！");
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_GET_ROOM_ADDR, {rid : this._roomId});
    },

    /**
     * 显示roomId
     */
    showRoomId: function () {
        for (var i = 0; i < this._values.length; ++i) {
            this._values[i].setVisible(false);
        }
        for (i = 0; i < this._roomId.length; ++i) {
            // cc.log("输入的字符是 " + "res/RoomCard/Image/Num_" + this._roomId[i] + ".png");
            this._values[i].setTexture("res/Common/KeyNum/Num_" + this._roomId[i] + ".png");
            this._values[i].setVisible(true);
        }
    }

});

game.ui.HallJoinWin.popup = function () {
    var win = new game.ui.HallJoinWin();
    game.ui.HallJoinWin.inst = win;
    game.UISystem.popupWindow(win);
};

game.ui.HallJoinWin.inst = null;