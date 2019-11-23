/**
 * Created by lyndon on 2018/06/04.
 *  银行弹窗
 */
game.ui.BankWin = game.ui.PopupWindow.extend({

    _node               : null,         // 本节点

    _fntBean            : null,         // 金贝数控件
    _fntSave            : null,         // 存款数控件

    _labelInput         : null,         // 输入金额控件

    _selSave            : null,         // 存入CheckBox
    _selGet             : null,         // 取出CheckBox
    _txtSave_1          : null,         // 存入文字普通状态
    _txtSave_2          : null,         // 存入文字高亮状态
    _txtGet_1           : null,         // 取出文字普通状态
    _txtGet_2           : null,         // 取出文字高亮状态

    _selRemember        : null,         // 记住密码CheckBox

    _keyboard           : null,         // 键盘
    _cashValue          : "",           // 当前输入的值

    _isSave             : true,         // true为存入操作 false为取出操作
    _lastTime           : 0,


    ctor: function () {
        this._super();
        this._node = ccs.load("res/Home/Bank/BankWindow.json").node;
        this._init();
        this.addChild(this._node);

        return true;
    },

    _init: function () {

        var btnClose = game.findUI(this._node, "BTN_Close");
        btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.close();
                game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_CLOSE_BANK,{});
            }
        }, this);

        var btnConfirm = game.findUI(this._node, "BTN_Confirm");
        btnConfirm.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this.onConfirmClick();
            }
        }, this);

        game.UISystem.showLoading("正在查询链上数据...");
        game.hallNet.sendMessage(protocol.ProtoID.SEER_REQ_COIN, {});
        // 携带和银行金贝显示
        var nd_1 = game.findUI(this._node, "ND_1");
        this._fntBean = game.findUI(nd_1, "Fnt_1");
        this._fntSave = game.findUI(nd_1, "Fnt_2");
        // 当前输入的金额
        var nd_2 = game.findUI(this._node, "ND_2");
        this._labelInput = game.findUI(nd_2, "Label_Cash");
        this._labelInput.setString("");
        // 数字键盘
        var nd_3 = game.findUI(this._node, "ND_3");
        this._keyboard = new game.ui.Keyboard(nd_3);
        this._keyboard.setKeyDownCallback(this._setCashValue.bind(this));
        // 存入 取出的选项
        var nd_4 = game.findUI(this._node, "ND_4");
        this._selSave = game.findUI(nd_4, "CheckBox_1");
        this._selGet = game.findUI(nd_4, "CheckBox_2");
        this._txtSave_1 = game.findUI(nd_4, "TXT_Save1");
        this._txtSave_2 = game.findUI(nd_4, "TXT_Save2");
        this._txtGet_1 = game.findUI(nd_4, "TXT_Get1");
        this._txtGet_2 = game.findUI(nd_4, "TXT_Get2");

        // 初始化为取出操作
        this._isSave = false;
        this.updateCheckStatus();
        this.registerCheckListen();
        this.updateBankInfo();

    },

    // 设置存取款的数值
    _setCashValue:function (num) {

        if (num == -1) {// 删除一位
            if (this._cashValue.length > 0)
            this._cashValue = this._cashValue.substring(0,this._cashValue.length - 1);
        } else if (num == -2) {// 重置所有
            this._cashValue = "";
        } else {
            if(this._cashValue.length < 9)// 加一位
                this._cashValue += num;
        }

        if (this._isSave) {
            if (+this._cashValue > +game.DataKernel.bean)
                this._cashValue = "" + game.DataKernel.bean;
        } else {
            if (+this._cashValue > +game.DataKernel.chain_coin)
                this._cashValue = "" + game.DataKernel.chain_coin;
        }

        this._labelInput.setString(this._cashValue);
    },

    // 设置银行的金贝
    updateBankInfo: function () {
        var bankBean = Utils.formatCoin(game.DataKernel.chain_coin);
        var myBean = Utils.formatCoin(game.DataKernel.bean);

        this._fntSave.setString(bankBean);
        this._fntBean.setString(myBean);
    },

    // 更新存入取出按钮状态
    updateCheckStatus: function () {
        var isSave = this._isSave;
        this._selSave.setSelected(isSave);
        this._selSave.setEnabled(!isSave);
        this._txtSave_2.setVisible(isSave);
        this._txtSave_1.setVisible(!isSave);

        this._selGet.setSelected(!isSave);
        this._selGet.setEnabled(isSave);
        this._txtGet_2.setVisible(!isSave);
        this._txtGet_1.setVisible(isSave);
    },

    // 注册CheckBox的点击事件
    registerCheckListen: function () {
        this._selSave.addEventListener(function (sender, type) {
            if (type == ccui.CheckBox.EVENT_SELECTED) {
                this._isSave = true;
                game.Audio.playBtnClickEffect();
                this.updateCheckStatus();
                var str = "存入seer只能全部存入，输入金额无效!";
                game.ui.HintMsg.showTipText(str,cc.p(640, 360), 5);
            }
        }, this);

        this._selGet.addEventListener(function (sender, type) {
            if (type == ccui.CheckBox.EVENT_SELECTED) {
                this._isSave = false;
                game.Audio.playBtnClickEffect();
                this.updateCheckStatus();
            }
        }, this);
    },
    // 重置存取金额
    resetCashValue: function () {
        this._cashValue = "";
        this._labelInput.setString(this._cashValue);
    },

    // 确定按钮被点击
    onConfirmClick: function () {
        var now = new Date();
        if (now - this._lastTime <= 1000) {

            return;
        }
        this._lastTime = now;

        if (this._isSave) {
            var curProcedure = game.Procedure.getProcedure();
            if(curProcedure != game.procedure.Home){
                game.ui.HintMsg.showTipText( "游戏过程中不能存钱！",cc.p(640, 360), 2);
                return;
            }
        }

        game.UISystem.showLoading("正在获取链上数据...");
        if (this._isSave) {
            game.hallNet.sendMessage(protocol.ProtoID.SEER_BANK_SAVE, {
                num    : +this._cashValue
            });
        }else {
            game.hallNet.sendMessage(protocol.ProtoID.SEER_BANK_GET, {
                num    : +this._cashValue
            });
        }
    },

    // 关闭本弹窗
    close: function () {
        if (game.ui.BankWin.inst) {
            game.UISystem.closeWindow(this);
        }
        game.ui.BankWin.inst = null;
    }
});
// 弹窗接口
game.ui.BankWin.popup = function () {
    var win = new game.ui.BankWin();
    game.ui.BankWin.inst = win;
    game.UISystem.popupWindow(win);
};

game.ui.BankWin.inst = null;