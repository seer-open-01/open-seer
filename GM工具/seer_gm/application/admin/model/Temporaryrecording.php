<?php

namespace app\admin\model;

use think\Model;
/*
 * 账号封禁
 * */

class Temporaryrecording extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'temporary_recording';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
