<?php

namespace app\admin\controller\player;

use app\common\controller\Backend;
use think\db;
/**
 * 公司收益列表
 *
 * @icon fa fa-user
 */
class Companyprofit extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Companyprofit');
        $this->model1 = model('Log');
    }
    //列表页面
    public function index()
    {
        if ($this->request->isAjax())
        {
            list($where, $sort, $order, $offset, $limit) = $this->buildparams();
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
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        $ip = config('IP1');
        $this->assign("ip",$ip);
        return $this->view->fetch();
    }
    //公司盈亏总和为
    public function companyprofitSum(){
        $uid = $_POST["uid"];
        $wx_name = $_POST["wx_name"];
        $num = $_POST["num"];
        $profit_time = $_POST["profit_time"];
        $time = $_POST["time"];
        $finance_type = $_POST["finance_type"];
        $where = "(company_profit.uid IS NULL OR company_profit.uid LIKE '%$uid%') and (company_profit.profit_time IS NULL OR company_profit.profit_time LIKE '%$profit_time%') and (company_profit.num IS NULL OR company_profit.num LIKE '%$num%') and (company_profit.finance_type IS NULL OR company_profit.finance_type LIKE '%$finance_type%') and (company_profit.time IS NULL OR company_profit.time LIKE '%$time%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
                    ->where($where)
                    ->where($where1)
                    ->join('user_list','user_list.uid = company_profit.uid')
                    ->sum('num');
        echo json_encode($sum);
    }
    //比赛服务费(入账)
    public function bsfwfrz(){
        $uid = $_POST["uid"];
        $wx_name = $_POST["wx_name"];
        $num = $_POST["num"];
        $profit_time = $_POST["profit_time"];
        $time = $_POST["time"];
        $finance_type = $_POST["finance_type"];
        $where = "finance_type='1' and (company_profit.uid IS NULL OR company_profit.uid LIKE '%$uid%') and (company_profit.profit_time IS NULL OR company_profit.profit_time LIKE '%$profit_time%') and (company_profit.num IS NULL OR company_profit.num LIKE '%$num%') and (company_profit.finance_type IS NULL OR company_profit.finance_type LIKE '%$finance_type%') and (company_profit.time IS NULL OR company_profit.time LIKE '%$time%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
            ->where($where)
            ->where($where1)
            ->join('user_list','user_list.uid = company_profit.uid')
            ->sum('num');
        echo json_encode($sum);
    }
    //公司内部充值(入账)
    public function gsnbczrz(){
        $uid = $_POST["uid"];
        $wx_name = $_POST["wx_name"];
        $num = $_POST["num"];
        $profit_time = $_POST["profit_time"];
        $time = $_POST["time"];
        $finance_type = $_POST["finance_type"];
        $where = "finance_type='2' and (company_profit.uid IS NULL OR company_profit.uid LIKE '%$uid%') and (company_profit.profit_time IS NULL OR company_profit.profit_time LIKE '%$profit_time%') and (company_profit.num IS NULL OR company_profit.num LIKE '%$num%') and (company_profit.finance_type IS NULL OR company_profit.finance_type LIKE '%$finance_type%') and (company_profit.time IS NULL OR company_profit.time LIKE '%$time%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
            ->where($where)
            ->where($where1)
            ->join('user_list','user_list.uid = company_profit.uid')
            ->sum('num');
        echo json_encode($sum);
    }
    //节点奖励(出账)
    public function jdjlcz(){
        $uid = $_POST["uid"];
        $wx_name = $_POST["wx_name"];
        $num = $_POST["num"];
        $profit_time = $_POST["profit_time"];
        $time = $_POST["time"];
        $finance_type = $_POST["finance_type"];
        $where = "finance_type='3' and (company_profit.uid IS NULL OR company_profit.uid LIKE '%$uid%') and (company_profit.profit_time IS NULL OR company_profit.profit_time LIKE '%$profit_time%') and (company_profit.num IS NULL OR company_profit.num LIKE '%$num%') and (company_profit.finance_type IS NULL OR company_profit.finance_type LIKE '%$finance_type%') and (company_profit.time IS NULL OR company_profit.time LIKE '%$time%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
            ->where($where)
            ->where($where1)
            ->join('user_list','user_list.uid = company_profit.uid')
            ->sum('num');
        echo json_encode($sum);
    }
    //提现服务费(入账)
    public function txfwfrz(){
        $uid = $_POST["uid"];
        $wx_name = $_POST["wx_name"];
        $num = $_POST["num"];
        $profit_time = $_POST["profit_time"];
        $time = $_POST["time"];
        $finance_type = $_POST["finance_type"];
        $where = "finance_type='4' and (company_profit.uid IS NULL OR company_profit.uid LIKE '%$uid%') and (company_profit.profit_time IS NULL OR company_profit.profit_time LIKE '%$profit_time%') and (company_profit.num IS NULL OR company_profit.num LIKE '%$num%') and (company_profit.finance_type IS NULL OR company_profit.finance_type LIKE '%$finance_type%') and (company_profit.time IS NULL OR company_profit.time LIKE '%$time%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
            ->where($where)
            ->where($where1)
            ->join('user_list','user_list.uid = company_profit.uid')
            ->sum('num');
        echo json_encode($sum);
    }
    //抽奖消耗(入账)
    public function cjxhrz(){
        $uid = $_POST["uid"];
        $wx_name = $_POST["wx_name"];
        $num = $_POST["num"];
        $profit_time = $_POST["profit_time"];
        $time = $_POST["time"];
        $finance_type = $_POST["finance_type"];
        $where = "finance_type='5' and (company_profit.uid IS NULL OR company_profit.uid LIKE '%$uid%') and (company_profit.profit_time IS NULL OR company_profit.profit_time LIKE '%$profit_time%') and (company_profit.num IS NULL OR company_profit.num LIKE '%$num%') and (company_profit.finance_type IS NULL OR company_profit.finance_type LIKE '%$finance_type%') and (company_profit.time IS NULL OR company_profit.time LIKE '%$time%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
            ->where($where)
            ->where($where1)
            ->join('user_list','user_list.uid = company_profit.uid')
            ->sum('num');
        echo json_encode($sum);
    }
    //抽奖获得(出账)
    public function cjxhcz(){
        $uid = $_POST["uid"];
        $wx_name = $_POST["wx_name"];
        $num = $_POST["num"];
        $profit_time = $_POST["profit_time"];
        $time = $_POST["time"];
        $finance_type = $_POST["finance_type"];
        $where = "finance_type='6' and (company_profit.uid IS NULL OR company_profit.uid LIKE '%$uid%') and (company_profit.profit_time IS NULL OR company_profit.profit_time LIKE '%$profit_time%') and (company_profit.num IS NULL OR company_profit.num LIKE '%$num%') and (company_profit.finance_type IS NULL OR company_profit.finance_type LIKE '%$finance_type%') and (company_profit.time IS NULL OR company_profit.time LIKE '%$time%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
            ->where($where)
            ->where($where1)
            ->join('user_list','user_list.uid = company_profit.uid')
            ->sum('num');
        echo json_encode($sum);
    }
    //任务奖励(出账)
    public function rwjlcz(){
        $uid = $_POST["uid"];
        $wx_name = $_POST["wx_name"];
        $num = $_POST["num"];
        $profit_time = $_POST["profit_time"];
        $time = $_POST["time"];
        $finance_type = $_POST["finance_type"];
        $where = "finance_type='7' and (company_profit.uid IS NULL OR company_profit.uid LIKE '%$uid%') and (company_profit.profit_time IS NULL OR company_profit.profit_time LIKE '%$profit_time%') and (company_profit.num IS NULL OR company_profit.num LIKE '%$num%') and (company_profit.finance_type IS NULL OR company_profit.finance_type LIKE '%$finance_type%') and (company_profit.time IS NULL OR company_profit.time LIKE '%$time%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
            ->where($where)
            ->where($where1)
            ->join('user_list','user_list.uid = company_profit.uid')
            ->sum('num');
        echo json_encode($sum);
    }
    //大喇叭(入账)
    public function dlbrz(){
        $uid = $_POST["uid"];
        $wx_name = $_POST["wx_name"];
        $num = $_POST["num"];
        $profit_time = $_POST["profit_time"];
        $time = $_POST["time"];
        $finance_type = $_POST["finance_type"];
        $where = "finance_type='8' and (company_profit.uid IS NULL OR company_profit.uid LIKE '%$uid%') and (company_profit.profit_time IS NULL OR company_profit.profit_time LIKE '%$profit_time%') and (company_profit.num IS NULL OR company_profit.num LIKE '%$num%') and (company_profit.finance_type IS NULL OR company_profit.finance_type LIKE '%$finance_type%') and (company_profit.time IS NULL OR company_profit.time LIKE '%$time%')";
        $where1 = "(user_list.wx_name IS NULL OR user_list.wx_name LIKE '%$wx_name%')";
        $sum = $this->model
            ->where($where)
            ->where($where1)
            ->join('user_list','user_list.uid = company_profit.uid')
            ->sum('num');
        echo json_encode($sum);
    }
}
