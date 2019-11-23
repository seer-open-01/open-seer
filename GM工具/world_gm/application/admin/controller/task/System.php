<?php

namespace app\admin\controller\task;

use app\common\controller\Backend;
use think\paginator\driver\Bootstrap;
use Think\Db;
use app\common\controller\Url;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class System extends Backend
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
    //任务添加接口
    public function commonFun($asset,$repeatType,$rewardType,$rewardNum,$order,$gameTypeLimit,$matchNameLimit,$conditionType,$conditionNum,$startTime,$endTime,$gameSubType){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "addTask",
            "asset" => $asset,//货币类型
            "repeatType" => $repeatType,// 重复类型 1一次性任务 2重复任务 【repeatType】
            "rewardType" => $rewardType,// 奖励类型 1金豆 2彩票积分 【rewardType】
            "rewardNum" => $rewardNum,// 奖励的数量 【rewardNum】
            "order" => $order,// 顺序(客户端显示的顺序) 【order】
            "gameTypeLimit" => $gameTypeLimit,// 游戏类型限制 0所有的游戏 1麻将 2斗地主 3象棋 4拼三 5拼十 【gameTypeLimit】
            "matchNameLimit" => $matchNameLimit,// 游戏规模限制 0无规模限制 1虾兵场....6龙王场 【matchNameLimit】
            "conditionType" => $conditionType,// 条件类型 1对战多少局 2单局达到多少分 【conditionType】
            "conditionNum" => $conditionNum,// 对应条件对应的数量 【conditionNum】
            "startTime" => $startTime,//开始时间 【startTime】
            "endTime" => $endTime,//结束时间 【endTime】
            "gameSubType" => $gameSubType//0,1,2 【gameSubType】
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //任务查看接口
    public function commonFun1(){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "checkTask"
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //任务删除接口
    public function commonFun2($id,$asset){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "deleteTask",
            "id" => $id,
            "asset" => $asset//货币类型
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //任务修改接口
    public function commonFun3($id,$asset,$repeatType,$rewardType,$rewardNum,$order,$gameTypeLimit,$matchNameLimit,$conditionType,$conditionNum,$startTime,$endTime,$gameSubType){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "modifyTask",
            "id" => $id,
            "asset" => $asset,//货币类型
            "repeatType" => $repeatType,// 重复类型 1一次性任务 2重复任务 【repeatType】
            "rewardType" => $rewardType,// 奖励类型 1金豆 2彩票积分 【rewardType】
            "rewardNum" => $rewardNum,// 奖励的数量 【rewardNum】
            "order" => $order,// 顺序(客户端显示的顺序) 【order】
            "gameTypeLimit" => $gameTypeLimit,// 游戏类型限制 0所有的游戏 1麻将 2斗地主 3平三张 4拼十 5 【gameTypeLimit】
            "matchNameLimit" => $matchNameLimit,// 游戏规模限制 0无规模限制 1虾兵场....6龙王场 【matchNameLimit】
            "conditionType" => $conditionType,// 条件类型 1对战多少局 2单局达到多少分 【conditionType】
            "conditionNum" => $conditionNum,// 对应条件对应的数量 【conditionNum】
            "startTime" => $startTime,//开始时间 【startTime】
            "endTime" => $endTime,//结束时间 【endTime】
            "gameSubType" => $gameSubType//0,1,2 【gameSubType】
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    //得到某一条数据
    public function commonFun4($id,$asset){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "checkOneTask",
            "id" => $id,
            "asset" => $asset
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }
    function search1($a,$keywords) {
        $arr=$result=array();
        foreach ($a as $key => $value) {
            foreach ($value as $valu) {
                if(strstr($valu, $keywords) !== false){
                    array_push($arr, $key);
                }
            }
        }
        foreach ($arr as $key => $value) {
            if(array_key_exists($value,$a)){
                array_push($result, $a[$value]);
            }
        }
        return $result;
    }
    public function aa(){
        $a = array(
            2 => array(
                'catid' => 2,
                'catdir' => 'notice',
            ),
            5 => array(
                'catid' => 5,
                'catdir' => 'subject',
            ),
            6=> array(
                'catid' => 6,
                'catdir' => 'news'
            ),
        );
        $keywords="ject";
        echo "<pre>";var_dump($this->search1($a,$keywords));
    }
    /**
     * 查看 index()
     */
    //模糊搜索数组方法
    public function search($a,$keywords) {
        $arr=$result=array();
        foreach ($a as $key => $value) {
            foreach ($value as $valu) {
                if(strstr($valu, $keywords) !== false){
                    array_push($arr, $key);
                }
            }
        }
        foreach ($arr as $key => $value) {
            if(array_key_exists($value,$a)){
                array_push($result, $a[$value]);
            }
        }
        return $result;
    }
    //得到全部数据
    public function jsonAll(){
        $json = $this->commonFun1();
        return $json;
    }
    //搜索带条件
    function seekarr($arr=array(),$key,$val){
        $res = array();
        $str = json_encode($arr);//echo $str;echo "<br>";
        preg_match_all("/\{[^\{]*\"".$key."\"\:\"".$val."\"[^\}]*\}/",$str, $m);
        //echo "<br>";
        if($m && $m[0]){
            foreach($m[0] as $val) $res[] = json_decode($val,true);
        }
        return $res;
    }
    public function test(){
        $json = $this->jsonAll();
        $arr = json_decode($json,true);
        $arr = $arr["data"];echo "<pre>";var_dump($arr);
        $arr = $this->seekarr($arr,"id","1001");
        //echo "<pre>";var_dump($arr);
    }
    //得到带有条件的数据
    public function jsonWhere($uid){
        $json = $this->commonFun1();
        $row = json_decode($json,true);
        $row = $row["data"]; //得到你想要的数组数据
        $search = $this->search($row,$uid);
        return $search;
    }
    public function testData(){
        $json = $this->commonFun1();
        $row = json_decode($json,true);
        $row = $row["data"]; //得到你想要的数组数据
        echo "<pre>";var_dump($row);
    }
    //显示
    /**
     * 显示数据
     * id【序号】
     * type【任务类型】
     * order【任务顺序】
     * reward.type【任务奖励类型】、reward.num【任务奖励数量】
     * game.type【任务游戏类型】、game.subType【任务游戏模式类型】、game.matchName【游戏场次】
     * 任务内容【condition.type【类型】、condition.num【数量】】
     * 时间范围【startTimeStr、endTimeStr】
     * 任务状态【暂无】
     */
    public function changeValue(){
        $json = $this->jsonAll();

        $arr = json_decode($json,true);
        $arr = $arr["data"];
        $configType = config("configType");
        $count = count($configType);
        $json1 = "";
        for($i=0;$i<$count;$i++){
            if(empty($arr[$configType[$i]])){
                //echo "null";
            }
            else {//echo $i;
                $count1 = count($arr[$configType[$i]]);
                for($j=0;$j<$count1;$j++){
                    $arr[$configType[$i]][$j]["currencyType"] = $configType[$i];
                }
                $json2 = json_encode($arr[$configType[$i]],JSON_UNESCAPED_UNICODE);
                $json1 .= $json2.',';
            }
        }
        $json3 = substr($json1,0,-1);
        $json3 = str_replace("[{","{",$json3);
        $json3 = str_replace("}]","}",$json3);
        $json3 = '['.$json3.']';
        return $json3;
    }
    public function isValue(){
        $json = $this->jsonAll();
        $arr = json_decode($json,true);
        $arr = $arr["data"];
        $configType = config("configType");
        $count = count($configType);
        $str = "";
        for($i=0;$i<$count;$i++){
            if(empty($arr[$configType[$i]])){
                $str .= "0".",";
            }
            else {
                $str .= "1".",";
            }
        }
        $str = substr($str,0,-1);
        $strarr = explode(",",$str);
        if(in_array("1",$strarr)){
            return 1;
        }else{
            return 0;
        }
    }
    public function index(){
        //得到现在时间方便在列表页面过期了的数据就不删除,删除按钮直接显示已过期
        $now = date("Y-m-d H:i:s");
        $this->assign("now",$now);
        $ip = config('IP1');
        $this->assign("ip",$ip);
        if(input("post.uid")){//条件查询
            $query=['uid'=>input("post.uid")];
        }
        elseif(input("get.uid")){//分页查询
            $query=['uid'=>input("get.uid")];
        }
        else{//初始或者无条件的按钮操作
            $query=['uid'=>input("get.uid")];
        }
        $uid = $query["uid"];//得到uid之后应该判断改uid是否为空

        $json = $this->changeValue();
        $arr = json_decode($json,true);
        $data = $arr;   //需要输出的数组

        $curpage = input('page') ? input('page') : 1;//当前第x页，有效值为：1,2,3,4,5...
        $listRow = 10;//每页10行记录
        $dataTo=$arr;
        $dataTo=array_chunk($arr,$listRow);
        $showdata=array();
        if($dataTo){
            $showdata = $dataTo[$curpage-1];
        }
        else{
            $showdata=null;
        }
        $p = Bootstrap::make($showdata, $listRow, $curpage, count($data), false, [
            'var_page' => 'page',
            'path'     => url('index'),//这里根据需要修改url
            'query'    => $query,
            'fragment' => '',
        ]);
        $p->appends($_GET);
        $this->assign('plist', $p);
        $this->assign('plistpage', $p->render());
        $this->assign("uid",$uid);
        $isValue = $this->isValue();
        if($isValue==1){
            return $this->view->fetch();
        }
        else {
            return $this->view->fetch("task/system/null");
        }
    }

    /**
     * 显示添加系统设置的页面 add()
     */
    public function add(){
        $time = "00:00:00 至 23:59:59";
        $this->assign("time",$time);
        $ip = config('IP1');
        $this->assign("ip",$ip);
        $configType = config("configType");
        $this->assign("configType",$configType);
        return $this->view->fetch();
    }
    /**
     * 传的参数
     * repeatType、
     * rewardType、
     * rewardNum、
     * order、
     * gameTypeLimit、
     * gameSubType、
     * matchNameLimit、
     * conditionType、
     * conditionNum
     * return json
     * 系统设置的添加 addSave()
     */
    public function addSave(){
        $asset = $_POST['asset'];
        $repeatType = $_POST['repeatType'];
        $rewardType = $_POST['rewardType'];
        $rewardNum = $_POST['rewardNum'];
        $order = $_POST['order'];
        $gameTypeLimit = $_POST['gameTypeLimit'];
        $matchNameLimit = $_POST['matchNameLimit'];
        $conditionType = $_POST['conditionType'];
        $conditionNum = $_POST['conditionNum'];

        //得到时间
        $time = $_POST['time'];
        $times = explode(" 至 ",$time);
        //得到开始时间
        $startTime = $times[0];
        //得到结束时间
        $endTime = $times[1];
        $gameSubType = $_POST['gameSubType'];
        //repeatType这个类型值为2时传时间戳
        //repeatType为任意2的时候时间传时间戳
        if($repeatType==1){
            $startTime = strtotime($startTime);
            $endTime = strtotime($endTime);
            $row = $this->commonFun($asset,$repeatType,$rewardType,$rewardNum,$order,$gameTypeLimit,$matchNameLimit,$conditionType,$conditionNum,$startTime,$endTime,$gameSubType);
            if($row==true){
                echo json_encode("一次性任务");
            }
        }
        else if($repeatType==2){
            $row = $this->commonFun($asset,$repeatType,$rewardType,$rewardNum,$order,$gameTypeLimit,$matchNameLimit,$conditionType,$conditionNum,$startTime,$endTime,$gameSubType);
            if($row==true){
                echo json_encode("重复任务");
            }
        }
    }

    public function seekarr1($arr=array(),$key,$val){
        $res = array();
        $str = json_encode($arr);
        echo preg_match_all("/\{[^\{]*\"".$key."\"\:\"".$val."\"[^\}]*\}/",$str, $m);
        if($m && $m[0]){
            foreach($m[0] as $val) $res[] = json_decode($val,true);
        }
        return $res;
    }
    /**
     * 编辑操作 edit()
     * 参数$id=null
     */
    public function edit($id = null){
        $configType = config("configType");
        $this->assign("configType",$configType);
        $currencyType = $_GET["currencyType"];
        $this->assign("currencyType",$currencyType);
        $json = $this->commonFun4($id,$currencyType);
        $arr = json_decode($json,true);
        $arr = $arr["data"];
        $startTimeStr = $arr[0]["startTimeStr"];
        $endTimeStr = $arr[0]["endTimeStr"];
        $time = $startTimeStr." 至 ".$endTimeStr;
        $this->assign("time",$time);
        $this->assign("list",$arr);
        $ip = config('IP1');
        $this->assign("ip",$ip);
        return $this->view->fetch();
    }
    /**
     * 编辑保存 editSave()
     */
    public function editSave(){
        $asset = $_POST['asset'];
        $id = $_POST['id'];
        $repeatType = $_POST['repeatType'];
        $rewardType = $_POST['rewardType'];
        $rewardNum = $_POST['rewardNum'];
        $order = $_POST['order'];
        $gameTypeLimit = $_POST['gameTypeLimit'];
        $matchNameLimit = $_POST['matchNameLimit'];
        $conditionType = $_POST['conditionType'];
        $conditionNum = $_POST['conditionNum'];

        //得到时间
        $time = $_POST['time'];
        $times = explode(" 至 ",$time);
        //得到开始时间
        $startTime = $times[0];
        //得到结束时间
        $endTime = $times[1];
        $gameSubType = $_POST['gameSubType'];
        //repeatType这个类型值为2时传时间戳
        //repeatType为任意2的时候时间传时间戳
        if($repeatType==1){
            $startTime = strtotime($startTime);
            $endTime = strtotime($endTime);
            $row = $this->commonFun3($id,$asset,$repeatType,$rewardType,$rewardNum,$order,$gameTypeLimit,$matchNameLimit,$conditionType,$conditionNum,$startTime,$endTime,$gameSubType);
            if($row==true){
                echo json_encode("一次性任务的修改");
            }
        }
        else if($repeatType==2){
            $row = $this->commonFun3($id,$asset,$repeatType,$rewardType,$rewardNum,$order,$gameTypeLimit,$matchNameLimit,$conditionType,$conditionNum,$startTime,$endTime,$gameSubType);
            if($row==true){
                echo json_encode("重复任务的修改");
            }
        }
    }

    /**
     * 删除 del()
     * 参数$id=null
     */
    public function del($id = null){
        //
        $id = $_POST["id"];
        $asset = $_POST["asset"];
        $row = $this->commonFun2($id,$asset);
        if($row=true){
            echo json_encode("删除成功");
        }
        else {
            echo json_encode("删除失败");
        }
    }

    /**
     * 得到开始时间
     * getEndTimeStr()
     */
    public function getStartTimeStr(){
        $startTimeStr = $_GET["startTimeStr"];
        echo "<h1>".$startTimeStr."<h1>";
    }

    /**
     * 得到结束时间
     * getEndTimeStr()
     */
    public function getEndTimeStr(){
        $endTimeStr = $_GET["endTimeStr"];
        echo "<h1>".$endTimeStr."<h1>";
    }

}
