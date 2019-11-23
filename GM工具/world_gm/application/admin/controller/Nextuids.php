<?php

namespace app\admin\controller;

use app\common\controller\Backend;
use think\db;
/**
 * 玩家模块下面的玩家列表
 *
 * @icon fa fa-user
 */
class Nextuids extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Player');
    }

    //列表页面
    public function index($id=NULL){
        $this->assign("uid",$id);
        $row = $this->model->where("uid='$id'")->select();
        $next_uids = $row[0]["next_uids"];
        $next_uids = str_replace("[","",$next_uids);
        $next_uids = str_replace("]","",$next_uids);
        if(empty($next_uids)){
            $next_uids = "''";
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
                    ->where("uid in ($next_uids)")
                    ->order($sort, $order)
                    ->count();
                $list = $this->model
                    //->with('group')
                    ->where($where)
                    ->where("uid in ($next_uids)")
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();
                $result = array("total" => $total, "rows" => $list);

                return json($result);
            }
            return $this->view->fetch();
        }
        else {
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
                    ->where("uid in ($next_uids)")
                    ->order($sort, $order)
                    ->count();
                $list = $this->model
                    //->with('group')
                    ->where($where)
                    ->where("uid in ($next_uids)")
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();
                $result = array("total" => $total, "rows" => $list);

                return json($result);
            }
            return $this->view->fetch();
        }
    }
    //查看下级玩家的集合
    public function see(){
        $id = $_GET["id"];
        $row = $this->model->where("uid='$id'")->select();
        $next_uids = $row[0]["next_uids"];
        $arr = json_decode($next_uids,true);
        echo "<pre>";var_dump($arr);
    }
}
