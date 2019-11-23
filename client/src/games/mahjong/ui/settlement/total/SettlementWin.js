/**
 * Created by fuyang on 2018/10/18.
 */

//麻将总结算窗口
GameWindowMahjong.Settlement = game.ui.PopupWindow.extend({

    _node                  : null,     //本节点
    _btnShare              : null,     //分享按钮
    _btnReturn             : null,     //返回按钮
    _textDate              : null,     //日期文本
    _textRound             : null,     //局数文本
    _textRoomNum           : null,     //房间编号文本
    _textDes               : null,     //健康游戏提示文本

    _uiPlayers             : null,     //玩家结算面板的UI控件管理数组

    _evHandler             : null,     //点击事件回调函数

    ctor:function(){
        this._super();
        this._node = ccs.load("res/Games/Mahjong/Settlement/TotalSettle/TotalSettleWin.json").node;
        this.addChild(this._node);
        this._init();
        return true;
    },
    _init:function(){

        this._btnReturn = game.findUI(this._node,"ND_Return");
        this._btnShare = game.findUI(this._node,"ND_Share");
        this._textDate = game.findUI(this._node,"Text_Date");
        this._textRound = game.findUI(this._node,"Text_Round");
        this._textRoomNum = game.findUI(this._node,"Text_RoomNum");
        this._textDes = game.findUI(this._node,"Text_Des");

        //玩家UI控件
        this._uiPlayers = [];
        var ndPlayer = game.findUI(this._node,"ND_Players");
        for(var i = 1; i <= 4; ++i ){
            var uiPlayer = new GameWindowMahjong.SettlementPlayer(game.findUI(ndPlayer, "ND_Player" + i));
            uiPlayer.setNodeVisible(false);
            this._uiPlayers.push(uiPlayer);
        }
        this._registerBtn();
    },
    //注册按钮事件
    _registerBtn:function(){
        this._btnShare.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                this._evHandler && this._evHandler();
            }
        }, this);
        this._btnReturn.addTouchEventListener(function(sender, type){
            if (type == ccui.Widget.TOUCH_ENDED) {
                game.Audio.playBtnClickEffect();
                game.UISystem.closePopupWindow(this);
                this._doExit();
            }
        }, this);
    },
    //设置回调函数
    setEventHandler: function(handler) {
        this._evHandler = handler;
    },
    //设置数据
    setInfo:function(data){
        var players = data.playerInfo;
        var endTime = data.endTime;
        var curRound = data.curRound;

        var winners = this._calcWinner(data);                      //大赢家的index
        var losers = this._calcLoser(data);                        //最佳炮手的index

        var idx = 0;
        for(var index in players){
            if(players.hasOwnProperty(index)){
              var playerInfo = players[index];
              var buildeInfo = this._buildPlayerInfo(playerInfo,winners,losers);
              if(buildeInfo){
                this._uiPlayers[idx].setNodeVisible(true);
                this._uiPlayers[idx].setInfo(buildeInfo);
                idx++;
              }
            }
        }
        this._setTextLabel(endTime,curRound);   //相关文本
        this._layOut();  //布局
    },
    //设置总结算界面的相关文本，包括 局数  房间号码  时间
    _setTextLabel:function(endTime,curRound){
        var gameData = game.procedure.Mahjong.getGameData();
        var date = new Date(endTime * 1000);
        var time = date.format("yyyy-MM-dd hh:mm");
        this._textDate.setString("" + time );
        this._textRound.setString("局数: " + curRound + "/" + gameData.round);
        this._textRoomNum.setString("房间号：" + gameData.roomId);
    },

    //布局，两人麻将和4人麻将共用一个总结算弹窗
    _layOut:function(){
        var gameData = game.procedure.Mahjong.getGameData();
        var gameNum = gameData.getPlayerNum();
        //两人麻将
        if(gameNum == 2){
            this._uiPlayers[0].getNode().setPositionX(310);
            this._uiPlayers[1].getNode().setPositionX(620);
            this._uiPlayers[2].setNodeVisible(false);
            this._uiPlayers[3].setNodeVisible(false);
        }
        //4人麻将
        else{

        }
    },
    //构建玩家数据
    _buildPlayerInfo:function(playerInfo,winners,losers){

        var gameData = game.procedure.Mahjong.getGameData();
        var master = playerInfo.uid == gameData.creator;
        var index = playerInfo.index;
        var buildedInfo = {
            headpic:    playerInfo.headPic,
            uid:        playerInfo.uid,
            name:       playerInfo.name,
            master:     master,
            score:      playerInfo.score || 0,
            dpCount:      playerInfo.dpCount,                        //点炮次数
            zmCount:      playerInfo.zmCount,                        //自摸次数
            dhCount:      playerInfo.dhCount,                        //点胡次数
            anGangCount:      playerInfo.anGangCount,                //暗杠次数
            mingGangCount:     playerInfo.mingGangCount,             //明杠次数
            zjpsArry:      losers,                                   //所有点炮数量最多的玩家的index数组
            bigWinner:   this._calcBigWin(index, winners),           //判断玩家是不是大赢家    true 是  false不是
            zjps:        this._calczjps(index, losers),              //判断玩家是不是最佳炮手  true 是  false不是
        };
        return buildedInfo;
    },
    //查找大赢家索引的辅助函数
    _calcWinner: function(info) {
        var players = info.playerInfo;
        var bigWinerScore = 0;
        //查找最高得分
        for (var key in players) {
            if(players[key].score > bigWinerScore){
                bigWinerScore = players[key].score;
            }
        }
        //根据最高得分查找到它对应的index索引
        var bigWinerIndex = [];
        if(bigWinerScore!=0){
            for(var key in players){
                if(players.hasOwnProperty(key)){
                    if(players[key].score == bigWinerScore){
                        bigWinerIndex.push(+key);
                    }
                }
            }
        }
        return bigWinerIndex;
    },
    //查找最佳炮手的索引的辅助函数
    _calcLoser: function(info) {
        var players = info.playerInfo;
        var zjpsCount = 0;                                              //最佳炮手点炮次数
        for (var key in players) {
            if (players.hasOwnProperty(key)) {
                if (players[key].dpCount > zjpsCount) {
                    zjpsCount = players[key].dpCount;
                }
            }
        }
        var zjpsIndices = [];
        if (zjpsCount != 0) {
            for (var key in players) {
                if (players.hasOwnProperty(key)) {
                    if (players[key].dpCount == zjpsCount) {
                        zjpsIndices.push(+key);
                    }
                }
            }
        }
        return zjpsIndices;
    },
    //判断当前玩家属于什么状态，最佳炮手  大赢家
    _calcBigWin: function(index, winners) {
        if (winners.indexOf(index) != -1) {
            return true
        }
        else
        {
            return false;
        }
    },
    _calczjps:function(index,losers){
       if (losers.indexOf(index) != -1) {
            return true;
        }
        else{
           return false;
       }
    },

    _doExit: function() {
        game.gameNet.sendMessage(protocol.ProtoID.GAME_CLIENT_QUIT_ROOM, {
            uid : game.DataKernel.uid,
            roomId : game.DataKernel.roomId
        });
    },
});

//总结算分享事件，关闭事件
GameWindowMahjong.Settlement.EVENT_SHARE = 1;
GameWindowMahjong.Settlement.EVENT_CLOSED = 2;


//最佳炮手 大赢家
GameWindowMahjong.Settlement.STATE_DYJ = 3;
GameWindowMahjong.Settlement.STATE_ZJPS = 4;

GameWindowMahjong.Settlement.popup = function(info,shareHandler) {
    var totalSettWin = new GameWindowMahjong.Settlement();
    totalSettWin.setEventHandler(shareHandler);
    totalSettWin.setInfo(info);
    game.UISystem.showWindow(totalSettWin);
};