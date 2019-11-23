<?php

namespace app\admin\controller\player;

use app\common\controller\Backend;
use think\db;
/**
 * 玩家模块下面的玩家列表
 *
 * @icon fa fa-user
 */
class Player extends Backend
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
        $this->model1 = model('Log');
    }
    //日志公共方法
    public function logCommon($log,$tname){
        $username = $_SESSION['think']['admin']['username'];
        $data['username'] = $username;
        $data['operation_time'] = date("Y-m-d H:i:s");
        //$data['tname'] = "玩家模块-玩家列表-修改玩家信息";
        $data['tname'] = $tname;
        $data['content'] = $log;
        $row = $this->model1->insert($data);
    }
    //列表页面
    public function index(){
        //$db = Db::connect("player");
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
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            /*foreach ($list as $k => $v)
            {
                $v->hidden(['password', 'salt']);
            }*/
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }

        return $this->view->fetch();
    }

    //修改
    public function edit($ids = NULL)
    {
        $row = $this->model->get($ids);
        if (!$row)
            $this->error(__('No Results were found'));
        $this->view->assign('playerList',$row);
        return parent::edit($ids);
    }
    //修改玩家信息的保存
    public function editSave(){
        $uid = $_POST["uid"];
        $phone = $_POST["phone"];
        $log = $_POST["log"];
        $data["phone_number"] = $phone;

        $row = $this->model->where("uid='$uid'")->update($data);
        if($row=true){
            $tname = "玩家模块-玩家列表-修改玩家信息";
            $this->logCommon($log,$tname);
            echo json_encode($row);
        }
    }
    //查看下级玩家的集合
    public function see(){
        $id = $_GET["id"];
        $row = $this->model->where("uid='$id'")->select();
        $next_uids = $row[0]["next_uids"];
        $arr = json_decode($next_uids,true);
        echo "<pre>";var_dump($arr);echo 11;
    }
}
