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
class Operatesc extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */

    public function _initialize()
    {
        parent::_initialize();
        $this->getUrl = new Url();
    }
    //创建平台
    public function commonFun($command){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "OperateSC",
            "command" => $command
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }

    /**
     * 查看
     */
    public function index(){
        return $this->fetch();
    }
    public function set(){
        //0表示 停止新用户划转 1表示 开启新用户划转 3表示清理无余额的用户 4表示退回保证金
        $command = $_POST["command"];
        $result = $this->commonFun($command);
        $result = json_decode($result,true);
        $code = $result["code"];
        if($code==400){
            $msg = $result["msg"];
            echo json_encode($msg,JSON_UNESCAPED_UNICODE);
        }
        else{
            $msg = $result["msg"];
            $serverCost = $result["serverCost"];
            $array[0] = $msg;
            $array[1] = $serverCost;
            echo json_encode($serverCost,JSON_UNESCAPED_UNICODE);
        }
    }
}
