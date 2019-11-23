/**
 * Created by Jiyou Mo on 2017/10/17.
 */
// 斗地主按钮牌
GameWindowDouDiZhu.HandButtonCard = cc.Class.extend({

    _node               : null,         // 本节点

    _isOperator         : false,        // 是否在操作
    _value              : -1,           // 牌面的值
    _selected           : false,        // 是否被选中
    _coloured           : false,        // 是否变色
    _touch              : false,        // 是否可点击
    _selectedCallback   : null,         // 选中回调
    _colouredCallback   : null,         // 变色回调

    _valueSprite        : null,         // 牌面图片
    _markSprite         : null,         // 地主牌标记

    _originalPos        : null,         // 牌的原来位置
    _originalAnchor     : null,         // 牌锚点位置

    _minX               : 0,
    _maxX               : 0,
    _minY               : 0,
    _maxY               : 0,

    _control            : null,         // 父节点控制对象
    _isLast             : false,        // 是否是最后一张牌

    ctor : function (node, control) {
        this._node = node;
        this._control = control;
        this._init();
        return true;
    },

    /**
     * 初始化函数
     * @private
     */
    _init : function () {
        this._valueSprite = game.findUI(this._node, "SP_Value");
        this._markSprite = game.findUI(this._node, "SP_Mark");

        // this._originalPos = this._valueSprite.getPosition();
        this._originalPos = cc.p(0, 0);
        this._originalAnchor = this._valueSprite.getAnchorPoint();

        this._updatePosValue();

        this._valueSprite.addTouchEventListener(this._cardClicked, this);

        this.reset();
    },

    /**
     * 重置牌数据
     */
    reset : function () {
        this._isOperator = false;
        this.onSelectedCallback(null);
        this.onColouredCallback(null);
        this.setSelected(false);
        this.setColoured(true);
        this.setTouch(false);
        this.setValue(-1, false);
    },

    /**
     * 位置值更新函数
     * @private
     */
    _updatePosValue : function () {
        this._minX = this._node.getPosition().x + this._originalPos.x
            - this._originalAnchor.x * this._valueSprite.getSize().width;
        // 最后一张牌没有遮挡，因此宽度比其他宽
        if (this._isLast) {
            this._maxX = this._minX + 135;
        } else {
            this._maxX = this._minX + 56;
        }

        this._minY = this._node.getPosition().y + this._originalPos.y
            - this._originalAnchor.y * this._valueSprite.getSize().height;
        this._maxY = this._minY + 290;
    },

    /**
     * 设置牌面的值
     * @param value     牌面的值 为-1将隐藏此牌
     * @param isMark    是否是地主的牌
     */
    setValue : function (value, isMark) {
        this._value = value;
        this._valueSprite.setVisible(false);
        this._valueSprite.setEnabled(false);
        this._markSprite.setVisible(isMark);
        if (value != -1) {
            var path = GameWindowDouDiZhu.HandButtonCard.RES_PATH + this._value + ".png";
            this._valueSprite.loadTextureNormal(path,ccui.Widget.LOCAL_TEXTURE);
            this._valueSprite.loadTexturePressed(path,ccui.Widget.LOCAL_TEXTURE);
            this._valueSprite.loadTextureDisabled(path,ccui.Widget.LOCAL_TEXTURE);
            this._valueSprite.setVisible(true);
            this._valueSprite.setEnabled(this._touch);
        }
    },

    /**
     * 获取牌面的值
     * @return {number|*}
     */
    getValue : function () {
        return this._value;
    },

    /**
     * 设置是否能点击
     * @param bool
     */
    setTouch : function (bool) {
        this._touch = bool;
        this._valueSprite.setEnabled(this._touch);
    },

    /**
     * 获取是否能点击
     * @return {boolean}
     */
    getTouch : function () {
        return this._touch;
    },

    /**
     * 设置是否是最后一张牌（选牌的时候，判断范围需要用到）
     * @param bool
     */
    setLast : function (bool) {
        this._isLast = bool;
    },

    /**
     * 牌被点击回调
     * @param sender
     * @param type
     * @private
     */
    _cardClicked : function (sender, type) {
        if (type == ccui.Widget.TOUCH_BEGAN ) {
            if (!this._isOperator) {
                this._isOperator = true;
                this.setColoured(true);
            }
        } else if (type == ccui.Widget.TOUCH_MOVED) {
            // 调用父类的位置触发器
            this._control.setRectMoveTouch(sender.getTouchBeganPosition(), sender.getTouchMovePosition());
        } else if (type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED) {
            // 调用父类的位置结束器
            this._control.setEndRectMoveTouch();
        }
    },

    onRectMoveTouch : function (beginPos, endPos) {
        var thisRect = cc.rect(this._minX, this._minY, this._maxX - this._minX, this._maxY - this._minY);
        var x = beginPos.x < endPos.x ? beginPos.x : endPos.x;
        var y = beginPos.y < endPos.y ? beginPos.y : endPos.y;
        var width = Math.abs(endPos.x - beginPos.x);
        var height = Math.abs(endPos.y - beginPos.y);
        var thatRect = cc.rect(x, y, width, height);

        // 判断外部交叉范围是否和本矩形相交
        if (cc.rectIntersectsRect(thatRect, thisRect)) {
            if (!this._isOperator) {
                // this._isOperator = true;
                this.setColoured(true);
            }
        } else {
            if (!this._isOperator) {
                // this._isOperator = true;
                this.setColoured(false);
            }
        }
    },

    /**
     * 结束操作
     */
    onEndRectMoveTouch : function () {
        this._isOperator = false;
    },

    /**
     * 设置该牌是否选中
     * @param selected
     */
    setSelected : function (selected) {
        this._selected = selected;
        var selectPos = cc.p(this._originalPos.x, this._originalPos.y + 30);
        if (this._selected) {
            this._valueSprite.setPosition(selectPos);
            this._selectedCallback && this._selectedCallback(this);
        } else {
            this._valueSprite.setPosition(this._originalPos);
        }
    },
    /**
     * 设置选中状态（应用场景：手牌中三张地主牌从选中状态，然后慢慢放回去）
     * @param selected
     */
    setSelectedWithAction: function (selected) {
        this._selected = selected;
        var selectPos = cc.p(0, 30);
        if (this._selected) {
            this._valueSprite.setPosition(selectPos);
        } else {
            // this._valueSprite.setPosition(this._originalPos);
            this._valueSprite.stopAllActions();
            this._valueSprite.runAction(cc.Sequence(cc.MoveTo(0.05, cc.p(0, 0)), cc.CallFunc(function (node) {
                node.setPosition(0, 0);
            }, this)));
        }
    },
    /**
     * 设置选中回调
     * @param callback
     */
    onSelectedCallback : function (callback) {
        this._selectedCallback = callback;
    },

    /**
     * 是否被选中
     * @return {boolean}
     */
    isSelected : function () {
        return this._selected;
    },

    /**
     * 改变选择状态
     */
    changeSelected : function () {
        this.setSelected(!this._selected);
    },

    /**
     * 设置变色
     * @param bool
     */
    setColoured : function (bool) {
        this._coloured = bool;
        if (this._coloured) {
            this._valueSprite.setColor(cc.color(128, 128, 128));
            this._colouredCallback && this._colouredCallback(this);
        } else {
            this._valueSprite.setColor(cc.color(255, 255, 255));
        }
    },

    /**
     * 设置变色回调
     * @param callback
     */
    onColouredCallback : function (callback) {
        this._colouredCallback = callback;
    },

    /**
     * 获取是否变色
     * @return {boolean}
     */
    isColoured : function () {
        return this._coloured;
    }
});

// 牌的资源
GameWindowDouDiZhu.HandButtonCard.RES_PATH = "res/Games/DouDiZhu/Poker/";