/**
 * 进程
 * @constructor
 */
function Process() {
    this.exiting                    = false;    // 进程正在退出

    this.sigHandlerMap              = {};       // 信号处理表
    this.uncaughtExceptionHandler   = null;     // 未处理异常处理程序
    this.endExitHandler             = null;     // 退出处理程序

    this.init();
}

Process.prototype = {
    /**
     * 初始化
     */
    init: function() {
        //程序终止(interrupt)信号, 在用户键入INTR字符(通常是Ctrl-C)时发出，用于通知前台进程组终止进程。
        process.on("SIGINT", function(){
            regSigHandler("SIGINT");
        }.bind(this));
        //程序结束(terminate)信号, 与SIGKILL不同的是该信号可以被阻塞和处理。通常用来要求程搜索序自己正常退出，shell命令kill缺省产生这个信号。如果进程终止不了，我们才会尝试SIGKILL。
        process.on("SIGTERM", function(){
            regSigHandler("SIGTERM");
        }.bind(this));

        var me = this;
        function regSigHandler(sig) {
            me.findSighandlers(sig).forEach(function(handler){
                handler();
            });
        }

        this.addSigHandler("SIGINT", function () {
            this.endExitHandler && this.endExitHandler();
        }.bind(this));
        this.addSigHandler("SIGTERM", function(){
            this.endExitHandler && this.endExitHandler();
        }.bind(this));

        // 注册异常处理程序
        process.on("uncaughtException", function(err){
            ERROR(err.stack);               //console.error(err.stack);
            if (this.uncaughtExceptionHandler && !this.uncaughtExceptionHandler(err)) {
                this.exiting = true;
                this.endExitHandler && this.endExitHandler();
            }
        }.bind(this));
    },

    /**
     * 设置未处理异常处理程序
     * @param handler
     */
    setUncaughtExceptionHandler: function(handler) {
        this.uncaughtExceptionHandler = handler;
    },

    /**
     * 退出处理程序
     * @param handler
     */
    setExitHandler: function(handler) {
        this.endExitHandler = handler;
    },

    /**
     * 进程退出状态
     * @returns {boolean}
     */
    isExiting: function() {
        return this.exiting;
    },

    /**
     * 添加信号处理程序
     * @param sig
     * @param handler
     */
    addSigHandler: function(sig, handler) {
        let sigHandlerArr = this.sigHandlerMap[sig] || [];
        sigHandlerArr.push(handler);
        this.sigHandlerMap[sig] = sigHandlerArr;
    },

    /**
     * 查找信号处理程序
     * @param sig
     * @returns {*|Array}
     */
    findSighandlers: function(sig) {
        return this.sigHandlerMap[sig] || [];
    },
};

exports.Process = Process;