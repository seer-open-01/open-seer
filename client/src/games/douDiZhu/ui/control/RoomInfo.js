/**
 * Created by lyndon on 2017/11/26.
 */
// 房间信息类

GameWindowDouDiZhu.RoomInfo = cc.Class.extend({

    _parentNode             : null,         // 父节点
    _node                   : null,         // 本节点

    _fntAnte                : null,         // 底分
    _imgMod_1               : null,         // 普通模式
    _imgMod_2               : null,         // 不洗牌模式
    _imgMax_1               : null,         // 32倍封顶
    _imgMax_2               : null,         // 64倍封顶
    _imgMax_3               : null,         // 8倍封顶
    _imgMax_4               : null,         // 16倍封顶
    _imgMax_5               : null,         // 不封顶

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/RoomInfo/RoomInfo.json").node;
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
        this._imgMax_3 = game.findUI(this._node, "ND_Max_3");
        this._imgMax_4 = game.findUI(this._node, "ND_Max_4");
        this._imgMax_5 = game.findUI(this._node, "ND_Max_5");

        this.setMod(-1);
        this.setMax(-1);
    },

    reset: function () {
        this.setMod(-1);
        this.setMax(-1);
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
        this._imgMod_1.setVisible(false);
        this._imgMod_2.setVisible(false);
        if (mod == 1) {
            this._imgMod_1.setVisible(true);
        }else if (mod == 2) {
            this._imgMod_2.setVisible(true);
        }
    },
    /**
     * 设置封顶
     * @param max
     */
    setMax: function (max) {
        this._imgMax_1.setVisible(false);
        this._imgMax_2.setVisible(false);
        this._imgMax_3.setVisible(false);
        this._imgMax_4.setVisible(false);
        this._imgMax_5.setVisible(false);
        if (max == 32) {
            cc.log("封顶32 ===》");
            this._imgMax_1.setVisible(true);
        }else if (max == 64) {
            cc.log("封顶64 ===》");
            this._imgMax_2.setVisible(true);
        }
        else if(max == 8){
            cc.log("封顶8 ===》");
            this._imgMax_3.setVisible(true);
        }
        else if(max == 16){
            cc.log("封顶16 ===》");
            this._imgMax_4.setVisible(true);
        }
        else if(max == 999){
            cc.log("不封顶 ===》");
            this._imgMax_5.setVisible(true);
        }
    }
});