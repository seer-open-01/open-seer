/**
 * Created by lyndon on 2017/07/16.
 */
// 拼三张房间信息
GameWindowPinSan.RoomInfo = cc.Class.extend({

    _node           : null,         // 本节点
    _parentNode     : null,         // 父节点

    _turnLabel      : null,         // 轮数
    _maxLabel       : null,         // 单注封顶
    _anteLabel      : null,         // 底分

    _rule_1         : null,         // 规则1
    _mod_1          : null,         // 模式1
    _rule_2         : null,         // 规则2
    _mod_2          : null,         // 模式2

    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinSan/RoomInfo/RoomInfo.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {
        this._turnLabel = game.findUI(this._node, "Fnt_Round");
        this._maxLabel = game.findUI(this._node, "Fnt_Max");
        this._anteLabel = game.findUI(this._node, "Fnt_Ante");

        this._rule_1 = game.findUI(this._node, "Rule_1");
        this._mod_1 = game.findUI(this._rule_1, "mod");
        this._rule_2 = game.findUI(this._node, "Rule_2");
        this._mod_2 = game.findUI(this._rule_2, "mod");

    },

    reset : function () {
        this.setTurn(0, 0);
        this.setMax(0);
        this.setAnte(0);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置轮数
     * @param curTurn
     * @param turn
     */
    setTurn : function (curTurn, turn) {
        this._turnLabel.setString(curTurn + "g" + turn);
    },

    /**
     * 设置单注封顶倍数
     * @param maxNum
     */
    setMax : function (maxNum) {
        maxNum = Utils.formatCoin(maxNum);
        this._maxLabel.setString(maxNum);
    },

    /**
     * 设置底分
     * @param ante
     */
    setAnte : function (ante) {
        ante = Utils.formatCoin(ante);
        this._anteLabel.setString(ante);
    },

    /**
     * 设置游戏模式描述
     */
    setMod: function () {
        var gameData = game.procedure.PinSan.getGameData();
        var subType = gameData.subType;
        var isMen = gameData.options.BMSL;
        this._rule_1.setVisible(false);
        this._rule_2.setVisible(false);
        var path = "res/Games/PinSan/Image/";
        if (subType == 1) {
            path += "RoomInfo_5.png";
        }else {
            path += "RoomInfo_4.png";
        }

        if (isMen) {
            this._rule_2.setVisible(true);
            this._mod_2.setTexture(path);
        }else {
            this._rule_1.setVisible(true);
            this._mod_1.setTexture(path);
        }
    }
});
