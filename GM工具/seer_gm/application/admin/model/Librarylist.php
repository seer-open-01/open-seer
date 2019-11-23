<?php

namespace app\admin\model;

use think\Model;
/*
 * 跑马灯设置
 * */

class Librarylist extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'user_list';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}