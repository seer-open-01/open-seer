/**
 * Created by lyndon on 2018.04.17.
 *
 *  大厅--客服界面弹窗
 */
game.ui.KeFuWindow = game.ui.PopupWindow.extend({

    _node           : null,

    //=== 控件 ===
    _btnClose       : null,             // 关闭按钮

    //=== 数据 ===
    _numWX          : "",               // 微信号
    _numGZH         : "",               // 公众号


    //=== 分页 ===
    _ServicePage   : null,             // 客服页对象
    _FeedBackPage  : null,             // 反馈页对象

    //=== 按钮 ===
    _checks        : [],               // checkBox控件组
    _pageArray     : [],               // 管理页面的数组

    ctor: function () {
        this._super();

        this._node = ccs.load("res/Home/CustomerService/CustomerService.json").node;
        this.addChild(this._node);
        this._numWX = game.DataKernel.kfWechat || "";
        this._numGZH = game.DataKernel.publicWechat || "";
        this._init();

        return true;
    },

    _init: function(){

        this._btnClose = game.findUI(this._node, "BTN_Close");
        //复选框
        this._checks = [];
        var CK_Service = game.findUI(this._node, "CK_KeFu");
        CK_Service.id = 1;
        var CK_FeedBack = game.findUI(this._node, "CK_FanKui");
        CK_FeedBack.id = 2;
        this._checks.push(CK_Service);
        this._checks.push(CK_FeedBack);
        //注册点击事件
        this._checks.forEach(function (sel) {sel.addEventListener(this.updateSelectSate, this)}.bind(this));

        //页面UI
        this._pageArray = [];
        var servicePage = game.findUI(this._node,"ND_Page1");
        var feedBackPage = game.findUI(this._node,"ND_Page2");
        this._pageArray.push(servicePage);
        this._pageArray.push(feedBackPage);

        //页对象
        this._ServicePage = new game.ui.ServicePage(this._pageArray[0],this._numWX,this._numGZH);
        this._FeedBackPage = new game.ui.FeedBackPage(this._pageArray[1]);

        //绑定事件
        this.registerBtnClick();
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
            //根据被选中的按钮ID显示对应的页面
            this.switchItem(sender.id);
        }
    },
    // 切换内容页
    switchItem: function(index){
        cc.log("==>显示客服第 " + index + "页");
        //客服页
        if(1 === index){
            this._ServicePage._uinode.setVisible(true);
            this._FeedBackPage._uinode.setVisible(false);
        }
        //反馈页
        else if(2 === index){
            this._ServicePage._uinode.setVisible(false);
            this._FeedBackPage._uinode.setVisible(true);
        }
        else{
            cc.log("==>页数出错第 " + index + "页");
        }
    },

    //每次默认窗口打开第一页
    showPageOne:function () {
        this.updateSelectSate(this._checks[0],ccui.CheckBox.EVENT_SELECTED);
    },

    // 注册按钮点击
    registerBtnClick: function () {
        this._btnClose.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
            }
        }, this);
    }
});


game.ui.KeFuWindow.popup = function (numWX, numGZH) {
    var win = new game.ui.KeFuWindow(numWX, numGZH);
    win.showPageOne();
    game.UISystem.popupWindow(win);
};
//客服界面
game.ui.ServicePage = cc.Class.extend({

    _uinode         : null,             //当前节点

    //=== 控件 ===

    _btnWX          : null,             // 微信号按钮
    _btnGZH         : null,             // 公众号按钮
    _labelWX        : null,             // 微信号标签
    _labelGZH       : null,             // 公众号标签

    //=== 数据 ===
    _numWX          : "",               // 微信号
    _numGZH         : "",               // 公众号
    _strCopy        : "",               // 已拷贝的字符串


    ctor:function(node,numWX, numGZH){

        this._uinode = node;

        this._numWX = numWX;
        this._numGZH = numGZH;
        this._init();
        return true;

    },
    _init:function(){

        //var  Node = game.findUI(th)
        this._btnWX = game.findUI(this._uinode, "BTN_WeChat");
        this._btnGZH = game.findUI(this._uinode, "BTN_GZH");
        this._labelWX = game.findUI(this._uinode, "ND_WeChat");
        this._labelWX.setString(this._numWX);
        this._labelGZH = game.findUI(this._uinode, "ND_GZH");
        this._labelGZH.setString(this._numGZH);

        this.registerBtnClick();
    },
    // 注册按钮点击
    registerBtnClick: function () {

        this._btnWX.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._strCopy = this._numWX;
                this.onCopy(this._numWX);
            }
        }, this);

        this._btnGZH.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                this._strCopy = this._numGZH;
                this.onCopy(this._numGZH);
            }
        }, this);
    },
    // 复制点击的内容
    onCopy : function(){
        game.ui.HintMsg.showTipText( "已复制到粘贴板",cc.p(640,220),3);
        Platform.setClipStr(this._strCopy);
    },

});

//反馈界面
game.ui.FeedBackPage = cc.Class.extend({

    _uinode         : null,             //当前节点

    _btnTiJiao      : null,             //提交按钮

    _ndInput        : null,             //输入框

    _InputMaxNum    : 0   ,             //输入框最大输入的内容个数

    ctor:function(node){

        this._uinode = node;
        this._init();
        return true;
    },
    _init:function(){

        this._InputMaxNum = 150;
        this._btnTiJiao = game.findUI(this._uinode, "BTN_TiJiao");
        this._ndInput = game.findUI(this._uinode,"ND_Input");
        this._ndInput.setString("");

        //设置占位文本字体颜色
        this._ndInput.setPlaceHolderColor(cc.color(255,255,255,150));

        this._btnTiJiao.addTouchEventListener(function(sender,type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();

                //效验输入合法不
                //1消息体不能为空
                //2长度150个字
                var inputmsg = this._ndInput.getString().trim();
                if(inputmsg == ""){
                    game.ui.HintMsg.showTipText("反馈内容不能为空，请重新输入再提交反馈",cc.p(640, 360), 2);
                    return;
                }
                if(this._ndInput.getString().length > this._InputMaxNum ){
                    game.ui.HintMsg.showTipText("请限定反馈内容在150字以内",cc.p(640, 360), 2);
                    return;
                }
                //发送反馈消息
                game.hallNet.sendMessage(protocol.ProtoID.CLIENT_SUBMISSION_FEEDBACK_MSG,{content: this._ndInput.getString()});
            }
        },this);
    },
});