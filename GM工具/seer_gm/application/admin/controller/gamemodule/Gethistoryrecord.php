<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use think\paginator\driver\Bootstrap;
use Think\Db;
use app\common\controller\Url;

/**
 * 获取历史记录
 *
 * @icon fa fa-user
 */
class Gethistoryrecord extends Backend
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
    public function commonFun($account){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "getHistoryRecord",
            "account" => $account
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }

    /**
     * 查看
     */
    public function index(){
        return $this->fetch();
    }
    public function gethistoryrecord(){
        $account = $_POST["account"];
        $result = $this->commonFun($account);
        $order = "\\n\\r";
        $replace = "<br/>";
        $result = str_replace($order,$replace,$result);
        echo json_encode($result,JSON_UNESCAPED_UNICODE);
    }
}
