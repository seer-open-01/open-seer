/**
 * Created by lyndon on 2017.11.24.
 */
GameWindowDouDiZhu.UserInfo = cc.Class.extend({

    _node           : null,
    _index          : -1,
    //===公有节点===
    _uiInfoBG       : null,     // 背景
    _uiHeadPic      : null,     // 头像图片
    _uiBean         : null,     // 玩家金贝
    _uiBeanBG       : null,     // 玩家金贝背景
    _uiZanLi        : null,     // 暂离图片
    _uiOffline      : null,     // 离线图片
    // _uiDealer       : null,     // 庄图片

    //===本玩家特有节点===
    _uiBtn          : null,     // 快速充值按钮

    //===其他玩家特有节点===
    _uiName         : null,     // 玩家名字

    ctor: function (node, index) {
        this._node = node;
        this._index = index;
        this._init();

        return true;
    },

    _init: function () {
        this._uiHeadPic = new GameWindowBasic.GameHeadPic(game.findUI(this._node, "ND_HeadPic"));

        this._uiInfoBG = game.findUI(this._node, "BG_Player");

        this._uiBean = game.findUI(this._node, "ND_Bean");
        //this._uiBeanBG = game.findUI(this._node, "BG_Bean");

        this._uiZanLi = game.findUI(this._node, "ND_ZanLi");
        this._uiOffline = game.findUI(this._node, "ND_Offline");
        // this._uiDealer = game.findUI(this._node, "ND_Dealer");

        this._uiBtn = null;
        if (this._index == 1) {
            this._uiBtn = game.findUI(this._node, "BTN_Charge");
        } else {
            this._uiName = game.findUI(this._node, "ND_Name");
        }
    },

    reset: function () {
        this.setHeadPic("");
        this.setName("");
        this.setBean(0);
        this.showOffline(false);
        this.showZanLi(false);
        this.showDealer(false);
        this.showChargeBtn(false);
    },
    /**
     * 设置头像
     * @param headPic
     */
    setHeadPic: function (headPic) {
        // cc.log("========================= " + headPic);
        this._uiHeadPic.setHeadPic(headPic);
    },
    /**
     * 设置名字
     * @param name
     */
    setName: function (name) {
        if (this._uiName == null) {
            return;
        }
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._uiName.setString(name);
    },
    /**
     * 设置金贝
     */
    setBean: function (bean) {
        //this._uiBeanBG.setVisible(true);
        bean = Utils.formatCoin(bean);
        this._uiBean.setString("" + bean);
    },
    /**
     * 设置离线标志
     * @param vis
     */
    showDealer: function (vis) {
        // this._uiDealer.setVisible(vis);
    },
    /**
     * 设置离线标志
     * @param vis
     */
    showOffline: function (vis) {
        this._uiOffline.setVisible(vis);
    },
    /**
     * 显示暂离
     * @param vis
     */
    showZanLi: function (vis) {
        this._uiZanLi.setVisible(vis);
    },
    /**
     * 显示充值按钮
     * @param show
     */
    showChargeBtn: function (show) {
        if (this._uiBtn == null) {
            return;
        }
        this._uiBtn.setVisible(show);
        this._uiBtn.setTouchEnabled(show);
    },
    /**
     * 注册头像点击回调
     * @param callback
     */
    registerHeadPicClick: function (callback) {
        this._uiHeadPic.setClickedHandler(callback);
    },
    /**
     * 注册充值点击回调
     * @param callback
     */
    registerChargeClick: function (callback) {
        if (this._uiBtn == null) {
            return;
        }
        this._uiBtn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this)
    },
    /**
     * 显示本节点
     * @param vis
     */
    setVisible: function (vis) {
        this._node.setVisible(vis);
    }
});