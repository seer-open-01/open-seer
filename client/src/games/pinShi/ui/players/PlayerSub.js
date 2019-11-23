/**
 * Created by lyndon 2018/05/16.
 */
// 其他玩家管理类
GameWindowPinShi.PlayerOther = GameWindowPinShi.Player.extend({
    /**
     * 获取手牌对象
     * @return {null}
     */
    getHandCards : function () {
        if (this._handCards == null) {
            this._handCards = new GameWindowPinShi.OtherCards();
            this._handCards.addToNode(this._handCardsNode);
            this._handCards.reset();
        }
        return this._handCards;
    }
});
