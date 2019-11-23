/**
 * 登录流程
 */
game.procedure.Login = {

    _ui             : null,          // 更新UI
    _loginTimer     : null,

    enter : function () {
        cc.log("==> 进入登录流程");

        game.Procedure.onAndroidReturnClicked(this._BTN_AndroidReturnCallback);

		game.hallNet.disconnect();
		game.hallNet.onMsgDispatchHandler(null);
		game.hallNet.onReconnectCallback(this.onReconnect);

        // 播放背景音乐
        game.Audio.playLoginBGMusic();

        // 显示登陆界面
        this._ui = new game.ui.LoginWindow();
        game.UISystem.switchUI(this._ui);
        cc.log("==> os : " + sys.os);
        if(sys.os != "Windows") {
            if(Utils.isCurrentVersionIOS(game.config.APP_VERSION)) {
                var loginWithWechat = game.LocalDB.get("LoginWithWechat", true);
                if (loginWithWechat) {
                    this._tryLoginWithWechat();
                }
            }
        }

        // 注册登陆按钮事件
        this._ui.onLoginBtnClick(this._tryLoginWithWechat.bind(this));

        // 注册游客登陆按钮事件
        this._ui.onAnonymousLoginBtnClick(function () {
            if (this._ui.isAgreementOk()) {
                game.UISystem.showLoading();

                game.DataKernel.openid = cc.Device.getUUID();
                game.DataKernel.name = game.DataKernel.openid.substr(-6);
                game.DataKernel.sex = 1;
                game.DataKernel.headPic = "";
                this.doLogin();
            } else {
                cc.log("==> 请同意用户协议");
            }
        }.bind(this));

        this._ui.onAgreeUserPolicyClicked(function () {
            game.Audio.playBtnClickEffect();
            cc.log("==>点击用户协议");
            game.ui.AgreementWindow.popupWindow();
        });

        // 停止跑马灯
        RunText.stopRunText();

        game.Cache.loadingResources("res/loading.json", null, function () {
            cc.log("所有资源预加载完成!!!");
        });
    },

    leave : function () {},

    update : function (dt) {
        var msgPacket = game.hallNet.popMessages();
        if (msgPacket) {
            // 处理消息
            this._disposeMessage(msgPacket.k, msgPacket.v);
        }
    },

    /**
     * 安卓返回按钮点击回调
     * @private
     */
    _BTN_AndroidReturnCallback : function () {
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

    /**
     * 处理网络消息
     * @param code
     * @param msg
     * @private
     */
    _disposeMessage : function (code, msg) {
        switch (code) {
            case protocol.ProtoID.CLIENT_MIDDLE_LOGIN   : this.__NET_LoginResult(msg); break;
            default                                     : cc.log("位置的消息 code:" + code); break;
        }
    },

    /**
     * 重连处理
     * @param json
     */
    onReconnect : function (json) {
        cc.log("==> onReconnect" + JSON.stringify(json));
        game.UISystem.hideLoading();
    },

    /**
     * 微信登录
     * @private
     */
    _tryLoginWithWechat : function () {
        cc.log("==> 微信登录");
        game.UISystem.showLoading();
        if (this._ui.isAgreementOk()) {
            if (WeChat.isWechatInstalled && WeChat.isWechatInstalled()) {
                if (game.config.USE_WX) {
                    cc.log("==> 微信登录开始。。");
                    this._loginTimer = setTimeout(function () {
                        game.UISystem.hideLoading();
                        this._ui.setBtnEnabled(true);
                    }.bind(this), 5000);
                    
                    WeChat.weLogin(function (ok) {
                        cc.log("==> 微信登录结束。。");
                        clearTimeout(this._loginTimer);
                        this._loginTimer = null;
                        if (ok) {
                            this.doLogin();
                            game.LocalDB.set("LoginWithWechat", true, true);
                            game.LocalDB.save();
                        } else {
                            game.UISystem.hideLoading();
                            this._ui.setBtnEnabled(true);
                        }
                    }.bind(this));
                } else {
                    this.doLogin();
                }
            } else {
                if (sys.os == "Windows") {
                    game.DataKernel.openid = cc.Device.getUUID();
                    game.DataKernel.name = game.DataKernel.openid.substr(0, 6);
                    game.DataKernel.sex = 1;
                    game.DataKernel.headPic = "";

                    this.doLogin();
                } else {
                    game.UISystem.hideLoading();
                    this._ui.setBtnEnabled(true);
                    game.ui.TipWindow.popup({
                        tipStr: "微信登录失败，请安装微信后重试。"
                    }, function (win) {
                        game.UISystem.closePopupWindow(win);
                    });
                }
            }
        } else {
            game.UISystem.hideLoading();
            game.ui.TipWindow.popup({
                tipStr: "请阅读并同意用户协议"
            }, function (win) {
                game.UISystem.closePopupWindow(win);
            });
        }
    },

    _loginFailed : function () {
        game.hallNet.disconnect();
        game.UISystem.hideLoading();
        this._ui.setBtnEnabled(true);
        game.ui.TipWindow.popup({
                tipStr: "登录失败，确定网络连接后点击登录重试。"
            }, function (win) {
                game.UISystem.closePopupWindow(win);
            });
    },

    /**
     * 登陆
     */
    doLogin : function () {
        cc.log("==> 执行登录 ");
        game.UISystem.showLoading();

        game.hallNet.connect(game.config.CONNECT_IP, game.config.CONNECT_PORT, function (connected) {
            if (connected) {
                cc.log("===> 连接登录服务器成功");
                var msg = {};
                msg.openId = game.DataKernel.openid;
                // msg.uid = game.DataKernel.uid;
                msg.unionid = game.DataKernel.unionid;
                msg.name = game.DataKernel.name;
                msg.headPic = game.DataKernel.headPic;
                msg.sex = game.DataKernel.sex;

                // 发送登录消息
                game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_LOGIN, msg);

            } else {
                // 登录失败处理
                this._loginFailed();
            }
        }.bind(this));

    },

    /**
     * 登录结果消息处理
     * @param msg
     * @private
     */
    __NET_LoginResult : function (msg) {
        cc.log("==> 登录返回数据结果:" + JSON.stringify(msg));
        if (msg == null) {
            this._loginFailed();
        } else {
            if(msg.result) {
                // 有错误码     做提示
            } else {
                game.DataKernel.parse(msg);
                // 异步加载玩家自己的头像资源
                cc.log("开始拉取微信头像 " + new Date());
                cc.log("==> headPic url " + game.DataKernel.headPic);
                cc.textureCache.addImageAsync(game.DataKernel.headPic, function(texture) {
                    cc.log("微信头像缓存完毕  " + new Date());
                    cc.log("登录的时候，加载自己头像资源路径是:" + texture);
                    // game.UISystem.showLoading();
                    if (cc.sys.os != "Windows") {
                        cc.textureCache.removeUnusedTextures();
                        if (game.procedure.Home._ui) {
                            game.procedure.Home._ui.updateInfo();
                            game.UISystem.hideLoading();
                        }
                    }
                }, this);
                game.Procedure.switch(game.procedure.Home);
            }
        }
    }
};
