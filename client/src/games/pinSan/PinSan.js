/**
 * Created by Jiyou Mo on 2017/11/20.
 */
/**
 * 拼三张流程的类
 */
game.procedure.PinSanCls = GameProcedureBasic.extend({

    /**
     * 玩家进入房间消息处理
     * @param msgData
     * @private
     */
    __NET_onPlayerEnterResponse : function (msgData) {
        cc.log("==> 拼三张游戏流程 玩家进入房间返回消息：" + JSON.stringify(msgData));
        if (msgData.result != 0) {
            game.ui.HintMsg.showTipText("数据异常，请稍后再试！", cc.p(640, 360), 2);
            game.UISystem.hideLoading();
            return;
        }
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
            this._gameLogic = new GameLogicPinSan(GameWindowPinSan);
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

// 拼三张流程对象
game.procedure.PinSan = new game.procedure.PinSanCls("res/Games/PinSan/loading.json",
    "res/Games/PinSan/scripts.json", GameDataPinSan);