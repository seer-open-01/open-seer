/**
 * 缓存控制类
 */
game.Cache = {

    _jsonFileName               : null,
    _onLoadingProgressChange    : null,
    _onLoadingFinished          : null,

    /**
     * 加载资源
     * @param jsonFileName                  资源文件路劲
     * @param onLoadingProgressChange       资源加载进度回调函数
     * @param onLoadingFinished             资源加载完成回调函数
     */
    loadingResources : function (jsonFileName, onLoadingProgressChange, onLoadingFinished) {
        this._jsonFileName = jsonFileName;
        this._onLoadingProgressChange = onLoadingProgressChange;
        this._onLoadingFinished = onLoadingFinished;
        if (this._jsonFileName) {
            var texCache = cc.textureCache;
            cc.loader.loadJson(this._jsonFileName, function (err, loadingRes) {
                if (!err) {
                    var resCnt = loadingRes.length;
                    var resLoadedCnt = 0;
                    var resLoadedFn = function () {
                        resLoadedCnt += 1;
                        // cc.log("resLoadedCnt ==>" + resLoadedCnt);
                        // cc.log("resCnt ==>" + resCnt);
                        this._onLoadingProgressChange && this._onLoadingProgressChange(Math.floor((resLoadedCnt / resCnt) * 100));
                        if (resLoadedCnt >= resCnt) {
                            this._onLoadingFinished && this._onLoadingFinished();
                        }
                    }.bind(this);

                    loadingRes.forEach(function (resName) {
                        if (resName.endsWith(".png") || resName.endsWith(".jpg")) {
                            // cc.log("==>加载图片 " + resName);
                            texCache.addImageAsync(resName, resLoadedFn, this);
                        } else if (resName.endsWith(".plist")) {
                            cc.spriteFrameCache.addSpriteFrames(resName);
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
        }
    },

    /**
     * 卸载资源
     * @param jsonFileName
     */
    unloadResources: function (jsonFileName) {
        this._jsonFileName = jsonFileName;
        var texCache = cc.textureCache;
        cc.loader.loadJson(jsonFileName, function (err, loadingRes) {
            if (!err) {
                loadingRes.forEach(function (resName) {
                    if (resName.endsWith(".png") || resName.endsWith(".jpg")) {
                        texCache.removeTextureForKey(resName);
                    } else if (resName.endsWith(".plist")) {
                        cc.spriteFrameCache.removeSpriteFramesFromFile(resName);
                    } else if (resName.endsWith(".json")) {
                        // 不做处理
                    } else {
                        cc.log("不支持的文件类型：" + resName);
                    }
                }.bind(this));
            } else {
                cc.log("==>卸载资源失败 失败");
            }
        });
    },

    /**
     * 加载动画帧图片
     * @param plistFile
     * @param pngFile
     */
    loadSpriteFrames: function (plistFile, pngFile) {
        cc.spriteFrameCache.addSpriteFrames(plistFile, pngFile);
    },

    /**
     * 根据名字获取缓存图片
     * @param pngName
     * @returns {*}
     */
    getSprite: function (pngName) {
        return new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(pngName));
    },

    /**
     * 获取plist纹理
     * @param pngName           纹理的路径名字
     * @return {*|cc.SpriteFrame}
     * @author Jiyou Mo
     */
    getPlistTexture : function (pngName) {
        return cc.spriteFrameCache.getSpriteFrame(pngName);
    }
};
