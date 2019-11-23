<?php

namespace app\admin\model;

use think\Model;
/*
 * 使用物品
 * */

class Usegoods extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'use_goods';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}