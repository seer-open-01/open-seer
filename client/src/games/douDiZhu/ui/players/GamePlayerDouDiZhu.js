/**
 * Created by lyndon on 2017/11/24.
 */

GameWindowDouDiZhu.GamePlayerDouDiZhu = GameWindowBasic.GamePlayerBasic.extend({

    _parentNode         : null,             // 父节点
    _node               : null,             // 玩家节点
    _index              : -1,               // ui玩家下标
    _logicIndex         : -1,               // 逻辑下标

    _userInfo           : null,             // 玩家基本信息

    _handCards          : null,             // 手牌对象
    _handCardsNode      : null,             // 手牌节点
    _leftCards          : null,             // 剩余牌对象
    _leftCardsNode      : null,             // 剩余牌节点
    _outCards           : null,             // 已经出的牌对象
    _outCardsNode       : null,             // 已经出的牌节点

    _imgReady           : null,             // 准备标签
    _imgDealer           : null,            // 地主标签
    _imgTip             : null,             // 玩家操作提示标签

    _labelChat          : null,             // 聊天文字标签
    _chatBg             : null,             // 聊天背景

    _giftPosNode        : null,             // 礼物位置节点
    _clockPosNode       : null,             // 钟表位置节点
    _trustNode          : null,             // 托管界面

    _tell               : null,             // 讲话标志

    _double             : null,             // 加倍图片

    ctor : function (node, index) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/Players/Player_" + index + ".json").node;
        this._index = index;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {

        this._userInfo = new GameWindowDouDiZhu.UserInfo(game.findUI(this._node, "ND_UserInfo"), this._index);

        this._handCardsNode = game.findUI(this._node, "ND_HandCards");
        this._handCards = null;

        this._leftCardsNode = game.findUI(this._node, "ND_LeftCards");
        this._leftCards = null;

        this._outCardsNode = game.findUI(this._node, "ND_OutCards");
        this._outCards = null;

        this._giftPosNode = game.findUI(this._node, "ND_GiftPos");
        this._clockPosNode = game.findUI(this._node, "ND_ClockPos");

        this._imgDealer = game.findUI(this._node, "ND_Dealer");
        this._imgReady = game.findUI(this._node, "ND_Ready");
        this._imgTip = game.findUI(this._node, "ND_Tip");
        this._double = game.findUI(this._node,"PIC_Double");
        this._double.setVisible(false);

        this._labelChat = game.findUI(this._node, "TXT_ChatMsg");
        this._chatBg = game.findUI(this._node, "IMG_ChatBG");
        this._labelChat.setVisible(false);
        this._chatBg.setVisible(false);

        this._tell = GameWindowBasic.TellVolume.getController();
        this._tell.addToNodeWithLocalPosition(this._node, cc.p(44, 54));
        this._tell.stopTell();

        if (this._handCards == null) {
            if (this._handCardsNode) {
                this._handCards = new GameWindowDouDiZhu.HandButtonCards(this._handCardsNode);
                this._handCards.reset();
            }
        }
        // 初始化托管窗口
        this.initTrustWin();
    },

    reset: function () {
        this.resetCards();
        this.showTip(-1);
        this.showTrustWin(false);
        this.setDealer(-1);
        this.setDouble(false);
    },
    /**
     * 外部调用的重置
     */
    resetCards:function () {
        this._handCards && this._handCards.reset();
        this._leftCards && this._leftCards.reset();
        this._outCards && this._outCards.reset();
    },

    setInfo : function (index, info) {
        this._logicIndex = index;
        if (this._logicIndex == -1) {
            this._userInfo.reset();
            this.show(false);
            return;
        }
        this.show(info.playing);
        cc.log("斗地主玩家信息==> "+index+" "+JSON.stringify(info));
        this._userInfo.setVisible(true);
        this._userInfo.setHeadPic(info.headPic);
        this._userInfo.setName(info.name);
        this._userInfo.setBean(info.bean || 0);
        this._userInfo.showChargeBtn(true);
        info.online ? this.setOnline(true) : this.setOnline(false);

        this.showTip(-1);

        this.showReady(info.ready);

        var gameData = game.procedure.DouDiZhu.getGameData();
        if (gameData.sceneMode == "FK") {
            this.show(true);
        }
        // 该接口暂时做房主标志使用
        this.showZanLi(gameData.creator == info.uid);
    },

    //设置加倍图片的显示
    setDouble:function(bool){
        this._double.setVisible(bool);
    },

    /**
     * 是否显示该对象 (必须重写)
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    },
    //=== 玩家外部接口 ==============================
    /**
     * 显示准备图标 (重写的函数)
     * @param bool
     */
    showReady : function(bool) {
        this._imgReady.setVisible(bool);
    },
    /**
     * 显示操作提示
     * @param tip 1叫地主 2不叫 3抢地主 4不抢 5不出 6加倍，7不加倍
     */
    showTip: function (tip) {
        if (tip == -1) {
            this._imgTip.setVisible(false);
            return;
        }
        var path = "res/Games/DouDiZhu/Image/TXT_Tip_" + tip + ".png";
        this._imgTip.setTexture(path);
        this._imgTip.setVisible(true);
    },

    /**
     * 显示说话标志
     */
    showTell : function (show) {
        if (show) {
            this._tell.showTell(0.3);
        }else {
            this._tell.stopTell();
        }

    },
    //=== 基本信息外部接口 ===========================================
    /**
     * 设置在线信息 (重写的函数)
     * @param bool 是否在线  true 在线(隐藏离线图标)  false不在线(显示离线图标)
     */
    setOnline : function (bool) {
        this._userInfo.showOffline(!bool);
    },
    /**
     * 设置玩家当金贝 (重写的函数)
     * @param cash
     */
    setBean : function(cash) {
        this._userInfo.setBean(cash);
    },
    /**
     * 设置庄
     * @param dealerIndex
     */
    setDealer : function (dealerIndex) {
        this._imgDealer.setVisible(dealerIndex != -1 && dealerIndex == this._logicIndex);
    },
    /**
     * 显示暂离
     */
    showZanLi:function (show) {
        this._userInfo.showZanLi(show);
    },
    /**
     * 注册充值按钮监听
     * @param callback
     */
    onChargeClicked:function (callback) {
        this._userInfo.registerChargeClick(callback);
    },

    /**
     * 头像点击回调 (重写的函数)
     * @param callback 回调的函数
     */
    onHeadPicClicked : function (callback) {
        this._userInfo.registerHeadPicClick(function () {
            callback && callback(this._logicIndex);
        }.bind(this));
    },

    /**
     * 显示聊天表情 (重写的函数)
     * @param id 表情的id号
     */
    showChatFace : function(id) {
        GameChatEmojiController.playEmoji(this._giftPosNode, id);
    },

    /**
     * 显示聊天信息 (重写的函数)
     * @param msg 聊天的字符串信息
     */
    showChatMsg : function(msg) {

        this._chatBg.stopAllActions();
        this._chatBg.setVisible(true);
        this._labelChat.setString("" + msg);
        this._labelChat.setVisible(true);
        var doDelay = cc.DelayTime(3.0);
        var doCall = cc.CallFunc(function () {
            this._chatBg.setVisible(false);
            this._labelChat.setVisible(false);
        }, this);

        this._chatBg.runAction(cc.Sequence(doDelay, doCall));
    },
    //=== 动态获取节点接口 ================================================
    /**
     * 获取礼物节点的世界坐标
     * @return {*|null}
     */
    getHatWorldPos : function () {
        return game.UIHelper.getWorldPosition(this._imgDealer);
    },

    /**
     * 获取礼物节点的世界坐标
     * @return {*|null}
     */
    getGiftWorldPos : function () {
        return game.UIHelper.getWorldPosition(this._giftPosNode);
    },

    /**
     * 获取礼物节点的世界坐标
     * @return {*|null}
     */
    getClockWorldPos : function () {
        return game.UIHelper.getWorldPosition(this._clockPosNode);
    },

    /**
     * 获取手牌对象
     * @return {null}
     */
    getHandCards : function () {

        return this._handCards;
    },

    /**
     * 获取剩余牌控制对象
     */
    getLeftCards : function () {
        if (this._leftCards == null) {
            if (this._leftCardsNode) {
                this._leftCards = new GameWindowDouDiZhu.PlayerLeftCards(this._leftCardsNode);
                this._leftCards.reset();
            }
        }
        return this._leftCards;
    },

    /**
     * 获取出的牌控制对象
     */
    getOutCards : function () {
        if (this._outCards == null) {
            if (this._outCardsNode) {
                if(this._index == 1){
                    this._outCards = new GameWindowDouDiZhu.HandCards(this._outCardsNode);
                }else if(this._index == 2){
                    this._outCards = new GameWindowDouDiZhu.HandCards2(this._outCardsNode);
                }else if(this._index == 3){
                    this._outCards = new GameWindowDouDiZhu.HandCards3(this._outCardsNode);
                }
                this._outCards.reset();
            }
        }
        return this._outCards;
    },
    /**
     * 初始化托管窗口
     */
    initTrustWin: function () {
        this._trustNode = game.findUI(this._node, "ND_Trust");
        if (!this._trustNode) {
            return;
        }
        var trustBtn = game.findUI(this._trustNode, "Btn_CancelTrust");
        trustBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.gameNet.sendMessage(protocol.ProtoID.DDZ_PLAYER_TRUST, {
                    uid: game.DataKernel.uid,
                    roomId: game.DataKernel.roomId,
                    isT: false
                })
            }
        }, this);
    },
    /**
     * 显示托管窗口
     * @param show
     */
    showTrustWin: function (show) {
        this._trustNode && this._trustNode.setVisible(show);
    }
});
