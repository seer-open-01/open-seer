<?php

namespace app\admin\model;

use think\Model;
/*
 * 账号表
 * */

class Accountclosure extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'account_closure';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
