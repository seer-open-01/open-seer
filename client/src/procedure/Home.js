// ==== 主流程控制 =============================================================================
game.procedure.Home = {

    _ui             : null,             // 大厅的UI界面对象  单例

    enter : function () {
        cc.log("=== 进入大厅流程 ===");

        game.Procedure.onAndroidReturnClicked(this._BTN_Back);

        // 播放背景音乐
        game.Audio.playHomeBGMusic();

        // 绑定大厅处理函数
        game.hallNet.onMsgDispatchHandler(this.disposeMessage.bind(this));
        game.hallNet.onReconnectCallback(this._doReconnected.bind(this));
        game.gameNet.onDisconnectCallback(this._gameDisconnected.bind(this));

        // 初始化界面
        if (this._ui == null) {
            this._ui = new game.ui.HomeWindow();
        }

        game.UISystem.switchUI(this._ui);

        this._init();
        this._ui.playEnterAnimation();
        this._ui.playWindowEffectAnimation();

        // 弹出绑定账户的窗口
        if (game.DataKernel.needSeer()) {
            game.ui.Account.popup();
        }

        // 弹出绑定推广的窗口
        if (game.DataKernel.needBind() && !game.DataKernel.needSeer()) {
            game.ui.BindWindow.popup();
        }

        game.UISystem.hideLoading();
    },

    leave: function () {
        cc.log("=== 离开大厅流程 ===");
        if (cc.sys.os != "Windows") {
            cc.textureCache.removeUnusedTextures();
        }
    },

    update: function (dt) {},

    /**
     * 初始化界面
     * @private
     */
    _init : function () {
        // 绑定函数
        var uiTop = this._ui.getTopUI();
        var uiLeft = this._ui.getLeftUI();
        var uiRight = this._ui.getRightUI();
        var uiBottom = this._ui.getBottomUI();

        uiTop.onHeadClicked(this._BTN_HeadPic);
        uiTop.onAddClicked(this._BTN_Shop, function () {
            game.Audio.playBtnClickEffect();
            game.ui.BankWin.popup();
        });
        uiTop.btn_0(this._BTN_Share.bind(this));
        uiTop.btn_1(this._BTN_Bind);
        uiTop.btn_2(this._BTN_Wheel);
        uiTop.btn_3(this._BTN_Set);

        uiBottom.btn_0(this._BTN_Shop);
        uiBottom.btn_1(this._BTN_Task.bind(this));
        uiBottom.btn_2(this._BTN_ZhanJi);
        uiBottom.btn_3(this._BTN_Mail.bind(this));
        uiBottom.btn_4(this._BTN_Help);
        // uiBottom.btn_5(this._BTN_Friend);
        uiBottom.btn_6(this._BTN_Bank);
        uiBottom.btn_7(this._BTN_TuiG);

        uiLeft.onRankListClicked(this._BTN_Rank);
        uiLeft.onHornClick(this._BTN_Horn);
        uiLeft.onLbClick(this._BTN_Lb.bind(this));

        uiRight.onMaJiangClicked(this._BTN_Game.bind(this));
        uiRight.onPinShiClicked(this._BTN_Game.bind(this));
        uiRight.onPinSanClicked(this._BTN_Game.bind(this));
        uiRight.onDouDiZhuClicked(this._BTN_Game.bind(this));
        uiRight.onRunClicked(this._BTN_Game.bind(this));
        uiRight.onMoreGameClicked(this._BTN_Game.bind(this));
        uiRight.onChessClicked(this._BTN_Enter.bind(this));

        // 更新UI信息
        this._ui.updateInfo();
        this._ui.updateMailStatus(game.DataKernel.haveNewMail);
        this._ui.updateTaskStatus(game.DataKernel.haveTaskReward);
        cc.log("==>开始进入房间");
        this._gameDisconnected();
    },

    /**
     * 大厅重连触发的函数
     * @param msg       重连的数据
     * @private
     */
    _doReconnected : function (msg) {
        cc.log("==> 大厅重连收到的消息：" + JSON.stringify(msg));
        game.UISystem.showLoading();
        game.hallNet.onMsgDispatchHandler(this.disposeMessage.bind(this));
        // 断开连接前必须先将游戏断线重连置为空，否则会触发两次游戏重连，导致触发函数绑定两次
        game.gameNet.onDisconnectCallback(null);
        // 断开游戏连接
        game.gameNet.disconnect();
        // 执行完断线后，在将游戏断线触发函数绑定
        game.gameNet.onDisconnectCallback(this._gameDisconnected.bind(this));
        game.UISystem.closeAllPopupWindow();
        //以下单例窗口赋值为空
        game.ui.InvitationWindow.inst = null;
        game.ui.WheelWin.inst = null;
        this._init();
        game.UISystem.hideLoading();
    },

    /**
     * 游戏断线触发的函数
     * @private
     */
    _gameDisconnected : function () {
        game.UISystem.showLoading();
        // 根据获取到的 roomId 判断是否请求游戏的IP和port
        if (game.hallNet.isConnected()) {
            var roomId = game.DataKernel.getRoomId();
            if (roomId != 0) {
                // 房间号存在，并且流程不在游戏中，则执行进入房间的操作
                game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_GET_ROOM_ADDR, {rid : game.DataKernel.getRoomId()});
            } else {
                game.UISystem.hideLoading();
            }
        }
    },

    /**
     * 点击游戏按钮
     */
    _onCreateGameClick : function (gameType) {
        cc.log("==> 创建房间:" + gameType);

        if (gameType == GameTypeConfig.type.XQ) {// 象棋，切换到自建房界面
            game.Procedure.switch(game.procedure.RoomCard);
            return;
        }
        game.procedure.RoomList.setSelectGame(gameType);
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_REQ_MATCH_LIST, {gameType: gameType});
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_REQ_ROOM_LIST, {gameType: gameType});

    },

    /**
     * 加入游戏房间调用函数
     */
    _doJoinRoom : function (gameType, subType, gameConnectIp, gameConnectPort, roomId) {
        // 加入房间
        cc.log("加入游戏房间 Ip:" + gameConnectIp + "  Port:" + gameConnectPort);
        game.UISystem.showLoading();
        game.Procedure.pauseNetMessageDispatch();       // 暂停游戏数据派发
        game.gameNet.init();
        // 连接服务器 成功后再根据matchId进入游戏
        game.gameNet.connect(gameConnectIp, gameConnectPort, function (connected) {
            if (connected) {
                game.DataKernel.roomId = roomId;
                if (gameType == GameTypeConfig.type.PSZ) {
                    game.Procedure.switch(game.procedure.PinSan);
                    game.procedure.PinSan.bindNetMessageHandler();
                } else if (gameType == GameTypeConfig.type.HNMJ || gameType == GameTypeConfig.type.CDMJ) {
                    game.Procedure.switch(game.procedure.Mahjong);
                    game.procedure.Mahjong.bindNetMessageHandler();
                } else if (gameType == GameTypeConfig.type.NN) {
                    game.Procedure.switch(game.procedure.PinShi);
                    game.procedure.PinShi.bindNetMessageHandler();
                } else if (gameType == GameTypeConfig.type.DDZ) {
                    game.Procedure.switch(game.procedure.DouDiZhu);
                    game.procedure.DouDiZhu.bindNetMessageHandler();
                } else if (gameType == GameTypeConfig.type.RUN) {
                    game.Procedure.switch(game.procedure.Run);
                    game.procedure.Run.bindNetMessageHandler();
                } else if (gameType == GameTypeConfig.type.XQ) {
                    game.Procedure.switch(game.procedure.Chess);
                    game.procedure.Chess.bindNetMessageHandler();
                }
            } else {
                // 提示连接游戏失败
                game.ui.TipWindow.popup({
                    tipStr : "连接游戏服务器失败,请确保网络连接后再试!"
                }, function (win) {
                    game.UISystem.closePopupWindow(win);
                    game.DataKernel.clearRoomId();
                });
                game.UISystem.hideLoading();
            }
        });
    },

    // ==== 按钮点击回调函数 ==========================================================================

    // 头像
    _BTN_HeadPic : function () {
        cc.log("==> 头像");
        game.Audio.playBtnClickEffect();
        game.ui.InfoWin.popup();
    },

    // 转盘
    _BTN_Wheel : function () {
        cc.log("==> 转盘");
        game.Audio.playBtnClickEffect();
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_WHEEL_CONFIG,{});
    },

    // 分享
    _BTN_Share : function () {
        cc.log("==> 分享");
        game.Audio.playBtnClickEffect();
        // game.ui.ShareWin.popup();
        this._onCreateGameClick(GameTypeConfig.type.XQ);
    },

    // 商城
    _BTN_Shop : function () {
        cc.log("==> 商城");
        game.Audio.playBtnClickEffect();
        if (game.DataKernel.needSeer()) {
            game.ui.Account.popup();
            return;
        }
        game.ui.MallWin.popup();
    },
    // 银行
    _BTN_Bank : function () {
        cc.log("==> 银行");
        game.Audio.playBtnClickEffect();
        if (game.DataKernel.needSeer()) {
            game.ui.Account.popup();
            return;
        }
        game.ui.BankWin.popup();
    },
    // 推广
    _BTN_TuiG : function () {
        cc.log("==> 推广");
        game.Audio.playBtnClickEffect();
        game.ui.ExtendWin.popup();
        // game.ui.TipWindow.popup({
        //     tipStr: "功能正在研发中，请您稍安勿躁！"
        // }, function (win) {
        //     game.UISystem.closeWindow(win);
        // });
    },
    // 任务
    _BTN_Task : function () {
        cc.log("==> 任务");
        game.Audio.playBtnClickEffect();
        game.ui.TaskWindow.popup(function(show){
            this._ui.updateTaskStatus(show);
        }.bind(this),false);
    },
    // 战绩
    _BTN_ZhanJi : function () {
        cc.log("==> 战绩");
        game.Audio.playBtnClickEffect();
        game.ui.ReportWindow.popup();
    },
    // 邮件
    _BTN_Mail : function () {
        cc.log("==> 邮件");
        game.Audio.playBtnClickEffect();
        game.ui.MailWindow.popup(function (show) {
            this._ui.updateMailStatus(show);
        }.bind(this));
    },
    // 帮助
    _BTN_Help : function () {
        cc.log("==> 帮助");
        game.Audio.playBtnClickEffect();
        game.ui.HelpWin.popup();
    },
    // 绑定
    _BTN_Bind : function () {
        cc.log("==> 绑定");
        game.Audio.playBtnClickEffect();
        game.ui.BindWindow.popup();
        // game.ui.TipWindow.popup({
        //     tipStr: "功能正在研发中，请您稍安勿躁！"
        // }, function (win) {
        //     game.UISystem.closeWindow(win);
        // });
    },
    // 好友
    // _BTN_Friend : function () {
    //     cc.log("==> 好友");
    //     game.Audio.playBtnClickEffect();
    //     game.ui.FriendWin.popup();
    // },
    // 提币
    // _BTN_TiBi : function () {
    //     cc.log("==> 提币");
    //     game.Audio.playBtnClickEffect();
    //
    // },
    // 设置
    _BTN_Set : function () {
        cc.log("==> 设置");
        game.Audio.playBtnClickEffect();
        game.ui.SettingWin.popup();
    },
    // 大喇叭
    _BTN_Horn : function () {
        cc.log("==> 大喇叭");
        game.Audio.playBtnClickEffect();
        game.ui.HornWindow.popup();
    },
    // 大喇叭
    _BTN_Lb : function () {
        cc.log("==> 聊呗");
        game.Audio.playBtnClickEffect();
        // Utils.openBrowserWithUrl(game.config.CHAT_URL);
        this._onCreateGameClick(GameTypeConfig.type.XQ);
    },
    // 排行
    _BTN_Rank : function () {
        cc.log("==> 排行");
        game.ui.RankWin.popup();
    },
    // 加入房间
    _BTN_Enter : function () {
        game.ui.HallJoinWin.popup();
    },
    // 游戏
    _BTN_Game : function (gameType) {
        game.Audio.playBtnClickEffect();
        if (game.DataKernel.needSeer()) {
            game.ui.Account.popup();
            return;
        }
        if (game.DataKernel.needBind()) {
            game.ui.BindWindow.popup();
            return;
        }
        this._onCreateGameClick(gameType);
    },
    // 更多
    _BTN_MoreGame : function () {
        cc.log("==> 更多");
        game.ui.TipWindow.popup({
            tipStr: "更多游戏，敬请期待！"
        }, function (win) {
            game.UISystem.closeWindow(win);
        });
    },
    // 返回
    _BTN_Back : function () {
        if (game.UISystem.isHavePopupWindow()) {
            game.UISystem.closeAnyonePopupWindow();
        } else {
            // 弹框确认是否退出游戏
            game.ui.TipWindow.popup({
                tipStr      : "确定退出游戏？",
                showClose   : true
            }, function (window) {
                game.UISystem.closePopupWindow(window);
                cc.director.end();
            });
        }
    },

    // ==== 消息处理 =================================================================================
    disposeMessage : function (code, msg) {
        switch (code) {
            case protocol.ProtoID.CLIENT_MIDDLE_REQ_MATCH_LIST  : this.__NET_matchListData(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_REQ_ROOM_LIST   : this.__NET_roomListData(msg); break;
            case protocol.ProtoID.CLIENT_FORCE_QUIT             : this.__NET_forceQuit(msg); break;
            case protocol.ProtoID.CLIENT_ROOM_LIST_NEXT         : this.__NET_roomListNext(msg); break;
            case protocol.ProtoID.CLIENT_ROOM_LIST_BEFORE       : this.__NET_roomListBefore(msg); break;
            case protocol.ProtoID.GAME_MIDDLE_CHANGE_RESOURCE   : this.__NET_userChangeResource(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_REQ_ADD_MATCH   : this.__NET_roomIdData(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_GET_ROOM_ADDR   : this.__NET_connectInfo(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_RANK_LIST       : this.__NET_updateRankList(msg); break;
            // case protocol.ProtoID.CLIENT_MIDDLE_REQ_SHOP        : this.__NET_shopConfigData(msg); break;
            // case protocol.ProtoID.CLIENT_MIDDLE_SHOP_CONVERT    : this.__NET_shopConvertResult(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_SHOP_CHONGZHI   : this.__NET_chongZhi(msg);break;
            case protocol.ProtoID.CLIENT_TAKE_CASH_NO_VERIFY    : this.__NET_takeCash(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_NOTICE          : this.__NET_notice(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_GET_REPORT      : this.__NET_getReport(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_REQ_DETAILS     : this.__NET_getReportDetails(msg); break;
            case protocol.ProtoID.CLIENT_FEEDBACK               : this.__NET_feedback(msg);break;
            case protocol.ProtoID.INVITATION_ENTER_GAME_ROOM    : this.__NET_invitation(msg);break;
            case protocol.ProtoID.CLIENT_MIDDLE_GET_MAIL        : this.__NET_getMail(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_LOOK_MAIL       : this.__NET_lookMail(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_FETCH_MAIL      : this.__NET_fetchMail(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_DEL_MAIL        : this.__NET_delMail(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_NEW_MAIL        : this.__NET_onNewMail(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_CREATE_ROOM     : this.__NET_roomCardId(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_CHESS_REPORT    : this.__NET_chessReport(msg); break;
            case protocol.ProtoID.CLIENT_WHEEL_CONFIG           : this.__NET_wheelConfig(msg); break;
            case protocol.ProtoID.CLIENT_GO_WHEEL               : this.__NET_goWheel(msg); break;
            case protocol.ProtoID.CLIENT_MIDDLE_GET_TASK_INFO   : this.__NET_getTaskInfo(msg);break;
            case protocol.ProtoID.CLIENT_MIDDLE_FETCH_TASK      : this.__NET_fetchTask(msg);break;
            case protocol.ProtoID.CLIENT_MIDDLE_HAVE_TASK       : this.__NET_haveTaskReward(msg);break;
            case protocol.ProtoID.CLIENT_REAL_NAME              : this.__NET_realName(msg);break;
            case protocol.ProtoID.HORN_UPDATE                   : this.__NET_updateHorn(msg);break;
            case protocol.ProtoID.HORN_RECORD                   : this.__NET_updateHornWin(msg);break;
            case protocol.ProtoID.HORN_SEND                     : this.__NET_sendHorn(msg);break;
            case protocol.ProtoID.PFC_BIND                      : this.__NET_pfcBind(msg);break;
            case protocol.ProtoID.PFC_CHARGE_INFO               : this.__NET_pfcChargeInfo(msg);break;
            case protocol.ProtoID.TG_BIND                       : this.__NET_tgBind(msg);break;
            case protocol.ProtoID.TG_INFO                       : this.__NET_tgInfo(msg);break;
            case protocol.ProtoID.TG_TI_RECORD                  : this.__NET_tiRecord(msg);break;
            case protocol.ProtoID.TG_CAN_TI                     : this.__NET_tiCan(msg);break;
            case protocol.ProtoID.TG_TI                         : this.__NET_ti(msg);break;
            case protocol.ProtoID.TG_GET_ADDRESS                : this.__NET_getAddress(msg);break;
            case protocol.ProtoID.SEER_NEW_ACCOUNT              : this.__NET_seerAccount(msg);break;
            case protocol.ProtoID.SEER_CHAIN_COIN               : this.__NET_chainCoin(msg);break;
            case protocol.ProtoID.SEER_BANK_GET                 : this.__NET_bankGet(msg);break;
            case protocol.ProtoID.SEER_BANK_SAVE                : this.__NET_bankSave(msg);break;
            case protocol.ProtoID.SEER_CASH_OUT                 : this.__NET_seerOut(msg);break;
        }
    },

    // ==== 具体消息处理 =============================================================================
    // 推广提现
    __NET_seerOut: function (msg) {
        cc.log("==> 推广提现!" + JSON.stringify(msg));
        var tip = "提现错误code:" + msg.result;
        if (msg.result == 0) {
            tip = "提奖励成功！"
        }else {
            tip = msg['msg'];
        }
        game.ui.HintMsg.showTipText(tip, cc.p(640, 360), 3);
    },
    // 银行取钱
    __NET_bankGet: function (msg) {
        cc.log("==> 银行取钱!" + JSON.stringify(msg));
        var tip = "取币错误code:" + msg.result;
        if (msg.result == 0) {
            tip = "取币成功！"
        }else {
            tip = msg['msg'];
        }
        game.UISystem.hideLoading();
        game.ui.HintMsg.showTipText(tip, cc.p(640, 360), 3);
    },
    // 银行存钱
    __NET_bankSave: function (msg) {
        cc.log("==> 银行存钱!" + JSON.stringify(msg));
        var tip = "存币错误code:" + msg.result;
        if (msg.result == 0) {
            tip = "存币成功！"
        }else {
            tip = msg['msg'];
        }
        game.UISystem.hideLoading();
        game.ui.HintMsg.showTipText(tip, cc.p(640, 360), 3);
    },
    // 链上币更新
    __NET_chainCoin: function (msg) {
        cc.log("==> 链上币更新!" + JSON.stringify(msg));
        game.DataKernel.chain_coin = msg.boxBean;
        // 更新UI
        this._ui.updateInfo();
        // 更新商城货币
        if (game.ui.MallWin.inst) {
            game.ui.MallWin.inst.updateInfo();
        }
        // 更新银行货币
        if (game.ui.BankWin.inst) {
            game.ui.BankWin.inst.updateBankInfo();
        }

        game.UISystem.hideLoading();
    },
    // seer账户
    __NET_seerAccount: function (msg) {
        cc.log("==> 创建账户!" + JSON.stringify(msg));
        var tip = "创建错误code:" + msg.result;
        if (msg.result == 0) {
            game.DataKernel.seer_account = msg.account;
            game.DataKernel.seer_id = msg.id;
            if (game.ui.Account.inst) {
                game.ui.Account.inst.close();
            }
            tip = "创建账户成功，祝您游戏愉快！"
        }else {
            tip = msg['msg'];
        }
        game.UISystem.hideLoading();
        game.ui.HintMsg.showTipText(tip, cc.p(640, 360), 3);
    },
    // 刷新地址
    __NET_getAddress: function (msg) {
        cc.log("==> 刷新地址!" + JSON.stringify(msg));
        if (msg.result == 0) {
            if (game.ui.CashOut.inst) {
                var tip = msg.address == "" ? "没有历史记录" : msg.address;
                game.ui.CashOut.inst.updateAddress(tip);
            }
        }
    },
    // 提币
    __NET_ti: function (msg) {
        cc.log("==> 提币消息!" + JSON.stringify(msg));
        var result = msg.result;
        var tip = "绑定错误code:" + result;
        if (result == 0) {
            tip = "提币成功，请前往钱包查看！"
        }else if (result == 1) {
            tip = msg['msg'];
        }
        game.ui.HintMsg.showTipText(tip, cc.p(640, 360), 3);
    },
    // 能够提的数量
    __NET_tiCan: function (msg) {
        cc.log("==> 当前可以提币!" + JSON.stringify(msg));
        if (msg.result == 0) {
            game.ui.CashOut.popup(msg['sum']);
        }
    },
    // 提币记录
    __NET_tiRecord: function (msg) {
        cc.log("==> 提币记录!" + JSON.stringify(msg));
        if (msg.result == 0) {
            game.ui.CashRecord.popup(msg['records']);
        }
    },
    // 推广信息
    __NET_tgInfo: function (msg) {
        cc.log("==> 推广信息!" + JSON.stringify(msg));
        game.UISystem.hideLoading();
        if (msg.result == 0) {
            game.ui.ExtendWin.inst.updateInfo(msg.data);
        }else {
            game.ui.ExtendWin.inst.close();
        }
    },
    // 推广绑定
    __NET_tgBind: function (msg) {
        cc.log("==> 推广绑定!" + JSON.stringify(msg));
        var result = msg.result;
        var tip = "绑定错误code:" + result;
        if (result == 0) {
            tip = "绑定成功！";
            game.DataKernel.preUid = msg['superUid'];
            if (game.ui.BindWindow.inst) {
                game.ui.BindWindow.inst.close();
            }
        }else if (result == 8) {
            tip = "代理不存在！"
        }

        game.ui.HintMsg.showTipText(tip, cc.p(640, 360), 3);
    },
    // PFC充值消息
    __NET_pfcChargeInfo: function (msg) {
        cc.log("==> PFC充值记录!" + JSON.stringify(msg));
        if (msg.result == 0) {
            game.ui.BillWin.popup(msg['records']);
        }
    },

    // 绑定PFC
    __NET_pfcBind: function (msg) {
        cc.log("==> PFC绑定消息!" + JSON.stringify(msg));
        if (msg.result == 0) {
            cc.log("==> 绑定次数：" + msg.count);
            game.DataKernel.pfcAdd = msg.address || "";
            game.DataKernel.pfcQR = msg.url || "";
            if (game.DataKernel.pfcAdd != "") {
                cc.log("地址绑定成功：" + game.DataKernel.pfcAdd);
                return
            }
            game.UISystem.showLoading();
            setTimeout(function () {
                cc.textureCache.addImageAsync(game.DataKernel.pfcQR, function(texture) {
                    cc.log("==> 缓存pfc二维码..." + JSON.stringify(texture));
                    game.UISystem.hideLoading();
                }, this);
            }, 1000);

            if (game.ui.MallWin.inst) {
                game.ui.MallWin.inst.setInfo();
            }
        }
    },
    // 更新银行信息
    __NET_takeCash: function (msg) {
        cc.log("==> 银行取钱消息!" + JSON.stringify(msg));
        if (msg.result != 0) {
            cc.log("取钱失败！");
            return;
        }
        game.DataKernel.boxBean = msg.bank.bean;
        game.DataKernel.bean = msg.user.bean;

        // 更新大厅显示
        var curProcedure = game.Procedure.getProcedure();
        if (curProcedure == game.procedure.RoomList ||
            curProcedure == game.procedure.RoomCard ||
            curProcedure == game.procedure.Home) {
            curProcedure._ui.updateInfo();
        }

        var tip = "您已成功";
        if (msg.isSave) {
            tip += "存入" + msg.bean + "Seer";
        }else {
            tip += "取出" + msg.bean + "Seer";
        }
        // 更新银行显示
        if (game.ui.BankWin.inst) {
            game.ui.BankWin.inst.updateBankInfo();
            game.ui.BankWin.inst.resetCashValue();
            game.ui.HintMsg.showTipText(tip, cc.p(640, 360), 3);
        }

    },
    /**
     * 实名认证消息
     * @param msg
     * @private
     */
    __NET_realName: function (msg) {
        cc.log("实名认证消息！" + JSON.stringify(msg));
        if (msg.result != 0) {
            return;
        }
        game.DataKernel.identity = msg.data.identity || "";
        game.ui.TipWindow.popup({
            tipStr: "实名认证成功，请注意查收邮件奖励哦！"
        }, function () {
            game.UISystem.closeAllPopupWindow();
        }.bind(this));
    },
    /**
     * 摇奖结果
     * @param msg
     * @private
     */
    __NET_goWheel: function (msg) {
        cc.log("中奖信息！" + JSON.stringify(msg));
        if (msg.result != 0) {
            if (msg.result == 26) {
                game.ui.HintMsg.showTipText("您的Seer不足！", cc.p(640, 360), 2);
            }else if (msg.result == 52) {
                game.ui.HintMsg.showTipText("您的次数用完了，明天再来吧！", cc.p(640, 360), 2);
            }
            return;
        }

        var curFree = msg.curFreeCount;
        var curCharge = msg.curCount;
        var totalFree = msg.maxFree;
        var totalCharge = msg.maxCount;

        var data = {};
        data.id = msg.id;
        data.type = msg.type;
        data.num = msg.num;

        if (game.ui.WheelWin.inst) {
            game.ui.WheelWin.inst.updateCurCount(curFree, curCharge, totalFree, totalCharge);
            game.ui.WheelWin.inst.goWheel(data);
        }
    },
    /**
     * 幸运转盘配置数据
     * @param msg
     * @private
     */
    __NET_wheelConfig: function (msg) {
        cc.log("幸运转盘配置消息！" + JSON.stringify(msg));
        if (msg.result != 0) {
            cc.log("拉取转盘配置错误");
            return;
        }
        if (game.ui.WheelWin.inst == null) {
            game.ui.WheelWin.popup(msg);
        }
    },
    /**
     * 获取房卡场的rid
     * @param msg
     * @private
     */
    __NET_chessReport : function (msg) {
        cc.log("象棋查看战绩消息！" + JSON.stringify(msg));
        game.ui.ChessReportWin.inst.loadReports(msg.reports);
    },
    /**
     * 获取房卡场的rid
     * @param msg
     * @private
     */
    __NET_roomCardId : function (msg) {
        cc.log("创建房卡场消息！" + JSON.stringify(msg));

        if (msg.result != protocol.ProtoStatus.STATUS_OK) {
            if (msg.result == 26) {
                game.ui.HintMsg.showTipText("Seer不足！", cc.p(640, 360), 2);
            }else if (msg.result == 70) {
                game.ui.HintMsg.showTipText("请设置底分！", cc.p(640, 360), 2);
            }
            game.DataKernel.clearRoomId();
            game.UISystem.hideLoading();
            return;
        }
        game.DataKernel.roomId = 0;
        // 请求IP和Port
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_GET_ROOM_ADDR, {rid : msg.roomId});
        // 关闭创建房间弹窗
        if (game.ui.HallCreateWin.inst) {
            game.UISystem.closeWindow(game.ui.HallCreateWin.inst);
            game.ui.HallCreateWin.inst = null;
        }
    },
    /**
     * 消息插播
     * @param msg
     * @private
     */
    __NET_notice : function (msg) {
        cc.log("==> 收到消息插播配置数据" + JSON.stringify(msg));
        if (msg.type == 1) {
            // 1为固定播放消息  直接替换并清除之前的消息
            RunTextConfig.FixedNotice = msg.data;
        } else {
            // 2为临时插播消息 按照队列添加的临时消息中
            msg.data.forEach(function (info) {
                RunTextConfig.TemporaryNotice.push(info);
            });
            RunText.reset();
        }

        RunText.startRuntText();
    },

    /**
     * 拉取战绩
     * @param msg
     * @private
     */
    __NET_getReport: function (msg) {
        cc.log("==> 战绩列表！" + JSON.stringify(msg));
        game.ui.ReportWindow.inst.loadReports(msg.reports);
    },
    /**
     * 拉取房卡场对应的 8局或者16局的详细战绩
     * @param msg
     * @private
     */
    __NET_getReportDetails:function(msg){
        cc.log("==> 战报详情！" + JSON.stringify(msg));
        game.ui.ReportDetailsWindow.popup();
        game.ui.ReportDetailsWindow.inst.loadReports(msg);
    },
    /**
     * 新邮件消息
     * @param msg
     * @private
     */
    __NET_onNewMail: function (msg) {
        cc.log("==> 有新邮件！" + JSON.stringify(msg));
        game.DataKernel.haveNewMail = msg.haveNewMail;
        this._ui.updateMailStatus(msg.haveNewMail);
    },
    /**
     * 删除邮件消息
     * @param msg
     * @private
     */
    __NET_delMail: function (msg) {
        cc.log("==> 删除邮件消息！" + JSON.stringify(msg));
        if (msg.result == 0) {
            game.ui.MailWindow.inst.deleteMail(msg.ids);
        }
    },
    /**
     * 领取邮件附件消息
     * @param msg
     * @private
     */
    __NET_fetchMail: function (msg) {
        cc.log("==> 领取邮件附件消息！" + JSON.stringify(msg));
        game.ui.MailWindow.inst.fetchMail(msg.id);
        if (msg.result == 0) {
            var goods = msg.goods;
            var type = msg.type;// 奖品类型 0 是其他奖励 1 背包奖励
            var data = [];
            for (var i = 0; i < goods.length; ++i) {
                var temp = {};
                temp.type = goods[i].id;
                temp.num = goods[i].num;
                data.push(temp);
            }
            game.ui.RewardWindow.popup(data, type, null);
        }
    },
    /**
     * 阅读邮件消息
     * @param msg
     * @private
     */
    __NET_lookMail: function (msg) {
        cc.log("==> 阅读邮件消息！" + JSON.stringify(msg));
        game.ui.MailWindow.inst.readMail(msg.id);
    },
    /**
     * 拉取邮件消息
     * @param msg
     * @private
     */
    __NET_getMail: function (msg) {
        cc.log("==> 拉取邮件消息！" + JSON.stringify(msg));
        game.ui.MailWindow.inst.loadMail(msg.mails);
    },
    /**
     * 商城配置数据更新消息
     * @param msg
     * @private
     */
    // __NET_shopConfigData : function (msg) {
    //     cc.log("==> 商城配置数据消息：" + JSON.stringify(msg));
    //     var itemCfg = msg.itemCfg;
    //     var dayLimit = msg.rechargeDayLimit;
    //     var monthLimit = msg.rechargeMonthLimit;
    //
    //     // 当天充值的限制数据
    //     GameMallConfig.rechargeDayLimit.currentPrice = dayLimit.currentPrice || 0;
    //     GameMallConfig.rechargeDayLimit.limitPrice = dayLimit.limitPrice || 0;
    //
    //     // 当月充值的限制数据
    //     GameMallConfig.rechargeMonthLimit.currentPrice = monthLimit.currentPrice || 0;
    //     GameMallConfig.rechargeMonthLimit.limitPrice = monthLimit.limitPrice || 0;
    //
    //     // 商品配置数据
    //     for (var key in itemCfg) {
    //         if (itemCfg.hasOwnProperty(key)) {
    //             GameMallConfig.itemCfg[key].itemId = itemCfg[key].itemId;
    //             GameMallConfig.itemCfg[key].status = itemCfg[key].status;
    //             GameMallConfig.itemCfg[key].cards = itemCfg[key].cards;
    //             GameMallConfig.itemCfg[key].giveBean = itemCfg[key].giveBean;
    //             GameMallConfig.itemCfg[key].rmbPrice = itemCfg[key].rmbPrice;
    //             GameMallConfig.itemCfg[key].giveDiamond = itemCfg[key].giveDiamond;
    //         }
    //     }
    // },
    /**
     * 商城钻石兑换金贝结果消息
     * @param msg
     * @private
     */
    // __NET_shopConvertResult : function (msg) {
    //     cc.log("==> 商城钻石兑换金贝结果消息:" + JSON.stringify(msg));
    //     if (msg.result == protocol.ProtoStatus.STATUS_OK) {
    //         // 提示成功
    //         game.ui.TipWindow.popup({
    //             tipStr: "兑换金贝成功！"
    //         }, function (win) {
    //             game.UISystem.closePopupWindow(win);
    //         });
    //     } else {
    //         game.ui.TipWindow.popup({
    //             tipStr: "兑换金贝失败," + protocol.getErrorString(msg.result)
    //         }, function (win) {
    //             game.UISystem.closePopupWindow(win);
    //         });
    //     }
    // },
    /**
     * 更新排行榜数据
     * @param msg
     * @private
     */
    __NET_updateRankList: function (msg) {
        cc.log("==> 大厅更新排行榜消息!");
        // cc.log("==> 大厅更新排行榜消息：" + JSON.stringify(msg));
        game.ui.RankWin.inst && game.ui.RankWin.inst.updateRankList(msg);
    },
    // 更新玩家资源信息
    __NET_userChangeResource : function (msg) {
        cc.log("==> 大厅玩家货币信息更新：" + JSON.stringify(msg));
        // 更新玩家基础信息数据
        game.DataKernel.card = msg.card || 0;
        game.DataKernel.bean = msg.bean || 0;
        game.DataKernel.diamond = msg.diamond || 0;
        // 更新UI
        this._ui.updateInfo();
        game.ui.InfoWin.updateInfo();
        // 更新商城货币
        if (game.ui.MallWin.inst) {
            game.ui.MallWin.inst.updateInfo();
        }
        // 更新银行货币
        if (game.ui.BankWin.inst) {
            game.ui.BankWin.inst.updateBankInfo();
        }
    },
    // 房间列表更新的信息
    __NET_matchListData : function (msg) {
        cc.log("==> 收到的随机列表的信息:" + JSON.stringify(msg));
        if (msg.result != 0) {
            game.ui.TipWindow.popup({
                tipStr : protocol.getErrorString(msg.result) + " 错误码:" + msg.result
            }, function (win) {
                game.UISystem.closePopupWindow(win);
            });
            return;
        }

        // 更新房间列表UI显示
        var roomListUI = game.procedure.RoomList.getUIWindow();
        if (roomListUI) {
            roomListUI.updateInfo_1(msg);
        }

        // 如果是当前流程是大厅。则切换到房间列表流程
        if (game.Procedure.getProcedure() == this) {
            game.Procedure.switch(game.procedure.RoomList);
        }
    },
    // 自建房列表数据
    __NET_roomListData: function (msg) {
        cc.log("==> 收到的自建房列表的信息:" + JSON.stringify(msg));
        var roomListUI = game.procedure.RoomList.getUIWindow();
        if (roomListUI) {
            roomListUI.updateInfo_2(msg);
        }
    },
    // 被动离开房间
    __NET_forceQuit: function (msg) {
        cc.log("==> 被动离开房间消息:" + JSON.stringify(msg));
        var str = "您已离开房间！";
        if (msg.type == 2) {
            str = "您已被房主踢出房间！";
        }else if (msg.type == 1) {
            str = "房间已被解散！"
        }
        game.ui.HintMsg.showTipText(str,cc.p(640, 360), 3);
    },
    // 上一页
    __NET_roomListBefore: function (msg) {
        cc.log("==> 自建房上一页消息:" + JSON.stringify(msg));
        var roomListUI = game.procedure.RoomList.getUIWindow();
        if (roomListUI) {
            roomListUI.updateInfo_2(msg);
        }
    },
    // 下一页
    __NET_roomListNext: function (msg) {
        cc.log("==> 自建房下一页消息:" + JSON.stringify(msg));
        var roomListUI = game.procedure.RoomList.getUIWindow();
        if (roomListUI) {
            roomListUI.updateInfo_2(msg);
        }
    },
    /**
     * 房间ID数据
     * @param msg
     * @private
     */
    __NET_roomIdData : function (msg) {
        cc.log("==>  房间Id信息:" + JSON.stringify(msg));
        if (msg.result != protocol.ProtoStatus.STATUS_OK) {
            game.DataKernel.clearRoomId();
            var str = "Seer不足，请充值！\n" + "您所携带的Seer数量必须符合准入限制! \n";
            str += "您可以前往商城充值或前往贝箱取Seer!";
            game.ui.NoBeanTip.popup(str);
            return;
        }
        game.DataKernel.roomId = 0;
        // 请求IP和Port
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_GET_ROOM_ADDR, {rid : msg.roomId});
    },

    /**
     * 游戏服务器ip和端口信息
     * @param msg
     * @private
     */
    __NET_connectInfo : function (msg) {
        cc.log("==> 收到游戏服务器和端口消息:" + JSON.stringify(msg));
        if (msg.result != protocol.ProtoStatus.STATUS_OK) {
            game.ui.TipWindow.popup({
                tipStr : protocol.getErrorString(msg.result) + " 错误码:" + msg.result
            }, function (win) {
                game.UISystem.closePopupWindow(win);
                // 没连接上1.房卡场切回RoomCard 2.金币场切回RoomList
                var procedure = game.Procedure.getProcedure();
                if(procedure == game.procedure.Home){
                    game.Procedure.switch(game.procedure.Home);
                } else if (procedure == game.procedure.Chess) {
                    game.Procedure.switch(game.procedure.RoomCard);
                } else {
                    game.Procedure.switch(game.procedure.RoomList);
                }
                // 清除连接房号
                game.DataKernel.clearRoomId();
            });
            game.UISystem.hideLoading();
            return;
        }
        var ip = msg.ip;
        var port = msg.port;
        var gameType = msg.gameType;
        var subType = msg.subType;
        var rid = msg.roomId;
        this._doJoinRoom(gameType, subType, ip, port, rid);
    },
    /**
     * 邀请不在游戏的玩家进入房间游戏
     * @param msg
     * @private
     */
    __NET_invitation:function(msg){
        cc.log("==> 邀请进入游戏房间：" + JSON.stringify(msg));
        //服务器有时候给在游戏房间的人也发送这个消息，客服端二次验证
        var curPro = game.Procedure.getProcedure();
        if(curPro != game.procedure.RoomList && curPro != game.procedure.Home){
            return;
        }
        if(0 != msg.result){
            cc.log("==> 邀请进入游戏房间错误：" + msg.result);
            return;
        }
        game.ui.InvitationWindow.popup(msg,function(){
            game.DataKernel.roomId = 0;
            game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_GET_ROOM_ADDR, {rid : msg.roomId});
        });
    },
    /**
     * 反馈回执消息
     * @param msg
     * @private
     */
    __NET_feedback : function (msg) {
        cc.log("===> 反馈提交以后服务器回执的消息：" + JSON.stringify(msg));
        // 0成功，201数据库错误  44 今日反馈已达最大上限
        switch (msg.result){
            case 0:
                game.ui.HintMsg.showTipText( "提交成功！感谢您的反馈，祝你游戏愉快！",cc.p(640, 360), 2);break;
            case 201:
                game.ui.HintMsg.showTipText( "数据库错误！",cc.p(640, 360), 2);break;
            case 44:
                game.ui.HintMsg.showTipText( "每天只可反馈一次，您今日反馈已达上限！",cc.p(640, 360), 2);break;
        }
    },
    //拉取任务信息
    __NET_getTaskInfo:function(msg){
        cc.log("===>拉取任务信息：" + JSON.stringify(msg));
        if (msg.result != 0) {
            cc.log("取钱失败！");
            return;
        }
        game.ui.TaskWindow.inst.loadTask(msg.data);
    },
    /**
     * 领取任务消息
     * @param msg
     * @private
     */
    __NET_fetchTask: function (msg) {
        cc.log("==> 领取任务奖励消息！" + JSON.stringify(msg));
        if (msg.result != 0) {
            return;
        }
        game.ui.TaskWindow.inst.fetchTask(msg.id);
        game.ui.RewardWindow.popup(msg.task);
    },
    /**
     * 服务器推送完成任务情况
     * @param msg
     * @private
     */
    __NET_haveTaskReward: function (msg) {
        cc.log("==> 领取奖励以后，更新任务奖励是否领取完毕！" + JSON.stringify(msg));
        if (msg.result != 0) {
            return;
        }
        game.DataKernel.haveTaskReward = msg.red;
        this._ui.updateTaskStatus(game.DataKernel.haveTaskReward);
        cc.eventManager.dispatchCustomEvent("taskStatus", {});
    },
    /**
     * 充值消息
     * @param msg
     * @private
     */
    __NET_chongZhi: function(msg) {
        cc.log("==> 充值消息: " + JSON.stringify(msg));
        if (msg.result != 0) {
            game.UISystem.hideLoading();
            game.ui.TipWindow.popup({
                tipStr: "充值异常",
                showNo: true
            }, function (win) {
                game.UISystem.closePopupWindow(win);
            }.bind(this));
            return;
        }
        var url = msg.qrCode;
        Utils.openBrowserWithUrl(encodeURI(url));
    },
    // 更新大喇叭
    __NET_updateHorn: function (msg) {
        cc.log("==> 大喇叭大厅消息：" + JSON.stringify(msg));
        this._ui.updateHorns(msg['latelyMsg']);
    },
    // 更新大喇叭窗口
    __NET_updateHornWin: function (msg) {
        cc.log("==> 更新大喇叭窗口：" + JSON.stringify(msg));
        if (game.ui.HornWindow.inst) {
            game.ui.HornWindow.inst.updateHornRecord(msg['msgs']);
        }
    },
    // 发送喇叭
    __NET_sendHorn: function (msg) {
        cc.log("==> 发送喇叭：" + JSON.stringify(msg));
        var str = "";
        if (msg.result == 26) {
            str = "Seer不足！";
        }else if (msg.result == 212) {
            str = "最多输入40个字符!";
        }else if (msg.result == 0) {
            str = "大喇叭发送成功！";
        }else {
            str = "发送出错，错误码:" + msg.result;
        }

        game.ui.HintMsg.showTipText("" + str, cc.p(640, 360), 2);
    },
    // 排名赛奖励配置
    // __NET_matchReward: function (msg) {
    //     cc.log("排名赛奖励配置！" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         game.UISystem.hideLoading();
    //         return;
    //     }
    //     game.ui.MatchInstruction2.popup(msg.msgs);
    // },
    // 排名赛获奖记录
    // __NET_matchRecord: function (msg) {
    //     cc.log("排名赛获奖记录！" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         game.UISystem.hideLoading();
    //         return;
    //     }
    //     game.ui.MatchRankWin.inst.loadRecord(msg);
    // },
    // 排名赛排名
    // __NET_matchRankList: function (msg) {
    //     cc.log("排名赛排名！" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         game.UISystem.hideLoading();
    //         return;
    //     }
    //     if (msg.type == 1) {
    //         game.ui.MatchRankWin.popup(msg);
    //     }else {
    //         if (game.ui.MatchRankWin2.inst) {
    //             game.ui.MatchRankWin2.inst.updateRankList(msg);
    //         }
    //     }
    //
    // },
    // 更新排名赛信息
    // __NET_updateMatchInfo: function (msg) {
    //     cc.log("更新排名赛信息！" + JSON.stringify(msg));
    //     var matchInfo = msg.rankMatch;
    //     game.DataKernel.rankMatch = matchInfo;
    //     game.DataKernel.matchIng = matchInfo.matchIng;
    //     // game.DataKernel.matchCard = matchInfo.curCard;
    //     // game.DataKernel.matchScore = matchInfo.curScore;
    //     this._ui.showMatchIng();
    // },
    // 参加排名赛消息
    // __NET_joinMatch: function (msg) {
    //     cc.log("参加排名赛消息！" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         game.ui.HintMsg.showTipText("无效卡号！code:" + msg.result, cc.p(640, 360), 3);
    //         return;
    //     }
    //     game.ui.MatchActivateWin.close();
    //     game.ui.TipWindow.popup({
    //         tipStr: "恭喜您报名成功！"
    //     }, function (win) {
    //         game.UISystem.closePopupWindow(win);
    //     }.bind(this));
    //
    // },
    // 是否有比赛奖励没领取
    // __NET_haveMatchReward: function (msg) {
    //     cc.log("是否有比赛奖励没领取消息！" + JSON.stringify(msg));
    //     game.DataKernel.haveRewardMail = msg.display;
    //     this._ui.showRewardBox();
    // },
    // 申请推广员消息
    // __NET_applyPromoter: function (msg) {
    //     cc.log("==> 申请推广员消息！" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         var tip  = "申请失败!";
    //         if (msg.result == 201) {// 手机号已被使用
    //             tip = "该手机号已被注册！"
    //         }else if (msg.result == 203) {// 茶馆名字不合法
    //             tip = "茶馆名字不合法，请修改后重试！"
    //         }else if (msg.result == 48) {// 验证码错误
    //             tip = "验证码不正确！"
    //         }else if (msg.result == 208) {// 茶馆名字被占用
    //             tip = "该茶馆名字已被注册！"
    //         }
    //
    //         game.ui.HintMsg.showTipText(tip, cc.p(640, 360), 2);
    //         return;
    //     }
    //
    //     game.ui.PromoterApplyWin.inst.close();
    //     game.ui.TipWindow.popup({
    //         tipStr: "恭喜您成为推广员！"
    //     },function (win) {
    //         game.UISystem.closePopupWindow(win);
    //     });
    // },
    // 推广员数据消息
    // __NET_promoterInfo: function (msg) {
    //     cc.log("==> 推广员数据消息！" + JSON.stringify(msg));
    //     var data = msg.data;
    //     var level = data.proxyLv;
    //     //1 2 非推广员 3 普通 4 中级 5 高级
    //     if (level < 3) {
    //         game.ui.PromoterInsWin.popup();
    //     }else {
    //         game.ui.PromoterUpWin.popup(msg.data);
    //     }
    // },
    // 银行修改密码消息
    // __NET_bankModifyPassword: function (msg) {
    //     cc.log("==> 银行修改密码消息！" + JSON.stringify(msg));
    // },
    // 记住密码消息
    // __NET_bankRemember: function (msg) {
    //     cc.log("==> 银行记住密码消息！" + JSON.stringify(msg));
    //     if (msg.result == 0) {
    //         game.DataKernel.storageBox.remember = msg.remember;
    //     }
    // },
    // 验证银行密码消息
    // __NET_bankPassword: function (msg) {
    //     cc.log("==> 银行验证密码消息!" + JSON.stringify(msg));
    //     if (msg.result == 0) {
    //         // 弹出银行界面
    //         game.ui.BankWin.popup();
    //         // 关闭验证界面
    //         if (game.ui.VerifyWin.inst)
    //             game.UISystem.closeWindow(game.ui.VerifyWin.inst);
    //
    //     } else {
    //         game.ui.TipWindow.popup({
    //             tipStr: "密码错误！"
    //         }, function (win) {
    //             game.UISystem.closePopupWindow(win);
    //         });
    //     }
    // },
    // 更新银行信息
    // __NET_takeCash: function (msg) {
    //     cc.log("==> 银行取钱消息!" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         cc.log("取钱失败！");
    //         return;
    //     }
    //     game.DataKernel.boxBean = msg.bank.bean;
    //     game.DataKernel.bean = msg.user.bean;
    //
    //     // 更新大厅显示
    //     var curProcedure = game.Procedure.getProcedure();
    //     if (curProcedure == game.procedure.RoomList ||
    //         curProcedure == game.procedure.RoomCard ||
    //         curProcedure == game.procedure.Home) {
    //         curProcedure._ui.updateInfo();
    //     }
    //
    //     var tip = "您已成功";
    //     if (msg.isSave) {
    //         tip += "存入" + msg.bean + "金贝";
    //     }else {
    //         tip += "取出" + msg.bean + "金贝";
    //     }
    //     // 更新银行显示
    //     if (game.ui.BankWin.inst) {
    //         game.ui.BankWin.inst.updateBankInfo();
    //         game.ui.BankWin.inst.resetCashValue();
    //         game.ui.HintMsg.showTipText(tip, cc.p(640, 360), 3);
    //     }
    //
    // },
    // 修改交友微信号的消息
    // __NET_changeSignature : function (msg) {
    //     cc.log("==> 收到修改微信好的消息:" + JSON.stringify(msg));
    //     game.DataKernel.signature = msg.signature;
    //     game.ui.InfoWin.updateInfo();
    //     if (msg.result == protocol.ProtoStatus.STATUS_OK) {
    //         game.Audio.playBtnClickEffect();
    //         game.ui.TipWindow.popup({
    //             tipStr: "修改微信号成功！"
    //         }, function (win) {
    //             game.UISystem.closePopupWindow(win);
    //         });
    //     }
    // },
    //  缓存服务器头像
    // __NET_updateHeadPic: function (msg) {
    //     cc.log("===>缓存服务器头像：" + JSON.stringify(msg));
    //     game.DataKernel.headPic = msg.headPic;
    //     this._ui.updateInfo();
    // },
    // 背包数据
    // __NET_bagInfo:function (msg) {
    //     cc.log("==> 背包数据：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     if (game.ui.BagWindow.inst) {
    //         game.ui.BagWindow.inst.updateInfo(msg.bag);
    //     }
    // },
    // 使用物品
    // __NET_useBagItem: function (msg) {
    //     cc.log("==> 使用物品：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         if (msg.result == 390) {
    //             game.ui.HintMsg.showTipText("物品不存在！", cc.p(640, 360), 2);
    //         }else {
    //             game.ui.HintMsg.showTipText("使用物品失败code: " + msg.result, cc.p(640, 360), 2);
    //         }
    //
    //         return;
    //     }
    //     var id = msg.id;
    //     var tipStr = "";
    //     if (id >= 15 && id <= 20) {
    //         // 话费
    //         tipStr = "电话充值卡使用成功！";
    //         if(game.ui.PhoneChargeWin.inst) {
    //             game.UISystem.closePopupWindow(game.ui.PhoneChargeWin.inst);
    //             game.ui.PhoneChargeWin.inst = null;
    //         }
    //     }else if (id >= 21 && id <= 22) {
    //         // 电视卡
    //         tipStr = "有线电视卡使用成功！";
    //     }else if (id >= 23 && id <= 26) {
    //         // 宽带
    //         tipStr = "宽带充值卡使用成功！";
    //     }else if (id >= 27 && id <= 28) {
    //         // 优惠券
    //         tipStr = "餐饮券使用成功，请前往邮件查看详情！";
    //     }else if (id == 29) {
    //         tipStr = "豪华游艇观光券使用成功，请前往邮件查看详情！";
    //     }else if (id >=30 && id <= 33) {
    //         tipStr = "京东E卡使用成功，请前往邮件查看详情！";
    //         if (game.ui.BindAddWin.inst) {
    //             game.ui.BindAddWin.inst.close();
    //         }
    //     }
    //     // 使用参赛卡单独处理
    //     // if (id == 12) {
    //     //     var result = msg.result;
    //     //     switch (result) {
    //     //         case 0  : tipStr = "参赛成功,祝您比赛愉快!";break;
    //     //         case 60 : tipStr = "参赛卡号码不正确!";break;
    //     //         case 61 : tipStr = "参赛卡已经被使用!";break;
    //     //         case 62 : tipStr = "您当月赛季已参赛，请勿重复使用参赛卡!";break;
    //     //     }
    //     // }
    //     game.ui.HintMsg.showTipText(tipStr, cc.p(640, 360), 2);
    // },
    /**
     * 绑定账号
     * @param msg
     * @private
     */
    // __NET_bindAccount: function (msg) {
    //     cc.log("==>绑定账号：" + JSON.stringify(msg));
    //     var result = msg.result;
    //     var type = msg.data.type;
    //     var str = "";
    //     if (result != 0) {
    //         str = "绑定失败，错误码code：" + result;
    //     }else {
    //         if (type == 4) {
    //             game.DataKernel.phone = msg.data.phone;
    //             game.DataKernel.weChat = msg.data.wx;
    //             str = "绑定成功！"
    //         }else if (type == 5) {
    //             game.DataKernel.netAccount = msg.data.account;
    //             str = "绑定宽带账号成功！"
    //         }else if (type == 6) {
    //             game.DataKernel.tvAccount = msg.data.account;
    //             str = "绑定有线电视账号成功！"
    //         }
    //
    //         // 关闭绑定界面
    //         if (game.ui.BindAccWin.inst) {
    //             game.ui.BindAccWin.inst.close();
    //         }
    //         if (game.ui.BindInfoWin.inst) {
    //             game.ui.BindInfoWin.inst.close();
    //         }
    //     }
    //     game.ui.HintMsg.showTipText(str, cc.p(640, 360), 2);
    //
    //
    // },
    /**
     * 刷新卡号消息
     * @param msg
     * @private
     */
    // __NET_refreshCard: function (msg) {
    //     cc.log("==> 刷新卡号消息！" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     var newCard = msg.newCard;
    //     var tipStr = "";
    //     var cardWin = game.ui.UseCardWin.inst;
    //     if (newCard == 0) {
    //         tipStr = "当前序列号暂未被使用！";
    //     }else if (newCard == -1) {
    //         tipStr = "没有更多的卡！";
    //         cardWin && cardWin.close();
    //     }else {
    //         tipStr = "刷新成功！";
    //         cardWin && cardWin.setInfo(newCard);
    //     }
    //     game.ui.HintMsg.showTipText(tipStr, cc.p(640, 360), 2);
    // },

    // 拉取好友窗口信息
    // __NET_friendInfo: function (msg) {
    //     cc.log("==> 获取好友信息：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     if (game.ui.FriendWin.inst != null) {
    //         game.ui.FriendWin.inst.setLookUpFriendInfo(msg.list);
    //     }
    // },
    // 申请添加好友
    // __NET_friendApply: function (msg) {
    //     cc.log("==> 添加好友消息：" + JSON.stringify(msg));
    //     var result = msg.result;
    //     var str = "";
    //     switch (result) {
    //         case 0  : str = "已向对方发送好友邀请,等待对方同意";break;
    //         case 365 :str = "对方已经是你的好友";break;
    //         case 366 :str = "已申请添加好友，无需重复添加";break;
    //         default : str = "添加好友错误";break;
    //     }
    //     game.ui.HintMsg.showTipText( str,cc.p(640, 360), 2);
    // },
    // 添加好友响应
    // __NET_friendApplyReap: function (msg) {
    //     cc.log("==> 添加好友响应消息：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     if (game.ui.FriendWin.inst) {
    //         game.ui.FriendWin.inst.updateNotifyItem(msg);
    //     }
    // },
    // 好友列表消息
    // __NET_friendList: function (msg) {
    //     cc.log("==> 好友列表消息：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     if (game.ui.FriendWin.inst) {
    //         game.ui.FriendWin.inst.setMyFirendInfo(msg.list);
    //     }
    // },
    // 删除好友消息
    // __NET_friendDelete: function (msg) {
    //     cc.log("==> 删除好友消息：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         game.ui.HintMsg.showTipText("删除好友失败", cc.p(640, 360), 2);
    //         return;
    //     }
    //     game.ui.HintMsg.showTipText("删除好友成功", cc.p(640, 360), 2);
    //     if (game.ui.FriendInfoWin.inst != null) {
    //         game.ui.FriendInfoWin.inst.close();
    //     }
    // },
    // 好友通知消息
    // __NET_friendNotice: function (msg) {
    //     cc.log("==> 好友通知消息：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     if (game.ui.FriendWin.inst) {
    //         game.ui.FriendWin.inst.setNotifyInfo(msg);
    //     }
    // },
    // 聊天记录消息
    // __NET_chatRecord: function (msg) {
    //     cc.log("==> 聊天记录消息：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     if (game.ui.ChatWin.inst) {
    //         game.ui.ChatWin.inst.loadChatRecords(msg['records']);
    //     }
    // },
    // 发送聊天信息
    // __NET_chatSend: function (msg) {
    //     cc.log("==> 发送聊天信息：" + JSON.stringify(msg));
    //     if (msg.result == 370) {
    //         game.ui.HintMsg.showTipText("发送的消息不能为空", cc.p(640, 360), 2);
    //         return;
    //     }
    //     if (game.ui.ChatWin.inst) {
    //         game.ui.ChatWin.inst.showChatMessage(msg);
    //     }
    // },
    // 赠送礼物消息
    // __NET_giveGift: function (msg) {
    //     cc.log("==> 赠送礼物消息：" + JSON.stringify(msg));
    //     var result = msg.result;
    //     var str = "";
    //     switch (result) {
    //         case 363 : str = "赠送的金贝超过最大值！";break;
    //         case 364 :str = "赠送的次数超过最大值！";break;
    //         case 26 :str = "金贝不足，不能赠送！";break;
    //         case 0 : str = "赠送好友金贝成功！";break;
    //     }
    //     game.ui.HintMsg.showTipText(str, cc.p(640, 360), 2);
    //
    //     if (result != 0) {
    //         return;
    //     }
    //     //送豆界面的最大次数更新
    //     if (game.ui.GiveBeanWin.inst != null) {
    //         game.ui.GiveBeanWin.inst.updateFntNum(msg.plusCount);
    //     }
    //     //本地数据好友最大次数更新
    //     if (game.ui.FriendWin.inst != null) {
    //         game.ui.FriendWin.inst.updatePlusCount(msg.target, msg.plusCount);
    //     }
    // },
    // 领取礼物消息
    // __NET_getGift: function (msg) {
    //     cc.log("==> 领取礼物消息：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     if (game.ui.FriendWin.inst) {
    //         game.ui.FriendWin.inst.updateNotifyItem(msg);
    //     }
    // },
    // 刷新推荐好友消息
    // __NET_friendRefresh: function (msg) {
    //     cc.log("==> 刷新推荐好友消息：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     if (game.ui.FriendWin.inst != null) {
    //         game.ui.FriendWin.inst.setLookUpFriendInfo(msg.list);
    //     }
    // },
    // 查找好友消息
    // __NET_friendSearch: function (msg) {
    //     cc.log("==> 查找好友消息：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     if (game.ui.FriendWin.inst != null) {
    //         game.ui.FriendWin.inst.setAppointFriend(msg.data);
    //     }
    // },
    // 有未读聊天消息
    // __NET_chatMsgRed: function (msg) {
    //     cc.log("==> 有未读聊天消息：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     if (game.ui.FriendWin.inst) {
    //         game.ui.FriendWin.inst.updateFriendRed(msg);
    //     }
    // },
    // 好友窗口有未查看消息
    // __NET_friendWindowRed: function (msg) {
    //     cc.log("==> 好友窗口有未查看消息：" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         return;
    //     }
    //     if (game.ui.FriendWin.inst) {
    //         game.ui.FriendWin.inst.showRedDot(msg);
    //     }
    // },
    // 新的聊天消息
    // __NET_chatNew: function (msg) {
    //     cc.log("==> 新的聊天消息：" + JSON.stringify(msg));
    //     game.DataKernel.haveNewChat = msg.red;
    //     this._ui.updateFriendStatus(msg.red);
    // },
    // 日常福利信息
    // __NET_dailyWeal: function (msg) {
    //     cc.log("==> 日常福利信息：" + JSON.stringify(msg));
    //     if (game.ui.WealWin.inst) {
    //         game.ui.WealWin.inst.updateInfo(msg['data']);
    //     }
    // },
    // 补助消息
    // __NET_subsidy: function (msg) {
    //     cc.log("==> 补助消息：" + JSON.stringify(msg));
    //
    //     if (msg.result == 0) {
    //         var data = [{type: 1, num: 3000}];
    //         game.ui.RewardWindow.popup(data, 99, null);
    //         return;
    //     }
    //     var str = "";
    //     if (msg.result == 380) {
    //         str = "金贝低于1500才可以领取补助！"
    //     }else if (msg.result == 381) {
    //         str = "每天只能领取两次哦！"
    //     }
    //     game.ui.HintMsg.showTipText("" + str, cc.p(640, 360), 3);
    // },
    // 签到消息
    // __NET_signConfig: function (msg) {
    //     cc.log("==> 签到消息：" + JSON.stringify(msg));
    //     if (game.ui.WealSignWin.inst) {
    //         game.ui.WealSignWin.inst.updateInfo(msg.data);
    //     }
    // },
    // 领取签到奖励
    // __NET_signGet: function (msg) {
    //     cc.log("==> 领取签到奖励：" + JSON.stringify(msg));
    //     if (msg.result == 0) {
    //         var goods = msg['goods'];
    //         var data = [];
    //         for (var i = 0; i < goods.length; ++i) {
    //             var one = {type: goods[i].id, num: goods[i].num};
    //             data.push(one);
    //         }
    //         game.ui.RewardWindow.popup(data, 0, null);
    //     }
    // },
    // 兑换信息
    // __NET_shopInfo: function (msg) {
    //     cc.log("==> 兑换信息：" + JSON.stringify(msg));
    //     if (game.ui.ChangeWin.inst) {
    //         game.ui.ChangeWin.inst.updateInfo(msg.data);
    //     }
    // },
    // 兑换
    // __NET_doChange: function (msg) {
    //     cc.log("==> 兑换信息：" + JSON.stringify(msg));
    //     var result = msg.result;
    //     var tipStr = "";
    //     if (result == 0) {
    //         tipStr = "兑换成功，请前往背包查看！";
    //     }else if (result == 26) {
    //         tipStr = "金贝不足！";
    //     }else if (result == 393) {
    //         tipStr = "积分不足！";
    //     }else if (result == 391) {
    //         tipStr = "您的兑换次数已达上限！";
    //     }else if (result == 392) {
    //         tipStr = "本周兑换次数已达上限！";
    //     }else {
    //         tipStr = "兑换失败，错误码：" + result;
    //     }
    //     game.ui.HintMsg.showTipText("" + tipStr, cc.p(640, 360), 3);
    // },
    // 充值
    // __NET_wealCharge: function (msg) {
    //     cc.log("==> 充值信息：" + JSON.stringify(msg));
    //     var result = msg.result;
    //     var tipStr = "";
    //     if (result == 0) {
    //         tipStr = "兑换成功，请前往邮件领取！";
    //     }else if (result == 60) {
    //         tipStr = "卡号不存在！";
    //     }else if (result == 61) {
    //         tipStr = "卡片已经使用！";
    //     }
    //     game.ui.HintMsg.showTipText("" + tipStr, cc.p(640, 360), 2);
    // },
    // 特殊接口
    // __NET_returnHall: function (msg) {
    //     cc.log("==> 强制返回大厅：" + JSON.stringify(msg));
    //     // game.Procedure.switch(game.procedure.Home)
    // },
    // 赠送记录
    // __NET_giveRecord: function (msg) {
    //     cc.log("==> 赠送记录：" + JSON.stringify(msg));
    //     if (msg.result == 0) {
    //         if (game.ui.GiveRecord.inst) {
    //             game.ui.GiveRecord.inst.loadScrollView(msg.data);
    //         }
    //     }
    // },
    // 赠送消息
    // __NET_giveTo: function (msg) {
    //     cc.log("==> 赠送消息：" + JSON.stringify(msg));
    //     var result = msg.result;
    //     var tipStr = "";
    //     if (result == 0) {
    //         tipStr = "赠送成功！";
    //         if (game.ui.GiveWin.inst) {
    //             game.ui.GiveWin.inst.close();
    //         }
    //     }else if (result == 60) {
    //         tipStr = "填写ID有误，请检查后重新输入！";
    //     }else {
    //         tipStr = "赠送失败，code：" + result;
    //     }
    //     game.ui.HintMsg.showTipText("" + tipStr, cc.p(640, 360), 2);
    // },
    // // 赠送记录红点
    // __NET_giveDot: function (msg) {
    //     cc.log("==> 赠送记录红点：" + JSON.stringify(msg));
    //     game.DataKernel.newGiveRecord = msg.red;
    //     if (game.ui.BagWindow.inst) {
    //         game.ui.BagWindow.inst.updateDot();
    //     }
    // },
    // 填写邀请码
    // __NET_invitationCode: function (msg) {
    //     cc.log("填写邀请码消息！" + JSON.stringify(msg));
    //     if (msg.result != 0) {
    //         var str = "填写邀请码失败 code：" + msg.result;
    //         if (msg.result == 66) {
    //             str = "您已经填写过该邀请码";
    //         }else if (msg.result == 67) {
    //             str = "邀请码错误！"
    //         }
    //         game.ui.HintMsg.showTipText(str, cc.p(640, 360), 2);
    //         return;
    //     }
    //     game.DataKernel.fillInvitation = msg.invitation;
    //     this._ui.getTopUI().initBtnCode();
    //     game.ui.TipWindow.popup({
    //         tipStr: "邀请码填写成功！"
    //     }, function () {
    //         game.UISystem.closeAllPopupWindow();
    //     }.bind(this));
    // },
};
