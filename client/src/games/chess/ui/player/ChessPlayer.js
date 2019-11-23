/**
 * Author       : lyndon
 * Date         : 2018-07-23
 * Description  : 象棋棋盘
 */
WindowChess.Player = GameWindowBasic.GamePlayerBasic.extend({

    _node               : null,
    _index              : -1,
    _logicIndex         : -1,

    _bean               : null,         // 金贝数字
    _head               : null,         // 头像
    _offline            : null,         // 离线标志
    _dealer             : null,         // 房主标志
    _ready              : null,         // 准备标志
    _name               : null,         // 名字
    _id                 : null,         // id
    _time               : null,         // 步时
    _red                : null,         // 红方阵营标志
    _black              : null,         // 黑方阵营标志
    _gift               : null,         // 礼物节点
    _labelChat          : null,         // 聊天文字标签
    _chatBg             : null,         // 聊天背景
    _light              : null,         // 流光

    ctor: function (node, index) {
        this._node = node;
        this._index = index;
        this._init();
        return true;
    },
    
    _init: function () {
        this._bean = game.findUI(this._node, "ND_Bean");
        this._offline = game.findUI(this._node, "ND_Offline");
        this._dealer = game.findUI(this._node, "ND_Dealer");
        this._ready = game.findUI(this._node, "ND_Ready");
        this._name = game.findUI(this._node, "ND_Name");
        this._id = game.findUI(this._node, "ND_ID");
        this._time = game.findUI(this._node, "ND_Time");
        this._red = game.findUI(this._node, "ND_Red");
        this._black = game.findUI(this._node, "ND_Black");
        this._gift = game.findUI(this._node, "ND_Gift");
        this._labelChat = game.findUI(this._node, "TXT_ChatMsg");
        this._chatBg = game.findUI(this._node, "IMG_ChatBG");
        this._labelChat.setVisible(false);
        this._chatBg.setVisible(false);

        this._light = game.findUI(this._node, "ND_Light");
        var action = ccs.load("res/Animations/EffChess/EffLight/EffLight.json").action;
        action.play("animation0", true);
        this._light.runAction(action);
        this.showLight(false);
        this.setCamp(-1);
        this._head = new GameWindowBasic.GameHeadPic(game.findUI(this._node, "ND_HeadPic"));
    },
    
    reset: function () {
        this.show(false);
    },
    
    setInfo: function (index, info) {
        cc.log("==> 象棋玩家信息 " + JSON.stringify(info));
        this._logicIndex = index;
        if (this._logicIndex == -1) {
            this.reset();
            this.show(false);
            return;
        }
        this.show(true);
        this.setHeadPic(info.headPic);
        this.setName(info.name);
        this.setUID(info.uid);
        this.setBean(info.bean || 0);
        this.setOnline(info.online);
        this.showReady(!info.playing && info.ready);
        this.showClock(false);
        this.showDealer(index == 1);
    },

    /**
     * 设置头像
     * @param headPic
     */
    setHeadPic: function (headPic) {
        this._head.setHeadPic(headPic);
    },

    /**
     * 设置名字
     * @param name
     */
    setName: function (name) {
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._name.setString(name);
    },
    /**
     * 设置UID
     * @param id
     */
    setUID: function (id) {
        this._id.setString("ID:" + id);
    },
    /**
     * 设置金贝
     */
    setBean: function (bean) {
        bean = Utils.formatCoin(bean);
        this._bean.setString("" + bean);
    },

    /**
     * 设置离线标志
     * @param vis
     */
    showDealer: function (vis) {
        this._dealer.setVisible(vis);
    },

    /**
     * 显示准备
     * @param vis
     */
    showReady: function (vis) {
        this._ready.setVisible(vis)
    },
    /**
     * 显示流光
     * @param show
     */
    showLight: function (show) {
        this._light.setVisible(show);
    },
    /**
     * 显示步时
     */
    showClock: function (show) {
        this._time.setString("00:00");

        if (!show) {
            this._time.stopAllActions();
            return;
        }

        var time = 0;
        var mm = 0;
        var ss = 0;
        this._time.stopAllActions();
        this._time.runAction(cc.Sequence(cc.DelayTime(1.0), cc.CallFunc(
            function () {
                if (time < 6000) {
                    mm = Math.floor(time / 60);
                    ss = Math.floor(time % 60);
                }else {
                    mm = 99;
                    ss = 99;
                }
                mm = mm < 10 ? "0" + mm : mm;
                ss = ss < 10 ? "0" + ss : ss;
                this._time.setString("" + mm + ":" + ss);
                time ++;
            }.bind(this)
        ), this).repeatForever());

    },

    /**
     * 设置红黑阵营
     */
    setCamp: function (camp) {
        this._red.setVisible(1 == camp);
        this._black.setVisible(2 == camp);
    },

    /**
     * 设置离线标志
     * @param vis
     */
    setOnline: function (vis) {
        this._offline.setVisible(!vis);
    },

    /**
     * 注册头像点击回调
     * @param callback
     */
    onHeadPicClicked: function (callback) {
        this._head.setClickedHandler(function () {
            callback && callback(this._logicIndex);
        }.bind(this));
    },
    /**
     * 显示聊天表情 (重写的函数)
     * @param id 表情的id号
     */
    showChatFace : function(id) {
        GameChatEmojiController.playEmoji(this._gift, id);
    },

    /**
     * 显示聊天信息 (重写的函数)
     * @param msg 聊天的字符串信息
     */
    showChatMsg : function(msg) {

        this._chatBg.stopAllActions();
        this._chatBg.setVisible(true);
        this._labelChat.setString("" + msg);
        this._labelChat.setVisible(true);
        var doDelay = cc.DelayTime(3.0);
        var doCall = cc.CallFunc(function () {
            this._chatBg.setVisible(false);
            this._labelChat.setVisible(false);
        }, this);

        this._chatBg.runAction(cc.Sequence(doDelay, doCall));
    },

    /**
     * 获取礼物节点世界坐标位置
     * @return {*|null}
     */
    getGiftWorldPos : function () {
        return game.UIHelper.getWorldPosition(this._gift);
    },

    /**
     * 显示本节点
     * @param vis
     */
    show: function (vis) {
        this._node.setVisible(vis);
    }
});