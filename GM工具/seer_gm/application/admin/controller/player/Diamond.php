<?php

namespace app\admin\controller\player;

use app\common\controller\Backend;
use Think\Db;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Diamond extends Backend
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
    public function index2(){
        $list = $this->model
            //->with('group')
            //->where($where)
            ->where("id='3'")
            ->join('status','status.ids=goods_log.event_id')
            //->field("status.name as names")
            //->order($sort, $order)
            //->limit($offset, $limit)
            ->select();echo "<pre>";var_dump($list);
    }
    /**
     * 列表页面
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

            list($where,$sort,$order,$offset,$limit) = $this->buildparams("uid,wx_name,status.name,time");
            $total = $this->model
                //->with('group')
                ->where($where)
                ->where("id='3'")
                ->join('status','status.ids=goods_log.event_id')
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->where("id='3'")
                ->join('status','status.ids=goods_log.event_id')
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);
            return json($result);
        }
        return $this->view->fetch();
    }
}
