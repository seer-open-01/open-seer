/**
 * Created by fuyang on 2018/10/12.
 */

// 任务主窗口
game.ui.TaskWindow = game.ui.PopupWindow.extend({
    _uiNode: null,

    _tip: null,    // 温馨提示文字
    _sv: null,     // 任务列表滚动容器
    _noTask: null, // 没有任务文字提示

    _items: [],    // 任务Item数组
    _tasks: [],    // 排序后的任务

    _loading: null,         // 加载节点
    _circle: null,         // 特效光圈
    _peach: null,         // 特效图案

    _height: 104,          // 任务Item高度

    _callback: null,         // 任务关闭回调

    _haveUnreadAward: false,        // 有未领取的任务奖励

    _isInGameOpenBox: false,        // 是否在游戏中打开了任务宝箱

    ctor: function (callback, inGameOpenBox) {
        this._super();
        this._uiNode = ccs.load("res/Common/Task/TaskWindow.json").node;
        this._callback = callback;
        this._isInGameOpenBox = inGameOpenBox;
        this._init();
        this.addChild(this._uiNode);
        return true;
    },

    _init: function () {
        this._tip = game.findUI(this._uiNode, "Text_Tip");
        this._sv = game.findUI(this._uiNode, "SV_List");
        this._noTask = game.findUI(this._uiNode, "Text_NoTask");
        this._noTask.setVisible(false);
        this._loading = game.findUI(this._uiNode, "ND_Loading");
        this._circle = game.findUI(this._loading, "Loading_1");
        this._peach = game.findUI(this._loading, "Loading_2");
        var closeBtn = game.findUI(this._uiNode, "Btn_Close");
        closeBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                //检查是不是所有奖励都领取了
                this._checkAllGet();
                game.DataKernel.haveTaskReward = this._haveUnreadAward;
                this._callback && this._callback(this._haveUnreadAward);
                game.UISystem.closePopupWindow(this);
            }
        }, this);
        //设置定时器
        setTimeout(function () {
            this._requireMail();
        }.bind(this), 300);
    },
    /**
     * 请求服务器任务数据
     * @private
     */
    _requireMail: function () {
        this.showLoading();
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_GET_TASK_INFO, {});
    },
    /**
     * 加载任务并存入数组（外部调用）
     * @param tasks
     * @private
     */
    loadTask: function (tasks) {
        //这里不需要排序了，服务器给的数据就是排序好的所以，直接本地存储，然后去实例化item就可以了
        this._tasks = tasks;
        if (this._tasks) {
            this._loadScrollView();
        }
    },
    /**
     * 加载滚动容器
     * @private
     */
    _loadScrollView: function () {
        this._sv.removeAllChildren();
        this._items = [];

        if (this._tasks.length < 1) {
            this.showNoTask(true);
            this._sv.setInnerContainerSize(cc.size(944.0, 440.0));
            this.hideLoading();
            return;
        }
        for (var i = 0; i < this._tasks.length; ++i) {
            var temp = new game.ui.TaskItem(this._tasks[i], this._isInGameOpenBox);
            this._items.push(temp);
        }
        this._layOut();
    },
    /**
     * 任务列表的排序
     * @private
     */
    _layOut: function () {
        var contentHeight = this._items.length * this._height;
        contentHeight = Math.max(contentHeight, 440.00);
        this._sv.setInnerContainerSize(cc.size(944, contentHeight));
        this._sv.scrollToTop(0.2, true);
        var posY = contentHeight;
        for (var i = 0; i < this._items.length; ++i) {
            posY -= this._height;
            this._items[i].getNode().setPositionY(posY);
            this._sv.addChild(this._items[i].getNode());
        }
        this.hideLoading();
    },
    /**
     * 检查所有任务奖励是否全部领取
     * @private
     */
    _checkAllGet: function () {
        var haveUnread = false;
        for (var i = 0; i < this._tasks.length; ++i) {
            if (this._tasks[i].status == 1) {
                haveUnread = true;
                break;
            }
        }
        this._haveUnreadAward = haveUnread;
    },

    /**
     * 拉取任务奖励
     * @param taskId
     */
    fetchTask: function (taskId) {
        cc.log("=====领取的任务是 " + taskId);
        for (var i = 0; i < this._tasks.length; ++i) {
            if (this._tasks[i].id == taskId) {
                this._tasks[i].status = 2;
                this._items[i].updateAfterFetch();
                break;
            }
        }
    },

    /**
     * 显示没有任务提示
     * @param show
     * @private
     */
    showNoTask: function (show) {
        this._noTask.setVisible(show);
        this._tip.setVisible(!show);
    },

    /**
     * 显示loading动画
     */
    showLoading: function () {
        this._loading.setVisible(true);
        this._circle.stopAllActions();
        this._circle.runAction(cc.RotateBy(1.0, 360).repeatForever());

        this._peach.stopAllActions();
        this._peach.runAction(cc.Sequence(cc.scaleTo(1.0, -1, 1), cc.scaleTo(1.0, 1, 1)).repeatForever());
    },
    /**
     * 隐藏loading动画
     */
    hideLoading: function () {
        this._circle.stopAllActions();
        this._peach.stopAllActions();
        this._loading.setVisible(false);
    }
});

game.ui.TaskWindow.inst = null;
//  任务列表弹出方法
game.ui.TaskWindow.popup = function (callback, inGameOpenBox) {
    var win = new game.ui.TaskWindow(callback, inGameOpenBox);
    game.ui.TaskWindow.inst = win;
    game.UISystem.popupWindow(win);
};




