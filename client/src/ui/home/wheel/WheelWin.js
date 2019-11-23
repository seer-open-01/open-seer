/**
 * Author       : lyndon
 * Date         : 2018-10-13
 * Description  : 福利转盘弹窗
 */
game.ui.WheelWin = game.ui.PopupWindow.extend({
    _node           : null,

    _pointer        : null,             // 转盘指针
    _btnGo          : null,             // 开始按钮
    _ndFree         : null,             // 免费提示节点
    _ndCharge       : null,             // 付费提示节点
    _counts         : [],               // 剩余次数提示数组
    _nums           : [],               // 奖励数量数组
    _data           : null,

    _curFree        : 0,                // 当前免费次数
    _curCharge      : 0,                // 当前付费次数

    _totalFree      : 1,                // 总共免费次数
    _totalCharge    : 3,                // 总共付费次数

    _isGoing        : false,            // 正在摇奖
    _maxCount       : 12,               // 转盘最大圈数
    _minCount       : 8,                // 转盘最小圈数

    _eff1           : null,             // 光圈
    _eff2           : null,             // 灯

    ctor: function (data) {
        this._super();
        this._node = ccs.load("res/Home/Wheel/Wheel.json").node;
        this._data = data;
        this._init();
        this.addChild(this._node);
        return true;
    },

    _init: function () {

        this._pointer = game.findUI(this._node, "ND_Pointer");
        this._eff1 = game.findUI(this._node, "ND_Eff1");
        var action1 = ccs.load("res/Animations/EffHall/ZhuanPan/EffZhuanPan.json").action;
        action1.play("animation0", true);this._eff1.runAction(action1);

        this._eff2 = game.findUI(this._node, "ND_Eff2");
        var action2 = ccs.load("res/Animations/EffHall/ZhuanPan/EffDeng.json").action;
        action2.play("animation0", true);this._eff2.runAction(action2);

        this.openGoEff(false);

        this._btnGo = game.findUI(this._node, "Btn_Go");
        this._btnGo.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
               cc.log("摇奖按钮被点击！");
               game.Audio.playBtnClickEffect();
               this._btnGo.setEnabled(false);
               this._requireGo();
            }
        }, this);

        this._ndFree = game.findUI(this._btnGo, "free");
        this._ndCharge = game.findUI(this._btnGo, "charge");

        var btnClose = game.findUI(this._node, "Btn_Close");
        btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                if (!this._isGoing) {
                    game.UISystem.closeWindow(this);
                    game.ui.WheelWin.inst = null;
                }else {
                    game.ui.HintMsg.showTipText("正在为您抽奖，请稍等~", cc.p(640, 360), 2);
                }
            }
        }, this);

        this._counts = [];
        for (var j = 0; j <= 3; ++j) {
            this._counts.push(game.findUI(this._ndCharge, "" + j));
        }

        this._nums = [];
        var nd = game.findUI(this._node, "ND_Num");
        for (var i = 1; i <= 12; ++i) {
            this._nums.push(game.findUI(nd, "" + i));
        }

        this._data && this.initConfig();
    },

    /**
     * 初始化打开窗口配置
     */
    initConfig: function () {
        var config = this._data.data;
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                var num = Utils.formatCoin2(config[key].num);
                this._nums[key - 1].setString(num);
            }
        }

        var curFree = this._data.curFreeCount;
        var curCharge = this._data.curCount;
        var totalFree = this._data.maxFree;
        var totalCharge = this._data.maxCount;
        this.updateCurCount(curFree, curCharge, totalFree, totalCharge);

    },

    /**
     * 更新当前抽奖次数和按钮状态
     */
    updateCurCount: function (curFree, curCharge, totalFree, totalCharge) {

        this._curFree = curFree;
        this._curCharge = curCharge;
        this._totalFree = totalFree;
        this._totalCharge = totalCharge;
        // cc.log("A=========================== " + this._curFree);
        // cc.log("B=========================== " + this._curCharge);
        // cc.log("C=========================== " + this._totalFree);
        // cc.log("D=========================== " + this._totalCharge);
        this._ndFree.setVisible(false);
        this._ndCharge.setVisible(false);

        if (this._curFree < this._totalFree) {
            this._ndFree.setVisible(true);
        }else {
            this._ndCharge.setVisible(true);
            for (var i = 0; i < this._counts.length; ++i) {
                this._counts[i].setVisible((this._totalCharge - this._curCharge) == i);
            }
        }

    },

    /**
     * 请求摇奖
     * @private
     */
    _requireGo: function () {
        if (this._curFree < this._totalFree) {
            game.hallNet.sendMessage(protocol.ProtoID.CLIENT_GO_WHEEL, {});
        }else {
            if (this._curCharge < this._totalCharge) {
                game.ui.TipWindow.popup({
                    tipStr: "再次转动将消耗500Seer，是否确定？",
                    showClose: false,
                    showNo: true
                }, function (win) {
                    game.UISystem.closeWindow(win);
                    game.hallNet.sendMessage(protocol.ProtoID.CLIENT_GO_WHEEL, {});
                }, function (win) {
                    game.UISystem.closeWindow(win);
                    this._btnGo.setEnabled(true);
                }.bind(this));
            }else {
                game.hallNet.sendMessage(protocol.ProtoID.CLIENT_GO_WHEEL, {});
            }
        }
    },

    /**
     * 摇奖动画开始
     */
    goWheel: function (data) {
        var stopId = data.id;
        var type = data.type;
        cc.log("开始播放转盘动画! 奖品Id：" + stopId + " 奖品类型： " + type + " 数量： " + data.num);
        var count = Math.floor(Math.random() * (this._maxCount - this._minCount) + this._minCount); // 圈数
        this._pointer.stopAllActions();
        this._pointer.setRotation(0);
        if (stopId >= 1 && stopId <= 12) {
            this._isGoing = true;
            this.openGoEff(true);
            var angle = 360 * count + 30 * (stopId - 1);
            // cc.log("========================== " + count);
            this._pointer.runAction(cc.Sequence(cc.RotateBy(3.0, angle).easing(cc.easeSineOut(3.0)), cc.CallFunc(function () {
                cc.log("转盘动画结束！");
                this._isGoing = false;
                this._btnGo.setEnabled(true);

                game.ui.RewardWindow.popup([data], 0, function () {
                    this.openGoEff(false);
                }.bind(this));

            }.bind(this), this)));

            // 音效
            var a = 0;
            var max = angle / 720;
            this._btnGo.stopAllActions();
            this._btnGo.runAction(cc.Sequence(cc.CallFunc(function () {
                ++a;
                // cc.log("==================== " + a);
                game.Audio.playWheelEffect();
                if (a >= max) {
                    this._btnGo.stopAllActions();
                    // game.Audio.playBingoEffect();
                }
            }.bind(this), this), cc.DelayTime(3/max)).repeatForever());
        }
    },

    /**
     * 开启旋转特效
     * @param bool
     */
    openGoEff: function (bool) {
        this._eff1.setVisible(bool);
        this._eff2.setVisible(!bool);
    }
});

game.ui.WheelWin.popup = function (data) {
    var win = new game.ui.WheelWin(data);
    game.ui.WheelWin.inst = win;
    game.UISystem.popupWindow(win);
};

game.ui.WheelWin.inst = null;