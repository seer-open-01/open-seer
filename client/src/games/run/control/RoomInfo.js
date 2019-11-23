/**
 * Author       : lyndon
 * Date         : 2019-05-15
 * Description  : 跑得快房间信息
 */
WindowRun.RoomInfo = cc.Class.extend({

    _parentNode             : null,         // 父节点
    _node                   : null,         // 本节点

    _fntAnte                : null,         // 底分
    _imgMod_1               : null,         // 三人模式
    _imgMod_2               : null,         // 四人模式
    _imgMax_1               : null,         // 1,2,4,6
    _imgMax_2               : null,         // 2,4,6,8

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/Run/RoomInfo/RoomInfo.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {
        this._fntAnte = game.findUI(this._node, "Fnt_Ante");
        this._imgMod_1 = game.findUI(this._node, "ND_Mode_1");
        this._imgMod_2 = game.findUI(this._node, "ND_Mode_2");
        this._imgMax_1 = game.findUI(this._node, "ND_Max_1");
        this._imgMax_2 = game.findUI(this._node, "ND_Max_2");
        this.setMod(-1);
    },

    reset: function () {
        this.setMod(-1);
        this.setAnte(0);
    },
    /**
     * 底分
     * @param ante
     */
    setAnte: function (ante) {
        ante = Utils.formatCoin(ante);
        this._fntAnte.setString("" + ante);
    },
    /**
     * 设置模式
     * @param mod
     */
    setMod: function (mod) {
        this._imgMod_1.setVisible(mod == 1);
        this._imgMod_2.setVisible(mod == 2);
    },
    /**
     * 设置倍数
     * @param max
     */
    setMax: function (max) {
        this._imgMax_1.setVisible(max == 1);
        this._imgMax_2.setVisible(max == 2);
    }
});