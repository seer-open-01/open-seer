<?php

namespace app\admin\model;

use think\Model;
/*
 * 跑马灯设置
 * */

class Shopconfig extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'shop_config';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
