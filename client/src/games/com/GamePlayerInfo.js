/**
 * Created by Jiyou Mo on 2017/11/8.
 */
// 游戏中玩家头像点击弹窗
game.ui.GamePlayerInfo = game.ui.PopupWindow.extend({

    _node               : null,         // 本节点

    _index              : null,         // 该玩家的座位号

    _btnClose           : null,         // 关闭按钮

    _headPic            : null,         // 头像控制对象

    _spMale             : null,         // 男标志
    _spFemale           : null,         // 女标志

    _labelName          : null,         // 玩家昵称
    _labelId            : null,         // 玩家的ID
    _labelIp            : null,         // 玩家IP

    _fntCards           : null,         // 玩家当前的房卡数量
    _fntBean            : null,         // 玩家当前的金贝数量

    _imgCards           : null,         // 房卡背景图片
    _imgBean            : null,         // 金币背景图片

    _btnArray           : null,         // 礼品表情按钮数组
    _btnQinZui          : null,         // 亲嘴按钮
    _btnYeZi            : null,         // 椰子按钮
    _btnHua             : null,         // 花按钮
    _btnZhaDan          : null,         // 炸弹按钮
    _btnDaoJiu          : null,         // 倒酒按钮
    _btnKick            : null,         // 踢出按钮

    ctor : function () {
        this._super();

        // 加载UI控件
        this._node = ccs.load("res/Games/ComWindow/PlayerInfo/GamePlayerInfo.json").node;
        this.addChild(this._node);

        this._init();

        return true;
    },

    _init : function () {
        var uiNode = game.findUI(this._node, "ND_PopWin");
        // 关闭按钮
        this._btnClose = game.findUI(uiNode, "BTN_Close");
        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this);

        this._headPic = new GameWindowBasic.GameHeadPic(game.findUI(uiNode, "ND_HeadPic"));
        this._labelName = game.findUI(uiNode, "TXT_Name");
        this._labelId = game.findUI(uiNode, "TXT_ID");
        this._labelIp = game.findUI(uiNode, "TXT_IP");
        this._fntCards = game.findUI(uiNode, "FNT_Cards");
        this._fntBean = game.findUI(uiNode, "FNT_Bean");

        this._imgCards =  game.findUI(uiNode, "IMG_Cards");
        this._imgBean = game.findUI(uiNode, "IMG_Bean");

        this._spMale = game.findUI(uiNode, "SP_Male");
        this._spFemale = game.findUI(uiNode, "SP_Female");
        this._btnKick = game.findUI(uiNode, "BTN_Kick");

        this._btnArray = [];
        this._btnQinZui = game.findUI(uiNode, "BTN_QinZui");
        this._btnQinZui.type = GameGift.Type.QinZui;
        this._btnYeZi = game.findUI(uiNode, "BTN_YeZi");
        this._btnYeZi.type = GameGift.Type.YeZi;
        this._btnHua = game.findUI(uiNode, "BTN_Hua");
        this._btnHua.type = GameGift.Type.Hua;
        this._btnZhaDan = game.findUI(uiNode, "BTN_ZhaDan");
        this._btnZhaDan.type = GameGift.Type.ZhaDan;
        this._btnDaoJiu = game.findUI(uiNode, "BTN_DaoJiu");
        this._btnDaoJiu.type = GameGift.Type.DaoJiu;
        this._btnArray.push(this._btnQinZui);
        this._btnArray.push(this._btnYeZi);
        this._btnArray.push(this._btnHua);
        this._btnArray.push(this._btnZhaDan);
        this._btnArray.push(this._btnDaoJiu);

        for (var i = 0; i < this._btnArray.length; ++i) {
            this._btnArray[i].addTouchEventListener(this._giftBtnClicked, this);
        }
    },

    reset : function () {
        this._labelName.setString("未找到名字");
        this._labelId.setString("未找到ID");
        this._labelIp.setString("未找到IP");
        this._fntBean.setString("");
        this._fntCards.setString("未找到房卡值");
        this._showGender(1);
        this._index = -1;
        this._setGiftBtnEnabled(false);
    },

    /**
     * 玩家的座位索引
     * @param index
     */
    setInfo : function (index) {
        this._index = index;
        var gameData = game.Procedure.getProcedure().getGameData();
        var playerData = gameData.players[index];
        cc.log("playerData: " +  JSON.stringify(playerData));
        if (playerData) {
            this._headPic.setHeadPic(playerData.headPic);
            this._showGender(playerData.sex);
            var name = playerData.name;
            if (name.length > 5) {
                name = name.substring(0, 4) + "...";
            }
            this._labelName.setString(name);
            this._labelId.setString("ID:" + playerData.uid);
            this._labelIp.setString("IP:" + playerData.ip);
            this._labelIp.setVisible(false);
            this._fntCards.setString(playerData.card + "");
            var bean = Utils.formatCoin(playerData.bean);
            this._fntBean.setString(bean);
            this._setGiftBtnEnabled(index != gameData.playerIndex);
        } else {
            this.reset();
        }
        // 踢出按钮
        var show = (gameData.creator == game.DataKernel.uid) && (playerData.uid != game.DataKernel.uid);
        this._btnKick.setVisible(show);
        this._btnKick.setEnabled(show);
        this._btnKick.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.gameNet.sendMessage(protocol.ProtoID.GAME_KICK_PEOPLE, {
                    uid: game.DataKernel.uid,
                    roomId: gameData.roomId,
                    target: playerData.uid
                });

                game.UISystem.closeWindow(this);
            }
        }, this);
    },

    /**
     * 显示性别
     * @param gender 性别的值   1显示男  反之显示女
     */
    _showGender : function (gender) {
        this._spMale.setVisible(gender == 1);
        this._spFemale.setVisible(gender != 1);
    },

    /**
     * 设置按钮是否生效
     * @param bool
     * @private
     */
    _setGiftBtnEnabled : function (bool) {
        for (var i = 0; i < this._btnArray.length; ++i) {
            this._btnArray[i].setEnabled(bool);
        }
    },

    /**
     * 礼物按钮被点击回调
     * @param sender
     * @param type
     * @private
     */
    _giftBtnClicked : function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
            game.Audio.playBtnClickEffect();
            game.UISystem.closePopupWindow(this);
            cc.log("点击了礼物赠送按钮：" + sender.type);
            game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_SEND_GIFT, {
                uid             : game.DataKernel.uid,
                roomId          : game.DataKernel.roomId,
                targetIndex     : this._index,
                giftId          : sender.type
            });
        }
    }
});

/**
 * 玩家头像框点击弹出
 * @param playerIndex   玩家的座位索引
 */
game.ui.GamePlayerInfo.popup = function(playerIndex) {
    var wnd = new game.ui.GamePlayerInfo();
    wnd.setInfo(playerIndex);
    game.UISystem.popupWindow(wnd);
};
