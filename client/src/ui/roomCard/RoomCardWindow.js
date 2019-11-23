/**
 * Author       : lyndon
 * Date         : 2018-07-26
 * Description  : 房卡场窗口
 */
game.ui.RoomCardWindow = cc.Layer.extend({

    _node               : null,                         // 本节点
    _actionNode         : null,                         // 动画节点

    _labelHelp          : null,                         // 游戏帮助
    _btnHelp            : null,                         // 帮助按钮
    _btnBack            : null,                         // 返回按钮
    _btnMall            : null,                         // 商城按钮

    _btnRank            : null,                         // 战绩按钮
    _btnJoin            : null,                         // 加入房间按钮
    _btnCreate          : null,                         // 创建房间按钮

    _fntBean            : null,                         // 金贝数量

    ctor: function () {
        this._super();
        this._node = ccs.load("res/RoomCard/RoomCard.json").node;
        this._init();
        this.addChild(this._node);
        this.retain();
        return true;
    },

    _init: function () {

        this._actionNode = game.findUI(this._node, "ND_Pop");
        this._btnBack = game.findUI(this._node, "Btn_Back");
        this._btnHelp = game.findUI(this._node, "Btn_Help");
        this._btnMall = game.findUI(this._node, "Btn_Mall");

        this._labelHelp = game.findUI(this._node, "Txt_Help");
        this._fntBean = game.findUI(this._node, "Fnt_Bean");

        this._btnRank = game.findUI(this._node, "Btn_Rank");
        this._btnJoin = game.findUI(this._node, "Btn_Join");
        this._btnCreate = game.findUI(this._node, "Btn_Create");

    },

    reset: function () {

    },
    /**
     * 绑定返回按钮按钮点击回调
     * @param callback
     */
    onCreateBtnClick : function (callback) {
        this._btnCreate.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },
    /**
     * 绑定返回按钮按钮点击回调
     * @param callback
     */
    onRankBtnClick : function (callback) {
        this._btnRank.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },
    /**
     * 绑定返回按钮按钮点击回调
     * @param callback
     */
    onJoinBtnClick : function (callback) {
        this._btnJoin.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },
    /**
     * 绑定返回按钮按钮点击回调
     * @param callback
     */
    onBackBtnClick : function (callback) {
        this._btnBack.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    /**
     * 绑定帮助按钮点击回调
     * @param callback
     */
    onHelpBtnClick : function (callback) {
        this._btnHelp.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    /**
     * 商城按钮点击回调
     * @param callback
     */
    onMallBtnClick : function (callback) {
        this._btnMall.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },
    /**
     * 设置金贝数量
     * @param num
     */
    setBean: function (num) {
        num = Utils.formatCoin(num);
        this._fntBean.setString(num);
    },
    /**
     * 进入动画
     */
    playEnterAnimation: function () {
        this._actionNode.setPosition(640, -720);
        this._actionNode.stopAllActions();
        this._actionNode.runAction(cc.MoveTo(0.5, cc.p(640, 360)).easing(cc.easeSineOut(0.5)));

        this._btnRank.setPositionX(1500);
        this._btnJoin.setPositionX(1500 + 410);
        this._btnCreate.setPositionX(1500 + 820);

        this.move(this._btnRank, 0.2, cc.p(-410, -50));
        this.move(this._btnJoin, 0.4, cc.p(0, -50));
        this.move(this._btnCreate, 0.6, cc.p(410, -50));
    },

    move: function (node, delay, pos) {
        var doDelay = new cc.DelayTime(delay);
        var doMove = new cc.MoveTo(0.5, pos).easing(cc.easeSineOut(0.5));
        node.stopAllActions();
        node.runAction(cc.Sequence(doDelay, doMove));
    }
});
