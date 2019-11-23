<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use think\paginator\driver\Bootstrap;
use Think\Db;
use app\common\controller\Url;
/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Online extends Backend
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

    //查询幸运值接口
    public function commonFun(){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "getServerInfo"
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //查看
    public function index(){
        $row = $this->commonFun();
        $arr = json_decode($row,true);
        $all = $arr["all"];
        $this->assign("all",$all);
        return $this->view->fetch();
    }
    //刷新按钮
    public function refresh(){
        $row = $this->commonFun();
        $arr = json_decode($row,true);
        $all = $arr["all"];
        echo json_encode($all);
    }

}
