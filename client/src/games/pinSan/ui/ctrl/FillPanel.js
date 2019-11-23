/**
 * Created by Jiyou Mo on 2017/11/30.
 */
GameWindowPinSan.FillPanel = cc.Class.extend({

    _node               : null,         // 本节点
    _parentNode         : null,         // 父节点

    _btnClose           : null,         // 关闭按钮
    _btnFill2           : null,         // 加注2倍按钮
    _btnFill3           : null,         // 加注3倍按钮
    _btnFill4           : null,         // 加注4倍按钮
    _btnFill5           : null,         // 加注5倍按钮

    _labelFill2         : null,         // 2倍按钮文字
    _labelFill3         : null,         // 3倍按钮文字
    _labelFill4         : null,         // 4倍按钮文字
    _labelFill5         : null,         // 5倍按钮文字

    _lastTime           : 0,            // 上次点击按钮的时间
    _clickInterval      : 500,          // 点击按钮的时间间隔

    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinSan/AddAntePanel/AddAntePanel.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {
        // 关闭按钮
        this._btnClose = game.findUI(this._node, "BTN_Close");
        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                var now = new Date();
                if (now - this._lastTime < this._clickInterval) {
                    return;
                }
                this._lastTime = now;
                this.show(false);
            }
        }, this);

        // 加注2倍按钮
        this._btnFill2 = game.findUI(this._node, "BTN_Ante_2");
        this._btnFill2.bet = 2;
        this._labelFill2 = game.findUI(this._btnFill2, "TXT_Value");
        this._btnFill2.addTouchEventListener(this._fillClicked, this);

        // 加注3倍按钮
        this._btnFill3 = game.findUI(this._node, "BTN_Ante_3");
        this._btnFill3.bet = 3;
        this._labelFill3 = game.findUI(this._btnFill3, "TXT_Value");
        this._btnFill3.addTouchEventListener(this._fillClicked, this);

        // 加注4倍按钮
        this._btnFill4 = game.findUI(this._node, "BTN_Ante_4");
        this._btnFill4.bet = 4;
        this._labelFill4 = game.findUI(this._btnFill4, "TXT_Value");
        this._btnFill4.addTouchEventListener(this._fillClicked, this);

        // 加注5倍按钮
        this._btnFill5 = game.findUI(this._node, "BTN_Ante_5");
        this._btnFill5.bet = 5;
        this._labelFill5 = game.findUI(this._btnFill5, "TXT_Value");
        this._btnFill5.addTouchEventListener(this._fillClicked, this);
    },

    reset : function () {
        this.updateStatus();
    },

    show : function (bool) {
        this._node.setVisible(bool);
        this.updateStatus();
    },

    _fillClicked : function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            game.Audio.playBtnClickEffect();
            var now = new Date();
            if (now - this._lastTime < this._clickInterval) {
                return;
            }
            this._lastTime = now;
            this.show(false);
            var gameData = game.procedure.PinSan.getGameData();
            var me = gameData.getMainPlayer();
            // game.netClient.request("game.req.pSZBet", {
            //     bet : sender.bet * (me.cardState == GameDataPinSanHelp.CardsStatus.HaveToSee ? 2 : 1)
            // }, function (json) {});
            game.gameNet.sendMessage(protocol.ProtoID.PSZ_REQ_ADD_ANTE,
                {
                    uid: game.DataKernel.uid,
                    roomId: game.DataKernel.roomId,
                    roundBet : sender.bet * (me.cardState == GameDataPinSanHelp.CardsStatus.HaveToSee ? 2 : 1)
                });

        }
    },

    updateStatus : function () {
        var gameData = game.procedure.PinSan.getGameData();
        var me = gameData.getMainPlayer();
        // 设置按钮状态
        this._btnFill2.setEnabled(gameData.multiple < 2);
        this._btnFill3.setEnabled(gameData.multiple < 3);
        this._btnFill4.setEnabled(gameData.multiple < 4);
        this._btnFill5.setEnabled(gameData.multiple < 5);

        var bet = me.cardState == GameDataPinSanHelp.CardsStatus.HaveToSee ? 2 : 1;
        // var roundCoin = gameData.sceneOptions.roundCoin;
        // var roundCoin = 10;
        var roundCoin = gameData.baseBean;
        var ante = this._btnFill2.bet * roundCoin;
        ante *= bet;
        var aa = Utils.formatCoin2(Math.floor(ante));
        this._labelFill2.setString("" + aa);

        ante = this._btnFill3.bet * roundCoin;
        ante *= bet;
        aa = Utils.formatCoin2(Math.floor(ante));
        this._labelFill3.setString("" + aa);

        ante = this._btnFill4.bet * roundCoin;
        ante *= bet;
        aa = Utils.formatCoin2(Math.floor(ante));
        this._labelFill4.setString("" + aa);

        ante = this._btnFill5.bet * roundCoin;
        ante *= bet;
        aa = Utils.formatCoin2(Math.floor(ante));
        this._labelFill5.setString("" + aa);

        // 设置按钮纹理
        var path = "res/Games/PinSan/Image/Chips_";
        var path2 = path + (this._btnFill2.bet * bet);
        var path3 = path + (this._btnFill3.bet * bet);
        var path4 = path + (this._btnFill4.bet * bet);
        var path5 = path + (this._btnFill5.bet * bet);
        this._btnFill2.loadTextures(path2 + "N.png", path2 + "P.png", path2 + "D.png");
        this._btnFill3.loadTextures(path3 + "N.png", path3 + "P.png", path3 + "D.png");
        this._btnFill4.loadTextures(path4 + "N.png", path4 + "P.png", path4 + "D.png");
        this._btnFill5.loadTextures(path5 + "N.png", path5 + "P.png", path5 + "D.png");
    }
});
