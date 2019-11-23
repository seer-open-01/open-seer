/**
 * Created by pander on 2018/5/25.
 */
// ==== 麻将游戏 二人麻将 桌牌控件 ===============================================
GameWindowMahjongEr.TableCards = GameWindowMahjong.TableCards.extend({

    ctor : function (uiIndex, parentNode) {
        this._uiIndex = uiIndex;
        this._parentNode = parentNode;
        var gameData = game.procedure.Mahjong.getGameData();
        var dirStr = gameData.getDirectionString(this._uiIndex);
        this._node = ccs.load("res/Games/Mahjong/Cards/TableCards" + dirStr + "Er.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init : function () {
        this._cards = [];
        for (var i = 1; i < 57; ++i) {
            this._cards.push(new GameWindowMahjong.TableCard(this._uiIndex, game.findUI(this._node, "" + i)));
        }
    }
});