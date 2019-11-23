/**
 * Author       : lyndon
 * Date         : 2018-10-16
 * Description  : 大厅创建房间配置选择界面
 */
// 麻将的设置选项作为基类
game.ui.CreateOpts = cc.Class.extend({

    _parentNode     : null,
    _node           : null,
    _bkc            : null,
    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Home/RoomCard/Option_1.json").node;
        this._node.retain();
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    _init: function () {
        this._nd1 = game.findUI(this._node, "ND_1");
        this._nd2 = game.findUI(this._node, "ND_2");
        this._nd3 = game.findUI(this._node, "ND_3");
        this._nd4 = game.findUI(this._node, "ND_4");

        this.registerOptsCheck();
    },

    registerOptsCheck: function () {
        this._bkc = game.findUI(this._nd4, "CheckBox_6");
        // 游戏子类型配置
        var sub_sel = [];
        sub_sel[0] = {ctrl: game.findUI(this._nd1, "CheckBox_1"), value: 2};
        sub_sel[1] = {ctrl: game.findUI(this._nd1, "CheckBox_2"), value: 1};
        this.group1 = new game.ui.RadioGroup("sub_sel", sub_sel, 0, function (sel) {
            this._bkc.setSelected(sel.value == 1);
            this._bkc.setEnabled(sel.value != 1);
        }.bind(this));

        var max_sel = [];
        max_sel[0] = {ctrl: game.findUI(this._nd2, "CheckBox_1"), value: 40};
        max_sel[1] = {ctrl: game.findUI(this._nd2, "CheckBox_2"), value: 26};
        this.group2 = new game.ui.RadioGroup("max_sel", max_sel, 0, function (sel) {
        }.bind(this));

        // 翻倍规则
        var fan_sel = [];
        fan_sel[0] = {ctrl: game.findUI(this._nd3, "CheckBox_1"), value: true};
        fan_sel[1] = {ctrl: game.findUI(this._nd3, "CheckBox_2"), value: false};
        this.group3 = new game.ui.RadioGroup("fan_sel", fan_sel, 0, function (sel) {
        }.bind(this));

    },

    getOpts: function () {
        var opts = {};
        opts.subType = this.group1.getSelected().value;
        opts.max = this.group2.getSelected().value;
        opts.isYF = this.group3.getSelected().value;

        opts.isLJSF = game.findUI(this._nd4, "CheckBox_1").isSelected();
        opts.isLZ = game.findUI(this._nd4, "CheckBox_2").isSelected();
        opts.isZYSG = game.findUI(this._nd4, "CheckBox_3").isSelected();
        opts.isZX = game.findUI(this._nd4, "CheckBox_4").isSelected();
        opts.isHH = game.findUI(this._nd4, "CheckBox_5").isSelected();
        opts.isBKC = game.findUI(this._nd4, "CheckBox_6").isSelected();
        opts.isWFP = game.findUI(this._nd4, "CheckBox_7").isSelected();
        opts.isJL = game.findUI(this._nd4, "CheckBox_8").isSelected();

        return opts;
    }
});
// 拼十
game.ui.CreateOpts2 = game.ui.CreateOpts.extend({
    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Home/RoomCard/Option_2.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    registerOptsCheck: function () {
        // 游戏子类型配置
        var sub_sel = [];
        sub_sel[0] = {ctrl: game.findUI(this._nd1, "CheckBox_1"), value: 1};
        sub_sel[1] = {ctrl: game.findUI(this._nd1, "CheckBox_2"), value: 2};
        this.group1 = new game.ui.RadioGroup("sub_sel", sub_sel, 0, function (sel) {
        }.bind(this));


        // 模式选择
        var mod_sel = [];
        mod_sel[0] = {ctrl: game.findUI(this._nd2, "CheckBox_1"), value: false};
        mod_sel[1] = {ctrl: game.findUI(this._nd2, "CheckBox_2"), value: true};
        this.group2 = new game.ui.RadioGroup("mod_sel", mod_sel, 0, function (sel) {
        }.bind(this));
    },

    getOpts: function () {
        var opts = {};
        opts.subType = this.group1.getSelected().value;
        opts.TEXAS = this.group2.getSelected().value;
        return opts;
    }
});

// 拼三
game.ui.CreateOpts3 = game.ui.CreateOpts.extend({
    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Home/RoomCard/Option_3.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    registerOptsCheck: function () {
        // 游戏子类型配置
        var sub_sel = [];
        sub_sel[0] = {ctrl: game.findUI(this._nd1, "CheckBox_1"), value: 1};
        sub_sel[1] = {ctrl: game.findUI(this._nd1, "CheckBox_2"), value: 2};
        this.group1 = new game.ui.RadioGroup("sub_sel", sub_sel, 0, function (sel) {
        }.bind(this));

        // 模式选择
        var mod_sel = [];
        mod_sel[0] = {ctrl: game.findUI(this._nd2, "CheckBox_1"), value: 20};
        mod_sel[1] = {ctrl: game.findUI(this._nd2, "CheckBox_2"), value: 10};
        this.group2 = new game.ui.RadioGroup("mod_sel", mod_sel, 0, function (sel) {
        }.bind(this));
    },

    getOpts: function () {
        var opts = {};
        opts.subType = this.group1.getSelected().value;
        opts.round = this.group2.getSelected().value;
        opts.BMSL = game.findUI(this._nd3, "CheckBox_1").isSelected();
        return opts;
    }
});

// 斗地主
game.ui.CreateOpts4 = game.ui.CreateOpts.extend({
    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Home/RoomCard/Option_4.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    registerOptsCheck: function () {
        // 游戏子类型配置
        var max_sel = [];
        max_sel[0] = {ctrl: game.findUI(this._nd1, "CheckBox_1"), value: 32};
        max_sel[1] = {ctrl: game.findUI(this._nd1, "CheckBox_2"), value: 64};
        this.group1 = new game.ui.RadioGroup("max_sel", max_sel, 0, function (sel) {
        }.bind(this));


        // 模式选择
        var mod_sel = [];
        mod_sel[0] = {ctrl: game.findUI(this._nd2, "CheckBox_1"), value: 1};
        mod_sel[1] = {ctrl: game.findUI(this._nd2, "CheckBox_2"), value: 2};
        this.group2 = new game.ui.RadioGroup("mod_sel", mod_sel, 0, function (sel) {
        }.bind(this));
    },

    getOpts: function () {
        var opts = {};
        opts.max = this.group1.getSelected().value;
        opts.subType = this.group2.getSelected().value;
        return opts;
    }
});

// 跑的快
game.ui.CreateOpts5 = game.ui.CreateOpts.extend({
    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Home/RoomCard/Option_5.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    registerOptsCheck: function () {
        // 游戏子类型配置
        var sub_sel = [];
        sub_sel[0] = {ctrl: game.findUI(this._nd1, "CheckBox_1"), value: 1};
        sub_sel[1] = {ctrl: game.findUI(this._nd1, "CheckBox_2"), value: 2};
        this.group1 = new game.ui.RadioGroup("max_sel", sub_sel, 0, function (sel) {
        }.bind(this));


        // 模式选择
        var mod_sel = [];
        mod_sel[0] = {ctrl: game.findUI(this._nd2, "CheckBox_1"), value: 1};
        mod_sel[1] = {ctrl: game.findUI(this._nd2, "CheckBox_2"), value: 2};
        this.group2 = new game.ui.RadioGroup("mod_sel", mod_sel, 0, function (sel) {
        }.bind(this));
    },

    getOpts: function () {
        var opts = {};
        opts.subType = this.group1.getSelected().value;
        opts.setMut = this.group2.getSelected().value;
        return opts;
    }
});

// 血战
game.ui.CreateOpts6 = game.ui.CreateOpts.extend({

    _hsz: null,

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Home/RoomCard/Option_6.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    registerOptsCheck: function () {

        this._hsz = game.findUI(this._nd4, "CheckBox_1");
        // 游戏子类型配置
        var sub_sel = [];
        sub_sel[0] = {ctrl: game.findUI(this._nd1, "CheckBox_1"), value: 2};
        sub_sel[1] = {ctrl: game.findUI(this._nd1, "CheckBox_2"), value: 1};
        this.group1 = new game.ui.RadioGroup("sub_sel", sub_sel, 0, function (sel) {
            this._hsz.setSelected(sel.value != 1);
            this._hsz.setEnabled(sel.value != 1);
        }.bind(this));

        var max_sel = [];
        max_sel[0] = {ctrl: game.findUI(this._nd2, "CheckBox_1"), value: 32};
        max_sel[1] = {ctrl: game.findUI(this._nd2, "CheckBox_2"), value: 16};
        max_sel[2] = {ctrl: game.findUI(this._nd2, "CheckBox_3"), value: 8};
        this.group2 = new game.ui.RadioGroup("max_sel", max_sel, 0, function () {
        });

        // 模式选择
        var mod_sel1 = [];
        mod_sel1[0] = {ctrl: game.findUI(this._nd3, "CheckBox_1"), value: true};
        mod_sel1[1] = {ctrl: game.findUI(this._nd3, "CheckBox_2"), value: false};
        this.group3 = new game.ui.RadioGroup("mod_sel1", mod_sel1, 0, function (sel) {
        });
        var mod_sel2 = [];
        mod_sel2[0] = {ctrl: game.findUI(this._nd3, "CheckBox_3"), value: true};
        mod_sel2[1] = {ctrl: game.findUI(this._nd3, "CheckBox_4"), value: false};
        this.group4 = new game.ui.RadioGroup("mod_sel2", mod_sel2, 0, function (sel) {
        });
    },

    getOpts: function () {
        var opts = {};
        opts.subType = this.group1.getSelected().value;
        opts.maxMut = this.group2.getSelected().value;
        opts.ZMJF = this.group3.getSelected().value;
        opts.DGHZM = this.group4.getSelected().value;
        opts.HSZ = game.findUI(this._nd4, "CheckBox_1").isSelected();
        opts.HDL = game.findUI(this._nd4, "CheckBox_2").isSelected();
        opts.MQZZ = game.findUI(this._nd4, "CheckBox_3").isSelected();
        opts.JD19 = game.findUI(this._nd4, "CheckBox_4").isSelected();
        return opts;
    }
});
