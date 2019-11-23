/**
 * Created by lyndon on 2018.04.18.
 *
 *  大厅--帮助界面弹窗
 */
game.ui.HelpWin = game.ui.PopupWindow.extend({

    _node           : null,
    //=== 控件 ===
    _btnClose       : null,             // 关闭按钮
    _sv             : null,             // 滚动容器
    _btns           : [],               // 按钮组
    _ndContent      : null,             // 说明内容节点
    //=== 数据 ===
    _gameType       : 0,                // 游戏类型（0常见问题 1麻将 2斗地主 3象棋 4拼三张 5拼十 ）
    _subType        : 0,                // 游戏模式

    ctor: function (gameType, subType) {
        this._super();

        this._node = ccs.load("res/Home/Help/Help.json").node;
        this.addChild(this._node);

        this._gameType = gameType || 0;
        this._subType = subType || 0;

        this._init();

        return true;
    },

    _init: function () {
        // 关闭按钮
        this._btnClose = game.findUI(this._node, "BTN_Close");
        this._sv = game.findUI(this._node, "ScrollView");
        // 页签按钮组
        this._btns = [];
        var temp = null;
        for (var index = 1; index <= 9; ++index) {
            temp = game.findUI(this._sv, "BTN_00" + index);
            if (temp) {
                temp.id = index - 1;
                this._btns.push(temp);
            }
        }
        // 帮助内容节点
        this._ndContent = game.findUI(this._node, "ND_Content");
        // 注册按钮点击
        this.registerBtnClick();
        // 设置初始状态
        this.setBtnSelect(this._gameType)
    },
    // 设置页签按钮状态
    setBtnSelect: function (id) {
        for (var i = 0; i < this._btns.length; ++i) {
            this._btns[i].setEnabled(this._btns[i].id != id);
        }
        this.switchItem(1 + id);
    },
    // 切换内容页
    switchItem: function(index){
        cc.log("==>显示帮助的第 " + index + "页");
        this._ndContent.removeAllChildren();
        this._ndContent.addChild(ccs.load("res/Home/Help/ND_Content_00" + index + ".json").node);
        if (index == 4 || index == 8) {
            this._sv.scrollToBottom(0.1, true);
        }else {
            this._sv.scrollToTop(0.1, true);
        }
    },
    // 注册按钮点击
    registerBtnClick: function () {
        for (var i = 0; i < this._btns.length; ++i) {
            this._btns[i].addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    game.Audio.playBtnClickEffect();
                    this.setBtnSelect(sender.id);
                }
            }, this)
        }

        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this)
    }
});
// 帮助界面弹出
game.ui.HelpWin.popup = function (gameType, subType) {
    var win = new game.ui.HelpWin(gameType, subType);
    game.UISystem.popupWindow(win);
};

game.ui.HelpWin.Item = function(selItem,node,mjid){
    var uiNode = ccs.load("res/Home/Help/ND_Content_00"+ selItem +".json").node;
    node.addChild(uiNode);

    var xzddtip = game.findUI(uiNode,"ND_Content_1");
    var srftip = game.findUI(uiNode,"ND_Content_2");
    srftip.setVisible(false);
    var sel = [];
    sel[0] = { ctrl: game.findUI(uiNode, "CheckBox_1"), value : 1 };
    sel[1] = { ctrl: game.findUI(uiNode, "CheckBox_2"), value : 2 };

    this.switchItem = function(selItem){
        cc.log("==>玩家选中麻将了 " + selItem.value);
        if (selItem.value == 1) {
            xzddtip.setVisible(true);
            srftip.setVisible(false);
        } else{
            xzddtip.setVisible(false);
            srftip.setVisible(true);
        }
    };

    var checkSelGroup = new game.ui.RadioGroup("查看", sel, mjid, this.switchItem.bind(this));
    this.switchItem(sel[mjid]);

};
