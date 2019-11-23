<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use Think\Db;
use app\common\controller\Url;

/**
 * 使用物品
 *
 * @icon fa fa-user
 */
//使用物品控制器
class Usegoods extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Usegoods');
        $this->getUrl = new Url();
    }

    public function commonFun($msg,$result,$order){
        $ip = config('IP');
        $arr = $post_data = array (
            "msg" => $msg,//下级玩家的uid
            "result" => $result
        );
        $param = json_encode($arr,JSON_UNESCAPED_UNICODE);
        $post_data = array (
            "mode" => "gm",
            "act" => "useGoodNotice",
            "order" => $order,
            "param" => $param
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    /**
     * 查看
     */
    public function index(){
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
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->field("(case status when 0 then '未审核' when 1 then '成功' else '失败' end) as whether,(case good_id when 7 then '宽带账户' else '电视账户' end) as whether1,use_goods.*")
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }
        $test = "2";
        $this->assign("test",$test);
        return $this->view->fetch();
    }
    //显示修改界面
    public function edit($ids=NULL){
        //echo $ids;
        $list = $this->model->where("id='$ids'")->select();
        $list = $list[0];
        $this->assign("list",$list);
        return $this->view->fetch();
    }
    //保存成功的数据
    public function editSave(){
        $id = $_POST["id"];
        $status = $_POST["status"];
        $good_id = $_POST["good_id"];
        $order_id = $_POST["order_id"];
        $data["status"] = $status;
        $data["complete_time"] = date("Y-m-d H:i:s");
        $row = $this->model->where("id='$id'")->update($data);
        if($row=true){
            if($good_id==7 or $good_id==8){
                $msg = "成功";
                $result = "1";
                $row1 = $this->commonFun($msg,$result,$order_id);
                if($row1=true){
                    echo json_encode("success");
                }
            }
            else {
                $msg = "成功";
                $result = "1";
                $row1 = $this->commonFun($msg,$result,$order_id);
                if($row1=true){
                    echo json_encode("success");
                }
            }
        }
    }
    //保存失败的数据
    public function editSave1(){
        $id = $_POST["id"];
        $status = $_POST["status"];
        $reason = $_POST["reason"];
        $good_id = $_POST["good_id"];
        $order_id = $_POST["order_id"];
        $data["complete_time"] = date("Y-m-d H:i:s");
        $data["status"] = $status;
        $data["faile_reason"] = $reason;
        $row = $this->model->where("id='$id'")->update($data);
        if($row=true){
            if($good_id==7 or $good_id==8){
                $msg = $reason;
                $result = "2";
                $row1 = $this->commonFun($msg,$result,$order_id);
                if($row1=true){
                    echo json_encode("success");
                }
            }
            else {
                $msg = $reason;
                $result = "2";
                $row1 = $this->commonFun($msg,$result,$order_id);
                if($row1=true){
                    echo json_encode("success");
                }
            }
        }
    }
}
