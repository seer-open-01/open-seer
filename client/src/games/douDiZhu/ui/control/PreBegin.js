/**
 * Created by lyndon on 2017/11/22.
 */

// 游戏开始前按钮
GameWindowDouDiZhu.PreBegin = cc.Class.extend({


    _parentNode     : null,
    _node           : null,

    _btnReady       : null,     // 准备按钮
    _btnInvite      : null,     // 邀请按钮

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/DouDiZhu/PreBegin/PreBegin.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {
        this._btnReady = game.findUI(this._node, "Btn_Ready");
        this._btnInvite = game.findUI(this._node, "Btn_Invite");

        var gameData = game.procedure.DouDiZhu.getGameData();
        if (gameData.isCreator()) {
            this._btnReady.loadTextureNormal("res/Games/DouDiZhu/Image/Btn_Begin_0.png");
            this._btnReady.loadTexturePressed("res/Games/DouDiZhu/Image/Btn_Begin_1.png");
            this._btnReady.loadTextureDisabled("res/Games/DouDiZhu/Image/Btn_Begin_2.png");
        }else {
            this._btnReady.loadTextureNormal("res/Games/DouDiZhu/Image/Btn_Ready_0.png");
            this._btnReady.loadTexturePressed("res/Games/DouDiZhu/Image/Btn_Ready_1.png");
            this._btnReady.loadTextureDisabled("res/Games/DouDiZhu/Image/Btn_Ready_0.png");
        }
    },
    reset: function () {
        this.show(false);
    },

    show: function (show) {
        this._node.setVisible(show);
    },

    /**
     * 开始按钮置灰接口
     * @param bool
     */
    setBeginEnabled: function (bool) {
        this._btnReady.setEnabled(bool);
    },

    /**
     * 准备按钮回调
     * @param callback
     */
    onReadyClicked: function (callback) {
        this._btnReady.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
                this.show(false);
            }
        }, this);
    },

    /**
     * 邀请按钮回调
     * @param callback
     */
    onInviteClicked: function (callback) {
        this._btnInvite.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    }

});