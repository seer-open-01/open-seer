/**
 * Created by lyndon on 2018.04.16.
 *
 *
 *  大厅下部UI控件
 *  0-7按钮分别表示：商城，银行，任务，战绩，邮件，帮助，好友，提币
 */

game.ui.HomeBottom = cc.Class.extend({

    _node               : null,

    _dotMail            : null,         // 邮件红点标志
    _dotTask            : null,         // 任务红点标志
    _dotFriend          : null,         // 好友红点标志
    _btns               : [],           // 按钮组

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },
    
    _init: function () {

        this._btns = [];
        for (var i = 0; i <= 7; ++i) {
            var temp = game.findUI(this._node, "BTN_" + i);
            this._btns.push(temp);
        }

        this._dotMail = game.findUI(this._node, "sign_mail");
        this._dotTask = game.findUI(this._node, "sign_task");
        this._dotFriend = game.findUI(this._node, "sign_friend");
    },

    /**
     * 播放按钮特效
     */
    playButtonEffect : function () {
        var json = ccs.load("res/Animations/EffHall/Shop.json");
        var node = game.findUI(this._node, "eff_shop");
        var action = json.action;
        node.runAction(action);
        action.play("animation0", true);
    },

    btn_0: function (callback) {
        this._btns[0].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                sender.setScale(1.0);
                callback && callback();
            }else if (type == ccui.Widget.TOUCH_BEGAN) {
                sender.setScale(0.9);
            }else if (type == ccui.Widget.TOUCH_CANCELED) {
                sender.setScale(1.0);
            }
        }, this);
    },

    btn_1: function (callback) {
        this._btns[1].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    btn_2: function (callback) {
        this._btns[2].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    btn_3: function (callback) {
        this._btns[3].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    btn_4: function (callback) {
        this._btns[4].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    btn_5: function (callback) {
        this._btns[5].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    btn_6: function (callback) {
        this._btns[6].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    btn_7: function (callback) {
        this._btns[7].addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    // 显示邮件红点
    showMailDot: function (vis) {
        this._dotMail.setVisible(vis);
    },
    // 显示任务红点
    showTaskDot: function (vis) {
        this._dotTask.setVisible(vis);
    },
    // 显示好友红点
    showFriendDot: function (vis) {
        this._dotFriend.setVisible(vis);
    }
});