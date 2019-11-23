<?php

namespace app\admin\controller\player;

use app\common\controller\Backend;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Monitor extends Backend
{

    protected $relationSearch = true;
    protected $childrenGroupIds = [];
    protected $childrenAdminIds = [];

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('PLyaerMonitor');
        $this->childrenAdminIds = $this->auth->getChildrenAdminIds(true);
        $this->childrenGroupIds = $this->auth->getChildrenGroupIds($this->auth->isSuperAdmin() ? true : false);
    }

    /**
     * 列表页面
     */
    public function index()
    {
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax())
        {
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }

            list($where,$sort,$order,$offset,$limit) = $this->buildparams("uid");
            $total = $this->model
                //->with('group')
                ->where($where)
                ->where("is_control=1")
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->where("is_control=1")
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }

        return $this->view->fetch();
    }

    public function add(){
        $row = $this->model->where("is_control=0")->select();//echo "<pre>";var_dump($row);
        $this->assign('list',$row);
        return $this->view->fetch("player/monitor/choice");
    }
    //监控列表添加按钮页面的操作(修改is-control字段值为1)
    public function judge(){
        $uids = $_POST['uids'];
        $arr = explode(",",$uids);
        $count = count($arr);
        $zu = "";
        for($i=0;$i<$count;$i++){
            $ids = $arr[$i];
            $start = stripos($ids,"(");
            $end = stripos($ids,")");
            $len = $end-$start;
            $lens = strlen($ids);
            $lenn = $lens-$len;
            $idd = substr($ids,0,$lenn-1);
            $zu .= $idd.",";
        }
        $zu = substr($zu,0,-1);

        $data['is_control'] = "1";
        $where = "uid in($zu)";
        $row = $this->model->where($where)->update($data);
        if($row=true){
            $this->success("index");
        }
        $this->error();
        echo json_encode($zu);

    }
    public function tiaotiao(){
        echo "啊啊啊";
    }
    //操作移除按钮
    public function del($ids = "")
    {
        if ($ids)
        {
            $data['is_control'] = "0";
            $where = "uid in($ids)";
            $this->model->where($where)->update($data);
            $this->success();
        }
        $this->error();
    }
    public function testr(){
        echo "测试";
    }
}
