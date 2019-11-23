/**
 * Created by Jiyou Mo on 2017/10/16.
 */

// 玩家个人基本信息界面
GameWindowBasic.GamePlayerBasic = cc.Class.extend({

    // === 属性 ==============================================================
    _index          : -1,            // 当前玩家的座位号(所在的位置)

    // === 函数 ==============================================================
    /**
     * 构造
     * @return {boolean}
     */
    ctor : function(node, index) {
        return true;
    },

    /**
     * 重置数据 (重写的函数)
     */
    reset : function () {
        this._index = -1;
    },

    /**
     * 设置玩家显示的信息（子类必须且重写必须要调用父类的函数）
     * @param index
     * @param info
     */
    setInfo : function(index, info) {
        cc.log("==> Player_Basic.setInfo: " + index + " ," + JSON.stringify(info));
        this._index = index;
        if (this._index == -1) {
            this.reset();
        }
    },

    /**
     * 是否显示该对象 (必须重写)
     * @param bool
     */
    show : function (bool) {},

    /**
     * 设置在线信息 (重写的函数)
     * @param bool 是否在线  true 在线(隐藏离线图标)  false不在线(显示离线图标)
     */
    setOnline : function (bool) {},

    /**
     * 显示准备图标 (重写的函数)
     * @param bool
     */
    showReady : function(bool) {},

    /**
     * 设置玩家当前分数 (重写的函数)
     * @param score 类型是一个number
     */
    setScore : function(score) {},

    /**
     * 显示聊天表情 (重写的函数)
     * @param id 表情的id号
     */
    showChatFace : function(id) {},

    /**
     * 显示聊天信息 (重写的函数)
     * @param msg 聊天的字符串信息
     */
    showChatMsg : function(msg) {},

    /**
     * 头像点击回调 (重写的函数)
     * @param callback 回调的函数 参数回传该玩家的座位号 如果该座位没人，则传-1
     */
    onHeadPicClicked : function (callback) {},

    /**
     * 获取礼物节点的世界坐标位置
     */
    getGiftWorldPos : function () {},

    /**
     * 设置现金数量
     * @param bean
     */
    setBean : function (bean) {}
});