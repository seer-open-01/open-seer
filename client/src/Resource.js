/**
 * 资源管理
 * @type {{_texCache: null, init: game.Resource.init, loadImageAsync: game.Resource.loadImageAsync}}
 */

game.Resource = {
    _texCache           : null,

    /**
     * 初始化
     */
    init : function () {
        this._texCache = cc.textureCache;
    },

    /**
     * 异步加载图片
     * @param url
     * @param callback
     */
    loadImageAsync : function (url, callback) {
        if (url && url != null) {
            this._texCache.addImageAsync(url, function (tex) {
                callback && callback(tex);
            }, this);
            return;
        }

        callback && callback(null);
    }
};
