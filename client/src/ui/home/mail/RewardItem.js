/**
 * Created by lyndon on 2017.12.21.
 */
// 奖品条目
game.ui.MailWindow.RewardItme = cc.Class.extend({
    _parentNode     : null,
    _node           : null,
    _reward         : null,
    _fntNum         : null,
    _data           : null,

    ctor: function (node, data) {
        this._parentNode = node;
        this._node = ccs.load("res/Home/Mail/RewardItem.json").node;
        this._data = data;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {
        this._reward = game.findUI(this._node, "ND_Reward");
        this._fntNum = game.findUI(this._node, "Fnt_Num");

        this._data && this._setInfo();
    },
    /**
     * 设置获奖情况
     */
    _setInfo: function () {
        var type = this._data.id;
        var num = Utils.formatCoin2(this._data.num);
        var path = "res/Common/Images/reward_" + type + ".png";
        this._reward.setTexture(path);
        this._fntNum.setString("x" + num);
    },

    getNode: function () {
        return this._node;
    }
});