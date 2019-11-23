<?php

namespace app\admin\model;

use think\Model;
use think\Session;

class PLyaerMonitor extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'user_list';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
