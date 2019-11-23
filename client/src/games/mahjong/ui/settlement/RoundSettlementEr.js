/**
 * Created by pander on 2018/5/25.
 */
// ==== 麻将游戏 二人麻将 结算界面(除了加载的资源不一样，玩家人数不一样，其他的几乎和四人麻将逻辑一样) =============================================================
GameWindowMahjongEr.RoundSettlement = game.ui.PopupWindow.extend({
    _node               : null,         // 本节点

    _imgTitleWinner     : null,         // 赢标题r
    _imgTitleLoser      : null,         // 输标题
    _imgTitlePing       : null,         // 平局标题

    _labelModuleDescribe    : null,     // 当局说明文字

    _imgDirectionOrder  : null,         // 令图片

    _btnLeave           : null,         // 离开按钮
    _btnShare           : null,         // 分享按钮
    _btnNext            : null,         // 下一局按钮
    _labelCountDown     : null,         // 下一局倒计时文本
    _btnEnd             : null,         // 牌局结束按钮
    // _handlerNext        : null,         // 下一局按钮回调

    _playersInfo        : [],           // 玩家信息
    _currentTime        : 0,            // 当前倒计时时间
    _labelRoundInfo     : null,         // 牌局详情

    ctor : function () {
        this._super();
        this._node = ccs.load("res/Games/Mahjong/Settlement/RoundSettlementWindowEr.json").node;
        this._init();
        this.addChild(this._node);
        return true;
    },

    _init : function () {
        var uiNode = game.findUI(this._node, "ND_PopWin");
        this._imgTitleWinner = game.findUI(uiNode, "IMG_TitleWinner");
        this._imgTitleLoser = game.findUI(uiNode, "IMG_TitleLoser");
        this._imgTitlePing = game.findUI(uiNode, "IMG_TitlePing");
        this._labelModuleDescribe = game.findUI(uiNode, "TXT_ModuleDescribe");
        this._imgDirectionOrder = game.findUI(uiNode, "IMG_DirectionOrder");

        this._btnNext = game.findUI(uiNode, "BTN_Next");
        this._btnShare = game.findUI(uiNode, "BTN_Share");
        this._btnLeave = game.findUI(uiNode, "BTN_Leave");
        this._btnEnd = game.findUI(uiNode, "BTN_End");
        this._labelCountDown = game.findUI(this._btnLeave, "TXT_CountDown");
        this._labelRoundInfo = game.findUI(uiNode, "TXT_RoundInfo");
        this._btnEnd.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.gameNet.sendMessage(protocol.ProtoID.GAME_END_ROUND_DATA, {
                    uid: game.DataKernel.uid,
                    roomId: game.DataKernel.roomId
                });
            }
        }, this);

        this.showBtnLeave(true);
        this.showBtnEnd(false);


        this._playersInfo = [];
        for (var i = 1; i < 3; ++i) {
            var uiPlayerInfo = new GameWindowMahjong.RoundSettlementPlayer(game.findUI(uiNode, "ND_Player" + i));
            uiPlayerInfo.reset();
            this._playersInfo.push(uiPlayerInfo);
        }
    },

    reset : function () {
        this._showWinnerTitle(-1);
        this._setLabelDescribe();
    },

    /**
     * 设置结算信息
     * @param infoData
     */
    setInfo : function (infoData) {
        this.reset();
        var gameData = game.procedure.Mahjong.getGameData();
        var roomInfo = infoData.roomInfo;
        this._setLabelDescribe(roomInfo.options);

        var playersInfo = infoData.playerInfo;

        this._showWinnerTitle(playersInfo[gameData.playerIndex].realScore);

        for (var i = 1; i < 3; ++i) {
            var player = playersInfo[i];
            var uiPlayer = this._playersInfo[i - 1];
            if (player) {
                // uiPlayer.reset();
                uiPlayer.setInfo(player, roomInfo.huIdx, roomInfo.huMj);
                uiPlayer.show(true);
            } else {
                uiPlayer.show(false);
            }
        }

        if (roomInfo.season != -1) {
            var path = "res/Games/Mahjong/Images/DirectionOrder";
            this._imgDirectionOrder.setVisible(true);
            this._imgDirectionOrder.loadTexture(path + (roomInfo.season + 1) + ".png");
        }
        //等于-1表示没有令 那么要隐藏默认的UI
        if(roomInfo.season == -1){
            this._imgDirectionOrder.setVisible(false);
        }
        if (gameData.sceneMode == "JB") {
            this._currentTime = 15;
            this._updateCountDown();
            this._btnLeave.stopAllActions();
            this._btnLeave.runAction(cc.sequence(cc.delayTime(1.0), cc.CallFunc(this._updateCountDown, this)).repeatForever());

            this.showBtnLeave(true);
        }else if (gameData.sceneMode == "FK") {
            var date = new Date(roomInfo.endTime * 1000);
            var time = date.format("yyyy-MM-dd hh:mm");
            var str = "" + time + "\n";
            str += "牌局号: " + roomInfo.roundId + "\n";
            str += "房间: " + gameData.roomId;
            this._labelRoundInfo.setString(str);

            this.showBtnLeave(false);
            this.showBtnEnd(infoData.finalRound);
        }
    },

    /**
     * 更新倒计时
     * @private
     */
    _updateCountDown : function () {
        if (this._currentTime < 0) {
            this._currentTime = 0;
            this.close();
            this._btnLeave.stopAllActions();
            // 执行下一局回调
            // this._handlerNext && this._handlerNext();
            this._doExit();
        }
        var str = "(";
        if (this._currentTime < 10) {
            str = "(0";
        }
        this._labelCountDown.setString(str + this._currentTime + ")");
        this._currentTime--;
    },

    /**
     * 绑定下一局按钮点击回调
     * @param callback
     */
    onNextClicked : function (callback) {
        // this._handlerNext = callback;
        this._btnNext.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._btnLeave.stopAllActions();
                callback && callback();
            }
        }, this);
    },

    /**
     * 绑定分享按钮点击回调
     * @param callback
     */
    onShareClicked : function (callback) {
        this._btnShare.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    /**
     * 绑定离开按钮点击回调
     * @param callback
     */
    onLeaveClicked : function (callback) {
        this._btnLeave.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                // callback && callback();
                this._doExit();
            }
        }, this);
    },
    /**
     * 显示结束牌局按钮
     */
    showBtnEnd: function (show) {
        this._btnEnd.setEnabled(show);
        this._btnEnd.setVisible(show);
        this._btnNext.setEnabled(!show);
        this._btnNext.setVisible(!show);
    },

    /**
     * 显示离开按钮
     * @param show
     */
    showBtnLeave: function (show) {
        this._btnLeave.setEnabled(show);
        this._btnLeave.setVisible(show);
        this._labelRoundInfo.setVisible(!show);
    },
    /**
     * 设置单局结算描述
     * @param option
     * @private
     */
    _setLabelDescribe : function (option) {
        option = option || {};
        this._labelModuleDescribe.setString(GameDataMahjong.Helper.getRoundSettlementDescribe(option));
    },

    /**
     * 显示赢标题
     * @param score
     * @private
     */
    _showWinnerTitle : function (score) {
        this._imgTitleWinner.setVisible(false);
        this._imgTitleLoser.setVisible(false);
        this._imgTitlePing.setVisible(false);
        if (score > 0) {
            this._imgTitleWinner.setVisible(true);
        }else if (score < 0) {
            this._imgTitleLoser.setVisible(true);
        }else if (score == 0) {
            this._imgTitlePing.setVisible(true);
        }
    },
    _doExit: function() {
        game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_QUIT_ROOM, {
            uid : game.DataKernel.uid,
            roomId : game.DataKernel.roomId
        });
    },
    /**
     * 关闭窗口
     */
    close : function () {
        game.UISystem.closePopupWindow(this);
    }
});

GameWindowMahjongEr.RoundSettlement._instance = null;

GameWindowMahjongEr.RoundSettlement.close = function () {
    if (this._instance) {
        this._instance.close();
    }
};
/**
 * 弹出单局结算界面
 * @param infoData          结算信息
 * @param nextCallback      下一局按钮点击回调
 * @param shareCallback     分享按钮点击回调
 * @param leaveCallback     离开按钮点击回调
 */
GameWindowMahjongEr.RoundSettlement.popup = function (infoData, nextCallback, shareCallback, leaveCallback) {
    if (this._instance == null) {
        this._instance = new GameWindowMahjongEr.RoundSettlement();
        this._instance.retain();
    }
    this._instance.onNextClicked(nextCallback);
    this._instance.onShareClicked(shareCallback);
    this._instance.onLeaveClicked(leaveCallback);
    this._instance.setInfo(infoData);
    game.UISystem.popupWindow(this._instance);
};