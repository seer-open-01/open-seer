<?php

namespace app\admin\model;

use think\Model;
use think\Session;
use app\admin\model\Player;

class Pfcrecharge extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'pfc_recharge_log';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
    public function category()
    {
        return $this->belongsTo('Player', 'uid')->setEagerlyType(0);
    }
}
