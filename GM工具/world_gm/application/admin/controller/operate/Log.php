<?php

namespace app\admin\controller\operate;

use app\common\controller\Backend;
use Think\Db;

/**
 * 监控列表
 *
 * @icon fa fa-user
 */
class Log extends Backend
{

    protected $relationSearch = true;

    /**
     * User模型对象
     */
    protected $model = null;

    public function _initialize()
    {
        parent::_initialize();
        $this->model = model('Log');
    }
    /**
     * 查看
     */
    public function index()
    {
        $this->request->filter(['strip_tags']);
        if ($this->request->isAjax())
        {
            //如果发送的来源是Selectpage，则转发到Selectpage
            if ($this->request->request('keyField'))
            {
                return $this->selectpage();
            }

            list($where,$sort,$order,$offset,$limit) = $this->buildparams("username");
            $total = $this->model
                //->with('group')
                ->where($where)
                //->field("(case status when 0 then '禁用' else '启用' end) as whether,horse_race_lamp.*")
                ->order($sort, $order)
                ->count();
            $list = $this->model
                //->with('group')
                ->where($where)
                //->field("(case status when 0 then '禁用' else '启用' end) as whether,horse_race_lamp.*")
                ->order($sort, $order)
                ->limit($offset, $limit)
                ->select();
            $result = array("total" => $total, "rows" => $list);
            return json($result);
        }
        return $this->view->fetch();
    }
    //真实地导出Excel表的功能
    public function exportOrderExcel($data){
        // 新建一个excel对象 大神已经加入了PHPExcel 不用引了 直接用！
        $objPHPExcel = new \PHPExcel();  //在vendor目录下 \不能少 否则报错
        // 设置文档的相关信息
        $objPHPExcel->getProperties()->setCreator("楼主666")/*设置作者*/
        ->setLastModifiedBy("楼主666")/*最后修改*/
        ->setTitle("楼主666")/*题目*/
        ->setSubject("楼主666")/*主题*/
        ->setDescription("楼主666")/*描述*/
        ->setKeywords("楼主666")/*关键词*/
        ->setCategory("楼主666");/*类别*/
        $objPHPExcel->getDefaultStyle()->getFont()->setName('微软雅黑');//字体
        /*设置表头*/
        $objPHPExcel->getActiveSheet()->mergeCells('A1:M1');//合并第一行的单元格
        $objPHPExcel->getActiveSheet()->getStyle('A1')->getAlignment()->setHorizontal(\PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
        $objPHPExcel->setActiveSheetIndex(0)->setCellValue('A1', '操作日志列表');//标题
        $objPHPExcel->getActiveSheet()->getRowDimension('1')->setRowHeight(30);      // 第一行的默认高度
        $myrow = 2;/*表头所需要行数的变量，方便以后修改*/
        /*表头数据填充*/
        $objPHPExcel->getActiveSheet()->getRowDimension('2')->setRowHeight(30);/*设置行高*/
        $objPHPExcel->setActiveSheetIndex(0)  //设置一张sheet为活动表 添加表头信息
        ->setCellValue('A' . $myrow, '序号')
            ->setCellValue('B' . $myrow, '管理员ID')
            ->setCellValue('C' . $myrow, '管理员姓名')
            ->setCellValue('D' . $myrow, '上次登录时间')
            ->setCellValue('E' . $myrow, '上次登录ip')
            ->setCellValue('F' . $myrow, '操作内容')
            ->setCellValue('G' . $myrow, '玩家ID')
            ->setCellValue('H' . $myrow, '操作日志')
            ->setCellValue('I' . $myrow, '操作时间');
        // 关键数据
        $data = json_decode($data, true);
        $myrow = $myrow + 1; //刚刚设置的行变量
        $mynum = 1;//序号
        //遍历接收的数据，并写入到对应的单元格内
        foreach ($data as $key => $value) {
            $objPHPExcel->setActiveSheetIndex(0)
                ->setCellValue('A' . $myrow, $mynum)
                ->setCellValue('B' . $myrow, $value['id'])
                ->setCellValue('C' . $myrow, $value['username'])
                ->setCellValue('D' . $myrow, $value['tname'])
                ->setCellValue('E' . $myrow, $value['tname'])
                ->setCellValue('F' . $myrow, $value['content'])
                ->setCellValue('G' . $myrow, $value['tname'])
                ->setCellValue('H' . $myrow, $value['tname'])
                ->setCellValue('I' . $myrow, $value['operation_time']);
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
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(5);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(12);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(20);
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(10);
        $objPHPExcel->getActiveSheet()->getStyle('A3:P' . $myrow)->getAlignment()->setWrapText(true);//设置单元格允许自动换行
        /*设置表相关的信息*/
        $objPHPExcel->getActiveSheet()->setTitle("sad"); //活动表的名称
        $objPHPExcel->setActiveSheetIndex(0);//设置第一张表为活动表
        //纸张方向和大小 为A4横向
        $objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(\PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
        $objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(\PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
        //浏览器交互 导出
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="操作日志列表.xlsx"');
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
        exit;
    }
}
