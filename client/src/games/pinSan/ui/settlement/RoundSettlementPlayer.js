/**
 * Created by Jiyou Mo on 2017/12/4.
 */
// 单局结算玩家信息
GameWindowPinSan.RoundSettlementPlayer = cc.Class.extend({

    _node               : null,         // 本节点

    _imgBgLose          : null,         // 输家背景
    _imgBgWin           : null,         // 赢家背景
    _labelName          : null,         // 玩家昵称
    _headPic            : null,         // 玩家头像
    _imgFZ              : null,         // 房主标志
    _fntPlus            : null,         // 正数分
    _fntMinus           : null,         // 负数分

    _imgCard1           : null,         // 手牌第一张图
    _imgCard2           : null,         // 手牌第二张图
    _imgCard3           : null,         // 手牌第三张图

    _patternNode        : null,         // 牌型控件节点
    _pattern            : null,         // 牌型

    ctor : function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init : function () {
        this._imgBgLose = game.findUI(this._node, "IMG_BgLose");
        this._imgBgWin = game.findUI(this._node, "IMG_BgWin");
        this._labelName = game.findUI(this._node, "TXT_Name");
        this._headPic = new GameWindowBasic.GameHeadPic(game.findUI(this._node, "ND_HeadPic"));
        this._fntPlus = game.findUI(this._node, "FNT_BeanPlus");
        this._fntMinus = game.findUI(this._node, "FNT_BeanMinus");
        this._imgFZ = game.findUI(this._node, "ND_FZ");

        this._imgCard1 = game.findUI(this._node, "IMG_Cards1");
        this._imgCard2 = game.findUI(this._node, "IMG_Cards2");
        this._imgCard3 = game.findUI(this._node, "IMG_Cards3");

        this._patternNode = game.findUI(this._node, "ND_Pattern");
        this._pattern = new GameWindowPinSan.CardsPattern();
        this._pattern.addToNode(this._patternNode);
        this._pattern.reset();
    },

    reset : function () {
        this._setCards([100, 100, 100]);
        this._showBean(0);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置玩家数据
     * @param info
     */
    setInfo : function (info) {
        // this._imgBgLose.setVisible(!info.isWinner);
        // this._imgBgWin.setVisible(info.isWinner);
        // 此处有需求改动 不论输赢 只要是玩家自己 就显示胜利的背景
        var gameData = game.procedure.PinSan.getGameData();
        var isSelf = info.playerIndex == gameData.playerIndex;
        this._imgBgLose.setVisible(!isSelf);
        this._imgBgWin.setVisible(isSelf);
        this._imgFZ.setVisible(gameData.creator == info.uid);
        this._labelName.setString(info.name + "");
        this._headPic.setHeadPic(info.headPic || "");
        this._showBean(info.addBean);
        this._setCards(info.handCards);
        this._showPattern(info.cardsPattern);
    },

    /**
     * 设置手牌的值
     * @param handCards
     * @private
     */
    _setCards : function (handCards) {
        this._imgCard1.loadTexture("res/Games/PinSan/Pokers/" + handCards[0] + ".png");
        this._imgCard2.loadTexture("res/Games/PinSan/Pokers/" + handCards[1] + ".png");
        this._imgCard3.loadTexture("res/Games/PinSan/Pokers/" + handCards[2] + ".png");
    },

    /**
     * 显示本轮得分
     * @param score
     * @private
     */
    _showBean : function (score) {
        this._fntPlus.setVisible(score >= 0);
        this._fntMinus.setVisible(score < 0);
        score = Utils.formatCoin(Math.abs(score));
        this._fntPlus.setString("J" + score);
        this._fntMinus.setString("J" + score);
    },

    _showPattern: function (pattern) {
        if(pattern == -1){
            this._pattern.show(false);
        }else{
            this._pattern.showPattern(pattern, true);
        }
    }
});