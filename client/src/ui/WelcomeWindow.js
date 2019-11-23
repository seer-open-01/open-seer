/**
 * Created by pander on 2018/5/8.
 */
// ==== 游戏欢迎界面 ==========================================================================================
game.ui.WelcomeWindow = cc.Layer.extend({

    _node           : null,     // UI层

    _imgBg          : null,     // 背景图

    ctor : function () {
        this._super();
        // 加载UI控件
        this._node = ccs.load("res/Welcome/Welcome.json").node;
        this.addChild(this._node);
        this._init();

        return true;
    },

    _init : function () {
        this._imgBg = game.findUI(this._node, "IMG_BG");
    },

    /**
     * 播放显示动画
     * @param callback
     */
    playShowAnimation : function (callback) {
        var delay = cc.delayTime(0.5);
        var fun = cc.CallFunc(function () {
            callback && callback();
            this._imgBg.stopAllActions();
        }, this);

        this._imgBg.runAction(cc.sequence(delay, fun));
    }
});