/**
 * Created by pander on 2018/5/17.
 */
// ==== 麻将游戏 底分控件 =============================================
GameWindowMahjong.BaseScore = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点

    _nd1                : null,         // 金币场节点
    _fntBaseScore       : null,         // 底分文字

    _nd2                : null,         // 房卡场节点
    _labelRule          : null,         // 房卡场规则描述

    ctor : function (parentNode) {
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/BaseScore/BaseScore.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {

        this._nd1 = game.findUI(this._node, "ND_1");
        this._fntBaseScore = game.findUI(this._nd1, "FNT_Base");
        this._nd2 = game.findUI(this._node, "ND_2");
        this._labelRule = game.findUI(this._nd2, "txt");
    },

    reset : function () {

    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    setBaseInfo: function () {
        var gameData = game.procedure.Mahjong.getGameData();
        var baseBean = gameData.baseBean || 0;
        var enterBean = gameData.enterBean || 0;
        var base = Utils.formatCoin(baseBean);
        var enter = Utils.formatCoin(enterBean);
        this._fntBaseScore.setString("d" + base + "z" + enter);
        var opts = gameData.options;
        var str = "";
        if (gameData.gameType == 1) {
            if (opts.isYF) {
                str += " 有番"
            }else {
                str += " 无番"
            }
            if (opts.isZX) {
                str += " 庄闲"
            }
            if (opts.isLZ) {
                str += " 连庄"
            }
            if (opts.isZYSG) {
                str += " 自由上噶"
            }
            if (opts.isLJSF) {
                str += " 流局算分"
            }
            if (opts.isHH) {
                str += " 花胡"
            }
            if (opts.isJL) {
                str += " 叫令"
            }
            if (opts.isWFP) {
                str += " 无字牌"
            }
            if (opts.isBKC) {
                str += " 不可吃"
            }
        }else {
            if (opts.ZMJF) {
                str += " 自摸加番"
            }else {
                str += " 自摸加底"
            }
            if (opts.DGHZM) {
                str += " 点杠花当自摸"
            } else {
                str += " 点杠花当点炮"
            }
            if (opts.HSZ) {
                str += " 换三张"
            }
            if (opts.MQZZ) {
                str += " 门清中张"
            }
            if (opts.JD19) {
                str += " 幺九将对"
            }

            str += " 天地胡"
        }

        this._labelRule.setString(str);
    }
});