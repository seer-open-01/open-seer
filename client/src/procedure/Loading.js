// ==== 加载资源流程 ===========================================================================
game.procedure.Loading = {

    _ui             : null,         // 加载UI

    enter : function () {
        cc.log("enter LoadingProcedure");

        // 显示资源加载界面
        this._ui = new game.ui.ResLoadingWindow();
        game.UISystem.switchUI(this._ui);

        var texCache = cc.textureCache;
        cc.loader.loadJson("res/Home/loading.json", function (err, loadingRes) {
            if (!err) {
                var resCnt = loadingRes.length;
                var resLoadedCnt = 0;
                var resLoadedFn = function () {
                    resLoadedCnt += 1;
                    this._ui.setPercentage(Math.floor((resLoadedCnt / resCnt) * 100));
                    if (resLoadedCnt >= resCnt) {
                        this.doLoadFinished();
                    }
                }.bind(this);

                loadingRes.forEach(function (resName) {
                    if (resName.endsWith(".png") || resName.endsWith(".jpg")) {
                        texCache.addImageAsync(resName, resLoadedFn, this);
                    } else if (resName.endsWith(".plist")) {
                        // cc.spriteFrameCache.addSpriteFrameWithFile(resName);
                        resLoadedFn();
                    } else if (resName.endsWith(".json")) {
                        cc.loader.loadJson(resName, function (err, json) {
                            if (err) {
                                cc.log("资源加载失败：" + resName);
                            } else {
                                resLoadedFn();
                            }
                        });
                    } else {
                        cc.log("不支持的文件类型：" + resName);
                    }
                }.bind(this));
            } else {
                cc.log("加载资源 失败");
            }
        }.bind(this));
    },

    leave : function () {
        cc.log("leave LoadingProcedure");
    },

    update : function (dt) {},

    doLoadFinished : function () {
        // 初始化大厅网络系统
        game.hallNet.init();
        // 进入登陆流程
        game.Procedure.switch(game.procedure.Login);
    }
};
