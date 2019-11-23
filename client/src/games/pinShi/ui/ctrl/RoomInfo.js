/**
 * Created by lyndon on 2018/05/16.
 */
// 拼三张房间信息
GameWindowPinShi.RoomInfo = cc.Class.extend({

    _node           : null,         // 本节点
    _parentNode     : null,         // 父节点

    _anteLabel      : null,         // 底分

    _imgRob1        : null,         // 看牌抢庄图片
    _imgRob2        : null,         // 自由抢庄图片
    _imgMod1        : null,         // 普通模式图片
    _imgMod2        : null,         // 德州模式图片

    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinShi/RoomInfo/RoomInfo.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        
        return true;
    },

    _init : function () {

        this._anteLabel = game.findUI(this._node, "Fnt_Ante");

        this._imgRob1 = game.findUI(this._node, "ND_Rob_1");
        this._imgRob2 = game.findUI(this._node, "ND_Rob_2");
        this._imgMod1 = game.findUI(this._node, "ND_Mod_1");
        this._imgMod2 = game.findUI(this._node, "ND_Mod_2");

        this.setRob();
        this.setMod();
    },

    reset : function () {
        this.setAnte(0);
        this._imgRob1.setVisible(false);
        this._imgRob2.setVisible(false);
        this._imgMod2.setVisible(false);
        this._imgMod2.setVisible(false);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },
    /**
     * 设置底分
     * @param ante
     */
    setAnte: function (ante) {
        ante = Utils.formatCoin(ante);
        this._anteLabel.setString("" + ante);
    },
    /**
     * 设置抢庄规则
     */
    setRob: function (subType) {
        if (subType == 1) {
            this._imgRob1.setVisible(true);
            this._imgRob2.setVisible(false);
        } else if (subType == 2) {
            this._imgRob1.setVisible(false);
            this._imgRob2.setVisible(true);
        }
    },
    /**
     * 设置玩法模式
     */
    setMod: function (mod) {
        this._imgMod1.setVisible(!mod);
        this._imgMod2.setVisible(mod);
    }

});
