/**
 * Created by lyndon on 2018/06/11.
 *  单条战绩控件
 */
// 麻将  作为基类
game.ui.ReportItem = cc.Class.extend({
    _node           : null,

    _data           : null,
    _labelTime      : null,
    _labelRid       : null,
    _players        : [],
    _id             : null,  //这条预制体的唯一编号，点击查看的时候回传这个数据给服务器

    ctor: function (data) {
        this._node = ccs.load("res/Home/Report/ReportItem_2.json").node;
        this._data = data;
        this._id = this._data.id;
        this._init();
        return true;
    },

    _init: function () {
        this._players = [];
        var temp = null;
        for (var i = 1; i <= 4; i++) {
            temp = new game.ui.ReportPlayer(game.findUI(this._node, "ND_Player_" + i));
            this._players.push(temp);
        }

        this._labelTime = game.findUI(this._node, "TXT_Time");
        this._labelRid = game.findUI(this._node, "TXT_RoundId");

        this._data && this._setInfo();
    },
    _setInfo: function () {
        // 时间戳
        var date = new Date(this._data["time"]);
        var str = date.format("yyyy-MM-dd  hh:mm");
        if (this._data['mode'] == "FK") {
            str += "         自建房间        ";
            str += "房间号:" + this._data['roomId'] + "   第" + this._data['curRound'] + "局";
        } else {
            str += "         随机匹配        ";
        }
        this._labelTime.setString("时间:" + str);
        this._labelRid.setString("牌局号:" + this._data.roundId);
        // 玩家
        var players = this._data.players;
        // cc.log("============================ " + JSON.stringify(players));
        for (var i = 0; i < this._players.length; ++i) {

            if (i >= players.length) {
                this._players[i].reset();
            } else {
                this._players[i].setInfo(players[i], this._data.dealer, this._data.creator);
                this._players[i].show(true);
            }

        }
    },
    getNode: function () {
        return this._node;
    }
});
// 斗地主战绩
game.ui.ReportItem2 = game.ui.ReportItem.extend({
    ctor: function (data) {
        this._node = ccs.load("res/Home/Report/ReportItem_1.json").node;
        this._data = data;
        this._id = this._data.id;
        this._init();
        return true;
    },

    _init: function () {
        this._players = [];
        var temp = null;
        for (var i = 1; i <= 3; i++) {
            temp = new game.ui.ReportDiZhuPlayer(game.findUI(this._node, "ND_Player_" + i));
            this._players.push(temp);
        }

        this._labelTime = game.findUI(this._node, "TXT_Time");
        this._labelRid = game.findUI(this._node, "TXT_RoundId");

        this._data && this._setInfo();
    }
});
// 拼三战绩
game.ui.ReportItem3 = game.ui.ReportItem.extend({
    ctor: function (data) {
        this._node = ccs.load("res/Home/Report/ReportItem_3.json").node;
        this._data = data;
        this._init();

        return true;
    },

    _init: function () {
        this._players = [];
        var temp = null;
        for (var i = 1; i <= 6; i++) {
            temp = new game.ui.ReportPinSanPlayer(game.findUI(this._node, "ND_Player_" + i));
            this._players.push(temp);
        }

        this._labelTime = game.findUI(this._node, "TXT_Time");
        this._labelRid = game.findUI(this._node, "TXT_RoundId");

        this._data && this._setInfo();
    }
});
// 拼十战绩
game.ui.ReportItem4 = game.ui.ReportItem.extend({
    ctor: function (data) {
        this._node = ccs.load("res/Home/Report/ReportItem_4.json").node;
        this._data = data;
        this._init();

        return true;
    },

    _init: function () {
        this._players = [];
        var temp = null;
        for (var i = 1; i <= 6; i++) {
            temp = new game.ui.ReportPinShiPlayer(game.findUI(this._node, "ND_Player_" + i));
            this._players.push(temp);
        }

        this._labelTime = game.findUI(this._node, "TXT_Time");
        this._labelRid = game.findUI(this._node, "TXT_RoundId");

        this._data && this._setInfo();
    }
});
// 跑的快战绩
game.ui.ReportItem5 = game.ui.ReportItem.extend({
    ctor: function (data) {
        this._node = ccs.load("res/Home/Report/ReportItem_5.json").node;
        this._data = data;
        this._init();

        return true;
    }
});

// 血战战绩
game.ui.ReportItem6 = game.ui.ReportItem.extend({
    ctor: function (data) {
        this._node = ccs.load("res/Home/Report/ReportItem_6.json").node;
        this._data = data;
        this._init();

        return true;
    }
});

