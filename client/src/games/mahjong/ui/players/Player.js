/**
 * Created by pander on 2018/5/16.
 */
// ==== 麻将游戏 玩家UI控件 =============================================
GameWindowMahjong.Player = GameWindowBasic.GamePlayerBasic.extend({
    _parentNode             : null,     // 父节点
    _node                   : null,     // 本节点

    _uiIndex                : 0,        // ui的索引值 对应编辑器中的UI

    _headPic                : null,     // 头像

    _imgOffline             : null,     // 离线图片
    _imgReady               : null,     // 准备图片
    _imgDealer              : null,     // 庄家图片
    _imgCreator             : null,     // 房主图片
    _imgDQ                  : null,     // 定缺图标
    _imgStatus              : null,     // 选牌状态
    _imgChatBg              : null,     // 聊天文字背景图

    _labelChatMsg           : null,     // 聊天的文字
    _labelName              : null,     // 昵称文字

    _fntBean                : null,     // 玩家携带的金贝数量
    _fntMultiple            : null,     // 上噶的值

    _btnRecharge            : null,     // 快速充值按钮
    _handlerRecharge        : null,     // 快速充值按钮回调

    _giftNode               : null,     // 礼物特效节点
    _effectNode             : null,     // 游戏特效节点

    _handCardsNode          : null,     // 手牌节点
    _handCards              : null,     // 手牌控件

    _userCardsNode          : null,     // 组合牌节点
    _userCards              : null,     // 组合牌控件

    _flowerCardsNode        : null,     // 花牌节点
    _flowerCards            : null,     // 花牌控件

    _tableCardsNode         : null,     // 桌牌节点
    _tableCards             : null,     // 桌牌控件

    _imgPlayedCard          : null,     // 该玩家出的牌 (提示显示用的牌)
    _tell                   : null,

    _fntHuOrder             : null,     // 胡牌顺序
    _huArrows               : [],       // 胡牌方向
    _huBg                   : null,     // 背景

    _ndAdd                  : null,     // 加分节点
    _fntAdd                 : null,     // 加分美术字
    _ndMinus                : null,     // 减分节点
    _fntMinus               : null,     // 减分美术字
    _imgOut                 : null,     // 出局

    _ndClock                : null,     // 倒计时节点

    ctor : function (uiIndex, parentNode) {
        this._uiIndex = uiIndex;
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/Players/Player_" + this._uiIndex + ".json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return this._super();
    },

    _init : function () {
        this._headPic = new GameWindowBasic.GameHeadPic(game.findUI(this._node, "ND_HeadPic"));

        this._imgOffline = game.findUI(this._node, "IMG_Offline");
        this._imgOffline.setVisible(false);
        this._imgReady = game.findUI(this._node, "IMG_Ready");
        this._imgReady.setVisible(false);
        this._imgDealer = game.findUI(this._node, "IMG_Dealer");
        this._imgDealer.setVisible(false);
        this._imgCreator = game.findUI(this._node, "IMG_FZ");
        this._imgCreator.setVisible(false);
        this._imgChatBg = game.findUI(this._node, "IMG_ChatBG");
        this._imgChatBg.setVisible(false);
        this._imgDQ = game.findUI(this._node, "ND_DQ");
        this._imgDQ.setVisible(false);
        this._imgStatus = game.findUI(this._node, "IMG_Status");
        this._imgStatus.setVisible(false);
        this._imgOut = game.findUI(this._node, "IMG_Out");
        this._imgOut.setVisible(false);
        this._ndClock = game.findUI(this._node, "ND_Clock");

        this._ndAdd = game.findUI(this._node, "ND_AddScore");
        this._fntAdd = game.findUI(this._ndAdd, "FNT_AddScore");

        this._ndMinus = game.findUI(this._node, "ND_MinusScore");
        this._fntMinus = game.findUI(this._ndMinus, "FNT_MinusScore");

        this._labelChatMsg = game.findUI(this._node, "TXT_ChatMsg");
        this._labelChatMsg.setVisible(false);
        this._labelName = game.findUI(this._node, "TXT_Name");

        this._fntBean = game.findUI(this._node, "FNT_Bean");

        this._btnRecharge = game.findUI(this._node, "BTN_Recharge");
        this._btnRecharge && this._btnRecharge.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._handlerRecharge && this._handlerRecharge();
            }
        }, this);

        this._giftNode = game.findUI(this._node, "ND_GiftPos");
        this._effectNode = game.findUI(this._node, "ND_EffectPos");

        this._handCardsNode = game.findUI(this._node, "ND_HandCards");
        this._handCards = null;

        this._userCardsNode = game.findUI(this._node, "ND_UserCards");
        this._userCards = null;

        this._flowerCardsNode = game.findUI(this._node, "ND_FlowerCards");
        this._flowerCards = null;

        this._tableCardsNode = game.findUI(this._node, "ND_TableCards");
        this._tableCards = null;

        this._imgPlayedCard = game.findUI(this._node, "IMG_PlayedCard");
        this._imgPlayedCard.setVisible(false);

        this._fntMultiple = game.findUI(this._node, "FNT_Multiple");
        this._fntMultiple.setVisible(false);

        this._tell = GameWindowBasic.TellVolume.getController();
        this._tell.addToNodeWithLocalPosition(this._node, cc.p(44, 34));
        this._tell.stopTell();

        var ndHu = game.findUI(this._node, "ND_Hu");
        this._fntHuOrder = game.findUI(ndHu, "Fnt_Order");
        this._huBg = game.findUI(ndHu, "ND_Bg");
        this._huArrows = [];
        for (var i = 0; i <=3; ++i) {
            this._huArrows.push(game.findUI(ndHu, "" + i));
        }

        // 避免选牌卡顿
        if (this._userCards == null) {
            this._userCards = new GameWindowMahjong.UserCards(this._uiIndex, this._userCardsNode);
            this._userCards.reset();
        }

        if (this._tableCards == null) {
            this._tableCards = new GameWindowMahjong.TableCards(this._uiIndex, this._tableCardsNode);
            this._tableCards.reset();
        }

        this.show(false);
    },

    /**
     * 重置数据
     */
    reset : function () {
        this.showDealer(false);
        this.setMultiple(-1);
        // this.showReady(false);
        this.showPlayedCard(-1);
        this.setDQ(-1);
        this.showOut(false);
        this.setStatus(-1);
        this.showHuOrder(0, 0, 0);
        this._ndAdd.setVisible(false);
        this._ndMinus.setVisible(false);
        this._handCards && this._handCards.reset();
        this._userCards && this._userCards.reset();
        this._flowerCards && this._flowerCards.reset();
        this._tableCards && this._tableCards.reset();
    },

    /**
     * 设置玩家显示的信息
     * @param index
     * @param info
     */
    setInfo : function(index, info) {
        cc.log("==> 麻将:setInfo: " + index + " ," + JSON.stringify(info));
        this._index = index;
        if (this._index == -1) {
            this.reset();
            this.show(false);
            return;
        }
        this.show(info.playing);
        this._headPic.setHeadPic(info.headPic);

        var name = info.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._labelName && this._labelName.setString(name);

        this.setOnline(info.online);
        this.showReady(info.ready && !info.playing);
        this.setBean(info.bean);
        this.setMultiple(info.multiple);
        this.setDQ(info.dqType);
        this.setStatus(info.xpStatus);
        this.showHuOrder(info.huOrder, info.index, info.paoIdx);
        var gameData = game.procedure.Mahjong.getGameData();
        if (gameData.sceneMode == "FK") {
            this._imgCreator.setVisible(gameData.creator == info.uid);
            this.show(true);
        }

    },

    /**
     * 是否显示该对象
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置在线信息
     * @param bool 是否在线  true 在线(隐藏离线图标)  false不在线(显示离线图标)
     */
    setOnline : function (bool) {
        this._imgOffline.setVisible(!bool);
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
    // 设置定缺类型1筒2条3万
    setDQ: function (type) {
        if (type == -1 || type == undefined) {
            this._imgDQ.setVisible(false);
            return;
        }
        var path = "res/Games/Mahjong/Images/DQ_Tag_";
        // cc.log("================ " + path + type + ".png");
        this._imgDQ.setTexture(path + type + ".png");
        this._imgDQ.setVisible(true);
    },
    // 设置定缺加动画
    setDQWithAct: function (type) {
        if (type == -1 || type == undefined) {
            this._imgDQ.setVisible(false);
            return;
        }
        var path = "res/Games/Mahjong/Images/DQ_Tag_";
        this._imgDQ.setTexture(path + type + ".png");
        this._imgDQ.setVisible(true);

        var bPos = cc.p(560, -40);
        if (this._uiIndex == 2) {
            bPos = cc.p(-560, -180);
        }else if (this._uiIndex == 3) {
            bPos = cc.p(-360, -445);
        }else if (this._uiIndex == 4) {
            bPos = cc.p(560, -340);
        }

        this._imgDQ.setPosition(bPos);
        this._imgDQ.runAction(cc.Sequence(
            cc.MoveTo(0.3, cc.p(-26, 30)),
            cc.CallFunc(function () {
                game.Audio.MahjongPlayDQEffect();
            }, this),
            cc.ScaleTo(0.3, 1.5),
            cc.ScaleTo(0.3, 1))
        );
    },
    // 设置选牌状态: 1选牌中，2已选牌，3等待其他玩家选牌，4定缺中，5已定缺，6退税，7未听牌
    setStatus: function (status) {
        if (status == -1 || status == undefined) {
            this._imgStatus.setVisible(false);
            return;
        }
        var path = "res/Games/Mahjong/Images/Status_";
        // cc.log("================ " + path + status + ".png");
        this._imgStatus.setTexture(path + status + ".png");
        this._imgStatus.setVisible(true);
    },
    // 显示胡牌顺序
    showHuOrder: function (order, huIdx, paoIdx) {

        for (var i = 0; i < this._huArrows.length; ++i) {
            this._huArrows[i].setVisible(false);
        }

        this._fntHuOrder.setString("");
        this._huBg.setVisible(false);

        if (order == 0 || paoIdx == 0 || order == undefined || paoIdx == undefined) {
            return;
        }

        this._huBg.setVisible(true);
        // 显示胡牌顺序
        if (paoIdx != huIdx) {
            this._fntHuOrder.setString(order + "h");
        }

        if (paoIdx == huIdx) {
            this._fntHuOrder.setString(order + "z");
            return;
        }
        // 显示胡牌箭头
        var gameData = game.procedure.Mahjong.getGameData();
        if (paoIdx == 0 || gameData.getPlayerNum() == 2) {
            return;
        }
        var diff = paoIdx - gameData.playerIndex;
        if (diff < 0) {
            diff += 4;
        }
        this._huArrows[diff].setVisible(true);
    },
    // 显示出局
    showOut: function (show) {
        this._imgOut.setVisible(show);
    },
    // 显示分数
    setScoreWithAction: function (score) {
        this._ndMinus.setVisible(score < 0);
        this._ndAdd.setVisible(score >= 0);
        var ss = Utils.formatCoin(Math.abs(score));
        this._fntAdd.setString("J" + ss);
        this._fntMinus.setString("J" + ss);
        if (score >= 0) {
            this._ndAdd.runAction(cc.Sequence(cc.DelayTime(1.5),cc.Hide()));
        } else {
            this._ndMinus.runAction(cc.Sequence(cc.DelayTime(1.5),cc.Hide()));
        }
    },
    /**
     * 显示准备图标
     * @param bool
     */
    showReady : function(bool) {
        this._imgReady.setVisible(bool);
    },

    /**
     * 显示聊天表情
     * @param id 表情的id号
     */
    showChatFace : function(id) {
        GameChatEmojiController.playEmoji(this._giftNode, id);
    },

    /**
     * 显示聊天信息
     * @param msg 聊天的字符串信息
     */
    showChatMsg : function(msg) {
        this._imgChatBg.stopAllActions();
        this._imgChatBg.setVisible(true);
        this._labelChatMsg.setString("" + msg);
        this._labelChatMsg.setVisible(true);

        // 3秒后隐藏聊天
        this._imgChatBg.runAction(cc.sequence(cc.delayTime(5), cc.CallFunc(function () {
            this._imgChatBg.setVisible(false);
            this._labelChatMsg.setVisible(false);
        }, this)));
    },

    /**
     * 头像点击回调
     * @param callback 回调的函数 参数回传该玩家的座位号 如果该座位没人，则传-1
     */
    onHeadPicClicked : function (callback) {
        this._headPic.setClickedHandler(function () {
            callback && callback(this._index);
        }.bind(this));
    },

    /**
     * 快速充值按钮点击回调
     * @param callback
     */
    onRechargeClicked : function (callback) {
        this._handlerRecharge = callback;
    },

    /**
     * 获取礼物节点的世界坐标位置
     */
    getGiftWorldPos : function () {
        return game.UIHelper.getWorldPosition(this._giftNode);
    },

    /**
     * 获取礼物节点的世界坐标位置
     */
    getDianWorldPos : function () {
        var dian = game.findUI(this._node, "ND_Dian");
        return game.UIHelper.getWorldPosition(dian);
    },

    /**
     * 获取麻将特效节点的世界坐标位置
     * @returns {*|null}
     */
    getEffectWorldPos : function () {
        return game.UIHelper.getWorldPosition(this._effectNode);
    },

    /**
     * 设置现金数量
     * @param bean
     */
    setBean : function (bean) {
        bean = Utils.formatCoin(bean);
        this._fntBean.setString("" + bean);
    },

    /**
     * 设置庄家索引用于显示庄家图片
     * @param bool
     */
    showDealer : function (bool) {
        this._imgDealer.setVisible(bool);
    },

    /**
     * 获取手牌控件
     * @returns {null}
     */
    getHandCards : function () {
        if (this._handCards == null) {
            this._handCards = new GameWindowMahjong.HandCards(this._uiIndex, this._handCardsNode);
            this._handCards.reset();
        }
        return this._handCards;
    },

    /**
     * 获取组合牌控件
     * @returns {null}
     */
    getUserCards : function () {
        // if (this._userCards == null) {
        //     this._userCards = new GameWindowMahjong.UserCards(this._uiIndex, this._userCardsNode);
        //     this._userCards.reset();
        // }
        return this._userCards;
    },

    /**
     * 获取花牌控件
     * @returns {null}
     */
    getFlowerCards : function () {
        if (this._flowerCards == null) {
            this._flowerCards = new GameWindowMahjong.FlowerCards(this._uiIndex, this._flowerCardsNode);
            this._flowerCards.reset();
        }
        return this._flowerCards;
    },

    /**
     * 获取桌牌控件
     * @returns {null}
     */
    getTableCards : function () {
        // if (this._tableCards == null) {
        //     this._tableCards = new GameWindowMahjong.TableCards(this._uiIndex, this._tableCardsNode);
        //     this._tableCards.reset();
        // }
        return this._tableCards;
    },

    /**
     * 倒计时节点
     * @returns {null}
     */
    getClockNode: function () {
        return this._ndClock;
    },

    /**
     * 设置上噶的值
     * @param multiple
     */
    setMultiple : function (multiple) {
        this._fntMultiple.setVisible(false);
        if (multiple > -1) {
            this._fntMultiple.setVisible(true);
            this._fntMultiple.setString("" + multiple);
        }
    },

    /**
     * 提示显示已出的牌
     * @param cardId
     * @param callback
     */
    showPlayedCard : function (cardId, callback) {
        this._imgPlayedCard.stopAllActions();
        if (cardId < 0) {
            this._imgPlayedCard.setVisible(false);
            return;
        }
        this._imgPlayedCard.loadTexture("res/Games/Mahjong/CardsImages/HandCards/South/" + cardId + ".png");
        this._imgPlayedCard.setVisible(true);
        this._imgPlayedCard.runAction(cc.sequence(cc.delayTime(1), cc.CallFunc(function () {
            this._imgPlayedCard.setVisible(false);
            callback && callback();
        }, this)));
    }
});
