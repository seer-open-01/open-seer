/**
 * Author       : lyndon
 * Date         : 2019-07-18
 * Description  : 推广窗口
 */

game.ui.ExtendWin = game.ui.PopupWindow.extend({
    _node       : null,

    _btns               : [],               // 按钮组
    _views              : [],               // 内容页
    _mask               : null,             // 遮罩

    _cur_profit         : null,             // 当前推广奖励
    _remain_1           : null,             // 剩余可提1
    _today_profit       : null,             // 今日奖励
    _yesterday_profit   : null,             // 昨日奖励
    _total_people       : null,             // 总人数
    _today_people       : null,             // 今日人数
    _total_profit       : null,             // 累计推广奖励

    _line_profit        : null,             // 整线奖励
    _remain_2           : null,             // 剩余可提2
    _total_profit2      : null,             // 累计整线奖励
    _level_cfg          : [],               // 段位图片
    _people_cfg         : [],               // 段位人数
    _profit_cfg         : [],               // 段位收益

    _qr_code            : null,             // 二维码
    _label_id           : null,             // uid
    _data               : null,             // 数据
    ctor: function () {
        this._super();
        this._node = ccs.load("res/Home/Extend/Extend.json").node;
        this.addChild(this._node);
        this._init();

        return true;
    },

    _init: function () {
        // 页签按钮组
        this._btns = [];
        this._views = [];
        for (var i = 1; i <= 3; ++i) {
            var temp = game.findUI(this._node, "BTN_00" + i);
            temp.id = i;
            this._btns.push(temp);

            var temp2 = game.findUI(this._node, "ND_" + i);
            temp2.id = i;
            this._views.push(temp2);
        }
        this._mask = game.findUI(this._node, "ND_M");
        // 控件查找--内容1
        this._cur_profit = game.findUI(this._views[0], "Fnt_Cur");
        this._remain_1 = game.findUI(this._views[0], "Label_0");
        this._today_profit = game.findUI(this._views[0], "Label_1");
        this._yesterday_profit = game.findUI(this._views[0], "Label_2");
        this._total_people = game.findUI(this._views[0], "Label_3");
        this._today_people = game.findUI(this._views[0], "Label_4");
        this._total_profit = game.findUI(this._views[0], "Label_5");
        // 控件查找--内容2
        this._line_profit = game.findUI(this._views[1],"Fnt_Cur");
        this._remain_2 = game.findUI(this._views[1], "Label_0");
        this._total_profit2 = game.findUI(this._views[1], "Label_5");
        this._level_cfg = []; this._people_cfg = []; this._profit_cfg = [];
        for (i = 1; i <= 4; ++i) {
            this._level_cfg.push(game.findUI(this._views[1], "Level_" + i));
            this._people_cfg.push(game.findUI(this._views[1], "People_" + i));
            this._profit_cfg.push(game.findUI(this._views[1], "Cash_" + i));
        }
        // 控件查找--内容3
        this._qr_code = game.findUI(this._views[2], "ND_QRC");
        this._label_id = game.findUI(this._views[2], "Label_ID");
        // 注册按钮点击
        this.registerBtnClick();
        // 设置初始状态
        this.setBtnSelect(1);
        // 请求推广消息
        game.UISystem.showLoading();
        game.hallNet.sendMessage(protocol.ProtoID.TG_INFO, {});
    },
    // 更新信息
    updateInfo: function (data) {
        this._data = data;
        // 内容1
        var cur_profit = data['curAgentProfit'] || 0;
        this._cur_profit.setString(Utils.formatCoin(cur_profit));
        var remain = data['plus'] || 0;
        this._remain_1.setString("剩余:" + Utils.formatCoin2(remain) + "可提");
        this._remain_2.setString("剩余:" + Utils.formatCoin2(remain) + "可提");
        var today = data['today'];
        this._today_profit.setString(Utils.formatCoin2(today['profit']));
        this._today_people.setString(today['num']);
        var yesterday = data['todayFront1'];
        this._yesterday_profit.setString(Utils.formatCoin2(yesterday['profit']));
        var total_people = data['allExtendP'];
        this._total_people.setString(total_people);
        var total_profit_extend = data['lsTReward'] || 0;
        this._total_profit.setString("累计推广奖励：" + Utils.formatCoin2(total_profit_extend));
        // 内容2
        var line_profit = data['curOneDayNodeSum'];
        this._line_profit.setString(Utils.formatCoin(line_profit));
        var total_profit_line = data['lsZReward'] || 0;
        this._total_profit2.setString("累计总线奖励：" + Utils.formatCoin2(total_profit_line));
        var curLevel = data['curLevel'];
        var path = "res/Home/Extend/Image/Level_";
        for (var i = 0; i < this._level_cfg.length; ++i) {
            // cc.log("=============> " + path + (i + 1));
            if (curLevel == i + 1) {
                this._level_cfg[i].setTexture(path + (i + 1) + "N.png");
            }else {// 高亮
                this._level_cfg[i].setTexture(path + (i + 1) + "X.png")
            }
        }
        var cfg = data['nodeInfo'];
        for (i = 0; i < this._people_cfg.length; ++i) {
            this._people_cfg[i].setString(cfg[i]['needNum']);
            this._profit_cfg[i].setString(Utils.formatCoin2(cfg[i]['needProfit']));
        }
        // 内容3
        var qr_code = data['url'];
        cc.textureCache.addImageAsync(qr_code, function(tex) {
            this._qr_code.setTexture(tex);
        }.bind(this), this);

        this._label_id.setString("ID:" + game.DataKernel.uid);
        // cc.loader.loadImg(qr_code, function(err, tex) {
        //     if (err) return;
        //     this._qr_code.setTexture(tex);
        // }.bind(this), this);
    },

    // 页签按钮选中
    setBtnSelect: function (index) {
        for (var i = 0; i < this._btns.length; ++i) {
            this._btns[i].setEnabled(this._btns[i].id != index);
        }
        this.switchItem(index);
    },
    // 切换内容
    switchItem: function (index) {
        for (var i = 0; i < this._views.length; ++i) {
            this._views[i].setVisible(this._views[i].id == index);
        }

        if (index == 2) {
            this._views[1].setVisible(false);
        }

        this._mask.setVisible(index == 2);
    },
    // 注册按钮点击
    registerBtnClick: function () {
        for (var i = 0; i < this._btns.length; ++i) {
            this._btns[i].addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    game.Audio.playBtnClickEffect();
                    this.setBtnSelect(sender.id);
                }
            }, this)
        }

        var btnClose = game.findUI(this._node, "BTN_Close");
        btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this.close();
            }
        }, this);

        var btnTiBi = game.findUI(this._node, "BTN_TiBi");
        btnTiBi.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                cc.log("提币！");
                game.hallNet.sendMessage(protocol.ProtoID.TG_CAN_TI, {});
                // game.ui.CashOut.popup();
            }
        }, this);


        var btnT1 = game.findUI(this._views[0], "BTN_Ti");
        var btnT2 = game.findUI(this._views[1], "BTN_Ti");

        btnT1.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                cc.log("提币记录1");
                game.hallNet.sendMessage(protocol.ProtoID.TG_TI_RECORD, {});
            }
        }, this);

        btnT2.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                cc.log("提币记录2");
                game.hallNet.sendMessage(protocol.ProtoID.TG_TI_RECORD, {});
            }
        }, this);

        var btnS1 = game.findUI(this._views[2], "BTN_Share1");
        var btnS2 = game.findUI(this._views[2], "BTN_Share2");

        btnS1.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                cc.log("分享1");
                game.UISystem.captureScreen("screenShot.jpg", function() {
                    WeChat.shareImage(false, jsb.fileUtils.getWritablePath() + "screenShot.jpg", function() {});
                });
            }
        }, this);

        btnS2.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                cc.log("分享2");
            }
        }, this);

        var btnX1 = game.findUI(this._views[0], "BTN_Info");
        var btnX2 = game.findUI(this._views[1], "BTN_Info");

        btnX1.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                cc.log("限额1");
                game.ui.TipWindow.popup({
                    tipStr: "推广奖励每天累计能提400万SEER。"
                }, function (win) {
                    game.UISystem.closePopupWindow(win);
                });
            }
        }, this);

        btnX2.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                cc.log("限额2");
                game.ui.TipWindow.popup({
                    tipStr: "每天累计可提：\n" +
                            "青铜段位:2亿Seer  " +
                            "白银段位:3亿Seer\n" +
                            "黄金段位:4亿Seer  " +
                            "教皇段位:5亿Seer",
                    fontSize: 30
                }, function (win) {
                    game.UISystem.closePopupWindow(win);
                });
            }
        }, this);

    },
    // 关闭该窗口
    close: function () {
        game.ui.ExtendWin.inst = null;
        game.UISystem.closePopupWindow(this);
    }
});

game.ui.ExtendWin.inst = null;

game.ui.ExtendWin.popup = function () {
    var win = new game.ui.ExtendWin();
    game.ui.ExtendWin.inst = win;
    game.UISystem.showWindow(win);
};