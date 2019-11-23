<?php

namespace app\admin\model;

use think\Model;

class Diamond extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'goods_log';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
