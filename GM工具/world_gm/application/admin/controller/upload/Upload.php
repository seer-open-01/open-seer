<?php

namespace app\admin\controller\upload;

use app\common\controller\Backend;
use think\db;
use think\Request;
use ZipArchive;
/**
 * 上传功能
 *
 * @icon fa fa-user
 */
class Upload extends Backend{

    protected $relationSearch = true;
    public $file_path1 = "uploads/publish.zip";
    public $file_path2 = "/var/www/html/publish";
    public $file_path3 = "/var/www/html";

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Player');
    }

    // 文件上传表单
    public function index(){
        if(file_exists($this->file_path1)){
            unlink($this->file_path1);
            return $this->fetch();
        }
        else {
            return $this->fetch();
        }
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

    //解压一个压缩包
    /**
     * 解压zip文件到指定目录
     * $filepath： 文件路径
     * $extractTo: 解压路径
     */
    public function dr_unZip($filepath,$extractTo) {
        $zip = new ZipArchive;
        $res = $zip->open($filepath);
        if ($res === TRUE) {
            //解压缩到$extractTo指定的文件夹
            $zip->extractTo($extractTo);
            $zip->close();
            echo "success改正";
        } else {
            echo 'failed, code:' . $res;
        }
    }

    //判断是否有子文件
    public function hasFile($dirName) {
        if(file_exists($dirName) && $handle = opendir($dirName)) {
            while(false !== ($item = readdir($handle))) {
                if($item!= "." && $item != ".."){
                    echo $item;
                }
            }
        }
    }

    public function upload1(){
        $file = request()->file('files');
        if (empty($file)) {
            $this->error('请选择上传文件111122211');
        }
        // 移动到框架应用根目录/public/uploads/ 目录下
        $info = $file->move(ROOT_PATH . 'public' . DS . 'uploads','');
        if ($info) {
            echo "上传成功";
        }
        else {
            $this->error($file->getError());
        }
    }

    // 上传文件方法
    public function upload(){
        if(file_exists($this->file_path1)){ //包含需要先删除该wen
            $unlink = unlink($this->file_path1);
            if($unlink=true){
                $file = request()->file('files');
                if (empty($file)) {
                    $this->error('请选择上传文件');
                }
                // 移动到框架应用根目录/public/uploads/ 目录下
                $info = $file->move(ROOT_PATH . 'public' . DS . 'uploads','');
                if ($info) {
                    $del = $this->deldir($this->file_path2);
                    if($del=true){
                        $row = $this->dr_unZip($this->file_path1,$this->file_path3);
                        if($row=true){
                            $this->success('文件上传成功');
                            echo $info->getFilename();
                        }

                    }
                    else {
                        echo "删除a目录失败";
                    }
                }
                else {
                    $this->error($file->getError());
                }
            }
            else {
                echo "删除失败";
            }
        }
        else { //不包含就不用删除了
            $file = request()->file('files');
            if (empty($file)) {
                $this->error('请选择上传文件bubaohan');
            }
            // 移动到框架应用根目录/public/uploads/ 目录下
            $info = $file->move(ROOT_PATH . 'public' . DS . 'uploads','');
            if ($info) {
                $del = $this->deldir($this->file_path2);
                if($del=true){
                    $row = $this->dr_unZip($this->file_path1,$this->file_path3);
                    if($row=true){
                        $this->success('文件上传成功');
                        echo $info->getFilename();
                    }

                }
                else {
                    echo "删除a目录失败";
                }
            }
            else {
                $this->error($file->getError());
            }
        }

    }
    public function upload2(){
        $row = unlink($this->file_path1);
        if($row=true){
            echo "tru";
        }
    }

}