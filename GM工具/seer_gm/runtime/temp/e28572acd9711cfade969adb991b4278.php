<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:99:"E:\PHPTutorial\WWW\fastadmin_revision1\public/../application/admin\view\gamemodule\setgm\index.html";i:1563851896;s:81:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\layout\default.html";i:1535699920;s:78:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\meta.html";i:1535699920;s:80:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                                
<!--<script type="text/javascript" src="http://www.daimajiayuan.com/download/jquery/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="http://cdn.bootcss.com/bootstrap-select/2.0.0-beta1/js/bootstrap-select.js"></script>
<link rel="stylesheet" type="text/css" href="http://cdn.bootcss.com/bootstrap-select/2.0.0-beta1/css/bootstrap-select.css">
<link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet">-->
<script type="text/javascript" src="/fastadmin_revision1/public//mail/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="/fastadmin_revision1/public//mail/bootstrap-select.js"></script>
<link rel="stylesheet" type="text/css" href="/fastadmin_revision1/public//mail/bootstrap-select.css">
<link href="/fastadmin_revision1/public//mail/bootstrap.min.css" rel="stylesheet">
<script type="text/javascript">
    $(window).on('load', function () {
        $('.selectpicker').selectpicker({
            'selectedText': 'cat'
        });
        $('.selectpicker').click(function () {
            var a = $("#bs3Select").val();//console.log(a);
            $("#a").val(a);
            $("#ad").val(a);
        });
    });
</script>

<form id="add-form" class="form-horizontal" role="form" data-toggle="validator" method="POST" action="">

    <!--<div class="form-group">
        <label for="c-pid" class="control-label col-xs-12 col-sm-2">请选择游戏ID:</label>
        <div class="col-xs-12 col-sm-8">
            <select id="bs3Select" class="selectpicker show-tick form-control" multiple data-live-search="true" name="uids">
                <?php if(is_array($list) || $list instanceof \think\Collection || $list instanceof \think\Paginator): $i = 0; $__LIST__ = $list;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$data): $mod = ($i % 2 );++$i;?>
                <option value="<?php echo $data['uid']; ?>(<?php echo $data['wx_name']; ?>)"><?php echo $data['uid']; ?>+<?php echo $data['wx_name']; ?></option>
                <?php endforeach; endif; else: echo "" ;endif; ?>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label for="c-pid" class="control-label col-xs-12 col-sm-2">选择的结果:</label>
        <div class="col-xs-12 col-sm-8">
            <textarea rows="5" cols="50" disabled id="a" name="uids" class="form-control"></textarea>
        </div>
    </div>-->
    <div class="form-group">
        <label for="c-pid" class="control-label col-xs-12 col-sm-2">选择总代玩家:</label>
        <div class="col-xs-12 col-sm-8">
            <select id="uids" class="form-control" name="uids">
                <?php if(is_array($list) || $list instanceof \think\Collection || $list instanceof \think\Paginator): $i = 0; $__LIST__ = $list;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$data): $mod = ($i % 2 );++$i;?>
                <option value="<?php echo $data['uid']; ?>"><?php echo $data['uid']; ?>+<?php echo $data['wx_name']; ?></option>
                <?php endforeach; endif; else: echo "" ;endif; ?>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-12 col-sm-2"></label>
        <div class="col-xs-12 col-sm-8">
            <button type="button" class="btn btn-success btn-embossed <?php echo $auth->check('mail/setgm/set')?'':'hide'; ?>" id="sendMail">设置总代</button>
        </div>
    </div>
</form>
<!-- <script type="text/javascript" src="/fastadmin_revision1/public//assets/libs/jcrop/js/jquery.min.js"></script> -->
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<script type="text/javascript">
    $(function () {
        $("#sendMail").click(function () {
            var url = "<?php echo url('set'); ?>";
            var uids = $("#uids").val();
                $.ajax({
                    type:"post",
                    url:url,
                    data:{uids:uids},
                    dataType:"json",
                    success:function (data) {
                        layer.msg('<span style="margin-left: 30px;">'+data+'</span>', {icon: 1,time: 2500});
                    },
                    error:function () {
                        layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 2500});
                    }
                })
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