/**
 * Created by fuyang on 2018/10/17.
 */
//麻将退出房间申请面板
GameWindowMahjong.Mahjong_WaitQuitWindow = game.ui.PopupWindow.extend({

    _node: null,                   //本节点
    _titel1: null,                 //标题 申请解散 房主显示
    _titel2: null,                 //标题 解散房间 普通玩家显示
    _btnClose: null,               //关闭按钮
    _btnOk: null,                  //同意解散
    _btnNo: null,                  //拒绝解散
    _timeLable: null,              //显示房间倒计时的文本

    _playerUiNode: [],             //玩家UI存放节点
    _playerInfoItem: [],           //玩家具体数据的Item管理数组

    _waitTitel: null,              //等到玩家相应

    _durationTime: 0,              //给玩家的操作的可用时间
    _timer: null,                  //定时器

    ctor: function () {

        this._node = ccs.load("res/Games/Mahjong/Quit/WaitQuit.json").node;
        this._super();
        this.addChild(this._node);
        this._init();
        return true;
    },
    _init: function () {
        this._titel1 = game.findUI(this._node, "Pic_Titel1");
        this._titel2 = game.findUI(this._node, "Pic_Titel2");
        this._timeLable = game.findUI(this._node, "Text_Time");

        //按钮
        this._btnClose = game.findUI(this._node, "Btn_Close");
        this._btnOk = game.findUI(this._node, "AgreeBtn");
        this._btnNo = game.findUI(this._node, "RefuseBtn");

        //玩家UI节点管理数组
        this._playerUiNode = [];
        for (var i = 0; i < 4; ++i) {
            this._playerUiNode[i] = game.findUI(this._node, "Player" + i);
        }
        this._waitTitel = game.findUI(this._node, "WaitTitel");
        this._durationTime = 0;
        this._playerInfoItem = [];
        this._registerBtn();
    },

    //注册本界面的按钮
    _registerBtn: function () {
        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                //game.UISystem.closePopupWindow(this);
                game.gameNet.sendMessage(protocol.ProtoID.GAME_ON_RESP_DESTROYROOM, {
                    uid: game.DataKernel.uid,
                    roomId: game.DataKernel.roomId,
                    ok: false
                });
            }
        }, this)
        this._btnOk.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.gameNet.sendMessage(protocol.ProtoID.GAME_ON_RESP_DESTROYROOM, {
                    uid: game.DataKernel.uid,
                    roomId: game.DataKernel.roomId,
                    ok: true
                });
            }
        }, this)
        this._btnNo.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.gameNet.sendMessage(protocol.ProtoID.GAME_ON_RESP_DESTROYROOM, {
                    uid: game.DataKernel.uid,
                    roomId: game.DataKernel.roomId,
                    ok: false
                });
            }
        }, this)
    },
    //外部调用，当有玩家申请解散 或者退出麻将游戏的时候调用
    //requestindex申请者的index
    //当前申请解散的房间里面的玩家数据
    setDate: function (requestindex) {

        var Data = game.procedure.Mahjong.getGameData();
        var players = Data.players;

        //申请解散的玩家是自己，隐藏拒绝，同意按钮，显示正在等待其他玩家选择
        if (requestindex == Data.playerIndex) {
            this._btnOk.setVisible(false);
            this._btnNo.setVisible(false);
            this._btnClose.setVisible(false);
            this._waitTitel.setVisible(true);
            this._titel1.setVisible(true);
            this._titel2.setVisible(false);
        }
        //不是自己
        else {
            this._btnOk.setVisible(true);
            this._btnNo.setVisible(true);
            this._btnClose.setVisible(true);
            this._waitTitel.setVisible(false);
            this._titel1.setVisible(false);
            this._titel2.setVisible(true);
        }
        //玩家信息预制体实例化并且填充数据
        var idx = 0;
        for (var index in players) {
            if (players.hasOwnProperty(index)) {
                if (players[index]) {
                    var Item = new GameWindowMahjong.playerInfoItem(requestindex, players[index], this._playerUiNode[idx]);
                    //这里要先设置ID 在设置信息，
                    Item._id = +index;
                    Item._setInfo();
                    this._playerInfoItem.push(Item)
                    this._playerUiNode[idx].setVisible(true);
                    idx++;
                }
            }
        }
        this._layOut();
    },
    //在收到玩家选择的服务器推送消息以后，关闭这个同意，拒绝按钮不显示
    hideBtn: function () {
        this._btnOk.setVisible(false);
        this._btnNo.setVisible(false);
        this._btnClose.setVisible(false);
    },

    //布局 默认的是4人麻将，如果是2人麻将的话，那么有2个多余节点需要隐藏，位子需要动态布局
    _layOut: function () {
        var gameData = game.procedure.Mahjong.getGameData();
        var gameNum = gameData.getPlayerNum();
        //2人麻将
        if (gameNum == 2) {
            this._playerUiNode[0].setPositionX(330);
            this._playerUiNode[1].setPositionX(514);
            this._playerUiNode[2].setVisible(false);
            this._playerUiNode[3].setVisible(false);
        }
        //4人麻将
        else {

        }
    },
    //设置玩家选择的状态标记 外部调用的，发起解散的人是没有同意 拒绝按钮的，
    //index 代表选择的玩家索引
    //flag  代表选择的标记，为true 同意，为false 不同意
    SetPlayerIsAgree: function (index, flag) {
        for (var i = 0; i < this._playerInfoItem.length; ++i) {
            if (this._playerInfoItem[i]._id == index) {
                this._playerInfoItem[i].setFlag(flag);
            }
        }
        var Data = game.procedure.Mahjong.getGameData();
        if(index == Data.playerIndex){
            //更改确定 拒绝按钮隐藏
            this.hideBtn();
        }
    },
    //开始计时
    StartTimer: function (time) {
        this._durationTime = time;
        this._timeLable.setString("" + this._durationTime + "s后解散房间...");
        this._timeLable.stopAllActions();
        this._timeLable.runAction(cc.Sequence(cc.DelayTime(1.0), cc.CallFunc(function () {
            this._timeLable.setString("" + this._durationTime + "s后解散房间...");
            this._durationTime -= 1;
            if (this._durationTime <= 0) {
                this._destroy();
                this._timeLable.stopAllActions();
            }
        }, this)).repeatForever());
    },

    CloseBtn: function () {
        this._btnOk.setVisible(false);
        this._btnNo.setVisible(false);
        this._btnClose.setVisible(false);
    },

    //销毁定时器
    _destroy: function () {
        GameWindowMahjong.Mahjong_WaitQuitWindow.inst = null;
        game.UISystem.closePopupWindow(this);
    }
});
//弹出窗口
GameWindowMahjong.Mahjong_WaitQuitWindow.inst = null;

GameWindowMahjong.Mahjong_WaitQuitWindow.popup = function (requestindex) {
    var win = new GameWindowMahjong.Mahjong_WaitQuitWindow();
    GameWindowMahjong.Mahjong_WaitQuitWindow.inst = win;
    win.setDate(requestindex);
    game.UISystem.showWindow(win);
};
