/**
 * Created by fuyang on 2018/10/18.
 */

//麻将总结算玩家
GameWindowMahjong.SettlementPlayer = cc.Class.extend({

    _node               : null,         // 本节点

    _headNode           : null,         // 头像节点
    _headPic            : null,         // 头像图片管理对象
    _winerBg            : null,         // 大赢家背景图片
    _normalBg           : null,         // 正常玩家背景图片

    _creator            : null,         // 房主图片
    _bigWin           : null,           // 大赢家图片
    _name               : null,         // 玩家名字
    _id                 : null,         // 玩家Uid
    _zjpsImg            : null,         // 最佳炮手图片

    _fntWinScore        : null,         // 赢的时候的分数文本
    _fntLoseScore       : null,         // 输的时候的分数文本

    _stats              : [],           // 状态描述的数组

   ctor:function(node){

        cc.log("node ===== > " + node.getName());
        this._node = node;
        this._init();
        return true;
   },
    _init:function(){
        this._winerBg = game.findUI(this._node, "WinnerBg");
        this._normalBg = game.findUI( this._node, "Pic_NormalBg");
        this._creator = game.findUI( this._node, "ND_Master");

        this._fntWinScore = game.findUI( this._node, "ND_WinScore");
        this._fntLoseScore = game.findUI( this._node, "ND_LoseScore");

        this._bigWin = game.findUI( this._node, "ND_BigWin");
        this._zjpsImg = game.findUI( this._node, "Pic_Pao");

        this._name = game.findUI( this._node, "ND_Name");
        this._id = game.findUI( this._node, "ND_Id");

        //头像
        this._headNode = game.findUI(this._node, "ND_Headpic");
        this._headPic =  new GameWindowBasic.GameHeadPic(this._headNode);

        //状态秒速文本管理数组
        var tmpNode = game.findUI(this._node, "ND_Stat");
        this.stats = [];
        for(var i = 1; i <= 5; ++i)
        {
            var tmp = game.findUI(tmpNode, "Stat" + i);
            this.stats.push(tmp);
        }
    },
    //设置大赢家图片的显示隐藏
    _setBigWin:function(vis){
        this._bigWin.setVisible(vis);
    },
    //设置玩家的背景图片赢家
    _setWiner:function(){
        this._normalBg.setVisible(false);
        this._winerBg.setVisible(true);
    },
    //设置玩家的背景图输家
    _setLose:function(){
        this._winerBg.setVisible(false);
        this._normalBg.setVisible(true);
    },
    //设置状态描述
    _setStat:function(info){
        this.stats[0].setString("自摸：" + info.zmCount + "次");
        this.stats[1].setString("接炮：" + info.dhCount + "次");
        this.stats[2].setString("点炮：" + info.dpCount + "次");
        this.stats[3].setString("明杠：" + info.mingGangCount + "次");
        this.stats[4].setString("暗杠：" + info.anGangCount + "次");
    },
    //设置这个预制体的信息
    setInfo:function(info){
      this._headPic.setHeadPic(info.headPic);
      this._name.setString(info.name);
      this._id.setString("ID:" + info.uid);
      this._creator.setVisible(info.master);
      //设置得分
      var score = info.score;
      if(score > 0 ){
       this._fntLoseScore.setVisible(false);
       this._fntWinScore.setVisible(true);
       this._fntWinScore.setString("+" + score);
       this._setWiner();
      }
      else{
          this._fntLoseScore.setVisible(true);
          this._fntWinScore.setVisible(false);
          this._fntLoseScore.setString(score);     //负数直接设置就可以了，前面自带"-"号
          this._setLose();
      }
      this._setStat(info);
      this._setBigWin(info.bigWinner);
      this._setZjps(info.zjps,info.bigWinner,info.zjpsArry);
    },
    //设置最佳炮手
    _setZjps:function(winState,bigWinner,zjpsArry){
        //表示有2个炮手
        if(zjpsArry.length >=2){
            //最佳炮手为真，并且不是大赢家
            if(winState && !bigWinner){
                this._zjpsImg.setVisible(true);
            }
            else{
                this._zjpsImg.setVisible(false);
            }
        }
        else{
            //最佳炮手为真
            if(winState){
                this._zjpsImg.setVisible(true);
            }
            else{
                this._zjpsImg.setVisible(false);
            }
        }
    },
    //设置节点显示隐藏
    setNodeVisible:function(vis){
     this._node.setVisible(vis);
    },
    //获得节点
    getNode:function(){
        return this._node;
    },
});

