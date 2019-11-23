<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use Think\Db;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Shopset extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;
    protected $model1 = null;
    protected $model2 = null;
    protected $model3 = null;
    protected $model4 = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Shopset');
        $this->model1 = model('Log');
        $this->model2 = model('Player');
        $this->model3 = model('Temporaryrecording');
        $this->model4 = model('Shopconfig');
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

            list($where,$sort,$order,$offset,$limit) = $this->buildparams("itemId,status,cards,giveBean,rmbPrice,giveDiamond");
            $total = $this->model
                //->with('group')
                ->where($where)
                ->field("(case status when 0 then '无状态' when 1 then '热卖' else '推荐' end) as whether,shop_config.*")
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->field("(case status when 0 then '无状态' when 1 then '热卖' else '推荐' end) as whether,shop_config.*")
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);
            return json($result);
        }
        return $this->view->fetch();
    }
    public function edit($ids=""){
        $row = $this->model->where("itemId='$ids'")->select();
        $row = $row[0];
        $this->assign("list",$row);
        return $this->view->fetch();
    }
    public function editSave(){
        //itemId:itemId,rmbPrice:rmbPrice,cards:cards,giveDiamond:giveDiamond
        $itemId = $_POST['itemId'];
        $data['rmbPrice'] = $_POST['rmbPrice'];
        $data['cards'] = $_POST['cards'];
        $data['giveDiamond'] = $_POST['giveDiamond'];
        $row = $this->model->where("itemId='$itemId'")->update($data);
        echo json_encode($row);
    }
    public function batchEdit(){
        $uids = $_GET['itemId'];
        $this->assign('uids',$uids);
        //$row = Db::table("gmt.shop_config")->where("itemId in ($uids)")->select();
        $row = $this->model4->where("itemId in ($uids)")->select();
        //echo "<pre>";var_dump($row);
        $this->assign('list',$row);
        return $this->view->fetch("gamemodule/shopset/batchEdit");
    }
    public function batchEditSave(){

    }
}
