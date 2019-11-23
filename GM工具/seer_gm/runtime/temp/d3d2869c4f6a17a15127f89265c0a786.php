<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:91:"E:\PHPTutorial\WWW\seer_gm\public/../application/admin\view\gamemodule\operatesc\index.html";i:1568776615;s:69:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\layout\default.html";i:1535699920;s:66:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\meta.html";i:1535699920;s:68:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                                <form id="add-form" class="form-horizontal" role="form" data-toggle="validator" method="POST" action="">

    <div class="form-group">
        <label for="c-pid" class="control-label col-xs-12 col-sm-2">命令:</label>
        <div class="col-xs-12 col-sm-8">
            <select class="form-control" id="command" name="command">
                <option value="0">停止新用户划转</option>
                <option value="1">开启新用户划转</option>
                <option value="3">清理无余额的用户</option>
                <option value="4">解散平台</option>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-12 col-sm-2"></label>
        <div class="col-xs-12 col-sm-8">
            <button type="button" class="btn btn-success btn-embossed <?php echo $auth->check('gamemodule/operatesc/set')?'':'hide'; ?>" id="cha">设置</button>
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-12 col-sm-2"></label>
        <div class="col-xs-12 col-sm-8">
            <div>
                <span id="yue" style="color: red;font-weight: 900;"></span>
            </div>
        </div>
    </div>
</form>
<script type="text/javascript" src="/seer_gm/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<script type="text/javascript">
    $(function () {
        $("#cha").click(function () {
            var command = $("#command").val();
            var url = "<?php echo url('set'); ?>";
            if(command==4){
                layer.confirm('确定是否解散平台?', {
                    title: false,
                    btn: ['确定','取消'] //按钮
                }, function(ind){
                    layer.close(ind);
                    /*pagegoto('AddVehicle','AddVehicle',data_arr[swin].id);*/
                    $.ajax({
                        type:"post",
                        url:url,
                        data:{command:command},
                        dataType:"json",
                        success:function (data) {
                            $("#yue").text("服务费:"+data);
                            alert("成功");
                        },error:function () {
                            alert("失败");
                        }
                    })
                }, function(inds){
                    layer.close(inds);
                });
            }
            else{
                $.ajax({
                    type:"post",
                    url:url,
                    data:{command:command},
                    dataType:"json",
                    success:function (data) {
                        $("#yue").text("服务费:"+data);
                        alert("成功");
                    },error:function () {
                        alert("失败");
                    }
                })
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
        <script src="/seer_gm/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/seer_gm/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>