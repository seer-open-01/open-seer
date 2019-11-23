/**
 * Created by Jiyou Mo on 2017/11/27.
 */
// 手牌管理类扩展
GameWindowPinSan.HandCardsOther = GameWindowPinSan.HandCards.extend({
    ctor : function () {
        this._node = ccs.load("res/Games/PinSan/HandCards/HandCardsOther.json").node;
        this._init();
        return true;
    }
});
