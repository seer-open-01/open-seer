<?php

namespace app\admin\controller\player;

use app\common\controller\Backend;
use Think\Db;
use app\common\controller\Url;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Agent extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Agent');
        $this->getUrl = new Url();
    }

    //GM后台开通总代
    public function commonFun($uid){
        $ip = config('IP');
        $post_data = array (
            "mode" => "gm",
            "act" => "openAllAgent",
            "uid" => $uid//下级玩家的uid
        );
        return $this->getUrl->commonFun($ip,$post_data);
    }

    /**
     * 查看
    */
    public function index(){
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
            list($where,$sort,$order,$offset,$limit) = $this->buildparams("uid");
            $total = $this->model
                //->with('group')
                ->where("pre_uid='0' and proxy_lv='1' and next_uids='{}'")
                ->where($where)
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where("pre_uid='0' and proxy_lv='1' and next_uids='{}'")
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }

        return $this->view->fetch();
    }
    //在GM后台设置总代操作
    public function set($ids=NULL){
        if ($ids)
        {
            $row = $this->model->get($ids);
            $uid = $row['uid'];
            $this->commonFun($uid);
            $this->success();
        }
        $this->error();
    }
}
