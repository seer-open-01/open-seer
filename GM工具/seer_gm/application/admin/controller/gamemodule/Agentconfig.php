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
        return $this->view->fetch();
    }
    //代理配置不为空时修改和添加代理配置页面
    public function configs(){
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
        $brokerage = $_POST["brokerage"];
        $baseMaxWithDraw = $_POST["baseMaxWithDraw"];
        if(empty($brokerage)){
            echo json_encode("0",JSON_UNESCAPED_UNICODE);//提现手续费为空
        }
        else if (empty($baseMaxWithDraw)){
            echo json_encode("-8",JSON_UNESCAPED_UNICODE);//基础玩家每日最大提币限制为空
        }
        else if($brokerage>=1 || $brokerage<=0){
            echo json_encode("-6",JSON_UNESCAPED_UNICODE);//提现手续费必须在0到1之间的小数
        }
        else if(empty($_POST["numP"])){
            echo json_encode("-5",JSON_UNESCAPED_UNICODE);//请至少添加一个节点
        }
        else {
            $numP = $_POST["numP"];
            $numParr = explode(",",$numP);
            $needProfit = $_POST["needProfit"];
            $needProfitarr = explode(",",$needProfit);
            $maxProp = $_POST["maxProp"];
            $maxProparr = explode(",",$maxProp);
            $name = $_POST["name"];
            $namearr = explode(",",$name);
            $redType = $_POST["redType"];
            $maxWithDraw = $_POST["maxWithDraw"];
            $maxWithDrawarr = explode(",",$maxWithDraw);
            $pan = $this->pan($maxProp);
            $num = $this->num($maxProp);
            if(count(array_filter($numParr))!=count($numParr)){
                echo json_encode("-1",JSON_UNESCAPED_UNICODE);//推广玩家数量组中含有空值
            }
            else if(count(array_filter($needProfitarr))!=count($needProfitarr)){
                echo json_encode("-2",JSON_UNESCAPED_UNICODE);//收益量组中含有空值
            }
            else if(count(array_filter($maxProparr))!=count($maxProparr)){
                echo json_encode("-3",JSON_UNESCAPED_UNICODE);// 最大分红比例组中含有空值
            }
            else if($pan!==$num){
                echo json_encode("-7",JSON_UNESCAPED_UNICODE);// 最大分红比例组中必须是在0到1之间的数
            }
            else if(count(array_filter($namearr))!=count($namearr)){
                echo json_encode("-4",JSON_UNESCAPED_UNICODE);// 节点名称组中含有空值
            }
            else if(count(array_filter($maxWithDrawarr))!=count($maxWithDrawarr)){
                echo json_encode("-9",JSON_UNESCAPED_UNICODE);// 每日最大提币限制组中含有空值
            }
            else {
                $data = $this->test($brokerage,$numP,$needProfit,$maxProp,$name,$redType,$maxWithDraw,$baseMaxWithDraw);
                $row = $this->commonFun1($data);
                if($row=true){
                    echo json_encode($data,JSON_UNESCAPED_UNICODE);
                }
            }
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
