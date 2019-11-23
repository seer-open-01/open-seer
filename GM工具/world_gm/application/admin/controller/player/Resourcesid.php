<?php

namespace app\admin\controller\player;

use app\common\controller\Backend;
use Think\Db;

/**
 * 手动资源增减
 *
 * @icon fa fa-user
 */
class Resourcesid extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Resourcesid');
        $this->model1 = model('Log');
        $this->model2 = model('Player');
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

    //跳转到资源增减页面
    public function tiao(){
        $uids = $_GET['uids'];
        $this->assign('uids',$uids);
        return $this->view->fetch("player/resourcesid/edit");
    }

    //保存数据sql信息
    public function saveData1($uid,$diamonds,$room_cards,$beans,$log){//$uid,$diamonds,$room_cards,$beans,$log
        $username = $_SESSION['think']['admin']['username'];//得到登录时的管理员名称
        $data['username'] = $username;
        $data['operation_time'] = date("Y-m-d H:i:s");
        $data['tname'] = "tname";//tname
        $data['content'] = $log;//content
        $row = Db::table('gmt.operation_log')->insert($data);
        //先查询得到该调数据的信息
        $sel = Db::table('gmt.user_list')
                ->where('uid in(100005,100038)')
                ->select();//echo "<pre>";var_dump($sel);
        $count = count($sel);
        //获得游戏ID,并拆分游戏ID
        //$uid = '100005,100038';
        $uidArr = explode(",",$uid);//echo "<pre>";var_dump($uidArr);
        /*$diamonds = "+8";
        $room_cards = "-5";
        $beans = "+6";*/
        //先得到符号
        $fu1 = substr($diamonds,0,1);
        $fu2 = substr($room_cards,0,1);
        $fu3 = substr($beans,0,1);
        $fu = $fu1.",".$fu2.",".$fu3;
        $fuArr = explode(",",$fu);
        //得到数字
        $shu1 = substr($diamonds,1);
        $shu2 = substr($room_cards,1);
        $shu3 = substr($beans,1);
        $shu = $shu1.",".$shu2.",".$shu3;//echo $shu;
        $shuArr = explode(",",$shu);//echo "<pre>";var_dump($shuArr);
        for($i=0;$i<$count;$i++){
            $diamonds1 = (int)$sel[$i]['diamonds'];
            $room_cards1 = (int)$sel[$i]['room_cards'];
            $beans1 = (int)$sel[$i]['beans'];
            $f1 = $fuArr[0];
            $f2 = $fuArr[1];
            $f3 = $fuArr[2];
            $s1 = (int)$shuArr[0];
            $s2 = (int)$shuArr[1];
            $s3 = (int)$shuArr[2];
            $b = $diamonds1;
            $c = $f1;
            $d = $s1;
            eval("\$a=$b$c$d;");//echo $a.",";
            $bb = $room_cards1;
            $cc = $f2;
            $dd = $s2;
            eval("\$aa=$bb$cc$dd;");//echo $aa.",";
            $bbb = $beans1;
            $ccc = $f3;
            $ddd = $s3;
            eval("\$aaa=$bbb$ccc$ddd;");//echo $aaa.",";
            //echo "<br>";
            //循环修改信息
            $data1['diamonds'] = $a;
            $data1['room_cards'] = $aa;
            $data1['beans'] = $aaa;
            $where = 'uid="'.$uidArr[$i].'"';//echo $where;echo "<br>";
            $update = $this->model2
                //->where('uid in("100005","100038")')
                ->where($where)
                ->update($data1);
        }
    }
    
    //保存资源增减信息界面
    public function addSave1(){
        //diamonds:diamonds,room_cards:room_cards,beans:beans,log:log
        $uid = $_POST['uid'];
        $diamonds = $_POST['diamonds'];
        $room_cards = $_POST['room_cards'];
        $beans = $_POST['beans'];
        $log = $_POST['log'];
        if($log==""){ //日志不能为空
            $array['status']=-1;
        }
        else { //可以提交
            $array['status']=1;
            $this->saveData($uid,$diamonds,$room_cards,$beans,$log);
        }
        echo json_encode($array);
    }
    public function saveData($uid,$diamonds,$room_cards,$beans){
        //先查询得到该调数据的信息
        $sel = $this->model2
            //->where('uid in($uid)')
            ->where("uid in ('$uid')")
            ->select();//echo "<pre>";var_dump($sel);
        $uidArrjson = json_encode($sel);
        $arrr = json_decode($uidArrjson);
        $arrr1 = json_decode(json_encode($arrr),true);
        $count = 2;
        //获得游戏ID,并拆分游戏ID
        //$uid = '100005,100038';
        $uidArr = explode(",",$uid);//echo "<pre>";var_dump($uidArr);
        /*$diamonds = "+8";
        $room_cards = "-5";
        $beans = "+6";*/
        //先得到符号
        $fu1 = substr($diamonds,0,1);
        $fu2 = substr($room_cards,0,1);
        $fu3 = substr($beans,0,1);
        $fu = $fu1.",".$fu2.",".$fu3;
        $fuArr = explode(",",$fu);
        //得到数字
        $shu1 = substr($diamonds,1);
        $shu2 = substr($room_cards,1);
        $shu3 = substr($beans,1);
        $shu = $shu1.",".$shu2.",".$shu3;//echo $shu;
        $shuArr = explode(",",$shu);//echo "<pre>";var_dump($shuArr);
        for($i=0;$i<2;$i++){
            $diamonds1 = (int)$arrr1[$i]['diamonds'];
            $room_cards1 = (int)$arrr1[$i]['room_cards'];
            $beans1 = (int)$arrr1[$i]['beans'];
            $f1 = $fuArr[0];
            $f2 = $fuArr[1];
            $f3 = $fuArr[2];
            $s1 = (int)$shuArr[0];
            $s2 = (int)$shuArr[1];
            $s3 = (int)$shuArr[2];
            $b = $diamonds1;
            $c = $f1;
            $d = $s1;
            eval("\$a=$b$c$d;");//echo $a.",";
            $bb = $room_cards1;
            $cc = $f2;
            $dd = $s2;
            eval("\$aa=$bb$cc$dd;");//echo $aa.",";
            $bbb = $beans1;
            $ccc = $f3;
            $ddd = $s3;
            eval("\$aaa=$bbb$ccc$ddd;");//echo $aaa.",";
            //echo "<br>";
            //循环修改信息
            $data1['diamonds'] = $a;
            $data1['room_cards'] = $aa;
            $data1['beans'] = $aaa;
            $where = 'uid="'.$uidArr[$i].'"';
            $update = $this->model2
                //->where($where)
                ->where("uid='$uidArr[$i]'")
                ->update($data1);
        }
    }
    public function news1(){
        $uid = $_POST["uid"];
        $uidArr = explode(",",$uid);
        $count = count($uidArr);
        $uidor = "";
        for($i=0;$i<$count;$i++){
            $uidor .= "uid=".$uidArr[$i]." or ";
        }
        $uidor = substr($uidor,0,-4);//得到玩家uid的集合
        $diamonds = $_POST['diamonds'];
        $room_cards = $_POST['room_cards'];
        $beans = $_POST['beans'];
        $fu1 = substr($diamonds,0,1);
        $fu2 = substr($room_cards,0,1);
        $fu3 = substr($beans,0,1);
        $fu = $fu1.$fu2.$fu3;
        $shu1 = substr($diamonds,1);
        $shu2 = substr($room_cards,1);
        $shu3 = substr($beans,1);
        if($fu=="+++"){
            $set = "diamonds=diamonds+$shu1,room_cards=room_cards+$shu2,beans=beans+$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");
            echo json_encode("+++");
        }
        else if($fu=="++-"){
            $set = "diamonds=diamonds+$shu1,room_cards=room_cards+$shu2,beans=beans-$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");
            echo json_encode("++-");
        }
        else if($fu=="+-+"){
            $set = "diamonds=diamonds+$shu1,room_cards=room_cards-$shu2,beans=beans+$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");
            echo json_encode("+-+");
        }
        else if($fu=="-++"){
            $set = "diamonds=diamonds-$shu1,room_cards=room_cards+$shu2,beans=beans+$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");
            echo json_encode("-++");
        }
        else if($fu=="--+"){
            $set = "diamonds=diamonds-$shu1,room_cards=room_cards-$shu2,beans=beans+$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");
            echo json_encode("--+");
        }
        else if($fu=="-+-"){
            $set = "diamonds=diamonds-$shu1,room_cards=room_cards+$shu2,beans=beans-$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");
            echo json_encode("-+-");
        }
        else if($fu=="+--"){
            $set = "diamonds=diamonds+$shu1,room_cards=room_cards-$shu2,beans=beans-$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");
            echo json_encode("+--");
        }
        else if($fu=="---"){
            $set = "diamonds=diamonds-$shu1,room_cards=room_cards-$shu2,beans=beans-$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");
            echo json_encode("---");
        }
    }
    public function news(){
        $uid = $_POST["uid"];
        $uidArr = explode(",",$uid);
        $count = count($uidArr);
        $uidor = "";
        for($i=0;$i<$count;$i++){
            $uidor .= "uid=".$uidArr[$i]." or ";
        }
        $uidor = substr($uidor,0,-4);//得到玩家uid的集合
        $diamonds = $_POST['diamonds'];
        $room_cards = $_POST['room_cards'];
        $beans = $_POST['beans'];
        $fu1 = substr($diamonds,0,1);
        $fu2 = substr($room_cards,0,1);
        $fu3 = substr($beans,0,1);
        $fu = $fu1.$fu2.$fu3;
        $shu1 = substr($diamonds,1);
        $shu2 = substr($room_cards,1);
        $shu3 = substr($beans,1);
        /*$sql = "UPDATE user_list SET $set WHERE uid=100529";//修改
        $sql1 = "select * from user_list WHERE uid=100529";//查询数据
        $sql2 = "select count(*) from user_list WHERE uid=100529";计算总数
        */
        if($fu=="+++"){
            /*$set = "diamonds=diamonds+$shu1,room_cards=room_cards+$shu2,beans=beans+$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");*/
            $set = "diamonds=diamonds+$shu1,room_cards=room_cards+$shu2,beans=beans+$shu3";
            $sql = "UPDATE user_list SET $set WHERE $uidor";
            $sql1 = "select * from user_list WHERE $uidor";
            $sql2 = "select count(*) from user_list WHERE $uidor";
            $num = $this->gunCommon($sql,$sql1,$sql2);
            //echo json_encode("+++");
            echo $num;
        }
        else if($fu=="++-"){
            /*$set = "diamonds=diamonds+$shu1,room_cards=room_cards+$shu2,beans=beans-$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");*/
            $set = "diamonds=diamonds+$shu1,room_cards=room_cards+$shu2,beans=beans-$shu3";
            $sql = "UPDATE user_list SET $set WHERE $uidor";
            $sql1 = "select * from user_list WHERE $uidor";
            $sql2 = "select count(*) from user_list WHERE $uidor";
            $num = $this->gunCommon($sql,$sql1,$sql2);
            //echo json_encode("++-");
            echo $num;
        }
        else if($fu=="+-+"){
            /*$set = "diamonds=diamonds+$shu1,room_cards=room_cards-$shu2,beans=beans+$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");*/
            $set = "diamonds=diamonds+$shu1,room_cards=room_cards-$shu2,beans=beans+$shu3";
            $sql = "UPDATE user_list SET $set WHERE $uidor";
            $sql1 = "select * from user_list WHERE $uidor";
            $sql2 = "select count(*) from user_list WHERE $uidor";
            $num = $this->gunCommon($sql,$sql1,$sql2);
            //echo json_encode("+-+");
            echo $num;
        }
        else if($fu=="-++"){
            /*$set = "diamonds=diamonds-$shu1,room_cards=room_cards+$shu2,beans=beans+$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");*/
            $set = "diamonds=diamonds-$shu1,room_cards=room_cards+$shu2,beans=beans+$shu3";
            $sql = "UPDATE user_list SET $set WHERE $uidor";
            $sql1 = "select * from user_list WHERE $uidor";
            $sql2 = "select count(*) from user_list WHERE $uidor";
            $num = $this->gunCommon($sql,$sql1,$sql2);
            //echo json_encode("-++");
            echo $num;
        }
        else if($fu=="--+"){
            /*$set = "diamonds=diamonds-$shu1,room_cards=room_cards-$shu2,beans=beans+$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");*/
            $set = "diamonds=diamonds-$shu1,room_cards=room_cards-$shu2,beans=beans+$shu3";
            $sql = "UPDATE user_list SET $set WHERE $uidor";
            $sql1 = "select * from user_list WHERE $uidor";
            $sql2 = "select count(*) from user_list WHERE $uidor";
            $num = $this->gunCommon($sql,$sql1,$sql2);
            //echo json_encode("--+");
            echo $num;
        }
        else if($fu=="-+-"){
            /*$set = "diamonds=diamonds-$shu1,room_cards=room_cards+$shu2,beans=beans-$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");*/
            $set = "diamonds=diamonds-$shu1,room_cards=room_cards+$shu2,beans=beans-$shu3";
            $sql = "UPDATE user_list SET $set WHERE $uidor";
            $sql1 = "select * from user_list WHERE $uidor";
            $sql2 = "select count(*) from user_list WHERE $uidor";
            $num = $this->gunCommon($sql,$sql1,$sql2);
            //echo json_encode("-+-");
            echo $num;
        }
        else if($fu=="+--"){
            /*$set = "diamonds=diamonds+$shu1,room_cards=room_cards-$shu2,beans=beans-$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");*/
            $set = "diamonds=diamonds+$shu1,room_cards=room_cards-$shu2,beans=beans-$shu3";
            $sql = "UPDATE user_list SET $set WHERE $uidor";
            $sql1 = "select * from user_list WHERE $uidor";
            $sql2 = "select count(*) from user_list WHERE $uidor";
            $num = $this->gunCommon($sql,$sql1,$sql2);
            //echo json_encode("+--");
            echo $num;
        }
        else if($fu=="---"){
            /*$set = "diamonds=diamonds-$shu1,room_cards=room_cards-$shu2,beans=beans-$shu3";
            $this->model2->query("UPDATE user_list SET $set WHERE $uidor");*/
            $set = "diamonds=diamonds-$shu1,room_cards=room_cards-$shu2,beans=beans-$shu3";
            $sql = "UPDATE user_list SET $set WHERE $uidor";
            $sql1 = "select * from user_list WHERE $uidor";
            $sql2 = "select count(*) from user_list WHERE $uidor";
            $num = $this->gunCommon($sql,$sql1,$sql2);
            //echo json_encode("---");
            echo $num;
        }
    }
    public function addSave(){
        $uid = $_POST["uid"];
        $diamonds = $_POST['diamonds'];
        $room_cards = $_POST['room_cards'];
        $beans = $_POST['beans'];
        $log = $_POST['log'];
        $row = $this->news();
        /*if($row=true){
            $tname = "玩家模块-资源增减-批量修改";
            $this->logCommon($log,$tname);
        }*/
    }
    //回滚数据公共方法
    public function gunCommon($sql,$sql1,$sql2){
        $this->model->startTrans();
        $this->model->execute($sql);//修改
        //$row = $this->model->query($sql1);//查询
        $result = $this->xunHan($sql1,$sql2);
        if(strpos($result,'false') !==false){
            $this->model->rollback();
            //echo '含有负数';
            //$negative = "negative";
            return json_encode("-1");
        }
        else{
            $this->model->commit();
            //echo '没有负数';
            //$nonegative = "nonegative";
            $log = $_POST['log'];
            $tname = "玩家模块-资源增减-批量修改";
            $this->logCommon($log,$tname);
            return json_encode("1");
        }
    }
    public function xunHan($sql1,$sql2){
        //$sql1 = "select * from user_list WHERE uid=100529";
        $row = $this->model->query($sql1);
        //$sql2 = "select count(*) from user_list WHERE uid=100529";
        $count = $this->model->query($sql2);
        $count = $count[0]["count(*)"];
        $a = "";
        for($i=0;$i<$count;$i++){
            $room_cards = $row[$i]["room_cards"];
            $diamonds = $row[$i]["diamonds"];
            $beans = $row[$i]["beans"];
            if($room_cards<0 or $diamonds<0 or $beans<0){
                $a .= "false".",";
            }
            else {
                $a .= "true".",";
            }
        }
        $a = substr($a,0,-1);
        return $a;
    }
}
