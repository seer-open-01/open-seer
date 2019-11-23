/**
 * Author       : lyndon
 * Date         : 2018-07-28
 * Description  : 设置底分界面
 */
WindowChess.SetBaseWin = game.ui.PopupWindow.extend({

    _node               : null,

    _keyBoard           : null,         // 键盘
    _values             : "",           // 输入框的值
    _fntBase            : null,         // 输入框字体控件
    _lastTime           : 0,            // 最后请求时间


    ctor: function () {
        this._super();
        this._node = ccs.load("res/Games/Chess/SetBaseWin/SetBaseWin.json").node;
        this._init();
        this.addChild(this._node);

        return true;
    },

    _init: function () {

        var keyNode = game.findUI(this._node, "ND_Key");
        this._keyBoard = new game.ui.Keyboard(keyNode);
        this._keyBoard.setKeyDownCallback(this.setBase.bind(this));
        this._fntBase = game.findUI(this._node, "Fnt_Base");
        this._fntBase.setString("");

        var closeBtn = game.findUI(this._node, "Btn_Close");
        closeBtn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        var confirmBtn = game.findUI(this._node, "Btn_Confirm");
        confirmBtn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this.reqSetBase();
            }
        }, this);

    },
    /**
     * 输入房间号
     * @param num
     */
    setBase: function (num) {
        if (num == -1) {// 删除一位
            if (this._values.length > 0)
                this._values = this._values.substring(0,this._values.length - 1);
        } else if (num == -2) {// 重置所有
            this._values = "";
        } else {
            if(this._values.length < 9){
                this._values += num;
            }
        }

        var temp = + this._values;
        if (temp > game.DataKernel.bean) {
            this._values = "" + game.DataKernel.bean;
        }

        cc.log("底分 " + this._values);
        this._fntBase.setString(this._values);
    },
    /**
     * 请求设置底分
     */
    reqSetBase: function () {
        // 设置数额大于超出两万的部分
        // if (this._values < 1000000) {
        //     game.ui.HintMsg.showTipText("设置学费不能小于100万！", cc.p(640, 360), 3);
        //     return;
        // }
        var now = new Date();
        if (now - this._lastTime < 1000) {
            return;
        }
        this._lastTime = now;
        game.gameNet.sendMessage(protocol.ProtoID.XQ_SET_BASE, {
            baseBean: this._values,
            roomId: game.DataKernel.roomId,
            uid: game.DataKernel.uid
        });
    }

});
/**
 * 设置底分弹窗方法
 */
WindowChess.SetBaseWin.popup = function () {
    var win = new WindowChess.SetBaseWin();
    WindowChess.SetBaseWin.inst = win;
    game.UISystem.popupWindow(win);
};

WindowChess.SetBaseWin.inst = null;