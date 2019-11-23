<?php

namespace app\admin\controller\player;

use app\common\controller\Backend;
use Think\Db;

/**
 * pfc提现记录列表
 *
 * @icon fa fa-user
 */
class Pfcwithdraw extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Pfcwithdraw');
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
        $to_chain = $_POST["to_chain"];
        $in_asset_name = $_POST["in_asset_name"];
        $in_amount = $_POST["in_amount"];
        $out_asset_name = $_POST["out_asset_name"];
        $out_amount = $_POST["out_amount"];
        $seq = $_POST["seq"];
        $txid = $_POST["txid"];
        $type = $_POST["type"];
        $before_beans = $_POST["before_beans"];
        $before_extend_beans = $_POST["before_extend_beans"];
        $with_amount = $_POST["with_amount"];
        $brokerage = $_POST["brokerage"];
        $after_beans = $_POST["after_beans"];
        $after_extend_beans = $_POST["after_extend_beans"];
        $time = $_POST["time"];
        $status = $_POST["status"];
        $address = $_POST["address"];
        $where = "(pfc_withdraw_log.uid IS NULL OR pfc_withdraw_log.uid LIKE '%$uid%') and (pfc_withdraw_log.to_chain IS NULL OR pfc_withdraw_log.to_chain LIKE '%$to_chain%') and (pfc_withdraw_log.in_asset_name IS NULL OR pfc_withdraw_log.in_asset_name LIKE '%$in_asset_name%') and (pfc_withdraw_log.in_amount IS NULL OR pfc_withdraw_log.in_amount LIKE '%$in_amount%') and (pfc_withdraw_log.out_asset_name IS NULL OR pfc_withdraw_log.out_asset_name LIKE '%$out_asset_name%') and (pfc_withdraw_log.out_amount IS NULL OR pfc_withdraw_log.out_amount LIKE '%$out_amount%') and (pfc_withdraw_log.seq IS NULL OR pfc_withdraw_log.seq LIKE '%$seq%') and (pfc_withdraw_log.txid IS NULL OR pfc_withdraw_log.txid LIKE '%$txid%') and (pfc_withdraw_log.type IS NULL OR pfc_withdraw_log.type LIKE '%$type%') and (pfc_withdraw_log.before_beans IS NULL OR pfc_withdraw_log.before_beans LIKE '%$before_beans%') and (pfc_withdraw_log.before_extend_beans IS NULL OR pfc_withdraw_log.before_extend_beans LIKE '%$before_extend_beans%') and (pfc_withdraw_log.with_amount IS NULL OR pfc_withdraw_log.with_amount LIKE '%$with_amount%') and (pfc_withdraw_log.brokerage IS NULL OR pfc_withdraw_log.brokerage LIKE '%$brokerage%') and (pfc_withdraw_log.after_beans IS NULL OR pfc_withdraw_log.after_beans LIKE '%$after_beans%') and (pfc_withdraw_log.after_extend_beans IS NULL OR pfc_withdraw_log.after_extend_beans LIKE '%$after_extend_beans%') and (pfc_withdraw_log.time IS NULL OR pfc_withdraw_log.time LIKE '%$time%') and (pfc_withdraw_log.status IS NULL OR pfc_withdraw_log.status LIKE '%$status%') and (pfc_withdraw_log.address IS NULL OR pfc_withdraw_log.address LIKE '%$address%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
            ->where($where)
            ->where($where1)
            ->join('user_list','user_list.uid = pfc_withdraw_log.uid')
            ->sum('in_amount');
        echo json_encode($sum);
    }
}
