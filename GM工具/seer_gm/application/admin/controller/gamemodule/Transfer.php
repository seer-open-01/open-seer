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
class Transfer extends Backend
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

    public function commonFun($from,$to,$num){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "transfer",
            "from" => $from,
            "to" => $to,
            "num" => $num
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
    public function set()
    {
        $from = $_POST["from"];
        $to = $_POST["to"];
        $num = $_POST["num"];
        $result = $this->commonFun($from,$to,$num);
        $result = json_decode($result,true);
        $code = $result["code"];
        if($code==200){
            $serverCost = $result["serverCost"];
            echo json_encode("服务费".$serverCost,JSON_UNESCAPED_UNICODE);
        }
        else {
            $msg = $result["msg"];
            echo json_encode($msg,JSON_UNESCAPED_UNICODE);
        }
    }
}
