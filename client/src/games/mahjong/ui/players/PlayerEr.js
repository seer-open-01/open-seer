/**
 * Created by pander on 2018/5/25.
 */
// ==== 麻将游戏 二人麻将 玩家UI控件 ======================================
GameWindowMahjongEr.Player = GameWindowMahjong.Player.extend({

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
            this._tableCards = new GameWindowMahjongEr.TableCards(this._uiIndex, this._tableCardsNode);
            this._tableCards.reset();
        }

        this.show(false);
    }
});