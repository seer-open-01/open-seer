/**
 * Created by Jiyou Mo on 2017/12/8.
 */
// 发牌动画控制器
GameWindowPinSan.PlayCardsAnimation = cc.Class.extend({
    _node               : null,         // 本节点
    _parentNode         : null,         // 父节点

    _spCard1            : null,         // 第一张牌
    _spCard2            : null,         // 第二张牌
    _spCard3            : null,         // 第三张牌
    _spCard4            : null,         // 第四张牌

    _roomUI             : null,         // 房间的ui(可以获取玩家的UI)
    _playerIndexArray   : null,         // 被发牌玩家的索引
    _completeCallback   : null,         // 动画完成回调函数

    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinSan/PlayCardAnimation/PlayCardAnimation.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },

    _init : function () {
        this._spCard1 = game.findUI(this._node, "ND_Card1");
        this._spCard2 = game.findUI(this._node, "ND_Card2");
        this._spCard3 = game.findUI(this._node, "ND_Card3");
        this._spCard4 = game.findUI(this._node, "ND_Card4");
    },

    reset : function () {
        this.show(false);
        this._roomUI = null;
        this._playerIndexArray = [];
        this._completeCallback = null;
        this._spCard1.setPosition(cc.p(-640, 360));
        this._spCard1.setRotation(0);
        this._spCard2.setPosition(cc.p(640, 360));
        this._spCard2.setRotation(0);
        this._spCard3.setPosition(cc.p(-640, -360));
        this._spCard3.setRotation(0);
        this._spCard4.setPosition(cc.p(640, -360));
        this._spCard4.setRotation(0);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 播放发牌动画
     * @param roomUI                房间的总UI
     * @param playerIndexArray      需要被发牌的玩家索引数组
     * @param completeCallback      动画播放完成后的回调函数
     */
    playAnimation : function (roomUI, playerIndexArray, completeCallback) {
        this.reset();
        this._roomUI = roomUI;
        this._playerIndexArray = JSON.parse(JSON.stringify(playerIndexArray));
        this._playerIndexArray.sort(function (a, b) {
            var gameData = game.procedure.PinSan.getGameData();
            if (gameData.playerIndex == b) {
                return 1;
            }
            return a - b;
        });
        this._completeCallback = completeCallback;
        this.show(true);
        this._playFlyCards(this._playCardsToPlayer.bind(this));
    },

    /**
     * 播放飞牌动画
     * @param callback
     * @private
     */
    _playFlyCards : function (callback) {
        var move = cc.moveTo(0.5, cc.p(0, 0));
        var rotate = cc.rotateTo(0.5, 180);
        var audioFun = cc.CallFunc(function () {
            game.Audio.PSZPlayCardMove();
        });
        var spawn = cc.spawn(move, rotate, audioFun);
        var fun = cc.CallFunc(function () {
            callback && callback();
        });
        this._spCard1.runAction(spawn.clone());
        this._spCard2.runAction(spawn.clone());
        this._spCard3.runAction(spawn.clone());
        this._spCard4.runAction(cc.sequence(spawn.clone(), fun));
    },

    /**
     * 播放玩家手上的牌移动
     * @private
     */
    _playCardsToPlayer : function () {
        var length = this._playerIndexArray.length;
        if (length < 1) {
            this._completeCallback && this._completeCallback();
            return;
        }

        for (var i = length - 1; i >= 0; --i) {
            var uiPlayer = this._roomUI.getPlayer(this._playerIndexArray[i]);
            var node = uiPlayer.getHandCardsNode();
            var position = this._node.convertToNodeSpace(uiPlayer.getHandCardsWorldPos());
            var scale = node.getScale();
            this._playMoveCard(0.8, uiPlayer, position, scale);
            this._playMoveCard(0.4, uiPlayer, position, scale);
            this._playMoveCard(0, uiPlayer, position, scale);
        }

        var fun = cc.CallFunc(function () {
            this.show(false);
            this._completeCallback && this._completeCallback();
        }, this);

        this._node.runAction(cc.sequence(cc.delayTime(1.2), fun));
    },

    /**
     * 播放牌移动的动画
     * @param delay
     * @param uiPlayer
     * @param position
     * @param scale
     * @private
     */
    _playMoveCard : function (delay, uiPlayer, position, scale) {
        var sp = new cc.Sprite("res/Games/PinSan/Pokers/100.png");
        sp.setPosition(cc.p(0, 0));
        sp.setScale(0.6);
        this._node.addChild(sp);
        var delayTime = cc.delayTime(delay);
        // var preMove = cc.moveBy(0.1, cc.p(0, 10));
        var move = cc.moveTo(0.4, position);
        var scaleTo = cc.scaleTo(0.4, scale);
        var rotate = cc.rotateTo(0.4, 180);
        var audioFun = cc.CallFunc(function () {
            game.Audio.PSZPlayCardMove();
        });
        var spawn = cc.spawn(move, scaleTo, rotate, audioFun);
        var fun = cc.CallFunc(function () {
            sp.removeFromParent(true);
            // 添加牌背的牌
            uiPlayer.getHandCards().addCardsValues([100]);
        });

        sp.runAction(cc.sequence(delayTime, spawn, fun));
    }
});