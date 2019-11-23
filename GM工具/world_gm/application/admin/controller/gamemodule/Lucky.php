<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use think\paginator\driver\Bootstrap;
use Think\Db;
use app\common\controller\Url;

/**
 * 幸运值列表
 *
 * @icon fa fa-user
 */
class Lucky extends Backend
{

    protected $relationSearch = true;

    /**
     * 模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Player');
        $this->getUrl = new Url();
    }

    //查询幸运值接口
    public function commonFun($uid){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "queryLuck",
            "uid" => $uid
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //修改某玩家幸运值接口
    public function commonFun1($uid,$ddz,$psz,$ps){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "modifyLuck",
            "uid" => $uid,
            "ddz" => $ddz,
            "psz" => $psz,
            "ps" => $ps
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //查看
    public function indexx(){
        $uid = "";
        $this->assign("uid",$uid);
        $player = $this->model->select();
        $this->assign("player",$player);
        return $this->fetch("");
    }

    //显示修改玩家幸运值页面
    public function edit($ids = NULL){
        $uid = $_GET['uid'];
        $value = $this->commonFun($uid);
        $arr = json_decode($value,true);
        $ddz = $arr["ddz"];
        $psz = $arr["psz"];
        $ps = $arr["ps"];
        $this->assign("uid",$uid);//得到玩家uid
        $this->assign("ddz",$ddz);//得到斗地主的幸运值
        $this->assign("psz",$psz);//得到拼三张的幸运值
        $this->assign("ps",$ps);//得到拼十的幸运值
        return $this->fetch("gamemodule/lucky/edit");
    }
    //修完某玩家幸运值保存
    public function editSave(){
        $uid = $_POST["uid"];
        $ddz = $_POST["ddz"];
        $psz = $_POST["psz"];
        $ps = $_POST["ps"];
        $row = $this->commonFun1($uid,$ddz,$psz,$ps);
        echo json_encode($uid);
    }

    public function json($uid){
        return $this->commonFun($uid);
    }
    public function index2(){
        $player = $this->model->select();
        $this->assign("player",$player);
        $this->assign("uid","100001");
        $this->assign("ddz","3423");
        $this->assign("psz","3423");
        $this->assign("ps","3423");
        return $this->fetch("test/haode/null");
    }
    public function index(){
        $player = $this->model->select();
        $this->assign("player",$player);
        if(input("post.uid")){//条件查询
            $query=['uid'=>input("post.uid")];
            //echo "<pre>";var_dump($query);
        }
        elseif(input("get.uid")){//分页查询
            $query=['uid'=>input("get.uid")];
        }
        else{//初始或者无条件的按钮操作
            $query=['uid'=>input("get.uid")];
        }
        $uid = $query["uid"];
        $uid = substr($uid,0,6);//echo $uid;echo "<br>";
        $this->assign("uid",$uid);//echo $uid;
        $json = $this->json($uid);//echo $json;echo "<br>";
        $arr = json_decode($json,true);//echo "<pre>";var_dump($arr);
        $data = $arr;   //需要输出的数组
        $code = $data["code"];
        if($code=="401"){

            return $this->fetch("test/haode/null");
        }
        else if($code=="200"){
            $code = $data["code"];
            $msg = $data["msg"];
            $uid = $data["uid"];
            $ddz = $data["ddz"];
            $psz = $data["psz"];
            $ps = $data["ps"];
            //echo "不为null";
            $this->assign("ddz",$ddz);
            $this->assign("psz",$psz);
            $this->assign("ps",$ps);
            return $this->fetch();
        }
    }
    //修改过后显示的列表页面
    public function index1(){
        $uid = $_GET["uid"];
        $this->assign("uid",$uid);
        $player = $this->model->select();
        $this->assign("player",$player);
        $json = $this->json($uid);
        $arr = json_decode($json,true);
        $data = $arr;
        $code = $data["code"];
        $msg = $data["msg"];
        $uid = $data["uid"];
        $ddz = $data["ddz"];
        $psz = $data["psz"];
        $ps = $data["ps"];
        //echo "不为null";
        $this->assign("ddz",$ddz);
        $this->assign("psz",$psz);
        $this->assign("ps",$ps);
        return $this->fetch("test/haode/index");
    }
}
