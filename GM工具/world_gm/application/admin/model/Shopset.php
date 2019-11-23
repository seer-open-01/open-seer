<?php

namespace app\admin\model;

use think\Model;
/*
 * 账号封禁
 * */

class Shopset extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'shop_config';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
