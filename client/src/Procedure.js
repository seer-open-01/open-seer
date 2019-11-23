/**
 * @author  Jiyou Mo
 */
// ==== 流程控制类 ===============================================================================
game.Procedure = {
    _curProcedure           : null,         // 当前流程
    _netMsgDispatchPause    : false,        // 网络数据包处理是否暂停

    _androidReturnCallback  : null,         // 安卓返回按钮点击回调

    /**
     * 初始化
     */
    init : function () {
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function(keyCode, event) {
                if (keyCode == cc.KEY.back) {
                    //beta版本这里的back的keyCode有误，也可以自行改为6
                    cc.log("return button clicked. keyCode:" + keyCode);
                    game.Procedure._androidReturnCallback && game.Procedure._androidReturnCallback();
                } else if (keyCode == cc.KEY.menu) {
                    //beta版本这里的menu的keyCode有误，也可以自行改为15
                    cc.log("menu button clicked. keyCode:" + keyCode);
                }
            }}, game.UISystem.getTxtHintLayer());
    },

    /**
     * 切换流程
     * @param newProcedure
     */
    switch : function (newProcedure) {

        if (this._curProcedure == newProcedure) {
            // 当前流程切换到当前流程不执行流程切换操作，避免造成流程资源释放后又加载
            this._curProcedure.reEnter && this._curProcedure.reEnter();
            return;
        }

        if (this._curProcedure) {
            this._androidReturnCallback = null;
            this._curProcedure.leave();
        }

        this._curProcedure = newProcedure;

        if (this._curProcedure) {
            this._curProcedure.enter();
        }
    },

    /**
     * 绑定返回按钮点击事件
     * @param callback
     */
    onAndroidReturnClicked : function (callback) {
        this._androidReturnCallback = callback;
    },

    /**
     * 更新
     * @param dt
     */
    update : function (dt) {
        if (!this._netMsgDispatchPause) {
            // 派发网络消息
            this._dispatchNetMessage();
        }

        // 更新当前流程
        this._curProcedure && this._curProcedure.update(dt);
    },

    /**
     * 获取当前流程
     * @returns {null}
     */
    getProcedure : function () {
        return this._curProcedure;
    },

    /**
     * 暂停网络消息的派发
     */
    pauseNetMessageDispatch : function () {
        this._netMsgDispatchPause = true;
    },

    /**
     * 恢复网络消息的派发
     */
    resumeNetMessageDispatch : function () {
        this._netMsgDispatchPause = false;
    },

    // =================================================================================================
    _dispatchNetMessage : function () {
        game.gameNet && game.gameNet.dispatchMessage();
    }
};

// 流程名字空间
game.procedure = game.procedure || {};