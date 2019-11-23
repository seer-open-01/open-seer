/**
 * Created by fuyang on 2018/10/24.
 */


//房卡场麻将战绩详情玩家信息

game.ui.ReportDetailsPlayer = cc.Class.extend({

    _node               : null,
    _imgDealer          : null,         // 庄家图片
    _textName           : null,         // 玩家名字
    _textScore          : null,         // 玩家得分

    ctor: function (node) {
        this._node = node;
        this._init();

        return true;
    },
    _init: function () {
        this._textName = game.findUI(this._node, "ND_TextName");
        this._imgDealer = game.findUI(this._node, "ND_Dealer");
        this._textScore = game.findUI(this._node, "ND_TextScore");
    },
    setInfo: function (info, dealer) {

        var name = info.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._textName.setString(name);
        var score = "" + info.score;
        if (score > 0) {
            score = "+" + score;
        }
        this._textScore.setString(score);

        // 设置庄家
        this._imgDealer.setVisible(dealer == info.uid);

        // 本玩家显示高亮
        if (game.DataKernel.uid == info.uid) {
            this._textScore.setColor(cc.color(232, 122, 46));
            this._textName.setColor(cc.color(232, 122, 46));
        }else {
            this._textScore.setColor(cc.color(145, 69, 16));
            this._textName.setColor(cc.color(145, 69, 16));
        }
    },
    reset: function () {
        this._textScore.setString("");
        this._textName.setString("");
        this._imgDealer.setVisible(false);
        this.show(false);
    },
    show: function (show) {
        this._node.setVisible(show);
    },
    getNode:function(){
        return this._node;
    },
});
