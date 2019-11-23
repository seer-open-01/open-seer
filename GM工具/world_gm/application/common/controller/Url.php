<?php

namespace app\common\controller;

/**
 * 调用接口控制器公共类方法
 */
class Url
{
    public $key = "__tazai_wolf__key";
    public $iv = "1234567890000000";
    public function decode($cryptkey, $iv, $secretdata){
        return openssl_decrypt($secretdata,'aes-256-cbc',$cryptkey,false,$iv);
    }
    //加密
    public function encode($cryptkey, $iv, $secretdata){
        return openssl_encrypt($secretdata,'aes-256-cbc',$cryptkey,false,$iv);
    }
    public function cryptkey(){
        $cryptkey = hash('sha256',$this->key,true);
        return $cryptkey;
    }
    public function url($url,$data_jsons){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_jsons);
        curl_setopt($ch,CURLOPT_TIMEOUT,30);
        curl_setopt($ch,CURLOPT_NOSIGNAL,true);
        $output = curl_exec($ch);

        curl_close($ch);

        $a = json_decode($output);
        $b = json_decode(json_encode($a),true);
        $jie = $this->decode($this->cryptkey(), $this->iv, $output);
        return $jie;
    }
    //公共接口
    public function commonFun($ip,$post_data){
        $port = config("port");
        $url = "http://".$ip.":".$port."/?";
        $data_jsons = json_encode($post_data);
        $data_jsons = $this->encode($this->cryptkey(),$this->iv,$data_jsons);
        return $this->url($url,$data_jsons);
    }
}
