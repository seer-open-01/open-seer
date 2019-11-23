/**
 * Created by fuyang on 2018/10/24.
 */

//麻将房卡场战绩详情弹窗
game.ui.ReportDetailsWindow = game.ui.PopupWindow.extend({

    _node                  :   null,          //本节点
    _textDate              :   null,          //日期文本UI控件
    _textRoomNum           :   null,          //房间号码UI文本控件
    _btnClose              :   null,          //关闭按钮
    _sv                    :   null,          //列表滚动容器

    _items                 :   [],            //Item数组
    _height                :   106,           // Item高度
    _detailsReports        :   null,          //数据

    _loading               :   null,          // 加载节点
    _circle                :   null,          // 特效光圈
    _peach                 :   null,          // 特效图案


    ctor:function(){
        this._super();
        this._node = ccs.load("res/Home/Report/ReportDetails.json").node;
        this._init();
        this.addChild(this._node);
    },
    _init:function(){
        this._textDate = game.findUI(this._node,"Text_Date");
        this._textRoomNum = game.findUI(this._node,"Text_RoomNum");
        this._btnClose = game.findUI(this._node,"Btn_Close");
        this._btnClose.addTouchEventListener(function(sender,type){
            if(type == ccui.Widget.TOUCH_ENDED){
                game.Audio.playBtnClickEffect();
                game.ui.ReportDetailsWindow.inst = null
                game.UISystem.closePopupWindow(this);
            }
        },this);
        this._sv = game.findUI(this._node,"ND_SV");
        this._loading = game.findUI(this._node, "ND_Loading");
        this._circle = game.findUI(this._loading, "Loading_1");
        this._peach = game.findUI(this._loading, "Loading_2");
    },
    /**
     * 加载战绩详情数据
     * @param reports
     * @private
     */
    loadReports: function (msg) {
        this.showLoading();
        this._detailsReports = msg;
        if (this._detailsReports) {
            this._loadScrollView();
            this._setDateRoomNum();             //设置房间时间，房间号码
        }
    },
    /**
     * 加载滚动容器
     * @private
     */
    _loadScrollView: function () {
        this._sv.removeAllChildren();
        this._items = [];
        var detailsData = this._detailsReports.details;

        for(var key in detailsData){
            if(detailsData.hasOwnProperty(key)){
              var temp = null;
              temp = new game.ui.ReportDetailsItem(key,detailsData[key]);
                this._items.push(temp);
            }
        }
        this._layOut();
    },
    //战绩详情布局
    _layOut: function () {
        var contentHeight = this._items.length * this._height;
        contentHeight = Math.max(contentHeight, 389.00);
        this._sv.setInnerContainerSize(cc.size(808, contentHeight));
        this._sv.scrollToTop(0.2, true);
        var posY = contentHeight;
        for (var i = 0; i < this._items.length; ++i) {
            posY -= this._height;
            this._items[i].getNode().setPositionY(posY);
            this._sv.addChild(this._items[i].getNode());
        }
        this.hideLoading();
    },
    //设置日期，房间号码
    _setDateRoomNum:function(){
        var date = new Date(this._detailsReports["time"]);
        var str = date.format("yyyy-MM-dd  hh:mm");
        this._textDate.setString("时间:" + str);
        this._textRoomNum.setString("房间号:" + this._detailsReports.roomId);
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
    }
});
// 弹出方法
game.ui.ReportDetailsWindow.popup = function () {
    var win = new game.ui.ReportDetailsWindow();
    game.ui.ReportDetailsWindow.inst = win;
    game.UISystem.popupWindow(win);
};
game.ui.ReportDetailsWindow.inst = null;
