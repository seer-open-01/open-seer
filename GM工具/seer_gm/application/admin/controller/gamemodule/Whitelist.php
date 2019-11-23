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
class Whitelist extends Backend
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
        $this->model = model('Player');
        $this->getUrl = new Url();
    }

    //查看接口
    public function commonFun(){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "checkWhilteList"
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //增加接口
    public function commonFun1($uids){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "addWhiteList",
            "uids" => $uids
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //删除接口
    public function commonFun2($uids){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "deleteWhiteList",
            "uids" => $uids
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //修改服务器状态
    public function commonFun3($serverState){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "ModifyServerState",
            "serverState" => $serverState
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    public function test(){
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
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }

        return $this->view->fetch();
    }
    public function getMoreArry($arry1,$arry_count) {

        $b = array();

        for($y=0;$y<$arry_count;$y++){
            for($x=0;$x<1;$x++){
                $b[$y][$x] = $arry1[$y];
            }
        }

        return $b;

    }
    function foo(&$v, $k, $kname) {
        $v = array_combine($kname, array_slice($v, 1, -1));
    }
    /**
     * 查看
     */
    //得到白名单用户的接口
    public function uids(){
        $row = $this->commonFun();
        $arrr = json_decode($row);
        $arrr1 = json_decode(json_encode($arrr),true);
        $list = $arrr1["list"];
        $count = count($list);
        $a = "";
        for($i=0;$i<$count;$i++){
            $a .= $list[$i].",";
        }
        $a = substr($a,0,-1);
        return $a;
    }
    //得到白名单的状态
    public function serverState(){
        $row = $this->commonFun();
        $arrr = json_decode($row);
        $arrr1 = json_decode(json_encode($arrr),true);
        $serverState = $arrr1["serverState"];
        return $serverState;
    }
    public function index1(){
        $uids = $this->uids();
        $where1 = "uid in ($uids)";
        $serverState = $this->serverState();
        $row = $this->model
                    ->where($where1)
                    ->field("uid,wx_name,(case $serverState when 1 then '维护' else '正常' end) as serverState")
                    ->select();
        echo "<pre>";var_dump($row);
    }
    public function index(){
        $uids = $this->uids();//echo $uids;

        if($uids==""){
            $where1 = "uid in ('')";
            $serverState = $this->serverState();
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
                    ->where($where1)
                    ->field("uid,wx_name,(case $serverState when 1 then '正常' else '维护' end) as serverState")
                    ->order($sort, $order)
                    ->count();
                $list = $this->model
                    //->with('group')
                    ->where($where)
                    ->where($where1)
                    ->field("uid,wx_name,(case $serverState when 1 then '正常' else '维护' end) as serverState")
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();
                $result = array("total" => $total, "rows" => $list);

                return json($result);
            }
        }
        else {
            $where1 = "uid in ($uids)";
            $serverState = $this->serverState();
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
                    ->where($where1)
                    ->field("uid,wx_name,(case $serverState when 1 then '正常' else '维护' end) as serverState")
                    ->order($sort, $order)
                    ->count();
                $list = $this->model
                    //->with('group')
                    ->where($where)
                    ->where($where1)
                    ->field("uid,wx_name,(case $serverState when 1 then '正常' else '维护' end) as serverState")
                    ->order($sort, $order)
                    ->limit($offset, $limit)
                    ->select();
                $result = array("total" => $total, "rows" => $list);

                return json($result);
            }
        }

        $where1 = "uid in ($uids)";
        $serverState = $this->serverState();
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
                ->where($where1)
                ->field("uid,wx_name,(case $serverState when 1 then '正常' else '维护' end) as serverState")
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->where($where1)
                ->field("uid,wx_name,(case $serverState when 1 then '正常' else '维护' end) as serverState")
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }

        return $this->view->fetch();
    }
    public function add(){
        $uids = $this->uids();
        if($uids==""){
            $where = 'uid not in ("")';
            $list = $this->model
                ->where($where)
                ->select();
            $this->assign('list',$list);
        }
        else {//echo "不为空";
            $where = 'uid not in ('.$uids.')';
            $list = $this->model
                ->where($where)
                ->select();
            $this->assign('list',$list);
        }
        return $this->view->fetch();
    }
    public function addSave(){
        $uid = $_POST['uids'];
        $uidd = explode(",",$uid);
        $countd = count($uidd);
        $uidf = "";
        for($k=0;$k<$countd;$k++){
            $start = strpos($uidd[$k],"(");
            $end = strpos($uidd[$k],")");
            $uidf .= substr($uidd[$k],0,$start).",";
        }
        $uidf = substr($uidf,0,-1);
        $uids = '"['.$uidf.']"';
        $this->commonFun1($uids);
        echo json_encode($uids);
    }
    //单个删除
    public function del($ids = "")
    {
        if ($ids)
        {
            $row = $this->model->get($ids);
            $uid = $row['uid'];
            $uids = '"['.$uid.']"';
            $this->commonFun2($uids);
            $this->success();
        }
        $this->error();
    }
    //批量删除
    public function delBatch($ids=""){
        $ids = $_POST['ids'];
        if ($ids)
        {
            $row = $this->model->get($ids);
            $uid = $row['uid'];
            $uids = '"['.$ids.']"';
            $this->commonFun2($uids);
            $this->success();
        }
        $this->error();
    }
    //显示修改服务器的状态页面
    public function modify(){
        $row = $this->commonFun();
        $arrr = json_decode($row);
        $arrr1 = json_decode(json_encode($arrr),true);
        $serverState = $arrr1["serverState"];
        $this->assign("serverState",$serverState);
        return $this->view->fetch();
    }
    //服务器状态的保存
    public function modifySave(){
        $serverState = $_POST['serverState'];
        $this->commonFun3($serverState);
        echo json_encode($serverState);
    }
}
