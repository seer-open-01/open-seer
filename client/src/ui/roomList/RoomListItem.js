/**
 * Created by lyndon on 2019-07-31
 */

// 自由匹配场Item
game.ui.RoomListWindow.Item = cc.Class.extend({
    _node           : null,         // 本节点
    _btnEnter       : null,         // 选择的按钮
    _picName        : null,         // 匹配场名称的图片
    _picStatus      : null,         // 场次人数状态
    _txtRule        : null,         // 规则
    _fntBase        : null,         // 底注分数
    _fntEnter       : null,         // 准入分数

    _matchId        : 0,            // 本节点保存的matchId的值

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init: function () {
        this._btnEnter = game.findUI(this._node, "BTN_Enter");
        this._picStatus = game.findUI(this._btnEnter, "ND_Status");
        this._picName = game.findUI(this._btnEnter, "ND_Name");
        this._txtRule = game.findUI(this._btnEnter, "ND_Rule");
        this._fntBase = game.findUI(this._btnEnter, "Fnt_Base");
        this._fntEnter = game.findUI(this._btnEnter, "Fnt_Enter");
    },
    // 设置显示信息
    setInfo: function (data) {
        this._matchId = data.matchId;
        var matchName = data.matchName;
        this._picName.setTexture("res/RoomList/Image/Item_Match" + (matchName) + ".png");
        // 底分
        var bean = Utils.formatCoin(data.baseBean);
        this._fntBase.setString("d" + bean);
        // 准入
        var enter = Utils.formatCoin(data.enterBean);
        this._fntEnter.setString("c" + enter + "z");
        // 人数
        var status = 2;// 流畅
        if (!data.isOpen) {
            status = 1;// 没有开放
        }
        if (data.isOpen && data.headCount > 10) {
            status = 3;// 火爆
        }
        this._picStatus.loadTexture("res/RoomList/Image/Item_Status" + status + ".png");
        // 场次是否被锁
        this._btnEnter.setEnabled(data.isOpen);
        // 规则描述
        var ruleStr = "";
        if (data.gameType == 1 || data.gameType == 8) {
            if (data.subType == 1) {
                ruleStr += "两人模式";
            }else {
                ruleStr += "四人模式";
            }
            ruleStr += "（封顶" + Utils.formatCoin2(data.maxBean) + "）";
        }else if (data.gameType == 2) {
            if (data.subType == 1) {
                ruleStr += "普通模式";
            }else {
                ruleStr += "不洗牌模式";
            }
            ruleStr += "（封顶" + data.maxBean + "倍）";
        }else if (data.gameType == 4) {
            if (data.subType == 1) {
                ruleStr += "普通模式";
            }else {
                ruleStr += "激情模式";
            }
            if (data.opts['BMSL']) {
                ruleStr += "（必闷三轮）";
            }else {
                ruleStr += "（普通玩法）"
            }
        }else if (data.gameType == 5) {
            if (data.subType == 1) {
                ruleStr += "看牌抢庄";
            }else {
                ruleStr += "自由抢庄";
            }
            if (data.opts['TEXAS']) {
                ruleStr += "（炸弹 同花 葫芦 顺子 ...）";
            }else{
                ruleStr += "（普通牌型）";
            }
        }else if (data.gameType == 7) {
            if (data.subType == 1) {
                ruleStr += "三人模式";
            }else {
                ruleStr += "四人模式";
            }
            ruleStr += "（1 2 4 6倍）";
        }

        this._txtRule.setString(ruleStr);
    },
    // 场次按钮
    onSelectClick: function (callback) {
        this._btnEnter.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback(this._matchId);
                sender.setScale(1);
            }else if (type == ccui.Widget.TOUCH_BEGAN) {
                sender.setScale(0.95);
            }else if (type == ccui.Widget.TOUCH_ENDED) {
                sender.setScale(1);
            }
        }, this);
    },
    // 获取本节点
    getNode: function () {
        return this._node;
    }
});
// 自建房入口Item
game.ui.RoomListWindow.Item2 = cc.Class.extend({
    _node           : null,         // 本节点
    _btnEnter       : null,         // 选择的按钮
    _txtRule        : null,         // 规则
    _fntBase        : null,         // 底注分数
    _fntEnter       : null,         // 准入分数
    _lock           : null,         // 是否开放
    _roomId         : null,         // 房间号
    _pArr           : [],           // 人头数组
    _data           : null,
    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },
    
    _init: function () {
        this._btnEnter = game.findUI(this._node, "BTN_Enter");
        this._txtRule = game.findUI(this._btnEnter, "ND_Rule");
        this._fntBase = game.findUI(this._btnEnter, "Fnt_Base");
        this._fntEnter = game.findUI(this._btnEnter, "Fnt_Enter");
        this._lock = game.findUI(this._btnEnter, "ND_Lock");
        this._roomId = game.findUI(this._lock, "rid");
        this._node.setVisible(false);

        this._pArr = [];
        var p_nd = game.findUI(this._node, "ND_People");
        for (var i = 1; i <= 6; ++i) {
            var temp = game.findUI(p_nd, "ND_" + i);
            this._pArr.push(temp);
        }


        this.registerClick();
    },

    // 场次按钮
    registerClick: function () {
        this._btnEnter.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                if (this._data['isPub']) {
                    game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_GET_ROOM_ADDR, {rid: this._data.roomId});
                }else {
                    cc.log("请输入房间号！！");
                    game.ui.HallJoinWin.popup();
                }
                sender.setScale(1);
            }else if (type == ccui.Widget.TOUCH_BEGAN) {
                sender.setScale(0.95);
            }else if (type == ccui.Widget.TOUCH_ENDED) {
                sender.setScale(1);
            }
        }, this);
    },

    setInfo: function (data) {
        if (!data) {
            return;
        }
        this._data = data;
        // 房间ID
        this._roomId.setString("" + data.roomId);
        // 是否上锁
        if (data['isPub']) {
            this._lock.setTexture("res/RoomList/Image/Item_Lock2.png");
            this._roomId.setVisible(true);
        }else {
            this._lock.setTexture("res/RoomList/Image/Item_Lock1.png");
            this._roomId.setVisible(false);
        }
        // 底分
        var bean = Utils.formatCoin(data.baseBean);
        this._fntBase.setString("d" + bean);
        // 准入
        var enter = Utils.formatCoin(data.enterBean);
        this._fntEnter.setString("c" + enter + "z");
        // 规则描述
        var ruleStr = "";
        if (data.gameType == 1 || data.gameType == 8) {
            if (data.subType == 1) {
                ruleStr += "两人模式\n";
            }else {
                ruleStr += "四人模式\n";
            }
            ruleStr += "（封顶" + Utils.formatCoin2(data.maxBean) + "）";
        }else if (data.gameType == 2) {
            if (data.subType == 1) {
                ruleStr += "普通模式\n";
            }else {
                ruleStr += "不洗牌模式\n";
            }
            ruleStr += "（封顶" + data.opts['max'] + "倍）";
        }else if (data.gameType == 4) {
            if (data.subType == 1) {
                ruleStr += "普通模式\n";
            }else {
                ruleStr += "激情模式\n";
            }
            if (data.opts['BMSL']) {
                ruleStr += "（必闷三轮）";
            }else {
                ruleStr += "（普通玩法）"
            }
        }else if (data.gameType == 5) {
            if (data.subType == 1) {
                ruleStr += "看牌抢庄\n";
            }else {
                ruleStr += "自由抢庄\n";
            }
            if (data.opts['TEXAS']) {
                ruleStr += "（炸弹 同花 葫芦 顺子 ...）";
            }else{
                ruleStr += "（普通牌型）";
            }
        }else if (data.gameType == 7) {
            if (data.subType == 1) {
                ruleStr += "三人模式\n";
            }else {
                ruleStr += "四人模式\n";
            }
            ruleStr += "（1 2 4 6倍）";
        }
        this._txtRule.setString(ruleStr);
        // 设置可见
        this._node.setVisible(true);
        this._btnEnter.setEnabled(true);
        // 初始化人物状态
        this.initPeopleStatus();
    },

    initPeopleStatus: function () {
        var max = this._data['maxNum'];
        var cur = this._data['curNum'];
        // 2 [-15, 15]
        // 3 [-30, 0, 30]
        // 4 [-45, -15, 15, 45]
        // 5 [-60, -30, 0, 30, 60]
        // 6 [-75, -45, -15, 15, 45, 75]
        for (var i = 0; i < this._pArr.length; ++ i) {
            if (i < max) {
                this._pArr[i].setVisible(true);
            }else {
                this._pArr[i].setVisible(false);
            }

            var path = "res/RoomList/Image/Item_People";
            if (i < cur) {
                this._pArr[i].setTexture(path + 2 + ".png");
            }else {
                this._pArr[i].setTexture(path + 1 + ".png");
            }

            var bPos = -15 * (max - 1);
            this._pArr[i].setPositionX(bPos + 30 * i);
        }
    },

    getNode: function () {
        return this._node;
    }
});