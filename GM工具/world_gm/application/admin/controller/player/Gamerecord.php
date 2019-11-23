<?php

namespace app\admin\controller\player;

use app\common\controller\Backend;
use think\paginator\driver\Bootstrap;
use Think\Db;
header("Content-type:text/html;charset=utf-8");

/**
 * 游戏记录
 *
 * @icon fa fa-user
 */
class Gamerecord extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Gamerecord');
    }

    //json
    function json_encode($array)
    {
        if(version_compare(PHP_VERSION,'5.4.0','<')){
            $str = json_encode($array);
            $str = preg_replace_callback("#\\\u([0-9a-f]{4})#i",function($matchs){
                return iconv('UCS-2BE', 'UTF-8', pack('H4', $matchs[1]));
            },$str);
            return $str;
        }else{
            return json_encode($array, JSON_UNESCAPED_UNICODE);
        }
    }

    public function indexs(){
        $row = $this->model->select();
        $arrayy = json_decode( json_encode($row),true);
        $county = count($arrayy);
        $json = "";

        $jsons = "";
        for($i=0;$i<$county;$i++) {
            $jr = $row[$i]['player_info'];
            if(strpos($jr, '"}') !== false){

            }
            else {
                $jr = $jr.'"}';
            }
            $arr = json_decode($jr);
            $array = json_decode( json_encode( $arr),true);
            $count = count($array);

            $round_id = $row[$i]['round_id'];
            $end_time = $row[$i]['end_time'];
            $match_id = $row[$i]['match_id'];
            $countf = $count-1;
            $json .= '{"frequency":"'.$count.'","frequency1":"'.$countf.'","round_id":"'.$round_id.'","end_time":"'.$end_time.'","match_id":"'.$match_id.'"'.'}'.",";


            $jrr = $row[$i]['player_info'];
            if(strpos($jrr, '"}') !== false){

            }
            else {
                $jrr = $jrr.'"}';
            }
            $arr = json_decode($jrr);
            $array = json_decode( json_encode( $arr),true);
            $count = count($array);
            $xin = $array;
            $xin = array_values($xin);
            $count1 = count($xin);
            $strr = "";
            $strr1 = "";
            $strr2 = "";
            for($j=0;$j<$count1;$j++){
                $uid = $xin[$j];
                $start = stripos($uid,"姓名");
                $end = stripos($uid," UID");
                $len = $end-$start;
                $strr .= substr($uid,$start+7,$len-7).",";//得到了昵称
                $start1 = stripos($uid," UID");
                $end1 = stripos($uid," 手");
                $len1 = $end1-$start1;
                $strr1 .= substr($uid,$start1+5,6).",";//得到了游戏ID
                //得到牌型详情值
                $start2 = stripos($uid,"UID:");
                $end2 = stripos($uid," 手");
                $len2 = $end2-$start2;
                $strr2 .= substr($uid,$start2+11).",";//得到牌型详情值
            }
            $strr = substr($strr,0,-1);
            $jsona = "";
            $jsona .= '{"frequency":"'.$count.'","frequency1":"'.$countf.'","round_id":"'.$round_id.'","end_time":"'.$end_time.'","match_id":"'.$match_id.'"'.",";
            $strrarr = explode(",",$strr);
            $count = count($strrarr);
            $json1 = "";
            //得到昵称
            for($a=0;$a<$count;$a++){
                $json1 .= '"'.$a.'":"'.$strrarr[$a].'",';
            }
            $josn1 = substr($json1,0,-1);
            //得到uid
            $strr1 = substr($strr1,0,-1);
            $strrarr1 = explode(",",$strr1);
            $count1 = count($strrarr1);
            $json2 = "";
            for($b=0;$b<$count1;$b++){
                $json2 .= '"'.$b.'":"'.$strrarr1[$b].'",';
            }
            $json2 = substr($json2,0,-1);

            //做牌型
            $strr2 = substr($strr2,0,-1);
            $strrarr2 = explode("),",$strr2);
            $count2 = count($strrarr2);
            $json3 = "";
            //得到牌型
            for($c=0;$c<$count2;$c++){
                if($c<$count2-1){
                    $json3 .= '"'.$c.'":"'.$strrarr2[$c].')",';
                }
                else {
                    $json3 .= '"'.$c.'":"'.$strrarr2[$c].'",';
                }
            }
            $json3 = substr($json3,0,-1);

            //得到得分情况
            $jrrs = $row[$i]['score'];
            $arrs = json_decode($jrrs);
            $arrays = json_decode( json_encode( $arrs),true);
            $counts = count($arrays);
            $xins = $arrays;
            $xins = array_values($xins);
            $count1s = count($xins);
            $strrs = "";
            $json4 = "";

            for($e=0;$e<$count1s;$e++){
                $json4 .= '"'.($e).'":"'.$xins[$e].'",';
            }

            $json4 = substr($json4,0,-1);

            $jsons .= $jsona.'"uid":{'.$josn1.'}'.',"uids":{'.$json2.'}'.',"playerList":{'.$json3.'}'.',"uidss":{'.$json4.'}'.'}'.',';
        }
        $jsons = substr($jsons,0,-1);
        $jsons = "[".$jsons."]";
        $jsons = str_replace("''","",$jsons);
        $jsons = str_replace(" ","",$jsons);
        $return_data=mb_convert_encoding($jsons, "UTF-8","UTF-8");
        $return_data = str_replace("?","",$return_data);
        return $return_data;
    }

    public function index1(){
        $where   = [];
        $request = input('request.');
        if (!empty($request['round_id'])) {
            echo "为空";
        }
        else {
            echo "不为空";
        }

    }
    public function index2(){
        $jsons = $this->indexs();
        $jsons = trim($jsons);
        $arr = json_decode($jsons,true);//得到数据

        $query=$arr;
        if(input("post.round_id")){//条件查询
            $query=['round_id'=>input("post.round_id")];
        }
        elseif(input("get.round_id")){//分页查询
            $query=['round_id'=>input("get.round_id")];
        }
        else{//初始或者无条件的按钮操作
            $query=['round_id'=>input("get.round_id")];
        }

        $data = $arr;   //需要输出的数组
        $curpage = input('page') ? input('page') : 1;//当前第x页，有效值为：1,2,...
        $listRow = 10;//每页10行记录
        $dataTo=$arr;
        $dataTo=array_chunk($data,$listRow);
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
        $this->assign('list', $p);
        $this->assign('plistpage', $p->render());
        return $this->fetch("player/gamerecord/index");
    }
    //备份的数据页面
    public function index_copy(){
        $jsons = $this->indexs();
        $jsons = trim($jsons);
        $arr = json_decode($jsons,true);
        //echo "<pre>";var_dump($arr);
        $this->assign("list",$arr);
        return $this->view->fetch("player/gamerecord/index");
    }

    /*
     * 牌型弹窗详情数据
     * */
    public function details(){
        $ids = $_POST['ids'];
        $ids = str_replace("手","手:",$ids);
        $idss = str_replace(")","])",$ids);
        $idss = substr($idss,0,-1);
        $arr = explode(")",$idss);
        $count = count($arr);
        $zii = "";
        $str1 = "";
        $strrs = "";
        $str11 = "";
        for($i=0;$i<$count;$i++){
            $start = stripos($arr[$i],"(");
            $end = stripos($arr[$i],"]");
            $len = $end-$start;
            $strr = substr($arr[$i],$start+1,$len-1);
            $arr1 = explode(",",$strr);
            $count1 = count($arr1);

            //得到前面的字
            $startt = "0";
            $endd = stripos($arr[$i],":");
            $lenn = $endd-$startt;
            $zi = substr($arr[$i],$startt,$lenn);

            for($j=0;$j<$count1;$j++){
                $zhi = $arr1[$j];
                if($zhi>=11 and $zhi<=19){
                    $str1 .= "筒".",";
                }
                else if($zhi>=21 and $zhi<=29){
                    $str1 .= "条".",";
                }
                else if($zhi>=31 and $zhi<=39){
                    $str1 .= "万".",";
                }
                else if($zhi>=41 and $zhi<=44){
                    if($zhi==41){
                        $str1 .= "东".",";
                    }
                    else if($zhi==42){
                        $str1 .= "南".",";
                    }
                    else if($zhi==43){
                        $str1 .= "西".",";
                    }
                    else if($zhi==44){
                        $str1 .= "北".",";
                    }
                }
                else if($zhi>=51 and $zhi<=53){
                    //$str1 .= "中发白".",";
                    if($zhi==51){
                        $str1 .= "中".",";
                    }
                    else if($zhi==52){
                        $str1 .= "发".",";
                    }
                    else if($zhi==53){
                        $str1 .= "白".",";
                    }
                }
                else if($zhi>=61 and $zhi<=68){
                    //$str1 .= "春夏秋冬 梅兰竹菊".",";
                    if($zhi==61){
                        $str1 .= "春".",";
                    }
                    else if($zhi==62){
                        $str1 .= "夏".",";
                    }
                    else if($zhi==63){
                        $str1 .= "秋".",";
                    }
                    else if($zhi==64){
                        $str1 .= "冬".",";
                    }
                    else if($zhi==65){
                        $str1 .= "梅".",";
                    }
                    else if($zhi==66){
                        $str1 .= "兰".",";
                    }
                    else if($zhi==67){
                        $str1 .= "竹".",";
                    }
                    else if($zhi==68){
                        $str1 .= "菊".",";
                    }
                }
                else if($zhi>=101 and $zhi<=113){
                    //$str1 .= "黑桃".",";
                    if($zhi==101){
                        $str1 .= "黑桃A".",";
                    }
                    else if($zhi==102){
                        $str1 .= "黑桃2".",";
                    }
                    else if($zhi==103){
                        $str1 .= "黑桃3".",";
                    }
                    else if($zhi==104){
                        $str1 .= "黑桃4".",";
                    }
                    else if($zhi==105){
                        $str1 .= "黑桃5".",";
                    }
                    else if($zhi==106){
                        $str1 .= "黑桃6".",";
                    }
                    else if($zhi==107){
                        $str1 .= "黑桃7".",";
                    }
                    else if($zhi==108){
                        $str1 .= "黑桃8".",";
                    }
                    else if($zhi==109){
                        $str1 .= "黑桃9".",";
                    }
                    else if($zhi==110){
                        $str1 .= "黑桃10".",";
                    }
                    else if($zhi==111){
                        $str1 .= "黑桃J".",";
                    }
                    else if($zhi==112){
                        $str1 .= "黑桃Q".",";
                    }
                    else if($zhi==113){
                        $str1 .= "黑桃K".",";
                    }
                }
                else if($zhi>=201 and $zhi<=213){
                    //$str1 .= "红桃".",";
                    if($zhi==201){
                        $str1 .= "红桃A".",";
                    }
                    else if($zhi==202){
                        $str1 .= "红桃2".",";
                    }
                    else if($zhi==203){
                        $str1 .= "红桃3".",";
                    }
                    else if($zhi==204){
                        $str1 .= "红桃4".",";
                    }
                    else if($zhi==205){
                        $str1 .= "红桃5".",";
                    }
                    else if($zhi==206){
                        $str1 .= "红桃6".",";
                    }
                    else if($zhi==207){
                        $str1 .= "红桃7".",";
                    }
                    else if($zhi==208){
                        $str1 .= "红桃8".",";
                    }
                    else if($zhi==209){
                        $str1 .= "红桃9".",";
                    }
                    else if($zhi==210){
                        $str1 .= "红桃10".",";
                    }
                    else if($zhi==211){
                        $str1 .= "红桃J".",";
                    }
                    else if($zhi==212){
                        $str1 .= "红桃Q".",";
                    }
                    else if($zhi==213){
                        $str1 .= "红桃K".",";
                    }
                }
                else if($zhi>=301 and $zhi<=313){
                    //$str1 .= "梅花".",";
                    if($zhi==301){
                        $str1 .= "梅花A".",";
                    }
                    else if($zhi==302){
                        $str1 .= "梅花2".",";
                    }
                    else if($zhi==303){
                        $str1 .= "梅花3".",";
                    }
                    else if($zhi==304){
                        $str1 .= "梅花4".",";
                    }
                    else if($zhi==305){
                        $str1 .= "梅花5".",";
                    }
                    else if($zhi==306){
                        $str1 .= "梅花6".",";
                    }
                    else if($zhi==307){
                        $str1 .= "梅花7".",";
                    }
                    else if($zhi==308){
                        $str1 .= "梅花8".",";
                    }
                    else if($zhi==309){
                        $str1 .= "梅花9".",";
                    }
                    else if($zhi==310){
                        $str1 .= "梅花10".",";
                    }
                    else if($zhi==311){
                        $str1 .= "梅花J".",";
                    }
                    else if($zhi==312){
                        $str1 .= "梅花Q".",";
                    }
                    else if($zhi==313){
                        $str1 .= "梅花K".",";
                    }
                }
                else if($zhi>=401 and $zhi<=413){
                    //$str1 .= "方块".",";
                    if($zhi==401){
                        $str1 .= "方块A".",";
                    }
                    else if($zhi==402){
                        $str1 .= "方块2".",";
                    }
                    else if($zhi==403){
                        $str1 .= "方块3".",";
                    }
                    else if($zhi==404){
                        $str1 .= "方块4".",";
                    }
                    else if($zhi==405){
                        $str1 .= "方块5".",";
                    }
                    else if($zhi==406){
                        $str1 .= "方块6".",";
                    }
                    else if($zhi==407){
                        $str1 .= "方块7".",";
                    }
                    else if($zhi==408){
                        $str1 .= "方块8".",";
                    }
                    else if($zhi==409){
                        $str1 .= "方块9".",";
                    }
                    else if($zhi==410){
                        $str1 .= "方块10".",";
                    }
                    else if($zhi==411){
                        $str1 .= "方块J".",";
                    }
                    else if($zhi==412){
                        $str1 .= "方块Q".",";
                    }
                    else if($zhi==413){
                        $str1 .= "方块K".",";
                    }
                }
                else if($zhi==514){
                    $str1 .= "小王".",";
                }
                else if($zhi==614){
                    $str1 .= "大王".",";
                }
            }

            $str1 = substr($str1,0,-1);
            $str1 .= ")".$zi."--(";

        }
        $str1 = "(".$str1;
        $str1 = substr($str1,0,-3);

        $arrt = explode("--",$str1);
        $county = count($arrt);
        $strtrr = "";
        for($a=0;$a<$county;$a++){
            $rr = $arrt[$a];
            $start = stripos($rr,")");
            $front = substr($rr,$start+1);
            $strt = $front.":".$arrt[$a];
            $startr = "0";
            $endr = stripos($strt,")");
            $lenr = $endr-$startr;
            $strtr = substr($strt,$startr,$lenr+1);
            $strtrr .= $strtr."--";
        }
        $strtrr = str_replace("--","",$strtrr);
        echo $this->json_encode($strtrr);
    }

    //检测一个json到底是否是json数据格式
    public function is_json($string){
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }

    public function json($where){
        ini_set('memory_limit','-1');//内存溢出
        $row = $this->model->where($where)->select();
        $arrayy = json_decode( json_encode($row),true);
        $county = count($arrayy);
        $json = "";

        $jsons = "";
        for($i=0;$i<$county;$i++) {
            $jr = $row[$i]['player_info'];
            if(strpos($jr, '"}') !== false){

            }
            else {
                $jr = $jr.'"}';
            }
            $arr = json_decode($jr);
            $array = json_decode( json_encode( $arr),true);
            $count = count($array);

            $round_id = $row[$i]['round_id'];
            $end_time = $row[$i]['end_time'];
            $match_id = $row[$i]['match_id'];
            $countf = $count-1;
            $json .= '{"frequency":"'.$count.'","frequency1":"'.$countf.'","round_id":"'.$round_id.'","end_time":"'.$end_time.'","match_id":"'.$match_id.'"'.'}'.",";


            $jrr = $row[$i]['player_info'];
            if(strpos($jrr, '"}') !== false){

            }
            else {
                $jrr = $jrr.'"}';
            }
            $arr = json_decode($jrr);
            $array = json_decode( json_encode( $arr),true);
            $count = count($array);
            $xin = $array;
            $xin = array_values($xin);
            $count1 = count($xin);
            $strr = "";
            $strr1 = "";
            $strr2 = "";
            for($j=0;$j<$count1;$j++){
                $uid = $xin[$j];
                $start = stripos($uid,"姓名");
                $end = stripos($uid," UID");
                $len = $end-$start;
                $strr .= substr($uid,$start+7,$len-7).",";//得到了昵称
                $start1 = stripos($uid," UID");
                $end1 = stripos($uid," 手");
                $len1 = $end1-$start1;
                $strr1 .= substr($uid,$start1+5,6).",";//得到了游戏ID
                //得到牌型详情值
                $start2 = stripos($uid,"UID:");
                $end2 = stripos($uid," 手");
                $len2 = $end2-$start2;
                $strr2 .= substr($uid,$start2+11).",";//得到牌型详情值
            }
            $strr = substr($strr,0,-1);
            $jsona = "";
            $jsona .= '{"frequency":"'.$count.'","frequency1":"'.$countf.'","round_id":"'.$round_id.'","end_time":"'.$end_time.'","match_id":"'.$match_id.'"'.",";
            $strrarr = explode(",",$strr);
            $count = count($strrarr);
            $json1 = "";
            //得到昵称
            for($a=0;$a<$count;$a++){
                $json1 .= '"'.$a.'":"'.$strrarr[$a].'",';
            }
            $josn1 = substr($json1,0,-1);
            //得到uid
            $strr1 = substr($strr1,0,-1);
            $strrarr1 = explode(",",$strr1);
            $count1 = count($strrarr1);
            $json2 = "";
            for($b=0;$b<$count1;$b++){
                $json2 .= '"'.$b.'":"'.$strrarr1[$b].'",';
            }
            $json2 = substr($json2,0,-1);

            //做牌型
            $strr2 = substr($strr2,0,-1);
            $strrarr2 = explode("),",$strr2);
            $count2 = count($strrarr2);
            $json3 = "";
            //得到牌型
            for($c=0;$c<$count2;$c++){
                if($c<$count2-1){
                    $json3 .= '"'.$c.'":"'.$strrarr2[$c].')",';
                }
                else {
                    $json3 .= '"'.$c.'":"'.$strrarr2[$c].'",';
                }
            }
            $json3 = substr($json3,0,-1);

            //得到得分情况
            $jrrs = $row[$i]['score'];
            $arrs = json_decode($jrrs);
            $arrays = json_decode( json_encode( $arrs),true);
            $counts = count($arrays);
            $xins = $arrays;
            $xins = array_values($xins);
            $count1s = count($xins);
            $strrs = "";
            $json4 = "";

            for($e=0;$e<$count1s;$e++){
                $json4 .= '"'.($e).'":"'.$xins[$e].'",';
            }

            $json4 = substr($json4,0,-1);

            $jsons .= $jsona.'"uid":{'.$josn1.'}'.',"uids":{'.$json2.'}'.',"playerList":{'.$json3.'}'.',"uidss":{'.$json4.'}'.'}'.',';
        }
        $jsons = substr($jsons,0,-1);
        $jsons = "[".$jsons."]";
        $jsons = str_replace("''","",$jsons);
        $jsons = str_replace(" ","",$jsons);
        $return_data=mb_convert_encoding($jsons, "UTF-8","UTF-8");
        $return_data = str_replace("?","",$return_data);
        return $return_data;
    }

    public function index(){
        if(input("post.uid")){//条件查询
            $query=['uid'=>input("post.uid")];
        }
        elseif(input("get.uid")){//分页查询
            $query=['uid'=>input("get.uid")];
        }
        else{//初始或者无条件的按钮操作
            $query=['uid'=>input("get.uid")];
        }
        $uid = $query["uid"];
        $where = "round_id like '%$uid%'";
        $json = $this->json($where);
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
        //echo $uid;
        return $this->fetch();
    }

}
