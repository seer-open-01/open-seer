/**
 * Created by lyndon on 2018/05/21.
 *  拼十倒计时
 */
GameWindowPinShi.Clock = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点

    _fntTime            : null,         // 倒计时数字节点
    _numTime            : 0,            // 时间
    
    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinShi/Clock/Clock.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },
    
    _init: function () {
        this._fntTime = game.findUI(this._node, "Fnt_Clock");
    },
    
    reset: function () {
        this._node.stopAllActions();
        this._fntTime.setString(0);
    },
    
    show: function (bool) {
        this._node.setVisible(bool);
    },

    start: function (time) {
        this._numTime = time;
        this._fntTime.setString("" + time);

        var doDelay = cc.DelayTime(1.0);
        var doCall = cc.CallFunc(function () {
            this.updateTime();
        }, this);

        this._node.stopAllActions();
        this._node.runAction(cc.sequence(doDelay, doCall).repeatForever());
    },

    updateTime: function () {
        this._numTime -= 1;

        if (this._numTime <= 5 && this._numTime > 0) {
            var gameData = game.procedure.PinShi.getGameData();
            if (gameData.curPlayer == gameData.playerIndex){
                // TODO: 声音
            }
        }

        if (this._numTime < 1) {
            this._numTime = 0;
            this._node.stopAllActions();
        }
        this._fntTime.setString("" + this._numTime);
    }
});