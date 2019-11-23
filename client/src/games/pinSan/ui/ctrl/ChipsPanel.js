/**
 * Created by Jiyou Mo on 2017/12/1.
 */
// 筹码界面
GameWindowPinSan.ChipsPanel = cc.Class.extend({

    _node               : null,         // 本节点
    _parentNode         : null,         // 父节点

    _chipsNode          : null,         // 放筹码的节点
    _labelAnte          : null,         // 筹码数量显示标签

    _chipsArray         : [],           // 筹码数组

    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinSan/ChipsPanel/ChipsPanel.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {
        this._chipsArray = [];
        this._chipsNode = game.findUI(this._node, "ND_Chips");
        this._labelAnte = game.findUI(this._node, "Fnt_Ante");
    },

    reset : function () {
        this.removeChips();
        this._chipsArray = [];
        this.setAnte(0);
    },

    /**
     * 是否显示该对象
     * @param bool
     */
    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置金贝的值
     * @param ante
     */
    setAnte : function (ante) {
        if (ante < 1) {
            this._labelAnte.setVisible(false);
            return;
        }
        this._labelAnte.setVisible(true);
        ante = Utils.formatCoin(ante);
        this._labelAnte.setString(ante);
    },

    /**
     * 添加筹码
     * @param chipValue     // 筹码的值
     */
    addChip : function (chipValue) {
        var sp = new GameWindowPinSan.ChipsPanel.Chip(chipValue);
        // 宽 -140 —— 140 px  高 -50 —— 50 px
        var x = Math.floor(Math.random() * 280) - 140;
        // var y = Math.floor(Math.random() * 100) - 50;
        var y = Math.floor(Math.random() * 100);
        sp.setPosition(cc.p(x, y));
        this._chipsNode.addChild(sp);
        this._chipsArray.push(sp);
    },

    /**
     * 添加筹码并有动画
     * @param chipValue             // 筹码的值
     * @param beginPos              // 筹码开始的移动位置(世界坐标)
     * @param completeCallback      // 筹码移动完毕后的回调函数
     */
    addChipWithAction : function (chipValue, beginPos, completeCallback) {
        beginPos = this._chipsNode.convertToNodeSpace(beginPos);
        var sp = new GameWindowPinSan.ChipsPanel.Chip(chipValue);
        // 宽 -140 —— 140 px  高 -50 —— 50 px
        var x = Math.floor(Math.random() * 280) - 140;
        // var y = Math.floor(Math.random() * 100) - 50;
        var y = Math.floor(Math.random() * 100);
        sp.setPosition(beginPos);
        this._chipsNode.addChild(sp);
        this._chipsArray.push(sp);
        // 动画
        var move = cc.moveTo(0.2, cc.p(x, y));
        var fun = cc.CallFunc(function () {
            completeCallback && completeCallback();
        }, this);
        sp.stopAllActions();
        sp.runAction(cc.sequence(move, fun));
        // 播放出底分音效
        game.Audio.PSZPlayChipMove();
    },

    /**
     * 移除所有筹码
     */
    removeChips : function () {
        while (this._chipsArray.length > 0) {
            var sp = this._chipsArray.shift();
            sp.removeFromParent(true);
        }
    },

    /**
     * 回收筹码
     * @param position
     * @param completeCallback
     */
    recycleChips : function (position, completeCallback) {
        position = this._chipsNode.convertToNodeSpace(position);
        while (this._chipsArray.length > 0) {
            var sp = this._chipsArray.shift();
            this._recycleChip(sp, position);
        }

        var delay = cc.delayTime(1.0);
        var fun = cc.CallFunc(function () {
            completeCallback && completeCallback();
        }, this);

        this._chipsNode.runAction(cc.sequence(delay, fun));
    },

    _recycleChip : function (chipSp, position) {
        var move = cc.moveTo(0.5, position);
        var fun = cc.CallFunc(function () {
            chipSp.removeFromParent(true);
        }, this);
        chipSp.stopAllActions();
        chipSp.runAction(cc.sequence(move, fun));
        // 播放出底分音效
        game.Audio.PSZPlayChipMove();
    }
});

GameWindowPinSan.ChipsPanel.Chip = cc.Node.extend({

    _node           : null,         // 本节点

    _labelValue     : null,         // 值的文字

    _chipValue      : null,         // 当前筹码的倍率值

    ctor : function (chipValue) {
        this._super();
        this._chipValue = chipValue;
        this._node = ccs.load("res/Games/PinSan/ChipsPanel/Chips_" + chipValue + ".json").node;
        this.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {
        this._labelValue = game.findUI(this._node, "TXT_Value");
        var gameData = game.procedure.PinSan.getGameData();
        var roundCoin = gameData.baseBean;
        var ante = this._chipValue * roundCoin;
        var aa = Utils.formatCoin2(Math.floor(ante));
        this._labelValue.setString("" + aa);
    }
});
