<?php

namespace app\admin\model;

use think\Model;
/*
 * 账号封禁
 * */

class Bindphone extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'authtell_log';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
