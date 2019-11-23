<?php

namespace app\admin\model;

use think\Model;
/*
 * 游戏卡模型
 * */

class Gamecard extends Model
{
    protected $connection = 'db_config2';
    protected $name = 'game_card';
    public function getCreateTimeAttr($time)
    {
        return $time;
    }
}
