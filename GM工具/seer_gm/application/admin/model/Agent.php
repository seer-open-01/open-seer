<?php

namespace app\admin\model;

use think\Model;
/*
 * 代理模型
 * */

class Agent extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'user_list';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
