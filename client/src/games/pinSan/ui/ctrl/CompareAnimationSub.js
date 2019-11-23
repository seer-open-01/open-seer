/**
 * Created by Jiyou Mo on 2017/12/7.
 */
// 比牌动画元素
GameWindowPinSan.CompareAnimationVS = cc.Class.extend({
    _node               : null,         // 本节点
    _originalPos        : null,         // 原位置

    _imgVS              : null,         // VS图片
    _imgBG              : null,         // 头像背景图片
    _labelName          : null,         // 玩家昵称
    _cards              : null,         // 手牌对象

    ctor : function (node) {
        this._node = node;
        this._originalPos = this._node.getPosition();
        this._init();
        return true;
    },

    _init : function () {
        this._imgVS = game.findUI(this._node, "IMG_VS");
        this._imgBG = game.findUI(this._node, "IMG_BG");
        this._labelName = game.findUI(this._node, "TXT_Name");
        this._cards = game.findUI(this._node, "ND_Cards");
    },

    reset : function () {
        this.showContent(false);
    },

    show : function (bool) {
        this._node.setVisible(bool);
    },
    
    showContent : function (bool) {
        this._imgBG.setVisible(bool);
        this._labelName.setVisible(bool);
        this._cards.setVisible(bool);
    },

    /**
     * 设置信息
     * @param info
     */
    setInfo : function (info) {
        if (info) {
            var name = info.name;
            if (name.length > 5) {
                name = name.substring(0, 4) + "...";
            }
            this._labelName.setString(name);
        }
    },

    /**
     * 设置位置
     * @param position
     */
    setPosition : function (position) {
        this._node.setPosition(position);
    },

    /**
     * 移动回原位置
     * @param time
     * @param isRight
     * @param callback
     */
    moveToOriginalPosition : function (time, isRight, callback) {
        var move = cc.moveTo(time / 3, this._originalPos).easing(cc.easeBackInOut()).easing(cc.easeSineInOut());
        var x = isRight ? this._originalPos.x + 150 : this._originalPos.x - 150;
        var move2 = cc.moveTo(time / 3, x, this._originalPos.y);
        var fun = cc.CallFunc(function () {
            callback && callback();
        });
        this._node.runAction(cc.sequence(move, move2, move, fun));
    }
});
