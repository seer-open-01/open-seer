<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:101:"E:\PHPTutorial\WWW\fastadmin_revision1\public/../application/admin\view\player\pfcrecharge\index.html";i:1566805608;s:81:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\layout\default.html";i:1535699920;s:78:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\meta.html";i:1535699920;s:80:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\script.html";i:1535699920;}*/ ?>
<!DOCTYPE html>
<html lang="<?php echo $config['language']; ?>">
    <head>
        <meta charset="utf-8">
<title><?php echo (isset($title) && ($title !== '')?$title:''); ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="renderer" content="webkit">

<link rel="shortcut icon" href="/fastadmin_revision1/public/assets/img/favicon.ico" />
<!-- Loading Bootstrap -->
<link href="/fastadmin_revision1/public/assets/css/backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.css?v=<?php echo \think\Config::get('site.version'); ?>" rel="stylesheet">

<!-- HTML5 shim, for IE6-8 support of HTML5 elements. All other JS at the end of file. -->
<!--[if lt IE 9]>
  <script src="/fastadmin_revision1/public/assets/js/html5shiv.js"></script>
  <script src="/fastadmin_revision1/public/assets/js/respond.min.js"></script>
<![endif]-->
<script type="text/javascript">
    var require = {
        config:  <?php echo json_encode($config); ?>
    };
</script>
    </head>

    <body class="inside-header inside-aside <?php echo defined('IS_DIALOG') && IS_DIALOG ? 'is-dialog' : ''; ?>">
        <div id="main" role="main">
            <div class="tab-content tab-addtabs">
                <div id="content">
                    <div class="row">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <section class="content-header hide">
                                <h1>
                                    <?php echo __('Dashboard'); ?>
                                    <small><?php echo __('Control panel'); ?></small>
                                </h1>
                            </section>
                            <?php if(!IS_DIALOG && !$config['fastadmin']['multiplenav']): ?>
                            <!-- RIBBON -->
                            <div id="ribbon">
                                <ol class="breadcrumb pull-left">
                                    <li><a href="dashboard" class="addtabsit"><i class="fa fa-dashboard"></i> <?php echo __('Dashboard'); ?></a></li>
                                </ol>
                                <ol class="breadcrumb pull-right">
                                    <?php foreach($breadcrumb as $vo): ?>
                                    <li><a href="javascript:;" data-url="<?php echo $vo['url']; ?>"><?php echo $vo['title']; ?></a></li>
                                    <?php endforeach; ?>
                                </ol>
                            </div>
                            <!-- END RIBBON -->
                            <?php endif; ?>
                            <div class="content">
                                <div class="panel panel-default panel-intro">

    <div class="panel-body">
        <div id="myTabContent" class="tab-content">
            <div class="tab-pane fade active in" id="one">
                <div class="widget-body no-padding">
                    <div id="toolbar" class="toolbar">
                        <?php echo build_toolbar('refresh'); ?>
                        <div class="form-search" style="display: none;">

                        </div>
                        <div class="custom-search" style="display: none;">

                        </div>
                        <div class="ip" style="display: none;">
                            <input type="text" id="ip" value="<?php echo $ip; ?>"/>
                        </div>
                        <span>pfc充值记录总和:</span>
                        <span id="pfcrechargenum" style="color: red;font-weight: 900;"></span>
                        &nbsp;&nbsp;&nbsp;
                        <span>pfc充值人数:</span>
                        <span id="pfcrechargesumpeople" style="color: red;font-weight: 900;"></span>
                    </div>
                    <table id="table" class="table table-striped table-bordered table-hover"
                           data-operate-edit="<?php echo $auth->check('user/user/edit'); ?>"
                           data-operate-del="<?php echo $auth->check('user/user/del'); ?>"
                           width="100%">
                    </table>
                </div>
            </div>

        </div>
    </div>
</div>
<script type="text/javascript" src="/fastadmin_revision1/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $("#ribbon").css("display","none");
</script>
<script type="text/javascript">
    $(function () {
        var ip = $("#ip").val();
        // pfc充值记录总和
        var urlrecharge = "http://"+ip+"/fastadmin_revision1/public/admin/player/Pfcrecharge/sum";
        $.ajax({
            type:"post",
            url:urlrecharge,
            data:{uid:"",wx_name:"",account_id:"",asset_name:"",address_type:"",amount:"",seq:"",tx_from:"",tx_to:"",tx_hash:"",ts:"",time:""},//
            dataType:"json",
            success:function (data) {
                console.log("成功");
                $("#pfcrechargenum").text(data);
            },
            error:function () {
                console.log("失败充值记录");
            }
        });
        //计算有多少人充值了
        var urlrechargesumpeople = "http://"+ip+"/fastadmin_revision1/public/admin/player/Pfcrecharge/sumpeople";
        $.ajax({
            type:"post",
            url:urlrechargesumpeople,
            data:{uid:"",wx_name:"",account_id:"",asset_name:"",address_type:"",amount:"",seq:"",tx_from:"",tx_to:"",tx_hash:"",ts:"",time:""},//
            dataType:"json",
            success:function (data) {
                console.log("成功");
                $("#pfcrechargesumpeople").text(data);
            },
            error:function () {
                console.log("失败充值记录");
            }
        });
    })
</script>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="/fastadmin_revision1/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/fastadmin_revision1/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>