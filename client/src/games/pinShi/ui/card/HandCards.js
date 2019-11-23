/**
 * Created by lyndon on 2018/05/16.
 *  本玩家手牌
 */
GameWindowPinShi.HandCards = cc.Class.extend({
    _node                   : null,             // 本节点

    _cards                  : [],               // 手牌对象数组
    _selectCount            : 0,                // 选中计数

    _calculator             : null,             // 计算器控件
    _fntArr                 : [],               // 数字控件数组
    _fntResult              : 0,                // 计算结果
    _imgBingo               : null,             // 有十提示
    _numArr                 : [],               // 选出的三个数值

    ctor: function () {
        this._node = ccs.load("res/Games/PinShi/Card/HandCards.json").node;
        this._init();
        return true;
    },

    _init: function () {
        this._cards = [];
        var temp = null;
        for (var i = 1; i <= 5; ++i) {
            temp = new GameWindowPinShi.HandCard(game.findUI(this._node, "ND_Card_" + i));
            this._cards.push(temp);
        }

        this._calculator = game.findUI(this._node, "ND_Calculator");
        this._fntArr = [];
        for (var j = 1; j <= 3; ++j) {
            this._fntArr.push(game.findUI(this._calculator, "Fnt_" + j));
        }
        this._fntResult = game.findUI(this._calculator, "FntResult");
        this._imgBingo = game.findUI(this._calculator, "ImgBingo");

        this.updateCalculator();
    },

    reset: function () {
        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].reset();
        }
        this._selectCount = 0;
        this._numArr = [];
        this.showCalculator(false);
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 添加到节点
     * @param uiNode    被添加的节点
     * @param position  在被添加节点的位置
     */
    addToNode : function (uiNode, position) {
        this._node.setPosition(position || cc.p(0, 0));
        uiNode.addChild(this._node);
    },
    /**
     * 显示算牌器 显示算牌器的同时开启点击事件
     * @param bool
     */
    showCalculator: function (bool) {
        this._calculator.setVisible(bool);
        this.setTouch(bool);
        if (bool) {
            this.registerClick();
            // 显示的时候重新设置值
            for (var i = 0; i < this._fntArr.length; ++i) {
                this._fntArr[i].setString("");
            }
            this._fntResult.setString("");
            this._imgBingo.setVisible(false);
        }

    },
    /**
     * 设置手牌
     * @param cards 数组
     */
    setCardsValue: function (cards) {
        // cc.log("======================= 设置手牌 " + JSON.stringify(cards));
        for (var i = 0; i < this._cards.length; ++i) {
            if(i >= cards.length){
                this._cards[i].reset();
            }else {
                this._cards[i].setValue(cards[i]);
                // this._cards[i].setTouch(cards[i] != 100);
            }
        }
    },
    /**
     * 设置牌值并翻转
     * @param cards
     * @param completeCallback
     */
    setCardsValueWithTurnPage : function (cards, completeCallback) {
        if (cards.length < 1) {
            completeCallback && completeCallback();
            return;
        }

        this._cards[0].setValueWithTurnPage(cards[0], function () {
            completeCallback && completeCallback();
            // this.registerClick();
        }.bind(this));
        //this._cards[0].setTouch(cards[0] != 100);

        for (var i = 1; i < this._cards.length; ++i) {
            if (i < cards.length) {
                this._cards[i].setValueWithTurnPage(cards[i]);
                // this._cards[i].setTouch(cards[i] != 100);
            } else {
                this._cards[i].setValue(-1);
            }
        }
    },
    /**
     * 添加牌
     * @param values    添加的牌的数组
     */
    addCards: function (values) {
        // cc.log("======================= 添加手牌 " + JSON.stringify(values));
        var thisValues = this.getCardsValue();
        for (var i = 0; i < values.length; ++i) {
            thisValues.push(values[i]);
        }
        this.setCardsValue(thisValues);
    },

    /**
     * 获取当前牌的值数组
     * @return {Array}
     */
    getCardsValue: function () {
        var values = [];
        for (var i = 0; i < this._cards.length; ++i) {
            var value = this._cards[i].getValue();
            if (value != -1) {
                values.push(value);
            }
        }
        return values;
    },
    /**
     * 注册手牌点击回调
     */
    registerClick: function () {
        for (var i = 0; i < this._cards.length; ++i) {
            this._cards[i].setSelectCallback(this.onSelectCard.bind(this));
            this._cards[i].setUnSelectCallback(this.onUnSelectCard.bind(this));
        }
    },
    /**
     * 选牌回调
     * @param card
     */
    onSelectCard: function (card) {
        this._selectCount ++;
        cc.log("====================select " + card.getValue());
        // cc.log("====================++ " + this._selectCount);
        if (this._selectCount >=3 ) {
            for (var i = 0; i < this._cards.length; ++i) {
                if (!this._cards[i].getSelected()) {
                    this._cards[i].setTouch(false);
                }
            }
        }
        this.updateCalculator();
    },
    /**
     * 取消选牌回调
     * @param card
     */
    onUnSelectCard: function (card) {
        this._selectCount --;
        cc.log("====================unSelect " + card.getValue());
        // cc.log("====================-- " + this._selectCount);
        if (this._selectCount < 3 ) {
            for (var i = 0; i < this._cards.length; ++i) {
                if (!this._cards[i].getSelected()) {
                    this._cards[i].setTouch(this._cards[i].getValue() != 100);
                }
            }
        }
        this.updateCalculator();
    },
    /**
     * 更新算牌器的信息
     */
    updateCalculator: function () {
        this._numArr = [];
        for (var j = 0; j < this._cards.length; ++j) {
            if (this._cards[j].getSelected()) {
                var num = this._cards[j].getValue() % 100;
                num = num > 10 ? 10 : num;
                this._numArr.push(num);
            }
        }
        // cc.log("====================numArr " + this._numArr);

        for (var i = 0; i < this._fntArr.length; ++i) {
            if (i >= this._numArr.length) {
                this._fntArr[i].setString("");
                this._fntArr[i].setVisible(false);
            }else {
                // cc.log("====================str " + this._numArr[i]);
                this._fntArr[i].setString("" + this._numArr[i]);
                this._fntArr[i].setVisible(true);
            }
        }

        this._imgBingo.setVisible(false);

        if (this._numArr.length >= 3) {
            var sum = this._numArr[0] + this._numArr[1] + this._numArr[2];
            this._fntResult.setString("" + sum);
            this._fntResult.setVisible(true);
            if (sum % 10 == 0) {
                this.__showBingo();
            }

        }else {
            this._fntResult.setString("");
            this._fntResult.setVisible(false);
        }
    },
    /**
     * 显示有十
     * @private
     */
    __showBingo: function(){
        this._imgBingo.setOpacity(0);
        this._imgBingo.setVisible(true);
        this._imgBingo.stopAllActions();
        this._imgBingo.runAction(cc.FadeIn(0.3).easing(cc.easeOut(0.2)));
    },
    /**
     * 设置手牌是否可以点击
     * @param bool
     */
    setTouch: function (bool) {
        var cards = this._cards;
        for (var i = 0; i < cards.length; ++i) {
            if (bool) {
                cards[i].setTouch(cards[i].value != 100);
            }else {
                cards[i].setTouch(false);
            }
        }
    },

    getLastCard: function () {
        return this._cards[this._cards.length - 1];
    }
});