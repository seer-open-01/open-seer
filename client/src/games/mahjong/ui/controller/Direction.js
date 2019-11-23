/**
 * Created by pander on 2018/5/15.
 */
// ==== 麻将游戏 出牌玩家计时器 控件 ============================================
GameWindowMahjong.Direction = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点
    
    _direction          : null,         // 指示器节点

    _imgEast            : null,         // 东图片
    _imgSouth           : null,         // 南图片
    _imgWest            : null,         // 西图片
    _imgNorth           : null,         // 北图片
    
    _fntTimer           : null,         // 倒计时时间
    _curTime            : 0,            // 当前时间
    
    ctor : function (parentNode) {
        this._parentNode = parentNode;
        this._node = ccs.load("res/Games/Mahjong/Direction/Direction.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._direction = game.findUI(this._node, "IMG_Direction");

        this._imgEast = game.findUI(this._direction, "IMG_1");
        this._imgSouth = game.findUI(this._direction, "IMG_2");
        this._imgWest = game.findUI(this._direction, "IMG_3");
        this._imgNorth = game.findUI(this._direction, "IMG_4");

        this._fntTimer = game.findUI(this._node, "FNT_Time");
    },

    reset : function () {
        this.setDirection(0, 0);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置本玩家的方位
     * @param index     本玩家的index
     */
    setMainPlayerIndex : function (index) {
        var gameData = game.procedure.Mahjong.getGameData();
        var rotation = 0;
        if (gameData.subType == 1) {
            // 二人麻将
            if (index == 2) {
                rotation = 180;
            }
        } else {
            switch (index) {
                case 2 : rotation = 90; break;
                case 3 : rotation = 180; break;
                case 4 : rotation = 270; break;
            }
        }

        this._direction.setRotation(rotation);
    },

    /**
     * 设置方向
     * @param playerIndex   当前操作玩家的座位号索引
     * @param countDown     倒计时的时间
     */
    setDirection : function (playerIndex, countDown) {
        this._showDirection(playerIndex);
        this._startCountDown(countDown)
    },

    /**
     * 开启倒计时
     * @param countDown
     * @private
     */
    _startCountDown : function (countDown) {
        this._stopCountDown();
        countDown = countDown || 0;
        if (countDown < 0) {
            countDown = 0;
        }

        this._curTime = countDown;
        this._updateTimer();
        this._fntTimer.runAction(cc.sequence(cc.delayTime(1.0), cc.CallFunc(this._updateTimer, this)).repeatForever());
    },

    /**
     * 关闭倒计时
     * @private
     */
    _stopCountDown : function () {
        this._fntTimer.stopAllActions();
    },

    /**
     * 刷新倒计时时间显示
     * @private
     */
    _updateTimer : function () {
        var str = "";
        if (this._curTime < 10) {
            str = "0";
        }

        this._fntTimer.setString(str + this._curTime);

        this._curTime--;

        if (this._curTime < 0) {
            this._curTime = 0;
            this._stopCountDown();
        }
    },

    /**
     * 显示闪烁指示器
     * @param index
     * @private
     */
    _showDirection : function (index) {
        this._imgEast.setVisible(false);
        this._imgEast.stopAllActions();
        this._imgSouth.setVisible(false);
        this._imgSouth.stopAllActions();
        this._imgWest.setVisible(false);
        this._imgWest.stopAllActions();
        this._imgNorth.setVisible(false);
        this._imgNorth.stopAllActions();

        var ac = cc.sequence(cc.fadeIn(0.5), cc.delayTime(0.5), cc.fadeOut(0.5), cc.delayTime(0.5)).repeatForever();

        var gameData = game.procedure.Mahjong.getGameData();
        if (gameData.subType == 1) {
            // 二人麻将
            switch (index) {
                case 1 : this._imgEast.setVisible(true); this._imgEast.runAction(ac); break;
                case 2 : this._imgWest.setVisible(true); this._imgWest.runAction(ac); break;
            }
        } else {
            // 四人麻将
            switch (index) {
                case 1 : this._imgEast.setVisible(true); this._imgEast.runAction(ac); break;
                case 2 : this._imgSouth.setVisible(true); this._imgSouth.runAction(ac); break;
                case 3 : this._imgWest.setVisible(true); this._imgWest.runAction(ac); break;
                case 4 : this._imgNorth.setVisible(true); this._imgNorth.runAction(ac); break;
            }
        }


    }
});