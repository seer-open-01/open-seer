/**
 * Author       : lyndon
 * Date         : 2018-08-08
 * Description  : 象棋单条战绩控件
 */
game.ui.ChessReportItem = cc.Class.extend({
    _node               : null,

    _data               : null,         // 数据
    _labelRid           : null,         // 房间号
    _labelTime          : null,         // 时间
    _fntAdd             : null,         // 加分
    _fntMinus           : null,         // 减分

    ctor: function (data) {
        this._node = ccs.load("res/RoomCard/Report/ReportItem.json").node;
        this._data = data;
        this._init();
        return true;
    },

    _init: function () {

        this._labelTime = game.findUI(this._node, "ND_Time");
        this._labelRid = game.findUI(this._node, "ND_Rid");
        this._fntAdd = game.findUI(this._node, "Fnt_Add");
        this._fntMinus = game.findUI(this._node, "Fnt_Minus");
        this._fntAdd.setString("");this._fntAdd.setVisible(false);
        this._fntMinus.setString("");this._fntMinus.setVisible(false);

        this._data && this.setInfo();
    },

    setInfo: function () {
        // 时间戳
        var date = new Date(this._data["time"]);
        var str = date.format("yyyy-MM-dd          hh:mm:ss");
        this._labelTime.setString("" + str);
        // 房号
        this._labelRid.setString("房号:" + this._data.roomId);
        // 上下分
        this._setScore(this._data.playerInfo.roundBean);
    },

    /**
     * 设置分数
     * @param score
     * @private
     */
    _setScore: function (score) {
        if (score >= 0) {
            this._fntAdd.setString("+" + score);
            this._fntAdd.setVisible(true);
        }else {
            this._fntMinus.setString(score);
            this._fntMinus.setVisible(true);
        }
    },

    getNode: function () {
        return this._node;
    }
});