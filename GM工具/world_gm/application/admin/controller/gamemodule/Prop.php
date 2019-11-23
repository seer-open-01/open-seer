<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use think\paginator\driver\Bootstrap;
use Think\Db;
use app\common\controller\Url;
/**
 * 道具配置
 *
 * @icon fa fa-user
 */
class Prop extends Backend
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

    //查询道具信息
    public function commonFun(){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "getBoonCfg"
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    public function commonFun1($id){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "getBoonCfg",
            "id" => $id
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //修改福利数据操作
    public function commonFun2($id,$cfg){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "modifyBoon",
            "id" => $id,
            "cfg" => $cfg
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //查看
    public function index(){
        $row = $this->commonFun();
        $arr = json_decode($row,true);
        $arr = $arr["cfg"];
        $arr = array_merge($arr);//echo "<pre>";var_dump($arr);
        $this->assign("list",$arr);
        return $this->view->fetch();
    }
    //显示道具修改信息页面
    public function edit($ids = NULL){
        $id = $_GET["id"];//echo $id;echo "<br>";
        $row = $this->commonFun1($id);//echo $row;
        $list = json_decode($row,true);
        $list = $list["cfg"];
        $this->assign("id",$id);
        $this->assign("list",$list);
        return $this->view->fetch();
    }
    //保存道具修改保存操作
    public function editSave(){
        $order = $_POST["order"];
        $id = $_POST["id"];
        $num = $_POST["num"];
        $prop = $_POST["prop"];
        $cfg = '{"id":'.$id.',"num":'.$num.',"prop":'.$prop.'}';
        $row = $this->commonFun2($order,$cfg);
        $arr = json_decode($row,true);
        if($arr=true){
            echo json_encode(1);
        }
    }

}
