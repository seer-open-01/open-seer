<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use Think\Db;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Xiangqi extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Xiangqi');
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

            list($where,$sort,$order,$offset,$limit) = $this->buildparams("uid");
            $total = $this->model
                //->with('group')
                ->where($where)
                ->where("match_id = 0 and event_id = 2")
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->where("match_id = 0 and event_id = 2")
                ->field("(case match_id when 0 then '自建房' else '为服务器配置的金币场信息' end) as whether,(case id when 1 then '金豆' when 2 then '房卡' else '钻石' end) as whether1,(case event_id when 1 then '开房消耗' when 2 then '比赛输赢' when 3 then '邮件获取' when 4 then '充值获取' when 5 then '兑换' when 6 then '服务费' when 7 then '银行更新' when 8 then 'BSC充值获取' else 'BSC提现' end) as whether2,goods_log.*")
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);
            return json($result);
        }
        return $this->view->fetch();
    }

}
