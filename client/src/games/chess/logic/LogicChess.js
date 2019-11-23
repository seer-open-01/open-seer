/**
 * Author       : lyndon
 * Date         : 2018-07-23
 * Description  : 象棋逻辑
 */
var LogicChess = GameLogicBasic.extend({

    enter : function (window) {
        this._super(window);
        game.Audio.chessPlayBGM();
    },

    leave : function () {
        this._super();

    },

    _afterUIInit: function () {
        this._super();
        // 重置玩家数据
        this._resetPlayers();
        // 绑定准备按钮回调
        var prepare = this._ui.getPrepare();
        prepare.onReadyClicked(this._BTN_Ready.bind(this));
        // 游戏界面按钮
        this._ui.onExitGameClicked(this._BTN_Exit.bind(this));
        this._ui.onGiveUpClicked(this._BTN_GiveUp.bind(this));
        this._ui.onSetBaseClicked(this._BTN_SetBase.bind(this));
        this._ui.onInviteClicked(this._BTN_Invite.bind(this));
        // 房间功能按钮绑定
        var roomCtrl = this._ui.getRoomBtnCtrl();
        roomCtrl.onSettingClicked(this._BTN_Setting.bind(this));
        roomCtrl.onBankClicked(this._BTN_Bank.bind(this));
        roomCtrl.onRuleClicked(this._BTN_Rule.bind(this));
    },

    //==== 逻辑函数 =======================================================
    /**
     * 重连回调
     */
    resetUpdateRoomInfo: function () {

        this._super();
        var gameData = game.procedure.Chess.getGameData();
        // 初始化开始按钮
        this._initPrepare();
        // 初始化房间控件
        this._initRoomCtrl();
        // 设置房间号
        this._ui.setRoomId(gameData.roomId);
        this._ui.setBase(gameData.baseBean);

        var chessBoard = this._ui.getBoard();
        chessBoard.reset();
        if (gameData.playing) {
            // 处理棋盘
            chessBoard.initChess(gameData.chessMap);
            chessBoard.setTouch(gameData.curPlayer == gameData.playerIndex);
            chessBoard.setRedTurn(gameData.isCreator());

            // 隐藏学费显示认输
            this._ui.showSetBase(false);
            this._ui.showGiveUp(true);

            // 处理玩家
            var myIndex = gameData.playerIndex;
            var otherIndex = myIndex == 1 ? 2 : 1;
            var me = this._ui.getPlayer(myIndex);
            var other = this._ui.getPlayer(otherIndex);
            me.setCamp(myIndex);other.setCamp(otherIndex);
            me.showDealer(myIndex == 1);other.showDealer(otherIndex == 1);
            me.showClock(myIndex == gameData.curPlayer);other.showClock(otherIndex == gameData.curPlayer);

            // 隐藏桌面提示
            this._ui.getTableTip().reset();
        }
    },
    /**
     * 重置玩家数据
     * @private
     */
    _resetPlayers : function () {
        var gameData = game.procedure.Chess.getGameData();
        var players = gameData.players;
        for (var index in players) {
            if (players.hasOwnProperty(index)) {
                var player = this._ui.getPlayer(index);
                player.reset();
                player.setInfo(index, players[index]);
                player.onHeadPicClicked(this.__HeadPicClicked.bind(this));
            }
        }
    },
    /**
     * 初始化准备按钮
     * @private
     */
    _initPrepare: function () {
        var gameData = game.procedure.Chess.getGameData();
        var prepare = this._ui.getPrepare();
        if (gameData.playing) {
            prepare.show(false);
        } else {
            prepare.show(true);
            if (gameData.isCreator()) {
                prepare.showBtnByType(1);
                prepare.setBeginEnabled(gameData.otherIsReady());
            } else {
                prepare.showBtnByType(2);
            }
        }

    },
    /**
     * 初始化房间控件
     * @private
     */
    _initRoomCtrl: function () {
        var gameData = game.procedure.Chess.getGameData();
        this._ui.showSetBase(gameData.isCreator());
        this._ui.showInvite(gameData.isOne());
        this._ui.showGiveUp(false);

        var tip = -1;
        if (gameData.isOne()) {
            tip = 1;
        }else {
            if (!gameData.otherIsReady()) {
                tip = 2;
            }
        }
        this._ui.getTableTip().showTableTip(tip);
    },
    /**
     * 结算后 下一局回调
     * @private
     */
    _nextRound: function () {
        // 初始化棋盘
        this._ui.getBoard().reset();
        // 隐藏阵营标签
        this._ui.hideCamp();
        // 显示设置底分
        var gameData = game.procedure.Chess.getGameData();
        this._ui.showSetBase(gameData.isCreator());
        // 初始化准备按钮
        this._initPrepare();
        // 重新播放背景音乐
        game.Audio.chessPlayBGM();
    },
    /**
     * 离开房间处理
     */
    __exitGame : function () {
        game.DataKernel.clearRoomId();
        game.Procedure.switch(game.procedure.RoomCard);
    },

    //==== 按钮点击 =======================================================
    /**
     * 准备按钮
     * @private
     */
    _BTN_Ready: function () {
        cc.log("准备按钮被点击！");
        game.Audio.playBtnClickEffect();
        this.__sendReady();
    },
    /**
     * 认输按钮
     * @private
     */
    _BTN_GiveUp: function () {
        cc.log("认输按钮被点击！");
        game.Audio.playBtnClickEffect();
        game.gameNet.sendMessage(protocol.ProtoID.XQ_GIVE_UP, {
            roomId: game.DataKernel.roomId,
            uid: game.DataKernel.uid
        });

    },
    /**
     * 设置底分按钮
     * @private
     */
    _BTN_SetBase: function () {
        cc.log("设置底分按钮被点击！");
        game.Audio.playBtnClickEffect();
        WindowChess.SetBaseWin.popup();
    },
    /**
     * 邀请
     * @private
     */
    _BTN_Invite: function () {
        cc.log("象棋按钮被点击！");
        if (WeChat.isWechatInstalled && WeChat.isWechatInstalled()) {
            var shareTitle = "《赛亚麻将》:象棋自建房";
            var shareMsg = "经典国粹，楚汉争霸，快来和我决一胜负!";
            // shareMsg += "邀请码：" + game.DataKernel.uid;
            shareMsg +=　"\n房间号：" + game.DataKernel.roomId;
            WeChat.share(false, game.config.WECHAT_SHARE_URL + game.DataKernel.uid, shareTitle, shareMsg, function (ok) {});
            // game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_SHARE, {uid: game.DataKernel.uid, isCircle: false});
        } else {
            cc.log("==> 微信没有安装");
        }
    },
    /**
     * 银行按钮点击
     * @private
     */
    _BTN_Bank: function () {
        cc.log("银行按钮被点击！");
        game.Audio.playBtnClickEffect();
        game.ui.BankWin.popup();
        // var bank = game.DataKernel.storageBox;
        // if(bank.remember) {
        //     game.ui.BankWin.popup();
        // } else {
        //     if (bank.password) {
        //         game.ui.VerifyWin.popup();
        //     }else {
        //         // 验证弹框
        //         game.ui.TipWindow.popup({
        //             tipStr: "为了您的游戏财产安全\n使用银行功能请设置操作密码。"
        //         }, function (win) {
        //             game.UISystem.closeWindow(win);
        //             game.ui.BankSettingWin.popup();
        //         });
        //     }
        // }
    },
    /**
     * 规则按钮点击
     * @private
     */
    _BTN_Rule: function () {
        cc.log("规则按钮被点击！");
        game.ui.HelpWin.popup(GameTypeConfig.type.XQ);
    },
    /**
     * 玩家头像点击事件
     * @param index
     * @private
     */
    __HeadPicClicked: function (index) {
        cc.log("第 " + index + "个玩家被点击");
        game.ui.GamePlayerInfo.popup(index);
    },

    //==== 消息处理 =======================================================
    bindNetMessageHandler: function () {
        this._super();
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.XQ_NEW_ROUND, this.__NET_onStartNewRound.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.XQ_NEXT_PLAY, this.__NET_onNextPlay.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.XQ_SELECT_CHESS, this.__NET_onSelectChess.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.XQ_MOVE_CHESS, this.__NET_onMoveChess.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.XQ_RETRACT_CHESS, this.__NET_onRetractChess.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.XQ_GIVE_UP, this.__NET_onGiveUp.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.XQ_SET_BASE, this.__NET_onSetBase.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.XQ_CHI, this.__NET_onChi.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.XQ_JIANG, this.__NET_onJiang.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.XQ_SETTLEMENT, this.__NET_onSettlement.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_CLIENT_FINISH_ROOM, this.__NET_onRoomFinish.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ROOM_RESOURCE_UPDATE, this.__NET_onUpdateRoomResource.bind(this));
    },
    /**
     * 结算消息
     */
    __NET_onSettlement: function (msg) {
        cc.log("==> 象棋 结算消息：" + JSON.stringify(msg));

        var gameData = game.procedure.Chess.getGameData();
        gameData.updateEndRound();

        WindowChess.SettlementWindow.popup(msg, function () {
            this._nextRound();
        }.bind(this));

        // 重置玩家计时器
        for (var i = 1; i <= 2; ++i) {
            this._ui.getPlayer(i).showClock(false);
            this._ui.getPlayer(i).showLight(false);
        }

        // 隐藏认输
        this._ui.showGiveUp(false);
    },
    /**
     * 结算消息
     */
    __NET_onChi: function (msg) {
        cc.log("==> 象棋 吃棋消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var gameData = game.procedure.Chess.getGameData();
        // if (index == gameData.playerIndex) {
            var sex = gameData.players[index].sex;
            game.Audio.chessPlayChi(sex);
        // }
        game.Procedure.pauseNetMessageDispatch();
        GameEffectController.playGameEffect(this._ui, null, cc.p(640, 460),
            GameEffectController.gameEffectType.ChessChi, function () {
                game.Procedure.resumeNetMessageDispatch();
                cc.log("特效调用完毕");
            });
    },
    /**
     * 结算消息
     */
    __NET_onJiang: function (msg) {
        cc.log("==> 象棋 将军消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var gameData = game.procedure.Chess.getGameData();
        //if (index == gameData.playerIndex) {
            var sex = gameData.players[index].sex;
            game.Audio.chessPlayJiang(sex);
        //}
        game.Procedure.pauseNetMessageDispatch();
        GameEffectController.playGameEffect(this._ui, null, cc.p(640, 460),
            GameEffectController.gameEffectType.ChessJiang, function () {
                game.Procedure.resumeNetMessageDispatch();
            cc.log("特效调用完毕");
        });
    },
    /**
     * 设置底分消息
     */
    __NET_onSetBase: function (msg) {
        cc.log("==> 象棋 设置底分消息：" + JSON.stringify(msg));
        if (msg.result != 0) {
            cc.log("修改底分错误");
            return;
        }
        var baseBean = msg.baseBean;
        game.ui.HintMsg.showTipText("设置学费成功!", cc.p(640, 360), 2.0);
        game.UISystem.closeWindow(WindowChess.SetBaseWin.inst);
        this._ui.setBase(baseBean);

    },
    /**
     * 认输消息
     */
    __NET_onGiveUp: function (msg) {
        cc.log("==> 象棋 认输消息：" + JSON.stringify(msg));

    },
    /**
     * 悔棋消息
     */
    __NET_onRetractChess: function (msg) {
        cc.log("==> 象棋 悔棋消息：" + JSON.stringify(msg));

    },
    /**
     * 走棋消息
     */
    __NET_onMoveChess: function (msg) {
        cc.log("==> 象棋 走棋消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Chess.getGameData();
        if (msg.result != 0) {
            if (msg.playerIndex == gameData.playerIndex) {
                if (msg.result == 38) {
                    var str = "被将军！"
                }else if (msg.result == 37){
                    str = "走棋不符合规则！"
                }

                game.ui.HintMsg.showTipText(str, cc.p(640, 460), 1.0);
            }
            return;
        }

        var index = msg.playerIndex;
        var chessId= msg.chessId;
        var killId = msg.killId;
        var movePt = cc.p(msg.cx, msg.cy);
        var toPt = cc.p(msg.x, msg.y);
        var chessBoard = this._ui.getBoard();
        chessBoard.movePiece(index, chessId, killId, movePt, toPt);
    },
    /**
     * 选棋消息
     */
    __NET_onSelectChess: function (msg) {
        cc.log("==> 象棋 选棋消息：" + JSON.stringify(msg));
        if (msg.result != 0) {
            return;
        }
        var selectId = msg.selectId;
        var index = msg.playerIndex;
        var path = msg.path;
        var chessBoard = this._ui.getBoard();
        chessBoard.selectPiece(selectId, index, path);
    },
    /**
     * 玩家轮替消息
     */
    __NET_onNextPlay: function (msg) {
        cc.log("==> 象棋 玩家轮替消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var gameData = game.procedure.Chess.getGameData();
        var chessBoard = this._ui.getBoard();
        chessBoard.setSelectId(-1);
        // 棋盘触摸事件
        if (index == gameData.playerIndex) {
            chessBoard.setTouch(true);
            chessBoard.setRedTurn(gameData.isCreator());
        }else {
            chessBoard.setTouch(false);
        }

        // 玩家计时器
        var hideIndex = index == 1 ? 2 : 1;
        this._ui.getPlayer(index).showClock(true);
        this._ui.getPlayer(hideIndex).showClock(false);

        // 显示流光
        this._ui.getPlayer(index).showLight(true);
        this._ui.getPlayer(hideIndex).showLight(false);

    },
    /**
     * 开始新一局消息
     */
    __NET_onStartNewRound: function (msg) {
        cc.log("==> 象棋 开始新一局消息：" + JSON.stringify(msg));

        var gameData = game.procedure.Chess.getGameData();
        gameData.updateStartNewRound();

        // 新一局开始 房主先走
        var chessBoard = this._ui.getBoard();
        chessBoard.initForNewRound();

        // 隐藏准备标签
        this._ui.hideReady();
        // 隐藏设置底分按钮
        this._ui.showSetBase(false);
        // 显示认输按钮
        this._ui.showGiveUp(true);
        // 隐藏桌面提示消息
        this._ui.getTableTip().showTableTip(-1);

        // 显示阵营标签
        var myIndex = gameData.playerIndex;
        var otherIndex = myIndex == 1 ? 2 : 1;
        this._ui.getPlayer(myIndex).setCamp(myIndex);
        this._ui.getPlayer(otherIndex).setCamp(otherIndex);

    },

    /**
     * 玩家离开房间消息
     * @param msg
     * @private
     */
    __NET_onPlayerLeave : function(msg) {
        cc.log("==> 玩家离开房间消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var gameData = game.Procedure.getProcedure().getGameData();
        if (index == gameData.playerIndex) {
            this.__exitGame();
            return;
        }

        // 邀请按钮和准备按钮
        this._ui.showInvite(true);
        var prepare = this._ui.getPrepare();
        prepare.showBtnByType(1);
        prepare.setBeginEnabled(false);
        prepare.show(true);

        // 桌面提示消息:等待其他玩家加入
        var tableTip = this._ui.getTableTip();
        tableTip.showTableTip(1);

        // 恢复棋盘
        var chessBoard = this._ui.getBoard();
        chessBoard.reset();

        // 隐藏认输按钮 显示设置底分节点
        this._ui.showGiveUp(false);
        this._ui.showSetBase(true);

        // 房主隐藏流光特效
        this._ui.getPlayer(1).showLight(false);

        // 删除玩家
        delete gameData.players[index];
        var uiPlayer = this._ui.getPlayer(index);
        uiPlayer && uiPlayer.setInfo(-1);
    },

    /**
     * 加入玩家消息
     * @param msg
     * @private
     */
    __NET_onPlayerAdd : function(msg) {
        cc.log("==> 新玩家加入消息：" + JSON.stringify(msg));
        this._super(msg);

        // 隐藏房主的邀请按钮
        this._ui.showInvite(false);

        // 显示等待其他玩家准备提示
        var tableTip = this._ui.getTableTip();
        tableTip.showTableTip(2);

    },

    /**
     * 玩家准备消息
     */
    __NET_onPlayerReady: function (msg) {
        this._super(msg);
        cc.log("==> 重写玩家准备消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Chess.getGameData();
        var prepare = this._ui.getPrepare();
        var tableTip = this._ui.getTableTip();
        if (msg.playerIndex == 2) {
            // 房主开始按钮可以点击 对方玩家显示等待房主开始游戏
            if (gameData.isCreator()) {
                prepare.setBeginEnabled(true);
                tableTip.showTableTip(-1);
            } else {
                tableTip.showTableTip(3);
            }
        }


    },
    /**
     * 房间资源改变消息
     * @param msg
     * @private
     */
    __NET_onUpdateRoomResource : function (msg) {
        cc.log("==> 游戏房间的资源改变消息" + JSON.stringify(msg));
        var playerObj = msg.players;
        var reason = msg.reason;
        var gameData = game.procedure.Chess.getGameData();
        var players = gameData.players;

        for (var index in playerObj) {
            if (playerObj.hasOwnProperty(index)) {
                var bean = playerObj[index].bean;
                var card = playerObj[index].card;
                players[index].bean = bean;
                players[index].card = card;
                var uiPlayer = this._ui.getPlayer(index);
                uiPlayer.setBean(bean);
                if (+index == gameData.playerIndex && (reason == 10 || reason == 11 || reason == 24)) {
                    // game.ui.RechargeHint.close();
                }
            }
        }
    },
    /**
     * 房间被房主解散
     * @param msg
     * @private
     */
    __NET_onRoomFinish: function (msg) {
        cc.log("==> 房间已被解散 " + JSON.stringify(msg));
        var gameData = game.procedure.Chess.getGameData();
        if (!gameData.isCreator()) {
            game.ui.TipWindow.popup({
                "tipStr": "房间已被解散!"
            }, function () {
                game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_QUIT_ROOM, {
                    uid : game.DataKernel.uid,
                    roomId : game.DataKernel.roomId
                });
            }.bind(this))
        }
    }
});