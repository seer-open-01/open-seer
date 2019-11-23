/**
 * Created by Jiyou Mo on 2017/12/7.
 */
GameWindowPinSan.ComparePanel = cc.Class.extend({
    
    _node               : null,         // 本节点
    _parentNode         : null,         // 父节点
    _uiPlayerArray      : [],           // 玩家ui信息数组
    _btnPlayerArray     : [],           // 玩家按钮数组
    _imgPointLightArray : [],           // 点光源数组

    _btnBG              : null,         // 背景按钮
    _imgTip             : null,         // 文字提示
    _indexArray         : [],           // 可以比牌的玩家索引数组
    
    ctor : function (node) {
        this._parentNode = node;
        this._node = ccs.load("res/Games/PinSan/ComparePanel/ComparePanel.json").node;
        this._parentNode.addChild(this._node);
        this._init();
        return true;
    },
    
    _init : function () {

        this._btnBG = game.findUI(this._node, "BTN_BG");
        this._btnBG.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.show(false);
            }
        }, this);

        this._uiPlayerArray = [];
        this._btnPlayerArray = [];
        this._imgPointLightArray = [];
        for (var i = 2; i <= 6; ++i) {
            this._uiPlayerArray[i - 1] = new GameWindowPinSan.ComparePanelPlayer(
                game.findUI(this._node, "ND_Player_" + i));
            this._btnPlayerArray[i - 1] = game.findUI(this._node, "BTN_Player_" + i);
            this._imgPointLightArray[i - 1] = game.findUI(this._node, "Light_" + i);
        }

        this._btnPlayerArray.forEach(function (btn) {
            btn.addTouchEventListener(this._btnClick, this);
        }.bind(this));

        this._imgTip = game.findUI(this._node, "IMG_CompareTxt");
        this._imgTip.setVisible(false);
    },
    
    reset : function () {
        this._uiPlayerArray.forEach(function (uiPlayer) {
            uiPlayer.show(false);
        });
        this._btnPlayerArray.forEach(function (btn) {
            btn.setVisible(false);
        });
        this._imgPointLightArray.forEach(function (img) {
            img.stopAllActions();
            img.setVisible(false);
        });
    },
    
    show : function (bool) {
        this.reset();
        if (bool) {
            var gameData = game.procedure.PinSan.getGameData();
            var players = gameData.players;
            this._indexArray = [];
            for (var key in players) {
                if (players.hasOwnProperty(key)) {
                    this._setPlayerInfo(key);
                }
            }
            // 只有一个玩家可比直接比牌
            if (this._indexArray.length == 1) {
                this.show(false);
                game.gameNet.sendMessage(protocol.ProtoID.PSZ_REQ_COMPARE_CARD,
                    {
                        uid: game.DataKernel.uid,
                        roomId: game.DataKernel.roomId,
                        index: this._indexArray[0]
                    });

                return;
            }
        }
        this._node.setVisible(bool);
        this._imgTip.setVisible(bool);
    },

    _setPlayerInfo : function (index) {
        var gameData = game.procedure.PinSan.getGameData();
        var players = gameData.players;

        // 本玩家没有
        if (index == gameData.playerIndex
            || (players[index].cardState != GameDataPinSanHelp.CardsStatus.NotToSee
                && players[index].cardState != GameDataPinSanHelp.CardsStatus.HaveToSee)) {
            return;
        }
        this._indexArray.push(index);
        var diff = index - gameData.playerIndex;
        if (diff < 0) {
            diff += gameData.getPlayerNum();
        }
        this._btnPlayerArray[diff].index = index;
        this._btnPlayerArray[diff].setVisible(true);
        this._uiPlayerArray[diff].setInfo(gameData.players[index]);
        this._uiPlayerArray[diff].show(true);
        this._imgPointLightArray[diff].setVisible(true);
        this._imgPointLightArray[diff].runAction(cc.sequence(cc.fadeOut(0.5), cc.fadeIn(0.5)).repeatForever());
    },

    /**
     * 按钮点击回调
     * @param sender
     * @param type
     * @private
     */
    _btnClick : function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            game.Audio.playBtnClickEffect();
            this.show(false);
            game.gameNet.sendMessage(protocol.ProtoID.PSZ_REQ_COMPARE_CARD,
                {
                    uid: game.DataKernel.uid,
                    roomId: game.DataKernel.roomId,
                    index: sender.index
                });
        }
    }
});