<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use Think\Db;
use app\common\controller\Url;
/**
 * 虚拟充值操作
 *
 * @icon fa fa-user
 */
class Recharge extends Backend
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

    public function commonFun($saiya_account_id,$amount,$sig,$asset_name,$address_type,$seq,$tx_from,$tx_to,$tx_hash,$ts){
        $ip = config('IP');

        $post_data = array (
            "mode" => "gm",
            "act" => "PFCRecharge",
            "saiya_account_id" => $saiya_account_id,
            "amount" => $amount,
            "sig" => $sig,
            "asset_name" => $asset_name,
            "address_type" => $address_type,
            "seq" => $seq,
            "tx_from" => $tx_from,
            "tx_to" => $tx_to,
            "tx_hash" => $tx_hash,
            "ts" => $ts
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
    public function aa(){
        echo time();echo "<br>";
        echo time().str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
    }
    //设置虚拟充值信息
    public function setSave(){
        $saiya_account_id = $_POST['saiya_account_id'];
        $amount = $_POST['amount'];
        $sig = $_POST['sig'];
        $asset_name = $_POST['asset_name'];
        $address_type = $_POST['address_type'];
        $seq = time().str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);//生成唯一的订单号
        $tx_from = $_POST['tx_from'];
        $tx_to = $_POST['tx_to'];
        $tx_hash = $_POST['tx_hash'];
        $ts = time();//获取当前的时间戳
        $row = $this->commonFun($saiya_account_id,$amount,$sig,$asset_name,$address_type,$seq,$tx_from,$tx_to,$tx_hash,$ts);
        if($row=true){
            echo json_encode("1");
        }
    }
}
