/**
 * Created by lyndon on 2018/06/25.
 */
var GameLogicDouDiZhu = GameLogicBasic.extend({

    enter: function (window) {
        cc.log("进入斗地主游戏逻辑");
        game.Audio.ddzPlayBGM(0);

        this._super(window);
    },

    leave: function () {
        cc.log("离开斗地主游戏");
        this._super();

        // 清除掉retain的动作对象
        this._ui.getDealCards().clear();
    },

    // 重写函数
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
        // 叫地主按钮
        var callDiZhu = this._ui.getCallBtn();
        callDiZhu.onCallClick(this._BTN_Call.bind(this));
        // 加倍主按钮
        var double = this._ui.getDoubleBtn();
        double.onCallClick(this._BTN_Double.bind(this));
        // 出牌按钮
        var playBtn = this._ui.getPlayBtn();
        playBtn.onHintClicked(this._BTN_Hint.bind(this));
        playBtn.onPlayClicked(this._BTN_PlayCard.bind(this));
        playBtn.onNoPlayClicked(this._BTN_NoPlay.bind(this));
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

        //解散面板
        this._initDestroyInfo();

        // 重连数据
        var gameData = game.procedure.DouDiZhu.getGameData();
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
            // this._ui.setCurRound(gameData.curRound, gameData.round);
            this._ui.setCurRound("牌局号:" + gameData.roundId);
            this._ui.setEnter(gameData.enterBean);
        }

        // 针对结算界面重连
        // if (gameData.gPlaying && !gameData.playing && !me.ready) {
        //     this.__sendReady();
        // }

        // 地主牌
        var diZhuCards = this._ui.getDiZhuCards();
        if (gameData.roundStatus == 2) {
            diZhuCards.setCardsValues([100, 100, 100]);
            diZhuCards.show(true);
        } else if (gameData.roundStatus >= 3) {
            diZhuCards.setCardsValues(gameData.diZhuCards);
            diZhuCards.setMultiple(gameData.multiple);
            diZhuCards.show(true);
        }
        if (gameData.roundStatus > 1) {
            // 倒计时
            this.__NET_onActionTimer(gameData.actionTimer);
            // 地主标志
            this._ui.setDealer(gameData.dealer);
            // 背景音乐
            if (gameData.isBomb) {
                game.Audio.ddzPlayBGM(2);
            } else {
                game.Audio.ddzPlayBGM(1);
            }
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
                    outCards.setCardsValues(players[key].outCards, gameData.dealer == key);
                    // 当前出牌玩家隐藏出的牌
                    outCards.show(key != gameData.curPlay);
                    if (gameData.playerIndex == key) {
                        handCards.setCardsValues(players[key].handCards, gameData.dealer == key);
                        uiPlayer.showTrustWin(me.isTrusting);
                        this._ui.showBtnTuo(!me.isTrusting);
                    } else {
                        leftCards.setCardsNum(players[key].handCardsNum);
                        leftCards.show(true);
                    }
                    // 处理加倍不加倍的文字显示
                    if (gameData.roundStatus == 3) {
                        if (players[key].doubleFlag == 1) {
                            players[key].playStatus = 6;
                        } else if (players[key].doubleFlag == 0) {
                            players[key].playStatus = 7;
                        }
                    }
                    //显示玩家头像处的加倍图片
                    if (players[key].doubleFlag == 1) {
                        uiPlayer.setDouble(true);
                    }
                    // 玩家提示
                    uiPlayer.showTip(players[key].playStatus);
                }
            }
        }

        // ==== 跟本玩家相关的UI表现 桌面消息提示 游戏操作按钮等 ============================================
        var callBtn = this._ui.getCallBtn();
        callBtn.reset();
        var doubleBtn = this._ui.getDoubleBtn();
        doubleBtn.reset();
        var playBtn = this._ui.getPlayBtn();
        playBtn.reset();
        var tableTip = this._ui.getTableTip();
        tableTip.reset();
        if (gameData.playerIndex == gameData.curPlay) {
            if (gameData.roundStatus == 2) {// 抢地主阶段
                callBtn.showBtn(gameData.robType);
            } else if (gameData.roundStatus == 4) {
                // 显示出牌按钮
                var type = 1;
                if (!me.isCan) {
                    type = 2;
                    // 显示要不起上家的提示
                    tableTip.showTableTip(2);
                }
                if (me.isForce) {
                    type = 3;
                }
                playBtn.showBtn(type);
                playBtn.show(true);
            }
            // 轮到该玩家隐藏操作提示
            this._ui.getPlayer(gameData.playerIndex).showTip(-1);
        }
        // 本玩家没有操作加倍按钮
        if (gameData.roundStatus == 3) {
            if (me.doubleFlag == -1) {
                doubleBtn.show(true);
                this._ui.getPlayer(gameData.playerIndex).showTip(-1);
            }
        }
    },

    /**
     * 绑定网络消息
     */
    bindNetMessageHandler: function () {
        this._super();
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_START_NEW_ROUND, this.__NET_onStartNewRound.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_INIT_CARDS, this.__NET_onInitHandCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_START_ROB, this.__NET_onStartRob.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_NEXT_ROB, this.__NET_onNextRob.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_DEALER_CHANGE, this.__NET_onDealerChange.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_START_PLAY, this.__NET_onStartPlay.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_MULTIPLE_CHANGE, this.__NET_onMultipleChange.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_NEXT_PLAY, this.__NET_onNextPlay.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_PLAYER_ROB, this.__NET_onPlayerRob.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_PLAYER_HINT, this.__NET_onPlayerHint.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_PLAYER_PLAY, this.__NET_onPlayerPlay.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_PLAYER_NO_PLAY, this.__NET_onPlayerNoPlay.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_HINT_SHUN, this.__NET_onPlayerHintShun.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_PLAYER_TRUST, this.__NET_onPlayerTrust.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_SETTLEMENT, this.__NET_onSettlement.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_END_ROUND_DATA, this.__NET_endSettlement.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ROOM_RESOURCE_UPDATE, this.__NET_onUpdateRoomResource.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ACTION_TIMER, this.__NET_onActionTimer.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_START_DOUBLE, this.__NET_onStartDouble.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.DDZ_PLAYER_DOUBLE, this.__NET_onPlayerDouble.bind(this));
        //斗地主发起解散请求
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ON_REQ_DESTROYROOM, this.__NET_OnReqDestroyRoom.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ON_RESP_DESTROYROOM, this.__NET_OnRespDestroyRoom.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ON_DESTROYROOM, this.__NET_OnDestroyRoom.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ON_DESTROYROOM_RESULT, this.__NET_OnDestroyRoom_Result.bind(this));
    },
    // ==== 消息处理函数 ==================================================================
    /**
     * 斗地主 玩家定时器消息
     * @param msg
     * @private
     */
    __NET_onActionTimer: function (msg) {
        cc.log("==> 斗地主定时器消息:" + JSON.stringify(msg));
        var action = msg.action;        // 0 没有操作
        var stamp = msg.stamp;          // 开始时间
        var duration = msg.duration;    // 持续时间
        var users = msg.users;
        var gameData = game.procedure.DouDiZhu.getGameData();
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
    /**
     * 房间资源改变消息
     * @param msg
     * @private
     */
    __NET_onUpdateRoomResource: function (msg) {
        cc.log("==> 游戏房间的资源改变消息" + JSON.stringify(msg));
        var playerObj = msg.players;
        var reason = msg.reason;
        var gameData = game.procedure.DouDiZhu.getGameData();
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
     * 斗地主结算消息
     * @param msg
     * @private
     */
    __NET_onSettlement: function (msg) {
        cc.log("==> 斗地主结算消息：" + JSON.stringify(msg));
        var isSpring = msg.isSpring;
        // 关闭定时器
        var clock = this._ui.getClock();
        clock.reset();
        clock.show(false);

        // 隐藏出牌按钮
        this._ui.getPlayBtn().reset();

        var call = function () {
            var players = game.procedure.DouDiZhu.getGameData().players;
            for (var index in players) {
                if (players.hasOwnProperty(index)) {
                    var player = this._ui.getPlayer(index);
                    player.reset();
                }
            }
            this._ui.setDealer(-1);
            GameWindowDouDiZhu.SettlementRoundWindow.popup(msg, this._nextRound.bind(this));
            game.procedure.DouDiZhu.getGameData().updateEndRound();
        }.bind(this);

        // 更新玩家分数 判断春天
        if (isSpring) {
            GameEffectController.playGameEffect(this._ui, null, cc.p(640, 360),
                GameEffectController.gameEffectType.DDZChunTian, call);
            return;
        }

        call();

        // var gameData = game.procedure.DouDiZhu.getGameData();
        // if (msg.finalRound) {
        //     gameData.gPlaying = false;
        //     cc.log("最后一局！");
        // }
    },

    //总结算
    __NET_endSettlement: function (msg) {
        cc.log("==> 最终局结算数据: " + JSON.stringify(msg));
        GameWindowDouDiZhu.SettlementRoundWindow.close();
        GameWindowDouDiZhu.Settlement.popup(msg, this._BTN_Share.bind(this));
    },
    /**
     * 斗地主托管消息
     * @param msg
     * @private
     */
    __NET_onPlayerTrust: function (msg) {
        cc.log("==> 斗地主玩家托管消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var isTrusting = msg.isT;

        var gameData = game.procedure.DouDiZhu.getGameData();
        var player = gameData.players[index];
        player.isTrusting = isTrusting;

        if (index == gameData.playerIndex) {
            this._ui.getPlayer(gameData.playerIndex).showTrustWin(isTrusting);
            this._ui.showBtnTuo(!isTrusting);
            if (gameData.curPlay == index) {
                this._ui.getCallBtn().show(!isTrusting);
                this._ui.getPlayBtn().show(!isTrusting);
            }
        }
    },
    /**
     * 斗地主玩家筛选顺子消息
     * @param msg
     * @private
     */
    __NET_onPlayerHintShun: function (msg) {
        cc.log("==> 斗地主玩家筛选顺子消息：" + JSON.stringify(msg));
        var cards = msg.cards;
        var gameData = game.procedure.DouDiZhu.getGameData();
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);

        // 清除选择的牌 重新选择牌
        var handCards = uiPlayer.getHandCards();
        handCards.setUnselectedCardsValues(handCards.getSelectedCardsValues());
        handCards.setSelectedCardsValues(cards);

    },
    /**
     * 斗地主玩家不出消息
     * @param msg
     * @private
     */
    __NET_onPlayerNoPlay: function (msg) {
        cc.log("==> 斗地主玩家不出消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;

        var gameData = game.procedure.DouDiZhu.getGameData();
        // 隐藏出牌按钮
        if (index == gameData.playerIndex) {
            this._ui.getPlayBtn().reset();
            this._ui.getClock().show(false);
        }
        // 显示不出
        this._ui.getPlayer(index).showTip(5);
        // 播放不出
        game.Audio.ddzPlayCardEffect(gameData.players[index].sex, DouDiZhuHelper.CardsPattern.NONE);

    },
    /**
     * 斗地主玩家出牌消息
     * @param msg
     * @private
     */
    __NET_onPlayerPlay: function (msg) {
        cc.log("==> 斗地主玩家出牌消息：" + JSON.stringify(msg));
        if (msg.result != 0) {
            cc.log("出牌不成功！");
            this._ui.getTableTip().showTableTip(1);
            var errorIndex  = msg.playerIndex;
            var errorPlayer = this._ui.getPlayer(errorIndex);
            var hc = errorPlayer.getHandCards();
            hc.allUnselected();
            return;
        }

        var shape = msg.curShape;

        var index = shape.playerIndex;
        var type = shape.type;    // 主体牌类型: {"DAN": 1,"DUI":2,"SAN_YI":3,"SHUN":4,"SI_ER":5,"ZD":6}
        var sub = shape.subType;  // 带牌类型:   {"NONE":0,"DAN":1,"DUI":2}	0没有带 1带的是单牌 2带的是对牌
        var num = shape.num;      // 主体牌连续张数
        var power = shape.power;  // 主体牌的威力  	A:14, 2:15, 小王:16: 大王17,其他:对应数字 王炸威力算:17
        var cards = shape.cards;
        var follow = shape.isFollow;  // 是不是管上家的牌

        var pattern = DouDiZhuHelper.formatPattern(type, sub, num, power);
        var gameData = game.procedure.DouDiZhu.getGameData();
        var uiPlayer = this._ui.getPlayer(index);

        if (index == gameData.playerIndex) {
            // 手牌同步
            var handCards = msg.handCards;
            handCards = DouDiZhuHelper.Utils.handCardsSort(handCards);
            // 隐藏出牌按钮
            this._ui.getPlayBtn().show(false);
            // 隐藏倒计时
            this._ui.getClock().show(false);
            // 移除手牌
            var uiHandCards = uiPlayer.getHandCards();
            uiHandCards.setCardsValues(handCards);
            // uiHandCards.removeCardsValues(cards);
            // 剩余牌张数
            var cardsNum = uiHandCards.getCardsValues().length;
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
            game.Audio.ddzPlayFollowEffect(gameData.players[index].sex);
        } else {
            game.Audio.ddzPlayCardEffect(gameData.players[index].sex, pattern, cards);
        }

        // 判断是否播放炸弹后的音效
        if (pattern >= DouDiZhuHelper.CardsPattern.BOMB) {
            game.Audio.ddzPlayBGM(2);
        }
        // 判断是否播放报单音效(报双)
        if (cardsNum > 0 && cardsNum <= 2) {
            game.Audio.ddzPlayOtherEffect(1);
        }
    },
    /**
     * 斗地主请求提示牌型消息
     * @param msg
     * @private
     */
    __NET_onPlayerHint: function (msg) {
        cc.log("==> 斗地主请求提示牌型消息：" + JSON.stringify(msg));
        var cards = msg.cards;
        var gameData = game.procedure.DouDiZhu.getGameData();
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);

        // 清除选择的牌 重新选择牌
        var handCards = uiPlayer.getHandCards();
        handCards.setUnselectedCardsValues(handCards.getSelectedCardsValues());
        handCards.setSelectedCardsValues(cards);

    },
    /**
     * 斗地主玩家抢庄消息
     * @param msg
     * @private
     */
    __NET_onPlayerRob: function (msg) {
        cc.log("==> 斗地主玩家抢庄消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var ok = msg.ok;
        var type = msg.type;

        var gameData = game.procedure.DouDiZhu.getGameData();
        // 隐藏按钮
        if (index == gameData.playerIndex) {
            this._ui.getCallBtn().reset();
            this._ui.getClock().show(false);
        }
        // 显示叫地主 抢地主的文字
        var tip = -1;
        if (type == 1) {
            tip = ok ? 1 : 2;
        } else if (type == 2) {
            tip = ok ? 3 : 4;
        }
        this._ui.getPlayer(index).showTip(tip);
        game.Audio.ddzPlayDealerEffect(gameData.players[index].sex, tip);
    },
    /**
     * 斗地主出牌位置改变消息
     * @param msg
     * @private
     */
    __NET_onNextPlay: function (msg) {
        cc.log("==> 斗地主出牌位置改变消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var isForce = msg.isForce; // 强制出牌
        var isCan = msg.isCan; // 要得起

        var gameData = game.procedure.DouDiZhu.getGameData();
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
            if (isForce) {
                type = 3;
            }
            playBtn.showBtn(type);
            playBtn.show(!gameData.getMainPlayer().isTrusting);
        } else {
            playBtn.showBtn(-1);
        }
    },
    /**
     * 斗地主公共倍数改变消息
     * @param msg
     * @private
     */
    __NET_onMultipleChange: function (msg) {
        cc.log("==> 斗地主公共倍数改变消息：" + JSON.stringify(msg));
        var multiple = msg.multiple;

        var diZhuCards = this._ui.getDiZhuCards();
        diZhuCards.setMultiple(multiple);

    },
    /**
     * 斗地主开始出牌消息
     * @param msg
     * @private
     */
    __NET_onStartPlay: function (msg) {
        cc.log("==> 斗地主开始出牌消息：" + JSON.stringify(msg));
        // 清除玩家身上的操作提示
        this._ui.hidePlayerTip();
        this._ui.getDoubleBtn().reset();
    },

    //都地主开始加倍
    __NET_onStartDouble: function (msg) {
        cc.log("==> 斗地主开始加倍:" + JSON.stringify(msg));
        if (msg.result != 0) {
            return;
        }
        // 隐藏所有玩家操作提示
        this._ui.hidePlayerTip();
        // 显示加倍按钮
        var double = this._ui.getDoubleBtn();
        double.show(true);
    },

    //玩家加倍 不加倍信息
    __NET_onPlayerDouble: function (msg) {
        cc.log("==> 斗地主玩家加倍不加倍详细信息:" + JSON.stringify(msg));
        if (msg.result != 0) {
            return;
        }
        var double = msg.double;
        var index = msg.playerIndex;
        var gameData = game.procedure.DouDiZhu.getGameData();
        if (index == gameData.playerIndex) {
            this._ui.getDoubleBtn().reset();
        }
        var tip = -1;
        if (double == 0) {
            tip = 7;
        } else if (double == 1) {
            tip = 6;
            this._ui.getPlayer(index).setDouble(true)
        }
        this._ui.getPlayer(index).showTip(tip);
        game.Audio.ddzPlayDoubleEffect(gameData.players[index].sex, tip);

    },
    /**
     * 斗地主地主确定消息
     * @param msg
     * @private
     */
    __NET_onDealerChange: function (msg) {
        cc.log("==> 斗地主地主确定消息：" + JSON.stringify(msg));
        var dealer = msg.LordIndex;
        var cards = msg.cards;

        // 同步本地数据
        var gameData = game.procedure.DouDiZhu.getGameData();
        gameData.dealer = dealer;
        gameData.diZhuCards = cards;

        // 显示地主牌
        var diZhuCards = this._ui.getDiZhuCards();
        diZhuCards.setCardsValues(cards);

        // 玩家手牌处理
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        var uiHandCards = uiPlayer.getHandCards();
        var myCards = gameData.getMainPlayer().handCards;
        if (dealer == gameData.playerIndex) {
            myCards = msg.handCards;
            var sortCards = DouDiZhuHelper.Utils.handCardsSort(myCards);
            uiHandCards.setCardsValues(sortCards, true);

            uiHandCards.setSelectedCardsValues(cards);
        } else {
            // 手牌居中
            uiHandCards.setCardsValues(myCards);
            // 更新地主玩家的手牌张数
            this._ui.getPlayer(dealer).getLeftCards().setCardsNum(20);
        }

        // 播放
        game.Procedure.pauseNetMessageDispatch();
        GameEffectController.playGameEffect(this._ui, cc.p(640, 460), this._ui.getPlayer(dealer).getHatWorldPos(),
            GameEffectController.gameEffectType.DDZMaoZi, function () {
                // 显示地主标志
                this._ui.setDealer(dealer);
                uiHandCards.setUnselectedCardsValuesWithAction(cards);
                game.Procedure.resumeNetMessageDispatch();
            }.bind(this));
    },
    /**
     * 斗地主抢庄位置改变消息
     * @param msg
     * @private
     */
    __NET_onNextRob: function (msg) {
        cc.log("==> 斗地主抢庄位置改变消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var type = msg.type;

        var gameData = game.procedure.DouDiZhu.getGameData();
        gameData.curPlay = index;
        if (index == gameData.playerIndex) {
            var callDiZhu = this._ui.getCallBtn();
            callDiZhu.showBtn(type);
            callDiZhu.show(!gameData.getMainPlayer().isTrusting);
            this._ui.getPlayer(index).showTip(-1);
        }
    },
    /**
     * 斗地主开始抢庄消息
     * @param msg
     * @private
     */
    __NET_onStartRob: function (msg) {
        cc.log("==> 斗地主开始抢庄消息：" + JSON.stringify(msg));
    },
    /**
     * 斗地主初始化手牌消息
     * @param msg
     * @private
     */
    __NET_onInitHandCards: function (msg) {
        cc.log("==> 斗地主初始化手牌消息：" + JSON.stringify(msg));
        var cards = msg.cards;

        // 显示地主牌节点
        var diZhuCards = this._ui.getDiZhuCards();
        diZhuCards.setCardsValue([100, 100, 100]);
        diZhuCards.show(true);

        // 同步本地数据
        var gameData = game.procedure.DouDiZhu.getGameData();
        gameData.getMainPlayer().handCards = cards;

        // 设置手牌
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        var handCards = uiPlayer.getHandCards();
        handCards.setCardsValues(cards);
        handCards.show(false);

        // 针对都不抢的情况 隐藏玩家操作提示
        this._ui.hidePlayerTip();

        // 发牌动画
        game.Procedure.pauseNetMessageDispatch();
        var dealCard = this._ui.getDealCards();
        dealCard.reset();
        dealCard.setCallBack(function () {
            this.showOtherCardsNum();
            handCards.show(true);
            game.Procedure.resumeNetMessageDispatch();
        }.bind(this));
        dealCard.start();

    },
    /**
     * 斗地主开始新一局消息
     * @param msg
     * @private
     */
    __NET_onStartNewRound: function (msg) {
        cc.log("==> 斗地主开始新一局消息：" + JSON.stringify(msg));

        // 显示托管按钮
        this._ui.showBtnTuo(true);

        var gameData = game.procedure.DouDiZhu.getGameData();
        gameData.gPlaying = true;

        // 服务费信息
        var consume = msg.consume;
        if (consume != -1) {
            // game.ui.HintMsg.showTipText("本局服务费 -" + consume, cc.p(640, 120), 2, 0.6);
            this._ui.getConsumeTip().showCharge(consume);
        }

        // 显示玩家
        var indexArray = gameData.getAllPlayerIndex();
        for (var i = 0; i < indexArray.length; ++i) {
            var uiPlayer = this._ui.getPlayer(indexArray[i]);
            uiPlayer.show(true);
            uiPlayer.showReady(false);
        }
        // 更新数据
        gameData.updateStartNewRound();

        // 重置准备前的UI
        this._resetPreBegin();

        // 牌局号
        //this._ui.setRoomRoundID(roundId);

        // 音效
        game.Audio.ddzPlayBGM(1);
    },

    // == 逻辑函数 =========================================================================
    /**
     * 显示房间信息
     * @private
     */
    _initRoomInfo: function () {
        var gameData = game.procedure.DouDiZhu.getGameData();
        var roomInfo = this._ui.getRoomInfo();
        if (gameData.sceneMode == "JB") {
            var base = gameData.baseBean;
            var subType = gameData.subType;
            var max = gameData.options["max"];

        } else if (gameData.sceneMode == "FK") {
            max = gameData.options["max"];
            subType = gameData.subType;
            base = gameData.baseBean;
        }
        roomInfo.setAnte(base);            // 设置底分
        roomInfo.setMod(subType);          // 游戏模式模式
        roomInfo.setMax(max);              // 封顶倍数
        this._ui.setRoomRoundID(-1);
    },

    //设置语言按钮
    _initVoiceBtn: function () {

        var gameData = game.procedure.DouDiZhu.getGameData();
        if (gameData.sceneMode == "JB") {
            var show = gameData.options.canVoice;
            this._ui.getVoiceBtn().setVisible(show);
        } else if (gameData.sceneMode == "FK") {
            this._ui.getVoiceBtn().setVisible(true);
        }
    },
    /**
     * 初始化绑定准备换桌事件
     * @private
     */
    _initPreBegin: function () {

        // 匹配窗口控件
        var gameData = game.procedure.DouDiZhu.getGameData();
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
    /**
     * 邀请按钮
     * @private
     */
    _BTN_Invite: function () {
        cc.log("邀请按钮被点击！");
        if (WeChat.isWechatInstalled && WeChat.isWechatInstalled()) {
            var shareTitle = "《赛亚麻将》:斗地主自建房";
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
     * 清除玩家UI 换桌调用
     * @private
     */
    _clearPlayersUI: function () {
        for (var index = 1; index <= 3; ++index) {
            this._ui.getPlayer(index).setInfo(-1, null);
            this._ui.getPlayer(index).reset();
        }
    },
    /**
     * 重置准备按钮状态
     * @private
     */
    _resetPreBegin: function () {
        var gameData = game.procedure.DouDiZhu.getGameData();
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

    /**
     * 初始化解散面板信息 玩家重连回来以后
     * @private
     */
    _initDestroyInfo: function () {
        var gameData = game.procedure.DouDiZhu.getGameData();
        if (gameData.destroyInfo.playerIndex != 0) {
            GameWindowDouDiZhu.DouDiZhuDisbandWindow.popup(gameData.destroyInfo.playerIndex);
            this.SetDestroyRoom();
        }
    },
    //重连以后，设置销毁房间的信息
    SetDestroyRoom: function () {
        var gameData = game.procedure.DouDiZhu.getGameData();
        var info = gameData.destroyInfo;
        var playerIndex = info.playerIndex;
        var destroyInst = GameWindowDouDiZhu.DouDiZhuDisbandWindow.inst;
        if (destroyInst) {
            var destroyTime = +info.destroyTime;  // 解散房间提交的服务器时间
            var durationTime = +info.duration;     // 最大等待时间
            var serverTime = ServerDate.getOffsetTime(destroyTime + durationTime);
            destroyInst.StartTimer(Math.floor(serverTime * 0.001));
            //如果是发起者隐藏 同意 拒绝按钮
            var players = gameData.players;
            for (var key in players) {
                if (players.hasOwnProperty(key)) {
                    //等于发起者，不处理 因为发起者默认是同意的
                    if (key == playerIndex) {
                        continue;
                    }
                    //destroyState  0 没有选， 1选的同意，2选的拒绝
                    if (players[key].destroyState == 0) {

                    }
                    else if (players[key].destroyState == 1) {
                        destroyInst.SetPlayerIsAgree(key, true);

                    } else if (players[key].destroyState == 2) {
                        destroyInst.SetPlayerIsAgree(key, false);
                    }
                }
            }
        }
    },


    /**
     * 初始化玩家状态
     * @private
     */
    _resetPlayers: function () {
        var gameData = game.procedure.DouDiZhu.getGameData();
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
    /**
     * 下一局 换桌+准备
     * @private
     */
    _nextRound: function () {
        // this._resetPreBegin();
        this._ui.getDiZhuCards().reset();
        this._ui.getDiZhuCards().show(false);
        cc.log("==> 斗地主游戏 结算界面 下一局按钮被点击");
        game.Audio.playBtnClickEffect();
        GameWindowDouDiZhu.SettlementRoundWindow.close();
        var gameData = game.procedure.DouDiZhu.getGameData();
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
    /**
     * 播放出牌特效
     * @param pattern
     * @param beginPos
     */
    playPatternEffect: function (pattern, beginPos) {
        var effectType = 0;
        switch (pattern) {
            case DouDiZhuHelper.CardsPattern.AIRPLANE :
            case DouDiZhuHelper.CardsPattern.AIRPLANE_TWO :
                effectType = GameEffectController.gameEffectType.DDZFeiJi;
                break;
            case DouDiZhuHelper.CardsPattern.PAIRS :
                effectType = GameEffectController.gameEffectType.DDZLianDui;
                break;
            case DouDiZhuHelper.CardsPattern.STRAIGHT :
                effectType = GameEffectController.gameEffectType.DDZShunZi;
                break;
            case DouDiZhuHelper.CardsPattern.KING_BOMB :
                effectType = GameEffectController.gameEffectType.DDZWangZha;
                break;
            case DouDiZhuHelper.CardsPattern.BOMB :
                effectType = GameEffectController.gameEffectType.DDZZhaDan;
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
    /**
     * 显示其他玩家的剩余牌张数
     */
    showOtherCardsNum: function () {
        var gameData = game.procedure.DouDiZhu.getGameData();
        for (var index = 1; index <= 3; ++index) {
            if (index == gameData.playerIndex) {
                continue;
            }
            var leftCards = this._ui.getPlayer(index).getLeftCards();
            leftCards.setCardsNum(17);
            leftCards.show(true);
        }
    },
    /**
     * 玩家开始说话回调 (必须重写)
     * @param uid   玩家的id号 string
     */
    onPlayerSpeakBegin: function (uid) {
        var gameData = game.procedure.DouDiZhu.getGameData();
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
    onPlayerSpeakEnd: function (uid) {
        var gameData = game.procedure.DouDiZhu.getGameData();
        var index = gameData.getIndexByUid(uid);
        cc.log("停止说话玩家的index " + index);
        if (index != -1) {
            this._ui.getPlayer(index).showTell(false);
        }
    },
    // == 按钮绑定 ==================================================================
    /**
     * 出牌按钮
     * @private
     */
    _BTN_PlayCard: function () {
        cc.log("出牌按钮！");
        var gameData = game.procedure.DouDiZhu.getGameData();
        var handCards = this._ui.getPlayer(gameData.playerIndex).getHandCards();
        var cards = handCards.getSelectedCardsValues();
        if (cards.length <= 0) {
            cc.log("未选择牌！");
            // 提示请您选择要出的牌
            this._ui.getTableTip().showTableTip(3);
            return;
        }
        game.gameNet.sendMessage(protocol.ProtoID.DDZ_PLAYER_PLAY, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId,
            cards: cards
        });
    },
    /**
     * 不出按钮
     * @private
     */
    _BTN_NoPlay: function () {
        cc.log("不出按钮！");
        game.gameNet.sendMessage(protocol.ProtoID.DDZ_PLAYER_NO_PLAY, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId
        });
        var gameData = game.procedure.DouDiZhu.getGameData();
        var handCards = this._ui.getPlayer(gameData.playerIndex).getHandCards();
        handCards.setUnselectedCardsValues(handCards.getSelectedCardsValues());
    },
    /**
     * 提示按钮
     * @private
     */
    _BTN_Hint: function () {
        cc.log("提示按钮！");
        game.gameNet.sendMessage(protocol.ProtoID.DDZ_PLAYER_HINT, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId
        });
    },
    /**
     * 叫地主按钮
     * @private
     */
    _BTN_Call: function (ok) {
        cc.log("叫地主被点击！" + ok);
        game.gameNet.sendMessage(protocol.ProtoID.DDZ_PLAYER_ROB, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId,
            ok: ok
        });
    },
    /**
     * 加倍按钮
     * @private
     */
    _BTN_Double: function (double) {
        cc.log("加倍被点击！" + double);
        game.gameNet.sendMessage(protocol.ProtoID.DDZ_PLAYER_DOUBLE, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId,
            double: double
        });
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
        //this._resetPlayers();
        this.__sendReady();
    },
    /**
     * 换桌点击
     * @private
     */
    _BTN_ChangeRoom: function () {
        cc.log("换桌按钮被点击！");
        game.Audio.playBtnClickEffect();
        game.gameNet.sendMessage(protocol.ProtoID.GAME_REQ_CHANGE_TABLE, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId
        })
    },
    /**
     * 规则按钮点击
     */
    _BTN_Rule: function () {
        cc.log("规则按钮被点击！");
        game.ui.HelpWin.popup(GameTypeConfig.type.DDZ);
    },
    /**
     * 托管按钮点击
     * @private
     */
    _BTN_Trust: function () {
        cc.log("托管按钮被点击！");
        var gameData = game.procedure.DouDiZhu.getGameData();
        if (gameData.getMainPlayer().isTrusting) {
            cc.log("已经进入托管，不要重复点击!");
            return;
        }
        game.gameNet.sendMessage(protocol.ProtoID.DDZ_PLAYER_TRUST, {
            uid: game.DataKernel.uid,
            roomId: game.DataKernel.roomId,
            isT: true
        })
    },

    // 退出按钮被点击
    _BTN_Exit: function () {
        cc.log("==> 斗地主房间退出按钮点击");
        game.Audio.playBtnClickEffect();
        // 如果游戏服断掉 直接退出房间
        if (!game.gameNet.isConnected()) {
            game.Procedure.switch(game.procedure.Home);
            return;
        }

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
    /**
     * 重写玩家加入消息
     * @param msg
     * @private
     */
    __NET_onPlayerAdd: function (msg) {
        this._super(msg);
        var gameData = game.procedure.DouDiZhu.getGameData();
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
        var gameData = game.procedure.DouDiZhu.getGameData();
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

    /**
     * 玩家离开房间消息
     * @param msg
     * @private
     */
    __NET_onPlayerLeave: function (msg) {
        this._super(msg);
        var gameData = game.procedure.DouDiZhu.getGameData();
        if (gameData.sceneMode == "FK") {
            if (gameData.isCreator()) {
                this._ui.getPreBegin().setBeginEnabled(gameData.checkReady());
            }
        }
    },
    /**
     * 解散房间请求消息
     * @param msg
     * @private
     */
    __NET_OnReqDestroyRoom: function (msg) {
        cc.log("解散房间请求：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var destroyTime = msg.destroyTime;  // 解散房间提交的服务器时间
        var durationTime = msg.duration;    // 最大等待时间
        GameWindowDouDiZhu.DouDiZhuDisbandWindow.popup(index);
        var destroyInst = GameWindowDouDiZhu.DouDiZhuDisbandWindow.inst;
        var serverTime = ServerDate.getOffsetTime(destroyTime + durationTime);
        destroyInst.StartTimer(Math.floor(serverTime * 0.001));
    },
    /**
     * 响应解散房间消息
     * @param msg
     * @private
     */
    __NET_OnRespDestroyRoom: function (msg) {
        cc.log("响应解散房间：" + JSON.stringify(msg));
        var win = GameWindowDouDiZhu.DouDiZhuDisbandWindow.inst;
        if (win != null) {
            win.SetPlayerIsAgree(msg.playerIndex, msg.ok);
        }
    },
    /**
     * 游戏没开始，房主退出房间，直接解散房间
     * @param msg
     * @private
     */
    __NET_OnDestroyRoom: function (msg) {
        this.__exitGame();
    },
    /**
     * 解散房间最后投票结果
     * @param msg
     * @private
     */
    __NET_OnDestroyRoom_Result: function (msg) {
        cc.log("解散房间投票最后结果：" + JSON.stringify(msg));
        if (!msg.success) {
            game.ui.HintMsg.showTipText("有玩家不同意,2秒后关闭窗口！", cc.p(640, 360), 2);
            setTimeout(function () {
                GameWindowDouDiZhu.DouDiZhuDisbandWindow.inst._destroy();
            }.bind(this), 2000);
        } else {
            //如果是同意，直接关闭
            GameWindowDouDiZhu.DouDiZhuDisbandWindow.inst._destroy();
        }
    },
    /**
     * 离开房间处理
     */
    __exitGame: function () {
        game.DataKernel.clearRoomId();
        var gameData = game.procedure.DouDiZhu.getGameData();
        if (gameData.sceneMode == "JB") {
            game.Procedure.switch(game.procedure.RoomList);
        } else if (gameData.sceneMode == "FK") {
            game.Procedure.switch(game.procedure.RoomList);
        }

    },
    /**
     * 结算面板分享按钮被点击
     * @private
     */
    _BTN_Share: function () {
        cc.log("==> 斗地主游戏 结算界面 分享按钮被点击");
        game.Audio.playBtnClickEffect();
        game.UISystem.captureScreen("screenShot.jpg", function () {
            WeChat.shareImage(false, jsb.fileUtils.getWritablePath() + "screenShot.jpg", function (ok) {
            });
        });
    }
});