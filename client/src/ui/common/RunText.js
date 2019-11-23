// ==== 跑马灯 类 ======================================================================
var RunTextCls = cc.Class.extend({
    _node           : null,         // 本节点

    _labelRunText   : null,         // 走马文字

    _btnShowInfo    : null,         // 信息点击

    _isRunText      : false,        // 当前是否在播放信息
    _noticeIndex    : 0,            // 当前信息的播放索引

    _timeId         : 0,            // 计时器ID

    ctor : function () {
        this._node = ccs.load("res/Common/Notice/Notice.json").node;
        this._init();
        game.UISystem.getRunTextLayer().addChild(this._node);
        return true;
    },

    _init : function () {
        var uiNode = game.findUI(this._node, "IMG_NoticeBg");
        this._labelRunText = game.findUI(uiNode, "TXT_RunText");
        this._btnShowInfo = game.findUI(uiNode, "BTN_ShowInfo");

        this._btnShowInfo.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.ui.NoticeWindow.popup();
            }
        });
    },

    reset : function () {
        this._labelRunText.setString("");
        this._labelRunText.stopAllActions();
        this._isRunText = false;
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    changeScene : function () {
        cc.log("==> UI 跑马灯根据切换的流程改变位置!!!");
        var pro = game.Procedure.getProcedure();
        var position = cc.p(375, 600);
        switch (pro) {
            case game.procedure.RoomCard: position = cc.p(375, 615); break;
            case game.procedure.RoomList: position = cc.p(375, 615); break;
            case game.procedure.Home: position = cc.p(375, 600); break;
            case game.procedure.Mahjong: position = cc.p(350, 682); break;
            case game.procedure.Chess : position = cc.p(-1000, -100); break;
            case game.procedure.Login : position = cc.p(-1000, -100); break;
            default : cc.log("未找到需要设置跑马灯位置的流程"); break;
        }

        this._node.setPosition(position);
    },

    showText : function () {
        if (this._isRunText) {
            return;
        }

        var linShi = RunTextConfig.TemporaryNotice;
        var guDing = RunTextConfig.FixedNotice;
        var data = {};

        // 优先处理临时公告
        if (linShi.length > 0) {
            data = linShi.shift();
            this._tempRun(data, 0);
            game.ui.NoticeWindow.saveNotice(data);
            return;
        }

        // 处理固定公告
        if (guDing.length > 0) {
            // data.interval = guDing[0].interval;
            data.content = "";
            var now = new Date().getTodaySeconds();
            for (var i = 0; i < guDing.length; ++i) {
                var one = guDing[i];
                if (now >= one.startTime && now < one.endTime) {
                    game.ui.NoticeWindow.saveNotice(one);
                    data.content += one.content + "    "
                }
            }
            this._fixedRun(data);
        }
    },

    /**
     * 固定公告动画
     * @param data
     */
    _fixedRun: function (data) {
        this.show(true);
        this._labelRunText.setString(data.content);
        var textSize = this._labelRunText.getAutoRenderSize();
        this._labelRunText.setContentSize(textSize);
        var width = textSize.width;
        this._labelRunText.setPosition(cc.p(380, 15));

        var time = (380 + width) * 0.01;     // 每秒100个像素
        var seq = cc.sequence(cc.moveTo(time, -width, 15), cc.CallFunc(function () {
            this._isRunText = false;
            this.show(false);
        }, this));

        this._labelRunText.stopAllActions();
        this._labelRunText.runAction(seq);
        this._isRunText = true;
    },

    /**
     * 临时公告动画
     * @param data
     * @param number
     */
    _tempRun : function (data, number) {
        if (number >= data.count) {
            this._isRunText = false;
            this.show(false);
            this.showText();
            return;
        }
        this._isRunText = true;
        this._labelRunText.setString(data.content);
        var textSize = this._labelRunText.getAutoRenderSize();
        this._labelRunText.setContentSize(textSize);
        var width = textSize.width;
        this._labelRunText.setPosition(cc.p(380, 15));

        var time = (380 + width) * 0.01;     // 每秒100个像素

        var seq = cc.sequence(cc.moveTo(time, -width, 15), cc.delayTime(data.interval), cc.CallFunc(function () {
            this._tempRun(data, ++number);
        }, this));

        this._labelRunText.stopAllActions();
        this._labelRunText.runAction(seq);
        this.show(true);
    },

    /**
     * 开始检测跑马灯
     */
    startRuntText : function () {
        // 每分钟检测跑马灯
        this.stopRunText();
        this.showText();
        this._timeId = setInterval(this.showText.bind(this), 30000);
    },

    /**
     * 停止检测跑马灯
     */
    stopRunText : function () {
        if (this._timeId) {
            clearInterval(this._timeId);
            this._timeId = 0;
        }
        this.show(false);
    }
});


// 跑马灯对象
var RunText = new RunTextCls();
RunText.show(false);
