<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:91:"E:\PHPTutorial\WWW\seer_gm\public/../application/admin\view\player\companyprofit\index.html";i:1566531808;s:69:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\layout\default.html";i:1535699920;s:66:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\meta.html";i:1535699920;s:68:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\script.html";i:1535699920;}*/ ?>
<!DOCTYPE html>
<html lang="<?php echo $config['language']; ?>">
    <head>
        <meta charset="utf-8">
<title><?php echo (isset($title) && ($title !== '')?$title:''); ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<meta name="renderer" content="webkit">

<link rel="shortcut icon" href="/seer_gm/public/assets/img/favicon.ico" />
<!-- Loading Bootstrap -->
<link href="/seer_gm/public/assets/css/backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.css?v=<?php echo \think\Config::get('site.version'); ?>" rel="stylesheet">

<!-- HTML5 shim, for IE6-8 support of HTML5 elements. All other JS at the end of file. -->
<!--[if lt IE 9]>
  <script src="/seer_gm/public/assets/js/html5shiv.js"></script>
  <script src="/seer_gm/public/assets/js/respond.min.js"></script>
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
                        <div class="ip" style="display: none;">
                            <input type="text" id="ip" value="<?php echo $ip; ?>"/>
                        </div>

                        <input type="text" class="form-control" name="category" value="11" placeholder="微信名" id="category.wx_name" data-index="2" style="display: none;">
                    </div>
                    <div>
                        <span>公司盈亏总和为:</span>
                        <span id="companyprofitnum" style="color: red;font-weight: 900;"></span>
                        &nbsp;&nbsp;&nbsp;
                        <span>比赛服务费(入账):</span>
                        <span id="bsfwfrz" style="color: red;font-weight: 900;"></span>
                        &nbsp;&nbsp;&nbsp;
                        <span>公司内部充值(入账):</span>
                        <span id="gsnbczrz" style="color: red;font-weight: 900;"></span>
                        &nbsp;&nbsp;&nbsp;
                        <span>节点奖励(出账):</span>
                        <span id="jdjlcz" style="color: red;font-weight: 900;"></span>
                        &nbsp;&nbsp;&nbsp;
                        <span>提现服务费(入账):</span>
                        <span id="txfwfrz" style="color: red;font-weight: 900;"></span>
                        &nbsp;&nbsp;&nbsp;
                        <span>抽奖消耗(入账):</span>
                        <span id="cjxhrz" style="color: red;font-weight: 900;"></span>
                        &nbsp;&nbsp;&nbsp;
                        <span>抽奖获得(出账):</span>
                        <span id="cjxhcz" style="color: red;font-weight: 900;"></span>
                        &nbsp;&nbsp;&nbsp;
                        <span>任务奖励(出账):</span>
                        <span id="rwjlcz" style="color: red;font-weight: 900;"></span>
                        &nbsp;&nbsp;&nbsp;
                        <span>大喇叭(入账):</span>
                        <span id="dlbrz" style="color: red;font-weight: 900;"></span>
                    </div>
                    <table id="table" class="table table-striped table-bordered table-hover"
                           data-operate-edit="<?php echo $auth->check('player/player/edit'); ?>"
                           data-operate-del="<?php echo $auth->check('player/player/del'); ?>"
                           width="100%">
                    </table>
                </div>
            </div>

        </div>
    </div>
</div>
<script type="text/javascript" src="/seer_gm/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
        console.log($("#category"+"."+"wx_name").attr("id"));
    })
</script>
<script type="text/javascript">
    $(function () {
        var ip = $("#ip").val();
        var url = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/companyprofitSum";
        var url1 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/bsfwfrz";
        var url2 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/gsnbczrz";
        var url3 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/jdjlcz";
        var url4 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/txfwfrz";
        var url5 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/cjxhrz";
        var url6 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/cjxhcz";
        var url7 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/rwjlcz";
        var url8 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/dlbrz";
        $.ajax({
            type:"post",
            url:url,
            data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
            dataType:"json",
            success:function (data) {
                console.log("成功");
                console.log("数据为:"+data);
                $("#companyprofitnum").text(data);
            },
            error:function () {
                console.log("失败");
            }
        });
        //1
        $.ajax({
            type:"post",
            url:url1,
            data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
            dataType:"json",
            success:function (data) {
                console.log("成功");
                $("#bsfwfrz").text(data);
            },
            error:function () {
                console.log("失败");
            }
        });
        //2
        $.ajax({
            type:"post",
            url:url2,
            data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
            dataType:"json",
            success:function (data) {
                console.log("成功");
                $("#gsnbczrz").text(data);
            },
            error:function () {
                console.log("失败");
            }
        });
        //3
        $.ajax({
            type:"post",
            url:url3,
            data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
            dataType:"json",
            success:function (data) {
                console.log("成功");
                $("#jdjlcz").text(data);
            },
            error:function () {
                console.log("失败");
            }
        });
        //4
        $.ajax({
            type:"post",
            url:url4,
            data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
            dataType:"json",
            success:function (data) {
                console.log("成功");
                $("#txfwfrz").text(data);
            },
            error:function () {
                console.log("失败");
            }
        });
        //5
        $.ajax({
            type:"post",
            url:url5,
            data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
            dataType:"json",
            success:function (data) {
                console.log("成功");
                $("#cjxhrz").text(data);
            },
            error:function () {
                console.log("失败");
            }
        });
        //6
        $.ajax({
            type:"post",
            url:url6,
            data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
            dataType:"json",
            success:function (data) {
                console.log("成功");
                $("#cjxhcz").text(data);
            },
            error:function () {
                console.log("失败");
            }
        });
        //7
        $.ajax({
            type:"post",
            url:url7,
            data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
            dataType:"json",
            success:function (data) {
                console.log("成功");
                $("#rwjlcz").text(data);
            },
            error:function () {
                console.log("失败");
            }
        });
        //8
        $.ajax({
            type:"post",
            url:url8,
            data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
            dataType:"json",
            success:function (data) {
                console.log("成功");
                $("#dlbrz").text(data);
            },
            error:function () {
                console.log("失败");
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
        <script src="/seer_gm/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/seer_gm/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>