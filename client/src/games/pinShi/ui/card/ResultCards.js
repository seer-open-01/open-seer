/**
 * Created by lyndon on 2018/05/18.
 *  结果手牌
 */

GameWindowPinShi.ResultCards = GameWindowPinShi.OtherCards.extend({

    _pattern            : null, // 显示牌型

    ctor: function () {
        this._node = ccs.load("res/Games/PinShi/Card/ResultCards.json").node;
        this._init();
        return true;
    },

    _init: function () {
        this._super();
        this._pattern = new GameWindowPinShi.CardPattern(game.findUI(this._node, "ND_Pattern"));
    },
    reset: function () {
        this._super();
        this.setCardPattern(-1);
    },
    /**
     * 结果牌设置牌型显示
     * @param pattern
     */
    setCardPattern: function (pattern) {
        if (pattern == -1) {
            this._pattern.reset();
            this._pattern.show(false);
            return;
        }
        this._pattern.showCardPattern(pattern);
    },

    setCardPatternWithAction: function (pattern) {
        if (pattern == -1) {
            this._pattern.reset();
            this._pattern.show(false);
            return;
        }
        this._pattern.showCardPatternWithAction(pattern);
    }
});