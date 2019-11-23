<?php

namespace app\admin\model;

use think\Model;
/*
 * 跑马灯设置
 * */

class Phone extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'phone_card';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
