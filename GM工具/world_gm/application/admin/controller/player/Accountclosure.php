<?php
namespace app\admin\controller\player;
use app\common\controller\Backend;
use think\db;
use app\common\controller\Url;
/**
 * 账号封禁
 *
 * @icon fa fa-user
 */
class Accountclosure extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;
    protected $model1 = null;
    protected $model2 = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Accountclosure');
        $this->model1 = model('Log');
        $this->model2 = model('Player');
        $this->getUrl = new Url();
    }

    public function commonFun(){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "sendBlackList"
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }

    //账号列表页面
    public function index(){
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax())
        {
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
            list($where,$sort,$order,$offset,$limit) = $this->buildparams("account_closure.uid");
            $total = $this->model
                ->join('user_list','user_list.uid=account_closure.uid')
                ->field("user_list.*,account_closure.*,(case prohibit_log when 1 then '是' else '否' end) as whether,(case prohibit_game when 1 then '是' else '否' end) as whether1,(case kick_line when 1 then '是' else '否' end) as whether2")
                ->where($where)
                ->order($sort, $order)
                ->count();
            $list = $this->model
                ->join('user_list','user_list.uid=account_closure.uid')
                ->field("user_list.*,account_closure.*,(case prohibit_log when 1 then '是' else '否' end) as whether,(case prohibit_game when 1 then '是' else '否' end) as whether1,(case kick_line when 1 then '是' else '否' end) as whether2")
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }

        return $this->view->fetch();
    }

    //跳转到新增弹窗界面
    public function tiao(){
        $rows = $this->model
                     ->field("uid")
                     ->select();
        if(empty($rows)){
            $list = //Db::table('gmt.user_list')
                $this->model2
                    //->where($where)
                    ->select();//echo "<pre>";var_dump($list);
            $this->assign('list',$list);
            return $this->view->fetch("player/accountclosure/add");
        }
        else {
            $count = count($rows);
            $uids = "";
            for($i=0;$i<$count;$i++){
                $uids .= $rows[$i]['uid'].",";
            }
            $uids = substr($uids,0,-1);
            $where = 'uid not in ('.$uids.')';//echo $where;
            $list = //Db::table('gmt.user_list')
                $this->model2
                    ->where($where)
                    ->select();//echo "<pre>";var_dump($list);
            $this->assign('list',$list);
            return $this->view->fetch("player/accountclosure/add");
        }
        /*$count = count($rows);
        $uids = "";
        for($i=0;$i<$count;$i++){
            $uids .= $rows[$i]['uid'].",";
        }
        $uids = substr($uids,0,-1);
        $where = 'uid not in ('.$uids.')';//echo $where;
        $list = //Db::table('gmt.user_list')
                $this->model2
                ->where($where)
                ->select();//echo "<pre>";var_dump($list);
        $this->assign('list',$list);
        return $this->view->fetch("player/accountclosure/add");*/
    }

    public function log1($log){
        $username = $_SESSION['think']['admin']['username'];//得到登录时的管理员名称
        $data1['username'] = $username;
        $data1['operation_time'] = date("Y-m-d H:i:s");
        $data1['tname'] = "新增";//tname
        $data1['content'] = $log;//content
        $row = $this->model1->insert($data1);
    }

    //http://192.168.9.233:7001/?mode=gm&act=sendBlackList
    /**
     * 保存新增信息
     */
    public function addSave(){
        //得到现在的时间
        $now = date("Y-m-d H:i:s");
        $uid = $_POST['uid'];//首先要将游戏ID转化为数组
        $log = $_POST['log'];
        $str = $_POST['str'];
        //转化游戏ID
        $uidd = explode(",",$uid);
        $countd = count($uidd);
        $uidf = "";
        for($k=0;$k<$countd;$k++){
            $start = strpos($uidd[$k],"(");
            $end = strpos($uidd[$k],")");
            $uidf .= substr($uidd[$k],0,$start).",";
        }
        $uidf = substr($uidf,0,-1);

        $uidArr = explode(",",$uidf);//将uid集合转化为数组
        $strArr = explode(",",$str);//将状态转化为数组
        $count1 = count($strArr);
        $json1 = "";
        for($i=0;$i<$count1;$i++){
            $json1 .= '"'.$strArr[$i].'":"1"'.',';
        }
        $json1 = substr($json1,0,-1);
        $count2 = count($uidArr);
        $json = "";
        for($j=0;$j<$count2;$j++){
            $json .= '{"uid":"'.$uidArr[$j].'",'.'"create_time":"'.$now.'",'.$json1.'}'.',';
        }
        $json = substr($json,0,-1);
        $jsons = '['.$json.']';
        $arrr = json_decode($jsons);
        $arrr1 = json_decode(json_encode($arrr),true);
        //新增数据sql
        $data = $arrr1;
        $row = $this->model->insertAll($data);

        if($row=true){
            $this->log1($log);
            $this->commonFun();
        }

        //添加操作日志
        /*$username = $_SESSION['think']['admin']['username'];//得到登录时的管理员名称
        $data1['username'] = $username;
        $data1['operation_time'] = date("Y-m-d H:i:s");
        $data1['tname'] = "新增";//tname
        $data1['content'] = $log;//content
        $row = Db::table('gmt.operation_log')->insert($data1);*/

        echo json_encode($row);
        //$row = $this->model->add();
    }

    //得到编辑页面
    //编辑是弹窗里的状态不能没有被选中的
    public function edit($ids=""){
        /*$row = $this->model->get($ids);//echo "<pre>";var_dump($row);
        return $this->view->fetch();*/
        $row = $this->model->get($ids);
        $uid = $row['uid'];
        $where = "uid='$uid'";
        $wx_names = //Db::table('gmt.user_list')
                   $this->model2
                   ->where($where)
                   ->select();
        $wx_name = $wx_names[0]['wx_name'];//echo $wx_name;
        $prohibit_log = $row['prohibit_log'];
        $prohibit_game = $row['prohibit_game'];
        $kick_line = $row['kick_line'];
        $this->assign('uid',$uid);
        $this->assign('wx_name',$wx_name);
        $this->assign('prohibit_log',$prohibit_log);
        $this->assign('prohibit_game',$prohibit_game);
        $this->assign('kick_line',$kick_line);
        return $this->view->fetch();
    }

    public function log2($log){
        //添加操作日志
        $username = $_SESSION['think']['admin']['username'];//得到登录时的管理员名称
        $data1['username'] = $username;
        $data1['operation_time'] = date("Y-m-d H:i:s");
        $data1['tname'] = "修改";//tname
        $data1['content'] = $log;//content
        $row = $this->model1->insert($data1);
    }

    //编辑页面的保存信息按钮
    public function editSave(){
        $now = date("Y-m-d H:i:s");
        $uid = $_POST['uid'];//首先要将游戏ID转化为数组
        $log = $_POST['log'];
        $str = $_POST['str'];
        /*$uid = "100005";//首先要将游戏ID转化为数组
        $log = "修改";
        $str = "prohibit_log,prohibit_game";*/
        $strArr = explode(",",$str);//将状态转化为数组
        $strArr1 = array(
              "prohibit_log",
              "prohibit_game",
              "kick_line"
          );
        //比较两个数组不相同的值 strArr与strArr1
        $differ = array_merge(array_diff($strArr1,$strArr),array_diff($strArr,$strArr1));
        $count2 = count($differ);
        $jsonf = "";
        for($a=0;$a<$count2;$a++){
            $jsonf .= '"'.$differ[$a].'":"0"'.',';
        }
        //$jsonf = substr($jsonf,0,-1);

        $count1 = count($strArr);
        $json1 = "";
        for($i=0;$i<$count1;$i++){
            $json1 .= '"'.$strArr[$i].'":"1"'.',';
        }
        $json1 = substr($json1,0,-1);
        $json1s = $jsonf.$json1;
        $json = '{'.'"create_time":"'.$now.'",'.$json1s.'}';
        $jsons = '['.$json.']';
        $arrr = json_decode($jsons);
        $arrr1 = json_decode(json_encode($arrr),true);
        $data = $arrr1;//echo "<pre>";var_dump($data);
        //Db::table('think_user')->update(['name' => 'thinkphp','id'=>1]);
        $row = $this->model->where("uid='$uid'")->update($data[0]);

        if($row=true){
            $this->log2($log);
            $this->commonFun();
        }

        /*//添加操作日志
        $username = $_SESSION['think']['admin']['username'];//得到登录时的管理员名称
        $data1['username'] = $username;
        $data1['operation_time'] = date("Y-m-d H:i:s");
        $data1['tname'] = "修改";//tname
        $data1['content'] = $log;//content
        $row = Db::table('gmt.operation_log')->insert($data1);*/

        echo json_encode($row);

    }

    //删除是弹窗里面的状态是可以有没有被选中的多选框
    public function del($ids=""){
        $row = $this->model->get($ids);
        $uid = $row['uid'];
        $where = "uid='$uid'";
        $wx_names = //Db::table('gmt.user_list')
                   $this->model2
                   ->where($where)
                   ->select();
        $wx_name = $wx_names[0]['wx_name'];//echo $wx_name;
        $prohibit_log = $row['prohibit_log'];
        $prohibit_game = $row['prohibit_game'];
        $kick_line = $row['kick_line'];
        $this->assign('uid',$uid);
        $this->assign('wx_name',$wx_name);
        $this->assign('prohibit_log',$prohibit_log);
        $this->assign('prohibit_game',$prohibit_game);
        $this->assign('kick_line',$kick_line);
        return $this->view->fetch();
    }

    public function log3($log){
        //添加操作日志
        $username = $_SESSION['think']['admin']['username'];//得到登录时的管理员名称
        $data1['username'] = $username;
        $data1['operation_time'] = date("Y-m-d H:i:s");
        $data1['tname'] = "移除";//tname
        $data1['content'] = $log;//content
        //$row = Db::table('gmt.operation_log')->insert($data1);
        $row = $this->model1->insert($data1);
    }

    //移除按钮操作
    public function delSave(){
        $now = date("Y-m-d H:i:s");
        $uid = $_POST['uid'];//首先要将游戏ID转化为数组
        $log = $_POST['log'];
        $str = $_POST['str'];
        /*$uid = "100005";//首先要将游戏ID转化为数组
        $log = "修改";
        $str = "prohibit_log,prohibit_game";*/
        if($str==""){
            $strArr1 = array(
                  "prohibit_log",
                  "prohibit_game",
                  "kick_line"
              );
            $count2 = count($strArr1);
            $jsonf = "";
            for($a=0;$a<$count2;$a++){
                $jsonf .= '"'.$strArr1[$a].'":"0"'.',';
            }
            $jsonf = substr($jsonf,0,-1);
            $json1s = $jsonf;
            $json = '{'.'"create_time":"'.$now.'",'.$json1s.'}';
            $jsons = '['.$json.']';
            $arrr = json_decode($jsons);
            $arrr1 = json_decode(json_encode($arrr),true);
            $data = $arrr1;//echo "<pre>";var_dump($data);
            //Db::table('think_user')->update(['name' => 'thinkphp','id'=>1]);
            $row = $this->model->where("uid='$uid'")->update($data[0]);

            //添加操作日志
            $username = $_SESSION['think']['admin']['username'];//得到登录时的管理员名称
            $data1['username'] = $username;
            $data1['operation_time'] = date("Y-m-d H:i:s");
            $data1['tname'] = "移除";//tname
            $data1['content'] = $log;//content
            //$row = Db::table('gmt.operation_log')->insert($data1);
            $row = $this->model1->insert($data1);

            echo json_encode($row);
        }
        else {
            $strArr = explode(",",$str);//将状态转化为数组
            $strArr1 = array(
                  "prohibit_log",
                  "prohibit_game",
                  "kick_line"
              );
            //比较两个数组不相同的值 strArr与strArr1
            $differ = array_merge(array_diff($strArr1,$strArr),array_diff($strArr,$strArr1));
            $count2 = count($differ);
            $jsonf = "";
            for($a=0;$a<$count2;$a++){
                $jsonf .= '"'.$differ[$a].'":"0"'.',';
            }
            //$jsonf = substr($jsonf,0,-1);

            $count1 = count($strArr);
            $json1 = "";
            for($i=0;$i<$count1;$i++){
                $json1 .= '"'.$strArr[$i].'":"1"'.',';
            }
            $json1 = substr($json1,0,-1);
            $json1s = $jsonf.$json1;
            $json = '{'.'"create_time":"'.$now.'",'.$json1s.'}';
            $jsons = '['.$json.']';
            $arrr = json_decode($jsons);
            $arrr1 = json_decode(json_encode($arrr),true);
            $data = $arrr1;//echo "<pre>";var_dump($data);
            //Db::table('think_user')->update(['name' => 'thinkphp','id'=>1]);
            $row = $this->model->where("uid='$uid'")->update($data[0]);

            if($row=true){
                $this->log3($log);
                $this->commonFun();
            }
            //else {}

            /*//添加操作日志
            $username = $_SESSION['think']['admin']['username'];//得到登录时的管理员名称
            $data1['username'] = $username;
            $data1['operation_time'] = date("Y-m-d H:i:s");
            $data1['tname'] = "移除";//tname
            $data1['content'] = $log;//content
            //$row = Db::table('gmt.operation_log')->insert($data1);
            $row = $this->model1->insert($data1);*/

            echo json_encode($row);
        }
    }

}
