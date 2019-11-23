/**
 * @Author       : Lyndon
 * @Date         : 2019-07-12
 * @Description  : 商城充值界面
 */
game.ui.MallWin = game.ui.PopupWindow.extend({

    _node   : null,

    _acc    : null,
    _chain  : null, // 链上
    _bean   : null, // 金贝

    ctor: function () {
        this._super();
        this._node = ccs.load("res/Home/Mall/MallWin2.json").node;
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

        var btnCopy = game.findUI(this._node, "BTN_Copy");
        btnCopy.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                if (game.DataKernel.seer_account != "") {
                    game.ui.HintMsg.showTipText( "复制账户成功！", cc.p(640, 360), 3);
                    Platform.setClipStr("" + game.DataKernel.seer_account);
                }
            }
        }, this);

        this._acc = game.findUI(this._node, "Label_Acc");
        this._acc.setString("账户：" + game.DataKernel.seer_account);


        this._chain = game.findUI(this._node, "Fnt_Chain");
        this._bean = game.findUI(this._node, "Fnt_Bean");

        game.UISystem.showLoading("正在查询链上数据...");
        game.hallNet.sendMessage(protocol.ProtoID.SEER_REQ_COIN, {});
        // var btnRecord = game.findUI(this._node, "BTN_Record");
        // btnRecord.addTouchEventListener(function (sender, type) {
        //     if (type == ccui.Widget.TOUCH_ENDED) {
        //         game.hallNet.sendMessage(protocol.ProtoID.PFC_CHARGE_INFO,{});
        //     }
        // }, this);

        // this._add = new cc.Label("default", "res/Fonts/YaHei.ttf");
        // this._add.setSystemFontSize(22);
        // this._add.setColor(cc.color(232, 122, 46));
        // this._add.setPosition(263, 238);
        // var bg = game.findUI(this._node, "ND_Bg2");
        // bg.addChild(this._add);

        // this._qr = game.findUI(this._node, "ND_Qr");
        // this._bean = game.findUI(this._node, "Fnt_Bean");
        // this.updateInfo();
        // if (game.DataKernel.pfcAdd != "") {
        //     this.setInfo();
        // }else {
        //     var tip = Utils.labelLinefeed("绑定充值地址出错，请重新登陆或联系客服！", 10);
        //     this._add.setString(tip);
        // }
    },
    // 设置二维码和钱包地址
    setInfo: function () {
        // var str = Utils.labelLinefeed(game.DataKernel.pfcAdd, 20);
        // this._add.setString(str);
        // // cc.log("=======> " + game.DataKernel.pfcAdd);
        // cc.textureCache.addImageAsync(game.DataKernel.pfcQR, function(tex) {
        //     this._qr.setTexture(tex);
        // }.bind(this), this);
    },
    // 更新金币显示
    updateInfo: function () {
        var bean = Utils.formatCoin(game.DataKernel.bean);
        this._bean.setString(bean);
        var chain = Utils.formatCoin(game.DataKernel.chain_coin);
        this._chain.setString(chain);
    },
    // 关闭本弹窗
    close: function () {
        if (game.ui.MallWin.inst) {
            game.UISystem.closeWindow(this);
        }
        game.ui.MallWin.inst = null;
    }

});

game.ui.MallWin.popup = function () {
    var win = new game.ui.MallWin();
    game.ui.MallWin.inst = win;
    game.UISystem.popupWindow(win);
};

game.ui.MallWin.inst = null;