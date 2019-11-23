let Player = require("../../base/player");


///////////////////////////////////////////////////////////////////////////////
//>> 游戏玩家
class XqPlayer extends Player {
    constructor(owner, index){
        super(owner, index);
        this.selectPos = 0;     //选中棋子坐标
        this.path = [];         //选中棋子的路径
        this.chesses = [];      //玩家拥有棋子的坐标
        this.territory = {};  //棋子允许范围
        this.roundBean = 0;
        this.win = false;

    }

    init(data, wsConn){
        super.init(data, wsConn)

    }

    /**
     * 重置数据
     */
    reset(){
        this.ready = false;
        this.playing = false;
        this.roundBean = 0;
        this.path = [];
        this.chesses = [];
        this.territory = [];
        this.selectPos = 0;
        this.win = false;
    }

    destroy(){
        super.destroy();
    }

    /**
     * 获取数据
     * @returns {{uid: *, name, headIcon: string, bean: (*|number), ip: null, ready: *, score: *, roundScore: *, index: *}}
     */
    getInfo() {
        // 基础信息
        let data = super.getInfo();

        // 游戏内信息
        data.win = false;
        return data;
    }

    /**
     * 获取结算信息
     * @returns {{}}
     */
    getSettlementInfo(){
        // let data = super.getSettlementInfo();
        //data.bean = this.bean;
        let data = {};
        data.roundBean = this.roundBean;
        data.playerIndex = this.index;
        // data.actionTimer = this.actionTimer;
        return data
    }

    getPlayerReportInfo(){
        let data = {};
        data.roundBean = this.roundBean;
        data.name = this.name;
        data.uid = this.uid;
        return data
    }


}

exports.Player = XqPlayer;