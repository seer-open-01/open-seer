/**
 * UI 系统
 * @author Jiyou Mo
 */
game.UISystemDef = cc.Scene.extend({

    _mainUILayer            : null,     // 主UI层
    _popupUILayer           : null,     // 弹出UI层
    _runTextLayer           : null,     // 跑马灯UI层
    _loadingUILayer         : null,     // 加载UI层
    _txtHintLayer           : null,     // 飘字提示UI层

    _curMainUI              : null,     // 当前主UI层
    _loadingWindow          : null,     // 加载UI界面

    ctor : function () {
        this._super();

        // 初始化UI节点
        this._mainUILayer = new cc.Layer();
        this.addChild(this._mainUILayer);

        this._runTextLayer = new cc.Layer();
        this.addChild(this._runTextLayer);

        this._popupUILayer = new cc.Layer();
        this.addChild(this._popupUILayer);

        this._txtHintLayer = new cc.Layer();
        this.addChild(this._txtHintLayer);

        this._loadingUILayer = new cc.Layer();
        this.addChild(this._loadingUILayer);

        // 开启帧更新
        this.scheduleUpdate();

        cc.log("UI系统就绪");
        return true;
    },

    onEnter : function () {
        this._super();
    },

    /**
     * 切换UI层
     * @param uiLayer
     */
    switchUI : function (uiLayer) {
        cc.log("==>正在切换主UI界面");

        if (this._curMainUI) {
            this._curMainUI.removeFromParent(true);
        }
        this._curMainUI = uiLayer;
        if (this._curMainUI) {
            this._mainUILayer.addChild(this._curMainUI);
        }

        RunText.changeScene();
    },

    /**
     * 弹出窗口
     * @param uiLayer
     */
    popupWindow : function (uiLayer) {
        if (uiLayer) {
            this._popupUILayer.addChild(uiLayer);
            var uiWin = game.findUI(uiLayer, "ND_PopWin");
            var uiMask = game.findUI(uiLayer, "ND_Mask");
            if(!uiMask) {
                // cc.log("==> NO MASK!!!!");
                var colorLayer = new cc.LayerColor(cc.color(0,0,0,130));
                colorLayer.setName("ND_Mask");
                colorLayer.setLocalZOrder(-1);
                uiWin.getParent().addChild(colorLayer);
            }
            uiWin.setCascadeOpacityEnabled(true);
            uiWin.setOpacity(100);
            uiWin.setScale(0.4);
            // var seq = cc.sequence(cc.delayTime(0.2), cc.fadeIn(0.3));
            var spawn = cc.spawn(cc.scaleTo(0.2, 1).easing(cc.easeSineInOut(0.2)), cc.fadeIn(0.2).easing(cc.easeSineInOut(0.2)));

            uiWin.runAction(spawn);
        }
    },

    /**
     * 立即显示窗口
     * @param uiLayer
     */
    showWindow : function (uiLayer) {
        this._popupUILayer.addChild(uiLayer);
    },

    /**
     * 立马隐藏窗口
     * @param uiLayer
     */
    closeWindow : function (uiLayer) {
        var children = this._popupUILayer.getChildren();
        for (var key in children) {
            if (children.hasOwnProperty(key)) {
                if (children[key] == uiLayer) {
                    uiLayer.removeFromParent();
                    break;
                }
            }
        }
    },
    /**
     * 关闭弹出窗口
     * @param uiLayer
     */
    closePopupWindow : function (uiLayer) {
        // var uiWin = game.findUI(uiLayer, "ND_PopWin");
        // uiWin.setScale(1.0);
        // uiWin.setOpacity(255);
        // var callFunc = new cc.CallFunc(function () {
        //     var children = this._popupUILayer.getChildren();
        //     for (var key in children) {
        //         if (children.hasOwnProperty(key)) {
        //             if (children[key] == uiLayer) {
        //                 uiLayer.removeFromParent();
        //                 break;
        //             }
        //         }
        //     }
        // }, this);
        //
        // var seq = cc.sequence(cc.delayTime(0), cc.fadeOut(0.5), callFunc);
        // var spawn = cc.spawn(cc.scaleTo(0.4, 0.5), seq);
        // uiWin.runAction(spawn);
        this.closeWindow(uiLayer);
    },

    /**
     * 关闭所有弹出窗口
     */
    closeAllPopupWindow : function () {
        var children = this._popupUILayer.getChildren();
        for (var key in children) {
            if (children.hasOwnProperty(key)) {
                var child = children[key];
                child.close ? child.close() : child.removeFromParent();
            }
        }
    },

    /**
     * 是否还有弹窗
     * @returns {boolean}
     */
    isHavePopupWindow : function () {
        var children = this._popupUILayer.getChildren();
        return children.length > 0;
    },

    /**
     * 关闭任意一个在线弹窗
     */
    closeAnyonePopupWindow : function () {
        var children = this._popupUILayer.getChildren();
        if (children.length > 0) {
            this.closePopupWindow(children.pop());
        }
    },

    update : function (dt) {
        game.Procedure.update(dt);
        this._loadingWindow && this._loadingWindow.update(dt);
    },

    /**
     * 显示加载界面
     */
    showLoading : function (tip) {
        cc.log("==> 显示Loading");
        if (!this._loadingWindow) {
            this._loadingWindow = new game.ui.LoadingWindow();
            this._loadingWindow.retain();
        }
        this.hideLoading();
        this._loadingUILayer.addChild(this._loadingWindow);
        this._loadingWindow.setTipValue(tip);
        this._loadingWindow.playAnimations();
    },

    /**
     * 隐藏加载界面
     */
    hideLoading : function () {
        cc.log("==> 隐藏Loading");
        this._loadingWindow.removeFromParent();
    },

    /**
     * 截屏并保存为文件
     * @param path
     * @param callback
     */
    captureScreen : function (path, callback) {
        Platform.captureScreen(path, function (ok, name) {
            cc.log("截屏完毕，保存到：" + name);
            callback && callback(ok, name);
        });
    },

    /**
     * 获取跑马灯层
     */
    getRunTextLayer : function () {
        return this._runTextLayer;
    },

    /**
     * 获取文字提示层
     * @returns {null}
     */
    getTxtHintLayer: function () {
        return this._txtHintLayer;
    },

    /**
     * 判断当前是否有弹窗
     * @returns {boolean}
     */
    haveNoPopupWindow: function () {
        var children = this._popupUILayer.getChildren();
        return children.length <= 0;
    }
});

game.UISystem = new game.UISystemDef();

// UI空间
game.ui = game.ui || {};