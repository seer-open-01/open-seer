<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use Think\Db;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Phone extends Backend
{
    /**
     * Phone模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Phone');
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

            list($where,$sort,$order,$offset,$limit) = $this->buildparams("order_id,uid,wx_name");
            $total = $this->model
                //->with('group')
                ->where($where)
                ->field("(case state when 0 then '未处理' else '已充值' end) as whether,phone_card.*")
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->field("(case state when 0 then '未处理' else '已充值' end) as whether,phone_card.*")
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);
            return json($result);
        }
        return $this->view->fetch();
    }
    //修改页面
    public function edit($ids = NULL){
        $ids = $this->model->get($ids);
        $id = $ids['id'];
        $row = $this->model->where("id='$id'")->select();
        $row = $row[0];
        $now = date("Y-m-d H:i:s");
        $this->assign('list',$row);
        $this->assign('now',$now);
        return $this->view->fetch();
    }
    public function editSave(){
        $id = $_POST["id"];
        $end_time = $_POST["end_time"];
        $state = $_POST["state"];
        $data["end_time"] = $end_time;
        $data["state"] = $state;
        $row = $this->model->where("id='$id'")->update($data);
        if($row=true){
            echo json_encode($row);
        }
    }
}
