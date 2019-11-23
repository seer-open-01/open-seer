/**
 * Created by pander on 2018/5/15.
 */
// ==== 麻将游戏 挂起任务 控件 ==========================================================
GameWindowMahjong.HangupTasks = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点
    
    _btnPass            : null,         // 过按钮
    _btnChi             : null,         // 吃按钮
    _btnPeng            : null,         // 碰按钮
    _btnGang            : null,         // 杠按钮
    _btnHu              : null,         // 胡按钮

    _visibleBtns        : [],           // 可见的按钮数组

    _selectCards        : null,         // 选牌控件

    ctor : function (parentNode) {
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/HangupTasks/HangupTasks.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {


        this._btnPass = game.findUI(this._node, "BTN_Pass");

        var action1 = ccs.load("res/Animations/EffMaJiang/EffBTN/BTNChi.json").action;
        this._btnChi = game.findUI(this._node, "BTN_Chi");
        this._btnChi.effect = game.findUI(this._btnChi, "effect");
        this._btnChi.effect.runAction(action1);
        action1.play("animation0", true);

        var action2 = ccs.load("res/Animations/EffMaJiang/EffBTN/BTNPeng.json").action;
        this._btnPeng = game.findUI(this._node, "BTN_Peng");
        this._btnPeng.effect = game.findUI(this._btnPeng, "effect");
        this._btnPeng.effect.runAction(action2);
        action2.play("animation0", true);

        var action3 = ccs.load("res/Animations/EffMaJiang/EffBTN/BTNGang.json").action;
        this._btnGang = game.findUI(this._node, "BTN_Gang");
        this._btnGang.effect = game.findUI(this._btnGang, "effect");
        this._btnGang.effect.runAction(action3);
        action3.play("animation0", true);

        var action4 = ccs.load("res/Animations/EffMaJiang/EffBTN/BTNHu.json").action;
        this._btnHu = game.findUI(this._node, "BTN_Hu");
        this._btnHu.effect = game.findUI(this._btnHu, "effect");
        this._btnHu.effect.runAction(action4);
        action4.play("animation0", true);

        this._selectCards = new GameWindowMahjong.HangupTasksSelectCards(game.findUI(this._node, "BTN_Select"));
    },
    
    reset : function () {
        this.show(false);
        this._selectCards.show(false);
        this.showBtnInfo({});
        this._visibleBtns = [];
    },
    
    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 显示选牌控件
     * @param type      类型  1 吃牌   3 杠牌
     * @param dataArray  数据的数组，服务器给过来的数据
     * @param callback   点击回调   如果是吃牌 回传吃牌数组索引  如果是杠牌 回传杠牌的值
     */
    showSelectController : function (type, dataArray, callback) {
        this._selectCards.setInfo(type, dataArray, callback);
        this._selectCards.show(true);
    },

    /**
     * 设置需要显示的挂起时间操作按钮
     * @param tasks     操作任务的json对象
     */
    showBtnInfo : function (tasks) {
        if (Object.keys(tasks).length < 1) {
            cc.log("设置麻将游戏挂起任务的任务值参数为空");
            return;
        }
        this.show(true);
        this._selectCards.show(false);
        this._btnChi.setVisible(tasks.hasOwnProperty("chi"));
        this._btnPeng.setVisible(tasks.hasOwnProperty("peng"));
        this._btnGang.setVisible(tasks.hasOwnProperty("gang"));
        this._btnHu.setVisible(tasks.hasOwnProperty("hu"));

        this._layOut();
    },
    /**
     * 显示的按钮重新排列
     * @private
     */
    _layOut: function () {

        this._visibleBtns = [];
        if (this._btnHu.isVisible()) {
            this._visibleBtns.push(this._btnHu);
        }
        if (this._btnGang.isVisible()) {
            this._visibleBtns.push(this._btnGang);
        }
        if (this._btnPeng.isVisible()) {
            this._visibleBtns.push(this._btnPeng);
        }
        if (this._btnChi.isVisible()) {
            this._visibleBtns.push(this._btnChi);
        }

        var posX = 0;
        for (var i = 0; i < this._visibleBtns.length; ++i) {
            posX -= 160;
            this._visibleBtns[i].setPositionX(posX);
        }
    },
    /**
     * 过按钮点击回调函数绑定
     * @param callback
     */
    onPassClicked : function (callback) {
        this._btnPass.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    /**
     * 吃按钮点击回调函数绑定
     * @param callback
     */
    onChiClicked : function (callback) {
        this._btnChi.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    /**
     * 碰按钮点击回调函数绑定
     * @param callback
     */
    onPengClicked : function (callback) {
        this._btnPeng.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    /**
     * 杠按钮点击回调函数绑定
     * @param callback
     */
    onGangClicked : function (callback) {
        this._btnGang.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    /**
     * 胡按钮点击回调函数绑定
     * @param callback
     */
    onHuClicked : function (callback) {
        this._btnHu.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    }
});