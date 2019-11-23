<?php

namespace app\admin\model;

use think\Model;
/*
 * 电话卡
 * */

class Phonecard extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'phone_card';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
