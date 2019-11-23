// ==== 更新界面UI ==================================================================================

game.ui.UpdateWindow = cc.Layer.extend({

    _uiLayer            : null,         // UI层

    _loadingBar         : null,         // 进度条
    _loadingInfo        : null,         // 加载信息

    ctor : function () {
        this._super();

        // 加载UI控件
        this._uiLayer = ccs.load("res/Update/Update.json");
        this.addChild(this._uiLayer.node);
        this._init();

        return true;
    },

    _init : function () {
        // 进度条
        this._loadingBar = game.UIHelper.findChildByName(this._uiLayer.node, "PGBAR_Loading");
        // 加载信息
        this._loadingInfo = game.UIHelper.findChildByName(this._uiLayer.node, "TXT_Loading");
    },

    /**
     * 设置加载信息
     * @param info
     */
    setLoadingInfo : function(info) {
        this._loadingInfo.setString(info);
    },

    /**
     * 设置进度
     * @param value
     */
    setPercentage : function(value) {
        this._loadingBar.setPercent(value);
    }
});
