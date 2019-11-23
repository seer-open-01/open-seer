<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use Think\Db;
use app\common\controller\Url;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Setgm extends Backend
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

    public function commonFun($uid){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "setGM",
            "uid" => $uid
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }

    /**
     * 查看
     */
    public function index()
    {
        $row = $this->model->select();
        $this->assign('list',$row);
        return $this->view->fetch();
    }
    public function set(){
        $uids = $_POST["uids"];
        $row = $this->commonFun($uids);
        $arr = json_decode($row,true);
        $msg = $arr["msg"];
        echo json_encode($msg);
    }
}
