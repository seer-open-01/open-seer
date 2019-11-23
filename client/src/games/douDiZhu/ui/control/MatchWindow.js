/**
 * Created by lyndon on 2018/07/04.
 * 斗地主 匹配界面窗口
 */
GameWindowDouDiZhu.MatchWindow = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点

    _isShow             : false,        // 当前是否显示着窗口

    _btnClose           : null,         // 关闭按钮
    _handlerClose       : null,         // 关闭按钮点击回调

    _handlerReady       : null,         // 准备发送函数

    _imgHeads           : [],           // 头像图片数组
    _effHeads           : [],           // 头像特效数组

    _labelMatchExplain  : null,         // 场次说明文字



    ctor : function (parentNode) {
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/DouDiZhu/MatchWindow/MatchWindow.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },
    
    _init : function () {
        this._btnClose = game.findUI(this._node, "BTN_Close");
        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._handlerClose && this._handlerClose();
            }
        }, this);

        this._imgHeads = [];
        this._effHeads = [];
        for (var i = 1; i <= 3; ++i) {
            this._imgHeads.push(game.findUI(this._node, "IMG_Head" + i));
            this._effHeads.push(game.findUI(this._imgHeads[i-1], "eff"));
        }

        this._labelMatchExplain = game.findUI(this._node, "TXT_MatchExplain");
    },

    reset : function () {
        this._labelMatchExplain.setString("");
        this.show(false);
    },

    show : function (bool) {
        this._node.setVisible(bool);
        if (bool) {
            this._updateInfo();
            this._node.stopAllActions();
            // 每1秒刷新界面
            this._node.runAction(cc.sequence(cc.delayTime(1.16), cc.CallFunc(function () {
                this._updateInfo();
                // this._checkSendReady();
            }, this)).repeatForever());
            // 每3秒检测是否发送准备消息函数
            this._node.runAction(cc.sequence(cc.CallFunc(this._checkSendReady, this),cc.delayTime(3)).repeatForever());
        } else {
            this._node.stopAllActions();
            for (var i = 0; i < this._effHeads.length; ++i) {
                this._effHeads[i].setVisible(false);
                this._effHeads[i].stopAllActions();
            }
        }
    },

    /**
     * 绑定关闭按钮回调函数
     * @param callback
     */
    onCloseClicked : function (callback) {
        this._handlerClose = callback;
    },

    /**
     * 绑定发送准备消息执行函数
     * @param callback
     */
    onReadyHandler : function (callback) {
        this._handlerReady = callback;
    },

    _updateInfo : function () {
        var gameData = game.procedure.DouDiZhu.getGameData();

        var path1 = "res/Games/DouDiZhu/Image/MatchWindow_4.png";
        var path2 = "res/Games/DouDiZhu/Image/MatchWindow_3.png";


        var allIndex = gameData.getAllPlayerIndex();

        var explainStr = "";
        var subType = gameData.subType;
        if (subType == 1) {
            explainStr = "普通模式  ";
            explainStr += MatchListConfig.getMatchNameStringByMatchName(gameData.matchName);
        } else {
            explainStr = "不洗牌模式  ";
            explainStr += MatchListConfig.getMatchNameStringByMatchName(gameData.matchName);
        }

        this._labelMatchExplain.setString(explainStr);
        // cc.log("============================ " + allIndex);
        for (var i = 0; i < this._imgHeads.length; ++i) {
            if (i < allIndex.length) {
                this._imgHeads[i].loadTexture(path1);
                var action = ccs.load("res/Animations/EffGameCom/EffFZB/EffFZB.json").action;
                action.play("animation0", true);
                this._effHeads[i].setVisible(true);
                this._effHeads[i].stopAllActions();
                this._effHeads[i].runAction(action);
            }else {
                this._imgHeads[i].loadTexture(path2);
                this._effHeads[i].setVisible(false);
                this._effHeads[i].stopAllActions();
            }

        }
    },

    /**
     * 检测是否执行准备消息发送
     * @private
     */
    _checkSendReady : function () {
        var gameData = game.procedure.DouDiZhu.getGameData();
        if (!gameData.getMainPlayer().ready) {
            // cc.log("================== send ready");
            // 自己没准备 则发送准备消息
            this._handlerReady && this._handlerReady();
        }
    }
});