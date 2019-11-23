/**
 * Created by lyndon on 2018/05/16.
 */
// 拼三张玩家
GameWindowPinShi.Player = GameWindowBasic.GamePlayerBasic.extend({
    // === 属性 ==============================================================
    _node                   : null,         // 本节点
    _parentNode             : null,         // 父节点

    _logicIndex             : -1,           // 逻辑坐标
    _userInfo               : null,         // 玩家基本信息

    _imgReady               : null,         // 准备标签
    _imgSpectating          : null,         // 观战中图片

    _giftPosNode            : null,         // 礼物节点 用来获取位置

    _handCardsNode          : null,         // 手牌管理对象节点
    _handCards              : null,         // 手牌管理对象
    _resultCards            : null,         // 展示结果手牌

    _playerAnte             : null,         // 玩家下注显示节点
    _fntAnte                : 0,            // 玩家下注数量

    _labelChat              : null,         // 聊天文字标签
    _chatBg                 : null,         // 聊天背景

    _robTipNode             : null,         // 抢庄倍数节点
    _robTip                 : null,         // 抢庄倍数提示

    _addNode                : null,         // 结算加分节点
    _fntAdd                 : null,         // 结算加分
    _minusNode              : null,         // 结算减分节点
    _fntMinus               : null,         // 结算减分

    _effect                 : null,         // 光圈
    _tell                   : null,

    // === 函数 ==============================================================
    /**
     * 构造
     * @return {boolean}
     */
    ctor : function(uiIndex, uiNode) {
        this._parentNode = uiNode;
        this._node = ccs.load("res/Games/PinShi/Player/Player_" + uiIndex + ".json").node;
        this._index = uiIndex;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {
        this._userInfo = new GameWindowPinShi.UserInfo(game.findUI(this._node, "ND_UserInfo"), this._index);

        this._imgReady = game.findUI(this._node, "ND_Ready");
        this._imgSpectating = game.findUI(this._node, "IMG_Spectating");

        this._giftPosNode = game.findUI(this._node, "ND_GiftPos");
        this._playerAnte = game.findUI(this._node, "ND_PlayerAnte");
        this._fntAnte = game.findUI(this._playerAnte, "Fnt_Ante");

        this._labelChat = game.findUI(this._node, "TXT_ChatMsg");
        this._chatBg = game.findUI(this._node, "IMG_ChatBG");
        this._labelChat.setVisible(false);
        this._chatBg.setVisible(false);

        this._handCardsNode = game.findUI(this._node, "ND_HandCards");
        this._handCards = null;
        this._resultCards = null;

        this._robTipNode = game.findUI(this._node, "ND_RobTip");
        this._robTip = new GameWindowPinShi.RobTip(this._robTipNode);

        this._addNode = game.findUI(this._node, "ND_AddScore");
        this._fntAdd = game.findUI(this._addNode, "FNT_AddScore");
        this._minusNode = game.findUI(this._node, "ND_MinusScore");
        this._fntMinus = game.findUI(this._minusNode, "FNT_MinusScore");
        this._addNode.setVisible(false);
        this._minusNode.setVisible(false);

        this._effect = game.findUI(this._node, "ND_Effect");
        this._effect.setVisible(false);

        this._tell = GameWindowBasic.TellVolume.getController();
        this._tell.addToNodeWithLocalPosition(this._node, cc.p(44, 54));
        this._tell.stopTell();
    },

    /**
     * 重置数据 (重写的函数)
     */
    reset : function () {
        this._handCards && this._handCards.reset();
        this._resultCards && this._resultCards.reset();
        this._cardsStatus && this._cardsStatus.reset();
        this._cardsPattern && this._cardsPattern.reset();

        this.__reset();
    },
    __reset: function () {
        this._userInfo.reset();

        // 非userInfo的接口
        this.setAnte(0);
        this.showReady(false);
        this._minusNode.setVisible(false);
        this._addNode.setVisible(false);
    },
    /**
     * 设置玩家显示的信息（子类必须且重写必须要调用父类的函数）
     * @param index
     * @param info
     */
    setInfo : function(index, info) {
        cc.log("==> 拼十显示玩家信息 " + JSON.stringify(info));
        this._logicIndex = index;
        if (this._logicIndex == -1) {
            this.reset();
            this.show(false);
            return;
        }
        this.show(true);

        this._userInfo.setHeadPic(info.headPic);
        this._userInfo.setName(info.name);
        this._userInfo.showChargeBtn(true);
        this.setBean(info.bean || 0);
        info.online ? this.setOnline(true) : this.setOnline(false);

        this.setAnte(info.ante || 0);
        this.setDealer(-1);
        this.showReady(!info.playing && info.ready);
        this.showRobTip(-1);

        // 观战显示
        var gameData = game.procedure.PinShi.getGameData();
        this.showSpectating(gameData.playing && !info.playing);

        // 该接口暂时做房主标志使用
        this.setZanLi(gameData.creator == info.uid);
    },

    /**
     * 是否显示该对象 (必须重写)
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置在线信息 (重写的函数)
     * @param bool 是否在线  true 在线(隐藏离线图标)  false不在线(显示离线图标)
     */
    setOnline : function (bool) {
        this._userInfo.showOffline(!bool);
    },

    /**
     * 设置暂离信息
     * @param bool
     */
    setZanLi : function (bool) {
        this._userInfo.showZanLi(bool);
    },
    /**
     * 显示准备图标 (重写的函数)
     * @param bool
     */
    showReady : function(bool) {
        this._imgReady.setVisible(bool);
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

    /**
     * 头像点击回调 (重写的函数)
     * @param callback 回调的函数 参数回传该玩家的座位号 如果该座位没人，则传-1
     */
    onHeadPicClicked : function (callback) {
        this._userInfo.registerHeadPicClick(function () {
            callback && callback(this._logicIndex);
        }.bind(this));
    },
    /**
     * 注册充值按钮监听
     * @param callback
     */
    onChargeClicked:function (callback) {
        this._userInfo.registerChargeClick(callback);
    },
    /**
     * 设置庄
     * @param dealerIndex
     */
    setDealer : function (dealerIndex) {
        this._userInfo.showDealer(dealerIndex != -1 && dealerIndex == this._logicIndex);
    },
    /**
     * 显示抢庄倍数提示
     * @param rob
     */
    showRobTip: function (rob) {
        if (rob == -1) {
            this._robTip.reset();
            return;
        }
        this._robTip.show(true);
        this._robTip.showRobTip(rob);
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
    /**
     * 设置已经出的金豆总数
     * @param ante
     */
    setAnte : function (ante) {
        if (ante < 1) {
            this._playerAnte.setVisible(false);
            return;
        }
        this._playerAnte.setVisible(true);
        this._fntAnte.setVisible(true);
        ante = Utils.formatCoin(ante);
        this._fntAnte.setString("" + ante);
    },
    /**
     * 单局结算分数显示
     * @param score
     */
    setScore: function (score) {
        this._minusNode.setVisible(score < 0);
        this._addNode.setVisible(score >= 0);
        score = Utils.formatCoin(Math.abs(score));
        this._fntMinus.setString("J" + score);
        this._fntAdd.setString("J" + score);
    },
    /**
     * 单局结算分数显示两秒后隐藏
     * @param score
     */
    setScoreWithAction: function (score) {
        this._minusNode.setVisible(score < 0);
        this._addNode.setVisible(score >= 0);
        var ss = Utils.formatCoin(Math.abs(score));
        this._fntAdd.setString("J" + ss);
        this._fntMinus.setString("J" + ss);
        if (score >= 0) {
            this._addNode.runAction(cc.Sequence(cc.DelayTime(3.0),cc.Hide()));
        } else {
            this._minusNode.runAction(cc.Sequence(cc.DelayTime(3.0),cc.Hide()));
        }
    },
    /**
     * 获取礼物节点世界坐标位置
     * @return {*|null}
     */
    getGiftWorldPos : function () {
        return game.UIHelper.getWorldPosition(this._giftPosNode);
    },

    /**
     * 设置现金
     * @param bean
     */
    setBean: function (bean) {
        bean = Utils.formatCoin(bean);
        this._userInfo.setBean(bean);
    },
    /**
     * 获取手牌节点
     * @return {null}
     */
    getHandCardsNode : function () {
        return this._handCardsNode;
    },
    /**
     * 获取特效节点
     * @returns {null}
     */
    getEffect: function () {
        return this._effect;
    },
    /**
     * 获取手牌的世界坐标位置
     * @return {*|null}
     */
    getHandCardsWorldPos : function () {
        return game.UIHelper.getWorldPosition(this._handCardsNode);
    },
    /**
     * 获取手牌对象
     * @return {null}
     */
    getHandCards : function () {
        if (this._handCards == null) {
            this._handCards = new GameWindowPinShi.HandCards();
            this._handCards.addToNode(this._handCardsNode);
            this._handCards.reset();
        }
        return this._handCards;
    },
    /**
     * 获取手牌对象
     * @return {null}
     */
    getResultCards : function () {
        if (this._resultCards == null) {
            this._resultCards = new GameWindowPinShi.ResultCards();
            this._resultCards.addToNode(this._handCardsNode);
            this._resultCards.reset();
        }
        return this._resultCards;
    },
    /**
     * 是否显示观战中
     * @param bool
     */
    showSpectating : function (bool) {
        this._imgSpectating.setVisible(bool);
    }
});
