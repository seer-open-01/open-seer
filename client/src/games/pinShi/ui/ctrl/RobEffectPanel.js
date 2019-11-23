/**
 * Created by lyndon on 2018/05/22.
 *  抢庄动画面板
 */
GameWindowPinShi.RobEffectPanel = cc.Class.extend({
    _parentNode             : null,         // 父节点
    _node                   : null,         // 本节点

    _players                : [],           // 玩家

    _count                  : 0,            // 跳动次数
    _nextIndex              : 0,            // 开始玩家

    _playerIndexArr         : [],           // 抢庄玩家坐标数组
    _dealerIndex            : -1,           // 庄家坐标
    _callback               : null,         // 抢庄结束回调

    ctor: function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinShi/RobEffectPanel/RobEffectPanel.json").node;
        this._init();
        this._parentNode.addChild(this._node);

        return true;
    },

    _init: function () {
        this._players = [];
        var temp = null;
        for (var i = 1; i <= 6; ++i) {
            temp = new GameWindowPinShi.RobEffectPlayer(game.findUI(this._node, "ND_Player_" + i), i);
            this._players.push(temp);
        }

    },

    reset: function () {
        for (var i = 0;i < this._players.length;i++) {
            this._players[i].show(false);
        }
        this._count = 0;
        this._nextIndex = 0;
        this._playerIndexArr = [];
        this._dealerIndex = -1;
        this._callback = null;
        this.show(false);
    },

    show: function (bool) {
        this._node.setVisible(bool);
        if (bool) {
            this._initPlayers();
        }
    },
    /**
     * 初始化玩家信息
     * @private
     */
    _initPlayers: function () {
        var gameData = game.procedure.PinShi.getGameData();
        var players = gameData.players;
        for (var index in players) {
            if (players.hasOwnProperty(index)) {
                if (players[index].playing) {
                    this.getPlayer(index).setInfo(players[index]);
                }
            }
        }
    },
    /**
     * 获取面板玩家
     * @param index
     * @returns {*}
     */
    getPlayer: function (index) {
        var gameData = game.procedure.PinShi.getGameData();
        var diff = index - gameData.playerIndex;
        if (diff < 0) {
            diff += gameData.getPlayerNum();
        }

        if (this._players[diff]) {
            this._players[diff].show(true);
            return this._players[diff];
        }
    },
    /**
     * 设置抢庄动画的数值 开始执行动画
     * @param playerIndexArr
     * @param dealerIndex
     * @param callback
     */
    playRobDealerEffect: function (playerIndexArr, dealerIndex, callback) {
        this._playerIndexArr = playerIndexArr;
        this._dealerIndex = dealerIndex;
        this._callback = callback;

        this._count = 0;
        this._nextIndex = 0;

        this.show(true);
        this._runEffect();
    },
    /**
     * 执行回调动画
     * @private
     */
    _runEffect: function () {
        if (this._count >= 30) {
            this._callback && this._callback(this._dealerIndex);
            this.show(false);
            return;
        }
        // cc.log("============================ " + this._playerIndexArr[this._nextIndex]);
        var effectNode = this.getPlayer(this._playerIndexArr[this._nextIndex]).getEffect();
        var doSpawn = cc.Spawn(cc.blink(0.2, 1), cc.CallFunc(function () {
            game.Audio.nnPlayRobDealer();
        }, this));

        var doCall = cc.CallFunc(function () {
            this._nextIndex ++;
            if (this._nextIndex >= this._playerIndexArr.length) {
                this._nextIndex = 0;
            }
            this._count ++;
            // 光圈跳动大于三轮 且落到庄家头上
            if (this._count >= this._playerIndexArr.length * 3
                && this._dealerIndex == this._playerIndexArr[this._nextIndex]) {
                this._count = 0;
                this._nextIndex = 0;
                this._callback && this._callback(this._dealerIndex);
                this.show(false);
                this.reset();
                game.Audio.nnPlayDealerOk();
            } else {
                this._runEffect();
            }
        }, this);

        effectNode.runAction(cc.Sequence(doSpawn, doCall));
    }
});
/**
 * 抢庄面板玩家信息
 */
GameWindowPinShi.RobEffectPlayer = cc.Class.extend({

    _node               : null,

    _head               : null,         // 头像
    _name               : null,         // 名字
    _bean               : null,         // 金豆
    _effect             : null,         // 特效

    _index              : -1,           // 玩家下标

    ctor: function (node, index) {
        this._node = node;
        this._index = index;
        this._init();

        return true;
    },

    _init: function () {
        this._head = new GameWindowBasic.GameHeadPic(game.findUI(this._node, "ND_HeadPic"));
        this._name = game.findUI(this._node, "ND_Name");
        this._bean = game.findUI(this._node, "ND_Bean");
        this._effect = game.findUI(this._node, "ND_Effect");

        if (this._index == 1) {
            this._name.setVisible(false);
        }
    },

    reset: function () {
        this.show(false);
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },
    /**
     * 设置基本信息
     * @param info
     */
    setInfo: function (info) {
        this._head.setHeadPic(info.headPic);
        var name = info.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._name.setString(name);
        var bean = Utils.formatCoin(info.bean);
        this._bean.setString("" + bean);
    },
    /**
     * 获取玩家头像彩灯节点
     */
    getEffect: function () {
        return this._effect;
    }
});