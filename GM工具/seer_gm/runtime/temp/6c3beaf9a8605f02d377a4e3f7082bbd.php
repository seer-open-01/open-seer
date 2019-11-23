<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:104:"E:\PHPTutorial\WWW\fastadmin_revision1\public/../application/admin\view\gamemodule\whitelist\modify.html";i:1569294996;s:81:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\layout\default.html";i:1535699920;s:78:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\meta.html";i:1535699920;s:80:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                                <form id="add-form" class="form-horizontal" role="form" data-toggle="validator" method="POST" action="">
    <div class="form-group">
        <label for="wx_name" class="control-label col-xs-12 col-sm-2">微信昵称:</label>
        <div class="col-xs-12 col-sm-8">
            <select class="form-control" name="serverState" id="serverState">
                <?php if($serverState == '1'): ?>
                <option value="1" selected>正常</option>
                <option value="2">维护</option>
                <?php else: ?>
                <option value="1">正常</option>
                <option value="2" selected>维护</option>
                <?php endif; ?>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-12 col-sm-2"></label>
        <div class="col-xs-12 col-sm-8">
            <button type="button" class="btn btn-success btn-embossed" id="sure">确定</button>
            <button type="button" class="btn btn-default btn-embossed" id="dels">取消</button>
        </div>
    </div>
</form>
<script type="text/javascript" src="/fastadmin_revision1/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<!--点击弹窗中的取消-->
<script type="text/javascript">
    $(function () {
        $("#dels").click(function () {
            parent.layer.closeAll();
        })
    })
</script>
<script type="text/javascript">
    $("#sure").click(function () {
        var url = "<?php echo url('modifySave'); ?>";
        var serverState = $("#serverState").val();//alert(serverState);
        $.ajax({
            type:"post",
            url:url,
            data:{serverState:serverState},
            dataType:"json",
            success:function (data) { //alert("成功");
                parent.layer.closeAll();
                parent.location.href="<?php echo url('index'); ?>";
                console.log(data);
                console.log("success");
            },
            error:function () { //alert("失败");
                console.log("fail");
            }
        })
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