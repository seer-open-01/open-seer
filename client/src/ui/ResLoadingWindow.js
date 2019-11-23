// ==== 资源加载窗口 ====================================================

game.ui.ResLoadingWindow = cc.Layer.extend({

    _node           : null,     // UI层

    _loadingBar     : null,  // 进度条

    ctor : function () {
        this._super();

        // 加载UI控件
        this._node = ccs.load("res/ResLoading/ResLoading.json").node;
        this.addChild(this._node);
        this._init();

        return true;
    },

    _init : function () {
        // 进度条
        this._loadingBar = game.UIHelper.findChildByName(this._node, "PGBAR_Loading");
    },

    /**
     * 设置进度
     * @param value
     */
    setPercentage: function(value) {
        if (value < 3) {
            value = 3;
        } else if (value > 97) {
            value = 97;
        }
        this._loadingBar.setPercent(value);
    }
});
