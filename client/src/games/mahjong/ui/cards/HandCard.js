/**
 * Created by pander on 2018/5/16.
 */
// ==== 可点击的单个麻将手牌 单牌 ========================================================
GameWindowMahjong.HandCard = cc.Class.extend({
    _node                   : null,         // 本节点

    _originalPosition       : cc.p(0, 0),   // 原始位置

    _uiIndex                : 1,            // UI的位置
    _value                  : -1,           // 牌的值
    _isSelected             : false,        // 是否被选中

    _handlerCallback        : null,         // 回调函数
    _handlerSelected        : null,         // 选择回调函数
    _handlerUnSelected      : null,         // 选择回调函数

    _parentController       : null,         // 父类控制器
    _lastMovePosition       : null,         // 上次牌移动的位置
    _movePosition           : null,         // 牌移动到的位置

    _arrow                  : null,         // 胡牌提示箭头
    _isTip                  : false,        // 是否提示胡牌

    _mode                   : 1,            // 正常状态

    ctor: function (uiIndex, node) {
        this._uiIndex = uiIndex;
        this._node = node;
        this._init();
        return true;
    },

    _init: function () {

        this._originalPosition = this._node.getPosition();
        this._node.addTouchEventListener(function (sender, type) {
            sender.setOpacity(255);
            if (type == ccui.Widget.TOUCH_BEGAN) {
                if (this._moveCard == null) {
                    if (this._parentController) {
                        var gameData = game.procedure.Mahjong.getGameData();
                        var path = GameWindowMahjong.HandCard.RES_PAHT + gameData.getDirectionString(this._uiIndex)
                            + "/" + this._value + ".png";
                        this._parentController.createMoveCard(path, this._node.getPosition());
                        this._lastMovePosition = null;
                        this._movePosition = null;
                    }
                }
            } else if (type == ccui.Widget.TOUCH_MOVED) {
                // 换三张模式不能拖动
                if (this._mode == 2) {
                    return;
                }
                // 移动创建好的牌
                var pos = sender.getTouchMovePosition();
                if (this._lastMovePosition) {
                    this._parentController.moveMoveCard(cc.p(pos.x - this._lastMovePosition.x, pos.y - this._lastMovePosition.y));
                    sender.setOpacity(120);
                }
                this._lastMovePosition = pos;
                this._movePosition = pos;
                // 拖动的位置超过240 则判定为选中
                if (this._movePosition.y > 240) {
                    this._isSelected = true;
                }
            } else if (type == ccui.Widget.TOUCH_ENDED) {
                if (this._isSelected) {
                    this.setSelected(false);
                    if (this._mode == 2) {
                        this._handlerUnSelected && this._handlerUnSelected(this);
                    }else {
                        this.show(false);
                        this._handlerCallback && this._handlerCallback(this);
                    }
                } else {
                    this.setSelected(true);
                    this._handlerSelected && this._handlerSelected(this);
                }
                this._parentController.destroyMoveCard();
            } else if (type == ccui.Widget.TOUCH_CANCELED) {
                this._parentController.destroyMoveCard();
                // 拖动的位置超过240 则出牌
                if (this._movePosition && this._movePosition.y > 240) {
                    this._isSelected = false;
                    this.show(false);
                    this._handlerCallback && this._handlerCallback(this);
                }
            }
        }, this);
    },

    reset: function () {
        this.setValue(-1);
        this.setCardTouch(false);
        this.setSelected(false);
        this.showHuTip(false);
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 设置父类控制器
     * @param controller
     */
    setParentController: function (controller) {
        this._parentController = controller;
    },

    /**
     * 设置是否可点击
     * @param bool
     */
    setCardTouch: function (bool) {
        this._node.setEnabled(bool);
    },

    /**
     * 是否可点击
     * @returns {*|boolean}
     */
    isCardTouch: function () {
        return this._node.isEnabled();
    },

    /**
     * 设置是否可见
     * @param value
     */
    setValue: function (value) {
        this._value = value;
        if (this._value < 1) {
            this.show(false);
            return;
        }

        var gameData = game.procedure.Mahjong.getGameData();
        var path = GameWindowMahjong.HandCard.RES_PAHT + gameData.getDirectionString(this._uiIndex)
            + "/" + this._value + ".png";

        this._node.loadTextures(path, path, path);
        this.setColored(false);
        this.show(true);
    },

    /**
     * 获取牌的值
     * @returns {number|*}
     */
    getValue: function () {
        return this._value;
    },

    /**
     * 绑定出牌回调
     * @param callback      回传自己作为对象
     */
    onPlayCardClicked: function (callback) {
        this._handlerCallback = callback;
    },

    /**
     * 绑定选中回调函数
     * @param callback  回传对象自己
     */
    onSelectedChange: function (callback) {
        this._handlerSelected = callback;
    },

    /**
     * 取消选中回调
     */
    unSelectedChange: function (callback) {
        this._handlerUnSelected = callback;
    },

    /**
     * 设置是否选中
     * @param bool
     */
    setSelected: function (bool) {
        this._isSelected = bool;
        var pos = this._isSelected ? cc.p(this._originalPosition.x, this._originalPosition.y + 30) : this._originalPosition;
        this._node.setPosition(pos);
    },

    /**
     * 设置是否选中
     * @param bool
     */
    setSelectedWithAct: function (bool) {
        this._isSelected = bool;
        if (this._isSelected) {
            var pos = cc.p(this._originalPosition.x, this._originalPosition.y + 30);
            this._node.setPosition(pos);
        }else {
            pos = this._originalPosition;
            this._node.runAction(cc.MoveTo(0.5, pos));
        }
    },

    /**
     * 当前状态是否选中
     * @returns {boolean}
     */
    isSelected: function () {
        return this._isSelected;
    },

    /**
     * 显示胡牌提示
     * @param show
     */
    showHuTip: function (show) {
        if (show) {
            if (!this._arrow) {
                this._arrow = new cc.Sprite("res/Games/Mahjong/CardsImages/Arrow_Hu.png");
                this._arrow.setPosition(cc.p(45, 130));
                this._node.addChild(this._arrow, 1000);
            }
            this._arrow.setVisible(true);
            this._isTip = true;
        } else {
            this._arrow && this._arrow.setVisible(false);
            this._isTip = false;
        }
    },

    isTip: function () {
        return this._isTip;
    },

    /**
     * 设置变色
     */
    setColored: function (color) {
        if (color)
            this._node.setColor(cc.color(180, 180, 180));
        else
            this._node.setColor(cc.color(255, 255, 255));
    },
    /**
     * 获取花色
     */
    getHS: function () {
        return Math.floor(this._value / 10);
    },
    /**
     * 手牌是否可以拖动
     */
    setMode: function (mode) {
        this._mode = mode;
    }
});

GameWindowMahjong.HandCard.RES_PAHT = "res/Games/Mahjong/CardsImages/HandCards/";
