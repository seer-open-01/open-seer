<?php

namespace app\admin\model;

use think\Model;
use think\Session;
/*
 * 服务费记录
 * */

class Servicerecord extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'goods_log';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
