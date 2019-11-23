<?php

namespace app\admin\controller\player;

use app\common\controller\Backend;
use Think\Db;

/**
 * pfc充值记录列表
 *
 * @icon fa fa-user
 */
class Pfcrecharge extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Pfcrecharge');
    }
    /**
     * 查看
     */
    public function index()
    {
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
            $this->assign("aa","aa");
            list($where,$sort,$order,$offset,$limit) = $this->buildparams("");
            $total = $this->model
                ->with(["category"])
                ->where($where)
                ->order($sort, $order)
                ->count();
            $list = $this->model
                ->with(["category"])
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list );
            return json($result);
        }
        $ip = config('IP1');
        $this->assign("ip",$ip);
        return $this->view->fetch();
    }
    //查看总数计和
    public function sum(){
        $uid = $_POST["uid"];
        $wx_name = $_POST["wx_name"];
        $account_id = $_POST["account_id"];
        $asset_name = $_POST["asset_name"];
        $address_type = $_POST["address_type"];
        $amount = $_POST["amount"];
        $seq = $_POST["seq"];
        $tx_from = $_POST["tx_from"];
        $tx_to = $_POST["tx_to"];
        $tx_hash = $_POST["tx_hash"];
        $ts = $_POST["ts"];
        $time = $_POST["time"];
        $where = "(pfc_recharge_log.uid IS NULL OR pfc_recharge_log.uid LIKE '%$uid%') and (pfc_recharge_log.account_id IS NULL OR pfc_recharge_log.account_id LIKE '%$account_id%') and (pfc_recharge_log.asset_name IS NULL OR pfc_recharge_log.asset_name LIKE '%$asset_name%') and (pfc_recharge_log.address_type IS NULL OR pfc_recharge_log.address_type LIKE '%$address_type%') and (pfc_recharge_log.amount IS NULL OR pfc_recharge_log.amount LIKE '%$amount%') and (pfc_recharge_log.seq IS NULL OR pfc_recharge_log.seq LIKE '%$seq%') and (pfc_recharge_log.tx_from IS NULL OR pfc_recharge_log.tx_from LIKE '%$tx_from%') and (pfc_recharge_log.tx_to IS NULL OR pfc_recharge_log.tx_to LIKE '%$tx_to%') and (pfc_recharge_log.tx_hash IS NULL OR pfc_recharge_log.tx_hash LIKE '%$tx_hash%') and (pfc_recharge_log.ts IS NULL OR pfc_recharge_log.ts LIKE '%$ts%') and (pfc_recharge_log.time IS NULL OR pfc_recharge_log.time LIKE '%$time%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
            ->where($where)
            ->where($where1)
            ->join('user_list','user_list.uid = pfc_recharge_log.uid')
            ->sum('amount');
        echo json_encode($sum);
    }
    //统计有多少个人充值了
    public function sumpeople(){
        $uid = $_POST["uid"];
        $wx_name = $_POST["wx_name"];
        $account_id = $_POST["account_id"];
        $asset_name = $_POST["asset_name"];
        $address_type = $_POST["address_type"];
        $amount = $_POST["amount"];
        $seq = $_POST["seq"];
        $tx_from = $_POST["tx_from"];
        $tx_to = $_POST["tx_to"];
        $tx_hash = $_POST["tx_hash"];
        $ts = $_POST["ts"];
        $time = $_POST["time"];
        $where = "(pfc_recharge_log.uid IS NULL OR pfc_recharge_log.uid LIKE '%$uid%') and (pfc_recharge_log.account_id IS NULL OR pfc_recharge_log.account_id LIKE '%$account_id%') and (pfc_recharge_log.asset_name IS NULL OR pfc_recharge_log.asset_name LIKE '%$asset_name%') and (pfc_recharge_log.address_type IS NULL OR pfc_recharge_log.address_type LIKE '%$address_type%') and (pfc_recharge_log.amount IS NULL OR pfc_recharge_log.amount LIKE '%$amount%') and (pfc_recharge_log.seq IS NULL OR pfc_recharge_log.seq LIKE '%$seq%') and (pfc_recharge_log.tx_from IS NULL OR pfc_recharge_log.tx_from LIKE '%$tx_from%') and (pfc_recharge_log.tx_to IS NULL OR pfc_recharge_log.tx_to LIKE '%$tx_to%') and (pfc_recharge_log.tx_hash IS NULL OR pfc_recharge_log.tx_hash LIKE '%$tx_hash%') and (pfc_recharge_log.ts IS NULL OR pfc_recharge_log.ts LIKE '%$ts%') and (pfc_recharge_log.time IS NULL OR pfc_recharge_log.time LIKE '%$time%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
            ->where($where)
            ->where($where1)
            ->join('user_list','user_list.uid = pfc_recharge_log.uid')
            ->group('pfc_recharge_log.uid')
            ->count();
        echo json_encode($sum);
    }
}
