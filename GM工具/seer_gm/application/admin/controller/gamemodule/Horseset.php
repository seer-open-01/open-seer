<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use Think\Db;
use app\common\controller\Url;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Horseset extends Backend
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
        $this->model = model('Horseset');
        $this->model2 = model('Player');
        $this->model3 = model("Temporaryrecording");
        $this->getUrl = new Url();
    }

    public function commonFun($content,$playback_sequence,$playback_interval,$playback_count,$start_time,$end_time){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "sendInsertNotice",
            "content" => $content,//文本内容
            "playback_sequence" => $playback_sequence,//播放顺序
            "playback_interval" => $playback_interval,//播放间隔
            "playback_count" => $playback_count,//播放次数
            "start_time" => $start_time,//播放开始时间
            "end_time" => $end_time//播放结束时间
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }

    /**
     * 查看
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

            list($where,$sort,$order,$offset,$limit) = $this->buildparams("playback_sequence,content,status");
            $total = $this->model
                //->with('group')
                ->where($where)
                ->field("(case status when 1 then '禁用' else '启用' end) as whether,notice_config.*")
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->field("(case status when 1 then '禁用' else '启用' end) as whether,notice_config.*")
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);
            return json($result);
        }
        return $this->view->fetch();
    }
    public function add(){
        return $this->view->fetch();
    }
    public function addSave(){
        $playback_sequence = $_POST['playback_sequence'];
        $content = $_POST['contents'];
        $status = $_POST['status'];
        $data['playback_sequence'] = $playback_sequence;
        $data['content'] = $content;
        $data['status'] = $status;
        $row = $this->model->insert($data);
        if($row=true){
            $this->refreash();
            echo json_encode("success");
        }

    }
    public function timeSet(){
        $ids = $_GET['ids'];
        $this->assign('ids',$ids);
        $start_time = "00:00:00";
        $end_time = "23:59:59";
        $time = $start_time." 至 ".$end_time;
        $this->assign('time',$time);

        return $this->view->fetch();
    }
    public function timeSetSave(){
        $ids = $_POST['ids'];
        $where = "id in ($ids)";
        $time = $_POST['time'];
        $times = explode(" 至 ",$time);
        $start_time = $times[0];
        $end_time = $times[1];

        $data['start_time'] = $start_time;
        $data['end_time'] = $end_time;
        $row = $this->model->where($where)->update($data);
        if($row=true){
            $this->refreash();
            echo json_encode($row);
        }
    }
    public function temporaryInserting(){
        $start_time = "00:00:00";
        $this->assign('start_time',$start_time);
        $end_time = "23:59:59";
            $this->assign('end_time',$end_time);
        $time = $start_time." 至 ".$end_time;
        $this->assign('time',$time);
        return $this->view->fetch();
    }
    public function temporaryInsertingSave(){
        $time = date("Y-m-d H:i:s");
        $contents = $_GET['contents'];
        $playback_number = $_GET['playback_number'];
        $log = $_GET['log'];
        $username = $_SESSION['think']['admin']['username'];
        $data['time'] = $time;
        $data['username'] = $username;
        $data['content'] = $contents;
        $data['playback_number'] = $playback_number;
        $data['log'] = $log;
        $row = $this->model3->insert($data);
        echo json_encode($row);
    }
    //临时插播保存
    public function temporaryInsertingSave1(){
        $content = $_GET['contents'];
        $playback_sequence = $_GET['playback_sequence'];
        $playback_interval = $_GET['playback_interval'];
        $playback_count = $_GET['playback_number'];
        $time = $_GET['time'];
        $times = explode(" 至 ",$time);
        $start_time = $times[0];
        $end_time = $times[1];
        $this->commonFun($content,$playback_sequence,$playback_interval,$playback_count,$start_time,$end_time);
        $this->temporaryInsertingSave();
    }
    public function edit($ids=""){
        $ids = $this->model->get($ids);
        $id = $ids['id'];
        $row = $this->model->where("id='$id'")->select();
        $row = $row[0];
        $this->assign('list',$row);
        return $this->view->fetch();
    }
    public function editSave(){
        $id = $_POST['id'];
        $contents = $_POST['contents'];
        $playback_sequence = $_POST['playback_sequence'];
        $status = $_POST['status'];
        $data['content'] = $contents;
        $data['playback_sequence'] = $playback_sequence;
        $data['status'] = $status;
        $row = $this->model->where("id='$id'")->update($data);
        if($row=true){
            $this->refreash();
            echo json_encode("success");
        }
    }
    public function refreash(){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "updateNotice"
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
}
