/**
 * Created by lyndon on 2018/06/11.
 *  战绩牌型
 */
game.ui.ReportPattern = cc.Class.extend({

    _node       : null,

    _pattern    : null,     // 牌型图片

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;

    },

    _init: function () {
        this._pattern = game.findUI(this._node, "Pattern");
    },

    reset: function () {
        this._pattern.setVisible(false);
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },

    /**
     * 显示牌型
     * @param pattern
     */
    showCardPattern: function (pattern) {
        this.show(true);
        this._pattern.setTexture(game.ui.ReportPattern.Path + pattern + ".png");
        this._pattern.setVisible(true);
    }
});

game.ui.ReportPattern.Path = "res/Home/Report/Image/poker/Report_Pattern_";