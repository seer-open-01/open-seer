/**
 * Created by lyndon on 2019-07-31
 * 房间列表窗口
 */
game.ui.RoomListWindow = cc.Layer.extend({

    _node           : null,                         // 本节点

    _topNode        : null,                         // 顶节点
    _leftNode       : null,                         // 左节点
    _rightNode      : null,                         // 又节点

    _left           : null,                         // 游戏类型按钮管理器
    _right          : null,                         // 游戏场次按钮管理器
    _tip            : null,                         // 游戏描述
    _btnHelp        : null,                         // 帮助按钮
    _btnBack        : null,                         // 返回按钮
    _btnAdd         : null,                         // 添加金贝按钮
    _btnEnter       : null,                         // 进入房间按钮
    _btnCreate      : null,                         // 创建房间按钮
    _btnRefresh     : null,                         // 刷新按钮
    _fntBean        : null,                         // 金贝数量

    _gameType       : 8,                            // 当前选择的游戏类型
    _subType        : 1,                            // 当前选择的游戏模式

    ctor: function () {
        this._super();
        this._node = ccs.load("res/RoomList/RoomList.json").node;
        this._init();
        this.addChild(this._node);
        this.retain();
        return true;
    },

    _init: function () {
        this._topNode = game.findUI(this._node, "ND_Top");
        this._leftNode = game.findUI(this._node, "ND_Left");
        this._rightNode = game.findUI(this._node, "ND_Right");

        this._btnBack = game.findUI(this._topNode, "BTN_GoBack");
        this._btnHelp = game.findUI(this._topNode, "BTN_Help");
        this._btnAdd = game.findUI(this._topNode, "BTN_BeanAdd");
        this._btnEnter = game.findUI(this._rightNode, "BTN_Enter");
        this._btnCreate = game.findUI(this._rightNode, "BTN_Create");
        this._btnRefresh = game.findUI(this._rightNode, "BTN_Refresh");

        this._tip = game.findUI(this._topNode, "TXT_Content");
        this._fntBean = game.findUI(this._topNode, "FNT_Bean");

        this._left = new game.ui.RoomListWindow.Left(this._leftNode);
        this._right = new game.ui.RoomListWindow.Right(this._rightNode);
    },

    reset: function () {

    },

    /**
     * 绑定选择游戏场的按钮回调
     * @param callback      回传参数 matchId
     */
    onJoinClick: function (callback) {
        this._right.onGameClick(callback);
    },

    /**
     * 绑定游戏类型切换按钮点击回调
     * @param callback      回传参数 gameType
     */
    onSelectClick: function (callback) {
        this._left.onGameTypeBtnClick(callback);
    },

    /**
     * 绑定返回按钮按钮点击回调
     * @param callback
     */
    onBackClick: function (callback) {
        this._btnBack.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    /**
     * 绑定帮助按钮点击回调
     */
    onHelpClick: function (callback) {
        this._btnHelp.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback(this._gameType);
            }
        }, this);
    },

    /**
     * 绑定添加房卡按钮点击回调
     */
    onAddClick: function (callback) {
        this._btnAdd.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    /**
     * 进入房间点击
     */
    onEnterClick: function (callback) {
        this._btnEnter.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    /**
     * 创建房间点击
     */
    onCreateClick: function (callback) {
        this._btnCreate.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    /**
     * 刷新按钮点击
     */
    onRefreshClick: function (callback) {
        this._btnRefresh.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        });
    },

    // 更新随机匹配场次信息，游戏类型，和金币数量
    updateInfo_1: function (data) {

        var str = this.getIntroduction(data.gameType);
        this._tip.setString(str);

        var bean = Utils.formatCoin(game.DataKernel.bean);
        this._fntBean.setString(bean);

        // 避免回调刷新问题，此处再进行一次最新调用
        this._left.setGameType(data.gameType);
        this._right.updateTop(data.list);
    },

    // 更新自建匹配场次信息
    updateInfo_2: function (data) {
        this._right.updateBottom(data.list);
    },

    // 根据gameType获取游戏简介
    getIntroduction: function(gameType) {
        var str = "";
        switch (gameType) {
            case 1:
                str = "庄闲 连庄 上噶 花胡 叫令";
                break;
            case 2:
                str = "不洗牌模式有较高几率获得好牌";
                break;
            case 4:
                str = "激情玩法：去掉2-8 保留9-A";
                break;
            case 5:
                str = "普通牌型 特殊牌型";
                break;
            case 7:
                str = "有打必出 放走包赔";
                break;
            case 8:
                str = "自摸加番 点杠花当自摸 换三张 ···";
                break;
        }

        return str;
    },
    // 隐藏自建房的Item
    hideItems: function () {
        this._right.hideItems();
    },
    // 菜单切换动画
    playChangeMenuAnimation: function (callback) {
        this._right.playSelectAnimation(callback);
    },

    // 进入动画
    playEnterAnimation: function (callback) {
        this._leftNode.stopAllActions();
        this._leftNode.setPosition(cc.p(-140, 316));
        this._leftNode.runAction(cc.moveTo(0.3, cc.p(118, 316)));

        this._rightNode.stopAllActions();
        this._rightNode.setPosition(cc.p(1280, 15));
        this._rightNode.runAction(cc.moveTo(0.3, cc.p(214, 15)));

        this._topNode.stopAllActions();
        this._topNode.setPosition(cc.p(640, 720 + 100));
        this._topNode.runAction(cc.moveTo(0.3, cc.p(640, 720)));

        this._node.stopAllActions();
        this._node.runAction(cc.sequence(cc.delayTime(0.3), cc.CallFunc(function () {
            callback && callback();
        }, this)));
    },

    // 离开动画
    // playLeaveAnimation: function (callback) {
    //     this._leftNode.stopAllActions();
    //     this._leftNode.runAction(cc.moveTo(0.3, cc.p(-240, 0)));
    //
    //     this._rightNode.stopAllActions();
    //     this._rightNode.runAction(cc.moveTo(0.3, cc.p(1280 + 1060, 0)));
    //
    //     this._topNode.stopAllActions();
    //     this._topNode.runAction(cc.moveTo(0.3, cc.p(640, 720 + 100)));
    //
    //     this._node.stopAllActions();
    //     this._node.runAction(cc.sequence(cc.delayTime(0.3), cc.CallFunc(function () {
    //         callback && callback();
    //     }, this)));
    // }
});
