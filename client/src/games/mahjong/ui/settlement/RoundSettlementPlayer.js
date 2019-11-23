/**
 * Created by pander on 2018/5/22.
 */
// ==== 麻将游戏 单局结算 玩家信息 ================================
GameWindowMahjong.RoundSettlementPlayer = cc.Class.extend({
    _node               : null,         // 本节点

    _headNode           : null,         // 头像节点
    _headPic            : null,         // 头像图片管理对象

    _imgWho             : null,         // 人物属性图片
    _imgDirection       : null,         // 人物显示的方位属性图片
    _imgDealer          : null,         // 庄图片
    _imgFz              : null,         // 房主图片
    _imgHu              : null,         // 胡牌的字

    _labelName          : null,         // 玩家昵称
    _labelResult        : null,         // 玩家本局结算结果
    _labelGangScore     : null,         // 杠牌得分
    _labelHuScore       : null,         // 胡牌得分
    _labelHuaScore      : null,         // 花牌得分

    _spHuCard           : null,         // 胡牌的图片

    _fntHuPlus          : null,         // 胡牌加分结果
    _fntHuMinus         : null,         // 胡牌减分结果

    _handCardsNode      : null,         // 手牌节点
    _handCards          : null,         // 手牌控件

    _userCardsNode      : null,         // 特殊组合牌节点
    _userCards          : null,         // 特殊组合牌控件

    _flowerCardsNode    : null,         // 花牌节点
    _flowerCards        : null,         // 花牌控件
    
    ctor : function (node) {
        this._node = node;
        this._init();
        return true;
    },
    
    _init : function () {
        this._headNode = game.findUI(this._node, "ND_HeadPic");
        this._headPic = new GameWindowBasic.GameHeadPic(this._headNode);

        this._imgWho = game.findUI(this._headNode, "IMG_Who");
        this._imgWho.setVisible(false);

        this._imgDirection = game.findUI(this._headNode, "IMG_Dir");
        this._imgDirection.removeFromParent();
        this._headNode.addChild(this._imgDirection);
        this._imgDealer = game.findUI(this._node, "IMG_Dealer");
        this._imgFz = game.findUI(this._node, "IMG_FZ");
        this._imgHu = game.findUI(this._node, "IMG_Hu");

        this._labelName = game.findUI(this._node, "TXT_Name");
        this._labelResult = game.findUI(this._node, "TXT_Result");
        this._labelGangScore = game.findUI(this._node, "TXT_GangScore");
        this._labelHuScore = game.findUI(this._node, "TXT_HuScore");
        this._labelHuaScore = game.findUI(this._node, "TXT_HuaScore");

        this._fntHuPlus = game.findUI(this._node, "FNT_HuPlus");
        this._fntHuMinus = game.findUI(this._node, "FNT_HuMinus");

        this._spHuCard = game.findUI(this._node, "SP_HuCard");

        this._handCardsNode = game.findUI(this._node, "ND_HandCards");
        this._handCards = new GameWindowMahjong.RoundSettlementPlayer.HandCards(1, this._handCardsNode);

        this._userCardsNode = game.findUI(this._node, "ND_UserCards");
        this._userCards = new GameWindowMahjong.UserCards(1, this._userCardsNode);

        this._flowerCardsNode = game.findUI(this._node, "ND_FlowerCards");
        this._flowerCards = new GameWindowMahjong.FlowerCards(1, this._flowerCardsNode);
    },

    reset : function () {
        this._handCards.reset();
        this._userCards.reset();
        this._flowerCards.reset();
        this._headNode.setScale(1);
        this.show(false);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置玩家信息的值
     * @param playerInfo  玩家的信息文件
     * @param huIndex     胡牌玩家的座位索引
     * @param huCardValue 胡牌的值
     */
    setInfo : function (playerInfo, huIndex, huCardValue) {

        var gameData = game.procedure.Mahjong.getGameData();

        if (huIndex == playerInfo.index) {
            this._imgHu.setVisible(true);
            this._setHuCardValue(huCardValue);
        } else {
            this._imgHu.setVisible(false);
            this._setHuCardValue(-1);
        }

        var realScore = playerInfo.realScore;
        this._fntHuMinus.setVisible(realScore < 0);
        this._fntHuPlus.setVisible(realScore >= 0);
        var bean = Utils.formatCoin(Math.abs(realScore));
        this._fntHuPlus.setString("J" + bean);
        this._fntHuMinus.setString("J" + bean);

        this._headPic.setHeadPic(playerInfo.headPic);
        this._headNode.setScale(playerInfo.index == gameData.playerIndex ? 1.4 : 1.0);
        // this._imgWho.loadTexture(GameDataMahjong.Helper.getRoundSettlementPlayerSequencePath(playerInfo.index));
        this._imgDirection.loadTexture(GameDataMahjong.Helper.getRoundSettlementPlayerDirectionPath(playerInfo.index));
        this._imgDealer.setVisible(gameData.dealerIndex == playerInfo.index);
        this._imgFz.setVisible(gameData.creator == playerInfo.uid);

        var name = playerInfo.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._labelName.setString(name);

        this._labelResult.setString(playerInfo.words);

        var str = "杠分 ";
        playerInfo.gangScore > 0 ? str += "+" : str += "-";
        var gangScore = Utils.formatCoin2(Math.abs(playerInfo.gangScore));
        this._labelGangScore.setString(str + gangScore);

        str = "胡分 ";
        playerInfo.huScore > 0 ? str += "+" : str += "-";
        var huScore = Utils.formatCoin2(Math.abs(playerInfo.huScore));
        this._labelHuScore.setString(str + huScore);

        str = "花胡 ";
        playerInfo.huaScore > 0 ? str += "+" : str += "-";
        var huaScore = Utils.formatCoin2(Math.abs(playerInfo.huaScore));
        this._labelHuaScore.setString(str + huaScore);

        // 手牌的值
        var cardsArray = GameDataMahjong.Helper.handCardsObjToArray(playerInfo.handCards);
        // 如果是胡牌玩家 删除胡的手牌
        if (huIndex == playerInfo.index) {
            for (var i = 0; i < cardsArray.length; ++i) {
                if (cardsArray[i] == huCardValue){
                    cardsArray.splice(i, 1);
                    break;
                }
            }
        }

        this._handCards.setCardsValues(GameDataMahjong.Helper.handCardsSort(cardsArray));

        // 组合特殊牌的值
        this._userCards.reset();
        // 吃的牌
        for (var j = 0; j < playerInfo.chiMj.length; ++j) {
            this._userCards.addChiCardsForSettlement(playerInfo.chiMj[j].cards, playerInfo.chiMj[j].target);
        }
        // 碰的牌
        for (j = 0; j < playerInfo.pengMj.length; ++j) {
            this._userCards.addPengCardsForSettlement(playerInfo.pengMj[j].cards, playerInfo.pengMj[j].target);
        }
        // 杠的牌
        for (j = 0; j < playerInfo.gangMj.length; ++j) {
            this._userCards.addGangCardsForSettlement(playerInfo.gangMj[j].cards, playerInfo.gangMj[j].type, playerInfo.gangMj[j].target);
        }

        // 花牌的值
        this._flowerCards.setCardsValues(playerInfo.flowerCards);
    },

    /**
     * 设置胡牌的显示
     * @param value 显示的牌的id  -1为不显示牌
     * @private
     */
    _setHuCardValue : function (value) {
        this._spHuCard.setVisible(false);
        if (value > 0) {
            this._spHuCard.setTexture("res/Games/Mahjong/CardsImages/HandCards/South/" + value + ".png");
            this._spHuCard.setVisible(true);
        }
    }
});

/**
 * 结算玩家手牌的值
 */
GameWindowMahjong.RoundSettlementPlayer.HandCard = GameWindowMahjong.HandCardSub.extend({
    /**
     * 设置牌的值
     * @param value
     */
    setValue : function (value) {
        this._value = value;
        if (this._value < 1) {
            this.show(false);
            return;
        }

        var gameData = game.procedure.Mahjong.getGameData();

        var path = GameWindowMahjong.HandCard.RES_PAHT + gameData.getDirectionString(this._uiIndex)
            + "/" + this._value + ".png";

        this._node.setTexture(path);

        this.show(true);
    }
});

/**
 * 结算玩家手牌控件
 */
GameWindowMahjong.RoundSettlementPlayer.HandCards = GameWindowMahjong.HandCards.extend({
    ctor : function (uiIndex, parentNode) {
        this._uiIndex = uiIndex;
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/Settlement/HandCards.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._cards = [];
        for (var i = 0; i < 14; ++i) {
            this._cards.push(new GameWindowMahjong.RoundSettlementPlayer.HandCard(this._uiIndex, game.findUI(this._node, "" + i)));
        }
    },

    reset : function () {
        this._cards.forEach(function (card) {
            card.reset();
        });
    },

    /**
     * 设置手牌的值
     * @param cardsArray
     */
    setCardsValues : function (cardsArray) {
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < cardsArray.length) {
                this._cards[i].setValue(cardsArray[i]);
            } else {
                this._cards[i].reset();
            }
        }
    }
});