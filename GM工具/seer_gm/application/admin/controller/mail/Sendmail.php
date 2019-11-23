<?php

namespace app\admin\controller\mail;

use app\common\controller\Backend;
use think\db;
use app\common\controller\Url;
/**
 * 玩家模块下面的玩家列表
 *
 * @icon fa fa-user
 */
class Sendmail extends Backend
{

    protected $relationSearch = true;
    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Player');
        $this->getUrl = new Url();
    }

    //列表页面
    public function index1(){
        return $this->view->fetch();
    }
    public function index(){
        $row = $this->model->select();//echo "<pre>";var_dump($row);
        $this->assign('list',$row);
        return $this->view->fetch();
    }

    public function commonFun($uid,$goods){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "sendMails",
            "uids" => $uid,
            "goods" => $goods
        );
        $this->getUrl->commonFun($ip,$post_data);
    }
    public function set1(){
        echo "set1";
    }
    //操作 设置奖池峰值
    public function set2(){
        $uid = $_POST["uid"];
        $goods = $_POST["goods"];
        $this->commonFun($uid,$goods);
    }
    public function set(){
        $uids = $_POST["uids"];
        $beannums = $_POST["beannums"];
        $roomnums = $_POST["roomnums"];
        //将玩家uid集合只得到玩家的uid
        $uidd = explode(",",$uids);
        $countd = count($uidd);
        $uidf = "";
        for($k=0;$k<$countd;$k++){
            $start = strpos($uidd[$k],"(");
            $end = strpos($uidd[$k],")");
            $uidf .= substr($uidd[$k],0,$start).",";
        }
        $uidf = substr($uidf,0,-1);
        $uidf = "[".$uidf."]";//得到玩家uid的集合
        //$uidf = "100001,100002,100003";
        $nums1 = explode(",",$beannums);
        $nums2 = explode(",",$roomnums);
        $counts = count($nums1);
        $numz = "";
        for($i=0;$i<$counts;$i++){
            $numz .= "{".'"id":'.$nums1[$i].',"num":'.$nums2[$i]."}".",";
        }
        $numz = substr($numz,0,-1);
        $numz = "[".$numz."]";//得到添加数量的集合
        $uidf = json_encode($uidf);
        $numz = json_encode($numz);
        $this->commonFun($uidf,$numz);
        echo json_encode($uidf);
    }

}
