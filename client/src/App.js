/**
 * App 游戏启动的主文件
 */
var game = game || {};

// 启动
game.start = function () {
    // 加载必须的脚本文件
    loadRequiredScripts(function () {
        cc.log("==>loadRequiredScripts 完毕");

        // 加载本地数据库
        game.LocalDB.load();

        // 清理出错下载文件的缓存
        var clearDir = game.LocalDB.get("CLEAR_CACHE", true);
        if(clearDir) {
            game.LocalDB.set("CLEAR_CACHE", false, true);
            game.LocalDB.save();
            game.cleanCache();
        }

        // 初始化并运行UI系统
        cc.director.runScene(game.UISystem);

        // 初始化流程
        game.Procedure.init();

        // 预加载登录大厅资源
        game.preloadHallRes();

        // 运行欢迎画面
        game.Procedure.switch(game.procedure.Welcome);

        // 结束欢迎画面
        game.procedure.Welcome.endShow(function () {
            // 判断进入更新流程
            if (Utils.isCurrentVersionIOS(game.config.APP_VERSION) && game.config.HOT_UPDATE) {
                game.Procedure.switch(game.procedure.Update);
            } else {
                game.finishedUpdate(true);
            }
        });
    });
};

// 登出
game.logout = function () {
    WeChat.clear();
    game.Procedure.switch(game.procedure.Login);
};

// 清除下载目录
game.cleanCache = function () {
    var _clean = function (subPath) {
        var writablePath = jsb.fileUtils.getWritablePath();
        if (jsb.fileUtils.isDirectoryExist(writablePath + subPath)) {
            cc.log("清除下载缓存==> " + writablePath + subPath);
            jsb.fileUtils.removeDirectory(writablePath + subPath);
        }
    };
    _clean("res");
    _clean("src_sign");
    _clean("version.manifest");
    _clean("project.manifest.temp");
};
// 预加载大厅的资源
game.preloadHallRes = function () {
    cc.loader.loadJson("res/Home/loading.json", function (err, loadingRes) {
        if (!err) {
            loadingRes.forEach(function (resName) {
                if (resName.endsWith(".png") || resName.endsWith(".jpg")) {
                    cc.textureCache.addImageAsync(resName, function () {});
                } else if (resName.endsWith(".plist")) {

                } else if (resName.endsWith(".json")) {
                    cc.loader.loadJson(resName, function (err, json) {
                        if (err) {
                            cc.log("资源加载失败：" + resName);
                        } else {}
                    });
                } else {
                    cc.log("不支持的文件类型：" + resName);
                }
            });
        } else {
            cc.log("加载资源 失败");
        }
    });
};

// 更新完成
game.finishedUpdate = function (bool) {
    if (bool) {
        // 更新成功。加载其他所有的脚本
        loadAllScripts(function () {
            // 初始化资源管理系统
            game.Resource.init();
            // 初始化声音系统
            game.Audio.init();
            // 进入资源加载界面
            // game.Procedure.switch(game.procedure.Loading);
            // 直接进入登录界面，登录界面预加载东西
            game.Procedure.switch(game.procedure.Login);
        });
    } else {
        // TODO 更新失败
    }
};
// ====== 帮助函数 ==================================================================

/**
 * 加载启动必须的脚本
 * @param callback
 */
function loadRequiredScripts (callback) {
    cc.loader.loadJs([
        "src/Platform.js",
        "src/Config.js",
        "src/DataKernel.js",
        "src/LocalDB.js",
        "src/Utils.js",
        "src/Updater.js",
        "src/Procedure.js",

        "src/procedure/Welcome.js",
        "src/procedure/Update.js",
        "src/procedure/Loading.js",

        "src/UISystem.js",
        "src/UIHelper.js",

        "src/ui/WelcomeWindow.js",
        "src/ui/UpdateWindow.js",
        "src/ui/ResLoadingWindow.js",

        "src/Audio.js",
        "src/ui/common/PopupWindow.js",
        "src/ui/common/TipWindow.js",

        "src/ui/common/RunText.js"
    ], callback);
}

/**
 * 加载所有脚本
 * @param callback
 */
function loadAllScripts (callback) {
    cc.loader.loadJson("res/scripts.json", function (err, scripts) {
        if (!err) {
            cc.loader.loadJs(scripts, callback);
        } else {
            // TODO
            cc.log("loadAllScripts 失败");
        }
    });
}