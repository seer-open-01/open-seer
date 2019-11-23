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
        $result = json_decode($result,true);//echo "<pre>";var_dump($result);
        $code = $result["code"];
        if($code==200){
            $num = $result["num"];
            $arr = json_decode($num,true);
            $array[0] = $arr["BTC"];
            $array[1] = $arr["USDT"];
            $array[2] = $arr["ETH"];
            $array[3] = $arr["SEER"];
            //"BTC:"+data[0]+";"+"USDT:"+data[1]+";"+"ETH:"+data[2]+";"+"SEER:"+data[3]
            echo json_encode("BTC:".$array[0].";"."USDT:".$array[1].";"."ETH:".$array[2].";"."SEER:".$array[3]);
        }
        else {
            $msg = $result["msg"];
            echo json_encode($msg,JSON_UNESCAPED_UNICODE);
        }
    }
}
