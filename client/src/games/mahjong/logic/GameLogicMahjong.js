/**
 * 麻将逻辑
 */
var GameLogicMahjong = GameLogicBasic.extend({

    enter : function (window) {
        cc.log("==> 进入麻将游戏流程");

        // 播放背景音乐
        game.Audio.MahjongPlayBGM();

        this._super(window);
    },

    leave : function () {
        this._super();
    },

    /**
     * UI初始化之后调用
     * @private
     */
    _afterUIInit : function () {
        // 房间菜单按钮操作绑定
        var roomMenu = this._ui.getRoomMenu();
        roomMenu.onSettingClicked(this._BTN_Setting);
        roomMenu.onQuitClicked(this._BTN_Exit);
        roomMenu.onRuleClicked(this._BTN_Rule);
        roomMenu.onTrustClicked(this._BTN_Trusteeship);

        this._ui.onTrusteeshipCancelBtn(this._BTN_TrusteeshipCancel);

        // 上噶按钮绑定
        var multiple = this._ui.getMultiple();
        multiple.onGaClicked(this._BTN_Multiple.bind(this));

        // 挂起时间绑定
        var hangupTasks = this._ui.getHangupTasks();
        hangupTasks.onPassClicked(this._BTN_Pass.bind(this));
        hangupTasks.onChiClicked(this._BTN_Chi.bind(this));
        hangupTasks.onPengClicked(this._BTN_Peng.bind(this));
        hangupTasks.onGangClicked(this._BTN_Gang.bind(this));
        hangupTasks.onHuClicked(this._BTN_Hu.bind(this));

        // 设置房间基本信息
        var baseScore = this._ui.getBaseScore();
        baseScore.setBaseInfo();

        // 设置语音按钮状态
        var gameData = game.procedure.Mahjong.getGameData();
        var show = gameData.options.canVoice;
        this._ui.getVoiceBtn().setVisible(show);

        // 获取自己的手牌用于绑定出牌函数
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        var handCards = uiPlayer.getHandCards();
        handCards.onPlayCardClicked(this._BTN_PLayCard.bind(this));
        handCards.onSelectCard(this._BTN_SelectCard.bind(this));
        handCards.onTingCardSelect(this._BTN_SelectTingCard.bind(this));
        if(gameData.gameType == 1) {
            handCards.switchTouchMode(1);
        }

        // 退出游戏按钮
        this._ui.onExitGameClicked(this._BTN_Exit.bind(this));
        if (gameData.gameType == 8) {
            this._ui.onBillClicked(this._BTN_Bill.bind(this));
            this._ui.onTipClicked(this._BTN_Tip.bind(this));
            this._ui.showBtnTip(false);
            this._ui.onNextClicked(this._BTN_Next.bind(this));
        }
        if (gameData.gameType == 8 && gameData.subType == 2) {
            this._ui.showBtnHP(false);
            this._ui.onHPClicked(this._BTN_HP.bind(this));

        }
        if (gameData.gameType == 8 && gameData.subType == 1) {
            handCards.switchTouchMode(1);
        }
        this._initPreBegin();
    },

    /**
     * 根据当前的 gameData 重置房间信息函数
     */
    resetUpdateRoomInfo : function () {
        this._super();

        var gameData = game.procedure.Mahjong.getGameData();

        this._ui.showTrusteeshipCancelBtn(false);

        this._clearPlayersUI();

        this._resetPreBegin();

        this._initPlayer();

        var countDownClock = GameWindowBasic.PlayerClock.getController();
        countDownClock.setGameMode(GameTypeConfig.type.CDMJ);
        countDownClock.reset();
        countDownClock.addToNode(null);

        // 牌局号 或 房间号
        if (gameData.sceneMode == "JB") {
            this._ui.setRoomRoundID("牌局号:" + gameData.roundId);
            if (!gameData.playing) {
                this._ui.setRoomRoundID(-1);
            }
            this._ui.showCurRound(false);
        }else if (gameData.sceneMode == "FK") {
            this._ui.setRoomRoundID("房间号:" + gameData.roomId);
            this._ui.showCurRound(true);
            this._ui.setCurRound("牌局号:" + gameData.roundId);
        }

        // 更新公共牌数量
        this._updateRoomInfo();

        var dir = this._ui.getDirection();
        dir.setMainPlayerIndex(gameData.playerIndex);
        dir.reset();

        var uiDirectionOrder = this._ui.getDirectionOrder();
        uiDirectionOrder.reset();

        if (gameData.reconnect) {
            // 重连 进行数据恢复
            var mainPlayer = gameData.getMainPlayer();
            var gameType = gameData.gameType;

            // 重连有令
            if (gameData.playing) {
                if(gameType == GameTypeConfig.type.HNMJ)
                uiDirectionOrder.showDirectionOrder(gameData.ling);
            }

            // 是否显示托管按钮
            this._ui.showTrusteeshipCancelBtn(mainPlayer.isTrusteeship);

            var mt = this._ui.getMultiple();
            mt.reset();

            var ht = this._ui.getHangupTasks();
            ht.reset();

            var players = gameData.players;
            var indexArray = gameData.getAllPlayerIndex();
            for (var i = 0; i < indexArray.length; ++i) {
                var player = players[indexArray[i]];
                if (player.index != gameData.playerIndex) {
                    // 不是自己，手牌转换成牌背
                    player.handCards = {100 : player.handCardsNumber};
                }
                var uiPlayer = this._ui.getPlayer(indexArray[i]);
                uiPlayer.reset();
                uiPlayer.setInfo(player.index, player);
                /**
                 * 游戏状态：
                 * 海南麻将(gameType == 1)：1.ready 2.sg  3.playing
                 * 成都麻将(gameType == 8)：1.ready 2.hsz 3.dq 4.playing 5.end
                 */
                var game_status_playing = gameData.gameType == 1 ? 3 : 4;
                if (gameData.playing) {
                    uiPlayer.show(true);
                    if (gameData.playStatus == game_status_playing) {
                        // 打牌阶段
                        // 手牌
                        this._updateUIHandCards(player);

                        // 花牌-----成都麻将隐藏
                        var uiFlowerCards = uiPlayer.getFlowerCards();
                        if(gameType == 1) {
                            uiFlowerCards.setCardsValues(player.flowerCards);
                        }else {
                            uiFlowerCards.reset();
                        }

                        // 桌牌
                        var uiTableCards = uiPlayer.getTableCards();
                        uiTableCards.setCardsValues(player.playedCards);

                        // 组合牌
                        var uiUserCards = uiPlayer.getUserCards();
                        // 吃的牌
                        for (var j = 0; j < player.chiCards.length; ++j) {
                            uiUserCards.addChiCards(player.chiCards[j].cards, player.chiCards[j].target);
                        }
                        // 碰的牌
                        for (j = 0; j < player.pengCards.length; ++j) {
                            uiUserCards.addPengCards(player.pengCards[j].cards, player.pengCards[j].target);
                        }
                        // 杠的牌
                        for (j = 0; j < player.gangCards.length; ++j) {
                            uiUserCards.addGangCards2(player.gangCards[j].cards, player.gangCards[j].type, player.gangCards[j].target);
                        }
                    }
                    // 成都麻将换三张重连
                    if (gameData.gameType == 8 && gameData.playStatus == 2) {
                        this._updateUIHandCards(player);
                        if (player.index == gameData.playerIndex) {
                            // 显示推荐手牌
                            var cards = mainPlayer.hszRecommend;
                            // 处理手牌
                            var hc = uiPlayer.getHandCards();
                            hc.switchTouchMode(2);
                            hc.setCardsTouch(true);
                            hc.setSelectedCards(cards);
                            // 显示换三张确定面板
                            var cp = this._ui.getConfirmPanel();
                            cp.onConfirmClicked(this._BTN_ConfirmHSZ.bind(this));
                            cp.show(true);
                            var timer = 0;
                            if (gameData.actionTimer) {
                                timer = ServerDate.getOffsetTime(gameData.actionTimer.stamp + gameData.actionTimer.duration);
                            }
                            cp.startTimer(Math.floor(timer * 0.001));
                            // 显示换牌按钮
                            if (gameData.gameType == 8 && gameData.subType == 2) {
                                this._ui.showBtnHP(true);
                            }
                        }else {
                            // 其他玩家显示选牌中
                            var local_status = -1;// 1选牌中，2已选牌，3等待其他玩家选牌，4定缺中，5已定缺
                            if (player.hszStatus == 0){
                                local_status = 1;
                            }else if (player.hszStatus == 1) {
                                local_status = 2;
                            }
                            uiPlayer.setStatus(local_status);
                        }
                    }
                    // 成都麻将定缺重连
                    if (gameData.gameType == 8 && gameData.playStatus == 3) {
                        this._updateUIHandCards(player);
                        // 显示定缺状态
                        local_status = -1;// 1选牌中，2已选牌，3等待其他玩家选牌，4定缺中，5已定缺
                        if (player.dqType == -1){
                            local_status = 4;
                        }else {
                            local_status = 5;
                        }
                        uiPlayer.setStatus(local_status);
                        // 自己显示定缺按钮
                        if (player.index == gameData.playerIndex) {
                            if (player.dqType == -1) {
                                // 显示定缺按钮
                                var type = player.dqRecommend;
                                var dq = this._ui.getDQSelect();
                                dq.clickTong(this._BTN_DQ.bind(this));
                                dq.clickTiao(this._BTN_DQ.bind(this));
                                dq.clickWan(this._BTN_DQ.bind(this));
                                dq.showBestType(type);
                                uiPlayer.setStatus(-1);
                            }
                            // 显示听牌提示按钮
                            this._ui.showBtnTip(player.haveTing);
                        }
                    }
                    // 显示换牌按钮
                    if (gameData.gameType == 8 && gameData.playStatus >= 3 && gameData.subType == 2) {
                        this._ui.showBtnHP(true);
                    }

                    if (gameData.gameType == 8 && mainPlayer.huOrder != 0) {
                        if (gameData.sceneMode == "JB"){
                            this._ui.showNext(true);
                        }
                        if (player.index == gameData.playerIndex) {
                            this._updateUIHandCards(player);
                            var uiHandCards = this._ui.getPlayer(gameData.playerIndex).getHandCards();
                            if (player.huCard != 0) {
                                uiHandCards.addNewCard(player.huCard);
                            }
                        }
                    }
                }
            }
            // playStatus == 2 代表上噶或换三张
            var game_status_sg_or_hsz = 2;
            if (gameData.playStatus == game_status_sg_or_hsz) {
                if (gameType == 1) {
                    mt.setCurrentMultiple(mainPlayer.multiple);
                    mt.show(true);
                }else {
                    mt.show(false);
                }

                var serverTime = 0;
                if (gameData.actionTimer) {
                    serverTime = ServerDate.getOffsetTime(gameData.actionTimer.stamp + gameData.actionTimer.duration);
                }

                dir.setDirection(-1, Math.floor(serverTime * 0.001));

            } else if (gameData.playStatus == game_status_playing) {

                uiHandCards = this._ui.getPlayer(gameData.playerIndex).getHandCards();
                uiHandCards.switchTouchMode(1);
                // 打牌阶段
                if (gameData.curPlayIndex == gameData.playerIndex) {
                    // 当前操作玩家是自己
                    uiHandCards.setCardsTouch(true);
                } else {
                    uiHandCards.setCardsTouch(false);
                }

                // 是否有挂起任务
                if (gameData.isExistHangupTasks) {
                    uiHandCards.setCardsTouch(false);
                    ht.showBtnInfo(mainPlayer.hangupTasks);
                }

                // 倒计时时间
                serverTime = 0;
                if (gameData.actionTimer) {
                    serverTime = ServerDate.getOffsetTime(gameData.actionTimer.stamp + gameData.actionTimer.duration);
                }

                dir.setDirection(gameData.curPlayIndex, Math.floor(serverTime * 0.001));
            }
        }

    },

    /**
     * 退出按钮点击处理
     */
    _BTN_Exit : function () {
        cc.log("==> 麻将房间退出按钮点击");
        game.Audio.playBtnClickEffect();
        // 如果游戏服断掉 直接退出房间
        if (!game.gameNet.isConnected()) {
            game.Procedure.switch(game.procedure.Home);
            return;
        }

        //金币场
        game.ui.TipWindow.popup({
            tipStr:  "确认退出房间吗？",
            showNo:  true
        }, function (win) {
            game.UISystem.closePopupWindow(win);
            game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_QUIT_ROOM, {
                uid : game.DataKernel.uid, roomId : game.DataKernel.roomId
            });
        }.bind(this));
    },
    // 对局流水点击
    _BTN_Bill: function () {
        cc.log("对局流水！");
        // GameEffectController.playGameEffect(this._ui, null, cc.p(640, 360),
        //     GameEffectController.gameEffectType.MJDIAN, function () {
        //         cc.log("播放完毕！！");
        //     });
        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_BILL_INFO, {
            roomId: game.DataKernel.roomId,
            uid: game.DataKernel.uid
        });
    },
    // 胡牌提示点击
    _BTN_Tip: function () {
        cc.log("胡牌提示！");
        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_CHECK_TING, {
            roomId: game.DataKernel.roomId,
            uid: game.DataKernel.uid
        });
    },
    // 换牌提示点击
    _BTN_HP: function () {
        cc.log("换牌提示点击！");
        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_HP_INFO, {
            roomId: game.DataKernel.roomId,
            uid: game.DataKernel.uid
        });
    },
    /**
     * 初始化玩家数据
     * @private
     */
    _initPlayer : function () {
        var gameData = game.procedure.Mahjong.getGameData();
        var indexArray = gameData.getAllPlayerIndex();
        for (var i = 0; i < indexArray.length; ++i) {
            var uiPlayer = this._ui.getPlayer(indexArray[i]);
            uiPlayer.setInfo(indexArray[i], gameData.players[indexArray[i]]);
            uiPlayer.onHeadPicClicked(this.__HeadPicClicked.bind(this));
            uiPlayer.onRechargeClicked(this._BTN_RechargeClicked);
        }
    },
    /**
     * 重置玩家数据
     * @private
     */
    _resetPlayers : function () {
        var gameData = game.procedure.Mahjong.getGameData();
        for (var i = 1; i <= gameData.getPlayerNum(); ++i) {
            var uiPlayer = this._ui.getPlayer(i);
            if (gameData.players.hasOwnProperty(i)) {
                uiPlayer.reset();
            } else {
                uiPlayer.setInfo(-1, null);
            }
        }
    },

    /**
     * 初始化开始前按钮数据
     * @private
     */
    _initPreBegin : function () {
        var gameData = game.procedure.Mahjong.getGameData();
        if (gameData.sceneMode == "JB") {
            var matchWindow = this._ui.getMatchWindow();
            matchWindow.onCloseClicked(this._BTN_Exit);
            matchWindow.onReadyHandler(this.__sendReady);
            matchWindow.show(true);
        } else if (gameData.sceneMode == "FK") {
            var preBegin = this._ui.getPreBegin();
            preBegin.onInviteClicked(this._BTN_Invite.bind(this));
            preBegin.onReadyClicked(this._BTN_Ready.bind(this));
        }
    },
    // /**
    //  * 初始化解散面板信息 玩家重连回来以后
    //  * @private
    //  */
    // _initDestroyInfo:function(){
    //     var gameData = game.procedure.Mahjong.getGameData();
    //     if(gameData.destroyInfo.playerIndex != 0){
    //         GameWindowMahjong.Mahjong_WaitQuitWindow.popup(gameData.destroyInfo.playerIndex);
    //         this.SetDestroyRoom();
    //     }
    // },
    // //重连以后，设置销毁房间的信息
    // SetDestroyRoom:function(){
    //     var gameData = game.procedure.Mahjong.getGameData();
    //     var info = gameData.destroyInfo;
    //     var playerIndex = info.playerIndex;
    //     var destroyInst = GameWindowMahjong.Mahjong_WaitQuitWindow.inst;
    //     if (destroyInst) {
    //         var destroyTime =  +info.destroyTime;  // 解散房间提交的服务器时间
    //         var durationTime = +info.duration;     // 最大等待时间
    //         var serverTime = ServerDate.getOffsetTime(destroyTime + durationTime);
    //         destroyInst.StartTimer(Math.floor(serverTime * 0.001));
    //         //如果是发起者隐藏 同意 拒绝按钮
    //         var players = gameData.players;
    //         for(var key in players){
    //             if(players.hasOwnProperty(key)){
    //                 //等于发起者，不处理 因为发起者默认是同意的
    //                 if(key == playerIndex){
    //                   continue;
    //                 }
    //                 //destroyState  0 没有选， 1选的同意，2选的拒绝
    //                 if( players[key].destroyState  == 0 ) {
    //
    //                 }
    //                 else if(players[key].destroyState == 1) {
    //                     destroyInst.SetPlayerIsAgree( key , true);
    //
    //                 }else if(players[key].destroyState == 2){
    //                     destroyInst.SetPlayerIsAgree( key , false);
    //                 }
    //             }
    //         }
    //     }
    // },
    /**
     * 重置开始前按钮数据
     * @private
     */
    _resetPreBegin : function () {
        var gameData = game.procedure.Mahjong.getGameData();
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
     * 清除玩家UI 换桌调用
     * @private
     */
    _clearPlayersUI: function () {
        var gameData = game.procedure.Mahjong.getGameData();
        var num = gameData.getPlayerNum();
        for (var index = 1; index <= num; ++index) {
            this._ui.getPlayer(index).show(false);
            this._ui.getPlayer(index).reset();
        }
    },

    /**
     * 更新房间信息
     * @private
     */
    _updateRoomInfo : function () {
        var gameData = game.procedure.Mahjong.getGameData();
        // 设置公牌数量
        var publicCards = this._ui.getPublicCards();
        publicCards.show(gameData.playing);
        publicCards.setPublicNumber(gameData.publicCardsNum);
    },
    /**
     * 隐藏倒计时
     */
    _resetClock: function () {
        var countDownClock = GameWindowBasic.PlayerClock.getController();
        countDownClock.reset();
        countDownClock.addToNode(null);
    },
    /**
     * 更新制定玩家的手牌数据
     * @param player
     * @private
     */
    _updateUIHandCards : function (player) {
        var gameData = game.procedure.Mahjong.getGameData();
        var uiPlayer = this._ui.getPlayer(player.index);
        var uiHandCards = uiPlayer.getHandCards();
        var cardsArray = GameDataMahjong.Helper.handCardsObjToArray(player.handCards);

        if (gameData.curPlayIndex == player.index) {
            var newCard = cardsArray.pop();
            if (player.index == gameData.playerIndex) {
                cardsArray = GameDataMahjong.Helper.handCardsSort(cardsArray, player.dqType);
            }
            uiHandCards.setCardsValues(cardsArray, player.dqType);
            uiHandCards.addNewCard(newCard, player.dqType);
        } else {
            if (player.index == gameData.playerIndex) {
                cardsArray = GameDataMahjong.Helper.handCardsSort(cardsArray, player.dqType);
            }
            uiHandCards.setCardsValues(cardsArray, player.dqType);
        }
    },
    /**
     * 玩家开始说话回调 (必须重写)
     * @param uid   玩家的id号 string
     */
    onPlayerSpeakBegin : function (uid) {
        var gameData = game.procedure.Mahjong.getGameData();
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
        var gameData = game.procedure.Mahjong.getGameData();
        var index = gameData.getIndexByUid(uid);
        cc.log("停止说话玩家的index " + index);
        if (index != -1) {
            this._ui.getPlayer(index).showTell(false);
        }
    },

    /**
     * 离开房间处理
     */
    __exitGame : function () {
        game.DataKernel.clearRoomId();
        var gameData = game.procedure.Mahjong.getGameData();
        if (gameData.sceneMode == "JB") {
            game.Procedure.switch(game.procedure.RoomList);
        }else if (gameData.sceneMode == "FK") {
            game.Procedure.switch(game.procedure.RoomList);
        }

    },
    // ==== 按钮点击回调函数 ==============================
    /**
     * 玩家头像被点击回调
     * @param index
     * @private
     */
    __HeadPicClicked : function (index) {
        cc.log("第 " + index + "个玩家被点击");
        game.ui.GamePlayerInfo.popup(index);
    },

    /**
     * 邀请按钮
     * @private
     */
    _BTN_Invite: function () {
        cc.log("邀请按钮被点击！");
        if (WeChat.isWechatInstalled && WeChat.isWechatInstalled()) {
            var shareTitle = "《赛亚麻将》:麻将自建房";
            var shareMsg = "地道玩法，自定义规则，海南人的专属线上棋牌室！";
            // shareMsg += "邀请码：" + game.DataKernel.uid;
            shareMsg +=　"\n房间号：" + game.DataKernel.roomId;
            WeChat.share(false, game.config.WECHAT_SHARE_URL + game.DataKernel.uid, shareTitle, shareMsg, function (ok) {});
            // game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_SHARE, {uid: game.DataKernel.uid, isCircle: false});
        } else {
            cc.log("==> 微信没有安装");
        }
    },

    /**
     * 准备按钮被点击
     * @private
     */
    _BTN_Ready: function () {
        cc.log("准备按钮被点击！");
        game.Audio.playBtnClickEffect();
        this.__sendReady();
    },

    /**
     * 快速充值按钮被点击
     * @private
     */
    _BTN_RechargeClicked : function () {
        cc.log("==> 麻将游戏 快速充值按钮点击");
        game.ui.MallWin.popup();
    },

    /**
     * 规则按钮点击回调
     * @private
     */
    _BTN_Rule : function () {
        cc.log("==> 麻将游戏 点击了规则按钮");
        game.Audio.playBtnClickEffect();
        var gameData = game.procedure.Mahjong.getGameData();
        game.ui.HelpWin.popup(gameData.gameType, gameData.subType);
    },

    /**
     * 托管按钮点击回调
     * @private
     */
    _BTN_Trusteeship : function () {
        cc.log("==> 麻将游戏 点击了托管按钮");
        game.Audio.playBtnClickEffect();
        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_PLAYER_TRUSTEESHIP, {
            roomId  : game.DataKernel.getRoomId(),
            uid     : game.DataKernel.uid,
            isT     : true
        });
    },

    /**
     * 麻将游戏取消托管
     * @private
     */
    _BTN_TrusteeshipCancel : function () {
        cc.log("==> 麻将游戏 取消托管");
        game.Audio.playBtnClickEffect();
        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_PLAYER_TRUSTEESHIP, {
            roomId  : game.DataKernel.getRoomId(),
            uid     : game.DataKernel.uid,
            isT     : false
        });
    },

    /**
     * 上噶按钮被点击
     * @param ga        选择的噶值
     * @private
     */
    _BTN_Multiple : function (ga) {
        cc.log("==> 麻将游戏 点击了上噶按钮");
        game.Audio.playBtnClickEffect();
        this._ui.getMultiple().setCurrentMultiple(ga);
        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_PLAYER_MULTIPLE, {
            roomId  : game.DataKernel.getRoomId(),
            uid     : game.DataKernel.uid,
            multiple : ga
        });
    },

    /**
     * 出牌按钮
     * @param cardId
     * @private
     */
    _BTN_PLayCard : function (cardId) {
        cc.log("==> 麻将游戏 出牌:" + cardId);
        // 隐藏手牌点击
        var gameData = game.procedure.Mahjong.getGameData();
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        var handCards = uiPlayer.getHandCards();
        handCards.setCardsTouch(false);

        // 隐藏高亮的tableCards
        var indexArray = gameData.getAllPlayerIndex();
        for (var i = 0; i < indexArray.length; ++i) {
            var tableCards = this._ui.getPlayer(indexArray[i]).getTableCards();
            tableCards.hideLightCards();

            var userCards = this._ui.getPlayer(indexArray[i]).getUserCards();
            userCards.hideLightCards();
        }

        // 关闭胡牌提示窗口
        this._ui.getHuTipWindow().show(false);

        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_PLAY_CARD, {
            roomId  : game.DataKernel.getRoomId(),
            uid     : game.DataKernel.uid,
            card    : cardId
        });

    },
    /**
     * 选牌回调
     * @param cardId
     * @private
     */
    _BTN_SelectCard : function (cardId) {
        cc.log("==> 麻将游戏 选牌:" + cardId);
        var gameData = game.procedure.Mahjong.getGameData();
        var indexArray = gameData.getAllPlayerIndex();
        for (var i = 0; i < indexArray.length; ++i) {
            var uiPlayer = this._ui.getPlayer(indexArray[i]);

            var tableCards = uiPlayer.getTableCards();
            tableCards.showLightCards(cardId);

            var userCards = uiPlayer.getUserCards();
            userCards.showLightCards(cardId);
        }
    },

    /**
     * 点击有听牌提示的牌
     * @param cardId
     * @param show
     * @private
     */
    _BTN_SelectTingCard : function (cardId, show) {
        cc.log("==> 麻将游戏 选听牌1 :" + cardId);
        var tipHuWindow = this._ui.getHuTipWindow();
        if (!show) {
            tipHuWindow.reset();
            return;
        }

        var tings = game.procedure.Mahjong.getGameData().tings;
        var data = [];
        for (var key in tings) {
            if (tings.hasOwnProperty(key)) {
                if (cardId == key) {
                    data = tings[key];
                    break;
                }
            }
        }
        cc.log("==> 麻将游戏 选听牌2 :" + JSON.stringify(data));
        tipHuWindow.loadView(data);
        tipHuWindow.show(true);
    },
    /**
     * 换三张确定按钮
     * @private
     */
    _BTN_ConfirmHSZ: function () {
        cc.log("==> 确定换三张！");
        game.Audio.playBtnClickEffect();
        var gameData = game.procedure.Mahjong.getGameData();
        var me = this._ui.getPlayer(gameData.playerIndex);
        var hc = me.getHandCards();
        var cards = hc.getSelectedValues();
        if (cards.length < 3) {
            game.ui.HintMsg.showTipText("请选择3张相同花色的手牌！", cc.p(640, 370), 2);
            return;
        }
        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_REQ_SELECT, {
            cards: cards,
            roomId: game.DataKernel.roomId,
            uid: game.DataKernel.uid
        });
    },
    /**
     * 定缺
     */
    _BTN_DQ: function (type) {
        cc.log("==> 选择定缺：" + type);
        game.Audio.playBtnClickEffect();
        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_REQ_DQ, {
            type: type,
            roomId: game.DataKernel.roomId,
            uid: game.DataKernel.uid
        });
    },
    /**
     * 吃按钮点击回调
     * @private
     */
    _BTN_Chi : function () {
        cc.log("==> 麻将游戏 吃");
        game.Audio.playBtnClickEffect();
        var gameData = game.procedure.Mahjong.getGameData();
        var ht = gameData.getMainPlayer().hangupTasks;
        var chiArray = ht.chi;

        var uiHangupTasks = this._ui.getHangupTasks();
        if (chiArray.length < 2) {
            uiHangupTasks.reset();
            game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_PLAYER_CHI, {
                roomId  : game.DataKernel.getRoomId(),
                uid     : game.DataKernel.uid,
                arrayIndex  : 0
            });
        } else {
            uiHangupTasks.showSelectController(1, chiArray, function (index) {
                uiHangupTasks.reset();
                game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_PLAYER_CHI, {
                    roomId  : game.DataKernel.getRoomId(),
                    uid     : game.DataKernel.uid,
                    arrayIndex  : index
                });
            });
        }

    },

    /**
     * 碰按钮点击回调
     * @private
     */
    _BTN_Peng : function () {
        cc.log("==> 麻将游戏 碰");
        game.Audio.playBtnClickEffect();
        var gameData = game.procedure.Mahjong.getGameData();
        var ht = gameData.getMainPlayer().hangupTasks;
        var uiHangupTasks = this._ui.getHangupTasks();
        uiHangupTasks.reset();
        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_PLAYER_PENG, {
            roomId  : game.DataKernel.getRoomId(),
            uid     : game.DataKernel.uid,
            card    : ht.peng
        });
    },

    /**
     * 杠按钮点击
     * @private
     */
    _BTN_Gang : function () {
        cc.log("==> 麻将游戏 杠");
        game.Audio.playBtnClickEffect();
        var gameData = game.procedure.Mahjong.getGameData();
        var ht = gameData.getMainPlayer().hangupTasks;
        var gangArray = ht.gang;
        var uiHangupTasks = this._ui.getHangupTasks();
        if (gangArray.length < 2) {
            uiHangupTasks.reset();
            game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_PLAYER_GANG, {
                roomId  : game.DataKernel.getRoomId(),
                uid     : game.DataKernel.uid,
                card    : gangArray[0]
            });
        } else {
            uiHangupTasks.showSelectController(3, gangArray, function (value) {
                uiHangupTasks.reset();
                game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_PLAYER_GANG, {
                    roomId  : game.DataKernel.getRoomId(),
                    uid     : game.DataKernel.uid,
                    card    : value
                });
            });
        }

    },

    /**
     * 胡按钮被点击
     * @private
     */
    _BTN_Hu : function () {
        cc.log("==> 麻将游戏 胡");
        game.Audio.playBtnClickEffect();
        var uiHangupTasks = this._ui.getHangupTasks();
        uiHangupTasks.reset();
        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_PLAYER_HU, {
            roomId  : game.DataKernel.getRoomId(),
            uid     : game.DataKernel.uid
        });
    },

    /**
     * 过按钮被点击
     * @private
     */
    _BTN_Pass : function () {
        cc.log("==> 麻将游戏 过");
        game.Audio.playBtnClickEffect();
        var uiHangupTasks = this._ui.getHangupTasks();
        uiHangupTasks.reset();
        game.gameNet.sendMessage(protocol.ProtoID.MAHJONG_PLAYER_PASS, {
            roomId  : game.DataKernel.getRoomId(),
            uid     : game.DataKernel.uid
        });
    },

    /**
     * 结算面板下一局按钮被点击
     * @private
     */
    _BTN_Next : function () {
        cc.log("==> 麻将游戏 结算界面 下一局按钮被点击");
        game.Audio.playBtnClickEffect();
        GameWindowMahjong.RoundSettlement.close();
        GameWindowMahjongEr.RoundSettlement.close();
        this._ui.showNext(false);
        this._ui.showEnd(-1);
        // 隐藏倒计时
        this._resetClock();
        // 隐藏胡提示
        var huTip = this._ui.getHuTipWindow();
        huTip.reset();
        var gameData = game.procedure.Mahjong.getGameData();
        if (gameData.sceneMode == "JB") {
            game.gameNet.sendMessage(protocol.ProtoID.GAME_REQ_CHANGE_TABLE, {
                roomId : game.DataKernel.getRoomId(),
                uid : game.DataKernel.uid});
        }else if (gameData.sceneMode == "FK") {
            this._resetPreBegin();
            // this.__sendReady();
            // var mainPlayer = gameData.getMainPlayer();
            // cc.log("主玩家当前托管状态======>" + mainPlayer.isTrusteeship);
            // this._ui.showTrusteeshipCancelBtn(mainPlayer.isTrusteeship);
        }
    },

    /**
     * 结算面板分享按钮被点击
     * @private
     */
    _BTN_Share : function () {
        cc.log("==> 麻将游戏 结算界面 分享按钮被点击");
        game.Audio.playBtnClickEffect();
        game.UISystem.captureScreen("screenShot.jpg", function () {
            WeChat.shareImage(false, jsb.fileUtils.getWritablePath() + "screenShot.jpg", function (ok) {});
        });
    },

    /**
     * 绑定消息函数 子类重写必须调用父类的该函数
     */
    bindNetMessageHandler : function () {
        this._super();

        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_START_NEW_ROUND, this.__NET_onStartNewRound.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_START_MULTIPLE, this.__NET_startMultiple.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PLAYER_MULTIPLE, this.__NET_playerMultiple.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_END_MULTIPLE, this.__NET_endMultiple.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_INIT_CARDS, this.__NET_initCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PUBLIC_CARDS_UPDATE, this.__NET_publicCardsUpdate.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_CUR_PLAYER, this.__NET_currentPlayer.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PLAY_CARD, this.__NET_playCard.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_NEW_CARD, this.__NET_newCard.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_FLOWER_CARD, this.__NET_flowerCard.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PLAYER_CHI, this.__NET_playerChi.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PLAYER_PENG, this.__NET_playerPeng.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PLAYER_GANG, this.__NET_playerGang.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PLAYER_HU, this.__NET_playerHu.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PLAYER_PASS, this.__NET_playerPass.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PLAYER_HANGUP, this.__NET_playerHangupTasks.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PLAYER_HANGUP_END, this.__NET_playerHangupTasksEnd.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PLAYER_TRUSTEESHIP, this.__NET_onTrusteeship.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ACTION_TIMER, this.__NET_ActionTimer.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_ROUND_SETTLEMENT, this.__NET_RoundSettlement.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_END_ROUND_DATA, this.__NET_endSettlement.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_ON_TING, this.__NET_OnTing.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ROOM_RESOURCE_UPDATE, this.__NET_GameRoomResourceUpdate.bind(this));
        // 成都麻将接口
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_START_SELECT, this.__NET_startSelect.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_REQ_SELECT, this.__NET_playerSelect.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_END_SELECT, this.__NET_endSelect.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_START_DQ, this.__NET_startDQ.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_REQ_DQ, this.__NET_playerDQ.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_END_DQ, this.__NET_endDQ.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_HAVE_TING, this.__NET_haveTing.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_CHECK_TING, this.__NET_checkTing.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_HP_INFO, this.__NET_hpInfo.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_BILL_INFO, this.__NET_billInfo.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_SHOW_NEXT, this.__NET_showNext.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_PLAYER_OUT, this.__NET_playerOut.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_TUI_SHUI, this.__NET_tuiShui.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_SHOW_SCORE, this.__NET_showScore.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_DELETE_CARD, this.__NET_deleteCard.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.MAHJONG_ADD_CARD, this.__NET_addHuCard.bind(this));

        //GM修改牌堆消息
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.CHEAT_GET_CARDS, this.__NET_cheatGetCards.bind(this));
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.CHEAT_UPDATE_CARDS, this.__NET_cheatUpdateCards.bind(this));
        //麻将发起解散请求
        // game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ON_REQ_DESTROYROOM, this.__NET_OnReqDestroyRoom.bind(this));
        // game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ON_RESP_DESTROYROOM, this.__NET_OnRespDestroyRoom.bind(this));
        // game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ON_DESTROYROOM, this.__NET_OnDestroyRoom.bind(this));
        // game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.GAME_ON_DESTROYROOM_RESULT, this.__NET_OnDestroyRoom_Result.bind(this));
    },

    // 开始换三张
    __NET_startSelect: function (msg) {
        cc.log("==> 开始换三张：" + JSON.stringify(msg));
        var cards = msg.cards;
        var gameData = game.procedure.Mahjong.getGameData();
        var me = this._ui.getPlayer(gameData.playerIndex);
        // 处理手牌
        var hc = me.getHandCards();
        hc.switchTouchMode(2);
        hc.setCardsTouch(true);
        hc.setSelectedCards(cards);
        // 显示换三张确定面板
        var cp = this._ui.getConfirmPanel();
        cp.onConfirmClicked(this._BTN_ConfirmHSZ.bind(this));
        cp.show(true);
        // 其他玩家显示选牌中
        var indexArr = gameData.getAllPlayerIndex();
        for (var i = 0; i < indexArr.length; ++i) {
            if (indexArr[i] == gameData.playerIndex) {
                continue;
            }
            var uiPlayer = this._ui.getPlayer(indexArr[i]);
            uiPlayer.setStatus(1);
        }
    },

    // 玩家换三张
    __NET_playerSelect: function (msg) {
        cc.log("==> 玩家换三张：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var index = msg.playerIndex;
        var player = gameData.players[index];
        // 更新手牌

        if (index == gameData.playerIndex) {
            player.handCards = msg.handCards;
            // 关闭选牌确定面板
            var cp = this._ui.getConfirmPanel();
            cp.show(false);
        }else {
            // 其他玩家减少三张牌背
            player.handCards[100] -= 3;
        }
        this._updateUIHandCards(player);

        // 更新选牌状态
        var uiPlayer = this._ui.getPlayer(index);
        var status = index == gameData.playerIndex ? 3 : 2;
        uiPlayer.setStatus(status);
    },

    // 结束选牌
    __NET_endSelect: function (msg) {
        cc.log("==> 结束选三张：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var type = msg.swapType;
        var getCards = msg['getCards'][gameData.playerIndex];

        // 重新同步手牌数据
        var players = gameData.players;
        for (var key in players) {
            if (players.hasOwnProperty(key)) {
                if (key == gameData.playerIndex) {
                    players[key].handCards = msg.handCards;
                } else {
                    if (key == msg.dealerIndex) {
                        players[key].handCards = {100 : 14};
                    } else {
                        players[key].handCards = {100 : 13};
                    }
                }
            }
        }

        // 换牌方向动画播放回调
        var call = function () {
            // 更新所有玩家手牌UI
            var indexArray = gameData.getAllPlayerIndex();
            for (var i = 0; i < indexArray.length; ++i) {
                var player = gameData.players[indexArray[i]];
                this._updateUIHandCards(player);
            }
            // 显示换过来的三张牌
            var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
            var hc = uiPlayer.getHandCards();
            hc.showSelectedCards(getCards);
            // 显示换牌信息按钮
            this._ui.showBtnHP(true);
        }.bind(this);

        // 显示换牌面板
        game.Procedure.pauseNetMessageDispatch();
        var huan = this._ui.getHuanPanel();
        huan.showEff(type, function () {
            call();
            game.Procedure.resumeNetMessageDispatch();
        }.bind(this));

        // 隐藏确定换三张面板
        var cp = this._ui.getConfirmPanel();
        cp.reset();

        // 隐藏玩家选牌状态
        this._ui.hideStatus();
    },
    // 开始定缺
    __NET_startDQ: function (msg) {
        cc.log("==> 开始定缺：" + JSON.stringify(msg));
        var type = msg.bestType;
        var gameData = game.procedure.Mahjong.getGameData();
        // 显示定缺按钮
        var dq = this._ui.getDQSelect();
        dq.clickTong(this._BTN_DQ.bind(this));
        dq.clickTiao(this._BTN_DQ.bind(this));
        dq.clickWan(this._BTN_DQ.bind(this));
        dq.showBestType(type);
        // 玩家显示定缺状态
        var indexArr = gameData.getAllPlayerIndex();
        for (var i = 0; i < indexArr.length; ++i) {
            if (indexArr[i] == gameData.playerIndex) {
                continue;
            }
            var uiPlayer = this._ui.getPlayer(indexArr[i]);
            uiPlayer.setStatus(4);
        }

        // 倒计时结束自动隐藏换牌面板
        var huan = this._ui.getHuanPanel();
        huan.reset();


    },
    // 玩家请求定缺
    __NET_playerDQ: function (msg) {
        cc.log("==> 玩家定缺：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        // 显示已定缺
        var uiPlayer = this._ui.getPlayer(index);
        uiPlayer.setStatus(5);
    },
    // 结束定缺
    __NET_endDQ: function (msg) {
        cc.log("==> 结束定缺：" + JSON.stringify(msg));
        var data = msg.data;
        var players = game.procedure.Mahjong.getGameData().players;
        // 隐藏状态l
        this._ui.hideStatus();
        // 玩家显示定缺的
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                players[key].dqType = data[key];
                this._ui.getPlayer(key).setDQWithAct(data[key]);
            }
        }
        // 开始出牌
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.getMainPlayer();
        var hc = this._ui.getPlayer(gameData.playerIndex).getHandCards();
        var cards = hc.getCardsValues();
        cards = GameDataMahjong.Helper.handCardsSort(cards, player.dqType);
        hc.setCardsValues(cards, player.dqType);
        hc.switchTouchMode(1);

        // 结束定缺隐藏操作按钮
        var dq = this._ui.getDQSelect();
        dq.reset();
    },
    // 是否已经听牌
    __NET_haveTing: function (msg) {
        cc.log("==> 听：" + JSON.stringify(msg));
        var haveTing = msg.haveTing;
        var gameData = game.procedure.Mahjong.getGameData();
        this._ui.showBtnTip(gameData.gameType == 8 && haveTing);
    },
    // 检测听
    __NET_checkTing: function (msg) {
        cc.log("==> 检测听：" + JSON.stringify(msg));
        var data = msg.data;
        if (data == -1) {
            return;
        }
        var tipHuWindow = this._ui.getHuTipWindow();
        if (tipHuWindow.isShow()) {
            tipHuWindow.show(false);
            return;
        }
        tipHuWindow.loadView(data);
        tipHuWindow.show(true);
    },
    // 换牌信息
    __NET_hpInfo: function (msg) {
        cc.log("==> 换牌信息：" + JSON.stringify(msg));
        var hp = this._ui.getHPInfo();
        hp.setInfo(msg);
        hp.show(true);
    },
    // 对局流水
    __NET_billInfo: function (msg) {
        cc.log("==> 对局流水：" + JSON.stringify(msg));
        if (GameWindowMahjong.BillWin.inst) {
            GameWindowMahjong.BillWin.inst.close();
        }
        GameWindowMahjong.BillWin.popup(msg);
    },
    // 下一局消息
    __NET_showNext: function (msg) {
        cc.log("==> 显示下一局消息：" + JSON.stringify(msg));
        if (msg.readyBtn) {
            var gameData = game.procedure.Mahjong.getGameData();
            gameData.updateEndRound();
            this._resetPreBegin();
        }else {
            this._ui.showNext(true);
        }
    },
    // 玩家出局消息
    __NET_playerOut: function (msg) {
        cc.log("==> 玩家出局消息：" + JSON.stringify(msg));
        var index = msg.playerIndex;
        var uiPlayer = this._ui.getPlayer(index);
        uiPlayer.showOut(true);
    },
    // 退税消息
    __NET_tuiShui: function (msg) {
        cc.log("==> 退税消息：" + JSON.stringify(msg));
        var players = msg.playerInfo;

        for (var index in players) {
            if (players.hasOwnProperty(index)) {
                var cards = players[index].handCards;
                var huCard = players[index].huCard;
                var uiPlayer = this._ui.getPlayer(index);
                var uiHandCards = uiPlayer.getHandCards();
                var cardsArray = GameDataMahjong.Helper.handCardsObjToArray(cards);
                cardsArray = GameDataMahjong.Helper.handCardsSort(cardsArray);
                uiHandCards.setCardsValues(cardsArray);
                if (huCard != null) {
                    uiHandCards.addNewCard(huCard);
                }
                uiHandCards.doOffset();

                var status = players[index]['showStatus'];
                if (status == 2) {
                    uiPlayer.setStatus(6);
                }else if (status == 3){
                    uiPlayer.setStatus(7);
                }else{
                    uiPlayer.setStatus(-1);
                }
            }
        }
        if (msg.hz) {
            this._ui.showEnd(2);
        }else {
            this._ui.showEnd(1);
        }

    },
    // 实时扣分
    __NET_showScore: function (msg) {
        cc.log("==> 实时算分消息：" + JSON.stringify(msg));
        var data = msg.realScore;

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] != 0) {
                    var uiPlayer = this._ui.getPlayer(key);
                    uiPlayer.setScoreWithAction(data[key]);
                }
            }
        }
    },
    // 删除胡牌（只有抢杠胡的时候才有）
    __NET_deleteCard: function (msg) {
        cc.log("==> 删除胡牌消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[msg.playerIndex];
        player.handCards = msg.handCards;
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        var uiHandCards = uiPlayer.getHandCards();

        if (player.index == gameData.playerIndex) {
            var cardsArray = GameDataMahjong.Helper.handCardsObjToArray(msg.handCards);
            cardsArray = GameDataMahjong.Helper.handCardsSort(cardsArray, player.dqType);
            uiHandCards.setCardsValues(cardsArray, player.dqType);
        }

    },

    __NET_addHuCard: function (msg) {
        cc.log("==> 添加胡牌消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[msg.playerIndex];
        player.handCards = msg.handCards;
        var uiPlayer = this._ui.getPlayer(msg.playerIndex);
        var uiHandCards = uiPlayer.getHandCards();

        if (player.index == gameData.playerIndex) {
            var cardsArray = GameDataMahjong.Helper.handCardsObjToArray(msg.handCards);
            cardsArray = GameDataMahjong.Helper.handCardsSort(cardsArray, player.dqType);
            uiHandCards.setCardsValues(cardsArray, player.dqType);
            uiHandCards.addNewCard(msg.huCard, player.dqType);
        }else {
            // var pos = uiPlayer.getDianWorldPos();
            // game.Procedure.pauseNetMessageDispatch();
            // GameEffectController.playGameEffect(this._ui, null, pos,
            //     GameEffectController.gameEffectType.MJDIAN, function () {
            //         game.Procedure.resumeNetMessageDispatch();
            //     });
            uiHandCards.addHuCard(msg.huCard);

        }
    },
    /**
     * 获取牌堆
     * @param msg
     * @private
     */
    __NET_cheatGetCards: function (msg) {
        cc.log("==> 获取牌堆：" + JSON.stringify(msg));
        CheatWindow.popup(msg.cards);
    },

    /**
     * 更新牌堆
     * @param msg
     * @private
     */
    __NET_cheatUpdateCards: function (msg) {
        cc.log("==> 更新牌堆：" + JSON.stringify(msg));
    },

    // /**
    //  * 解散房间请求消息
    //  * @param msg
    //  * @private
    //  */
    // __NET_OnReqDestroyRoom:function(msg){
    //     cc.log("解散房间请求：" + JSON.stringify(msg));
    //     var index = msg.playerIndex;
    //     var destroyTime = msg.destroyTime;  // 解散房间提交的服务器时间
    //     var durationTime = msg.duration;    // 最大等待时间
    //     GameWindowMahjong.Mahjong_WaitQuitWindow.popup(index);
    //     var destroyInst = GameWindowMahjong.Mahjong_WaitQuitWindow.inst;
    //     var serverTime = ServerDate.getOffsetTime(destroyTime + durationTime);
    //     destroyInst.StartTimer(Math.floor(serverTime * 0.001));
    // },
    // /**
    //  * 响应解散房间消息
    //  * @param msg
    //  * @private
    //  */
    // __NET_OnRespDestroyRoom:function(msg){
    //     cc.log("响应解散房间：" + JSON.stringify(msg));
    //     var win = GameWindowMahjong.Mahjong_WaitQuitWindow.inst;
    //     if(win!=null){
    //         cc.log("响应窗口存在");
    //         win.SetPlayerIsAgree(msg.playerIndex,msg.ok);
    //     }else{
    //         cc.log("面板异常为空了？");
    //     }
    // },
    // /**
    //  * 麻将场游戏没开始，房主退出房间，直接解散房间
    //  * @param msg
    //  * @private
    //  */
    // __NET_OnDestroyRoom:function(msg){
    //     cc.log("房主销毁游戏房间：" + JSON.stringify(msg));
    //     this.__exitGame();
    // },
    // /**
    //  * 解散房间最后投票结果
    //  * @param msg
    //  * @private
    //  */
    // __NET_OnDestroyRoom_Result:function(msg){
    //     cc.log("解散房间投票最后结果：" + JSON.stringify(msg));
    //     if(!msg.success){
    //         game.ui.HintMsg.showTipText( "有玩家不同意,2秒后关闭窗口！",cc.p(640, 360), 2);
    //         setTimeout(function(){
    //             GameWindowMahjong.Mahjong_WaitQuitWindow.inst._destroy();
    //         }.bind(this),2000);
    //     }else{
    //         //如果是同意，直接关闭
    //         GameWindowMahjong.Mahjong_WaitQuitWindow.inst._destroy();
    //     }
    // },

    /**
     * 报听消息
     * @param msg
     * @private
     */
    __NET_OnTing : function (msg) {
        cc.log("==> 麻将游戏 报听消息：" + JSON.stringify(msg));
        var tings = msg.tings;
        var cards = [];
        for (var key in tings) {
            if (tings.hasOwnProperty(key)) {
                cards.push(key);
            }
        }
        cc.log("==> 报听数组 " + cards);
        var gameData = game.procedure.Mahjong.getGameData();

        gameData.tings = msg.tings;
        var handCards = this._ui.getPlayer(gameData.playerIndex).getHandCards();
        handCards.showHuTipCards(cards);
    },
    /**
     * 开始新的一局
     * @param msg
     * @private
     */
    __NET_onStartNewRound : function (msg) {
        cc.log("==> 麻将游戏 新的一局消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        gameData.updateStartNewRound();

        gameData.dealerIndex = msg.dealerIndex;
        gameData.playStatus = msg.playStatus;
        gameData.gPlaying = msg.gPlaying || true;

        // 显示玩家
        var indexArray = gameData.getAllPlayerIndex();
        for (var i = 0; i < indexArray.length; ++i) {
            var uiPlayer = this._ui.getPlayer(indexArray[i]);
            uiPlayer.show(true);
            uiPlayer.showReady(false);
            uiPlayer.showDealer(indexArray[i] == gameData.dealerIndex);
        }

        this._updateRoomInfo();

        // 牌局号
        if (gameData.sceneMode == "JB") {
            this._ui.setRoomRoundID("牌局号:" + msg.roundId);
            this._ui.showCurRound(false);

            // 服务费信息
            var consume = msg.consume;
            if (consume != -1) {
                // game.ui.HintMsg.showTipText("本局服务费 -" + consume, cc.p(640, 120), 2, 0.6);
                this._ui.getConsumeTip().showCharge(consume);
            }

        }else if (gameData.sceneMode == "FK") {
            // this._ui.showCurRound(true);
            // this._ui.setCurRound(msg.curRound, gameData.round);
        }

        // 重置准备前的UI
        this._resetPreBegin();

        // 隐藏灯泡
        this._ui.showBtnTip(false);

        // 关闭提示窗口
        if (game.ui.TipWindow.inst) {
            game.UISystem.closeWindow(game.ui.TipWindow.inst)
        }

        // 显示东令
        this._ui.getDirectionOrder().showDirectionOrder(msg.season);

        // 播放开局特效
        game.Procedure.pauseNetMessageDispatch();
        GameEffectController.playGameEffect(this._ui, null, cc.p(640, 360),
            GameEffectController.gameEffectType.KaiJu, function () {
                game.Procedure.resumeNetMessageDispatch();
            });
    },

    /**
     * 开始上噶
     * @param msg
     * @private
     */
    __NET_startMultiple : function (msg) {
        cc.log("==> 麻将游戏 开始上噶消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        gameData.playStatus = msg.playStatus;

        var multiple = this._ui.getMultiple();
        multiple.setCurrentMultiple(-1);
        multiple.show(true);
    },

    /**
     * 有玩家上噶的通知
     * @param msg
     * @private
     */
    __NET_playerMultiple : function (msg) {
        cc.log("==> 麻将游戏 有玩家上噶消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[msg.playerIndex];
        player.multiple = msg.multiple;

        var uiPlayer = this._ui.getPlayer(player.index);
        uiPlayer.setMultiple(player.multiple);
        // 上噶音效
        game.Audio.MahjongPlayGaEffect(player.sex, player.multiple);
    },

    /**
     * 结束上噶
     * @param msg
     * @private
     */
    __NET_endMultiple : function (msg) {
        cc.log("==> 麻将游戏 结束上噶消息：" + JSON.stringify(msg));
        var result = msg.gaResult;
        var gameData = game.procedure.Mahjong.getGameData();
        for (var key in result) {
            if (result.hasOwnProperty(key)) {
                gameData.players[key].multiple = result[key];
                this._ui.getPlayer(+key).setMultiple(result[key]);
            }
        }

        // 隐藏上噶UI
        var multiple = this._ui.getMultiple();
        multiple.show(false);
    },

    /**
     * 发牌
     * @param msg
     * @private
     */
    __NET_initCards : function (msg) {
        cc.log("==> 麻将游戏 开始发牌消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        gameData.playStatus = msg.playStatus;
        // 存储玩家数据
        var players = gameData.players;
        for (var key in players) {
            if (players.hasOwnProperty(key)) {
                if (key == gameData.playerIndex) {
                    players[key].handCards = msg.handCards;
                } else {
                    if (key == gameData.dealerIndex) {
                        players[key].handCards = {100 : 14};
                    } else {
                        players[key].handCards = {100 : 13};
                    }
                }
            }
        }

        // 初始化手牌UI
        var indexArray = gameData.getAllPlayerIndex();
        for (var i = 0; i < indexArray.length; ++i) {
            var player = gameData.players[indexArray[i]];
            this._updateUIHandCards(player);
        }
    },

    /**
     * 公牌更新消息
     * @param msg
     * @private
     */
    __NET_publicCardsUpdate : function (msg) {
        cc.log("==> 麻将游戏 公牌更新消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        gameData.publicCardsNum = msg.publicCardsNum;

        this._updateRoomInfo();
    },

    /**
     * 设置当前操作的玩家
     * @param msg
     * @private
     */
    __NET_currentPlayer : function (msg) {
        cc.log("==> 麻将游戏 设置当前操作玩家消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        gameData.curPlayIndex = msg.curPlayIndex;
        gameData.lastPlayIndex = msg.lastPlayIndex;
        gameData.isPlayedCard = msg.isPlayedCard;

        var serverTime = 0;
        if (gameData.actionTimer) {
            serverTime = ServerDate.getOffsetTime(gameData.actionTimer.stamp + gameData.actionTimer.duration);
        }

        var uiDirection = this._ui.getDirection();
        uiDirection.setDirection(gameData.curPlayIndex, Math.floor(serverTime * 0.001));

        var uiPlayer = this._ui.getPlayer(gameData.curPlayIndex);
        var countDownClock = GameWindowBasic.PlayerClock.getController();
        countDownClock.addToNode(uiPlayer.getClockNode());

        var handCards = uiPlayer.getHandCards();
        handCards.setCardsTouch(gameData.curPlayIndex == gameData.playerIndex && !gameData.isPlayedCard);
    },

    /**
     * 玩家出牌
     * @param msg
     * @private
     */
    __NET_playCard : function (msg) {
        cc.log("==> 麻将游戏 玩家出牌的消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[msg.playerIndex];
        if (msg.result != 0) {
            player = gameData.getMainPlayer();
            if (msg.result == 36) {
                cc.log("出牌规则不符合");
                var uiHC = this._ui.getPlayer(gameData.curPlayIndex).getHandCards();
                uiHC.setCardsTouch(!gameData.isPlayedCard);
            }else if (msg.result == 92) {
                game.ui.HintMsg.showTipText("请先出定缺花色！", cc.p(640, 360), 2);
            }
            var myHC = this._ui.getPlayer(gameData.playerIndex).getHandCards();
            myHC.showAllCards();
            myHC.setCardsTouch(true);
            return;
        }
        // 同步最后一张出的牌
        gameData.lastPlayedCard = msg.card;
        // 同步玩家手牌
        if (player.index == gameData.playerIndex) {
            player.playedCards.push(msg.card);
            player.handCards = msg.handCards;
        }else {
            player.handCards[100] -= 1;
        }
        // 更新牌UI
        game.Procedure.pauseNetMessageDispatch();
        var uiPlayer = this._ui.getPlayer(player.index);
        // 出牌展示，桌牌UI
        uiPlayer.showPlayedCard(msg.card, function () {
            var uiTableCards = uiPlayer.getTableCards();
            uiTableCards.addCard(msg.card);
            game.Audio.MahjongClickCard();
            game.Procedure.resumeNetMessageDispatch();
        });
        // 手牌UI
        var uiHandCards = uiPlayer.getHandCards();
        var cardsArray = GameDataMahjong.Helper.handCardsObjToArray(player.handCards);
        if (player.index == gameData.playerIndex) {
            cardsArray = GameDataMahjong.Helper.handCardsSort(cardsArray, player.dqType);
            uiHandCards.setCardsTouch(false);
            uiHandCards.hideHuTipCards();
            this._ui.getHuTipWindow().show(false);
        }
        uiHandCards.setCardsValues(cardsArray, player.dqType);
        // 播放出牌音效
        game.Audio.MahjongPlayCardEffect(player.sex, msg.card);
    },

    /**
     * 玩家摸牌
     * @param msg
     * @private
     */
    __NET_newCard : function (msg) {
        cc.log("==> 麻将游戏 玩家摸牌消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[msg.playerIndex];

        var uiPlayer = this._ui.getPlayer(player.index);
        var uiHandCards = uiPlayer.getHandCards();

        // ui同步
        if (player.index == gameData.playerIndex) {
            player.handCards = msg.handCards; // 此处同步不包括新摸的牌
            var cardsArray = GameDataMahjong.Helper.handCardsObjToArray(player.handCards);
            cardsArray = GameDataMahjong.Helper.handCardsSort(cardsArray, player.dqType);
            // 自己摸牌，先重置一下手牌
            uiHandCards.setCardsValues(cardsArray, player.dqType);
            // 然后增加新摸的牌
            uiHandCards.addNewCard(msg.card, player.dqType);
        }else {
            uiHandCards.addNewCard(100);
        }

        // 数据同步
        var handCards = player.handCards;
        if (player.index == gameData.playerIndex) {
            if (handCards.hasOwnProperty(msg.card)) {
                handCards[msg.card]++;
            } else {
                handCards[msg.card] = 1;
            }
        } else {
            handCards[100]++;
        }
    },

    /**
     * 玩家补花
     * @param msg
     * @private
     */
    __NET_flowerCard : function (msg) {
        cc.log("==> 麻将游戏 玩家补花消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[msg.playerIndex];
        var uiPlayer = this._ui.getPlayer(player.index);

        // 更新手牌UI
        if (player.index == gameData.playerIndex) {
            player.handCards = msg.handCards;
        } else {
            player.handCards[100]--;
        }
        var uiHandCards = uiPlayer.getHandCards();
        var cardsArray = GameDataMahjong.Helper.handCardsObjToArray(player.handCards);
        if (player.index == gameData.playerIndex) {
            cardsArray = GameDataMahjong.Helper.handCardsSort(cardsArray);
        }
        uiHandCards.setCardsValues(cardsArray);

        // 更新花牌UI
        var flowerCards = player.flowerCards;
        flowerCards.push(+msg.card);
        var uiFlowerCards = uiPlayer.getFlowerCards();
        uiFlowerCards.setCardsValues(player.flowerCards);

        // 播放补花效果
        game.Procedure.pauseNetMessageDispatch();
        GameEffectController.playGameEffect(this._ui, null, uiPlayer.getEffectWorldPos(),
            GameEffectController.gameEffectType.MJBuHua, function () {
                game.Procedure.resumeNetMessageDispatch();
            });

        // 音效
        game.Audio.MahjongPlayFlowerEffect(player.sex);
    },

    /**
     * 玩家吃牌
     * @param msg
     * @private
     */
    __NET_playerChi : function (msg) {
        cc.log("==> 麻将游戏 玩家吃牌消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[msg.playerIndex];
        var targetPlayer = gameData.players[msg.targetIndex];

        var chiCards = player.chiCards;
        chiCards.push({cards : Utils.clone(msg.cards), target : msg.targetIndex});
        targetPlayer.playedCards.pop();

        // 更新手牌UI
        if (player.index == gameData.playerIndex) {
            player.handCards = msg.handCards;
        } else {
            player.handCards[100] -= 2;
        }
        // 该玩家吃了牌，那么就是该该玩家操作，避免手牌阻挡问题
        gameData.curPlayIndex = player.index;
        this._updateUIHandCards(player);

        // 更新桌牌UI
        var uiTableCards = this._ui.getPlayer(targetPlayer.index).getTableCards();
        uiTableCards.removeLastCard();

        // 更新吃碰杠牌UI
        var uiPlayer = this._ui.getPlayer(player.index);
        var userCards = uiPlayer.getUserCards();
        userCards.addChiCards(Utils.clone(msg.cards), msg.targetIndex);

        // 播放吃效果
        game.Procedure.pauseNetMessageDispatch();
        GameEffectController.playGameEffect(this._ui, null, uiPlayer.getEffectWorldPos(),
            GameEffectController.gameEffectType.MJChi, function () {
                game.Procedure.resumeNetMessageDispatch();
            });
        // 音效
        game.Audio.MahjongPlayChiEffect(player.sex);
    },

    /**
     * 玩家碰牌
     * @param msg
     * @private
     */
    __NET_playerPeng : function (msg) {
        cc.log("==> 麻将游戏 玩家碰牌消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[msg.playerIndex];
        var targetPlayer = gameData.players[msg.targetIndex];
        var pengCards = player.pengCards;
        pengCards.push({cards : [msg.card, msg.card, msg.card], target : msg.targetIndex});
        targetPlayer.playedCards.pop();

        // 更新手牌UI
        if (player.index == gameData.playerIndex) {
            player.handCards = msg.handCards;
        } else {
            player.handCards[100] -= 2;
        }
        // 该玩家碰了牌，那么就是该该玩家操作，避免手牌阻挡问题
        gameData.curPlayIndex = player.index;
        this._updateUIHandCards(player);

        // 更新桌牌UI
        var uiTableCards = this._ui.getPlayer(targetPlayer.index).getTableCards();
        uiTableCards.removeLastCard();

        // 更新吃碰杠牌UI
        var uiPlayer = this._ui.getPlayer(player.index);
        var userCards = uiPlayer.getUserCards();
        userCards.addPengCards([msg.card, msg.card, msg.card], msg.targetIndex);

        // 播放碰特效
        game.Procedure.pauseNetMessageDispatch();
        GameEffectController.playGameEffect(this._ui, null, uiPlayer.getEffectWorldPos(),
            GameEffectController.gameEffectType.MJPeng, function () {
                game.Procedure.resumeNetMessageDispatch();
            });

        // 音效
        game.Audio.MahjongPlayPengEffect(player.sex);
    },

    /**
     * 玩家杠牌
     * @param msg
     * @private
     */
    __NET_playerGang : function (msg) {
        cc.log("==> 麻将游戏 玩家杠牌消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[msg.playerIndex];
        var targetPlayer = gameData.players[msg.targetIndex];
        var gangCards = player.gangCards;
        gangCards.push({cards : [msg.card, msg.card, msg.card, msg.card], type : msg.type, target : msg.targetIndex});

        // 更新手牌UI
        if (player.index == gameData.playerIndex) {
            player.handCards = msg.handCards;
            if (msg.type == 2) {
                targetPlayer.playedCards.pop();
            }
        } else {
            if (msg.type == 1) {
                // 暗杠 减少四张手牌
                player.handCards[100] -= 4;
            } else if (msg.type == 2) {
                // 明杠 减少三张手牌
                player.handCards[100] -= 3;
                targetPlayer.playedCards.pop();
            } else {
                // 巴杠 用一张手牌
                player.handCards[100] -= 1;
            }
        }
        // 该玩家杠了牌，那么就是该该玩家操作，避免手牌阻挡问题
        gameData.curPlayIndex = player.index;
        this._updateUIHandCards(player);

        // 更新桌牌UI
        if (msg.type == 2) {
            var uiTableCards = this._ui.getPlayer(targetPlayer.index).getTableCards();
            uiTableCards.removeLastCard();
        }

        // 更新吃碰杠牌UI
        var uiPlayer = this._ui.getPlayer(player.index);
        var userCards = uiPlayer.getUserCards();
        userCards.addGangCards([msg.card, msg.card, msg.card, msg.card], msg.type, msg.targetIndex);


        // 播放杠特效
        var effType = GameEffectController.gameEffectType.MJGang;
        if (gameData.gameType == 8) {
            if (msg.type == 1) {
                effType = GameEffectController.gameEffectType.MJRAIN;
            }else {
                effType = GameEffectController.gameEffectType.MJWIND
            }
        }

        game.Procedure.pauseNetMessageDispatch();
        GameEffectController.playGameEffect(this._ui, null, uiPlayer.getEffectWorldPos(), effType, function () {
                game.Procedure.resumeNetMessageDispatch();
        });

        // 音效
        if (gameData.gameType == 1) {
            game.Audio.MahjongPlayGangEffect(player.sex);
        }else {
            game.Audio.MahjongPlayGangEffect(player.sex, msg.type);
        }
    },

    /**
     * 玩家胡牌
     * @param msg
     * @private
     */
    __NET_playerHu : function (msg) {
        cc.log("==> 麻将游戏 玩家胡牌消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[msg.playerIndex];
        var order = msg.huOrder;
        player.huCard = msg.card;

        var uiPlayer = this._ui.getPlayer(player.index);
        // 显示胡牌顺序
        uiPlayer.showHuOrder(order, msg.playerIndex, msg.targetIndex);
        // 关闭手牌点击
        uiPlayer.getHandCards().setCardsTouch(false);
        // 播放胡牌音效
        var audioType = 1;
        var effType = GameEffectController.gameEffectType.MJHu;
        if (msg.playerIndex == msg.targetIndex) {
            audioType = 2;
            effType = GameEffectController.gameEffectType.MJZiMo;
        }else {
            // 移除目标出的牌
            var uiTableCards = this._ui.getPlayer(msg.targetIndex).getTableCards();
            uiTableCards.removeLastCard();
        }
        game.Audio.MahjongPlayHuEffect(player.sex, audioType);

        // 播放胡牌特效
        game.Procedure.pauseNetMessageDispatch();
        var pos = uiPlayer.getEffectWorldPos();
        GameEffectController.playGameEffect(this._ui, null, cc.pAdd(pos, cc.p(0, 100)),
            GameEffectController.gameEffectType.MJDIAN, null);

        GameEffectController.playGameEffect(this._ui, null, pos, effType, function () {
            game.Procedure.resumeNetMessageDispatch();
        });


    },

    /**
     * 玩家过
     * @param msg
     * @private
     */
    __NET_playerPass : function (msg) {
        cc.log("==> 麻将游戏 玩家过消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[msg.playerIndex];

        player.hangupTasks = {};

        if (player.index == gameData.playerIndex) {
            var ht = this._ui.getHangupTasks();
            ht.reset();
        }
    },

    /**
     * 服务器挂起事件
     * @param msg
     * @private
     */
    __NET_playerHangupTasks : function (msg) {
        cc.log("==> 麻将游戏 挂起事件消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.getMainPlayer();

        gameData.isExistHangupTasks = true;

        player.hangupTasks = msg.tasks;

        if (Object.keys(player.hangupTasks).length > 0) {
            // 显示挂起事件
            var ht = this._ui.getHangupTasks();
            ht.showBtnInfo(player.hangupTasks);
        } else {
            // 给出等待玩家操作提示
        }

        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        var handCards = uiPlayer.getHandCards();
        handCards.setCardsTouch(false);
    },

    /**
     * 服务器挂起事件结束
     * @param msg
     * @private
     */
    __NET_playerHangupTasksEnd : function (msg) {
        cc.log("==> 麻将游戏 挂起事件结束消息：" + JSON.stringify(msg));
        var gameData = game.procedure.Mahjong.getGameData();
        var players = gameData.players;
        for (var key in players) {
            if (players.hasOwnProperty(key)) {
                players[key].hangupTasks = {};
            }
        }

        gameData.isExistHangupTasks = false;

        var ht = this._ui.getHangupTasks();
        ht.reset();

        // 设置当前操作的玩家
        var uiPlayer = this._ui.getPlayer(gameData.playerIndex);
        var handCards = uiPlayer.getHandCards();
        handCards.setCardsTouch(gameData.curPlayIndex == gameData.playerIndex && !gameData.isPlayedCard);
    },

    /**
     * 托管状态变化消息
     * @param msg
     * @private
     */
    __NET_onTrusteeship : function (msg) {
        var index = msg.playerIndex;
        var isTrusteeship = msg.isT;

        var gameData = game.procedure.Mahjong.getGameData();
        var player = gameData.players[index];
        player.isTrusteeship = isTrusteeship;

        if (player.index == gameData.playerIndex) {
            // 本玩家
            // 执行托管状态按钮的隐藏和显示
            this._ui.showTrusteeshipCancelBtn(player.isTrusteeship);
        }
    },

    /**
     * 房间内玩家资源发生变动消息
     * @param msg
     * @private
     */
    __NET_GameRoomResourceUpdate : function (msg) {
        cc.log("==> 麻将游戏 玩家资源变动消息：" + JSON.stringify(msg));
        var playerObj = msg.players;
        var reason = msg.reason;
        var gameData = game.procedure.Mahjong.getGameData();
        var players = gameData.players;

        for (var index in playerObj) {
            if (playerObj.hasOwnProperty(index)) {
                var bean = playerObj[index].bean;
                var card = playerObj[index].card;
                players[index].bean = bean;
                players[index].card = card || 0;
                var uiPlayer = this._ui.getPlayer(index);
                uiPlayer.setBean(bean);
                if (+index == gameData.playerIndex && (reason == 10 || reason == 11 || reason == 24)) {
                    // game.ui.RechargeHint.close();
                }
            }
        }
    },
    /**
     * 服务器倒计时时间
     * @param msg
     * @private
     */
    __NET_ActionTimer : function (msg) {
        cc.log("==> 麻将游戏 倒计时时间消息:" + JSON.stringify(msg));
        var action = msg.action;        // 0 没有操作
        var stamp = msg.stamp;          // 开始时间
        var duration = msg.duration;    // 持续时间
        // var users = msg.users;

        var gameData = game.procedure.Mahjong.getGameData();
        // 没有操作
        if (action == 0) {
            cc.log("没有对应的操作");
            return;
        } else if (action == 1) {
            // 准备倒计时
            gameData.getMainPlayer().actionTimer = msg;
            return;
        }

        gameData.actionTimer = msg;

        var serverTime = ServerDate.getOffsetTime(stamp + duration);
        var uiDirection = this._ui.getDirection();
        uiDirection.setDirection(gameData.curPlayIndex, Math.floor(serverTime * 0.001));

        if (action == 803 || action == 804) {
            var countDownClock = GameWindowBasic.PlayerClock.getController();
            countDownClock.start(Math.floor(serverTime * 0.001), duration * 0.001);
            countDownClock.show(true);
        }

        if (action == 801) {
            var cp = this._ui.getConfirmPanel();
            cp.startTimer(Math.floor(serverTime * 0.001));
        }
    },

    /**
     * 单局结算
     * @param msg
     * @private
     */
    __NET_RoundSettlement : function (msg) {
        cc.log("==> 麻将游戏 单局结算消息" + JSON.stringify(msg));
        // 重置方位计时器
        this._ui.getDirection().reset();
        // 重置公牌信息
        this._ui.getPublicCards().reset();
        // 重置挂起任务
        this._ui.getHangupTasks().reset();
        // 重置令显示
        this._ui.getDirectionOrder().reset();
        // 重置玩家
        this._resetPlayers();
        // 重置准备按钮
        this._resetPreBegin();
        var gameData = game.procedure.Mahjong.getGameData();

        if (msg.finalRound) {
            gameData.gPlaying = false;
            cc.log("最后一局！");
        }

        if (gameData.subType == 1) {
            // 二人麻将
            GameWindowMahjongEr.RoundSettlement.popup(msg, this._BTN_Next.bind(this), this._BTN_Share, this._BTN_Exit);
        } else {
            // 四人麻将
            GameWindowMahjong.RoundSettlement.popup(msg, this._BTN_Next.bind(this), this._BTN_Share, this._BTN_Exit);
        }
        gameData.updateEndRound();
    },

    /**
     * 房卡场最终局结算数据
     * @param msg
     * @private
     */
    __NET_endSettlement: function (msg) {
        cc.log("==> 最终局结算数据: " + JSON.stringify(msg));
        GameWindowMahjongEr.RoundSettlement.close();
        GameWindowMahjong.RoundSettlement.close();
        GameWindowMahjong.Settlement.popup(msg,this._BTN_Share.bind(this));
    },

    /**
     * 重写玩家加入消息
     * @param msg
     * @private
     */
    __NET_onPlayerAdd: function (msg) {
        this._super(msg);
        var gameData = game.procedure.Mahjong.getGameData();
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
    __NET_onPlayerReady : function(msg) {
        this._super(msg);
        var gameData = game.procedure.Mahjong.getGameData();
        if (gameData.sceneMode == "FK") {
            if (gameData.isCreator()) {
                this._ui.getPreBegin().setBeginEnabled(gameData.checkReady());
            }

            // 准备就关闭准备按钮
            if (msg.playerIndex == gameData.playerIndex) {
                this._ui.getPreBegin().show(false);

                if (gameData.gameType == 8) {
                    // 重置方位计时器
                    this._ui.getDirection().reset();
                    // 重置公牌信息
                    this._ui.getPublicCards().reset();
                    // 重置挂起任务
                    this._ui.getHangupTasks().reset();
                    // 重置令显示
                    this._ui.getDirectionOrder().reset();
                    // 重置玩家
                    this._resetPlayers();
                    // 胡牌提示按钮隐藏
                    this._ui.showBtnTip(false);
                    // 隐藏对局结束
                    this._ui.showEnd(-1);
                    // 隐藏胡牌提示
                    var huTip = this._ui.getHuTipWindow();
                    huTip.reset();
                    // 隐藏倒计时
                    this._resetClock();
                }
            }


        }

    },

    /**
     * 玩家离开房间消息
     * @param msg
     * @private
     */
    __NET_onPlayerLeave : function(msg) {
        // this._super(msg);
        var index = msg.playerIndex;
        var gameData = game.Procedure.getProcedure().getGameData();

        if (index == gameData.playerIndex) {
            this.__exitGame();
            return;
        }
        // 血战麻将金币场不能删，其他玩家离开要删除
        var uiPlayer = this._ui.getPlayer(index);
        if (gameData.gameType == 8 && gameData.sceneMode == "JB") {
            if (!gameData.playing) {
                delete gameData.players[index];
                uiPlayer && uiPlayer.setInfo(-1);
            }
        }else {
            delete gameData.players[index];
            uiPlayer && uiPlayer.setInfo(-1);
        }

        if (gameData.sceneMode == "FK") {
            if (gameData.isCreator()) {
                this._ui.getPreBegin().setBeginEnabled(gameData.checkReady());
            }
        }
    }
});

// ==== 麻将游戏 逻辑状态 =========================================
GameLogicMahjong.Status = {
    NONE        : 0,        // 无状态
    READY       : 1,        // 玩家匹配准备状态
    MULTIPLE    : 2,        // 上噶状态
    PLAYING     : 3         // 正式开打状态
};