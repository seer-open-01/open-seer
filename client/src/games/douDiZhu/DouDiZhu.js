/**
 * Created by lyndon on 2017/11/24.
 */
// 斗地主流程
game.procedure.DouDiZhuCls = GameProcedureBasic.extend({

    /**
     * 玩家进入房间消息处理
     * @param msgData
     * @private
     */
    __NET_onPlayerEnterResponse : function (msgData) {
        cc.log("==> 斗地主游戏流程 玩家进入房间返回消息：" + JSON.stringify(msgData));
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
            this._gameLogic = new GameLogicDouDiZhu(GameWindowDouDiZhu);
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

// 斗地主流程对象
game.procedure.DouDiZhu = new game.procedure.DouDiZhuCls("res/Games/DouDiZhu/loading.json",
    "res/Games/DouDiZhu/scripts.json",GameDataDouDiZhu);
