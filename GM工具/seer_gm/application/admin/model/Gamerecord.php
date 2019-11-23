<?php

namespace app\admin\model;

use think\Model;

class Gamerecord extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'round_log';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
