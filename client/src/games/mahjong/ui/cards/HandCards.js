/**
 * 麻将手牌
 * @type {Class}
 */
GameWindowMahjong.HandCards = cc.Class.extend({
    _parentNode                 : null,         // 父节点
    _node                       : null,         // 本节点

    _uiIndex                    : 0,            // UI位置，用于方位判定
    _cards                      : [],           // 手牌的数组 1到13号牌
    _cardsAll                   : [],           // 所有手牌
    _newCard                    : null,         // 新牌 摸到的牌 0号牌
    _moveCard                   : null,         // 用于移动的牌

    _handlerPlayCard            : null,         // 出牌回调
    _handlerSelectCard          : null,         // 选牌回调
    _handlerSelectTingCard      : null,         // 听牌选中回调

    _selectedCnt                : 0,            // 选中张数
    _selectedColor              : 0,            // 选中的花色

    ctor: function (uiIndex, parentNode) {
        this._uiIndex = uiIndex;
        this._parentNode = parentNode;
        var gameData = game.procedure.Mahjong.getGameData();
        var dirStr = gameData.getDirectionString(this._uiIndex);
        this._node = ccs.load("res/Games/Mahjong/Cards/HandCards" + dirStr + ".json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },
    _init: function () {
        this._cards = [];
        this._cardsAll = [];
        this._newCard = null;
        if (this._uiIndex == 1) {
            for (var i = 1; i < 14; ++i) {
                var card = new GameWindowMahjong.HandCard(this._uiIndex, game.findUI(this._node, "" + i));
                card.setParentController(this);
                this._cards.push(card);
                this._cardsAll.push(card);
            }
            this._newCard = new GameWindowMahjong.HandCard(this._uiIndex, game.findUI(this._node, "0"));
            this._newCard.setParentController(this);
            this._cardsAll.push(this._newCard);
        } else {
            this._newCard = new GameWindowMahjong.HandCardSub(this._uiIndex, game.findUI(this._node, "0"));
            this._cardsAll.push(this._newCard);
            for (i = 1; i < 14; ++i) {
                var c = new GameWindowMahjong.HandCardSub(this._uiIndex, game.findUI(this._node, "" + i))
                this._cards.push(c);
                this._cardsAll.push(c);
            }
        }
    },
    reset: function () {
        this._cardsAll.forEach(function (btnCard) {
            btnCard.reset();
        });

        this._node.setPosition(cc.p(0, 0));
    },
    /**
     * 设置牌的值
     * @param cardsArray 牌的值 拍好序的数组
     * @param que 定缺的花色
     */
    setCardsValues: function (cardsArray, que) {
        for (var i = 0; i < this._cards.length; ++i) {
            if (i < cardsArray.length) {
                this._cards[i].setValue(cardsArray[i]);
                this._cards[i].setSelected(false);
            } else {
                this._cards[i].reset();
            }
        }

        if (cardsArray.length > 13) {
            this._newCard.setValue(cardsArray[13]);
        } else {
            this._newCard.reset();
        }

        if (que == undefined || que == null || que == -1){
            return;
        }

        this._cardsAll.forEach(function (card) {
            if (card.getValue() != -1 && card.getHS() == que) {
                card.setColored(true);
            }
        }.bind(this));
    },
    /**
     * 获取当前手牌的值
     * @return {Array}      返回值是数组
     */
    getCardsValues: function () {
        var values = [];
        for (var i = 0; i < this._cards.length; ++i) {
            var value = this._cards[i].getValue();
            if (value != -1) {
                values.push(value);
            }
        }
        if (this._newCard && this._newCard.getValue() != -1) {
            values.push(this._newCard.getValue());
        }
        return values;
    },
    /**
     * 添加一张新牌
     * @param cardValue
     * @param que 定缺的花色
     */
    addNewCard: function (cardValue, que) {
        this._newCard.setValue(cardValue);
        // cc.log("==============> " + cardValue);
        if (que == undefined || que == null || que == -1){
            return;
        }

        if (this._newCard.getHS() == que) {
            this._newCard.setColored(true);
        }
    },
    // 添加胡牌
    addHuCard: function (cardValue) {
        this._newCard.setHuValue(cardValue);
    },
    /**
     * 创建移动的牌
     * @param path          牌的路径
     * @param position      移动的牌的世界坐标位置
     */
    createMoveCard: function (path, position) {
        if (this._moveCard == null) {
            this._moveCard = new cc.Sprite(path);
            this._moveCard.setPosition(position);
            this._node.addChild(this._moveCard);
        }
    },
    /**
     * 移动创建的移动牌
     * @param moveDistance 移动牌的距离变量
     */
    moveMoveCard: function (moveDistance) {
        if (this._moveCard) {
            var pos = this._moveCard.getPosition();
            this._moveCard.setPosition(cc.p(pos.x + moveDistance.x, pos.y + moveDistance.y));
        }
    },
    /**
     * 销毁移动的牌
     */
    destroyMoveCard: function () {
        if (this._moveCard) {
            this._moveCard.removeFromParent(true);
            this._moveCard = null;
        }
    },
    /**
     * 设置牌是否能被点击
     * @param bool
     */
    setCardsTouch: function (bool) {
        this._newCard.setCardTouch(bool);
        this._cards.forEach(function (btnCard) {
            btnCard.setCardTouch(bool);
        });
    },
    /**
     * 绑定出牌回调函数
     * @param callback
     */
    onPlayCardClicked: function (callback) {
        this._handlerPlayCard = callback;
    },
    /**
     * 绑定出牌回调函数
     * @param callback
     */
    onSelectCard: function (callback) {
        this._handlerSelectCard = callback;
    },
    /**
     * 听牌选中回调
     * @param callback
     */
    onTingCardSelect: function (callback) {
        this._handlerSelectTingCard = callback;
    },
    /**
     * 选中处理 除了选中的牌，其他的都设置为没选中
     * @param card 当前选中的牌
     * @private
     */
    _selectedHandler: function (card) {
        if (card != this._newCard) {
            this._newCard.setSelected(false);
        }

        this._cards.forEach(function (btnCard) {
            if (btnCard != card) {
                btnCard.setSelected(false);
            }
        });
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },
    /**
     * 显示胡牌提示
     * @param cards
     */
    showHuTipCards: function (cards) {
        var call = function (value) {
            for (var i = 0; i < cards.length; ++i) {
                if (value == cards[i]) {
                    return true;
                }
            }
            return false;
        };

        if (call(this._newCard.getValue())) {
            this._newCard.showHuTip(true);
        }

        for (var i = 0; i < this._cards.length; ++i) {
            var card = this._cards[i];
            if (call(card.getValue())) {
                card.showHuTip(true);
            }
        }
    },
    /**
     * 隐藏胡牌提示
     */
    hideHuTipCards: function () {
        this._newCard.showHuTip(false);
        for (var i = 0; i < this._cards.length; ++i) {
            var card = this._cards[i];
            card.showHuTip(false);
        }
    },
    /**
     * 设置选中的牌
     */
    setSelectedCards: function (cards) {
        // 1.设置选中的花色
        this._selectedColor = Math.floor(cards[0] / 10);
        // 2.设置当前选择的张数
        this._selectedCnt = 3;
        // 3.选中三张
        for (var i = 0; i < cards.length; ++i) {
            for (var j = 0; j < this._cardsAll.length; ++j) {
                if (this._cardsAll[j].getValue() == cards[i] && !this._cardsAll[j].isSelected()) {
                    this._cardsAll[j].setSelected(true);
                    break;
                }
            }
        }
        // 4.同一花色没有被选中的牌设置变色且不可点击
        this._cardsAll.forEach(function (c) {
            if (c.getHS() == this._selectedColor && !c.isSelected()) {
                c.setColored(true);
                c.setCardTouch(false);
            }
        }.bind(this));
    },
    /**
     * 设置选中的牌
     */
    showSelectedCards: function (cards) {
        for (var i = 0; i < cards.length; ++i) {
            for (var j = 0; j < this._cardsAll.length; ++j) {
                if (this._cardsAll[j].getValue() == cards[i] && !this._cardsAll[j].isSelected()) {
                    this._cardsAll[j].setSelected(true);
                    break;
                }
            }
        }
        this._cardsAll.forEach(function (c) {
            if (c.isSelected()) {
               c.setSelectedWithAct(false);
            }
        }.bind(this));
    },
    /**
     * 切换模式：换三张模式/正常模式
     */
    switchTouchMode: function (mode) {
        if (this._uiIndex != 1) {
            // 不是本人手牌，直接放弃点击注册
            return;
        }
        if (mode == 1) {// 正常出牌模式
            this._cardsAll.forEach(function (card) {
                card.setMode(1);
                card.onPlayCardClicked(function (btnCard) {
                    this._handlerPlayCard(btnCard.getValue());
                    this.hideHuTipCards();
                }.bind(this));
                card.onSelectedChange(function (btnCard) {
                    this._handlerSelectCard(btnCard.getValue());
                    this._handlerSelectTingCard(btnCard.getValue(), btnCard.isTip());
                    this._selectedHandler(card);
                }.bind(this));
            }.bind(this));
        } else if (mode == 2) {// 选三张模式
            this._cardsAll.forEach(function (card) {
                card.setMode(2);
                card.onSelectedChange(function (btnCard) {
                    // 1.当前选择张数
                    this._selectedCnt++;
                    // 2.当前选择的花色
                    if (this._selectedCnt == 1){
                        this._selectedColor = btnCard.getHS();
                    }
                    // cc.log("==> select cnt: " + this._selectedCnt);
                    // cc.log("==> select color: " + this._selectedColor);
                    // 3.如果花色被切换
                    // a.则放下其他所有牌，重置花色和数量
                    // b.关闭颜色开启点击
                    if (this._selectedColor != btnCard.getHS()) {
                        this._cardsAll.forEach(function (c) {
                            if (c != btnCard) {
                                c.setSelected(false);
                                c.setColored(false);
                                c.setCardTouch(true);
                            }
                        }.bind(this));
                        this._selectedCnt = 1;
                        this._selectedColor = btnCard.getHS();
                    }
                    // 3.如果同一花色选中三张，该花色没有被选中的变色不可点击
                    if (this._selectedCnt >= 3) {
                        this._cardsAll.forEach(function (c) {
                            if (c.getHS() == this._selectedColor && !c.isSelected()) {
                                c.setColored(true);
                                c.setCardTouch(false);
                            }
                        }.bind(this));
                    }
                }.bind(this));
                card.unSelectedChange(function (btnCard) {
                    // 1.当前选择张数
                    this._selectedCnt--;
                    // 2.当前选择的花色
                    if (this._selectedCnt == 0) {
                        this._selectedColor = 0;
                    }
                    // cc.log("==> select cnt: " + this._selectedCnt);
                    // cc.log("==> select color: " + this._selectedColor);
                    //  3.如果同一花色选中的数量少于三张，所有牌恢复变色可以点击
                    if (this._selectedCnt < 3) {
                        this._cardsAll.forEach(function (c) {
                            c.setColored(false);
                            c.setCardTouch(true);
                        }.bind(this));
                    }
                }.bind(this));
            }.bind(this));
        }
    },
    /**
     * 获取已经选择的手牌的值
     * @returns {Array}
     */
    getSelectedValues: function () {
        var cards = [];
        for (var i = 0; i < this._cardsAll.length; ++i) {
            if (this._cardsAll[i].isSelected()) {
                cards.push(this._cardsAll[i].getValue());
            }
        }

        return cards;
    },
    
    showAllCards: function () {
        this._cardsAll.forEach(function (card) {
            if (card.getValue() > 1) {
                card.show(true);
            }
        });
    },

    // 推到牌后位置调整
    doOffset: function () {
        switch (this._uiIndex) {
            case 1:
                this._node.setPositionX(15);
                break;
            case 2:
                this._node.setPositionY(15);
                break;
            case 3:
                this._node.setPositionY(-15);
                break;
            case 4:
                this._node.setPositionX(-15);
                break;
        }
    }

});