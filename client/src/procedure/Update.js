// ==== 更新流程 ====================================================================================
game.procedure.Update = {

    _ui: null,         // 更新UI
    _curState: null,         // 当前状态

    enter: function () {
        cc.log("enter UpdateProcedure");

        // 显示更新界面
        this._ui = new game.ui.UpdateWindow();
        game.UISystem.switchUI(this._ui);

        // 初始化更新器
        game.Updater.init();

        // 开始检查更新
        this.switch(this.STATE_CHECKING);
    },

    leave: function () {
        cc.log("leave UpdateProcedure");
    },

    update: function (dt) {
        this._curState && this._curState.update(dt);
    },

    switch: function (state) {
        this._curState && this._curState.leave();
        this._curState = state;
        this._curState && this._curState.enter();
    },

    getUI: function () {
        return this._ui;
    }
};

// ==== 检查更新 ==============================================================================================
game.procedure.Update.STATE_CHECKING = {

    _ui: null,         // UI

    _checkingStr: "正在检查更新",
    _checkingStrAdd: "",
    _checkingStrAddLen: 0,
    _checkingStrTime: 0,

    enter: function () {
        cc.log("enter STATE_CHECKING");

        this._ui = game.procedure.Update.getUI();

        this._ui.setLoadingInfo(this._checkingStr);
        this._ui.setPercentage(100);

        if (!game.Updater.isLocalMainFestLoaded()) {
            game.procedure.Update.switch(game.procedure.Update.STATE_CHECK_LOCAL_FAILED);
        } else {
            game.Updater.start();
        }
    },

    leave: function () {
        cc.log("leave STATE_CHECKING");
    },

    update: function (dt) {
        // 更新文本信息
        this._checkingStrTime += dt;
        if (this._checkingStrTime >= 0.5) {
            this._checkingStrTime = 0;
            this._checkingStrAdd += ".";
            this._checkingStrAddLen += 1;
            this._ui.setLoadingInfo(this._checkingStr + this._checkingStrAdd);
            if (this._checkingStrAddLen >= 3) {
                this._checkingStrAdd = "";
                this._checkingStrAddLen = 0;
            }
        }
    }
};

// ==== 检查本地文件失败 ====================================================================================
game.procedure.Update.STATE_CHECK_LOCAL_FAILED = {

    _ui: null,      // UI

    enter: function () {
        cc.log("enter STATE_CHECK_LOCAL_FAILED");
        this._ui = game.procedure.Update.getUI();
        this._ui.setLoadingInfo("没有找到本地版本文件，跳过资源更新。");
        game.ui.TipWindow.popup({
            tipStr: "文件更新失败，请检查网络连接后重启游戏。"
        }, function (win) {
            game.UISystem.closePopupWindow(win);
            Platform.exitGame();
        });
        setTimeout(function () {
            game.finishedUpdate(true);
        }, 500);
    },

    leave: function () {
        cc.log("leave STATE_CHECK_LOCAL_FAILED");
    },

    update: function (dt) {
    }
};

// ==== 远程版本文件错误 ====================================================
game.procedure.Update.STATE_REMOTE_MANIFEST_FAILED = {
    _ui: null,         // UI

    enter: function () {
        cc.log("enter STATE_REMOTE_MANIFEST_FAILED");

        this._ui = game.procedure.Update.getUI();
        this._ui.setLoadingInfo("下载更新文件失败，跳过资源更新。");
        game.ui.TipWindow.popup({
            tipStr: "文件更新失败，请检查网络连接后重启游戏。"
        }, function (win) {
            game.UISystem.closePopupWindow(win);
            Platform.exitGame();
        });
        setTimeout(function () {
            game.finishedUpdate(true);
        }, 500);
    },

    leave: function () {
        cc.log("leave STATE_REMOTE_MANIFEST_FAILED");
    },

    update: function (dt) {
    }
};

// ==== 已经是最新版本 =======================================================
game.procedure.Update.STATE_ALREADY_UP_TO_DATE = {
    _ui: null,         // UI

    enter: function () {
        cc.log("enter STATE_ALREADY_UP_TO_DATE");

        this._ui = game.procedure.Update.getUI();
        this._ui.setLoadingInfo("已经是最新版本。");

        setTimeout(function () {
            game.finishedUpdate(true);
        }, 500);
    },

    leave: function () {
        cc.log("leave STATE_ALREADY_UP_TO_DATE");
    },

    update: function (dt) {
    }
};

// ==== 更新中 ==============================================================
game.procedure.Update.STATE_UPDATING = {
    _ui: null,         // UI

    enter: function () {
        cc.log("enter STATE_UPDATING");

        this._ui = game.procedure.Update.getUI();
        this._ui.setPercentage(0);
        this._ui.setLoadingInfo("正在更新文件 0%");
    },

    leave: function () {
        cc.log("leave STATE_UPDATING");
    },

    update: function (dt) {
    },

    setPercentage: function (value) {
        if (this._ui) {
            this._ui.setLoadingInfo("正在更新文件 " + value + "%");
            this._ui.setPercentage(value);
        }
    }
};

// ==== 更新完毕 =============================================================
game.procedure.Update.STATE_FINISHED = {
    _ui: null,         // UI

    enter: function () {
        cc.log("enter STATE_FINISHED");

        this._ui = game.procedure.Update.getUI();
        this._ui.setLoadingInfo("更新完毕。");
        this._ui.setPercentage(100);

        setTimeout(function () {
            if (game.Updater.isNeedRestart()) {
                // 重启游戏
                cc.log("重启游戏");
                cc.game.restart();
            } else {
                // 进入登陆界面
                game.finishedUpdate(true);
            }
        }, 500);
    },

    leave: function () {
        cc.log("leave STATE_FINISHED");
    },

    update: function (dt) {
    }
};