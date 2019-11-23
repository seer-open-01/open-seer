/**
 * Created by lyndon on 2018/05/24.
 *  排行榜
 */
game.ui.RankWin = game.ui.PopupWindow.extend({
    _node               : null,         // 本弹窗节点
    _ndAnimate          : null,         // 动画节点
    _originalPos        : null,         // 原始位置

    _checks             : [],           // checkBox控件组
    _sv                 : null,         // 滚动容器
    _imgNoInfo          : null,         // 无排行信息图片
    _txtRank            : null,         // 排名文字
    _txtName            : null,         // 昵称文字
    _fntBean            : null,         // 金贝字z
    _items              : null,         // 子控件数组
    _loading            : null,         // 加载节点
    _circle             : null,         // 特效光圈
    _peach              : null,         // 特效图案

    _selfRank           : 0,            // 排名
    _ranks              : [],           // 排名数据
    _mode               : -1,           // 排行榜数据类型   1财富榜  2 战神榜
    _height             : 104,          // item的高度

    _playerInfoWinNode  : null,         // 玩家资料弹窗节点
    _playerInfoWin      : null,         // 玩家资料弹窗


    ctor: function () {
        this._super();
        this._node = ccs.load("res/Home/Rank/RankList.json").node;
        this._init();
        this.addChild(this._node);
        return true;
    },

    _init: function () {

        var btnClose = game.findUI(this._node, "BTN_Close");
        btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this.playHideAnimate();
                // game.UISystem.closeWindow(this);
                if (this._playerInfoWin) {
                    this._playerInfoWin.hideWithAction();
                }
            }
        }, this);

        var btnBack = game.findUI(this._node, "BTN_Back");
        btnBack.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this.playHideAnimate();
                // game.UISystem.closeWindow(this);
                if (this._playerInfoWin) {
                    this._playerInfoWin.hideWithAction();
                }
            }
        }, this);

        this._checks = [];
        var richSel = game.findUI(this._node, "CK_RichList");
        richSel.id = 1;

        var aresSel = game.findUI(this._node, "CK_AresList");
        aresSel.id = 2;

        this._checks.push(richSel);
        this._checks.push(aresSel);
        this._checks.forEach(function (sel) {sel.addEventListener(this.updateSelectSate, this)}.bind(this));

        this._sv = game.findUI(this._node, "ND_ScrollView");
        this._imgNoInfo = game.findUI(this._node, "ND_NoInfo");
        this._txtRank = game.findUI(this._node, "TXT_Ranking");
        this._txtName = game.findUI(this._node, "TXT_Name");
        this._fntBean = game.findUI(this._node, "Fnt_Bean");
        this._loading = game.findUI(this._node, "ND_Loading");
        this._circle = game.findUI(this._loading, "Loading_1");
        this._peach = game.findUI(this._loading, "Loading_2");

        this._ndAnimate = game.findUI(this._node, "ND_List");
        this._originalPos = this._ndAnimate.getPosition();

        this._playerInfoWinNode = game.findUI(this._node, "ND_InfoWin");

        // 自己的名字
        var name = game.DataKernel.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._txtName.setString(name);
        // 自己的金贝
        var bean = Utils.formatCoin(game.DataKernel.bean);
        this._fntBean.setString(bean);
        // 隐藏无排行信息图片
        this._imgNoInfo.setVisible(false);

        // this.updateSelectSate(this._checks[0], ccui.CheckBox.EVENT_SELECTED);

    },

    /**
     * 更新按钮状态
     * @param sender
     * @param type
     */
    updateSelectSate: function (sender, type) {
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            game.Audio.playBtnClickEffect();
            for (var i = 0; i < this._checks.length; ++i) {
                if(sender.id == i + 1){
                    this._checks[i].setEnabled(false);
                } else {
                    this._checks[i].setEnabled(true);
                    this._checks[i].setSelected(false);
                }
            }
            this._requireData(sender.id);
            if (this._playerInfoWin) {
                this._playerInfoWin.show(false);
            }
        }
    },
    /**
     * 请求数据
     * @param type 1.富豪榜 2.战神榜
     * @private
     */
    _requireData: function (type) {
        this.showLoading();
        game.hallNet.sendMessage(protocol.ProtoID.CLIENT_MIDDLE_RANK_LIST,{mod: type});
    },
    /**
     * 外部调用更新数据
     * @param data
     */
    updateRankList: function (data) {
        this._selfRank = data["rank"];
        this._ranks = data["ranks"];
        this._mode = data["mode"];
        // 自己的排名
        if (this._selfRank != 0) {
            this._txtRank.setString("第" + this._selfRank + "名");
        } else {
            this._txtRank.setString("未上榜");
        }

        this._loadScrollView();
    },
    /**
     * 加载滚动容器
     * @private
     */
    _loadScrollView: function () {
        this._sv.removeAllChildren();

        // 没有排行榜数据
        if (this._ranks.length < 1) {
            this._imgNoInfo.setVisible(true);
            this._sv.setInnerContainerSize(cc.size(360.0, 390));
            this.hideLoading();
            return;
        }
        this._imgNoInfo.setVisible(false);
        this._items = [];
        for (var i = 0; i < this._ranks.length; ++i) {
            this._ranks[i].index = i+1;
            var temp = new game.ui.RankItem(this._ranks[i],this._mode);
            this._items.push(temp.getNode());
        }

        this._layOut();
    },
    /**
     * 布局UI
     * @private
     */
    _layOut: function () {
        var contentHeight = this._items.length * this._height;
        contentHeight = Math.max(contentHeight, 390.0);
        this._sv.setInnerContainerSize(cc.size(360.0, contentHeight));
        this._sv.scrollToTop(0.2, true);
        var posY = contentHeight;
        for (var i = 0; i < this._items.length; ++i) {
            posY -= this._height;
            this._items[i].setPositionY(posY);
            this._sv.addChild(this._items[i]);
        }
        this.hideLoading();
    },
    /**
     * 显示loading动画
     */
    showLoading: function () {
        this._loading.setVisible(true);
        this._circle.stopAllActions();
        this._circle.runAction(cc.RotateBy(1.0, 360).repeatForever());

        this._peach.stopAllActions();
        this._peach.runAction(cc.Sequence(cc.scaleTo(1.0, -1, 1), cc.scaleTo(1.0, 1, 1)).repeatForever());
    },
    /**
     * 隐藏loading动画
     */
    hideLoading: function () {
        this._circle.stopAllActions();
        this._peach.stopAllActions();
        this._loading.setVisible(false);
    },

    playShowAnimate: function (callback) {
        this._ndAnimate.stopAllActions();
        var doMove = cc.MoveTo(0.4, cc.pAdd(this._originalPos, cc.p(380, 0))).easing(cc.easeIn(0.4));
        var doCall = cc.CallFunc(function () {
            callback && callback();
            this.updateSelectSate(this._checks[0], ccui.CheckBox.EVENT_SELECTED);
        }, this);

        this._ndAnimate.runAction(cc.Sequence(doMove, doCall));
    },

    playHideAnimate: function () {
        this._ndAnimate.stopAllActions();
        var doMove = cc.MoveTo(0.1, cc.p(this._originalPos));
        var doCall = cc.CallFunc(function () {
            game.UISystem.closeWindow(this);
        }, this);

        this._ndAnimate.runAction(cc.Sequence(doMove, doCall));
    },

    getPlayerInfoWin: function () {
        if (this._playerInfoWin == null) {
            this._playerInfoWin = new game.ui.RankInfoWin(this._playerInfoWinNode);
        }
        return this._playerInfoWin;
    }

});

game.ui.RankWin.popup = function () {
    var win = new game.ui.RankWin();
    game.ui.RankWin.inst = win;
    game.UISystem.showWindow(win);
    game.ui.RankWin.inst.playShowAnimate();
};
game.ui.RankWin.inst = null;