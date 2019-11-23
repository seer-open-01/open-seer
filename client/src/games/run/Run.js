/**
 * Author       : lyndon
 * Date         : 2019-05-15
 * Description  : 跑得快数据
 */

game.procedure.RunCls = GameProcedureBasic.extend({

    /**
     * 玩家进入房间消息处理
     * @param msgData
     * @private
     */
    __NET_onPlayerEnterResponse : function (msgData) {
        cc.log("==> 跑得快游戏流程 玩家进入房间返回消息：" + JSON.stringify(msgData));
        // 暂停消息
        game.Procedure.pauseNetMessageDispatch();
        this._gameData.parseRoomEnter(msgData);
        if (this._gameLogic) {
            this._gameLogic.resetUpdateRoomInfo();
            this._gameLogic.bindNetMessageHandler();
            // 登录切换语音环境
            this._gameLogic.voiceLogin();
            game.Procedure.resumeNetMessageDispatch();
        } else {
            // 创建流程
            this._gameLogic = new LogicRun(WindowRun);
            this._gameLogic.bindNetMessageHandler();
            game.Procedure.resumeNetMessageDispatch();
        }

        // 关闭加入房间的窗口
        if (game.ui.HallJoinWin.inst) {
            game.UISystem.closeWindow(game.ui.HallJoinWin.inst);
            game.ui.HallJoinWin.inst = null;
        }
        // 隐藏加载界面
        game.UISystem.hideLoading();
    }
});

game.procedure.Run = new game.procedure.RunCls("res/Games/Run/loading.json",
    "res/Games/Run/scripts.json", DataRun);