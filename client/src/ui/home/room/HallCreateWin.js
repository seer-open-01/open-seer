/**
 * Author       : lyndon
 * Date         : 2018-10-16
 * Description  : 大厅创建房间弹窗
 */
game.ui.HallCreateWin = game.ui.PopupWindow.extend({
    _node           : null,

    _optsNode       : null,
    _btnBase        : null,
    _page           : null,
    _txtBase        : "",
    _txtEnter       : "",
    _gameType       : 8,
    _isPublic       : true,
    _base           : 0,
    _enter          : 0,

    ctor: function (gameType) {
        this._super();
        this._node = ccs.load("res/Home/RoomCard/CreateWin.json").node;
        this._gameType = gameType;
        this.addChild(this._node);
        this._init();
        return true;
    },

    _init: function () {
        this._optsNode = game.findUI(this._node, "ND_Option");
        var nd_1 = game.findUI(this._node, "ND_1");
        var pub_sel = [];
        pub_sel[0] = {ctrl: game.findUI(nd_1, "CheckBox_1"), value: true};
        pub_sel[1] = {ctrl: game.findUI(nd_1, "CheckBox_2"), value: false};
        var pubGroup = new game.ui.RadioGroup("pub_sel", pub_sel, 0);
        pubGroup.onSelectChanged(this.updatePubSel.bind(this));
        this.updatePubSel(pub_sel[0]);

        var nd_2 = game.findUI(this._node, "ND_2");
        this._txtBase = game.findUI(nd_2, "label");
        this._btnBase = game.findUI(nd_2, "btn");
        this._btnBase.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.ui.SetBaseWin.popup(this.updateBaseValue.bind(this));
            }
        }, this);

        var nd_3 = game.findUI(this._node, "ND_3");
        this._txtEnter =game.findUI(nd_3, "label");

        var game_sel = [];
        game_sel[0] = {ctrl: game.findUI(this._node, "Sel_Game1"), value: 1};
        game_sel[1] = {ctrl: game.findUI(this._node, "Sel_Game2"), value: 2};
        game_sel[2] = {ctrl: game.findUI(this._node, "Sel_Game3"), value: 3};
        game_sel[3] = {ctrl: game.findUI(this._node, "Sel_Game4"), value: 4};
        game_sel[4] = {ctrl: game.findUI(this._node, "Sel_Game5"), value: 5};
        game_sel[5] = {ctrl: game.findUI(this._node, "Sel_Game6"), value: 6};
        var cur_sel = 5;
        switch (this._gameType) {
            case GameTypeConfig.type.HNMJ:
                cur_sel = 0;
                break;
            case GameTypeConfig.type.NN:
                cur_sel = 1;
                break;
            case GameTypeConfig.type.PSZ:
                cur_sel = 2;
                break;
            case GameTypeConfig.type.DDZ:
                cur_sel = 3;
                break;
            case GameTypeConfig.type.RUN:
                cur_sel = 4;
                break;
        }
        var selGroup = new game.ui.RadioGroup("game_sel", game_sel, cur_sel);
        selGroup.onSelectChanged(this.updateSelectSate.bind(this));
        this.updateSelectSate(game_sel[cur_sel]);

        var closeBtn = game.findUI(this._node, "Btn_Close");
        closeBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
                game.ui.HallCreateWin.inst = null
            }
        }, this);

        var createBtn = game.findUI(this._node, "Btn_Create");
        createBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                cc.log("创建房间被点击！");
                game.Audio.playBtnClickEffect();
                this.doCreate();
            }
        }, this);


    },

    // 更新游戏选择
    updateSelectSate: function (sender) {
        cc.log("==> 切换创建游戏类型: " + sender.value);
        this._base = 0;
        this._txtBase.setString("" + 0);
        this._enter = 0;
        this._txtEnter.setString("" + 0);
        this._optsNode.removeAllChildren();
        this._page = null;
        switch (sender.value) {
            case 1:
                this._gameType = GameTypeConfig.type.HNMJ;
                this._page = new game.ui.CreateOpts(this._optsNode);
                break;
            case 2:
                this._gameType = GameTypeConfig.type.NN;
                this._page = new game.ui.CreateOpts2(this._optsNode);
                break;
            case 3:
                this._gameType = GameTypeConfig.type.PSZ;
                this._page = new game.ui.CreateOpts3(this._optsNode);
                break;
            case 4:
                this._gameType = GameTypeConfig.type.DDZ;
                this._page = new game.ui.CreateOpts4(this._optsNode);
                break;
            case 5:
                this._gameType = GameTypeConfig.type.RUN;
                this._page = new game.ui.CreateOpts5(this._optsNode);
                break;
            case 6:
                this._gameType = GameTypeConfig.type.CDMJ;
                this._page = new game.ui.CreateOpts6(this._optsNode);
                break;
        }
    },

    // 更新公开状态
    updatePubSel: function (sender) {
        this._isPublic = sender.value;
    },

    // 更新底分
    updateBaseValue: function (value) {
        this._base = value;
        this._txtBase.setString("" + value);
        this._enter = this.getEnter(value);
        this._txtEnter.setString("" + this._enter);
    },

    doCreate: function () {
        // game.UISystem.showLoading();
        var opts = this._page.getOpts();
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_CREATE_ROOM, {
            gameType: this._gameType,
            subType: opts.subType,
            isPub: this._isPublic,
            baseBean: this._base,
            opts: opts
        });
    },
    // 计算准入
    getEnter: function (base) {
        var enter = 0;
        switch (this._gameType) {
            case GameTypeConfig.type.HNMJ:
                enter = base * 40;
                break;
            case GameTypeConfig.type.DDZ:
                enter = base * 64;
                break;
            case GameTypeConfig.type.PSZ:
                enter = base * 40;
                break;
            case GameTypeConfig.type.NN:
                enter = base * 30;
                break;
            case GameTypeConfig.type.RUN:
                enter = base * 28;
                break;
            case GameTypeConfig.type.CDMJ:
                enter = base * 48;
                break;
            default:
                enter = base * 30;
        }
        return enter;
    }
});

game.ui.HallCreateWin.popup = function (gameType) {
    var win = new game.ui.HallCreateWin(gameType);
    game.ui.HallCreateWin.inst = win;
    game.UISystem.showWindow(win);
};
game.ui.HallCreateWin.inst = null;

