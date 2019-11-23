/**
 * Created by lyndon on 2018/05/16.
 *  本玩家单张手牌：可点击
 */
GameWindowPinShi.HandCard = cc.Class.extend({
    _node               : null,         // 本节点

    _value              : -1,           // 当前牌值
    _sprite             : null,         // 牌面图片
    _selected           : false,        // 是否被选中
    _colored            : false,        // 是否变色
    _touch              : false,        // 是否可点击

    _selectedCallback   : null,         // 选中回调
    _unSelectedCallback : null,         // 取消选中回调
    _originPos          : null,         // 初始位置

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },
    
    _init: function () {

        this._sprite = game.findUI(this._node, "ND_Card");
        this._originPos = this._sprite.getPosition();

        this._sprite.addTouchEventListener(this._onCardClick, this);
    },

    reset: function () {
        this.setSelectCallback(null);
        this.setUnSelectCallback(null);
        this.setColored(false);
        this.setSelected(false);
        this.setTouch(false);
        this.setValue(-1);
    },
    /**
     * 设置牌面
     * @param value
     */
    setValue: function (value) {
        // cc.log("===================1 " + value);
        this._value = value;
        if (this._value == -1) {
            this._sprite.setVisible(false);
            return;
        }
        var path = GameWindowPinShi.HandCard.RES_PATH + this._value + ".png";
        // cc.log("===================2 " + path);
        this._sprite.loadTextureNormal(path, ccui.Widget.LOCAL_TEXTURE);
        this._sprite.loadTexturePressed(path, ccui.Widget.LOCAL_TEXTURE);
        this._sprite.loadTextureDisabled(path, ccui.Widget.LOCAL_TEXTURE);
        this._sprite.setVisible(true);
    },
    /**
     * 获取当前牌面的值
     * @returns {number|*}
     */
    getValue: function () {
        return this._value;
    },
    /**
     * 设置选中回调
     * @param callback
     */
    setSelectCallback: function (callback) {
        this._selectedCallback = callback;
    },
    /**
     * 设置取消选中回调
     * @param callback
     */
    setUnSelectCallback: function (callback) {
        this._unSelectedCallback = callback;
    },
    /**
     * 手牌点击
     * @param sender
     * @param type
     * @private
     */
    _onCardClick: function (sender, type) {
        if (type == ccui.Widget.TOUCH_BEGAN) {
            this.setColored(true);
        } else if (type == ccui.Widget.TOUCH_ENDED) {
            this.setColored(false);
            this.setSelected(!this._selected);
        } else if (type == ccui.Widget.TOUCH_CANCELED) {
            this.setColored(false);
        }
    },
    /**
     * 设置变色
     * @param bool
     */
    setColored: function (bool) {
        this._colored = bool;
        if (this._colored) {
            this._sprite.setColor(cc.color(128, 128, 128));
        }else {
            this._sprite.setColor(cc.color(255, 255, 255));
        }
    },
    /**
     * 设置选中
     * @param bool
     */
    setSelected: function (bool) {
        this._selected = bool;
        if (this._selected) {
            this._sprite.setPosition(cc.pAdd(this._originPos, cc.p(0, 16)));
            // cc.log("=======================1 " + this._selectedCallback);
            this._selectedCallback && this._selectedCallback(this);
        }else {
            this._sprite.setPosition(cc.p(this._originPos));
            this._unSelectedCallback && this._unSelectedCallback(this);
            // cc.log("=======================2 " + this._unSelectedCallback);
        }
    },
    /**
     * 获取手牌是否为选中状态
     */
    getSelected: function () {
        return this._selected;
    },
    /**
     * 设置是否可以点击
     * @param bool
     */
    setTouch: function (bool) {
        this._touch = bool;
        this._sprite.setEnabled(bool);
    },
    /**
     * 获取是否能点击
     */
    getTouch: function () {
        return this._touch;
    },

    /**
     * 获取当前牌的值 带旋转效果
     * @param value
     * @param completeCallback
     */
    setValueWithTurnPage : function (value, completeCallback) {
        this._sprite.setVisible(false);
        this._value = value;
        if (this._value == -1) {
            completeCallback && completeCallback();
            return;
        }
        this._sprite.setVisible(true);
        var scaleTo1 = new cc.ScaleTo(0.2, 0, 1);
        var fun1 = cc.CallFunc(function () {
            var path = GameWindowPinShi.HandCard.RES_PATH + this._value + ".png";
            this._sprite.loadTextureNormal(path, ccui.Widget.LOCAL_TEXTURE);
            this._sprite.loadTexturePressed(path, ccui.Widget.LOCAL_TEXTURE);
            this._sprite.loadTextureDisabled(path, ccui.Widget.LOCAL_TEXTURE);
        }, this);
        var scaleTo2 = new cc.ScaleTo(0.2, 1, 1);
        var fun2 = cc.CallFunc(function () {
            completeCallback && completeCallback();
        }, this);

        this._sprite.runAction(cc.sequence(scaleTo1, fun1, scaleTo2, fun2));
    }



});

GameWindowPinShi.HandCard.RES_PATH = "res/Games/PinShi/Pokers/";