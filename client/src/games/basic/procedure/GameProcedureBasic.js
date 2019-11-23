/**
 * Created by Jiyou Mo on 2017/11/23.
 */
// 游戏转换流程基类
var GameProcedureBasic = cc.Class.extend({

    _gameLogic          : null,             // 游戏逻辑
    _gameData           : null,             // 游戏数据

    _resUrl             : "",               // 资源路径
    _srcUrl             : "",               // 脚本资源路径

    _srcIsLoaded        : false,            // 脚本文件是否已经加载过

    /**
     * 构造 (绝对不能重写)
     * @param resUrl            // 资源加载文件路劲 (loading.json)
     * @param srcUrl            // 脚本加载文件路径 (scripts.json)
     * @param gameDataCls
     * @return {boolean}
     */
    ctor : function (resUrl, srcUrl, gameDataCls) {
        this._resUrl = resUrl;
        this._srcUrl = srcUrl;
        this._gameData = new gameDataCls();
        return true;
    },

    /**
     *  进入流程 (该函数最好不要重写)
     */
    enter : function () {
        cc.log("==> 进入 基类游戏 流程 ============");
        // 加载资源
        game.Cache.loadingResources(this._resUrl, function (progress) {}, function () {});

        // 加载脚本
        this._loadScripts(function () {
                // 加载成功开启消息循环
                game.Procedure.resumeNetMessageDispatch();
            }.bind(this), function () {
                // 加载不成功
                game.ui.TipWindow.popup({"tipStr" : "游戏脚本加载错误! code：1861"}, function (win) { win.close(); });
                // 返回大厅流程
                game.Procedure.switch(game.procedure.Home);
            }.bind(this)
        );
    },

    /**
     * 当前流程切换到当前流程执行
     */
    reEnter : function () {
        game.Procedure.resumeNetMessageDispatch();
    },

    update : function (delta) {},

    /**
     * 退出场景(该函数重写必须调用父类函数)
     */
    leave : function () {
        if (this._gameLogic) {
            this._gameLogic.leave();
            this._gameLogic = null;
        }
        if (this._gameData) {
            this._gameData.reset();
        }
        // 释放资源
        game.Cache.unloadResources(this._resUrl);

        // 关闭游戏网络连接
        game.gameNet.disconnect();
    },

    /**
     * 加载游戏脚本
     * @param completeCallback          // 加载成功回调
     * @param errorCallCallback         // 加载错误回调
     * @private
     */
    _loadScripts : function (completeCallback, errorCallCallback) {
        var complete = true;
        if (!this._srcIsLoaded) {
            cc.loader.loadJson(this._srcUrl, function (err, scripts) {
                    if (!err) {
                        cc.loader.loadJs(scripts, function () {
                            cc.log("loadAllScripts 成功");
                            this._srcIsLoaded = true;
                        }.bind(this));
                    } else {
                        cc.log("loadAllScripts 失败");
                        complete = false;
                    }
                }.bind(this));
        }

        complete ? completeCallback && completeCallback() : errorCallCallback && errorCallCallback();
    },

    /**
     * 获取游戏数据
     * @return {null}
     */
    getGameData : function () {
        return this._gameData;
    },

    /**
     * 游戏切入后台
     */
    enterBackground: function () {
        cc.log("游戏切入后台");
    },

    /**
     * 获取UI界面
     */
    getUIWindow: function(){
        return this._gameLogic.getUIWindow();
    },

    // == 消息 ============================================================
    /**
     * 绑定网络监听消息处理
     */
    bindNetMessageHandler : function () {
        game.gameNet.bindMsgDisposeHandler(protocol.ProtoID.CLIENT_GAME_JOIN_ROOM, this.__NET_onPlayerEnterResponse.bind(this));

        // 发送请求房间数据的消息
        game.gameNet.sendMessage(protocol.ProtoID.CLIENT_GAME_JOIN_ROOM, {uid : game.DataKernel.uid, roomId : game.DataKernel.getRoomId()});
    },

    /**
     * 必须重写
     * 玩家进入房间消息处理 (该函数用于重写,注意，逻辑处理的时候，如果游戏逻辑存在，则不能进行任何处理，否则会对在线重连
     * 造成破坏性的影响)
     * @param msgData
     * @private
     */
    __NET_onPlayerEnterResponse : function (msgData) {
        cc.log("==> 游戏流程 玩家进入房间返回消息：" + JSON.stringify(msgData));
    }
});
