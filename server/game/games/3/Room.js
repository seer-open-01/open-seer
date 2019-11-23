let Enum        = require("./Enum.js");
let Player      = require("./Player.js").Player;
let ProtoID     = require("../../../net/CSProto.js").ProtoID;
let ProtoState  = require("../../../net/CSProto.js").ProtoState;
let Room        = require("../../base/room");

let eventType       = require("../../../net/CSProto.js").eveIdType;

class Chess  {
   constructor(){
       this.x = 0;
       this.y = 0;
       this.id = 0;
       this.color = 0;
       this.type = 0;
       this.owner = 0;
   }

   setPos(pos){
       this.x = pos % Enum.Width;
       this.y = Math.floor(pos / Enum.Width)
   }

   setXY(x, y){
       this.x = x;
       this.y = y;
   }

   getPos(){
       return this.y * Enum.Width + this.x;
   }

   getColor(){
       return this.color
   }

   setColor(color){
       this.color = color;
       this.owner = color;
   }

   die(){
       //this.x = 0;
       //this.y = 0;
       this.color = 0;
       this.type = 0;
       this.owner = 0;
       this.id = 0;
   }

}


class XqRoom extends Room{
    constructor(data){
        super(data);
        this.chessBoard = [];
        this.Width = Enum.Width;
        this.High = Enum.High;
        this.chesses = [];
        this.chessIdMao = {};
        this.gameType = 3;                       // 游戏类型
        this.curPlay = 0;
        this.baseBean = 0;
        this.frontMoveData = {};                 // 前端发送的移动数据
        this.winner = 0;                         // 赢家
        this.loser = 0;                          // 输家
        this.histories = [];                     // 历史记录
        this.gameOver = true;
        this.minCarryBean = 0;                   // 最小保留金豆
        this.minBean = 0;                        // 最小每次大于x
    }

    init(cArgs){
        super.init(cArgs);
        this.playNum = this.getMaxPlayerNum();
        for (let idx = 1; idx <= this.playNum; ++idx) {
            this.players[idx] = new Player(this, idx);
        }
        this.initChess();
        this.gameOver = true;
        return true
    }

    initChess(){
        let len = Enum.Width * Enum.High;
        let player1 = this.getPlayerByIndex(Enum.Color.RED);
        let player2 = this.getPlayerByIndex(Enum.Color.BLACK);
        for (let i = 0; i < len; i++){
            let chess = new Chess();
            let temp = Enum.ChessBoard[i];
            //console.log(temp);
            chess.type = temp;
            chess.setPos(i);
            if(temp > 0){
                if(i > len / 2){
                    //红棋
                    player1.chesses.push(i);
                    chess.setColor(Enum.Color.RED)
                } else {
                    //黑棋
                    player2.chesses.push(i);
                    chess.setColor(Enum.Color.BLACK)
                }
            }
            this.chessBoard[i] = chess;
        }

        //计算前端棋子ID
        let id = 0;
        for(let j = Enum.High - 1; j >= 0; j--){
            for(let k = 0; k < Enum.Width; k++){
                let pos = k + j * Enum.Width;
                let chess = this.chessBoard[pos];
                if(chess.type !== Enum.ChessType.MASTER){
                    chess.id = id;

                    id++;
                }

            }
        }
    }



    /**
     * 选择棋子
     */
    playerSelectChess(uid, x, y, data){
        let player = this.getPlayerByUid(uid);
        if(player.index !== this.curPlay){
            return 1;
        }
        let pos = this.getPos(x, y);
        let chess = this.getMapChessWithPos(pos);
        if(!chess){
            return 2;
        }
        if(chess.owner === player.index){
            player.selectPos = pos
        }else {
            player.selectPos = -1;
            player.path = [];
            return 3;
        }
        let path = this.getChessPath(chess);
        player.path = path;
        let front = this.getFrontXYArray(path);
        //gg
        // player.sendMsg(ProtoID.GAME_CLIENT_SELECT_CHESS_XQ, {selectId: data.selectId});
        this.broadcastMsg(ProtoID.GAME_CLIENT_SELECT_CHESS_XQ, {selectId: data.selectId,playerIndex: player.index,path:front});
        return 0;
    }

    /**
     * 获取前端xy坐标数组
     */
    getFrontXYArray(path){
        let front = [];
        for (let i = 0; i < path.length; i++){
            let pos = path[i];
            let tempX = this.getX(pos);
            let tempY = this.getY(pos);
            let t = this.transformXYFront(tempX, tempY);
            front.push(t);
        }
        return front;
    }

    /**
     * 开始新一轮
     */
    onRoomStartNewRound() {
        super.onRoomStartNewRound();
        this.winner = 0;
        this.histories = [];
        this.loser = 0;             //输家
        this.curPlay = Enum.Color.RED;
        this.broadcastMsg(ProtoID.GAME_CLIENT_START_NEW_ROUND_XQ,{});
        this.gameOver = false;
        this.broadcastMsg(ProtoID.GAME_CLIENT_CUR_PLAYER_XQ, {playerIndex: this.curPlay});
    }

    reset(){
        this.playing = false;
        this.chessBoard = [];
        this.histories = [];

    }


    /**
     * 悔棋
     * @param uid
     */
    onPlayerReChess(uid){
        if(this.retractChess() === 0){

        }
        if(this.retractChess() === 0){

        }
    }

    getCreator(uid) {
        return uid;
    }

    onPlayerEnter(uid){

    }

    onPlayerQuit(player){
        if(player.index === 1){
            let player2 = this.getPlayerByIndex(2);
            if(player2.uid){
                this.quitRoom(player2.uid);
            }
        }else {
            this.onRoundFinish();
        }
        this.players[player.index] = new Player(this, player.index);
    }

    /**
     * 移动棋子
     */
    onPlayerMoveChess(uid, pos){
        let pos1 = pos;
        let pos2 = 0;
        let player = this.getPlayerByUid(uid);
        let player2 = this.getOtherPlayer(player.index);
        let chi = false;
        let jiang = false;
        if(player.index !== this.curPlay){
            return 1;
        }
        let path = player.path;
        if(path.indexOf(pos) === -1){
            return 2;
        }
        if(player.selectPos === -1){
            return 3;
        }
        let selectChess = this.getMapChessWithPos(player.selectPos);
        let chess = this.getMapChessWithPos(pos1);
        if(chess.type !== Enum.ChessType.MASTER){
            //吃
            chi = true;
            if(chess.type === Enum.ChessType.RULER){

                this.broadcastMsg(ProtoID.GAME_CLIENT_MOVE_CHESS_XQ, {
                    cx: this.frontMoveData.cx,
                    cy: this.frontMoveData.cy,
                    playerIndex: player.index,
                    chessId: this.frontMoveData.chessId,
                    killId: this.frontMoveData.killId,
                    x: this.frontMoveData.x,
                    y: this.frontMoveData.y
                });

                this.broadcastMsg(ProtoID.GAME_CLIENT_CHI_CHESS_XQ, {playerIndex: player.index});
                this.winner = player.index;
                this.loser = player2.index;
                player.win = true;
                this.onSettlement();
                console.log("结算1");
                return 4;
            }
        }

        //先假装移动
        this.doMove(player.selectPos, pos1);

        let tempTerritory = clone(player2.territory);
        player2.territory = this.getPlayerTerritory(player2.index);
        console.log(player2.territory);
        //计算送将
        if(this.checkmate(player2.index) === 1){
            //悔棋
            this.retractChess();
            player2.territory = tempTerritory;
            return 6;
        }


        //通知玩家走棋
        this.broadcastMsg(ProtoID.GAME_CLIENT_MOVE_CHESS_XQ, {
            cx: this.frontMoveData.cx,
            cy: this.frontMoveData.cy,
            chessId: this.frontMoveData.chessId,
            playerIndex: player.index,
            killId: this.frontMoveData.killId,
            x: this.frontMoveData.x,
            y: this.frontMoveData.y,
            result: ProtoState.STATE_OK
        });

        player.territory = this.getPlayerTerritory(player.index);
        //计算将军
        let checkmate = this.checkmate(player.index);
        if(checkmate > 1){
            //广播  结算
            if(chi){
                this.broadcastMsg(ProtoID.GAME_CLIENT_CHI_CHESS_XQ, {playerIndex: player.index});
            }
            this.winner = player.index;
            this.loser = player2.index;
            player.win = true;
            this.onSettlement();

            console.log("结算2");
            return 5;
        }else{
            //将军
            if(checkmate === 1){
                jiang = true;
            }
            if(this.checkOver(player.index)){
                if(jiang){
                    this.broadcastMsg(ProtoID.GAME_CLIENT_CHECKMATE_CHESS_XQ, {playerIndex: player.index});
                }
                this.winner = player.index;
                this.loser = player2.index;
                player.win = true;
                this.onSettlement();
                console.log("结算3");
                return 7
            }

        }

        if(jiang){
            this.broadcastMsg(ProtoID.GAME_CLIENT_CHECKMATE_CHESS_XQ, {playerIndex: player.index});
        }else if(chi){
            this.broadcastMsg(ProtoID.GAME_CLIENT_CHI_CHESS_XQ, {playerIndex: player.index});
        }

        //切换玩家
        this.changePlay();

        return 0;
    }

    //获取另一个玩家
    getOtherPlayer(playerIndex){
        let index = 1;
        if(playerIndex === 1){
            index = 2;
        }
        return this.getPlayerByIndex(index);
    }

    //结算
    settlement(){
        let winPlayer = this.getPlayerByIndex(this.winner);
        let losePlayer = this.getPlayerByIndex(this.loser);
        if(winPlayer.uid === 0){
            return
        }
        if(losePlayer.uid === 0){
            return
        }
        let bean = Math.min(this.baseBean, losePlayer.bean - this.minCarryBean);
        winPlayer.roundBean = bean;
        winPlayer.updateCoin(1,bean, eventType.MATCH);
        losePlayer.roundBean = -bean;
        losePlayer.updateCoin(1,-bean, eventType.MATCH);
    }

    onPlayerGiveUp(index){
        if(this.gameOver){
            return;
        }
        this.gameOver = true;
        let player = this.getOtherPlayer(index);
        let player2 = this.getPlayerByIndex(index);
        this.winner = player.index;
        this.loser = player2.index;
        player.win = true;
        this.onSettlement();
    }

    //服务器转换坐标为前端坐标
    transformXYFront(x, y){
        let frontY = Math.abs(y - (Enum.High - 1));

        return {x: x, y: frontY}
    }

    //前端坐标转服务器坐标
    transformXY(x, y){
        let tempX = x;
        let tempY = y;
        if(this.curPlay === Enum.Color.RED){
            tempY = Math.abs(y - (Enum.High - 1));
        }else {
            tempY = Math.abs(y - (Enum.High - 1));
            // tempX = Math.abs(x - (Enum.Width - 1));
        }
        return {x: tempX, y: tempY}
    }

    selectAndMoveChess(uid, selectPos, MovePos, data){
        this.frontMoveData = data;
        // let result = this.playerSelectChess(uid, this.getX(selectPos), this.getY(selectPos));
        // if(result){
        //     //this.broadcastMsg(ProtoID.GAME_CLIENT_MOVE_CHESS_XQ, {});
        //     DEBUG("select fail" + result);
        //     return
        // }
        let player = this.getPlayerByUid(uid);
        let code = this.onPlayerMoveChess(uid, MovePos);
        if(code){
            if(code === 6){
                this.broadcastMsg(ProtoID.GAME_CLIENT_MOVE_CHESS_XQ, {
                    playerIndex: player.index,
                    result: ProtoState.STATE_GAME_CHESS_CHECKMATE
                });
            }else if(code === 2){
                this.broadcastMsg(ProtoID.GAME_CLIENT_MOVE_CHESS_XQ, {
                    playerIndex: player.index,
                    result: ProtoState.STATE_GAME_CHESS_MOVE_ERROR
                });
            }

            DEBUG("move code" + code);
            // return
        }

    }

    getRoomInfo() {
        let data = super.getRoomInfo();
        data.curPlay = this.curPlay;
        data.baseBean = this.baseBean;
        data.chesses = this.getChessesArray();
        return data
    }

    getChessesArray(){
        let arr = [];
        for(let i = 0; i < this.chessBoard.length; i++){
            let chess = this.chessBoard[i];
            if(chess.type){
                let temp = this.transformXYFront(chess.x, chess.y);
                temp.id = chess.id;
                arr.push(temp);
            }
        }
        return arr;
    }

    /**
     * 结算
     */
    onSettlement() {
        this.gameOver = true;
        DEBUG("settlement...");
        super.onSettlement();
        //this.settlement();
        //this.updateResources();
        //this.resourcesChange();
        let playerInfo = {};


        this.enumPlayingPlayers((eIndex, ePlayer) =>{
            playerInfo[eIndex] = ePlayer.getSettlementInfo();
            let report = this.getReportInfo(ePlayer.uid);
            GameMgr.savePlayerReport(report);
        });
        let info = {
            baseBean: this.baseBean,
            winner: this.winner,
            players: playerInfo
        };
        this.broadcastMsg(ProtoID.GAME_CLIENT_SETTLEMENT_XQ, info);
        this.onRoundFinish();
    }

    getReportInfo(uid){
        let data = {};
        let player = this.getPlayerByUid(uid);
        data.roundId = this.roundId;
        data.gameType = this.gameType;
        data.playerInfo = player.getPlayerReportInfo();
        data.mode = this.mode;
        data.uid = uid;
        data.exMod = true;
        data.roomId = this.roomId;
        data.time = new Date().getTime();
        Date.getStamp();
        return data
    }



    onRoundFinish(){
        this.reset();
        this.enumPlayingPlayers((eIndex, ePlayer)=>{
            ePlayer.reset();
        });
        this.initChess();
    }

    changePlay(){
        this.curPlay = this.getNextPlayerIndex();
        this.broadcastMsg(ProtoID.GAME_CLIENT_CUR_PLAYER_XQ, {playerIndex: this.curPlay});
        console.log("换人")

    }

    getNextPlayerIndex(){
        if(this.curPlay === Enum.Color.RED){
            return Enum.Color.BLACK;
        }else {
            return Enum.Color.RED
        }
    }

    //悔棋
    retractChess(){
        if(this.histories.length === 0){
            return 1;
        }
        let history = this.histories[this.histories.length - 1];
        let chess1 = this.chessBoard[history.recode1.pos];
        chess1.type = history.recode1.type;
        chess1.id = history.recode1.id;
        chess1.setColor(history.recode1.color);
        let player1 = this.getPlayerByIndex(history.player1);
        for (let i = 0; i < player1.chesses.length; i++){
            if(player1.chesses[i] === history.recode2.pos){
                player1.chesses[i] = history.recode1.pos;
                break;
            }
        }
        let chess2 = this.chessBoard[history.recode2.pos];
        chess2.type = history.recode2.type;
        chess2.id = history.recode2.id;
        if(chess2.type !== Enum.ChessType.MASTER){
            let player2 = this.getPlayerByIndex(history.player2);
            player2.chesses.push(history.recode2.pos);
        }
        chess2.setColor(history.recode2.color);
        this.curPlay = history.curPlay;
        //删除历史
        this.histories.splice(this.histories.length - 1, 1);
        //操作成功
        return 0;
    }


    onPlayerChangeBaseBean(uid, num){
        //return                              // 广电杯强制 不做此消息的处理
        let player = this.getPlayerByUid(uid);
        if(this.playing){
            return
        }
        if(player.index !== 1){
            return
        }
        if(!num){
            return
        }
        num = parseInt(num);
        if(typeof num !== "number"){
            return
        }
        if(num < this.minBean){
            return
        }
        num = Math.floor(num);
        if(player.bean <= this.minCarryBean){
            return;
        }
        if(num <= 0){
            return
        }
        this.baseBean = num;
        this.broadcastMsg(ProtoID.GAME_CLIENT_CHANGE_BASE_BEAN_XQ, {baseBean : num});
    }

    doMove(pos1, pos2){
        let chess1 = this.getMapChessWithPos(pos1);
        let chess2 = this.getMapChessWithPos(pos2);

        let player1 = this.getPlayerByIndex(chess1.owner);
        let player2 = this.getPlayerByIndex(chess2.owner);

        let history = {

            curPlay: this.curPlay,
            player1: chess1.owner,
            player2: chess2.owner,
            recode1: {
                pos: pos1,
                type: chess1.type,
                id: chess1.id,
                color: chess1.color
            },
            recode2: {
                pos: pos2,
                type: chess2.type,
                id: chess2.id,
                color: chess2.color
            }
        };

        this.histories.push(history);

        if(chess2.type !== Enum.ChessType.MASTER){
            let delIndex = player2.chesses.indexOf(pos2);
            if(delIndex === -1){
                ERROR("chess is not exist! error info: pos = " + pos2);
            }else {
                player2.chesses.splice(delIndex, 1);
            }
        }

        for (let i = 0; i < player1.chesses.length; i++){
            if(player1.chesses[i] === pos1){
                player1.chesses[i] = pos2;
                break;
            }
        }

        chess2.type = chess1.type;
        chess2.color = chess1.color;
        chess2.owner = chess1.owner;
        chess2.id = chess1.id;

        chess1.die();

    }

    //绝杀
    checkOver(color){
        // return;
        // let player = this.getPlayerByIndex(color);
        let indexes = [1, 2];
        if(color === Enum.Color.RED){
            indexes = [1, 2];
        }else {
            indexes = [2, 1]
        }

        //获取king坐标
        let player = this.getPlayerByIndex(indexes[0]);
        let player2 = this.getPlayerByIndex(indexes[1]);
        let tempTerritory = clone(player.territory);
        let chesses = [];
        for (let i = 0; i < player2.chesses.length; i++){
            let pos1 = player2.chesses[i];
            chesses.push(pos1)
        }
        for (let i = 0; i < chesses.length; i++){
            let pos1 = chesses[i];
            let chess = this.getMapChessWithPos(pos1);
            let path = this.getChessPath(chess);
            for (let j = 0; j < path.length; j++){
                let pos2 = path[j];
                this.doMove(pos1, pos2);
                player.territory = this.getPlayerTerritory(player.index);
                let checkmate = this.checkmate(color);
                if(checkmate === 0){
                    DEBUG(player.territory);
                    // console.log(player.territory);
                }
                this.retractChess();
                if(checkmate === 0){
                    player.territory = tempTerritory;
                    return false
                }
            }
        }
        player.territory = tempTerritory;
        return true
    }

    //将军
    checkmate(color){
        let indexes = [1, 2];
        if(color === Enum.Color.RED){
            indexes = [1, 2];
        }else {
            indexes = [2, 1]
        }

        //获取king坐标
        let player1 = this.getPlayerByIndex(indexes[0]);
        let player2 = this.getPlayerByIndex(indexes[1]);
        let kingPos = -1;
        for (let i = 0; i < player2.chesses.length; i++){
            let chess = this.getMapChessWithPos(player2.chesses[i]);
            if(chess.type === Enum.ChessType.RULER){
                kingPos = chess.getPos();
                break;
            }
        }
        if(kingPos === -1){
            console.log("*********************");
            console.log(player2.chesses)
        }
        let territory = player1.territory;

        if(territory[kingPos] === 1){
            //将军
            // console.log("将");
            return 1

            // //判断玩家将是否可移动
            // let kingPath = this.getChessPath(this.getMapChessWithPos(kingPos));
            // let flag = true;
            // for (let j = 0; j < kingPath.length; j++){
            //     if(territory[kingPath[i]] !== 1){
            //         flag = false;
            //         break;
            //     }
            // }
            //
            // if(flag){
            //     //绝杀
            // }

        }else {
            //判断是否是死棋
            let tempTerritory = this.getPlayerTerritory(player2.index);
            // console.log(player2.chesses);
            // console.log(tempTerritory);

            if(Object.keys(tempTerritory).length === 0){
                //死棋
                return 2
            }
        }
        return 0
    }

    /**
     * 获取玩家所有的路径
     * @param playerIndex
     * @returns {{}}
     */
    getPlayerTerritory(playerIndex){
        let player = this.getPlayerByIndex(playerIndex);
        let territory = {};
        for (let i = 0; i < player.chesses.length; i++){
            let chess = this.getMapChessWithPos(player.chesses[i]);
            let path = [];
            if(chess.type === Enum.ChessType.ARCHER){
                path = this.getPaoTerritory(chess);
            }else if (chess.type === Enum.ChessType.RULER){
                path = this.getShuaiTerritory(chess);
                console.log(path);
            }else {
                path = this.getChessPath(chess);
            }
            for (let j = 0; j < path.length; j++){
                let pos = path[j];
                territory[pos] = 1;
            }
        }

        return territory;
    }

    /**
     * 帅
     * @param shuai
     */
    getShuaiTerritory(shuai){
        let path = [];
        let pos1 = shuai.getPos();
        let offX = [-1,0,1,0];
        let offY = [0,1,0,-1];
        let chess = this.getMapChessWithPos(pos1);
        for (let i = 0; i < 4; i++){
            let tempX = this.getX(pos1) + offX[i];
            let tempY = this.getY(pos1) + offY[i];
            let tempPos = this.getPos(tempX, tempY);
            if(!this.checkPosOut(tempX, tempY)){
                continue;
            }

            let tempChess = this.getMapChessWithPos(tempPos);


            //帅不能出家
            if(tempX > 5 || tempX < 3){

                continue;
            }

            if(tempChess.color === chess.color){
                continue;
            }



            //帅不能见面
            ////////////
            if(chess.color === Enum.Color.BLACK){

                let flag = false;
                for(let j = tempY; j < Enum.High; j++){
                    let jPos = this.getPos(tempX, j);
                    let jChess = this.getMapChessWithPos(jPos);
                    if(jChess.type !== Enum.ChessType.MASTER){
                        if(jChess.type === Enum.ChessType.RULER){
                            if(jChess.color === Enum.Color.RED){
                                flag = true;
                                 if(offX[i] === 0){
                                    path.push(jPos)
                                }
                            }
                        }else {
                            break;
                        }
                    }
                }
                if(tempY > 2){

                    continue;
                }
                if(flag){
                    continue;
                }
            }else{

                let flag = false;
                for(let j = tempY; j >= 0; j--){
                    let jPos = this.getPos(tempX, j);
                    let jChess = this.getMapChessWithPos(jPos);
                    if(jChess.type !== Enum.ChessType.MASTER){

                        if(jChess.type === Enum.ChessType.RULER){
                            if(jChess.color === Enum.Color.BLACK){
                                flag = true;
                                if(offX[i] === 0){
                                    path.push(jPos)
                                }
                            }
                        }else {
                            break;
                        }
                    }
                }
                if(tempY < Enum.High - 3){
                    continue;
                }
                if(flag){
                    continue;
                }
            }

            //帅不能走死路
            let player = {};
            if(chess.owner === Enum.Color.RED){
                player = this.getPlayerByIndex(Enum.Color.BLACK)
            }else {
                player = this.getPlayerByIndex(Enum.Color.RED)
            }
            if(player.territory[tempPos] === 1){

                continue;
            }

            if(tempChess.color !== chess.color){
                path.push(tempPos)
            }
        }
        return path;
    }


    /**
     * 炮
     * @param pao
     * @returns {Array}
     */
    getPaoTerritory(pao){
        let pos = pao.getPos();
        let path = [];
        let x = this.getX(pos);
        let y = this.getY(pos);
        let offX = [-1,0,1,0];
        let offY = [0,1,0,-1];
        let chess = this.getMapChessWithPos(pos);
        for (let i = 0; i < 4; i++){
            let tempX = x;
            let tempY = y;
            let flag = true;
            for (; this.checkPosOut(tempX, tempY); tempX += offX[i], tempY += offY[i]){
                let tempPos = this.getPos(tempX, tempY);
                let tempChess = this.getMapChessWithPos(tempPos);

                if(tempPos === pos){
                    continue;
                }
                if(tempChess){
                    if(tempChess.type === Enum.ChessType.MASTER){
                        if(flag){
                            // path.push(tempPos);
                        }
                    }else {
                        if(flag){
                            flag = false
                        }else {
                            if(tempChess.color !== chess.color){
                                path.push(tempPos);
                            }
                            break
                        }
                    }
                }
            }
        }
        return path
    }



    //计算棋子可以移动的格子
    getChessPath(chess){
        let type = chess.type;
        let pos = chess.getPos();
        // console.log(pos);
        let path = [];
        switch (type){
            case Enum.ChessType.ARCHER:
                path = this.getPaoPath(pos);
                break;
            case Enum.ChessType.ASSASSIN:
                path = this.getShiPath(pos);
                break;
            case Enum.ChessType.CASTER:
                path = this.getXiangPath(pos);
                break;
            case Enum.ChessType.LANCER:
                path = this.getJuPath(pos);
                break;
            case Enum.ChessType.MASTER:
                path = [];
                break;
            case Enum.ChessType.RIDER:
                path = this.getMaPath(pos);
                break;
            case Enum.ChessType.RULER:
                path = this.getShuaiPath(pos);
                break;
            case Enum.ChessType.SABER:
                path = this.getBingPath(pos);
                break;
        }
        return path;
    }

    // 車
    getJuPath(pos){
        let path = [];
        let x = this.getX(pos);
        let y = this.getY(pos);
        let offX = [-1,0,1,0];
        let offY = [0,1,0,-1];
        let chess = this.getMapChessWithPos(pos);
        for (let i = 0; i < 4; i++){
            let tempX = x;
            let tempY = y;
            for (; this.checkPosOut(tempX, tempY); tempX += offX[i],tempY += offY[i]){
                let tempPos = this.getPos(tempX, tempY);
                if(tempPos === pos){
                    continue;
                }
                let tempChess = this.getMapChessWithPos(tempPos);
                if(tempChess){
                    if(tempChess.type === Enum.ChessType.MASTER){
                        path.push(tempPos);
                    }else if(tempChess.color !== chess.color){
                        path.push(tempPos);
                        break;
                    }else {
                        break;
                    }
                }
            }
        }
        return path
    }

    //炮
    getPaoPath(pos){
        let path = [];
        let x = this.getX(pos);
        let y = this.getY(pos);
        let offX = [-1,0,1,0];
        let offY = [0,1,0,-1];
        let chess = this.getMapChessWithPos(pos);
        for (let i = 0; i < 4; i++){
            let tempX = x;
            let tempY = y;
            let flag = true;
            for (; this.checkPosOut(tempX, tempY); tempX += offX[i], tempY += offY[i]){
                let tempPos = this.getPos(tempX, tempY);
                let tempChess = this.getMapChessWithPos(tempPos);
                if(tempPos === pos){
                    continue;
                }
                if(tempChess){
                    if(tempChess.type === Enum.ChessType.MASTER){
                        if(flag){
                            path.push(tempPos);
                        }
                    }else {

                        if(flag){
                            flag = false
                        }else {
                            if(tempChess.color !== chess.color){
                                path.push(tempPos);
                            }
                            break
                        }
                    }
                }
            }
        }
        return path
    }


    //马
    getMaPath(pos){
        let path = [];
        let pos1 = pos;
        let offX = [-2,-1,1,2,2,1,-1,-2];
        let offY = [1,2,2,1,-1,-2,-2,-1];
        let stopX = [-1,0,0,1,1,0,0,-1];
        let stopY = [0,1,1,0,0,-1,-1,0];
        let chess = this.getMapChessWithPos(pos);
        for (let i = 0; i < 8; i++){
            let tempX = this.getX(pos1) + offX[i];
            let tempY = this.getY(pos1) + offY[i];
            let tempPos = this.getPos(tempX, tempY);
            let tempStopX = this.getX(pos1) + stopX[i];
            let tempStopY = this.getY(pos1) + stopY[i];
            if(!this.checkPosOut(tempStopX, tempStopY)){
                continue;
            }
            let stopPos = this.getPos(tempStopX, tempStopY);
            let stopChess = this.getMapChessWithPos(stopPos);
            if(stopChess.type !== Enum.ChessType.MASTER){
                continue;
            }
            if(!this.checkPosOut(tempX, tempY)){
                continue;
            }
            let tempChess = this.getMapChessWithPos(tempPos);
            if(tempChess.color !== chess.color){
                path.push(tempPos)
            }
        }
        return path
    }

    //象
    getXiangPath(pos){
        let path = [];
        let pos1 = pos;
        let offX = [-2,2,2,-2];
        let offY = [2,2,-2,-2];
        let stopOffX = [-1,1,1,-1];
        let stopOffY = [1,1,-1,-1];
        let chess = this.getMapChessWithPos(pos);
        for (let i = 0; i < 4; i++){
            let tempX = this.getX(pos1) + offX[i];
            let tempY = this.getY(pos1) + offY[i];
            let tempStopX = this.getX(pos1) + stopOffX[i];
            let tempStopY = this.getY(pos1) + stopOffY[i];
            let tempPos = this.getPos(tempX, tempY);
            let stopPos = this.getPos(tempStopX, tempStopY);

            if(!this.checkPosOut(tempX, tempY)){
                continue;
            }

            let stopChess = this.getMapChessWithPos(stopPos);
            if(stopChess.type !== Enum.ChessType.MASTER){
                continue;
            }

            //象不能过河
            if(chess.color === Enum.Color.BLACK){
                if(tempY >= Enum.High / 2){
                    continue;
                }
            }else{
                if(tempY < Enum.High / 2){
                    continue;
                }
            }

            let tempChess = this.getMapChessWithPos(tempPos);
            if(tempChess.color !== chess.color){
                path.push(tempPos)
            }
        }
        return path;
    }

    //士
    getShiPath(pos){
        let path = [];
        let pos1 = pos;
        let offX = [-1,1,1,-1];
        let offY = [1,1,-1,-1];
        let chess = this.getMapChessWithPos(pos);
        for (let i = 0; i < 4; i++){
            let tempX = this.getX(pos1) + offX[i];
            let tempY = this.getY(pos1) + offY[i];
            let tempPos = this.getPos(tempX, tempY);
            if(!this.checkPosOut(tempX, tempY)){
                continue;
            }
            //士不能出家
            if(tempX > 5 || tempX < 3){
                continue;
            }
            if(chess.color === Enum.Color.BLACK){
                if(tempY > 2){
                    continue;
                }
            }else{
                if(tempY < Enum.High - 3){
                    continue;
                }
            }
            let tempChess = this.getMapChessWithPos(tempPos);
            if(tempChess.color !== chess.color){
                path.push(tempPos)
            }
        }
        return path;
    }

    //帅
    getShuaiPath(pos){
        let path = [];
        let pos1 = pos;
        let offX = [-1,0,1,0];
        let offY = [0,1,0,-1];
        let chess = this.getMapChessWithPos(pos);
        for (let i = 0; i < 4; i++){
            let tempX = this.getX(pos1) + offX[i];
            let tempY = this.getY(pos1) + offY[i];
            let tempPos = this.getPos(tempX, tempY);
            if(!this.checkPosOut(tempX, tempY)){
                continue;
            }
            //帅不能出家
            if(tempX > 5 || tempX < 3){

                continue;
            }



            //帅不能见面
            ////////////
            if(chess.color === Enum.Color.BLACK){
                if(tempY > 2){

                    continue;
                }
                let flag = false;
                for(let j = tempY + 1; j < Enum.High; j++){
                    let jPos = this.getPos(tempX, j);
                    let jChess = this.getMapChessWithPos(jPos);
                    if(jChess.type !== Enum.ChessType.MASTER){
                        if(jChess.type === Enum.ChessType.RULER){
                            if(jChess.color === Enum.Color.RED){
                                flag = true;
                            }
                        }
                        break;
                    }
                }
                if(flag){
                    continue;
                }
            }else{
                if(tempY < Enum.High - 3){
                    continue;
                }
                let flag = false;
                for(let j = tempY - 1; j >= 0; j--){
                    let jPos = this.getPos(tempX, j);
                    let jChess = this.getMapChessWithPos(jPos);
                    if(jChess.type !== Enum.ChessType.MASTER){

                        if(jChess.type === Enum.ChessType.RULER){
                            if(jChess.color === Enum.Color.BLACK){
                                flag = true;
                            }
                        }
                        break;
                    }
                }
                if(flag){
                    continue;
                }
            }


             //帅不能走死路
            let player = {};
            if(chess.owner === Enum.Color.RED){
                player = this.getPlayerByIndex(Enum.Color.BLACK)
            }else {
                player = this.getPlayerByIndex(Enum.Color.RED)
            }
            if(player.territory[tempPos] === 1){
                continue;
            }

            let tempChess = this.getMapChessWithPos(tempPos);
            if(tempChess.color !== chess.color){
                path.push(tempPos)
            }
        }
        return path;
    }

    //兵
    getBingPath(pos){
        let path = [];
        let pos1 = pos;
        let offX = [-1,0,1,0];
        let offY = [0,1,0,-1];
        let chess = this.getMapChessWithPos(pos);
        for (let i = 0; i < 4; i++){
            let tempX = this.getX(pos1) + offX[i];
            let tempY = this.getY(pos1) + offY[i];
            let tempPos = this.getPos(tempX, tempY);
            if(!this.checkPosOut(tempX, tempY)){
                continue;
            }
            //过河才能左右
            if(offX[i] !== 0){
                if(chess.color === Enum.Color.RED){
                    if(this.getY(pos1) > 4){
                        continue;
                    }
                }else{
                    if(this.getY(pos1) < 5){
                        continue;
                    }
                }
            }

            //兵不能后退
            if(chess.color === Enum.Color.RED){
                if(offY[i] > 0){
                    continue;
                }
            }else{
                if(offY[i] < 0){
                    continue;
                }
            }
            let tempChess = this.getMapChessWithPos(tempPos);
            if(tempChess.color !== chess.color){
                path.push(tempPos)
            }
        }
        return path;
    }

    //出界
    checkPosOut(x, y){
        let tempX = x;
        let tempY = y;
        return (tempX >= 0 && tempX < Enum.Width && tempY >= 0 && tempY < Enum.High);
    }



    checkMove(pos11, pos22){


    }

    //車
    chariotRule(curPos, movePos){
        let pos1 = 0;
        let pos2 = 0;
        if(this.getX(pos1) === this.getX(pos2) || this.getY(pos1) === this.getY(pos2)){
            let chess1 = this.getMapChessWithPos(pos1);
            let chess2 = this.getMapChessWithPos(pos2);
            return chess1.owner !== chess2.owner
        }else {
            return false
        }
    }

    //马
    knightRule(){
        let pos1 = 0;
        let pos2 = 0;
        let offX = [-2,-1,1,2,2,1,-1,-2];
        let offY = [1,2,2,1,-1,-2,-2,-1];
        for (let i = 0; i < 8; i++){
            let tempX = this.getX(pos1) + offX[i];
            let tempY = this.getY(pos1) + offY[i];
            let tempPos = this.getPos(tempX, tempY);
            if(tempPos === pos2){
                let chess1 = this.getMapChessWithPos(pos1);
                let chess2 = this.getMapChessWithPos(pos2);
                return chess1.owner !== chess2.owner;
            }
        }
        return false
    }

    //象
    bishopRule(){
        let pos1 = 0;
        let pos2 = 0;
        let offX = [-2,2,2,-2];
        let offY = [2,2,-2,-2];
        for (let i = 0; i < 4; i++){
            let tempX = this.getX(pos1) + offX[i];
            let tempY = this.getY(pos1) + offY[i];
            let tempPos = this.getPos(tempX, tempY);
            if(tempPos === pos2){
                let chess1 = this.getMapChessWithPos(pos1);
                let chess2 = this.getMapChessWithPos(pos2);
                return chess1.owner !== chess2.owner;
            }
        }
        return false
    }

    //士
    queenRule(){
        let pos1 = 0;
        let pos2 = 0;
        let offX = [-1,1,1,-1];
        let offY = [1,1,-1,-1];
        for (let i = 0; i < 4; i++){
            let tempX = this.getX(pos1) + offX[i];
            let tempY = this.getY(pos1) + offY[i];
            let tempPos = this.getPos(tempX, tempY);
            if(tempPos === pos2){
                let chess1 = this.getMapChessWithPos(pos1);
                let chess2 = this.getMapChessWithPos(pos2);
                return chess1.owner !== chess2.owner;
            }
        }
        return false
    }

    //帅
    kingRule(){
        let pos1 = 0;
        let pos2 = 0;
        let offX = [-1,0,1,0];
        let offY = [0,1,0,-1];
        for (let i = 0; i < 4; i++){
            let tempX = this.getX(pos1) + offX[i];
            let tempY = this.getY(pos1) + offY[i];
            let tempPos = this.getPos(tempX, tempY);
            if(tempPos === pos2){
                let chess1 = this.getMapChessWithPos(pos1);
                let chess2 = this.getMapChessWithPos(pos2);
                return chess1.owner !== chess2.owner;
            }
        }
        return false
    }

    //炮
    cannonRule(){
        let pos1 = 0;
        let pos2 = 0;
        if(this.getX(pos1) === this.getX(pos2) || this.getY(pos1) === this.getY(pos2)){
            let chess1 = this.getMapChessWithPos(pos1);
            let chess2 = this.getMapChessWithPos(pos2);
            return chess1.owner !== chess2.owner
        }else {
            return false
        }
    }

    //兵
    pawnRule(){
        let pos1 = 0;
        let pos2 = 0;
        let offX = [-1,0,1,0];
        let offY = [0,1,0,-1];
        for (let i = 0; i < 4; i++){
            let tempX = this.getX(pos1) + offX[i];
            let tempY = this.getY(pos1) + offY[i];
            let tempPos = this.getPos(tempX, tempY);
            if(tempPos === pos2){
                let chess1 = this.getMapChessWithPos(pos1);
                let chess2 = this.getMapChessWithPos(pos2);
                return chess1.owner !== chess2.owner;
            }
        }
        return false
    }

    getMapChessWithX(x){
        this.p
    }

    getMapChessWithY(y){

    }

    getMapChessWithPos(pos){
        return this.chessBoard[pos]
    }


    getPos(x, y){
        return y * Enum.Width + x
    }

    getX(pos){
        return pos % Enum.Width
    }

    getY(pos){
        return Math.floor(pos / Enum.Width)
    }

    /**
     * 获取最大玩家人数
     * @returns {number}
     */
    getMaxPlayerNum() {
        return 2;
    }

}

exports.Room = XqRoom;
