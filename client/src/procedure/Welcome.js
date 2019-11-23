/**
 * Created by pander on 2018/5/8.
 */
// ==== 欢迎页面流程 =============================================
game.procedure.Welcome = {

    _ui             : null,         // 加载UI

    enter : function () {
        cc.log("enter LoadingProcedure");

        // 显示资源加载界面
        this._ui = new game.ui.WelcomeWindow();
        game.UISystem.switchUI(this._ui);
    },

    leave : function () {
        cc.log("leave LoadingProcedure");
    },

    update : function (dt) {},

    /**
     * 结束显示
     * @param callback
     */
    endShow : function (callback) {
        this._ui.playShowAnimation(callback);
    }
};