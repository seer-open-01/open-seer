/**
 * Created by lyndon on 2018/07/13.
 */
GameWindowPinSan.PlayBtn = cc.Class.extend({

    _parentNode             : null,
    _node                   : null,

    _btnLook                : null,         // 看牌按钮
    _btn1                   : null,         // 比牌按钮
    _btn2                   : null,         // 加注按钮
    _btn3                   : null,         // 弃牌按钮
    _btn4                   : null,         // 跟注按钮
    _btn5                   : null,         // 自动跟注/取消自动 按钮

    _value1                 : null,         // 比牌底注
    _value4                 : null,         // 跟注底注
    _value5                 : null,         // 自动跟注底注

    _light2                 : null,         // 加注光圈
    _light5                 : null,         // 自动跟注光圈

    _s_pos1                 : cc.p(-200, 140),     // 显示状态初始位置1
    _s_pos2                 : cc.p( 200, 140),     // 显示状态初始位置2
    _s_pos3                 : cc.p(-280, -20),     // 显示状态初始位置3
    _s_pos4                 : cc.p( 280, -20),     // 显示状态初始位置4

    _h_pos1                 : cc.p(-40, -20),      // 隐藏状态初始位置1
    _h_pos2                 : cc.p( 40, -20),      // 隐藏状态初始位置2
    _h_pos3                 : cc.p(-40, -20),      // 隐藏状态初始位置3
    _h_pos4                 : cc.p( 40, -20),      // 隐藏状态初始位置4

    _compareCallback        : null,                 // 比牌回调
    _addAnteCallback        : null,                 // 加注回调

    _lastTime               : 0,                    // 最后点击时间
    _status                 : 1,                    // 当前按钮状态


    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinSan/PlayBtn/PlayBtn.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },
    
    _init: function () {
        this._btnLook = game.findUI(this._node, "Btn_Look");
        this._btn1 = game.findUI(this._node, "Btn_1");
        this._btn2 = game.findUI(this._node, "Btn_2");
        this._btn3 = game.findUI(this._node, "Btn_3");
        this._btn4 = game.findUI(this._node, "Btn_4");
        this._btn5 = game.findUI(this._node, "Btn_5");this._btn5.setVisible(false);

        var act2 = ccs.load("res/Animations/EffPinSan/EffBTN/BTNJiaZhu.json").action;
        this._btn2.act = game.findUI(this._btn2, "light");
        this._btn2.act.runAction(act2);
        act2.play("animation0", true);
        var act5 = ccs.load("res/Animations/EffPinSan/EffBTN/BTNGenZhu.json").action;
        this._btn5.act = game.findUI(this._btn5, "light");
        this._btn5.act.runAction(act5);
        act5.play("animation0", true);

        this._value1 = game.findUI(this._btn1, "value");
        this._value4 = game.findUI(this._btn4, "value");
        this._value5 = game.findUI(this._btn5, "value");

        this.registerClick();
        this._status = 1;
    },
    
    show: function (show) {
        this._node.setVisible(show);
    },
    
    reset: function () {
        
    },
    /**
     * 第一次显示调用
     */
    playShowAction: function () {
        this._update();
        this.showAction();
    },
    /**
     * 显示
     */
    showAction: function () {
        this._oneShow(this._btn1, this._h_pos1, this._s_pos1);
        this._oneShow(this._btn2, this._h_pos2, this._s_pos2);
        this._oneShow(this._btn3, this._h_pos3, this._s_pos3);
        this._oneShow(this._btn4, this._h_pos4, this._s_pos4);
        this._oneShow(this._btn5, this._h_pos4, this._s_pos4);
    },
    /**
     * 隐藏
     */
    hideAction: function () {
        this._oneHide(this._btn1, this._s_pos1, this._h_pos1);
        this._oneHide(this._btn2, this._s_pos2, this._h_pos2);
        this._oneHide(this._btn3, this._s_pos3, this._h_pos3);
        this._oneHide(this._btn4, this._s_pos4, this._h_pos4);
        this._oneHide(this._btn5, this._s_pos4, this._h_pos4);

        this._node.stopAllActions();
        this._node.runAction(cc.Sequence(cc.DelayTime(0.3), cc.CallFunc(function () {
           this.showAction();
        }, this)))
    },
    /**
     * 一个按钮的运动封装
     * @param node
     * @param bPos
     * @param ePos
     * @private
     */
    _oneShow: function (node, bPos, ePos) {
        node.setOpacity(255);
        node.setPosition(bPos);
        node.stopAllActions();
        node.runAction(this._move(ePos));
    },
    _oneHide: function (node, bPos, ePos) {
        node.setOpacity(120);
        node.setPosition(bPos);
        node.stopAllActions();
        node.runAction(cc.Spawn(this._move2(ePos),cc.FadeOut(0.3)));
    },

    _move: function (pos) {
        return new cc.MoveTo(0.4, pos).easing(cc.easeOut(0.4));
    },

    _move2: function (pos) {
        return new cc.MoveTo(0.3, pos).easing(cc.easeIn(0.3));
    },

    /**
     * 更新所有按钮状态 是否显示处理
     * @param onlyData 只更新数据 不播放动画
     */
    updateStatus: function (onlyData) {
        this._update();

        var gameData = game.procedure.PinSan.getGameData();
        var me = gameData.getMainPlayer();
        var curStatus = 1;// 全部显示

        if (gameData.curPlayer == gameData.playerIndex) {
            if (me.autoCall) {// 轮到自己操作 如果在自动跟注状态 隐藏比牌加注按钮
                this._btn1.setVisible(false);
                this._btn2.setVisible(false);
                this._btn4.setVisible(false);
                this._btn5.setVisible(true);
                curStatus = 3;
            }else {// 轮到自己操作 如果不在自动跟注状态 显示比牌加注按钮
                this._btn1.setVisible(true);
                this._btn2.setVisible(true);
                this._btn4.setVisible(true);
                this._btn5.setVisible(false);
                curStatus = 1;
            }
        }else {// 没有轮到自己隐藏比牌 加注 跟注; 显示自动跟注/取消自动跟注
            this._btn1.setVisible(false);
            this._btn2.setVisible(false);
            this._btn4.setVisible(false);
            this._btn5.setVisible(true);
            if (me.autoCall) {
                curStatus = 3;// 没有轮到自己操作 且 有自动跟注
            }else {
                curStatus = 2;// 没有轮到自己操作 且 没有自动跟注
            }
        }

        if (curStatus != this._status) {
            this._status = curStatus;
            if (onlyData) {
                cc.log("只更新数据");
            }else {
                this.hideAction();
            }
        }
    },
    /**
     * 更新UI显示 是否可以点击处理
     * 玩家状态如下:
     * 1 为看牌
     * 2 已看牌
     * 3 弃牌
     * 4 比牌输
     */
    _update: function () {
        var gameData = game.procedure.PinSan.getGameData();
        var me = gameData.getMainPlayer();
        // var matchId = gameData.matchId;

        // 更新按钮上的底注
        var ante = gameData.baseBean * gameData.multiple;
        if (me.cardState == 2) {// 已看牌倍数翻倍
            ante *= 2;
        }
        this.setBtnValue(Math.floor(ante));

        // 处理看牌按钮 只有未看牌的情况下才显示看牌按钮 (必闷三轮的情况下，当前轮数小于3轮不能看牌)
        var isMen = gameData.options.BMSL
            && gameData.curTurns <= 3;
        // cc.log("===================== 1 " + gameData.options.BMSL);
        // cc.log("===================== 2 " + gameData.curTurns);
        // cc.log("===================== 3 " + me.cardState);
        this._btnLook.setVisible(!isMen && me.cardState == 1);

        if (!me.autoCall) {
            // 处理比牌按钮 到自己操作的时候且不是自动跟注才能点击比牌按钮 (必闷三轮的情况下，当前轮数小于3轮不能比牌)
            var canCompare = gameData.curTurns > 1 && gameData.curPlayer == gameData.playerIndex  && !isMen;
            this._btn1.setEnabled(canCompare);

            // 处理加注按钮 到自己操作的时候且不是自动跟注,并且能够加注(当前房间注码值为小于5)才能点击加注按钮
            var canAdd = gameData.curPlayer == gameData.playerIndex && gameData.multiple < 5;
            this._btn2.setEnabled(canAdd);
            this._btn2.act.setVisible(canAdd);

            // 处理弃牌按钮 未看牌和看过牌且不是自动跟注的情况才能点击弃牌按钮
            this._btn3.setEnabled(me.cardState <= 2);

            // 处理跟注按钮 到自己操作且不是自动跟注
            this._btn4.setEnabled(gameData.curPlayer == gameData.playerIndex);
        }else {
            this._btn1.setEnabled(false);
            this._btn2.setEnabled(false);
            this._btn3.setEnabled(false);
            this._btn4.setEnabled(false);
        }

        // 处理自动跟注按钮 当没有看牌或者已看牌的情况下，可以点击自动跟注按钮 自动跟注状态按钮替换为取消跟注的纹理
        this._btn5.act.setVisible(false);
        var btnTex = "res/Games/PinSan/Image/BTN_AutoFollow";
        if (me.autoCall) {
            btnTex = "res/Games/PinSan/Image/BTN_CancelFollow";
            this._btn5.act.setVisible(true);
        }
        this._btn5.loadTextures(btnTex + "N.png", btnTex + "P.png", btnTex + "D.png");
        this._btn5.setEnabled(me.cardState <= 2);
    },
    /**
     * 设置按钮上显示的筹码数量
     * @param value
     */
    setBtnValue: function (value) {
        value = Utils.formatCoin2(value);
        this._value1.setString("" + value);
        this._value4.setString("" + value);
        this._value5.setString("" + value);
    },
    /**
     * 设置比牌回调
     * @param callback
     */
    onCompareClicked: function (callback) {
        this._compareCallback = callback;
    },
    /**
     * 设置加注回调
     * @param callback
     */
    onAddAnteClicked: function (callback) {
        this._addAnteCallback = callback;
    },
    /**
     * 用时间限制点击按钮的响应
     * @returns {boolean}
     */
    canClick: function () {
        var now = new Date();
        var isCan = true;
        if (now - this._lastTime < 300) {
            isCan = false;
        }
        this._lastTime = now;
        return isCan;
    },

    registerClick: function () {
        // 看牌按钮
        this._btnLook.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                if (this.canClick()){
                    game.gameNet.sendMessage(protocol.ProtoID.PSZ_REQ_SEE_CARDS, {
                        uid     : game.DataKernel.uid,
                        roomId  : game.DataKernel.roomId
                    });
                }else {
                    cc.log("点击过快！");
                }
            }
        }, this);

        // 比牌按钮
        this._btn1.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                if (this.canClick()){
                    this._compareCallback && this._compareCallback();
                }else {
                    cc.log("点击过快！");
                }
            }
        }, this);
        // 加注按钮
        this._btn2.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                if (this.canClick()) {
                    this._addAnteCallback && this._addAnteCallback();
                }else {
                    cc.log("点击过快！");
                }
            }
        }, this);
        // 弃牌按钮
        this._btn3.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                if (this.canClick()) {
                    game.gameNet.sendMessage(protocol.ProtoID.PSZ_REQ_DIS_CARDS, {
                        uid     : game.DataKernel.uid,
                        roomId  :game.DataKernel.roomId
                    });
                }else {
                    cc.log("点击过快！");
                }
            }
        }, this);
        // 跟注按钮
        this._btn4.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                var gameData = game.procedure.PinSan.getGameData();
                var me = gameData.getMainPlayer();
                if (this.canClick()) {
                    game.gameNet.sendMessage(protocol.ProtoID.PSZ_REQ_FOLLOW_ANTE, {
                        uid      : game.DataKernel.uid,
                        roomId   : game.DataKernel.roomId,
                        roundBet : gameData.multiple * (me.cardState == 2 ? 2 : 1)
                    });
                }else {
                    cc.log("点击过快！");
                }

            }
        }, this);
        // 自动跟注按钮
        this._btn5.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                var gameData = game.procedure.PinSan.getGameData();
                var me = gameData.getMainPlayer();
                if (this.canClick()) {
                    game.gameNet.sendMessage(protocol.ProtoID.PSZ_REQ_AUTO_FOLLOW, {
                        uid     : game.DataKernel.uid,
                        roomId  : game.DataKernel.roomId,
                        ok      : !me.autoCall
                    });
                }else {
                    cc.log("点击过快！");
                }
            }
        }, this);
    }
});