<?php

namespace app\admin\controller\clear;

use app\common\controller\Backend;
use think\db;
use think\Request;
use ZipArchive;

/**
 * 清空框架临时文件缓存
 *
 * @icon fa fa-user
 */
class Temp extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    public $path = '/var/www/html/fastadmin_revision1/runtime/temp';//删除文件的目录

    public function _initialize()
    {
        parent::_initialize();
    }
    //清除日志列表页面
    public function index(){
        return $this->view->fetch();
    }
    //删除文件夹以及文件夹里面所有的文件

    public function deldir($dir) {
        //先删除目录下的文件：
        $dh=opendir($dir);
        while ($file=readdir($dh)) {
            if($file!="." && $file!="..") {
                $fullpath=$dir."/".$file;
                if(!is_dir($fullpath)) {
                    unlink($fullpath);
                } else {
                    $this->deldir($fullpath);
                }
            }
        }
        closedir($dh);
        //删除当前文件夹：
        if(@rmdir($dir)) {
            return true;
        } else {
            return false;
        }
    }
    //清除日志操作
    public function clearOperation(){
        $del = $this->deldir($this->path);
        if($del=true){
            $this->success('清空临时文件成功');
        }
        else {
            $this->error("清空临时文件失败");
        }
    }
}
