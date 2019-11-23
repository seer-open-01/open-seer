/**
 * Created by lyndon on 2018/05/24.
 *  一条排行信息
 */
game.ui.RankItem = cc.Class.extend({
    _parentNode             : null,
    _node                   : null,

    _data                   : null, // 玩家数据
    _ndHead                 : null, // 头像
    _txtName                : null, // 名字文字
    _txtId                  : null, // uid
    _fntRank                : null, // 排行字
    _fntBean                : null, // 金贝数
    _beanBg                 : null, // 金贝的背景  测试大大要求战神榜隐藏金贝显示，所以需要这个控件
    _mode                   : null, // 当前预制体的排行榜类型  1财富榜 2战神榜

    ctor: function (data,mode) {
        this._parentNode = ccs.load("res/Home/Rank/RankItem.json").node;
        this._node = game.findUI(this._parentNode, "BTN_Item");
        this._node.removeFromParent(false);
        this._data = data;
        this._mode = mode;
        this._init();

        return true;
    },

    _init: function () {

        this._node.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._onHeadClick(sender, type);
            }
        }, this);

        this._ndHead = game.findUI(this._node, "ND_Head");
        this._txtName = game.findUI(this._node, "TXT_Name");
        this._txtId = game.findUI(this._node, "TXT_Id");
        this._fntRank = game.findUI(this._node, "FNT_Ranking");
        this._fntBean = game.findUI(this._node, "FNT_Bean");
        this._beanBg = game.findUI(this._node,"BG_Bean");
        this._data && this._setInfo();
    },

    _setInfo: function () {
        // 名次
        var index = this._data.index;
        if (index == 1 ) {
            index = "y";
        }else if (index == 2) {
            index = "e";
        }else if (index == 3) {
            index = "s"
        }
        this._fntRank.setString(""+ index);
        // 昵称
        var name = this._data.name;
        if (name.length > 5) {
            name = name.substring(0, 4) + "...";
        }
        this._txtName.setString(name);
        // 头像
        var headPic = this._data.headPic;
        if (headPic && headPic != "") {
            cc.textureCache.addImageAsync(headPic, function(tex) {
                tex && this._ndHead.setTexture(tex);
                this._ndHead.setScale(0.86, 0.9);
                this._ndHead.setPositionY(50 + 1);
            }.bind(this), this);
        } else {
            this._ndHead.setTexture("res/Common/Images/Com_HeadpicDef.png");
            this._ndHead.setScale(1);
            this._ndHead.setPositionY(50);
        }
        // Id
        var id = "ID:" + this._data.uid;
        this._txtId.setString(id);

        //战神榜在玩家信息预制体的时候隐藏金贝显示
        if(2 == this._mode){
            this._beanBg.setVisible(false);
            this._fntBean.setVisible(false);
            //调整名字 ID 文本的Y轴布局
            var namePosY = this._txtName.getPositionY();
            var idPosY = this._txtId.getPositionY();
            var offY = 13;
            this._txtName.setPositionY(namePosY - offY);
            this._txtId.setPositionY(idPosY - offY - 4 );
        }else {
            var bean = Utils.formatCoin(this._data.bean);
            this._fntBean.setString(bean);
        }
    },

    _onHeadClick: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            cc.log("排行榜点击了第 " + this._data.index + "玩家 " + JSON.stringify(this._data));
            var infoWin = game.ui.RankWin.inst.getPlayerInfoWin();
            infoWin.setInfo(this._data);
            infoWin.showWithAction();
        }
    },

    getNode: function () {
        return this._node;
    }
});