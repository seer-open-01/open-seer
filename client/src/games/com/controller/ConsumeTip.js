/**
 * Author       : lyndon
 * Date         : 2018-08-13
 * Description  : 消费提示
 */
GameWindowBasic.ConsumeTip = GameControllerBasic.extend({

    _charge             : null,         // 服务费

    ctor : function () {
        this._node = ccs.load("res/Games/Com/ConsumeTip/ConsumeTip.json").node;
        this._init();
        return true;
    },

    _init : function () {
        this._charge = game.findUI(this._node, "TXT_Charge");
    },

    reset : function () {
        this._charge.setString("");
        this.show(false);
    },

    /**
     * 显示服务费
     */
    showCharge: function (num) {
        this._charge.setString("-" + num);
        this.show(true);
        this._node.setOpacity(255);
        this._node.stopAllActions();
        this._node.runAction(cc.Sequence(cc.DelayTime(1.0), cc.FadeOut(1.0), cc.CallFunc(function () {
            this.reset();
        }, this)))
    }
});

GameWindowBasic.ConsumeTip.inst = null;

/**
 * 获取消费提示对象
 */
GameWindowBasic.ConsumeTip.getController = function () {
    if (this.inst == null) {
        this.inst = new GameWindowBasic.ConsumeTip();
    }
    this.inst.reset();
    return this.inst;
};