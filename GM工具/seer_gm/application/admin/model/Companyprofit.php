<?php

namespace app\admin\model;

use think\Model;
use think\Session;
use app\admin\model\Player;

class Companyprofit extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'company_profit';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
    public function category()
    {
        return $this->belongsTo('Player', 'uid')->setEagerlyType(0);
    }
}
