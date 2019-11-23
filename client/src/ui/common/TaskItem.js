/**
 * Created by fuyang on 2018/10/12.
 */

var TaskConfig = TaskConfig || {};
//任务游戏名字描述配置
TaskConfig.gameName = {
    0: "任意游戏",
    1: "麻将",
    2: "斗地主",
    3: "象棋",
    4: "拼三张",
    5: "拼十",
    7: "跑得快",
    8: "血战麻将"
};
//游戏场次
TaskConfig.matchName = {
    0: "任意场次",
    1: "新手场",
    2: "平民场",
    3: "小资场",
    4: "龟丞相场",
    5: "龙太子场",
    6: "龙王场"
};

// 任务条目
game.ui.TaskItem = cc.Class.extend({
    _parentNode: null,
    _node: null,

    _titleLabel: null,     // 内容任务具体内容Label

    _taskInfo: null,     // 任务信息
    _labelRound: null,     // 完成情况显示
    _imgReward: null,     // 奖励图片
    _fntReward: null,     // 奖励数量

    _btnGoTask: null,     // 去任务的按钮    跳转到对应的游戏房间列表
    _bar: null,     // 任务进度条
    _getBtn: null,     // 领取奖励  未完成，未领取  3个按钮公用一个控件
    _taskId: null,     // 任务ID
    _isInGameOpenBox: null,     // 是否在游戏中打开了宝箱

    ctor: function (task, inGameOpenBox) {
        this._parentNode = ccs.load("res/Common/Task/TaskItem.json").node;
        this._node = game.findUI(this._parentNode, "Btn_Item");
        this._node.removeFromParent(false);
        this._taskInfo = task;
        this._isInGameOpenBox = inGameOpenBox;
        this._init();
        return true;
    },

    _init: function () {

        //领取奖励的按钮
        this._getBtn = game.findUI(this._node, "Btn_Get");
        this._getBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this._onGetClick(sender, type);
            }
        }, this);

        //隐藏按钮的交互，和显示，后面根据这条任务的具体信息设置成对应的状态， 1 未完成 2未领取 3已领取
        this._getBtn.setEnabled(false);

        this._btnGoTask = game.findUI(this._node, "Btn_Go");
        this._btnGoTask.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                if (game.ui.TaskWindow.inst != null) {
                    game.UISystem.closePopupWindow(game.ui.TaskWindow.inst);
                }
                this._onGoBtnClick();
            }
        }, this);

        this._imgReward = game.findUI(this._node, "ND_Reward");
        this._fntReward = game.findUI(this._node, "Fnt_Num");
        this._titleLabel = game.findUI(this._node, "Label_Title");
        this._bar = game.findUI(this._node, "ND_Bar");
        this._labelRound = game.findUI(this._node, "ND_Round");

        this._taskInfo && this._setInfo();
    },
    /**
     * 设置单条预制体的信息
     * @private
     */
    _setInfo: function () {
        //任务id是点击领取奖励的时候，发送给服务器的
        this._taskId = this._taskInfo.id;
        this._setContentStr();
        this._setTaskBtnStatus();
        //在游戏中通过宝箱打开的任务界面的时候，不显示去任务的跳转按钮
        this._setGoBtnShow();
    },
    /**
     * 设置本条预制体的前往按钮是不是显示，大厅点击任务的时候显示，游戏中点击的时候不显示
     * @private
     */
    _setGoBtnShow: function () {
        this._btnGoTask.setVisible(!this._isInGameOpenBox);
        this._btnGoTask.setEnabled(!this._isInGameOpenBox);
    },
    /**
     * 设置文本内容
     * @private
     */
    _setContentStr: function () {

        var taskData = this._taskInfo['game'];
        //游戏名字 0 任意游戏 1麻将 2斗地主 3象棋 4拼三张 5拼十
        var gameName = TaskConfig.gameName[taskData.type];
        //根据游戏类型获得对应的游戏模式描述
        // var gameSubType = this._getGameSubType(taskData.type, taskData.subType);
        //游戏场次
        var gameMatchName = TaskConfig.matchName[taskData.matchName];

        //任务要求
        var condition = this._taskInfo['condition'];
        var contentType = this._getContentStr(condition.type, condition.num);
        this._titleLabel.setString(gameName + gameMatchName + contentType);
        //当前完成数量
        var curProg = this._taskInfo.curProg;
        this._labelRound.setString(curProg + "/" + condition.num);

        //设置进度条的值
        var barValue = curProg / condition.num * 100;
        this._bar.setPercent(barValue);

        //奖励类型 1房卡 2奖券
        var reward = this._taskInfo.reward;

        var num = Utils.formatCoin2(reward.num);
        var rewardType = reward.type;

        //设置奖励条目对象的数据
        var path = "res/Common/Task/Images/PIC_Reward_";
        this._imgReward.setTexture(path + rewardType + ".png");
        this._fntReward.setString("x" + num);
    },
    /**
     * 设置任务按钮状态   0 未完成 1未领取 2已领取
     * @private
     */
    _setTaskBtnStatus: function () {
        //按钮动态替换图片的路径
        var strPathN = "res/Common/Task/Images/";
        var strPathP = "res/Common/Task/Images/";
        var strPathD = "res/Common/Task/Images/";
        var canClick = false;
        switch (this._taskInfo.status) {
            case 0:
                canClick = false;
                strPathN += "BTN_No.png";
                strPathP += "BTN_No.png";
                strPathD += "BTN_No.png";
                break;
            case 1:
                canClick = true;
                strPathN += "Btn_Get_N.png";
                strPathP += "Btn_Get_P.png";
                strPathD += "Btn_Get_D.png";
                break;
            case 2:
                canClick = false;
                strPathN += "BTN_AlreadyGet.png";
                strPathP += "BTN_AlreadyGet.png";
                strPathD += "BTN_AlreadyGet.png";
                break;
        }
        this._getBtn.setEnabled(canClick);
        this._getBtn.loadTextureNormal(strPathN);
        this._getBtn.loadTexturePressed(strPathP);
        this._getBtn.loadTextureDisabled(strPathD);
    },

    // 获得游戏模式文字描述
    _getGameSubType: function (gameType, subType) {
        var subTypeStr = "";
        if (subType == 0) {
            subTypeStr = "任意模式";
        } else {
            if (gameType == 1) {// 麻将
                subTypeStr = subType == 1 ? "两人模式" : "四人模式";
            } else if (gameType == 2) {// 斗地主
                subTypeStr = subType == 1 ? "普通模式" : "不洗牌模式";
            } else if (gameType == 3) {// 象棋
                subTypeStr = "";
            } else if (gameType == 4) {// 三张
                subTypeStr = subType == 1 ? "普通模式" : "激情模式";
            } else if (gameType == 5) {// 拼十
                subTypeStr = subType == 1 ? "看牌抢庄" : "自由抢庄";
            }
        }

        return subTypeStr;
    },
    // 获取内容描述
    _getContentStr: function (contentType, num) {
        var content = "";
        switch (contentType) {
            case 1:
                content = "对战" + num + "局";
                break;
            case 2:
                content = "单局达到" + num + "分";
                break;
            case 3:
                content = "一天累计打出" + num + "炸弹";
                break;
            case 4:
                content = "一天累计打出" + num + "春天";
                break;
            case 5:
                content = "连赢不中断" + num + "局";
                break;
            case 6:
                content = "一天累计当地主" + num + "次";
                break;
            case 7:
                content = "一天累计打出" + num + "次王炸";
                break;
            case 8:
                content = "一天累计赢得" + num + "次大关";
                break;
            case 9:
                content = "一天累计赢得" + num + "次小关";
                break;
            case 10:
                content = "一天累计自摸" + num + "次";
                break;
            case 11:
                content = "一天累计清一色胡" + num + "次";
                break;
            case 12:
                content = "一天累计七对胡" + num + "次";
                break;
            case 13:
                content = "一天累计抢杠胡" + num + "次";
                break;
            case 14:
                content = "一天累计十三幺" + num + "次";
                break;
            case 15:
                content = "一天累计对对胡" + num + "次";
                break;
            case 16:
                content = "一天累计胡幺九" + num + "次";
                break;
            case 17:
                content = "一天累计胡将对" + num + "次";
                break;
            case 18:
                content = "一天累计胡门清" + num + "次";
                break;
            case 19:
                content = "一天累计胡中张" + num + "次";
                break;
            case 20:
                content = "一天累计胡金钩钓" + num + "次";
                break;
            case 21:
                content = "一天累计天胡" + num + "次";
                break;
            case 22:
                content = "一天累计地胡" + num + "次";
                break;
        }

        return content;
    },
    // 领取按钮被点击
    _onGetClick: function () {
        cc.log("领取按钮被点击！" + this._taskId);
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_FETCH_TASK, {id: this._taskId});
        this._getBtn.setEnabled(false);
    },
    /**
     * 外部调用领取奖励和更新状态
     */
    updateAfterFetch: function () {
        //改变按钮状态
        this._setTaskBtnStatus();
    },
    /**
     * 点击了前往按钮
     * @private
     */
    _onGoBtnClick: function () {
        var gameData = this._taskInfo.game;
        var gameType = gameData.type > 0 ? gameData.type : 1;
        var subType = gameData.subType > 0 ? gameData.subType : 1;
        // 根据gameType区分是否是自建房
        if (gameType == GameTypeConfig.type.XQ) {
            game.Procedure.switch(game.procedure.RoomCard);
            return;
        }
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_REQ_MATCH_LIST, {gameType: gameType});
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_REQ_ROOM_LIST, {gameType: gameType});

    },
    /**
     * 获取本节点
     * @returns {null}
     */
    getNode: function () {
        return this._node;
    }
});
