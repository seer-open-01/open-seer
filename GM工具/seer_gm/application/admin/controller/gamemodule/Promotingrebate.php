<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use think\paginator\driver\Bootstrap;
use Think\Db;
use app\common\controller\Url;

/**
 * 推广返利
 *
 * @icon fa fa-user
 */
class Promotingrebate extends Backend
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

    //获取推广员返利值
    public function commonFun(){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "getRebate"
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //设置返利结果
    public function commonFun1($self,$pre,$pre_pre){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "setRebate",
            "self" => $self,
            "pre" => $pre,
            "pre_pre" => $pre_pre
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //查看
    public function index(){
        $row = $this->commonFun();
        $arr = json_decode($row,true);
        $code = $arr["code"];
        if($code=="200"){
            $self = $arr["self"];
            $pre = $arr["pre"];
            $pre_pre = $arr["pre_pre"];
            $this->assign("self",$self);
            $this->assign("pre",$pre);
            $this->assign("pre_pre",$pre_pre);
            //$sum = $self+$pre+$pre_pre;echo $sum;
            return $this->view->fetch();
        }
        else {
            echo "服务器异常";
        }
    }
    //三个返利总和不能超过100%
    public function set(){
        $self = $_POST["self"];
        $pre = $_POST["pre"];
        $pre_pre = $_POST["pre_pre"];
        $sum = ($self*10000+$pre*10000+$pre_pre*10000)/10000;
        if($sum>=1 || $sum<=0){
            echo json_encode("-1");
        }
        else {
            $row = $this->commonFun1($self,$pre,$pre_pre);
            if($row=true){
                echo json_encode($sum);
            }
        }
    }
}
