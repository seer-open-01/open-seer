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
class Seer extends Backend
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

    public function commonFun($account){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "getAccountBalances",
            "account" => $account
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }

    /**
     * 查看
     */
    public function index()
    {
        return $this->view->fetch();
    }
    //查询
    public function cha()
    {
        $account = $_POST["account"];
        $result = $this->commonFun($account);
        $result = json_decode($result,true);
        $code = $result["code"];
        if($code==200){
            $num = $result["num"];
            echo json_encode("账户余额:".$num);
        }
        else {
            $msg = $result["msg"];
            echo json_encode($msg,JSON_UNESCAPED_UNICODE);
        }
    }
}
