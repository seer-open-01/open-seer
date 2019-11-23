<?php

namespace app\admin\model;

use think\Model;
/*
 * 房卡消耗
 * */

class Gold extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'goods_log';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
