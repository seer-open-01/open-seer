<?php

namespace app\admin\controller\player;

use app\common\controller\Backend;
use Think\Db;

/**
 * 服务费列表
 *
 * @icon fa fa-user
 */
class Servicerecord extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Diamond');
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
            list($where,$sort,$order,$offset,$limit) = $this->buildparams("uid,wx_name,match_id,num,plus_diamonds");
            $total = $this->model
                //->with('group')
                ->where($where)
                ->where("event_id='6'")
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->where("event_id='6'")
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $aa = "-100";
            $result = array("total" => $total, "rows" => $list ,"aa"=>$aa);
            //echo '<pre>'; var_dump($result);
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
        $match_id = $_POST["match_id"];
        $num = $_POST["num"];
        $plus_diamonds = $_POST["plus_diamonds"];
        $time = $_POST["time"];
        $where = "event_id='6' and (uid IS NULL OR uid LIKE '%$uid%') and (wx_name IS NULL OR wx_name LIKE '%$wx_name%') and (match_id IS NULL OR match_id LIKE '%$match_id%') and (num IS NULL OR num LIKE '%$num%') and (plus_diamonds IS NULL OR plus_diamonds LIKE '%$plus_diamonds%') and (time IS NULL OR time LIKE '%$time%')";
        /*$sum1 = $this->model->where($where)->where("num>=0")->sum('num');
        $sum2 = $this->model->where($where)->where("num<0")->sum('num');
        $sum = $sum1-$sum2;*/
        $sum = $this->model->where($where)->field("SUM(ABS(num)) as sum")->select();
        $sum = $sum[0]["sum"];
        $sum = (int)$sum;//将其$num变量转为int类型字符，以免在页面上输出数字时还加以上了一对引号
        echo json_encode($sum);
    }
}
