/**
 * Created by pander on 2018/5/24.
 */
// ==== 麻将游戏 挂起任务控件 选牌控件 ==============================
GameWindowMahjong.HangupTasksSelectCards = cc.Class.extend({
    _node               : null,         // 本节点
    
    _cardsGroup         : [],           // 牌组数组

    _handlerCallback    : null,         // 选择点击回调

    ctor : function (node) {
        this._node = node;
        this._init();
        return true;
    },

    _init : function () {
        this._cardsGroup = [];
        for (var i = 1; i < 4; ++i) {
            var group = new GameWindowMahjong.HangupTasksSelectCards.CardsGroup(game.findUI(this._node, "" + i), i - 1);
            this._cardsGroup.push(group);
        }
    },
    
    reset : function () {
        this._cardsGroup.forEach(function (group) {
            group.reset();
        });

        this.show(false);
    },
    
    show : function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置选牌的数据
     * @param type      类型  1 吃牌   3 杠牌
     * @param dataArray  数据的数组，服务器给过来的数据
     * @param callback   点击回调   如果是吃牌 回传吃牌数组索引  如果是杠牌 回传杠牌的值
     */
    setInfo : function (type, dataArray, callback) {
        if (type == 1) {
            // 吃的牌
            for (var i = 0; i < this._cardsGroup.length; ++i) {
                if (i < dataArray.length) {
                    var group = this._cardsGroup[i];
                    group.setCardsValues(dataArray[i]);
                    group.onSureClicked(function (index) {
                       callback && callback(index);
                       this.reset();
                    }.bind(this));
                } else {
                    group = this._cardsGroup[i];
                    group.reset();
                    group.onSureClicked(null);
                }
            }
        } else if (type == 3) {
            // 杠
            for (i = 0; i < this._cardsGroup.length; ++i) {
                if (i < dataArray.length) {
                    group = this._cardsGroup[i];
                    group.setCardsValues([dataArray[i], dataArray[i], dataArray[i], dataArray[i]]);
                    group.onSureClicked(function (index) {
                        callback && callback(dataArray[index]);
                        this.reset();
                    }.bind(this));
                } else {
                    group = this._cardsGroup[i];
                    group.reset();
                    group.onSureClicked(null);
                }
            }
        } else {
            this.reset();
        }
    }
});

// ==== 选派控件组合牌选项 ===================================
GameWindowMahjong.HangupTasksSelectCards.CardsGroup = cc.Class.extend({
    _node           : null,         // 本节点
    _index          : 0,            // 组件的索引位置

    _cards          : [],           // 牌的数组

    _btnSure        : null,         // 确定按钮
    _handlerSure    : null,         // 确定按钮回调

    ctor : function (node, index) {
        this._node = node;
        this._index = index;
        this._init();
        return true;
    },

    _init : function () {
        this._cards = [];
        for (var i = 1; i < 5; ++i) {
            this._cards.push(new GameWindowMahjong.HangupTasksSelectCards.Card(1, game.findUI(this._node, "" + i)));
        }

        this._btnSure = game.findUI(this._node, "BTN_Sure");
        this._btnSure.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._handlerSure && this._handlerSure(this._index);
            }
        }, this);
    },

    reset : function () {
        this._cards.forEach(function (card) {
            card.reset();
        });
        this.show(false);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },

    setCardsValues : function (cardsArray) {
        this.show(true);
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < cardsArray.length) {
                this._cards[i].setValue(cardsArray[i]);
            } else {
                this._cards[i].reset();
            }
        }
    },

    /**
     * 绑定确定按钮点击的回调
     * @param callback      回到的函数 会回传选择的index的值
     */
    onSureClicked : function (callback) {
        this._handlerSure = callback;
    }
});

// 选牌的具体的牌
GameWindowMahjong.HangupTasksSelectCards.Card = GameWindowMahjong.HandCardSub.extend({
    /**
     * 设置牌的值
     * @param value
     */
    setValue : function (value) {
        this._value = value;
        if (this._value < 1) {
            this.show(false);
            return;
        }

        var gameData = game.procedure.Mahjong.getGameData();

        var path = GameWindowMahjong.HandCard.RES_PAHT + gameData.getDirectionString(this._uiIndex)
            + "/" + this._value + ".png";

        this._node.setTexture(path);

        this.show(true);
    }
});
