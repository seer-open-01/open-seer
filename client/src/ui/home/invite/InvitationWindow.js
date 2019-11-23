/**
 * Created by Lyndon on 2019/07/02.
 */

game.ui.InvitationWindow = game.ui.PopupWindow.extend({

    _node       : null,

    _tittle     : null,   //标题图片
    _des        : null,   //描述图片
    _labelRule  : null,   //规则文本
    _labelField : null,   //场次文本
    _labelDiZhu : null,   //底注文本
    _labelZunRu : null,   //准入文本

    _callBack   : null,   //同意按钮的回调
    _data       : null,   //邀请的详细信息

    ctor: function (data, callback) {
        this._callBack = callback;
        this._data = data;
        this._super();
        this._node = ccs.load("res/Home/Invitation/InvitationWindow.json").node;
        this.addChild(this._node);
        this._init();
        return true;
    },

    _init: function () {

        this._tittle = game.findUI(this._node, "ND_Tittle");
        this._des = game.findUI(this._node, "ND_Txt");
        this._labelRule = game.findUI(this._node, "Fnt_Rule");
        this._labelField = game.findUI(this._node, "Fnt_Name");
        this._labelDiZhu = game.findUI(this._node, "Fnt_DZ");
        this._labelZunRu = game.findUI(this._node, "Fnt_ZR");

        // 按钮点击
        var btnRefuse = game.findUI(this._node, "BTN_Refuse");
        btnRefuse.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this._close();
            }
        }, this);
        var btnAccept = game.findUI(this._node, "BTN_Accept");
        btnAccept.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this._callBack && this._callBack();
                this._close();
            }
        }, this);

        // 初次更新UI
        this.updateWindow(this._data);
    },

    // 更新窗口UI
    updateWindow: function (data) {
        //解析数据
        this._data = data;
        var gameType = this._data.gameType || 0;
        var subType = this._data.subType || 0;
        var matchName = this._data.matchName || 0;
        var baseBean = this._data.baseBean || 0;
        var enterBean = this._data.enterBean || 0;

        // 标题和描述
        var file1 = "res/Home/Invitation/Images/Tittle_" + gameType + ".png";
        var file2 = "res/Home/Invitation/Images/Des_" + gameType + ".png";
        this._tittle.setTexture(file1);
        this._des.setTexture(file2);
        // 规则描述
        var rule = "";
        var isRule1 = subType == 1;
        switch (gameType) {
            case 1:
                rule = isRule1 ? "两人模式" : "四人模式";
                break;
            case 2:
                rule = isRule1 ? "普通模式  32倍封顶" : "不洗牌模式  64倍封顶";
                break;
            case 4:
                rule = isRule1 ? "普通模式" : "激情模式";
                break;
            case 5:
                rule = isRule1 ? "看牌抢庄" : "自由抢庄";
                break;
            case 7:
                rule = isRule1 ? "3人模式  1 2 4 6倍" : "4人模式  1 2 4 6倍";
                break;
        }
        this._labelRule.setString("" + rule);
        //设置对应场次
        var cc = MatchListConfig.getMatchNameStringByMatchName(matchName);
        this._labelField.setString(cc);
        // 底注和准入
        baseBean = Utils.formatCoin2(baseBean);
        enterBean = Utils.formatCoin2(enterBean);
        this._labelDiZhu.setString(" " + baseBean);
        this._labelZunRu.setString(" " + enterBean);
    },

    _close: function () {
        game.ui.InvitationWindow.inst = null;
        game.UISystem.closePopupWindow(this);
    }
});

//本窗口全局单例
game.ui.InvitationWindow.inst = null;

game.ui.InvitationWindow.popup = function (data, callback) {
    // 只要当前有弹窗 邀请弹窗则不被弹出
    if (!game.UISystem.haveNoPopupWindow()) {
        return;
    }

    if (null == game.ui.InvitationWindow.inst) {
        var win = new game.ui.InvitationWindow(data, callback);
        game.ui.InvitationWindow.inst = win;
        game.UISystem.popupWindow(win);
    } else {
        game.ui.InvitationWindow.inst.updateWindow(data);
    }
};
