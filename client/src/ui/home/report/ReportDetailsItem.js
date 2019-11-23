/**
 * Created by fuyang on 2018/10/24.
 */

//麻将 斗地主 房卡场，战绩详情预制体
game.ui.ReportDetailsItem = cc.Class.extend({
    _node               : null,

    _data               : null,

    _fntRound           : null,               //局数字体

    _players            : [],                 //玩家信息数组

    _roundIndex         : -1,                 //局数

    ctor: function (key,data) {
        this._node = ccs.load("res/Home/Report/ReportItem_5.json").node;
        this._data = data;
        this._roundIndex = key;
        this._init();
        return true;
    },
    _init: function () {

        this._fntRound = game.findUI(this._node,"FNT_Round");
        this._players = [];
        var temp = null;
        for (var i = 1; i <= 4; i++) {
            temp = new game.ui.ReportDetailsPlayer(game.findUI(this._node, "ND_Player_" + i));
            this._players.push(temp);
        }
        this._data && this._setInfo();
    },
    _setInfo: function () {
        if(this._roundIndex < 10){
            this._fntRound.setString("0" + this._roundIndex);
        }
        else{
            this._fntRound.setString(this._roundIndex);
        }
        var dealer = 0;
        var players = [];
        for(var key in this._data){
            if(this._data.hasOwnProperty(key)){
              if(key == "dealer"){
                  dealer = this._data[key];
              }else{
                  players.push(this._data[key]);
              }
            }
        }
        // 玩家
        for (var i = 0; i < this._players.length; ++i) {
            if(i >= players.length ){
                this._players[i].reset();
            }else{
                this._players[i].setInfo(players[i], dealer);
                this._players[i].show(true);
            }
        }
        this._layOut(players.length);
    },
    //布局 根据人数布局，2人麻将 还是4人麻将 3人斗地主
    _layOut:function(length){
      if(length == 2){
        this._players[0].getNode().setPositionX(300);
        this._players[1].getNode().setPositionX(600);
        this._players[2].show(false);
        this._players[3].show(false);
      }
      //斗地主用的
      else if(length == 3){
          this._players[0].getNode().setPositionX(240);
          this._players[1].getNode().setPositionX(470);
          this._players[2].getNode().setPositionX(700);
          this._players[3].show(false);
      }
      else{

      }
    },
    getNode: function () {
        return this._node;
    }
});
