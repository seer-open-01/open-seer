/**
 * Author       : lyndon
 * Date         : 2019-05-21
 * Description  : 结算玩家
 */

WindowRun.Settlement.PlayerInfo = cc.Class.extend({

    _node           : null,         // 本节点

    _headPic        : null,         // 头像显示对象
    _fzTag          : null,         // 房主标志
    _name           : null,         // 昵称
    _ID             : null,         // id

    _handCardsNode  : null,         // 手牌对象节点
    _handCards      : null,         // 手牌对象

    _base           : null,         // 底分
    _zdCount        : null,         // 炸弹个数
    _multiple       : null,         // 炸弹倍数
    _beanAdd        : null,         // 加金贝
    _beanMinus      : null,         // 减金贝
    _leftNum        : null,         // 剩余张数
    _result         : null,         // 大关小关单张

    ctor : function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init : function () {
        this._headPic = new GameWindowBasic.GameHeadPic(game.findUI(this._node, "ND_HeadPic"));
        this._name = game.findUI(this._node, "ND_Name");
        this._fzTag = game.findUI(this._node, "ND_FZ");
        this._ID = game.findUI(this._node, "ND_ID");
        this._handCards = new WindowRun.HandCards3(game.findUI(this._node, "ND_HandCards"));
        this._base = game.findUI(this._node, "TXT_Base");
        this._zdCount = game.findUI(this._node, "Fnt_ZD");
        this._multiple = game.findUI(this._node, "TXT_Multiple");
        this._beanAdd = game.findUI(this._node, "Fnt_AddBean");
        this._beanMinus = game.findUI(this._node, "Fnt_MinusBean");
        this._leftNum = game.findUI(this._node, "TXT_Left");
        this._result = game.findUI(this._node, "TXT_Result");

        this.reset();
    },

    reset : function () {
        this._handCards.reset();
        this.show(false);
    },

    /**
     * 设置玩家数据信息
     * @param info
     */
    setPlayerInfo : function (info) {
        this._headPic.setHeadPic(info.headPic);
        var name = info.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._name.setString(name);
        this._ID.setString("ID:"+info.uid);
        var gameData = game.procedure.Run.getGameData();
        this._fzTag.setVisible(gameData.creator == info.uid);
    },

    /**
     * 设置游戏相关数据
     * @param info
     */
    setGameInfo : function (info) {
        var base = Utils.formatCoin2(info.baseBean);
        this._base.setString(base);
        this._zdCount.setString("x" + info.zdCount);
        this._multiple.setString("" + info.zdRate);
        this.setRoundBean(info.roundBean);
        this._handCards.setCardsValues(info.handCards);
        this._handCards.setColouredCardsValues(info.outCards);
        var leftNum = info.handCards.length - info.outCards.length;
        this._leftNum.setString("剩余" + leftNum + "张");
        var result = info.words;
        this._result.setString(result);
    },

    /**
     * 是否显示该对象
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置金贝数量
     */
    setRoundBean:function (num) {
        this._beanAdd.setVisible(num >= 0);
        this._beanMinus.setVisible(num < 0);
        num = Utils.formatCoin(Math.abs(num));
        this._beanMinus.setString("J" + num);
        this._beanAdd.setString("J" + num);
    }
});
