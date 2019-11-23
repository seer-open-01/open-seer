<?php

namespace app\admin\model;

use think\Model;

class Rechargerecord extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'goods_log';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
