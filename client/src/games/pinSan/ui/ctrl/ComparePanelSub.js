/**
 * Created by Jiyou Mo on 2017/12/7.
 */
// 比牌选择面板玩家信息
GameWindowPinSan.ComparePanelPlayer = cc.Class.extend({

    _node               : null,         // 本节点

    _headPic            : null,         // 头像管理图片
    _labelName          : null,         // 玩家昵称
    _labelCash          : null,         // 金贝
    _imgAnteBG          : null,         // 出的筹码背景
    _labelAnte          : null,         // 出的筹码数量
    _handCardsNode      : null,         // 手牌节点

    ctor : function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init : function () {
        this._headPic = new GameWindowBasic.GameHeadPic(game.findUI(this._node, "ND_HeadPic"));
        this._labelName = game.findUI(this._node, "ND_Name");
        this._labelCash = game.findUI(this._node, "ND_Bean");
        this._imgAnteBG = game.findUI(this._node, "ND_PlayerAnte");
        this._labelAnte = game.findUI(this._imgAnteBG, "Fnt_Ante");
        this._handCardsNode = game.findUI(this._node, "ND_HandCards");
    },

    reset : function () {
        this._labelName.setString("未查到");
        this._labelCash.setString("未查到");
        this._imgAnteBG.setVisible(false);
        this._labelAnte.setVisible(false);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置玩家信息
     * @param info
     */
    setInfo : function (info) {
        this._headPic.setHeadPic(info.headPic);
        var name = info.name;
        if (name.length > 4) {
            name = name.substring(0, 3) + "...";
        }
        this._labelName.setString(name);
        var bean = Utils.formatCoin(info.bean);
        var ante = Utils.formatCoin(info.ante);
        this._labelCash.setString(bean);
        this._labelAnte.setString(ante);
        this._imgAnteBG.setVisible(info.ante > 0);
    }
});