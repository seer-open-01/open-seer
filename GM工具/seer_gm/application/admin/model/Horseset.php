<?php

namespace app\admin\model;

use think\Model;
/*
 * 跑马灯设置 notice_config表
 * */

class Horseset extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'notice_config';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
