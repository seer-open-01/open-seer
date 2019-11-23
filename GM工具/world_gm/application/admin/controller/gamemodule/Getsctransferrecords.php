<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use think\paginator\driver\Bootstrap;
use Think\Db;
use app\common\controller\Url;

/**
 * 获取平台划转情况
 *
 * @icon fa fa-user
 */
class Getsctransferrecords extends Backend
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
    public function commonFun(){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "getSCTransferRecords"
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }

    /**
     * 查看
     */
    public function jsonAll(){
        $result = $this->commonFun();
        return $result;
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

        $json = $this->jsonAll();
        $arr = json_decode($json,true);
        if($arr["code"]==400){
            echo "服务器异常";
        }
        else {
            $arr = $arr["records"];
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
            return $this->fetch();
        }
    }
}
