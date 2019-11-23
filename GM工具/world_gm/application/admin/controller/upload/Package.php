<?php

namespace app\admin\controller\upload;

use app\common\controller\Backend;
use think\db;
use think\Request;
use think\Log;
use ZipArchive;
/**
 * 包上传功能
 *
 * @icon fa fa-user
 */
class Package extends Backend{

    protected $relationSearch = true;
    public $ip1 = "http://192.168.9.103/upload/upload.php";

    public function _initialize()
    {
        parent::_initialize();
    }
    public function index1(){
        echo 11;
    }
    // 包上传表单
    public function index(){
        $key = md5('nyn123');
        $this->assign("key",$key);
        return $this->fetch();
    }
    public function url($file){
        header('Content-Type:multipart/form-data');
        $url = $this->ip1;
        $post_data = array (
            "key" => md5('nyn123'),
            //"file" => $file,
            'file' => new \CURLFile(realpath($file['tmp_name']))
        );
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 5.01; Windows NT 5.0)');
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
        curl_setopt( $ch, CURLOPT_SAFE_UPLOAD, false);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $output = curl_exec($ch);

        curl_close($ch);
        //JSON_UNESCAPED_UNICODE\
        header("Content-Type:text/html;charset=UTF-8");
        Log::record("json数据1是:".$output);
        Log::record($file);
        Log::record(json_encode(888));
    }
    public static function uploadPostRequest( $file)
    {
        $url = "http://192.168.9.103/upload/upload.php";
        $curl = curl_init();
        $headers = array('Content-Type:multipart/form-data');
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SAFE_UPLOAD, true);
        $data = array (
            "key" => md5('nyn123'),
            //"file" => $file,
            'file' => new \CURLFile(realpath($file['tmp_name']))
        );
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
//        curl_setopt($curl, CURLOPT_USERAGENT,"TEST");
        $result = curl_exec($curl);
        return $result;
    }
    public function upload(){
        $file = request()->file('files');
        if (empty($file)) {
            $this->error('请选择上传文件');
        }
        else {
            //$row = $this->uploadPostRequest($file);
            //if($row=true){
                //echo $file;
                $this->success('上传成功');
            //}
        }

    }
    // 上传文件方法
    public function upload1(){
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

}