/**
 * Created by lyndon on 2018/06/06.
 *  大喇叭弹窗
 */

game.ui.HornWindow = game.ui.PopupWindow.extend({
    _node               : null,

    _editBox            : null,
    _msg                : "",
    _records            : [],

    ctor: function () {
        this._super();
        this._node = ccs.load("res/Home/Horn/HornWindow.json").node;
        this._init();
        this.addChild(this._node);

        return true;
    },

    _init: function () {
        var btnClose = game.findUI(this._node, "BTN_Close");
        btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.ui.HornWindow.inst = null;
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        var btnConfirm = game.findUI(this._node, "BTN_Confirm");
        btnConfirm.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this.onConfirmClick();
            }
        }, this);

        this._records = [];
        for (var i = 1; i <= 7; ++i) {
            var temp = new game.ui.HornWindow.Item(game.findUI(this._node, "L_" + i));
            temp.show(false);
            this._records.push(temp);
        }

        var winUI = game.findUI(this._node, "ND_PopWin");
        this._editBox = new cc.EditBox(cc.size(614, 54), new cc.Scale9Sprite("res/Home/Horn/Images/horn_5.png"));
        this._editBox.setName("Input");
        this._editBox.setAnchorPoint(0, 0.5);
        this._editBox.setMaxLength(80);
        this._editBox.setPlaceHolder(" 你想说些什么呢？");
        this._editBox.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);
        this._editBox.setFontColor(cc.color(190, 92, 30));
        this._editBox.setFontSize(22);
        this._editBox.setPlaceholderFontSize(22);
        this._editBox.setPlaceholderFontColor(cc.color(220, 134, 77));
        this._editBox.setPosition(-405, -236);
        this._editBox.setInputFlag(cc.EDITBOX_INPUT_FLAG_SENSITIVE);
        this._editBox.setDelegate(this);
        winUI.addChild(this._editBox);

        setTimeout(function () {
            game.hallNet.sendMessage(protocol.ProtoID.HORN_RECORD, {});
        }, 100)
    },

    editBoxEditingDidBegin: function (editBox) {
        cc.log("editBox " + editBox.getName() + " DidBegin !");
    },

    editBoxEditingDidEnd: function (editBox) {
        cc.log("editBox " + editBox.getName() + " DidEnd !");
    },
    editBoxTextChanged: function (editBox, text) {
        cc.log("editBox " + editBox.getName() + ", TextChanged, text: " + text);
        this._msg = text;
    },
    editBoxReturn: function (editBox) {
        cc.log("editBox " + editBox.getName() + " was returned !");
    },

    // 确定按钮被点击
    onConfirmClick: function () {
        var now = new Date();
        if (now - this._lastTime <= 1000) {
            return;
        }
        this._lastTime = now;
        if (this._msg.length < 1) {
            game.ui.HintMsg.showTipText("输入不能为空！", cc.p(640, 360), 2);
            return;
        }
        game.hallNet.sendMessage(protocol.ProtoID.HORN_SEND,{msg: "" + this._msg});
    },

    // 更新记录
    updateHornRecord: function (data) {
        for (var i = 0; i < this._records.length; ++i) {
            if (i < data.length) {
                this._records[i].setInfo(data[i]);
                this._records[i].show(true);
            }else {
                this._records[i].setInfo({name: "", msg: ""});
                this._records[i].show(false);
            }
        }
    },
    
    _strLen: function (str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                len++;
            }
            else {
                len += 2;
            }
        }
        return len;
    }
});

game.ui.HornWindow.popup = function () {
    var win = new game.ui.HornWindow();
    game.ui.HornWindow.inst = win;
    game.UISystem.popupWindow(win);
};

game.ui.HornWindow.inst = null;

game.ui.HornWindow.Item = cc.Class.extend({

    _node           : null,

    _name           : null,
    _msg            : null,

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init: function () {
        this._name = game.findUI(this._node, "label_1");
        this._msg = game.findUI(this._node, "label_2");
    },
    
    setInfo: function (info) {
        this._name.setString(info['name']);
        this._msg.setString(info['msg']);
    },
    
    show: function (bool) {
        this._node.setVisible(bool);
    }

});
