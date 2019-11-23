<?php

namespace app\admin\model;

use think\Model;
/*
 * 提现审核
 * */

class Putforwardlist extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'user_list';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}