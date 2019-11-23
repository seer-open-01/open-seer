/**
 * 更新器
 */
game.Updater = {

    _am: null,         // 资源管理器
    _needRestart: null,         // 是否需要重启
    _downloadUrl: null,
    __failCount: 0,
    _isShowTipWin: false,

    /**
     * 初始化更新器
     */
    init: function () {
        cc.log("==> 初始化更新器");
        var writablePath = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/";
        var osType = "win";
        if (cc.sys.ANDROID === cc.sys.platform) {
            osType = "android";
        } else if (cc.sys.IPHONE === cc.sys.platform || cc.sys.IPAD === cc.sys.platform) {
            osType = "ios";
        }
        cc.log("writablePath: " + writablePath);
        cc.log("osType: " + osType);
        this._am = new jsb.AssetsManager("res/project.manifest", writablePath, osType);
        this._am.retain();
    },

    /**
     * 本地版本文件是否加载
     * @returns {*|boolean|Boolean}
     */
    isLocalMainFestLoaded: function () {
        return this._am.getLocalManifest().isLoaded();
    },

    /**
     * 是否需要重启游戏
     * @returns {null}
     */
    isNeedRestart: function () {
        return this._needRestart;
    },

    /**
     * 开始更新
     */
    start: function () {
        cc.log("==> 更新器启动");
        cc.log("GameVersion: " + this._am.getLocalManifest().getVersion());
        cc.log("PackageUrl: " + this._am.getLocalManifest().getPackageUrl());
        cc.log("ManifestFileUrl: " + this._am.getLocalManifest().getManifestFileUrl());
        cc.log("VersionFileUrl: " + this._am.getLocalManifest().getVersionFileUrl());

        var listener = new jsb.EventListenerAssetsManager(this._am, this.cb.bind(this));
        cc.eventManager.addListener(listener, 1);
        this._am.update();
    },

    /**
     * 更新器回调函数
     * @param event
     */
    cb: function (event) {
        cc.log("==> 更新器回调");
        cc.log("Event Code: " + event.getEventCode());
        if (event.getMessage()) {
            cc.log("Event Msg: " + event.getMessage());
        }
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST :
                cc.log("==> ERROR_NO_LOCAL_MANIFEST 本地版本文件出错");
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION :
                cc.log("==> UPDATE_PROGRESSION 正在更新");
                var percent = event.getPercent();
                var percentByFile = event.getPercentByFile();
                cc.log("percent = " + percent + "%");
                cc.log("percentByFile = " + percentByFile + "%");
                game.procedure.Update.STATE_UPDATING.setPercentage(percentByFile.toFixed(2));
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST :
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST :
                cc.log("==> ERROR_DOWNLOAD_MANIFEST || ERROR_PARSE_MANIFEST 版本文件出错");
                game.procedure.Update.switch(game.procedure.Update.STATE_REMOTE_MANIFEST_FAILED);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE :
                cc.log("==> ALREADY_UP_TO_DATE 已经是最新版本");
                game.procedure.Update.switch(game.procedure.Update.STATE_ALREADY_UP_TO_DATE);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND :
                cc.log("==> NEW_VERSION_FOUND 发现大版本");
                // 如果是大版本则提示重新下载APP
                game.procedure.Update.switch(game.procedure.Update.STATE_UPDATING);
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED :
                cc.log("==> UPDATE_FINISHED 更新完毕");
                // 缓存文件搜索路径
                var searchPaths = this._am.getLocalManifest().getSearchPaths();
                cc.sys.localStorage.setItem("AppSearchPaths", JSON.stringify(searchPaths));
                this._needRestart = true;
                game.procedure.Update.switch(game.procedure.Update.STATE_FINISHED);
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED :
                cc.log("==> UPDATE_FAILED 更新失败");
                this.__failCount++;
                if (this.__failCount < 5) {
                    this._am.downloadFailedAssets();
                } else {
                    this.__failCount = 0;
                    game.finishedUpdate(false);
                }
                break;
            case jsb.EventAssetsManager.NEED_NEW_BUILD :
                cc.log("==> UPDATE_FAILED 下载新的版本");
                cc.log("==> url: " + event.getMessage());
                this._downloadUrl = event.getMessage();
                // 开始下载新的版本
                game.ui.TipWindow.popup({
                    tipStr: "点击确认下载新的版本"
                }, function (win) {
                    game.UISystem.closePopupWindow(win);
                    Utils.openBrowserWithUrl(this._downloadUrl);
                    // if (cc.sys.ANDROID === cc.sys.platform) {
                    //     cc.log("==> 下载安装包 " + this._downloadUrl);
                    //     jsb.reflection.callStaticMethod("com/hnwt/bsc/AppActivity", "openUrl",
                    //         "(Ljava/lang/String;)V", this._downloadUrl);
                    // } else if (cc.sys.IPHONE === cc.sys.platform || cc.sys.IPAD === cc.sys.platform) {
                    //     cc.log("==> IOS .iap update .");
                    //     this._downloadUrl = "http://itunes.apple.com/cn/app/id1329504891?mt=8";
                    //     jsb.reflection.callStaticMethod("AppController", "openUrl:", this._downloadUrl);
                    // }
                }.bind(this));
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING :
                cc.log("==> ERROR_UPDATING 更新出错");
                cc.log("资源更新失败： " + event.getAssetId());
                if (!this._isShowTipWin) {
                    this._isShowTipWin = true;
                    game.LocalDB.set("CLEAR_CACHE", true, true);
                    game.LocalDB.save();
                    game.ui.TipWindow.popup({
                        tipStr: "更新文件出错，点击确定重新开始更新"
                    }, function (win) {
                        game.UISystem.closePopupWindow(win);
                        Platform.exitGame();
                    });
                }
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS :
                cc.log("==> ERROR_DECOMPRESS 资源解压失败");
                break;
            default:
                break;
        }
    }
};
