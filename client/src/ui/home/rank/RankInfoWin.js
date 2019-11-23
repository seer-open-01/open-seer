/**
 * Created by lyndon on 2018/05/25.
 *  排行榜玩家资料弹窗
 */
game.ui.RankInfoWin = cc.Class.extend({
    _parentNode         : null, // 父节点
    _node               : null, // 本节点

    _ndHead             : null, // 头像节点
    _ndMale             : null, // 性别男节点
    _ndFemale           : null, // 性别女节点
    _txtName            : null, // 名字文字
    _txtId              : null, // id文字
    _fntCard            : null, // 房卡文字
    _fntBean            : null, // 金贝文字

    ctor: function (node) {
        this._node = ccs.load("res/Home/Rank/RankPlayerInfo.json").node;
        this._parentNode = node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },

    _init: function () {

        var btnClose = game.findUI(this._node, "BTN_Close");
        btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this.hideWithAction();
            }
        }, this);

        this._ndHead = game.findUI(this._node, "ND_Head");
        this._ndMale = game.findUI(this._node, "ND_Male");
        this._ndFemale = game.findUI(this._node, "ND_Female");
        this._txtName = game.findUI(this._node, "TXT_Name");
        this._txtId = game.findUI(this._node, "TXT_ID");
        this._fntCard = game.findUI(this._node, "Fnt_Card");
        this._fntBean = game.findUI(this._node, "Fnt_Bean");
    },

    show: function (bool) {
        this._node.setVisible(bool);
    },

    showWithAction: function () {
        this._node.setOpacity(0);
        this._node.setVisible(true);
        this._node.stopAllActions();
        this._node.runAction(cc.Sequence(cc.fadeIn(0.4), cc.CallFunc(function () {

        }, this)))
    },

    hideWithAction: function () {
        this._node.stopAllActions();
        this._node.runAction(cc.Sequence(cc.fadeOut(0.2), cc.CallFunc(function () {
            this._node.setVisible(false);
        }, this)))
    },
    setInfo: function (data) {
        // 头像
        var headPic = data.headPic;
        if (headPic && headPic != "") {
            cc.textureCache.addImageAsync(headPic, function(tex) {
                tex && this._ndHead.setTexture(tex);
                this._ndHead.setScale(0.96);
                // this._ndHead.setPositionY(350);
            }.bind(this), this);
        } else {
            this._ndHead.setTexture("res/Home/Rank/Images/IMG_HeadPicDef.png");
            this._ndHead.setScale(1);
            // this._ndHead.setPositionY(350);
        }
        // 性别
        var sex = data.sex;
        if (sex == 1) {
            this._ndMale.setVisible(true);
            this._ndFemale.setVisible(false);
        } else {
            this._ndMale.setVisible(false);
            this._ndFemale.setVisible(true);
        }
        // 昵称
        var name = data.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._txtName.setString(name);
        // Id
        var id = "ID:" + data.uid;
        this._txtId.setString(id);
        // 房卡金贝钻石
        var bean = Utils.formatCoin(data.bean);
        this._fntBean.setString(bean);
        this._fntCard.setString(data.card);
    }
});