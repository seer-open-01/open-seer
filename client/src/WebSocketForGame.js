/**
 * Created by pander on 2018/4/24.
 */
var NetClientClsForGame = NetClientCls.extend({

    _dispatchHandler        : {},           // 绑定的消息派发处理函数   {key : code, value : 处理的函数数组}
    _disConnectHandler      : null,         // 游戏断线执行函数

    ctor : function () {
        return true;
    },

    /**
     * 初始化
     */
    init : function () {
        if (this._webSocket) {
            if (this._isConnected) {
                this._webSocket.close();
            }
            this._webSocket = null;
        }

        this._isConnected = false;

        this._connectIp = "";
        this._connectPort = "";

        this._messages = [];
        this._dispatchHandler = {};
    },

    /**
     * 连接服务器
     * @param ip
     * @param port
     * @param callback
     */
    connect : function (ip, port, callback) {
        cc.log("==> 正在连接游戏服务器...");
        this._doConnect(ip, port, callback);
    },

    /**
     * 执行连接服务器
     * @param ip
     * @param port
     * @param callback
     * @private
     */
    _doConnect : function (ip, port, callback) {
        if (this._webSocket) {
            // 释放旧客户端
            if (this._isConnected) {
                this._webSocket.close();
            }
            this._webSocket = null;
        }
        // 使用新客户端
        this._webSocket = new WebSocket("ws://" + ip + ":" + port);

        this._webSocket.onopen = function (evt) {
            cc.log("==> 连接游戏登录服务器成功:" + JSON.stringify(evt));
            this._isConnected = true;
            callback && callback(true);
        }.bind(this);

        this._webSocket.onerror = function(evt) {
            cc.log("游戏网络控制：网络错误:" + evt);
            callback && callback(false);
        };

        this._webSocket.onmessage = this._onMessage.bind(this);

        this._webSocket.onclose = function (evt) {
            cc.log("游戏网络控制：连接关闭：" + evt);
            if (this._isConnected) {
                // 不是主动断开
                // 执行断线处理函数
                this._disConnectHandler && this._disConnectHandler();
            }
            this._isConnected = false;
        }.bind(this);
    },

    /**
     * 消息处理
     * @param evt
     * @private
     */
    _onMessage : function (evt) {
        // cc.log("游戏网络控制：收到来自服务器的消息：" + evt.data);
        var data = JSON.parse(this.decode(evt.data));
        var code = data.code;
        var msg = data.args;

        // 处理心跳包
        if (code == protocol.ProtoID.CLIENT_HEARTBEAT) {
            this._isReceiveHeartbeat = true;
            return;
        }

        // 消息进入缓存
        this._messages.push({k : code, v : msg});
    },

    /**
     * 发送消息到服务器
     * @param routerCode
     * @param message
     */
    sendMessage : function (routerCode, message) {
        cc.log("向游戏服务器发送数据 code:" + routerCode + "  args:" + JSON.stringify(message));
        // if (this._webSocket.readyState == WebSocket.OPEN)
        if (this._isConnected) {
            var json = {};
            json.code = routerCode;
            json.args = message || {};
            this._webSocket.send(this.encryption(JSON.stringify(json)));
        } else {
            cc.log("游戏 webSocket 未连接或启动，请启动连接后再尝试发送数据");
            // 触发断线
            this._disConnectHandler && this._disConnectHandler();
        }
    },

    /**
     * 派发消息处理函数
     */
    dispatchMessage : function () {
        var msg = this._messages.shift();
        if (msg) {
            // 处理消息
            if (!this._dispatchHandler.hasOwnProperty(msg.k)) {
                cc.log("消息未绑定执行的code:" + msg.k);
                return;
            }

            // 拿到消息函数数组 便利处理消息
            var funArray = this._dispatchHandler[msg.k];
            funArray.forEach(function (fun) {
                fun(msg.v);
            });
        }
    },

    /**
     * 绑定指定消息 code 处理的函数
     * @param handlerCode
     * @param callback      被绑定执行的函数 会回传一个消息的 msg 作为参数
     */
    bindMsgDisposeHandler : function (handlerCode, callback) {
        cc.log("==> 执行消息处理函数的绑定 code:" + handlerCode);
        if (!this._dispatchHandler.hasOwnProperty(handlerCode)) {
            this._dispatchHandler[handlerCode] = [];
        }

        this._dispatchHandler[handlerCode].push(callback);
    },

    /**
     * 解绑指定消息 code 处理的一个函数
     * @param handlerCode
     * @param callback
     */
    unbindMsgDisposeHandler : function (handlerCode, callback) {
        cc.log("==> 解除消息处理函数的绑定 code:" + handlerCode);
        if (!this._dispatchHandler.hasOwnProperty(handlerCode)) {
            cc.log("===> 执行解绑的 handlerCode 未进行绑定  code:" + handlerCode);
            return;
        }

        var array = this._dispatchHandler[handlerCode];
        for (var i = 0; i < array.length; ++i) {
            if (array[i] == callback) {
                array.splice(i, 1);
                if (array.length < 1) {
                    delete this._dispatchHandler[handlerCode];
                }
                return;
            }
        }

        cc.log("===>执行code中未找到要解绑的函数 code:" + handlerCode);
    },

    /**
     * 绑定游戏断线执行函数 (大厅监测用的回调函数)
     * @param callback
     */
    onDisconnectCallback : function (callback) {
        this._disConnectHandler = callback;
    },

    /**
     * 是否已经连接上了
     * @returns {boolean}
     */
    isConnected : function () {
        return this._isConnected;
    },

    /**
     * 执行发送心跳包函数
     * @private
     */
    _doSendHeartBeat : function () {
        // cc.log("===> 发送心跳包");
        if (this._isReceiveHeartbeat) {
            this._isReceiveHeartbeat = false;
            this.sendMessage(protocol.ProtoID.CLIENT_HEARTBEAT, {});
        } else {
            // 执行游戏断线
            this._disConnectHandler && this._disConnectHandler();
        }
    }
});

/**
 * 游戏的WebSocket
 */
game.gameNet = new NetClientClsForGame();