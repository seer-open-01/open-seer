/**
 * Created by fuyang on 2018/10/17.
 */

//玩家申请解散或者退出房间的时候，玩家信息的预制体
GameWindowMahjong.playerInfoItem = cc.Class.extend({
    _parentNode         : null,         // 父节点
    _node               : null,         // 本节点
    _headNode           : null,         // 头像节点
    _headPic            : null,         // 头像
    _name               : null,         // 名字
    _picOk              : null,         // 勾的图片
    _picNo              : null,         // X的图片
    _picWait            : null,         // 等待别人选择的图片
    _picShengQing       : null,         // 解散发出人显示申请解散的图片
    _data               : null,         // 这个玩家的数据信息
    _id                 : -1,           // 编号

    _requestindex       : -1,           // 本次解散的发起者


    ctor:function(requestindex,data,parentNode){
        this._requestindex = requestindex;
        this._data = data;
        this._parentNode = parentNode;
        this._id = 0;
        this._node = ccs.load("res/Games/Mahjong/Quit/PlayerInfo.json").node;
        this._init();
        this._parentNode.addChild(this._node);
        return true;
    },
    _init:function(){
        this._headNode = game.findUI(this._node, "PlayerHead");
        this._headPic = new GameWindowBasic.GameHeadPic(this._headNode);
        this._name = game.findUI(this._node,"PlayerName");
        this._picOk = game.findUI(this._node,"Pic_Ok");
        this._picNo = game.findUI(this._node,"Pic_No");
        this._picWait = game.findUI(this._node,"PIC_Wait");
        this._picShengQing = game.findUI(this._node,"PIC_ShengQing");
        //UI初始化以后的处理
        this.uiInitAfter();
    },
    //设置名字和头像
    _setInfo:function(){
        this._name.setString("" + this._data.name);
        this._headPic.setHeadPic(this._data.headPic);
        this._setPicStatus();
    },
    //设置图片的默认状态  解散发起者显示 “申请解散”， 其他玩家选择 “等待中”....
    _setPicStatus:function(){
        //为真代表是解散发起者
       if( this._requestindex == this._id){
           this._picWait.setVisible(false);
           this._picShengQing.setVisible(true);
       }else{
           this._picWait.setVisible(true);
           this._picShengQing.setVisible(false);
       }
    },
    //拒绝还是同意
    setFlag:function(flag){
        this._picOk.setVisible(flag);
        this._picNo.setVisible(!flag);
        this._picWait.setVisible(false);
    },
    //UI初始化以后
    uiInitAfter:function(){
        this._picOk.setVisible(false);
        this._picNo.setVisible(false);
        this._picWait.setVisible(false);
        this._picShengQing.setVisible(false);
    },
});