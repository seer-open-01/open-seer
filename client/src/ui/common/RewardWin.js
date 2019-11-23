/**
 * Author       : lyndon
 * Date         : 2018-11-30
 * Description  : 获奖窗口
 */
game.ui.RewardWindow = game.ui.PopupWindow.extend({

    _node           : null,             // 当前节点
    _eff            : null,             // 特效动画
    _fntNum         : null,             // 任务奖励具体数量
    _tip            : null,             // 文字提示
    _rewardNode     : null,             // 奖励节点
    _data           : null,             // 本次任务奖励的具体数据
    _type           : 0,                // 奖品类型 0 是其他奖励 非0 是背包奖励
    _callback       : null,             // 关闭窗口回调

    _items          : [],               // 奖励数组
    ctor: function (data, type, callback) {
        this._super();
        this._node = ccs.load("res/Common/Reward/RewardWin.json").node;
        this._data = data;
        this._type = type || 0;
        this._callback = callback || null;
        this._init();
        this.addChild(this._node);
        return true;
    },

    _init: function () {
        this._eff = game.findUI(this._node, "ND_Eff");
        this._rewardNode = game.findUI(this._node, "ND_Reward");

        this._tip = game.findUI(this._node, "ND_Tip");
        this._tip.setVisible(this._type != 0);

        //=== 无理需求 ==================
        if (this._type == 99) {
            this._tip.setString("您已破产，系统补助您3000Seer");
        }
        //==============================

        var closeBtn = game.findUI(this._node, "Btn_Close");
        closeBtn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._callback && this._callback();
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        var confirmBtn = game.findUI(this._node, "Btn_Sure");
        confirmBtn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._callback && this._callback();
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        this._data && this.setInfo();
        this.playEff();
    },

    /**
     * 播放光芒特效
     */
    playEff: function () {
        var action = ccs.load("res/Common/Reward/RewardEff.json").action;
        action.play("animation0", true);
        this._eff.stopAllActions();
        this._eff.runAction(action);
        game.Audio.playBingoEffect();
        this._node.stopAllActions();
        this._node.runAction(cc.Sequence(cc.DelayTime(5.0), cc.CallFunc(function () {
            this._eff.stopAllActions();
            this._callback && this._callback();
            game.UISystem.closePopupWindow(this);
        }, this)));
    },

    setInfo: function () {
        var data = this._data;
        this._items = [];
        for (var i = 0; i < data.length; ++i) {
            var temp = new game.ui.RewardWindow.RewardItem(this._rewardNode, data[i]);
            this._items.push(temp);
        }

        this._layOut();
    },
    /**
     * 动态排布
     * @private
     */
    _layOut: function () {
        var length = this._items.length;
        var arr = [0];
        switch (length) {
            case 2:
                arr = [-80, 80];
                break;
            case 3:
                arr = [-160, 0, 160];
                break;
            case 4:
                arr = [-240, -80, 80, 240];
                break;
            case 5:
                arr = [-320, -160, 0, 160, 320];
                break;
            default:
                arr = [0];
                break;
        }

        for (var i = 0; i < length; ++i) {
            this._items[i].getNode().setPositionX(arr[i]);
        }
    }
});

game.ui.RewardWindow.RewardItem = cc.Class.extend({
    _parentNode     : null,
    _node           : null,
    _reward         : null,
    _fntNum         : null,
    _data           : null,
    ctor: function (node, data) {
        this._parentNode = node;
        this._node = ccs.load("res/Common/Reward/RewardItem.json").node;
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
        var type = this._data.type;
        var num = +this._data.num;
        if (num > 10000) {
            num = num / 10000;
            if (num % 10000 != 0) {
                num = num.toFixed(2) + "万";
            }else {
                num = num + "万";
            }
        }
        var path = "res/Common/Images/reward_" + type + ".png";
        this._reward.setTexture(path);
        this._fntNum.setString("X" + num);
    },

    getNode: function () {
        return this._node;
    }
});

game.ui.RewardWindow.popup = function (data, type, callback) {
    var win = new game.ui.RewardWindow(data, type, callback);
    game.UISystem.popupWindow(win);
};
