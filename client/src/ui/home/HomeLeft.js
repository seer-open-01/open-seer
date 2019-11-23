/**
 * Created by lyndon on 2018.04.16.
 *
 *  大厅左边UI控件
 *  1.馆主公告节点
 *  2.广告图节点
 *  3.排行榜点击事件绑定
 */
game.ui.HomeLeft = cc.Class.extend({

    _node               : null,

    _ndBanner           : null,         // 广告图节点
    _banner             : null,         // 广告版
    _btnRankList        : null,         // 排行榜按钮
    _btnHorn            : null,         // 大喇叭按钮
    _btnLb              : null,         // 聊呗按钮
    _horns              : [],           // 大喇叭消息数组

    ctor: function (node) {
        this._node = node;
        this._init();
        return true;
    },
    
    _init: function () {
        this._ndBanner = game.findUI(this._node, "ND_Banner");
        this._btnRankList = game.findUI(this._node, "BTN_RankList");
        this._banner = new game.ui.Banner(this._ndBanner);
        this._btnHorn = game.findUI(this._node, "Btn_Horn");
        this._btnLb = game.findUI(this._node, "BTN_LB");
        this._horns = [];
        for (var i = 1; i <= 3; ++i) {
            var temp = game.findUI(this._btnHorn, "txt_" + i);
            temp.setString("");
            this._horns.push(temp);
        }
    },

    // 排行榜点击
    onRankListClicked: function (callback) {
        this._btnRankList.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    // 大喇叭点击
    onHornClick: function (callback) {
        this._btnHorn.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },

    // 聊呗点击
    onLbClick: function (callback) {
        this._btnLb.addTouchEventListener(function (sender, type) {
            if (type == ccui.Widget.TOUCH_ENDED) {
                callback && callback();
            }
        }, this);
    },
    
    // 更新大喇叭
    updateHorns: function (data) {
        for (var i = 0; i < 3; ++i) {
            if (i < data.length) {
                var str = data[i]['name'] + ": " + data[i]['msg'];
                this._horns[i].setString(str);
                var width = this._horns[i].getAutoRenderSize().width;
                if (width < 324) {
                    continue;
                }
                while (width >= 324) {
                    width = this._horns[i].getAutoRenderSize().width;
                    str = str.substring(0, str.length - 1);
                    this._horns[i].setString(str);
                }
                str += "...";
                this._horns[i].setString(str);
            }else {
                this._horns[i].setString("");
            }
        }
    },

    _strLen: function (str) {
        var len = 0;
        for (var i=0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                len++;
            }
            else {
                len += 2;
            }
        }
        return len;
    }

});