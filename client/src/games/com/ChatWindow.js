/**
 * Created by Jiyou Mo on 2017/11/6.
 */
// 聊天窗口

var ChatWindow = game.ui.PopupWindow.extend({

    _node               : null,         // 本节点
    _btnClose           : null,         // 关闭按钮

    _cbFace             : null,         // 表情选项
    _cbText             : null,         // 短语选项

    _faceView           : null,         // 表情窗口
    _textView           : null,         // 短语窗口


    ctor : function () {
        this._super();
        // 加载UI控件
        this._node = ccs.load("res/Games/ComWindow/ChatWindow/ChatWindow.json").node;
        this.addChild(this._node);

        this._init();

        return true;
    },

    _init : function () {

        this._btnClose = game.findUI(this._node, "BTN_Close");
        this._btnClose.addTouchEventListener(function (sender, type) {
            if(type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this._close();
            }
        }, this);

        var popNode = game.findUI(this._node, "ND_PopWin");

        this._cbFace = game.findUI(popNode, "CB_Face");
        this._cbText = game.findUI(popNode, "CB_Text");

        this._cbFace.addEventListener(this._onFaceCheckBoxChecked, this);
        this._cbText.addEventListener(this._onTextCheckBoxChecked, this);

        this._textView = game.findUI(popNode, "TextView");
        this._faceView = game.findUI(popNode, "FaceView");

        // 设置表情内容
        var faceLength = 15;        // 表情有27个
        var height = Math.floor((faceLength + 2) / 3) * 100;
        if (height < 500) {
            height = 500;
        }

        this._faceView.setInnerContainerSize(cc.size(300, height));
        for (var i = 0; i < faceLength; ++i) {
            var faceObj = new ChatWindow.ChatFace();
            faceObj.setInfo(i + 1, this.onFaceOrText.bind(this));
            faceObj._btnFace.removeFromParent(false);
            faceObj._btnFace.setPosition(cc.p(100 * (i % 3), height));
            this._faceView.addChild(faceObj._btnFace);

            // 三个一排
            if (i % 3 == 2) {
                height -= 100;
            }
        }

        this._textView = game.findUI(popNode, "TextView");

        // 设置聊天内容
        var length = Object.keys(GameString.ChatString).length;
        height = length * 70;
        if (height < 500) {
            height = 500;
        }

        this._textView.setInnerContainerSize(cc.size(300, height));
        for (var key in GameString.ChatString) {
            if (GameString.ChatString.hasOwnProperty(key)) {
                var textObj = new ChatWindow.ChatText();
                textObj.setInfo(key, GameString.ChatString[key], this.onFaceOrText.bind(this));
                textObj._btnText.removeFromParent(false);
                textObj._btnText.setPosition(cc.p(5, height));
                this._textView.addChild(textObj._btnText);
                height -= 70;
            }
        }


        // 默认表情
        // this._onFaceCheckBoxChecked(this._cbFace, ccui.CheckBox.EVENT_SELECTED);
        // 默认短语
        this._onTextCheckBoxChecked(this._cbText, ccui.CheckBox.EVENT_SELECTED);
    },

    /**
     * 表情或短语回调函数
     * @param sender
     * @param type
     */
    onFaceOrText : function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            // var opts = {
            //     "message" : {
            //         "type": sender.type,
            //         "text": sender.id
            //     }
            // };
            // cc.log("发送聊天信息 " + JSON.stringify(opts));
            game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_ROOM_CHAT, {
                    uid     : game.DataKernel.uid,
                    roomId  : game.DataKernel.roomId,
                    message : {
                        "type": sender.type,
                        "text": sender.id
                    }
                });
            this._close();
        }
    },

    /**
     * 表情按钮点击回调
     * @param sender
     * @param type
     * @private
     */
    _onFaceCheckBoxChecked : function (sender, type) {
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            sender.setEnabled(false);
            this._cbText.setEnabled(true);
            this._cbText.setSelected(false);
            this._faceView.setVisible(true);
            this._textView.setVisible(false);
        }
    },

    /**
     * 文字按钮点击回调
     * @param sender
     * @param type
     * @private
     */
    _onTextCheckBoxChecked : function (sender, type) {
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            sender.setEnabled(false);
            this._cbFace.setEnabled(true);
            this._cbFace.setSelected(false);
            this._faceView.setVisible(false);
            this._textView.setVisible(true);
        }
    },

    /**
     * 关闭回调
     * @private
     */
    _close : function () {
        game.UISystem.closePopupWindow(this);
    }
});

ChatWindow.ChatType = {
    NORMAL          :   1,      // 普通聊天(自定义的聊天内容)
    PHRASE          :   2,      // 短语 (有语音的短语)
    FACE            :   3,      // 表情
    VOICE           :   4       // 语音
};

ChatWindow._instance = null;

/**
 * 弹出聊天窗口
 */
ChatWindow.popup = function () {
    if (this._instance == null) {
        this._instance = new ChatWindow();
        this._instance.retain();
    }
    game.UISystem.popupWindow(this._instance);
};