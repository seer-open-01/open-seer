/**
 * Created by Jiyou Mo on 2017/10/16.
 */
// 游戏窗口基础类
var GameWindowBasic = cc.Layer.extend({

    _node           : null,             // 本节点

    _uiChatBtn      : null,             // 聊天按钮
    _uiVoiceBtn     : null,             // 语音按钮
    _vChatProcess   : null,             // 语音按钮冷却图对象

    _tellVolume     : null,             // 录音音量
    _micDownTime    : null,             // 上次Down麦时间

    _consumeTip     : null,             // 消费提示
    // _systemInfo     : null,          // 系统信息

    _taskBoxNode        : null,         // 房间任务宝箱节点
    _taskBox            : null,         // 房间任务宝箱

    // === 函数 ==============================================================
    /**
     * 构造
     * @param winJson           窗口UI的设计路径
     * @return {boolean}
     */
    ctor: function(winJson) {
        this._super();
        this._init(winJson);
        game.UISystem.hideLoading();
        return true;
    },

    _init : function(winJson) {
        // 加载界面
        this._node = ccs.load(winJson).node;
        this.addChild(this._node);
    },

    /**
     * 初始化UI功能及事件(该函数重写后必须回调回来)
     */
    initUI : function () {
        // 功能按钮
        this._uiChatBtn = game.findUI(this._node, "ND_ChatBtn");
        this._uiVoiceBtn = game.findUI(this._node, "ND_VChatBtn");
        this._uiVoiceBtn.addTouchEventListener(this._onTellBtnClick, this);
        this._uiVoiceBtn.setEnabled(true);
        this._uiVoiceBtn.removeAllChildren();
        var fileData = this._uiVoiceBtn.getDisabledFile();
        var sp = new cc.Sprite(fileData.file);
        sp.setColor(cc.color(128, 128, 128));
        var size = this._uiVoiceBtn.getSize();
        this._vChatProcess = new cc.ProgressTimer(sp);
        this._vChatProcess.setPosition(size.width * 0.5, size.height * 0.5);
        this._vChatProcess.setScale(this._uiVoiceBtn.getScale());
        this._uiVoiceBtn.addChild(this._vChatProcess);
        this._vChatProcess.setType(cc.ProgressTimer.TYPE_RADIAL);
        this._vChatProcess.setBarChangeRate(cc.p(1, 0));
        this._vChatProcess.setReverseDirection(true);

        var winSize = cc.director.getWinSize();

        // 系统消息
        // var nd_systemInfo = game.findUI(this._node, "ND_SystemInfo");
        // this._systemInfo = GameWindowBasic.GameSystemInfo.getController();
        // this._systemInfo.addToNode(this._node,
        //     nd_systemInfo ? game.UIHelper.getWorldPosition(nd_systemInfo) : cc.p(10, winSize.height - 10));
        // this._systemInfo.show(true);

        // 语音窗口
        this._tellVolume = GameWindowBasic.VoiceVolume.getController();
        this._tellVolume.addToNode(this._node, cc.p(winSize.width * 0.5, winSize.height * 0.5));

        // 消费提示
        this._consumeTip = GameWindowBasic.ConsumeTip.getController();
        this._consumeTip.addToNode(this._node, cc.p(640, 200));

        // 房间任务宝箱
        this._taskBoxNode = game.findUI(this._node,"ND_TaskBox");
        this._taskBox = null;
    },

    /**
     * 聊天按钮点击回调
     * @param callback
     */
    onChatBtnClicked : function (callback) {
        this._uiChatBtn && this._uiChatBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },
    /**
     * 获取任务宝箱信息控件
     * @returns {null}
     */
    getTaskBox : function () {
        if (this._taskBox == null) {
            this._taskBox = new GameWindowBasic.TreasureBox(this._taskBoxNode);
            this._taskBox.reset();
        }
        return this._taskBox;
    },
    /**
     * 获取玩家自己的UI (必须重写的函数)
     * @param index
     * @returns {*}
     */
    getPlayer : function (index) {},

    /**
     * 语言按钮回调
     * @param sender
     * @param type
     * @private
     */
    _onTellBtnClick : function (sender, type) {
        // var gameData = game.Procedure.getProcedure().getGameData();
        // if (gameData.voiceStatus == 1) {
        //     if (type == ccui.Widget.TOUCH_BEGAN) {
        //         cc.log("开始录音");
        //         // 关闭背景音乐音量
        //         // cc.log("==> Mic up time " + (Date.getStamp() - this._micDownTime));
        //         // if(this._micDownTime != null && ((Date.getStamp() - this._micDownTime) < 0.5) && VoiceSDK._isMicDowning) {
        //         //     // game.ui.TipWindow.popup({
        //         //     //     tipStr: "上麦过于频繁，稍后再试"
        //         //     // }, function(win) {
        //         //     //     game.UISystem.closePopupWindow(win);
        //         //     // });
        //         //     return;
        //         // }
        //         game.Audio.pauseMusic();
        //         var voiceWin = this._tellVolume;
        //         voiceWin.show(true);
        //         VoiceSDK.micUp();
        //         cc.log("micUp");
        //         VoiceSDK.setVolumeRecordCallback(function (volume) {
        //             cc.log("==> tell volume change " + volume);
        //             voiceWin.setVolume(volume);
        //         });
        //     } else if (type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED) {
        //         cc.log("结束录音");
        //         // this._micDownTime = Date.getStamp();
        //         VoiceSDK.micDown();
        //         game.Audio.resumeMusic();
        //         this._tellVolume.show(false);
        //         this._uiVoiceBtn.setEnabled(false);
        //         this._vChatProcess.runAction(cc.ProgressFromTo(3, 100, 0));
        //         this._uiVoiceBtn.runAction(cc.sequence(cc.delayTime(3), cc.CallFunc(function () {
        //             this._uiVoiceBtn.setEnabled(true);
        //         }, this)));
        //     }
        // } else {
        //     if (type == ccui.Widget.TOUCH_BEGAN) {
        //         var winSize = cc.director.getWinSize();
        //         game.ui.HintMsg.showTipText( "本房间禁止使用语音", cc.p(winSize.width * 0.5, winSize.height * 0.5));
        //     }
        // }
    },

    /**
     * 开启更新系统信息 (必须重写)
     */
    openUpdateSystem : function () {
        // this._systemInfo.openUpdate();
    },

    /**
     * 关闭更新系统信息 (必须重写)
     */
    closeUpdateSystem : function () {
        // this._systemInfo.closeUpdate();
    },
	/**
     * 获取窗口节点
     */
    getWindowNode: function () {
        return this._node;

    },
    /**
     * 设置房间的牌局号 (用于子类重写,有牌局号的一定要重写，没有则不管)
     * @param roundID
     */
    setRoomRoundID : function (roundID) {
        cc.log("设置的牌局号是:" + roundID);
    },
    /**
     * 获取VoiceBtn按钮
     */
    getVoiceBtn: function () {
        return this._uiVoiceBtn;
    },
    /**
     * 获取消费提示
     */
    getConsumeTip: function () {
       return this._consumeTip;
    }
});
