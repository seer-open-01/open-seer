/**
 * Created by Jiyou Mo on 2017/11/29.
 */
// 其他玩家管理类
GameWindowPinSan.PlayerOther = GameWindowPinSan.Player.extend({
    /**
     * 获取手牌对象
     * @return {null}
     */
    getHandCards : function () {
        if (this._handCards == null) {
            this._handCards = new GameWindowPinSan.HandCardsOther();
            this._handCards.addToNode(this._handCardsNode);
            this._handCards.reset();
        }
        return this._handCards;
    }
});
