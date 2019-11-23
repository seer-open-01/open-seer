/**
 * Created by lyndon on 2018/04/25.
 */

// 拼三张 逻辑
var GameLogicPinSan = GameLogicBasic.extend({

    enter : function (window) {
        cc.log("进入拼三张游戏流程");

        // 播放背景音乐
        game.Audio.PSZPlayBGM();

        this._super(window);
    },

    leave : function () {
        this._super();
        var preBegin = this._ui.getPreBegin();
        preBegin.reset();
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
        // 退出游戏按钮
        this._ui.onExitGameClicked(this._BTN_Exit.bind(this));
        // 房间功能按钮绑定
        var roomCtrl = this._ui.getRoomBtnCtrl();
        roomCtrl.onQuitClicked(this._BTN_Exit.bind(this));
        roomCtrl.onSettingClicked(this._BTN_Setting.bind(this));
        roomCtrl.onBankClicked(this._BTN_Bank.bind(this));
        roomCtrl.onRuleClicked(this._BTN_Rule.bind(this));
        // 游戏操作按钮
        var playBtn = this._ui.getPlayBtn();
        playBtn.onCompareClicked(this._BTN_Compare.bind(this));
        playBtn.onAddAnteClicked(this._BTN_AddAnte.bind(this));
        playBtn.show(false);
        // 牌型按钮
        this._ui.onGamePattenClick(this._BTN_Pattern.bind(this));
        // 初始化隐藏牌局号
        this._ui.setRoomRoundID(-1);
        // 设置语音按钮状态
        var gameData = game.procedure.PinSan.getGameData();
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

    },

    /**
     * 根据当前的 gameData 重置房间信息函数(用于重写)
     */
    resetUpdateRoomInfo : function () {
        this._super();
        // cc.log("拼三张断线重连!");
        var gameData = game.procedure.PinSan.getGameData();
        var me = gameData.getMainPlayer();
        this._clearPlayersUI();
        this._resetPlayers();
        this._resetPreBegin();
        var uiChipsPanel = this._ui.getChipsPanel();
        uiChipsPanel.reset();
        var playBtn = this._ui.getPlayBtn();
        playBtn.show(false);

        // 房间规则
        this._updateRoomInfo();
        this._ui.getRoomInfo().setMod();

        var countDownClock = GameWindowBasic.PlayerClock.getController();
        countDownClock.setGameMode(GameTypeConfig.type.PSZ);
        countDownClock.reset();
        countDownClock.addToNode(null);
        if (gameData.playing) {
            // 处理筹码面板信息
            uiChipsPanel.setAnte(gameData.ante);
            for (var i = 0; i < gameData.chips.length; ++i) {
                uiChipsPanel.addChip(gameData.chips[i]);
            }

            // 设置庄索引
            this._ui.setDealer(gameData.dealer);
            // 重连必闷三轮提示
            var isMen = gameData.options.BMSL
                && gameData.curTurns > 0
                && gameData.curTurns < 4
                && me.cardState < 2
                && me.playing;
            if (isMen) {
                this._ui.updateMenTurn(gameData.curTurns);
            }else {
                this._ui.showBiMen(false);
            }

            // 处理玩家信息
            var players = gameData.players;
            for (var index in players) {
                if (players.hasOwnProperty(index)) {
                    var player = players[index];
                    // 牌的数据重新归并值
                    if (player.cardState == GameDataPinSanHelp.CardsStatus.NotToSee) {
                        player.handCards = [100, 100, 100];
                    } else if (player.cardState == GameDataPinSanHelp.CardsStatus.HaveToSee) {
                        if (player.index != gameData.playerIndex) {
                            player.handCards = [100, 100, 100];
                        }
                    } else if (player.cardState == GameDataPinSanHelp.CardsStatus.Fold) {
                        player.handCards = [99, 99, 99];
                    } else if (player.cardState == GameDataPinSanHelp.CardsStatus.CompareLost) {
                        player.handCards = [99, 99, 99];
                    } else {
                        player.handCards = [];
                    }

                    // 更新玩家UI
                    var uiPlayer = this._ui.getPlayer(index);
                    // 没有玩则显示观战中
                    if (!player.playing) {
                        uiPlayer.showSpectating(true);
                        continue;
                    }

                    var uiHandCards = uiPlayer.getHandCards();
                    uiHandCards.reset();
                    uiHandCards.setCardsValues(player.handCards);
                    var uiCardsStatus = uiPlayer.getCardsStatus();
                    var cardStatus = player.cardState;
                    if (index == gameData.playerIndex) {
                        if (cardStatus <= GameDataPinSanHelp.CardsStatus.HaveToSee) {
                            cardStatus = GameDataPinSanHelp.CardsStatus.None;
                        }
                    } else {
                        if (player.cardState == GameDataPinSanHelp.CardsStatus.HaveToSee) {
                            uiHandCards.changeToSector();
                        }
                    }
                    uiCardsStatus.showStatus(cardStatus);

                    // 设置出的金贝数量
                    uiPlayer.setAnte(player.ante);
                }
            }

            // 倒计时
            if (gameData.curPlayer != -1) {
                countDownClock.addToNode(this._ui.getPlayer(gameData.curPlayer).getClockNode());
                this.__NET_onActionTimer(gameData.actionTimer);
                if (gameData.curPlayer == gameData.playerIndex) {
                    countDownClock.setUnderFiveCallback(function () {
                        this._ui.startWaring();
                    }.bind(this));
                } else {
                    countDownClock.setUnderFiveCallback(null);
                    this._ui.stopWaring();
                }
            }

            // 更新操作
            playBtn.show(me.playing
                && (me.cardState == GameDataPinSanHelp.CardsStatus.NotToSee || me.cardState == GameDataPinSanHelp.CardsStatus.HaveToSee));
            playBtn.updateStatus(true);
        }

        this._ui.showWait(!gameData.playing && me.ready);

    },

    /**
     * 绑定消息函数 子类重写必须调用父类的该函数
     */
    bindNetMessageHandler : function () {
        this._super();
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_START_NEW_ROUND, this.__NET_onStartNewRound.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_INIT_CARD, this.__NET_onInitHandCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_CURRENT_PLAY, this.__NET_onCurPlay.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_REQ_SEE_CARDS, this.__NET_onSeeCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_REQ_DIS_CARDS, this.__NET_onDisCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_REQ_ADD_ANTE, this.__NET_onPlayerAddAnte.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_BEAN_CHANGE, this.__NET_onPlayerBeanChange.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_REQ_FOLLOW_ANTE, this.__NET_onPlayerFollowAnte.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_REQ_AUTO_FOLLOW, this.__NET_onAutoFollow.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_REQ_COMPARE_CARD, this.__NET_onCompare.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_SETTLEMENT, this.__NET_onSettlement.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_SEE_CARDS, this.__NET_onPlayerSeeCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_ALL_ADD_BASE, this.__NET_onAllAddBase.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.PSZ_ALL_COMPARE_CARD, this.__NET_onAllCompareCard.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ROOM_RESOURCE_UPDATE, this.__NET_onUpdateRoomResource.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_REQ_CHANGE_TABLE, this.__NET_onChangeTable.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ACTION_TIMER, this.__NET_onActionTimer.bind(this));
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
        var gameData = game.procedure.PinSan.getGameData();
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
     * 重置开始前按钮数据
     * @private
     */
    _resetPreBegin : function () {
        var gameData = game.procedure.PinSan.getGameData();
        var me = gameData.getMainPlayer();
        var preBegin = this._ui.getPreBegin();
        if (gameData.sceneMode == "JB") {
            preBegin.reset();
            preBegin.showAllBtns(true);
            preBegin.showBtnType(1);
            if (gameData.playing) {
                preBegin.showReadyBtn(false);
                preBegin.showChangeDeskBtn(!me.playing
                    || me.cardState == GameDataPinSanHelp.CardsStatus.Fold
                    || me.cardState == GameDataPinSanHelp.CardsStatus.CompareLost);
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
     * 初始化开始前按钮数据
     * @private
     */
    _initPreBegin : function () {
        var preBegin = this._ui.getPreBegin();
        preBegin.onReadyClicked(this._BTN_Ready.bind(this));
        preBegin.onChangeDeskClicked(this._BTN_ChangeRoom.bind(this));
    },
    /**
     * 更新房间信息
     * @private
     */
    _updateRoomInfo : function () {
        var gameData = game.procedure.PinSan.getGameData();
        var roomInfo = this._ui.getRoomInfo();
        var base = gameData.baseBean;

        roomInfo.setMax(10 * base);       // 设置单注封顶
        roomInfo.setAnte(base);            // 设置底分
        roomInfo.setTurn(gameData.curTurns, gameData.turns);
    },
    /**
     * 结算后处理
     * @private
     */
    _doAfterSettlement : function () {
        game.procedure.PinSan.getGameData().updateEndRound();
        this._resetPreBegin();
        this._resetPlayers();
        this._updateRoomInfo();
    },

    /**
     * 金币不够加注 跟注 比牌的时候弹出商城
     * @private
     */
    _popMall: function () {
        var str = "Seer不足，请充值！\n";
        str += "您可以前往商城充值或前往银行取Seer!";
        game.ui.NoBeanTip.popup(str);
    },
    /**
     * 玩家开始说话回调 (必须重写)
     * @param uid   玩家的id号 string
     */
    onPlayerSpeakBegin : function (uid) {
        var gameData = game.procedure.PinSan.getGameData();
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
        var gameData = game.procedure.PinSan.getGameData();
        var index = gameData.getIndexByUid(uid);
        cc.log("停止说话玩家的index " + index);
        if (index != -1) {
            this._ui.getPlayer(index).showTell(false);
        }
    },
    // ==== 点击事件 =================================================================
    /**
     * 比牌点击
     * @private
     */
    _BTN_Compare: function () {
        cc.log("比牌按钮被点击！");
        game.Audio.playBtnClickEffect();
        this._ui.getComparePanel().show(true);
    },
    /**
     * 加注点击
     * @private
     */
    _BTN_AddAnte: function () {
        cc.log("加注按钮被点击！");
        game.Audio.playBtnClickEffect();
        var fillPanel = this._ui.getFillPanel();
        fillPanel.show(true);
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
        this._updateRoomInfo();
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
        })
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
        game.ui.HelpWin.popup(GameTypeConfig.type.PSZ);
    },
    /**
     * 牌型按钮被点击
     * @private
     */
    _BTN_Pattern: function () {
        cc.log("牌型按钮被点击！");
        var contentPath = "res/Games/ComWindow/PatternHintWindow/PSZ_Pattern_Content.png";
        var titlePath = "res/Games/ComWindow/PatternHintWindow/PSZ_Pattern_Title.png";
        game.ui.GamePatternHint.popup(contentPath, titlePath);
    },
    // ==== 消息处理 =================================================================
    /**
     * 拼三张 玩家定时器消息
     * @param msg
     * @private
     */
    __NET_onActionTimer : function (msg) {
        cc.log("==> 拼三张 定时器消息:" + JSON.stringify(msg));
        var action = msg.action;        // 0 没有操作
        var stamp = msg.stamp;          // 开始时间
        var duration = msg.duration;    // 持续时间
        // var users = msg.users;

        // 没有操作
        if (action == 0) {
            cc.log("没有对应的操作");
            return;
        } else if (action == 1) {
            var gameData = game.procedure.PinSan.getGameData();
            gameData.getMainPlayer().actionTimer = msg;
            return;
        }

        var serverTime = ServerDate.getOffsetTime(stamp + duration);
        var clock = GameWindowBasic.PlayerClock.getController();
        clock.start(Math.floor(serverTime * 0.001));
        clock.show(true);
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
        var gameData = game.procedure.PinSan.getGameData();
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
     * 全桌比牌消息
     * @param msg
     * @private
     */
    __NET_onAllCompareCard: function (msg) {
        cc.log("==> 拼三张 全比消息：" + JSON.stringify(msg));
        game.Audio.PSZPlayAllVS();
        // 隐藏操作
        this._ui.getPlayBtn().show(false);

        // 隐藏倒计时
        var countDownClock = GameWindowBasic.PlayerClock.getController();
        countDownClock.reset();
        countDownClock.addToNode(null);

        game.Procedure.pauseNetMessageDispatch(true);
        GameEffectController.playGameEffect(this._ui, null, cc.p(640, 360),
            GameEffectController.gameEffectType.PSZQuanBi, function () {
                game.Procedure.resumeNetMessageDispatch(false);
            });
    },
    /**
     * 所有玩家加底注的消息
     * @param msg
     * @private
     */
    __NET_onAllAddBase: function (msg) {
        cc.log("==> 拼三张 出底分的消息:" + JSON.stringify(msg));
        var indexArray = msg.indexArray;
        var gameData = game.procedure.PinSan.getGameData();
        var chipsPanel = this._ui.getChipsPanel();
        for (var i = 0; i < indexArray.length; ++i) {
            // 更新游戏数据
            gameData.chips.push(1);
            gameData.players[indexArray[i]].chips.push(1);
            // 更新UI显示
            var uiPlayer = this._ui.getPlayer(indexArray[i]);
            chipsPanel.addChipWithAction(1, uiPlayer.getGiftWorldPos(), null);
        }
    },
    /**
     * 广播的玩家看牌消息
     * @param msg
     * @private
     */
    __NET_onPlayerSeeCards : function (msg) {
        cc.log("===> 拼三张 广播的玩家看牌消息:" + JSON.stringify(msg));
        var index = msg.playerIndex;

        var gameData = game.procedure.PinSan.getGameData();
        var player = gameData.players[index];
        player.cardState = GameDataPinSanHelp.CardsStatus.HaveToSee;
        // 更新当前牌的状态
        var uiPlayer = this._ui.getPlayer(index);
        var uiCardsStatus = uiPlayer.getCardsStatus();
        var cardStatus = player.cardState;
        if (index == gameData.playerIndex) {
            if (cardStatus <= GameDataPinSanHelp.CardsStatus.HaveToSee) {
                cardStatus = GameDataPinSanHelp.CardsStatus.None;
            }
        } else {
            var uiHandCards = uiPlayer.getHandCards();
            uiHandCards.changeToSector();
        }
        uiCardsStatus.showStatus(cardStatus);


        // 播放看牌音效
        game.Audio.PSZPlayOperation(GameDataPinSanHelp.CardsStatus.HaveToSee, player.sex);
    },
    /**
     * 结算消息
     * @param msg
     * @private
     */
    __NET_onSettlement : function (msg) {
        cc.log("收到结算面板信息：" + JSON.stringify(msg));
        var gameData = game.procedure.PinSan.getGameData();

        // 隐藏控牌按钮
        var uiPlayBtn = this._ui.getPlayBtn();
        uiPlayBtn.show(false);

        // 隐藏必闷三轮
        this._ui.updateMenTurn(1);
        this._ui.showBiMen(false);

        // 关闭比牌面板
        this._ui.getComparePanel().show(false);
        // 关闭加注面板
        this._ui.getFillPanel().show(false);

        // 隐藏倒计时
        var countDownClock = GameWindowBasic.PlayerClock.getController();
        countDownClock.reset();
        countDownClock.addToNode(null);

        // 筹码管理控件
        var uiChipsPanel = this._ui.getChipsPanel();
        uiChipsPanel.setAnte(0);
        uiChipsPanel.recycleChips(this._ui.getPlayer(msg.winnerIndex).getGiftWorldPos(), function () {
            // 播放结算音乐
            game.Audio.PSZPlaySettlementBGM(msg.winnerIndex == gameData.playerIndex);

            var players = msg.players;
            var lookOtherCards = [];
            // 中途加入的玩家是不存在的
            if (players[gameData.playerIndex]) {
                lookOtherCards = players[gameData.playerIndex].lookOtherCards;
            }

            for (var key in players) {
                if (players.hasOwnProperty(key)) {
                    players[key].playerIndex = key;
                    players[key].isWinner = (+key == msg.winnerIndex);
                    if (lookOtherCards.indexOf(+key) == -1) {
                        players[key].handCards = [100, 100, 100];
                        players[key].cardsPattern = -1;
                    }
                }
            }

            // 弹出结算界面
            GameWindowPinSan.RoundSettlement.popup(msg, function () {
                game.Audio.PSZPlayBGM();
            }, function () {
                game.UISystem.captureScreen("screenShot.jpg", function () {
                    WeChat.shareImage(false, jsb.fileUtils.getWritablePath() + "screenShot.jpg", function (ok) {});
                });
            });

            // 结算后处理
            this._doAfterSettlement();
        }.bind(this));
    },

    /**
     * 玩家比牌消息
     * @param msg
     * @private
     */
    __NET_onCompare : function (msg) {
        cc.log("==> 拼三张 玩家比牌消息" + JSON.stringify(msg));
        if (msg.result != 0) {
            this._popMall();
            return;
        }
        var winnerIndex = msg.winnerIndex;      // 赢家索引
        var loserIndex = msg.loserIndex;        // 输家索引
        var sourceIndex = msg.sourceIndex;           // 发起者索引
        var targetIndex = msg.targetIndex;           // 被比牌玩家索引

        // 更新游戏数据
        var gameData = game.procedure.PinSan.getGameData();
        var loserPlayer = gameData.players[loserIndex];
        loserPlayer.cardPattern = GameDataPinSanHelp.CardsPattern.None;
        loserPlayer.cardState = GameDataPinSanHelp.CardsStatus.CompareLost;
        loserPlayer.handCards = [99, 99, 99];

        // // 暂停消息处理
        game.Procedure.pauseNetMessageDispatch();
        // 比牌动画
        GameWindowPinSan.CompareAnimation.playAnimation(this._ui,
            cc.p(640, 360),
            winnerIndex,
            loserIndex,
            sourceIndex,
            targetIndex,
            function () {
                // 更新界面显示
                var uiPlayer = this._ui.getPlayer(loserIndex);
                var uiHandCards = uiPlayer.getHandCards();
                uiHandCards.setCardsValuesWithTurnPage(loserPlayer.handCards);

                // 更新当前牌的状态
                var uiCardsStatus = uiPlayer.getCardsStatus();
                var cardStatus = loserPlayer.cardState;
                if (loserIndex == gameData.playerIndex) {
                    if (cardStatus <= GameDataPinSanHelp.CardsStatus.HaveToSee) {
                        cardStatus = GameDataPinSanHelp.CardsStatus.None;
                    }
                }
                uiCardsStatus.showStatus(cardStatus);
                // 设置牌型
                var uiCardsPattern = uiPlayer.getCardsPattern();
                uiCardsPattern && uiCardsPattern.showPattern(loserPlayer.cardPattern);

                if (loserIndex == gameData.playerIndex) {
                    // 隐藏操作
                    this._ui.getPlayBtn().show(false);
                    // 输家播放比牌输音效
                    game.Audio.PSZPlayOperation(GameDataPinSanHelp.CardsStatus.CompareLost, loserPlayer.sex);
                }
                game.Audio.PSZPlayBGM();
                // 恢复消息处理
                game.Procedure.resumeNetMessageDispatch();
                // 发送比牌状态结束的消息
                game.gameNet.sendMessage(protocol.ProtoID.PSZ_REQ_END_COMPARE,{
                    uid: game.DataKernel.uid,
                    roomId: game.DataKernel.roomId
                });
                // 更新开始按钮
                this._resetPreBegin();
            }.bind(this));


        // 没有输的玩家更新操作按钮状态
        if (loserIndex != gameData.playerIndex) {
            var playBtn = this._ui.getPlayBtn();
            playBtn.updateStatus(true);
        }
        // 输的玩家隐藏跟注加注标签
        var uiPlayer = this._ui.getPlayer(loserIndex);
        uiPlayer.showAddAnte(false);
        uiPlayer.showFollowAnte(false);

        // 关闭警告动画
        var countDownClock = GameWindowBasic.PlayerClock.getController();
        countDownClock.setUnderFiveCallback(null);
        this._ui.stopWaring();

        // 关闭比牌面板
        this._ui.getComparePanel().show(false);
        // 关闭加注面板
        this._ui.getFillPanel().show(false);
    },
    /**
     * 玩家自动跟注
     * @param msg
     * @private
     */
    __NET_onAutoFollow: function (msg) {
        cc.log("玩家 自动跟注消息" + JSON.stringify(msg));
        var gameData = game.procedure.PinSan.getGameData();
        var me = gameData.getMainPlayer();
        me.autoCall = msg.ok;
        this._ui.getPlayBtn().updateStatus();
        // 隐藏上一步操作
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        uiPlayer.hideFollowWithAction();
        uiPlayer.hideAddWithAction();
    },
    /**
     * 玩家跟注
     * @param msg
     * @private
     */
    __NET_onPlayerFollowAnte: function (msg) {
        cc.log("==> 拼三张 玩家跟注消息：" + JSON.stringify(msg));
        if (msg.result != 0) {
            this._popMall();
            return;
        }
        var index = msg.playerIndex;
        var multiple = msg.roundBet;    // 玩家出的筹码倍数

        // 更新游戏数据
        var gameData = game.procedure.PinSan.getGameData();
        var player = gameData.players[index];
        player.chips.push(multiple);

        // 播放跟注音效
        game.Audio.PSZPlayOperation(5, player.sex);

        var uiPlayer = this._ui.getPlayer(index);
        uiPlayer.showFollowAnte(true);
        uiPlayer.showAddAnte(false);

        // 出筹码
        var uiChipsPanel = this._ui.getChipsPanel();
        uiChipsPanel.addChipWithAction(multiple, uiPlayer.getGiftWorldPos());
    },
    /**
     * 玩家资源改变
     * @param msg
     * @private
     */
    __NET_onPlayerBeanChange: function (msg) {
        cc.log("==> 拼三张 下注金贝变化消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;        // 玩家索引
        var bean = msg.bean;                // 金贝数
        var ante = msg.ante;                // 已出的金贝值
        var roomBean = msg.roomBean;        // 房间当前出的金贝数
        var roomBet = msg.roomBet;          // 当前房间的注码
        // 更新游戏中的数据
        var gameData = game.procedure.PinSan.getGameData();
        gameData.ante = roomBean;
        gameData.multiple = roomBet;
        var player = gameData.players[index];
        player.bean = bean;
        player.ante = ante;

        // 更新玩家UI
        var uiPlayer = this._ui.getPlayer(index);
        uiPlayer.setBean(bean);
        uiPlayer.setAnte(ante);

        // 更新筹码界面
        var uiChipsPanel = this._ui.getChipsPanel();
        uiChipsPanel.setAnte(roomBean);

        // 更新操作界面
        var uiPlayBtn = this._ui.getPlayBtn();
        uiPlayBtn.updateStatus(true);
    },
    /**
     * 玩家加注消息
     * @param msg
     * @private
     */
    __NET_onPlayerAddAnte: function (msg) {
        cc.log("==> 拼三张 玩家加注消息:" + JSON.stringify(msg));
        if (msg.result != 0) {
            this._popMall();
            return;
        }
        var index = msg.playerIndex;
        var multiple = msg.roundBet;    // 玩家出的筹码倍数

        // 更新游戏数据
        var gameData = game.procedure.PinSan.getGameData();
        var player = gameData.players[index];
        player.chips.push(multiple);

        // 播放加注音效
        game.Audio.PSZPlayOperation(6, player.sex);

        var uiPlayer = this._ui.getPlayer(index);
        uiPlayer.showAddAnte(true);
        uiPlayer.showFollowAnte(false);
        // 出筹码
        var uiChipsPanel = this._ui.getChipsPanel();
        uiChipsPanel.addChipWithAction(multiple, uiPlayer.getGiftWorldPos());
    },
    /**
     * 玩家看牌消息(自己的消息)
     * @param msg
     * @private
     */
    __NET_onSeeCards: function (msg) {
        cc.log("==> 拼三张 玩家看牌消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var cards = msg.cards;
        var pattern = msg.pattern;
        var gameData = game.procedure.PinSan.getGameData();
        var player = gameData.players[index];
        player.handCards = cards;
        player.cardPattern = pattern;
        player.cardState = GameDataPinSanHelp.CardsStatus.HaveToSee;

        var uiPlayer = this._ui.getPlayer(index);

        // 设置牌的值
        var uiHandCards = uiPlayer.getHandCards();
        uiHandCards.setCardsValuesWithTurnPage(player.handCards);

        // 设置牌型
        var uiCardsPattern = uiPlayer.getCardsPattern();
        uiCardsPattern && uiCardsPattern.showPattern(player.cardPattern);

        // 播放牌型音效
        game.Audio.PSZPlayPattern(player.cardPattern, player.sex);

        // 更新操作
        var playBtn = this._ui.getPlayBtn();
        playBtn.updateStatus(true);
    },
    /**
     * 玩家弃牌消息
     * @param msg
     * @private
     */
    __NET_onDisCards: function (msg) {
        cc.log("==> 拼三张 玩家弃牌消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        // 更新游戏数据
        var gameData = game.procedure.PinSan.getGameData();
        var player = gameData.players[index];
        player.cardPattern = GameDataPinSanHelp.CardsPattern.None;
        player.cardState = GameDataPinSanHelp.CardsStatus.Fold;
        player.handCards = [99, 99, 99];

        // 更新界面显示
        var uiPlayer = this._ui.getPlayer(index);
        var uiHandCards = uiPlayer.getHandCards();
        uiHandCards.setCardsValuesWithTurnPage(player.handCards);
        // 更新当前牌的状态
        var uiCardsStatus = uiPlayer.getCardsStatus();
        var cardStatus = player.cardState;
        if (index == gameData.playerIndex) {
            if (cardStatus <= GameDataPinSanHelp.CardsStatus.HaveToSee) {
                cardStatus = GameDataPinSanHelp.CardsStatus.None;
            }

            // 停止警告动画
            var countDownClock = GameWindowBasic.PlayerClock.getController();
            countDownClock.setUnderFiveCallback(null);
            this._ui.stopWaring();
        }
        uiCardsStatus.showStatus(cardStatus);

        // 设置牌型
        var uiCardsPattern = uiPlayer.getCardsPattern();
        uiCardsPattern && uiCardsPattern.showPattern(player.cardPattern);

        // 隐藏跟注加注操作
        uiPlayer.hideFollowWithAction();
        uiPlayer.hideAddWithAction();

        // 播放弃牌音效
        game.Audio.PSZPlayOperation(GameDataPinSanHelp.CardsStatus.Fold, player.sex);

        // 更新操作
        var playBtn = this._ui.getPlayBtn();
        playBtn.updateStatus(true);

        // 更新开始按钮
        this._resetPreBegin();

        if (index == gameData.playerIndex) {

            // 关闭比牌面板
            this._ui.getComparePanel().show(false);
            // 关闭加注面板
            this._ui.getFillPanel().show(false);

            // 隐藏操作
            playBtn.show(false);
            // 隐藏必闷三轮
            this._ui.showBiMen(false);
        }
    },
    /**
     * 切换操作玩家消息
     * @param msg
     * @private
     */
    __NET_onCurPlay: function (msg) {
        cc.log("==> 拼三张 切换操作玩家消息:" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var curTurns = msg.curTurns;           // 当前轮数
        // 更新游戏数据
        var gameData = game.procedure.PinSan.getGameData();
        gameData.curPlayer = index;
        gameData.curTurns = curTurns;

        // 更新房间信息
        this._updateRoomInfo();

        // 显示必闷
        // 1.房间规则为必闷三轮 2.当前轮数小于4
        // 3.玩家未在观战状态 4.玩家未弃牌
        var isMen = gameData.options.BMSL
        && gameData.curTurns > 0 && gameData.curTurns < 4
        && gameData.getMainPlayer().playing
        && gameData.getMainPlayer().cardState < 2;

        if (isMen) {
            this._ui.showBiMen(true);
            if (gameData.playerIndex == gameData.curPlayer){
                this._ui.updateMenTurn(gameData.curTurns);
            }
        }else {
            this._ui.showBiMen(false);
        }

        // 更新UI
        var uiPlayBtn = this._ui.getPlayBtn();
        uiPlayBtn.updateStatus(true);

        // 隐藏玩家上一步操作
        var uiPlayer = this._ui.getPlayer(index);
        uiPlayer.hideFollowWithAction(false);
        uiPlayer.hideAddWithAction(false);

        // 添加倒计时到节点
        var countDownClock = GameWindowBasic.PlayerClock.getController();
        countDownClock.addToNode(this._ui.getPlayer(index).getClockNode());

        if (gameData.curPlayer == gameData.playerIndex) {
            countDownClock.setUnderFiveCallback(function () {
                this._ui.startWaring();
            }.bind(this));
            if (!gameData.getMainPlayer().autoCall) {
                game.Audio.PSZPlayTurn();
            }
        } else {
            countDownClock.setUnderFiveCallback(null);
            this._ui.stopWaring();
        }

        // 关闭比牌面板
        this._ui.getComparePanel().show(false);
        // 关闭加注面板
        this._ui.getFillPanel().show(false);
    },
    /**
     * 发牌消息
     * @param msg
     * @private
     */
    __NET_onInitHandCards : function (msg) {
        cc.log("==> 拼三张 发牌消息:" + JSON.stringify(msg));

        // 更新游戏数据
        var gameData = game.procedure.PinSan.getGameData();
        var me = gameData.getMainPlayer();
        var players = gameData.players;
        var playerIndexArray = [];
        for (var key in players) {
            if (players.hasOwnProperty(key)) {
                if (players[key].playing) {
                    players[key].handCards = [100, 100, 100];
                    players[key].cardPattern = GameDataPinSanHelp.CardsPattern.None;
                    players[key].cardState = GameDataPinSanHelp.CardsStatus.NotToSee;
                    playerIndexArray.push(key);
                }
            }
        }
        // 播放发牌音效
        game.Audio.PSZPlayOperation(GameDataPinSanHelp.CardsStatus.NotToSee, 2);
        // 暂停消息
        game.Procedure.pauseNetMessageDispatch();
        var ani = this._ui.getPlayCardsAnimation();
        ani.playAnimation(this._ui, playerIndexArray, function () {
            for (var key in players) {
                if (players.hasOwnProperty(key)) {
                    if (players[key].playing) {
                        // 更新手牌UI显示
                        var uiPlayer = this._ui.getPlayer(key);
                        var uiHandCards = uiPlayer.getHandCards();
                        uiHandCards.setCardsValues(players[key].handCards);
                        // 更新牌状态显示
                        var uiCardsStatus = uiPlayer.getCardsStatus();
                        var cardStatus = players[key].cardState;
                        if (key == gameData.playerIndex) {
                            if (cardStatus <= GameDataPinSanHelp.CardsStatus.HaveToSee) {
                                cardStatus = GameDataPinSanHelp.CardsStatus.None;
                            }
                        }
                        uiCardsStatus.showStatus(cardStatus);
                    }
                }
            }

            // 显示操作
            var playBtn = this._ui.getPlayBtn();
            playBtn.show(me.playing);
            playBtn.playShowAction();
            // 恢复消息
            game.Procedure.resumeNetMessageDispatch();
        }.bind(this));
    },
    /**
     * 开始新的一局消息
     * @param msg
     * @private
     */
    __NET_onStartNewRound : function (msg) {
        cc.log("==> 拼三张 开始新的一局消息：" + JSON.stringify(msg));
        var roundId = msg.roundId;
        // 重置玩家数据
        this._resetPlayers();

        // 隐藏已准备图标
        this._ui.hideReady();

        // 更新开局信息
        var gameData = game.procedure.PinSan.getGameData();
        gameData.updateStartNewRound();

        // 重置开始前按钮
        this._resetPreBegin();

        // 设置庄信息
        gameData.dealer = msg.dealerIndex;
        this._ui.setDealer(gameData.dealer);

        // 更新房间信息
        gameData.curTurns = msg.curTurns;
        this._updateRoomInfo();

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
        var gameData = game.procedure.PinSan.getGameData();
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
        var gameData = game.procedure.PinSan.getGameData();
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
        var gameData = game.procedure.PinSan.getGameData();
        if (gameData.sceneMode == "FK") {
            if (gameData.isCreator()) {
                this._ui.getPreBegin().setBeginEnabled(gameData.checkReady());
            }
        }
    }
});