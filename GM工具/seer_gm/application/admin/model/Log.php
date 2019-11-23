<?php

namespace app\admin\model;

use think\Model;
/*
 * 跑马灯设置
 * */

class Log extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'operation_log';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
