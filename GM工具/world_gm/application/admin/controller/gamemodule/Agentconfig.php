<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use think\paginator\driver\Bootstrap;
use Think\Db;
use app\common\controller\Url;

/**
 * 代理配置
 *
 * @icon fa fa-user
 */
class Agentconfig extends Backend
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
        $this->getUrl = new Url();
    }

    //查询代理配置信息
    public function commonFun(){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "getExtendCfg"
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //设置代理配置信息
    public function commonFun1($data){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "setExtendCfg",
            "data" => $data
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //查看
    public function index(){
        $row = $this->commonFun();
        $arr = json_decode($row,true);
        $code = $arr["code"];
        if($code=="200"){
            $list = $arr["data"];
            $list = json_encode($list,JSON_UNESCAPED_UNICODE);
            $list = str_replace("nodeCfg",config('nodeCfg'),$list);
            $list = str_replace("numP",config('numP'),$list);
            $list = str_replace("needProfit",config('needProfit'),$list);
            $list = str_replace("maxProp",config('maxProp'),$list);
            $list = str_replace("name",config('name'),$list);
            $list = str_replace('"redType":1',config('redType1'),$list);
            $list = str_replace('"redType":2',config('redType2'),$list);
            $list = str_replace("maxWithDraw",config('maxWithDraw'),$list);
            $list = "[".$list."]";
            $this->assign("list",$list);
            return $this->view->fetch();
        }
        else {
            echo config("serverException");
        }
    }
    public function index1(){
        $row = $this->commonFun();
        $arr = json_decode($row,true);
        $code = $arr["code"];
        if($code=="200"){
            $list = $arr["data"];
            if(empty($list["nodeCfg"])){
                $this->assign("list","");
                $this->assign("brokerage","");
                $this->assign("baseMaxWithDraw","");
                return $this->view->fetch();
            }
            else {
                $list = $list["nodeCfg"];
                $list = json_encode($list,JSON_UNESCAPED_UNICODE);
                $list = str_replace("numP",config('numP'),$list);
                $list = str_replace("needProfit",config('needProfit'),$list);
                $list = str_replace("maxProp",config('maxProp'),$list);
                $list = str_replace("name",config('name'),$list);
                $list = str_replace('"redType":1',config('redType1'),$list);
                $list = str_replace('"redType":2',config('redType2'),$list);
                $list = str_replace("maxWithDraw",config('maxWithDraw'),$list);
                $this->assign("list",$list);
                $this->assign("brokerage",$arr["data"]["brokerage"]);
                if(empty($arr["data"]["baseMaxWithDraw"])){
                    $this->assign("baseMaxWithDraw","");
                }
                else {
                    $this->assign("baseMaxWithDraw",$arr["data"]["baseMaxWithDraw"]);
                }
                return $this->view->fetch();
            }
        }
        else {
            echo config("serverException");
        }
    }
    //配置判断
    //判断是否有值
    public function judge(){
        $row = $this->commonFun();
        $arr = json_decode($row,true);
        $data = $arr["data"];
        if (empty($data)){
            echo json_encode("0",JSON_UNESCAPED_UNICODE);
        }
        else {
            echo json_encode("1",JSON_UNESCAPED_UNICODE);
        }
    }
    //代理配置为空时添加代理配置
    public function config(){
        $this->assign("configType",config("configType"));
        $this->assign("data",json_encode(config("configType"),JSON_UNESCAPED_UNICODE));
        return $this->view->fetch();
    }
    //代理配置不为空时修改和添加代理配置页面
    public function configs(){
        $row = $this->commonFun();
        $arr = json_decode($row,true);
        $code = $arr["code"];
        if($code=="200"){
            $data = $arr["data"];
            $data = array_values($data);
            $data = json_encode($data,JSON_UNESCAPED_UNICODE);
            $this->assign("data",$data);//echo $data;
            $this->assign("configType",config("configType"));
            return $this->view->fetch();
        }
        else {
            echo config("serverException");
        }
    }
    public function configs1(){
        $row = $this->commonFun();
        $arr = json_decode($row,true);
        $code = $arr["code"];
        if($code=="200"){
            $brokerage = $arr["data"]["brokerage"];
            $this->assign("brokerage",$brokerage);
            $baseMaxWithDraw = $arr["data"]["baseMaxWithDraw"];
            $this->assign("baseMaxWithDraw",$baseMaxWithDraw);
            $data = $arr["data"]["nodeCfg"];
            $data = json_encode($data,JSON_UNESCAPED_UNICODE);
            $this->assign("data",$data);//echo $data;
            return $this->view->fetch();
        }
        else {
            echo config("serverException");
        }
        //return $this->view->fetch();
    }
    //保存设置代理节点的数据
    public function addSave(){
        if(empty($_POST["numP"])){
            echo json_encode("0",JSON_UNESCAPED_UNICODE);//请至少添加一个节点
        }
        else {
            $configType = config("configType");
            $numP = $_POST["numP"];
            $needProfit = $_POST["needProfit"];
            $maxProp = $_POST["maxProp"];
            $name = $_POST["name"];
            $redType = $_POST["redType"];
            $maxWithDraw = $_POST["maxWithDraw"];
            $numParr = explode("-",$numP);
            $count = count($numParr);
            $needProfit = explode("-",$needProfit);
            $maxProp = explode("-",$maxProp);
            $name = explode("-",$name);
            $redType = explode("-",$redType);
            $maxWithDraw = explode("-",$maxWithDraw);
            $json = "";
            for($i=0;$i<$count;$i++){
                $json1 = "";
                $numParr1 = explode(",",$numParr[$i]);
                $count1 = count($numParr1);
                $needProfit1 = explode(",",$needProfit[$i]);
                $maxProp1 = explode(",",$maxProp[$i]);
                $name1 = explode(",",$name[$i]);
                $redType1 = explode(",",$redType[$i]);
                $maxWithDraw1 = explode(",",$maxWithDraw[$i]);
                $json = $json.',"'.$configType[$i].'":{"nodeCfg":'.'[';
                for($j=0;$j<$count1;$j++){
                    $json .= '{"numP":'.$numParr1[$j].',"needProfit":'.$needProfit1[$j].',"maxProp":'.$maxProp1[$j].',"name":"'.$name1[$j].'","redType":'.$redType1[$j].',"maxWithDraw":'.$maxWithDraw1[$j].'}'.',';
                }
                $json = substr($json,0,-1);
                $json = $json.']}'.',';
                $json = substr($json,0,-1);
            }
            $json = substr($json,1);
            $json = '{'.$json.'}';
            $data = $json;
            $row = $this->commonFun1($data);
            if($row=true){
                echo json_encode($data,JSON_UNESCAPED_UNICODE);
            }
            //echo $json;
        }
    }
    public function test($brokerage,$numP,$needProfit,$maxProp,$name,$redType,$maxWithDraw,$baseMaxWithDraw){
        $json = "";
        $numParr = explode(",",$numP);
        $needProfitarr = explode(",",$needProfit);
        $maxProparr = explode(",",$maxProp);
        $namearr = explode(",",$name);
        $redTypearr = explode(",",$redType);
        $maxWithDrawarr = explode(",",$maxWithDraw);
        $count = count($numParr);
        for($i=0;$i<$count;$i++){
            $json .= '{'.'"numP":'.$numParr[$i].',"needProfit":'.$needProfitarr[$i].',"maxProp":'.$maxProparr[$i].',"name":"'.$namearr[$i].'","redType":'.$redTypearr[$i].',"maxWithDraw":'.$maxWithDrawarr[$i].'}'.',';
        }
        $json = substr($json,0,-1);
        $json = '{"brokerage":'.$brokerage.',"baseMaxWithDraw":'.$baseMaxWithDraw.',"nodeCfg":['.$json.']}';
        return $json;
    }
    //判断一个数组中某数是否有大于等于1或小于等于0的数
    public function pan($maxProp){
        $maxProparr = explode(",",$maxProp);
        $count = count($maxProparr);
        $str = "";
        for($i=0;$i<$count;$i++){
            if($maxProparr[$i]>=1 || $maxProparr[$i]<=0){
                $str .= 0;//0表示不在范围内
            }
            else {
                $str .= 1;//1表示在范围内
            }
        }
        return $str;//只有当为111的时候才满足要求
    }
    public function num($maxProp){
        $maxProparr = explode(",",$maxProp);
        $count = count($maxProparr);
        $num = "";
        for($i=0;$i<$count;$i++){
            $num .= 1;
        }
        return $num;
    }
}
