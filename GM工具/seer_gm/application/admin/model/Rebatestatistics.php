<?php

namespace app\admin\model;

use think\Model;
/*
 * 返利统计统计
 * */

class Rebatestatistics extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'user_list';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}