/**
 * Created by lyndon on 2017/06/28.
 */
// 斗地主单局结算玩家信息
GameWindowDouDiZhu.SettlementRoundPlayerInfo = cc.Class.extend({

    _node           : null,         // 本节点

    _headPic        : null,         // 头像显示对象
    _name           : null,         // 昵称
    _ID             : null,         // id

    _diZhuTag       : null,         // 地主图片
    _farmerTag      : null,         // 农民图片
    _fzTag          : null,         // 房主图标

    _handCardsNode  : null,         // 手牌对象节点
    _handCards      : null,         // 手牌对象

    _base           : null,         // 底分
    _multiple       : null,         // 倍数
    _beanAdd        : null,         // 加金贝
    _beanMinus      : null,         // 减金贝

    ctor : function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init : function () {
        this._headPic = new GameWindowBasic.GameHeadPic(game.findUI(this._node, "ND_HeadPic"));
        this._name = game.findUI(this._node, "ND_Name");
        this._ID = game.findUI(this._node, "ND_ID");

        this._diZhuTag = game.findUI(this._node, "SP_DiZhu");
        this._farmerTag = game.findUI(this._node, "SP_Farmer");
        this._fzTag = game.findUI(this._node, "SP_FZ");

        this._handCards = new GameWindowDouDiZhu.HandCards3(game.findUI(this._node, "ND_HandCards"));

        this._base = game.findUI(this._node, "TXT_Base");
        this._multiple = game.findUI(this._node, "TXT_Multiple");
        this._beanAdd = game.findUI(this._node, "Fnt_AddBean");
        this._beanMinus = game.findUI(this._node, "Fnt_MinusBean");

        this.reset();
    },

    reset : function () {
        // this._name.setString("斗地主");
        // this._ID.setString("ID:666666");
        this._fzTag.setVisible(false);
        this._handCards.reset();
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
        var gameData = game.procedure.DouDiZhu.getGameData();
        this.showDealer(gameData.dealer == info.index);
        this._fzTag.setVisible(gameData.creator == info.uid);
    },

    /**
     * 设置游戏相关数据
     * @param info
     */
    setGameInfo : function (info) {
        var gameData = game.procedure.DouDiZhu.getGameData();

        if(gameData.dealer == info.index){
            this._multiple.setString("" + info.multiple * 2);
        }
        else{
            this._multiple.setString("" + info.multiple );
        }

        var bean = Utils.formatCoin2(info.baseBean);
        this._base.setString(bean);
        var roundBean = info.roundBean;
        this.setRoundBean(roundBean);
        this._handCards.setCardsValues(info.handCards, gameData.dealer == info.index);
        this._handCards.setColouredCardsValues(info.outCards);
    },

    /**
     * 显示地主图片
     * @param bool
     * @private
     */
    showDealer : function (bool) {
        this._diZhuTag.setVisible(bool);
        this._farmerTag.setVisible(!bool);
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
        var bean = Utils.formatCoin(Math.abs(num));
        // cc.log("============> " + bean);
        this._beanAdd.setString("J" + bean);
        this._beanMinus.setString("J" + bean);
    }
});