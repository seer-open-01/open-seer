<?php

namespace app\admin\controller\player;

use app\common\controller\Backend;
use Think\Db;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Room extends Backend
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
    public function indexs(){
        $row = $this->model
            //->join("left join fastadmin.`status` on fastadmin.`status`.id=goods_log.event_id")
            ->join('status','status.ids=goods_log.event_id')
            ->field("status.name")
            //SELECT * FROM goods_log LEFT JOIN fastadmin.`status` ON fastadmin.`status`.id=goods_log.event_id
            //join('__WORK__','__ARTIST__.id = __WORK__.artist_id')
            ->select();
        echo "<pre>";var_dump($row);
    }
    public function index1(){
        $row = $this->model
            ->where("id='2'")
            ->join('status','status.ids=goods_log.event_id')
            ->select();echo "<pre>";var_dump($row);
    }
    /**
     * 查看
     */
    public function index()
    {
        /*echo "这是监控列表";
        return $this->view->fetch("player/monitor/index");*/
        //$db = Db::connect("player");
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
                ->where("id='2'")
                ->join('status','status.ids=goods_log.event_id')
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->where("id='2'")
                ->join('status','status.ids=goods_log.event_id')
                //->field("status.name as names")
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);
            return json($result);
        }
        return $this->view->fetch();
    }
}
