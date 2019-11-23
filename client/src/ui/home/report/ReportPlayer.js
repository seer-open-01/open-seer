/**
 * Created by lyndon on 2018/06/11.
 *  战绩玩家
 */

game.ui.ReportPlayer = cc.Class.extend({
    _node               : null,

    _label              : null,         // 昵称+分数的label
    _imgDealer          : null,         // 庄家图片
    _imgCreator         : null,         // 庄家图片
    _cards              : null,         // 手牌

    ctor: function (node) {
        this._node = node;
        this._init();

        return true;
    },

    _init: function () {
        this._label = game.findUI(this._node, "ND_Text");
        this._imgDealer = game.findUI(this._node, "ND_Dealer");
        this._imgCreator = game.findUI(this._node, "ND_FZ");
    },

    setInfo: function (info, dealer, creator) {

        var name = info.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }

        var num = +info.roundBean;
        num = Utils.formatCoin2(Math.abs(num));
        if (+info.roundBean < 0) {
            num = "-" + num;
        }

        var str = name + "      " + num;
        this._label.setString(str);

        // 设置庄家
        this._imgDealer.setVisible(dealer == info.uid);
        // 设置房主
        this._imgCreator.setVisible(creator == info.uid);

        // 本玩家显示高亮
        if (game.DataKernel.uid == info.uid) {
            this._label.setColor(cc.color(232, 122, 46));
        }else {
            this._label.setColor(cc.color(145, 69, 16));
        }
    },

    reset: function () {
        this._label.setString("");
        this._imgDealer.setVisible(false);
        this.show(false);
    },

    show: function (show) {
        this._node.setVisible(show);
    },

    getCards: function () {
        return this._cards;
    }
});
// 斗地主玩家
game.ui.ReportDiZhuPlayer = game.ui.ReportPlayer.extend({

    setInfo: function (info, dealer, creator) {
        var name = info.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }

        var num = +info.roundBean;
        num = Utils.formatCoin2(Math.abs(num));
        if (info.roundBean < 0) {
            num = "-" + num;
        }

        var str = name + "\n" + num;
        this._label.setString(str);

        // 设置庄家
        this._imgDealer.setVisible(dealer == info.uid);
        // 设置房主
        this._imgCreator.setVisible(creator == info.uid);

        // 本玩家显示高亮
        if (game.DataKernel.uid == info.uid) {
            this._label.setColor(cc.color(232, 122, 46));
        }else {
            this._label.setColor(cc.color(145, 69, 16));
        }
    }
});
// 三张玩家
game.ui.ReportPinSanPlayer = game.ui.ReportPlayer.extend({

    _init: function () {
        this._super();
        this._cards = new game.ui.ReportCards(game.findUI(this._node, "ND_Cards"), 1);
    },

    setInfo: function (info, dealer, creator) {
        this._super(info, dealer, creator);

        this._cards.setCardsValue(info.handCards);
        this._cards.setCardPattern(info.type);

    },

    reset: function () {
        this._super();
        this._cards.reset();
    }
});
// 拼十玩家
game.ui.ReportPinShiPlayer = game.ui.ReportPlayer.extend({

    _init: function () {
        this._super();
        this._cards = new game.ui.ReportCards(game.findUI(this._node, "ND_Cards"), 2);
    },

    setInfo: function (info, dealer, creator) {
        this._super(info, dealer, creator);

        this._cards.setCardsValue(info.handCards);
        this._cards.setCardPattern(info.type);

    },

    reset: function () {
        this._super();
        this._cards.reset();
    }
});