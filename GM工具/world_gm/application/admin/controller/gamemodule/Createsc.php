<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use think\paginator\driver\Bootstrap;
use Think\Db;
use app\common\controller\Url;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Createsc extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */

    public function _initialize()
    {
        parent::_initialize();
        $this->getUrl = new Url();
    }
    //创建平台
    public function commonFun($desc,$guaranty){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "createSC",
            "desc" => $desc,
            "guaranty" => $guaranty,
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //查看平台
    public function commonFun1(){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "getSCInfo"
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //修改平台
    public function commonFunUpdate($description,$guaranty){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "updateSC",
            "description" => $description,
            "guaranty" => $guaranty
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //删除平台
    public function commonFundelete($scId){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "getSCInfo",
            "scId" => $scId
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }

    /**
     * 查看
     */
    public function getMoreArry($aaa) {
        for($i=0;$i<1;$i++)
        {
            $bbb[] = array_slice($aaa, $i * 6 ,6);
        }
        //print_r($bbb);
        return $bbb;
    }
    public function index(){
        $ip = config('IP1');
        $this->assign("ip",$ip);
        $json = $this->commonFun1();
        $result = json_decode($json,true);
        $code = $result["code"];
        $this->assign('code', $code);
        if($code==400){
            return $this->fetch();
        }
        else{
            $arr = $result["data"];
            $data[0] = $arr;//echo "<pre>";var_dump($data);
            /*$data = $this->getMoreArry($data);echo "<pre>";var_dump($data);*/
            $this->assign('plist', $data);
            return $this->fetch();
        }
    }
    public function create(){
        return $this->view->fetch();
    }
    //查询
    public function createSave()
    {
        $desc = $_POST["desc"];
        $guaranty = $_POST["guaranty"];
        $result = $this->commonFun($desc,$guaranty);
        $result = json_decode($result,true);
        $code = $result["code"];
        if($code==200){
            $data = $result["data"];
            echo json_encode("成功");
        }
        else {
            $msg = $result["msg"];
            echo json_encode($msg,JSON_UNESCAPED_UNICODE);
        }
    }
    //修改页面
    public function edit($ids=null){
        $scId = $_GET["scId"];
        $result = $this->commonFun1();
        $result = json_decode($result,true);
        $result = $result["data"];
        $this->assign("result",$result);//echo "<pre>";var_dump($result);
        return $this->view->fetch();
    }
    public function editSave(){
        $description = $_POST["description"];
        $guaranty = $_POST["guaranty"];
        $result = $this->commonFunUpdate($description,$guaranty);
        $result = json_decode($result,true);
        //echo json_encode($result["msg"],JSON_UNESCAPED_UNICODE);
        $code = $result["code"];
        if($code==400){
            $msg = $result["msg"];
            $array[0] = $msg;
            echo json_encode($array);
        }
        else {
            $array[0] = $result["msg"];
            $array[1] = $result["serverCost"];
            echo json_encode($array);
        }
    }
    //删除
    public function del($ids=null){
        $scId = $_GET["scId"];
        $result = $this->commonFundelete($scId);
        $result = json_decode($result,true);
        $code = $result["code"];
        if($code==400){
            echo json_decode(-1);
        }
        else {
            echo json_decode(1);
        }
    }
}
