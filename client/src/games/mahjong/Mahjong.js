/**
 * Created by Jiyou Mo on 2018/5/7.
 */
// ==== 麻将流程类 ======================================================
game.procedure.MahjongCls = GameProcedureBasic.extend({
    /**
     * 玩家进入房间消息处理
     * @param msgData
     * @private
     */
    __NET_onPlayerEnterResponse : function (msgData) {
        cc.log("==> 麻将游戏流程 玩家房间信息返回消息：" + JSON.stringify(msgData));
        // 暂停消息派发
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
            if (this._gameData.subType == 1) {
                // 二人麻将
                this._gameLogic = new GameLogicMahjong(GameWindowMahjongEr);
            } else {
                this._gameLogic = new GameLogicMahjong(GameWindowMahjong);
            }

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

// ==== 麻将流程对象 ======================================================
game.procedure.Mahjong = new game.procedure.MahjongCls("res/Games/Mahjong/loading.json",
    "res/Games/Mahjong/scripts.json", GameDataMahjong);
