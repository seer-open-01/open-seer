<?php

namespace app\admin\controller\gamemodule;

use app\common\controller\Backend;
use Think\Db;

/**
 * 游戏卡
 *
 * @icon fa fa-user
 */
class Gamecard extends Backend
{

    protected $relationSearch = true;

    /**
     * 游戏卡模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Gamecard');
    }

    /**
     * 查看
     */
    public function index(){
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }
            list($where,$sort,$order,$offset,$limit) = $this->buildparams("game_card.id,game_card.card_number,game_card.batch,game_card.status");
            $total = $this->model
                //->with('group')
                ->where($where)
                ->order($sort, $order)
                ->field("(case status when 0 then '未使用' else '已使用' end) as whether,game_card.*")
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->field("(case status when 0 then '未使用' else '已使用' end) as whether,game_card.*")
                ->select();
            $result = array("total" => $total, "rows" => $list);

            return json($result);
        }

        return $this->view->fetch();
    }
    //添加游戏卡
    public function add(){
        return $this->view->fetch();
    }
    //生成随意不重复的9位字符串
    public function generate_password( $length = 12 ) {
        $chars = '0123456789';
        $password = '';
        for ( $i = 0; $i < $length; $i++ )
        {
            $password .= $chars[ mt_rand(0, strlen($chars) - 1) ];
        }
        return $password;
    }
    //将一个字符串每隔多少个字符就用某符号来隔开
    public function separate($str){
        $strnum = mb_strlen($str,'UTF8');
        while ($strnum){
            $array[] = mb_substr($str,0,4,'utf8');
            $str = mb_substr($str,4,$strnum,'utf8');
            $strnum = mb_strlen($str,'UTF8');
        }
        $output=implode(' ',$array);
        return $output;
    }
    //保存生成的游戏卡
    public function addSave(){
        $number = $_POST["number"];
        $strr = $this->cardNumber($number);
        $arr = explode(",",$strr);
        $batch = $_POST["batch"];
        $generation_time = date("Y-m-d H:i:s");
        $status = "0";
        $qian = "INSERT INTO game_card (id,card_number,batch,generation_time,status,card_number1) VALUES ";
        $val = "";
        $val1 = "";
        for($i=0;$i<$number;$i++){
            $unni = $this->generate_password(12);
            $strrr = $arr[$i];
            //需要将卡号数字每隔4个就用空格隔开显示
            $str = $this->separate($unni);
            //得到的真实的数据
            $val .= '("'.$strrr.'","'.$unni.'","'.$batch.'","'.$generation_time.'","'.$status.'","'.$str.'")'.',';
            //$val1 .= '("'.$unni.'","'.$str.'")'.',';
        }
        $val = substr($val,0,-1);
        //$val1 = substr($val1,0,-1);
        $sql = $qian.$val;
        //$sql1 = $qian1.$val1;
        $row = $this->model->execute($sql);
        //$row1 = $this->model->execute($sql1);
        if($row=true){
            $array['status']=1;
            //echo json_encode("success",JSON_UNESCAPED_UNICODE);
        }
        else {
            $array['status']=-1;
        }
        echo json_encode($array,JSON_UNESCAPED_UNICODE);
    }
    public function test(){

        $number = 2;
        $str = "";
        for($i=0;$i<$number;$i++){
            $unni = $this->generate_password(12);
            $str .= $unni.",";
        }
        echo $str;
    }
    //卡号
    public function cardNumber($number){
        //$number = "60";
        $str = "";
        //$nums = "-1";//php 怎么生成一个六位数从000000开始往上递增的序列号
        $row = $this->model->order("id desc")->select();
        if(empty($row)){
            $nums = "-1";
            for($i=0;$i<$number;$i++){
                $numsz = ++$nums;
                $len = strlen($numsz);
                if($len==1){
                    $numsz = "000000000".$numsz;
                }
                else if($len==2){
                    $numsz = "00000000".$numsz;
                }
                else if($len==3){
                    $numsz = "0000000".$numsz;
                }
                else if($len==4){
                    $numsz = "000000".$numsz;
                }
                else if($len==5){
                    $numsz = "00000".$numsz;
                }
                else if($len==6){
                    $numsz = "0000".$numsz;
                }
                else if($len==7){
                    $numsz = "000".$numsz;
                }
                else if($len==8){
                    $numsz = "00".$numsz;
                }
                else if($len==9){
                    $numsz = "0".$numsz;
                }
                $str .= $numsz.",";
                //echo $numsz;echo "<br>";
            }
            $str = substr($str,0,-1);
            return $str;
        }
        else {
            $nums = $row[0]["id"];
            for($i=0;$i<$number;$i++){
                $numsz = ++$nums;
                $len = strlen($numsz);
                if($len==1){
                    $numsz = "000000000".$numsz;
                }
                else if($len==2){
                    $numsz = "00000000".$numsz;
                }
                else if($len==3){
                    $numsz = "0000000".$numsz;
                }
                else if($len==4){
                    $numsz = "000000".$numsz;
                }
                else if($len==5){
                    $numsz = "00000".$numsz;
                }
                else if($len==6){
                    $numsz = "0000".$numsz;
                }
                else if($len==7){
                    $numsz = "000".$numsz;
                }
                else if($len==8){
                    $numsz = "00".$numsz;
                }
                else if($len==9){
                    $numsz = "0".$numsz;
                }
                $str .= $numsz.",";
                //echo $numsz;echo "<br>";
            }
            $str = substr($str,0,-1);
            return $str;
        }

    }
    //测试生成10位数从0000000000开始的卡号
    public function test1(){
        //0000000000,0000000001
        $number = 100;
        $str = "";
        $nums = "-1";//php 怎么生成一个六位数从000000开始往上递增的序列号
        for($i=0;$i<$number;$i++){
            $numsz = ++$nums;
            $len = strlen($numsz);
            if($len==1){
                $numsz = "000000000".$numsz;
            }
            else if($len==2){
                $numsz = "00000000".$numsz;
            }
            else if($len==3){
                $numsz = "0000000".$numsz;
            }
            else if($len==4){
                $numsz = "000000".$numsz;
            }
            else if($len==5){
                $numsz = "00000".$numsz;
            }
            else if($len==6){
                $numsz = "0000".$numsz;
            }
            else if($len==7){
                $numsz = "000".$numsz;
            }
            else if($len==8){
                $numsz = "00".$numsz;
            }
            else if($len==9){
                $numsz = "0".$numsz;
            }
            //$str .= $numsz.",";
            echo $numsz;echo "<br>";
        }//echo $str;
    }
    //导出功能
    public function exportData(){
        $row = $this->model->select();
        //$arr = json_decode(json_encode($row,JSON_UNESCAPED_UNICODE),true);
        $json = json_encode($row,JSON_UNESCAPED_UNICODE);
        return $json;
    }
    public function export(){
        // 新建一个excel对象 大神已经加入了PHPExcel 不用引了 直接用！
        $objPHPExcel = new \PHPExcel();  //在vendor目录下 \不能少 否则报错
        // 设置文档的相关信息
        $objPHPExcel->getProperties()->setCreator("游戏卡")/*设置作者*/
        ->setLastModifiedBy("游戏卡")/*最后修改*/
        ->setTitle("游戏卡")/*题目*/
        ->setSubject("游戏卡")/*主题*/
        ->setDescription("游戏卡")/*描述*/
        ->setKeywords("游戏卡")/*关键词*/
        ->setCategory("游戏卡");/*类别*/
        $objPHPExcel->getDefaultStyle()->getFont()->setName('微软雅黑');//字体
        /*设置表头*/
        $objPHPExcel->getActiveSheet()->mergeCells('A1:B1');//合并第一行的单元格
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A1', '游戏卡列表');//标题
        $objPHPExcel->getActiveSheet()->getRowDimension('1')->setRowHeight(30);      // 第一行的默认高度
        $myrow = 2;/*表头所需要行数的变量，方便以后修改*/
        /*表头数据填充*/
        $objPHPExcel->getActiveSheet()->getRowDimension('2')->setRowHeight(30);/*设置行高*/
        $objPHPExcel->setActiveSheetIndex(0)  //设置一张sheet为活动表 添加表头信息
        //->setCellValue('A' . $myrow, '序号')
            ->setCellValue('A' . $myrow, '卡号')
            ->setCellValue('B' . $myrow, '序列号');
        // 关键数据

        $data = $this->exportData();
        $data = json_decode($data, true);
        $myrow = $myrow + 1; //刚刚设置的行变量
        $mynum = 1;//序号
        //遍历接收的数据，并写入到对应的单元格内
        foreach ($data as $key => $value) {
            $objPHPExcel->setActiveSheetIndex(0)
                //->setCellValue('A' . $myrow, $mynum)
                ->setCellValue('A' . $myrow, $value['id'])
                ->setCellValue('B' . $myrow, $value['card_number1']);
            $objPHPExcel->getActiveSheet()->getRowDimension('' . $myrow)->setRowHeight(20);/*设置行高 不能批量的设置 这种感觉 if（has（蛋）！=0）{疼();}*/
            $myrow++;
            $mynum++;
        }
        $mynumdata=$myrow-1; //获取主要数据结束的行号
        $objPHPExcel->setActiveSheetIndex(0)->getstyle('A3:P' . $mynumdata)->getAlignment()->setHorizontal(\PHPExcel_style_Alignment::HORIZONTAL_CENTER);/*设置格式 水平居中*/
        /*设置数据的边框 手册上写的方法只显示竖线 非常坑爹 所以采用网上搜来的方法*/
        $style_array = array(
            'borders' => array(
                'allborders' => array(
                    'style' => \PHPExcel_Style_Border::BORDER_THIN
                )
            ));
        //关键数据结束


        //设置宽width 由于自适应宽度对中文的支持是个BUG因此坑爹的手动设置了每一列的宽度 这种感觉 if（has（蛋）！=0）{碎();}
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getStyle('A3:P' . $myrow)->getAlignment()->setWrapText(true);//设置单元格允许自动换行
        /*设置表相关的信息*/
        $objPHPExcel->getActiveSheet()->setTitle("sad"); //活动表的名称
        $objPHPExcel->setActiveSheetIndex(0);//设置第一张表为活动表
        //纸张方向和大小 为A4横向
        $objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(\PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
        $objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(\PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
        //浏览器交互 导出
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="游戏卡.xlsx"');
        header('Cache-Control: max-age=0');
        // If you're serving to IE 9, then the following may be needed
        header('Cache-Control: max-age=1');

        // If you're serving to IE over SSL, then the following may be needed
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // always modified
        header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
        header('Pragma: public'); // HTTP/1.0
        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter->save('php://output');
        //echo json_encode(1,JSON_UNESCAPED_UNICODE);
        exit;
    }
    public function ajax(){
        $this->export();
        echo json_encode(1);
    }
}
