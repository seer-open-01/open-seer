/**
 * Created by lyndon on 2018/05/15.
 */

var GameLogicPinShi = GameLogicBasic.extend({

    enter: function (window) {
        cc.log("进入拼十游戏逻辑！");
        // 播放背景音乐
        game.Audio.nnPlayBGM();

        this._super(window);
    },

    leave: function () {
        this._super();
    },

    /**
     * UI初始化完毕之后调用
     * @private
     */
    _afterUIInit : function () {
        this._super();
        // 重置玩家信息UI
        this._resetPlayers();
        // 重置准备按钮
        this._initPreBegin();
        // 显示房间信息
        this._initRoomInfo();

        // 设置语音按钮状态
        var gameData = game.procedure.PinShi.getGameData();
        var show = gameData.options.canVoice;
        this._ui.getVoiceBtn().setVisible(show);

        // 房间号和牌局号
        if (gameData.sceneMode == "JB") {
            this._ui.setRoomRoundID(gameData.roundId);
            this._ui.setRoomID(-1);
            this._ui.setEnter(-1);
            if (!gameData.playing) {
                this._ui.setRoomRoundID(-1);
            }
        } else if (gameData.sceneMode == "FK") {
            this._ui.setRoomRoundID(gameData.roundId);
            this._ui.setRoomID(gameData.roomId);
            this._ui.setEnter(gameData.enterBean);
        }

        // 退出游戏按钮
        this._ui.onExitGameClicked(this._BTN_Exit.bind(this));
        // 房间功能按钮绑定
        var roomCtrl = this._ui.getRoomBtnCtrl();
        roomCtrl.onQuitClicked(this._BTN_Exit.bind(this));
        roomCtrl.onSettingClicked(this._BTN_Setting.bind(this));
        roomCtrl.onRuleClicked(this._BTN_Rule.bind(this));

        // 牌型按钮
        this._ui.onGamePattenClick(this._BTN_Pattern.bind(this));
        // 抢庄按钮绑定
        var robDealer = this._ui.getRobDealer();
        robDealer.onRobClick(this._BTN_Rob.bind(this));
        // 下注按钮绑定
        var addAnte = this._ui.getAddAnte();
        addAnte.onAnteClick(this._BTN_Ante.bind(this));
        // 亮牌按钮绑定
        this._ui.onShowCardsClick(this._BTN_ShowCards.bind(this));

    },

    /**
     * 处理重连游戏UI
     */
    resetUpdateRoomInfo: function () {

        this._super();
        game.UISystem.hideLoading();
        game.Procedure.resumeNetMessageDispatch();

        this._clearPlayersUI();

        this._resetPlayers();

        this._resetPreBegin();

        var gameData = game.procedure.PinShi.getGameData();
        var players = gameData.players;
        var me = gameData.getMainPlayer();

        // ==== 跟所有玩家相关的UI表现 手牌显示 结果牌显示 抢庄倍数 ========================================
        for (var key in players) {
            if (players.hasOwnProperty(key)) {
                if (players[key].playing) {
                    // 更新手牌UI显示
                    var uiPlayer = this._ui.getPlayer(key);
                    var uiHandCards = uiPlayer.getHandCards();
                    if (gameData.roundStatus >= 1){
                        // 手牌
                        if (gameData.playerIndex == key) {
                            if (me.handCards.length == 4) {
                                me.handCards.push(100);
                            }
                            uiHandCards.setCardsValue(me.handCards);
                        }else {
                            uiHandCards.setCardsValue([100, 100, 100, 100, 100]);
                        }
                    }
                    // 显示抢庄倍数
                    if (gameData.roundStatus == PinShiHelper.roomStatus.robDealer) {
                        if (players[key].rob != -1) {
                            this._ui.getPlayer(key).showRobTip(players[key].rob);
                        }
                    }
                    var uiResultCards = uiPlayer.getResultCards();
                    if (gameData.roundStatus >= PinShiHelper.roomStatus.showCards){

                        // 闲家显示跟注情况
                        if (gameData.dealer != key) {
                            uiPlayer.setAnte(players[key].ante);
                        }
                        // 结果牌处理
                        if (players[key].isShowCard) {
                            uiHandCards.show(false);
                            if (key == gameData.dealer && gameData.playerIndex != gameData.dealer) {
                                uiResultCards.setCardsValue([100, 100, 100, 100, 100]);
                                uiResultCards.setCardPattern(PinShiHelper.cardPattern.Done);
                            }else {
                                uiResultCards.setCardsValue(players[key].handCards);
                                uiResultCards.setCardPatternWithAction(players[key].pattern);
                            }
                            uiResultCards.show(true);
                        }else {
                            // 本玩家显示算牌器
                            if (gameData.playerIndex == key) {
                                uiHandCards.setCardsValue(me.handCards);
                                uiHandCards.showCalculator(true);
                            }
                        }
                    }
                }
            }
        }
        // 显示庄家的抢庄倍数
        if (gameData.roundStatus >= PinShiHelper.roomStatus.addAnte) {
            this._ui.getPlayer(gameData.dealer).showRobTip(players[gameData.dealer].rob);
            this._ui.setDealer(gameData.dealer);
        }

        // 如果是观战玩家重连不处理以下UI表现
        if (!me.playing) {
            return;
        }

        // 重连有倒计时
        this.__NET_onActionTimer(gameData.actionTimer);

        // ==== 跟本玩家相关的UI表现 桌面消息提示 游戏操作按钮等 ============================================
        var tableTip = this._ui.getTableTip();
        tableTip.reset();
        var robDealer = this._ui.getRobDealer();
        robDealer.reset();
        var addAnte = this._ui.getAddAnte();
        addAnte.reset();
        this._ui.showBtnShowCards(false);
        if (gameData.roundStatus == PinShiHelper.roomStatus.initCards) {

        } else if (gameData.roundStatus == PinShiHelper.roomStatus.robDealer) {

            // 显示抢庄按钮 和请抢庄的提示
            if (me.rob == -1) {
                robDealer.updateRobBtn(me.maxRob);
                robDealer.show(true);
                tableTip.showTableTip(PinShiHelper.tableTip.RobDealer);
            } else {
                tableTip.showTableTip(PinShiHelper.tableTip.WaitOtherRob);
            }

        } else if (gameData.roundStatus == PinShiHelper.roomStatus.addAnte) {
            // 闲家显示下注按钮
            if (me.ante == 0 && gameData.playerIndex != gameData.dealer) {
                addAnte.updateAnteBtn(me.maxAnte);
                addAnte.show(true);
                tableTip.showTableTip(PinShiHelper.tableTip.AddAnte);
            }
            // 庄家显示等待其他玩家下注的提示
            if (gameData.playerIndex == gameData.dealer) {
                tableTip.showTableTip(PinShiHelper.tableTip.WaitOtherAnte);
            }

        } else if (gameData.roundStatus == PinShiHelper.roomStatus.showCards) {
            if (!me.isShowCard) {
                this._ui.showBtnShowCards(true);
                tableTip.showTableTip(PinShiHelper.tableTip.ShowCards)
            }
        }

    },

    /**
     * 清除玩家UI 换桌调用
     * @private
     */
    _clearPlayersUI : function () {
        for (var index = 1; index <= 6; ++index) {
            this._ui.getPlayer(index).setInfo(-1, null);
            this._ui.getPlayer(index).reset();
        }
    },

    /**
     * 重置玩家数据
     * @private
     */
    _resetPlayers : function () {
        var gameData = game.procedure.PinShi.getGameData();
        var players = gameData.players;
        for (var index in players) {
            if (players.hasOwnProperty(index)) {
                var player = this._ui.getPlayer(index);
                player.reset();
                player.setInfo(index, players[index]);
                player.onHeadPicClicked(this.__HeadPicClicked.bind(this));
                if (index == gameData.playerIndex) {
                    player.onChargeClicked(this._BTN_HeadCharge.bind(this));
                }
            }
        }
    },
    /**
     * 初始化开始前按钮数据
     * @private
     */
    _initPreBegin : function () {
        var preBegin = this._ui.getPreBegin();
        preBegin.onReadyClicked(this._BTN_Ready.bind(this));
        preBegin.onChangeDeskClicked(this._BTN_ChangeRoom.bind(this));
    },
    /**
     * 重置开始前按钮数据
     * @private
     */
    _resetPreBegin : function () {
        var gameData = game.procedure.PinShi.getGameData();
        var me = gameData.getMainPlayer();
        var preBegin = this._ui.getPreBegin();
        if (gameData.sceneMode == "JB") {
            preBegin.reset();
            preBegin.showAllBtns(true);
            preBegin.showBtnType(1);
            if (gameData.playing) {
                preBegin.showReadyBtn(false);
                preBegin.showChangeDeskBtn(!me.playing);
            } else {
                preBegin.startReadyCountDown();
                if (me.ready) {
                    preBegin.showReadyBtn(false);
                }
            }
        }else if (gameData.sceneMode == "FK") {
            preBegin.showBtnType(2);
            preBegin.show(!gameData.playing && !me.ready);
            if (gameData.isCreator()) {
                preBegin.setBeginEnabled(gameData.checkReady());
            }
        }


        this._ui.showWait(!gameData.playing && me.ready);
    },
    /**
     * 更新房间信息
     * @private
     */
    _initRoomInfo : function () {
        var gameData = game.procedure.PinShi.getGameData();
        var roomInfo = this._ui.getRoomInfo();
        var base = gameData.baseBean;
        var subType = gameData.subType;
        var texas = gameData.options.TEXAS;

        roomInfo.setAnte(base);            // 设置底分
        roomInfo.setRob(subType);          // 抢庄模式
        roomInfo.setMod(texas);            // 牌型模式

        this._ui.setRoomRoundID(-1);
    },
    /**
     * 玩家开始说话回调 (必须重写)
     * @param uid   玩家的id号 string
     */
    onPlayerSpeakBegin : function (uid) {
        var gameData = game.procedure.PinShi.getGameData();
        var index = gameData.getIndexByUid(uid);
        cc.log("说话玩家的index " + index);
        if (index != -1) {
            this._ui.getPlayer(index).showTell(true);
        }
    },
    /**
     * 玩家停止说话回调 (必须重写)
     * @param uid 玩家的id号 string
     */
    onPlayerSpeakEnd : function (uid) {
        var gameData = game.procedure.PinShi.getGameData();
        var index = gameData.getIndexByUid(uid);
        cc.log("停止说话玩家的index " + index);
        if (index != -1) {
            this._ui.getPlayer(index).showTell(false);
        }
    },
    // ========== 网络消息 ===============================================
    /**
     * 绑定网络消息
     */
    bindNetMessageHandler: function () {
        this._super();
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_START_NEW_ROUND, this.__NET_onStartNewRound.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_INIT_CARDS, this.__NET_onInitCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_TO_PLAYER_CARDS, this.__NET_onPlayerCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_START_ROB, this.__NET_onStartRob.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_PLAYER_ROB, this.__NET_onPlayerRob.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_DEALER_CHANGE, this.__NET_onDealer.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_START_ANTE, this.__NET_onStartAnte.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_PLAYER_ANTE, this.__NET_onPlayerAnte.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_NEW_CARD, this.__NET_onNewCard.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_START_SHOW_CARDS, this.__NET_onStartShowCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_PLAYER_SHOW_CARDS, this.__NET_onPlayerShowCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_DEALER_SHOW_CARDS, this.__NET_onDealerShowCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.NN_SETTLEMENT, this.__NET_onSettlement.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ROOM_RESOURCE_UPDATE, this.__NET_onUpdateRoomResource.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ACTION_TIMER, this.__NET_onActionTimer.bind(this));

    },

    // ==== 网络消息 =================================================================
    /**
     * 拼三张 玩家定时器消息
     * @param msg
     * @private
     */
    __NET_onActionTimer : function (msg) {
        cc.log("==> 拼十 定时器消息:" + JSON.stringify(msg));
        var action = msg.action;        // 0 没有操作
        var stamp = msg.stamp;          // 开始时间
        var duration = msg.duration;    // 持续时间
        // var users = msg.users;

        var gameData = game.procedure.PinShi.getGameData();
        // 没有操作
        if (action == 0) {
            cc.log("没有对应的操作");
            return;
        } else if (action == 1) {
            gameData.getMainPlayer().actionTimer = msg;
            return;
        }

        cc.log("服务器本地时间差 ==> " + ServerDate.getOffsetTime(stamp));
        var serverTime = ServerDate.getOffsetTime(stamp + duration);
        var clock = this._ui.getClock();
        clock.start(Math.floor(serverTime * 0.001));
        clock.show(gameData.getMainPlayer().playing);

        if (action == 502) {
            cc.log("下注倒计时消息，庄家隐藏倒计时显示！");
            if (gameData.dealer == gameData.playerIndex) {
                clock.reset();
                clock.show(false);
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
        var gameData = game.procedure.PinShi.getGameData();
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
     * 结算消息
     * @param msg
     * @private
     */
    __NET_onSettlement: function (msg) {
        cc.log("==> 结算消息：" + JSON.stringify(msg));
        var players = msg.players;

        var gameData = game.procedure.PinShi.getGameData();
        var dealer = gameData.dealer;
        // 隐藏请亮牌
        var tableTip = this._ui.getTableTip();
        tableTip.reset();

        var winnerList = [];
        var loserList = [];
        for (var index in players) {
            if (players.hasOwnProperty(index)) {
                var roundBean = players[index].roundBean;
                // 统计除去庄家后的输赢玩家
                if (index == dealer) {
                    continue;
                }
                if (roundBean > 0) {
                    winnerList.push(index);
                }else {
                    loserList.push(index);
                }
            }
        }
        cc.log("赢的玩家 ======= " + JSON.stringify(winnerList));
        cc.log("输的玩家 ======= " + JSON.stringify(loserList));

        // ==== 飞金贝动画 ================================================
        var callback = function () {
            cc.log("飞金豆播放完成！");
            // 显示分数
            // for (var index in players) {
            //     if (players.hasOwnProperty(index)) {
            //         var roundBean = players[index].roundBean;
            //         this._ui.getPlayer(index).setScoreWithAction(roundBean);
            //     }
            // }
            // 初始化数据
            game.procedure.PinShi.getGameData().updateEndRound();
            // 非观战玩家结算面板
            if (players.hasOwnProperty(gameData.playerIndex)) {
                var myScore = players[gameData.playerIndex].roundBean;
                GameWindowPinShi.SettlementWindow.popup(players, function () {
                    this._resetPreBegin();
                    this._resetPlayers();
                }.bind(this));
                // 胜利音效
                game.Audio.nnPlaySettlement(myScore > 0);
            } else {
                this._resetPreBegin();
                this._resetPlayers();
            }
        }.bind(this);

        var dealerPos = this._ui.getPlayer(dealer).getGiftWorldPos();

        // 第二段动画 庄家飞向赢得闲家
        var funSecondAction = function () {
            if (winnerList.length != 0) {
                cc.log("第二段动画");
                for (var j = 0; j < winnerList.length; ++j) {
                    var endPos = this._ui.getPlayer(+winnerList[j]).getGiftWorldPos();
                    if (j == winnerList.length - 1) {
                        PinShiAnimation.playFlyShell(this._ui, dealerPos, endPos, callback);
                    }else {
                        PinShiAnimation.playFlyShell(this._ui, dealerPos, endPos, null);
                    }
                }
            } else {
                cc.log("只有庄家赢, 第二段不播放!" );
                callback();
            }

        }.bind(this);

        // 第一段动画 输的闲家 飞向庄家
        if (loserList.length != 0) {
            cc.log("第一段动画");
            for (var i = 0; i < loserList.length; ++i) {
                var beginPos = this._ui.getPlayer(+loserList[i]).getGiftWorldPos();
                if (i == loserList.length - 1) {
                    PinShiAnimation.playFlyShell(this._ui, beginPos, dealerPos, funSecondAction);
                }else {
                    PinShiAnimation.playFlyShell(this._ui, beginPos, dealerPos, null);
                }
            }
        } else {
            // 只有庄家输
            cc.log("只有庄家输，第一段不播放!");
            funSecondAction();
        }

        // 亮牌倒计时结束隐藏按钮
        this._ui.showBtnShowCards(false);
    },
    /**
     * 庄家亮牌
     * @param msg
     * @private
     */
    __NET_onDealerShowCards: function (msg) {
        cc.log("==> 庄家亮牌消息：" + JSON.stringify(msg));
        var index = msg.index;
        var cards = msg.cards;
        var pattern = msg.type;
        var show = msg.played;

        var player = this._ui.getPlayer(index);
        var handCards = player.getHandCards();
        handCards.show(false);

        var resultCards = player.getResultCards();
        var gameData = game.procedure.PinShi.getGameData();
        var sex = gameData.players[index].sex;
        // 庄家自己展示手牌结果 其他玩家看到牌背显示已完成
        if (gameData.playerIndex == index) {
            resultCards.setCardsValue(cards);
            if (show) {
                resultCards.setCardPattern(pattern);
                // 播放音效
                game.Audio.nnPlayPattern(pattern, sex);
            }else {
                resultCards.setCardPatternWithAction(pattern);
            }
        }else {
            if (show) {
                cc.log("庄家的牌  快给我看看！！！！");
                resultCards.reset();
                resultCards.setCardsValue(cards);
                resultCards.setCardPatternWithAction(pattern);
                // 播放音效
                game.Audio.nnPlayPattern(pattern, sex);
            } else {
                resultCards.setCardsValue([100, 100, 100, 100, 100]);
                resultCards.setCardPattern(PinShiHelper.cardPattern.Done);
            }
        }
        resultCards.show(true);

        // 隐藏倒计时
        if (index == gameData.playerIndex) {

            var tableTip = this._ui.getTableTip();
            tableTip.showTableTip(PinShiHelper.tableTip.WaitOtherShow);

            var clock = this._ui.getClock();
            clock.reset();
            clock.show(false);
        }
    },
    /**
     * 玩家亮牌
     * @param msg
     * @private
     */
    __NET_onPlayerShowCards: function (msg) {
        cc.log("==> 玩家亮牌消息：" + JSON.stringify(msg));
        var index = msg.index;
        var cards = msg.cards;
        var pattern = msg.type;

        var player = this._ui.getPlayer(index);
        var handCards = player.getHandCards();
        handCards.show(false);

        var resultCards = player.getResultCards();
        resultCards.setCardsValue(cards);
        resultCards.setCardPatternWithAction(pattern);
        resultCards.show(true);

        var gameData = game.procedure.PinShi.getGameData();

        // 播放牌型音效
        var sex = gameData.players[index].sex;
        game.Audio.nnPlayPattern(pattern, sex);

        // 自己亮牌则隐藏请亮牌提示
        if (gameData.playerIndex == index) {
            var tableTip = this._ui.getTableTip();
            tableTip.showTableTip(PinShiHelper.tableTip.WaitOtherShow);
        }

        // 隐藏倒计时
        if (index == gameData.playerIndex) {
            var clock = this._ui.getClock();
            clock.reset();
            clock.show(false);
        }
    },
    /**
     * 开始亮牌消息
     * @param msg
     * @private
     */
    __NET_onStartShowCards: function (msg) {
        cc.log("==> 开始亮牌消息：" + JSON.stringify(msg));
        var gameData = game.procedure.PinShi.getGameData();
        var me = gameData.getMainPlayer();
        if (!me.playing) {
            return;
        }
        // 显示请亮牌提示
        var tableTip = this._ui.getTableTip();
        tableTip.showTableTip(PinShiHelper.tableTip.ShowCards);

        // 显示算牌器
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        var uiHandCards = uiPlayer.getHandCards();
        uiHandCards.showCalculator(true);

        // 显示亮牌按钮
        this._ui.showBtnShowCards(true);

        // 下注倒计时结束隐藏下注按钮
        var addAnte = this._ui.getAddAnte();
        addAnte.reset();

    },
    /**
     * 拿到最后一张牌
     * @param msg
     * @private
     */
    __NET_onNewCard: function (msg) {
        cc.log("==> 拿到最后一张牌消息：" + JSON.stringify(msg));
        var newCard = msg.card;
        // 更新游戏数据
        var gameData = game.procedure.PinShi.getGameData();
        var me = gameData.getMainPlayer();
        me.handCards.push(newCard);

        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        var lastCard = uiPlayer.getHandCards().getLastCard();
        lastCard.setValueWithTurnPage([newCard]);

        // cc.log("============== 添加新牌后 手牌数据 " + JSON.stringify(me.handCards));
    },
    /**
     * 玩家下注消息
     * @param msg
     * @private
     */
    __NET_onPlayerAnte: function (msg) {
        cc.log("==> 玩家下注消息：" + JSON.stringify(msg));
        var index = msg.index;
        var ante = msg.bet;

        var gameData = game.procedure.PinShi.getGameData();
        gameData.players[index].ante = ante;

        game.Audio.nnPlayAddAnte();
        var player = this._ui.getPlayer(index);
        player.setAnte(ante);

        // 隐藏倒计时 加注按钮
        if (index == gameData.playerIndex) {
            var clock = this._ui.getClock();
            clock.reset();
            clock.show(false);

            this._ui.getAddAnte().reset();
        }
    },
    /**
     * 开始下注消息
     * @param msg
     * @private
     */
    __NET_onStartAnte: function (msg) {
        cc.log("==> 开始下注消息：" + JSON.stringify(msg));

        // 同步本玩家的最大下注倍数
        var gameData = game.procedure.PinShi.getGameData();
        var me = gameData.getMainPlayer();

        // 观战玩家不处理
        if (!me.playing) {
            return;
        }

        me.maxAnte = msg.maxBet[gameData.playerIndex];

        var tableTip = this._ui.getTableTip();
        // 闲家更新并显示下注按钮 庄家更新提示
        if (gameData.playerIndex == gameData.dealer) {
            tableTip.showTableTip(PinShiHelper.tableTip.WaitOtherAnte);
        }else {
            var addAnte = this._ui.getAddAnte();
            addAnte.updateAnteBtn(me.maxAnte);
            addAnte.show(true);

            tableTip.showTableTip(PinShiHelper.tableTip.AddAnte);
            // 播放开始下注音效
            game.Audio.nnPlayOther(2);
        }

        // 抢庄倒计时结束隐藏按钮
        var robDealer = this._ui.getRobDealer();
        robDealer.reset();


    },
    /**
     * 确定庄家消息
     * @param msg
     * @private
     */
    __NET_onDealer: function (msg) {
        cc.log("==> 确定庄家消息：" + JSON.stringify(msg));
        var gameData = game.procedure.PinShi.getGameData();
        gameData.dealer = msg.dealerIndex;
        var players = gameData.players;

        var sortPlayers = [];
        for (var index in players) {
            if (players.hasOwnProperty(index)) {
                players[index].index = index;
                if (players[index].playing) {
                    sortPlayers.push(players[index]);
                }
            }
        }

        sortPlayers.sort(function (a, b) {
            return a.rob <= b.rob ? 1 : -1;
        });


        var playerIndexArr = [];
        for (var i = 0; i < sortPlayers.length; ++i) {
            playerIndexArr.push(sortPlayers[i].index);
        }

        cc.log("根据抢庄倍数排序后 " + playerIndexArr);

        // 定庄回调
        var callback = function (dealerIndex) {
            cc.log("抢庄播放完毕！");
            var animation = new cc.Animation();
            var path = "res/Games/PinShi/Image/Player_DealerEffect_";
            for (var i = 1 ; i <= 6; ++i) {
                var sp = path + i + ".png";
                animation.addSpriteFrameWithFile(sp);
            }
            animation.setDelayPerUnit(0.1);
            animation.setRestoreOriginalFrame(true);

            var action = cc.animate(animation).repeat(3);

            var call = cc.CallFunc(function () {
                this._ui.hideRobTip();
                this._ui.setDealer(dealerIndex);
                this._ui.getPlayer(dealerIndex).showRobTip(players[dealerIndex].rob);
            }, this);

            var player = this._ui.getPlayer(dealerIndex);
            player.getEffect().runAction(cc.Sequence(cc.show(), action, cc.hide(), call));

            game.Procedure.resumeNetMessageDispatch();
        }.bind(this);


        var robEffect = this._ui.getRobEffect();
        game.Procedure.pauseNetMessageDispatch();
        robEffect.playRobDealerEffect(playerIndexArr, gameData.dealer, callback);
    },
    /**
     * 玩家抢庄消息
     * @param msg
     * @private
     */
    __NET_onPlayerRob: function (msg) {
        cc.log("==> 玩家抢庄消息：" + JSON.stringify(msg));
        var index = msg.index;
        var rob = msg.rob;
        // 同步玩家抢庄倍数
        var gameData = game.procedure.PinShi.getGameData();
        gameData.players[index].rob = rob;

        // 玩家显示抢庄倍数
        var player = this._ui.getPlayer(index);
        player.showRobTip(rob);

        // 自己抢庄则隐藏请抢庄提示
        if (gameData.playerIndex == index) {
            var tableTip = this._ui.getTableTip();
            tableTip.showTableTip(PinShiHelper.tableTip.WaitOtherRob);
        }

        // 隐藏倒计时 隐藏抢庄按钮
        if (index == gameData.playerIndex) {
            var clock = this._ui.getClock();
            clock.reset();
            clock.show(false);

            this._ui.getRobDealer().reset();
        }
    },
    /**
     * 开始抢庄消息
     * @param msg
     * @private
     */
    __NET_onStartRob: function (msg) {
        cc.log("==> 开始抢庄消息：" + JSON.stringify(msg));
        // 同步本玩家的最大抢庄倍数
        var gameData = game.procedure.PinShi.getGameData();
        var me = gameData.getMainPlayer();
        // 观战玩家不处理
        if (!me.playing) {
            return;
        }
        me.maxRob = msg.maxRob[gameData.playerIndex];
        // 显示请抢庄文字提示
        var tableTip = this._ui.getTableTip();
        tableTip.showTableTip(PinShiHelper.tableTip.RobDealer);
        // 更新并显示抢庄按钮
        var robDealer = this._ui.getRobDealer();
        robDealer.updateRobBtn(me.maxRob);
        robDealer.show(true);
        // 播放请抢庄音效
        game.Audio.nnPlayOther(1);
    },
    /**
     * 开始发牌消息
     * @param msg
     * @private
     */
    __NET_onPlayerCards: function (msg) {
        cc.log("==> 拿到手牌消息：" + JSON.stringify(msg));
        var gameData = game.procedure.PinShi.getGameData();
        var player = gameData.getMainPlayer();
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        player.handCards = msg.cards;
        // 设置牌的值
        var uiHandCards = uiPlayer.getHandCards();
        uiHandCards.setCardsValueWithTurnPage(player.handCards);

    },
    /**
     * 开始发牌消息
     * @param msg
     * @private
     */
    __NET_onInitCards: function (msg) {
        cc.log("==> 开始发牌消息：" + JSON.stringify(msg));
        var cardCount = msg.num + 1;
        // 更新游戏数据
        var gameData = game.procedure.PinShi.getGameData();
        var players = gameData.players;
        var playerIndexArray = [];
        for (var key in players) {
            if (players.hasOwnProperty(key)) {
                if (players[key].playing) {
                    players[key].handCards = [100, 100, 100, 100, 100];
                    playerIndexArray.push(key);
                    // 手牌节点设置可见
                    this._ui.getPlayer(key).getHandCards().show(true);
                }
            }
        }
        // 暂停消息
        game.Procedure.pauseNetMessageDispatch();
        // 发牌动画
        var ani = this._ui.getPlayCardsAnimation();
        ani.playAnimation(this._ui, playerIndexArray, cardCount, function () {
            for (var key in players) {
                if (players.hasOwnProperty(key)) {
                    if (players[key].playing) {
                        // 更新手牌UI显示
                        var uiPlayer = this._ui.getPlayer(key);
                        var uiHandCards = uiPlayer.getHandCards();
                        uiHandCards.setCardsValue(players[key].handCards);
                    }
                }
            }
            // 恢复消息
            game.Procedure.resumeNetMessageDispatch();
        }.bind(this));
    },
    /**
     * 开始新一局消息
     * @param msg
     * @private
     */
    __NET_onStartNewRound: function(msg){
        cc.log("==> 新一轮游戏开始消息：" + JSON.stringify(msg));
        var roundId = msg.roundId;
        game.Audio.nnPlayNewRound();
        // 重置玩家数据
        this._resetPlayers();

        // 隐藏已准备图标
        this._ui.hideReady();

        // 更新开局信息
        var gameData = game.procedure.PinShi.getGameData();
        gameData.updateStartNewRound();

        // 重置开始前按钮
        this._resetPreBegin();

        // 设置庄信息
        gameData.dealer = msg.dealerIndex;
        this._ui.setDealer(gameData.dealer);

        // 牌局号
        this._ui.setRoomRoundID(roundId);

        // 服务费信息
        var consume = msg.consume;
        if (consume != -1) {
            // game.ui.HintMsg.showTipText("本局服务费 -" + consume, cc.p(640, 120), 2, 0.6);
            this._ui.getConsumeTip().showCharge(consume);
        }

        game.Procedure.pauseNetMessageDispatch();
        // 播放开局动画
        GameEffectController.playGameEffect(this._ui, null, cc.p(640, 360),
            GameEffectController.gameEffectType.KaiJu, function () {
                game.Procedure.resumeNetMessageDispatch();
            });
    },
    /**
     * 重写玩家准备消息，添加玩家等待消息的处理
     * @param msg
     * @private
     */
    __NET_onPlayerReady : function (msg) {
        this._super(msg);
        var gameData = game.procedure.PinShi.getGameData();
        var me = gameData.getMainPlayer();
        if (gameData.sceneMode == "FK") {
            if (gameData.isCreator()) {
                this._ui.getPreBegin().setBeginEnabled(gameData.checkReady());
            }
            // 准备就关闭准备按钮
            if (msg.playerIndex == gameData.playerIndex) {
                this._ui.getPreBegin().show(false);
            }
        }else if (gameData.sceneMode == "JB") {
            this._ui.showWait(!gameData.playing && me.ready);
        }
    },
    /**
     * 重写玩家加入消息
     * @param msg
     * @private
     */
    __NET_onPlayerAdd: function (msg) {
        this._super(msg);
        var gameData = game.procedure.PinShi.getGameData();
        if (gameData.sceneMode == "FK") {
            if (gameData.isCreator()) {
                this._ui.getPreBegin().setBeginEnabled(gameData.checkReady());
            }
        }
    },
    /**
     * 玩家离开房间消息
     * @param msg
     * @private
     */
    __NET_onPlayerLeave: function (msg) {
        this._super(msg);
        var gameData = game.procedure.PinShi.getGameData();
        if (gameData.sceneMode == "FK") {
            if (gameData.isCreator()) {
                this._ui.getPreBegin().setBeginEnabled(gameData.checkReady());
            }
        }
    },
    // ==== 点击事件 =================================================================
    /**
     * 抢庄按钮
     * @param rob
     * @private
     */
    _BTN_Rob: function (rob) {
        cc.log("抢庄按钮被点击！" + rob);
        game.gameNet.sendMessage(protocol.ProtoID.NN_PLAYER_ROB,{
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId,
            rob: rob
        });
    },
    /**
     * 加注按钮
     * @param ante
     * @private
     */
    _BTN_Ante: function (ante) {
        cc.log("下注按钮被点击！" + ante);
        game.gameNet.sendMessage(protocol.ProtoID.NN_PLAYER_ANTE,{
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId,
            bet: ante
        });
    },
    /**
     * 亮牌按钮
     * @private
     */
    _BTN_ShowCards: function () {
        cc.log("亮牌按钮被点击！");
        game.gameNet.sendMessage(protocol.ProtoID.NN_PLAYER_SHOW_CARDS,{
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId
        });
    },
    /**
     * 规则按钮点击
     * @private
     */
    _BTN_Rule: function () {
        cc.log("规则按钮被点击！");
        game.ui.HelpWin.popup(GameTypeConfig.type.NN);
    },
    /**
     * 牌型按钮被点击
     * @private
     */
    _BTN_Pattern: function () {
        cc.log("牌型按钮被点击！");
        var gameData = game.procedure.PinShi.getGameData();
        var texas = gameData.options.TEXAS;
        var contentPath = "res/Games/ComWindow/PatternHintWindow/PS_Pattern_";
        var titlePath = "res/Games/ComWindow/PatternHintWindow/PS_Pattern_";
        if (!texas) {
            // 普通牌型
            contentPath += "Normal_Content.png";
            titlePath += "Normal_Title.png";
        }else {
            // 德州牌型
            contentPath += "DZ_Content.png";
            titlePath += "DZ_Tittle.png";
        }
        cc.log("===============1 " + contentPath);
        cc.log("===============2 " + titlePath);
        game.ui.GamePatternHint.popup(contentPath, titlePath);
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
    /**
     * 玩家头像充值按钮被点击
     * @private
     */
    _BTN_HeadCharge: function () {
        cc.log("玩家头像充值按钮被点击");
        game.ui.MallWin.popup();
    },
    /**
     * 准备点击
     * @private
     */
    _BTN_Ready: function () {
        cc.log("准备按钮被点击！");
        game.Audio.playBtnClickEffect();
        this._ui.getPreBegin().stopCountDown();
        this._resetPlayers();
        this.__sendReady();
    },
    /**
     * 换桌点击
     * @private
     */
    _BTN_ChangeRoom: function () {
        cc.log("换桌按钮被点击！");
        game.Audio.playBtnClickEffect();
        game.gameNet.sendMessage(protocol.ProtoID.GAME_REQ_CHANGE_TABLE,{
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId
        });
    }
});