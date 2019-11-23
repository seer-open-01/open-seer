/**
 * Author       : lyndon
 * Date         : 2019-05-15
 * Description  : 跑得快逻辑
 */

var LogicRun = GameLogicBasic.extend({

    enter : function (window) {
        cc.log("=> 进入跑得快游戏...");
        this._super(window);

        game.Audio.runPlayBGM();
    },

    leave: function () {
        cc.log("==> 离开跑得快游戏..");
        this._super();
    },

    _afterUIInit: function () {
        // 房间信息
        this._initRoomInfo();

        // 开始前按钮信息
        this._initPreBegin();

        //设置语言按钮
        this._initVoiceBtn();

        // 退出游戏按钮
        this._ui.onExitGameClicked(this._BTN_Exit.bind(this));
        this._ui.onTuoClicked(this._BTN_Trust.bind(this));

        // 房间功能按钮绑定
        var roomMenu = this._ui.getRoomMenu();
        roomMenu.onQuitClicked(this._BTN_Exit.bind(this));
        roomMenu.onSettingClicked(this._BTN_Setting.bind(this));
        roomMenu.onRuleClicked(this._BTN_Rule.bind(this));
        roomMenu.onTrustClicked(this._BTN_Trust.bind(this));

        // 出牌按钮
        var playBtn = this._ui.getPlayBtn();
        playBtn.onHintClicked(this._BTN_Hint.bind(this));
        playBtn.onPlayClicked(this._BTN_PlayCard.bind(this));
        playBtn.onNoPlayClicked(this._BTN_NoPlay.bind(this));
    },

    resetUpdateRoomInfo: function () {
        this._super();
        game.UISystem.hideLoading();
        game.Procedure.resumeNetMessageDispatch();

        this._clearPlayersUI();
        this._resetPlayers();
        this._resetPreBegin();

        // 重连数据
        var gameData = game.procedure.Run.getGameData();
        var players = gameData.players;
        var me = gameData.getMainPlayer();

        // 牌局号 或 房间号
        if (gameData.sceneMode == "JB") {
            this._ui.setRoomRoundID("牌局号:" + gameData.roundId);
            this._ui.setEnter(-1);
            if (!gameData.playing) {
                this._ui.setRoomRoundID(-1);
            }
            this._ui.showCurRound(false);
        } else if (gameData.sceneMode == "FK") {
            this._ui.setRoomRoundID("房间号:" + gameData.roomId);
            this._ui.showCurRound(true);
            this._ui.setCurRound("牌局号:" + gameData.roundId);
            this._ui.setEnter(gameData.enterBean);
        }

        // 针对结算界面重连
        // if (gameData.gPlaying && !gameData.playing && !me.ready) {
        //     this.__sendReady();
        // }

        if (gameData.roundStatus > 1) {
            // 倒计时
            this.__NET_onActionTimer(gameData.actionTimer);
            // 庄家标志
            this._ui.setDealer(gameData.dealer);
        }

        // ==== 跟所有玩家相关的UI表现 手牌显示 ========================================
        for (var key in players) {
            if (players.hasOwnProperty(key)) {
                if (players[key].playing) {
                    // 更新手牌UI显示
                    var uiPlayer = this._ui.getPlayer(key);
                    var handCards = uiPlayer.getHandCards();
                    var leftCards = uiPlayer.getLeftCards();
                    var outCards = uiPlayer.getOutCards();
                    outCards.setCardsValues(players[key].outCards);
                    // 当前出牌玩家隐藏出的牌
                    outCards.show(key != gameData.curPlay);
                    if (gameData.playerIndex == key) {
                        handCards.setCardsValues(players[key].handCards);
                        uiPlayer.showTrustWin(me.isTrusting);
                        this._ui.showBtnTuo(!me.isTrusting);
                    } else {
                        leftCards.setCardsNum(players[key].handCardsNum);
                        leftCards.show(true);
                    }
                    // 炸弹个数
                    uiPlayer.setDouble(players[key].zdCount);
                    // 玩家提示
                    uiPlayer.showTip(players[key].playStatus);
                }
            }
        }

        // ==== 跟本玩家相关的UI表现 桌面消息提示 游戏操作按钮等 ============================================
        var playBtn = this._ui.getPlayBtn();
        playBtn.reset();
        var tableTip = this._ui.getTableTip();
        tableTip.reset();
        if (gameData.playerIndex == gameData.curPlay) {
           if (gameData.roundStatus > 1) {
                // 显示出牌按钮
                var type = 1;
                if (!me.isCan) {
                    type = 2;
                    // 显示要不起上家的提示
                    tableTip.showTableTip(2);
                }
                playBtn.showBtn(type);
                playBtn.show(true);
            }
            // 轮到该玩家隐藏操作提示
            this._ui.getPlayer(gameData.playerIndex).showTip(-1);
        }
    },


    bindNetMessageHandler: function () {
        this._super();
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ACTION_TIMER, this.__NET_onActionTimer.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_NEW_ROUND, this.__NET_onStartNewRound.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_INIT_CARDS, this.__NET_onInitHandCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_NEXT_INDEX, this.__NET_onNextIndex.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_HINT, this.__NET_onPlayerHint.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_PLAY_CARD, this.__NET_onPlayerPlay.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_NO_PLAY, this.__NET_onPlayerNoPlay.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_SELECT, this.__NET_onPlayerSelect.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_TRUST, this.__NET_onPlayerTrust.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_ZD_COUNT, this.__NET_onZDUpdate.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_ZD_SCORE, this.__NET_onZDScore.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_DEALER, this.__NET_onDealer.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.RUN_SETTLEMENT, this.__NET_onSettlement.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ROOM_RESOURCE_UPDATE, this.__NET_onUpdateRoomResource.bind(this));

    },
    //=== 按钮点击 ==============================================================
    // 不出按钮
    _BTN_NoPlay: function () {
        cc.log("不出按钮！");
        game.gameNet.sendMessage(protocol.ProtoID.RUN_NO_PLAY, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId
        });
        var gameData = game.procedure.Run.getGameData();
        var handCards = this._ui.getPlayer(gameData.playerIndex).getHandCards();
        handCards.setUnselectedCardsValues(handCards.getSelectedCardsValues());
    },

    // 出牌请求
    _BTN_PlayCard: function () {
        cc.log("出牌按钮！");
        var gameData = game.procedure.Run.getGameData();
        var handCards = this._ui.getPlayer(gameData.playerIndex).getHandCards();
        var cards = handCards.getSelectedCardsValues();
        if (cards.length <= 0) {
            cc.log("未选择牌！");
            // 提示请您选择要出的牌
            this._ui.getTableTip().showTableTip(3);
            return;
        }
        game.gameNet.sendMessage(protocol.ProtoID.RUN_PLAY_CARD, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId,
            cards: cards
        });
    },

    // 出牌提示
    _BTN_Hint: function () {
        cc.log("提示按钮！");
        game.gameNet.sendMessage(protocol.ProtoID.RUN_HINT, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId
        });
    },

    // 规则按钮
    _BTN_Rule: function () {
        cc.log("==> 跑得快规则被点击！");
        game.Audio.playBtnClickEffect();
        game.ui.HelpWin.popup(GameTypeConfig.type.RUN);
    },

    // 托管请求
    _BTN_Trust: function () {
        cc.log("==> 跑得快托管被点击！");
        game.Audio.playBtnClickEffect();
        // TODO:
        game.gameNet.sendMessage(protocol.ProtoID.RUN_TRUST, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId,
            isT: true
        })
    },

    // 退出请求
    _BTN_Exit: function () {
        cc.log("==> 跑得快退出房间被点击！");
        game.Audio.playBtnClickEffect();
        game.ui.TipWindow.popup({
            tipStr: "确认退出房间吗？",
            showNo: true
        }, function (win) {
            game.UISystem.closePopupWindow(win);
            game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_QUIT_ROOM, {
                uid: game.DataKernel.uid,
                roomId: game.DataKernel.roomId
            });
        }.bind(this));
    },

    // 充值按钮
    _BTN_HeadCharge: function () {
        cc.log("玩家头像充值按钮被点击");
        game.ui.MallWin.popup();
    },

    /**
     * 邀请按钮
     * @private
     */
    _BTN_Invite: function () {
        cc.log("邀请按钮被点击！");
        if (WeChat.isWechatInstalled && WeChat.isWechatInstalled()) {
            var shareTitle = "《赛亚麻将》:跑得快自建房";
            var shareMsg = "操作简单，玩法刺激！还在等什么，快来一战到底！";
            // shareMsg += "邀请码：" + game.DataKernel.uid;
            shareMsg +=　"\n房间号：" + game.DataKernel.roomId;
            WeChat.share(false, game.config.WECHAT_SHARE_URL + game.DataKernel.uid, shareTitle, shareMsg, function (ok) {});
            // game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_SHARE, {uid: game.DataKernel.uid, isCircle: false});
        } else {
            cc.log("==> 微信没有安装");
        }
    },

    /**
     * 准备点击
     * @private
     */
    _BTN_Ready: function () {
        cc.log("准备按钮被点击！");
        game.Audio.playBtnClickEffect();
        //this._resetPlayers();
        this.__sendReady();
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

    //=== 逻辑处理 ==============================================================
    // 初始化房间信息
    _initRoomInfo: function () {
        var gameData = game.procedure.Run.getGameData();
        var roomInfo = this._ui.getRoomInfo();
        var base = gameData.baseBean;
        var subType = gameData.subType;
        var max = gameData.options['setMut'];
        roomInfo.setAnte(base);            // 设置底分
        roomInfo.setMod(subType);          // 游戏模式模式
        roomInfo.setMax(max);
        this._ui.setRoomRoundID(-1);
    },

    // 初始化匹配界面
    _initPreBegin: function () {
        var gameData = game.procedure.Run.getGameData();
        if (gameData.sceneMode == "JB") {
            var mw = this._ui.getMatchWindow();
            mw.onCloseClicked(this._BTN_Exit);
            mw.onReadyHandler(this.__sendReady);
            mw.show(true);
        } else if (gameData.sceneMode == "FK") {
            var preBegin = this._ui.getPreBegin();
            preBegin.onInviteClicked(this._BTN_Invite.bind(this));
            preBegin.onReadyClicked(this._BTN_Ready.bind(this));
        }
    },

    // 重置匹配界面
    _resetPreBegin: function () {
        var gameData = game.procedure.Run.getGameData();
        if (gameData.sceneMode == "JB") {
            var mw = this._ui.getMatchWindow();
            mw.show(!gameData.playing);
        } else if (gameData.sceneMode == "FK") {
            var me = gameData.getMainPlayer();
            var preBegin = this._ui.getPreBegin();
            preBegin.show(!gameData.playing && !me.ready);
            if (gameData.isCreator()) {
                preBegin.setBeginEnabled(gameData.checkReady());
            }
        }
    },

    //设置语言按钮
    _initVoiceBtn: function () {
        var gameData = game.procedure.Run.getGameData();
        if (gameData.sceneMode == "JB") {
            var show = gameData.options.canVoice;
            this._ui.getVoiceBtn().setVisible(show);
        } else if (gameData.sceneMode == "FK") {
            this._ui.getVoiceBtn().setVisible(true);
        }
    },

    // 隐藏玩家UI
    _clearPlayersUI: function () {
        var gameData = game.procedure.Run.getGameData();
        var num = gameData.getPlayerNum();
        for (var index = 1; index <= num; ++index) {
            this._ui.getPlayer(index).show(false);
        }
    },

    // 重置玩家UI
    _resetPlayers: function () {
        var gameData = game.procedure.Run.getGameData();
        var players = gameData.players;
        for (var index in players) {
            if (players.hasOwnProperty(index)) {
                var player = this._ui.getPlayer(index);
                player.setInfo(index, players[index]);
                player.onHeadPicClicked(this.__HeadPicClicked.bind(this));
                if (index == gameData.playerIndex) {
                    player.onChargeClicked(this._BTN_HeadCharge.bind(this));
                }
            }
        }
    },

    // 下一局
    _nextRound: function () {
        cc.log("==> 下一局按钮被点击");
        game.Audio.playBtnClickEffect();
        WindowRun.Settlement.close();
        var gameData = game.procedure.Run.getGameData();
        if (gameData.sceneMode == "JB") {
            game.gameNet.sendMessage(protocol.ProtoID.GAME_REQ_CHANGE_TABLE, {
                roomId: game.DataKernel.getRoomId(),
                uid: game.DataKernel.uid
            });
        } else if (gameData.sceneMode == "FK") {
            // this.__sendReady();
            this._resetPreBegin();
        }
    },

    // 显示其他玩家的手牌张数
    showOtherCardsNum: function () {
        var gameData = game.procedure.Run.getGameData();
        for (var index = 1; index <= gameData.getPlayerNum(); ++index) {
            if (index == gameData.playerIndex) {
                continue;
            }
            var leftCards = this._ui.getPlayer(index).getLeftCards();
            var num = gameData.subType == 1 ? 16 : 13;
            leftCards.setCardsNum(num);
            leftCards.show(true);
        }
    },

    // 播放出牌特效
    playPatternEffect: function (pattern, beginPos) {
        var effectType = 0;
        switch (pattern) {
            case RunHelper.CardsPattern.AIRPLANE :
            case RunHelper.CardsPattern.AIRPLANE_TWO :
                effectType = GameEffectController.gameEffectType.DDZFeiJi;
                break;
            case RunHelper.CardsPattern.PAIRS :
                effectType = GameEffectController.gameEffectType.DDZLianDui;
                break;
            case RunHelper.CardsPattern.STRAIGHT :
                effectType = GameEffectController.gameEffectType.DDZShunZi;
                break;
            case RunHelper.CardsPattern.KING_BOMB :
                effectType = GameEffectController.gameEffectType.DDZWangZha;
                break;
            case RunHelper.CardsPattern.BOMB :
                effectType = GameEffectController.gameEffectType.RUNZhaDan;
                break;
            default:
                effectType = 0;
                break;
        }

        if (effectType == 0) {
            game.Procedure.resumeNetMessageDispatch();
            return;
        }

        GameEffectController.playGameEffect(this._ui, beginPos, cc.p(640, 460), effectType, function () {
            cc.log("特效调用完毕");
            game.Procedure.resumeNetMessageDispatch();
        });
    },
    //=== 消息处理 ==============================================================
    // 开始新一局
    __NET_onStartNewRound: function (msg) {
        cc.log("==> 跑得快开始新一局消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Run.getGameData();

        // 服务费信息
        var consume = msg.consume;
        if (consume != -1) {
            this._ui.getConsumeTip().showCharge(consume);
        }

        // 显示玩家
        var indexArray = gameData.getAllPlayerIndex();
        for (var i = 0; i < indexArray.length; ++i) {
            var uiPlayer = this._ui.getPlayer(indexArray[i]);
            uiPlayer.show(true);
            uiPlayer.showReady(false);
        }

        gameData.updateStartNewRound();
        this._resetPreBegin();
        this._ui.showBtnTuo(true);

        game.Audio.runPlayBGM();
    },

    // 发牌消息
    __NET_onInitHandCards: function (msg) {
        cc.log("==> 跑得快初始化手牌消息：" + JSON.stringify(msg));
        var cards = msg.cards;
        // 同步本地数据
        var gameData = game.procedure.Run.getGameData();
        gameData.getMainPlayer().handCards = cards;

        // 设置手牌
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        var handCards = uiPlayer.getHandCards();
        // handCards.setCardsValues(cards);
        // handCards.show(true);

        // 设置其他玩家手牌
        this.showOtherCardsNum();
        // TODO:发牌动画
        game.Procedure.pauseNetMessageDispatch();
        handCards.setCardsValuesWithEffect(cards, function () {
            game.Procedure.resumeNetMessageDispatch();
            this.showOtherCardsNum();
        }.bind(this));
    },

    // 出牌位置变更
    __NET_onNextIndex: function (msg) {
        cc.log("==> 跑得快出牌位置改变消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var isCan = msg.isCan; // 要得起

        var gameData = game.procedure.Run.getGameData();
        gameData.curPlay = index;
        var uiPlayer = this._ui.getPlayer(index);
        // 隐藏不出提示
        uiPlayer.showTip(-1);
        // 清除已经出的牌
        uiPlayer.getOutCards().reset();
        // 处理出牌按钮
        var playBtn = this._ui.getPlayBtn();
        var tableTip = this._ui.getTableTip();
        if (index == gameData.playerIndex) {
            var type = 1;
            if (!isCan) {
                type = 2;
                // 提示没有大过上家
                tableTip.showTableTip(2);
            }
            playBtn.showBtn(type);
            playBtn.show(!gameData.getMainPlayer().isTrusting);
        } else {
            playBtn.showBtn(-1);
        }
    },

    // 提示牌型消息
    __NET_onPlayerHint: function (msg) {
        cc.log("==> 跑得快请求提示牌型消息：" + JSON.stringify(msg));
        var cards = msg.cards;
        var gameData = game.procedure.Run.getGameData();
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);

        // 清除选择的牌 重新选择牌
        var handCards = uiPlayer.getHandCards();
        handCards.setUnselectedCardsValues(handCards.getSelectedCardsValues());
        handCards.setSelectedCardsValues(cards);

    },

    // 出牌消息
    __NET_onPlayerPlay: function (msg) {
        cc.log("==> 跑得快玩家出牌消息：" + JSON.stringify(msg));
        if (msg.result != 0) {
            cc.log("出牌不成功！");
            this._ui.getTableTip().showTableTip(1);
            var errorIndex  = msg.playerIndex;
            var errorPlayer = this._ui.getPlayer(errorIndex);
            var hc = errorPlayer.getHandCards();
            hc.allUnselected();
            return;
        }
        var index = msg.playerIndex;
        var type = msg.type;    // 主体牌类型: {"DAN": 1,"DUI":2,"SAN_YI":3,"SHUN":4,"SI_ER":5,"ZD":6}
        var sub = msg.subType;  // 带牌类型:   {"NONE":0,"DAN":1,"DUI":2}	0没有带 1带的是单牌 2带的是对牌
        var num = msg.num;      // 主体牌连续张数
        var power = msg.power;  // 主体牌的威力  	A:14, 2:15, 小王:16: 大王17,其他:对应数字 王炸威力算:17
        var cards = msg.cards;
        var follow = msg.isFollow;  // 是不是管上家的牌

        var pattern = RunHelper.formatPattern(type, sub, num, power);
        var gameData = game.procedure.Run.getGameData();
        var uiPlayer = this._ui.getPlayer(index);

        if (index == gameData.playerIndex) {
            // 隐藏出牌按钮
            this._ui.getPlayBtn().show(false);
            // 隐藏倒计时
            this._ui.getClock().show(false);
            // 移除手牌
            var handCards = uiPlayer.getHandCards();
            handCards.removeCardsValues(cards);
            // 剩余牌张数
            var cardsNum = handCards.getCardsValues().length;
        } else {
            // 更新其他玩家手牌
            var leftCards = uiPlayer.getLeftCards();
            leftCards.minusCardsNum(cards.length);
            // 剩余牌张数
            cardsNum = leftCards.getCardsNum();
        }

        // 添加已出的牌
        var outCards = uiPlayer.getOutCards();
        outCards.setCardsValues(cards, index == gameData.dealer);
        outCards.show(true);

        // 播放出牌特效
        game.Procedure.pauseNetMessageDispatch();
        this.playPatternEffect(pattern, uiPlayer.getGiftWorldPos());

        // 播放音效
        if (pattern > 2 && pattern < 13 && follow) {
            game.Audio.runPlayFollowEffect(gameData.players[index].sex);
        } else {
            game.Audio.runPlayCardEffect(gameData.players[index].sex, pattern, cards);
        }

        // 判断是否播放报单音效(报双)
        if (cardsNum == 1) {
            game.Audio.runPlayOtherEffect(1);
            this._ui.getPlayer(index).showBaoDan(true);
        }
    },

    // 不出消息
    __NET_onPlayerNoPlay: function (msg) {
        cc.log("==> 跑得快玩家不出消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;

        var gameData = game.procedure.Run.getGameData();
        // 隐藏出牌按钮
        if (index == gameData.playerIndex) {
            this._ui.getPlayBtn().reset();
            this._ui.getClock().show(false);
        }
        // 显示不出
        this._ui.getPlayer(index).showTip(5);

        // 播放不出
        game.Audio.runPlayCardEffect(gameData.players[index].sex, RunHelper.CardsPattern.NONE);

    },

    // 选牌消息
    __NET_onPlayerSelect: function (msg) {
        cc.log("==> 跑得快玩家筛选顺子消息：" + JSON.stringify(msg));
        var cards = msg.cards;
        var gameData = game.procedure.Run.getGameData();
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);

        // 清除选择的牌 重新选择牌
        var handCards = uiPlayer.getHandCards();
        handCards.setUnselectedCardsValues(handCards.getSelectedCardsValues());
        handCards.setSelectedCardsValues(cards);

    },

    // 托管消息
    __NET_onPlayerTrust: function (msg) {
        cc.log("==> 跑得快玩家托管消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var isTrusting = msg.isT;

        var gameData = game.procedure.Run.getGameData();
        var player = gameData.players[index];
        player.isTrusting = isTrusting;

        if (index == gameData.playerIndex) {
            this._ui.getPlayer(gameData.playerIndex).showTrustWin(isTrusting);
            this._ui.showBtnTuo(!isTrusting);
            if (gameData.curPlay == index) {
                this._ui.getPlayBtn().show(!isTrusting);
            }
        }
    },

    // 倒计时消息
    __NET_onActionTimer: function (msg) {
        cc.log("==> 定时器消息:" + JSON.stringify(msg));
        var action = msg.action;        // 0 没有操作
        var stamp = msg.stamp;          // 开始时间
        var duration = msg.duration;    // 持续时间
        var users = msg.users;

        var gameData = game.procedure.Run.getGameData();
        if (action == 0) {
            cc.log("没有对应的操作");
            return;
        }
        if (action == 1) {
            cc.log("准备倒计时 单独处理!");
            gameData.getMainPlayer().actionTimer = msg;
            return;
        }
        //时间是0的话，不开始计时
        if (duration == 0) {
            return;
        }
        var serverTime = ServerDate.getOffsetTime(stamp + duration);
        var clock = this._ui.getClock();
        clock.show(true);

        if (action == 201 && gameData.playerIndex == users[0]) {
            clock.start(Math.floor(serverTime * 0.001), cc.p(640, 370));
            return;
        }
        if (action == 203) {
            clock.start(Math.floor(serverTime * 0.001), cc.p(640, 400));
            return;
        }
        clock.start(Math.floor(serverTime * 0.001), this._ui.getPlayer(users[0]).getClockWorldPos());
    },

    // 炸弹更新
    __NET_onZDUpdate: function (msg) {
        cc.log("==> 炸弹更新消息:" + JSON.stringify(msg));
        var zdCount = msg.zdCount;
        var playerIndex = msg.playerIndex;
        this._ui.getPlayer(playerIndex).setDouble(zdCount);
    },

    // 炸弹分数
    __NET_onZDScore: function (msg) {
        cc.log("==> 炸弹分数消息:" + JSON.stringify(msg));
        var scoreInfo = msg.survivalInfo;
        for (var key in scoreInfo) {
            if (scoreInfo.hasOwnProperty(key)) {

            }
        }
    },

    // 庄确定
    __NET_onDealer: function (msg) {
        cc.log("==> 庄确定消息:" + JSON.stringify(msg));
        var dealer = msg.dealer;
        this._ui.setDealer(dealer);
    },

    // 结算消息
    __NET_onSettlement: function (msg) {
        cc.log("==> 跑得快结算消息：" + JSON.stringify(msg));
        // 关闭定时器
        var clock = this._ui.getClock();
        clock.reset();
        clock.show(false);

        // 隐藏出牌按钮
        this._ui.getPlayBtn().reset();

        // 重置玩家信息
        var gameData = game.procedure.Run.getGameData();
        var players = gameData.players;
        for (var index in players) {
            if (players.hasOwnProperty(index)) {
                var player = this._ui.getPlayer(index);
                player.reset();
            }
        }
        WindowRun.Settlement.popup(msg, this._nextRound.bind(this));

        // 更新数据
        gameData.updateEndRound();

    },

    // 资源更新
    __NET_onUpdateRoomResource: function (msg) {
        cc.log("==> 游戏房间的资源改变消息" + JSON.stringify(msg));
        var playerObj = msg.players;
        var reason = msg.reason;
        var gameData = game.procedure.Run.getGameData();
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
     * 玩家离开房间消息
     * @param msg
     * @private
     */
    __NET_onPlayerLeave: function (msg) {
        this._super(msg);
        var gameData = game.procedure.Run.getGameData();
        if (gameData.sceneMode == "FK") {
            if (gameData.isCreator()) {
                this._ui.getPreBegin().setBeginEnabled(gameData.checkReady());
            }
        }
    },
    /**
     * 重写玩家加入消息
     * @param msg
     * @private
     */
    __NET_onPlayerAdd: function (msg) {
        this._super(msg);
        var gameData = game.procedure.Run.getGameData();
        if (gameData.sceneMode == "FK") {
            if (gameData.isCreator()) {
                this._ui.getPreBegin().setBeginEnabled(gameData.checkReady());
            }
        }
    },
    /**
     * 玩家准备消息
     * @param msg
     * @private
     */
    __NET_onPlayerReady: function (msg) {
        this._super(msg);
        var gameData = game.procedure.Run.getGameData();
        if (gameData.sceneMode == "FK") {
            if (gameData.isCreator()) {
                this._ui.getPreBegin().setBeginEnabled(gameData.checkReady());
            }

            // 准备就关闭准备按钮
            if (msg.playerIndex == gameData.playerIndex) {
                this._ui.getPreBegin().show(false);
            }
        }

    },
});