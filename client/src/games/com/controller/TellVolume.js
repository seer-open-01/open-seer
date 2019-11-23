/**
 * Created by Jiyou Mo on 2017/10/16.
 */
// 玩家说话语音 音量显示
GameWindowBasic.TellVolume = GameControllerBasic.extend({

    _tells              : [],
    _tellIndex          : 0,

    ctor : function () {
        this._node = ccs.load("res/Games/Com/Tell/Tell.json").node;
        this._init();
        return true;
    },

    _init : function () {
        this._tells = [];
        this._tellIndex = 0;
        for (var i = 1; i <= 3; ++i) {
            var tell = game.UIHelper.findChildByName(this._node, "Tell_" + i);
            tell.setVisible(false);
            this._tells.push(tell);
        }
    },

    reset : function () {
        this.stopTell();
    },

    _playTell : function () {
        this._tells[this._tellIndex].setVisible(false);
        this._tellIndex += 1;
        if (this._tellIndex >= 3){
            this._tellIndex = 0;
        }
        this._tells[this._tellIndex].setVisible(true);
    },

    /**
     * 显示说话语音音量
     * @param time      闪动的时间间隔
     */
    showTell : function (time) {
        this._tellIndex = 0;
        this._tells[0].runAction(cc.repeatForever(cc.sequence(cc.delayTime(time), cc.callFunc(this._playTell, this))));
    },

    /**
     * 停止显示说话音量
     */
    stopTell : function () {
        this._tells[0].stopAllActions();
        for (var i = 0; i < this._tells.length; ++i) {
            this._tells[i].setVisible(false);
        }
    }

});

/**
 * 获取控件
 * @return {*}
 */
GameWindowBasic.TellVolume.getController = function () {
    return new GameWindowBasic.TellVolume();
};


