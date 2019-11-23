<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:100:"E:\PHPTutorial\WWW\fastadmin_revision1\public/../application/admin\view\gamemodule\horseset\add.html";i:1566280941;s:81:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\layout\default.html";i:1535699920;s:78:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\meta.html";i:1535699920;s:80:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
        <label for="contents" class="control-label col-xs-12 col-sm-2">文本内容:</label>
        <div class="col-xs-12 col-sm-8">
            <textarea rows="5" cols="50" placeholder="请必须输入文本内容" class="form-control" name="contents" id="contents"></textarea>
        </div>
    </div>
    <div class="form-group">
        <label for="playback_sequence" class="control-label col-xs-12 col-sm-2">播放顺序:</label>
        <div class="col-xs-12 col-sm-8">
            <!--<input type="text" name="playback_sequence" placeholder="请输入播放顺序数字" class="form-control" id="playback_sequence">-->
            <input onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" name="playback_sequence" placeholder="请输入播放顺序数字大于0的正整数" class="form-control" id="playback_sequence">
        </div>
    </div>
    <div class="form-group">
        <label for="status" class="control-label col-xs-12 col-sm-2">是否启用:</label>
        <div class="col-xs-12 col-sm-8">
            <input type="radio" name="status" id="status" checked value="2"> 启用
            <input type="radio" name="status" value="1"> 禁用
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-12 col-sm-2"></label>
        <div class="col-xs-12 col-sm-8">
            <button type="button" class="btn btn-success btn-embossed" id="sure">保存</button>
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
<!--点击确定保存信息-->
<script type="text/javascript">
    $(function () {
        $("#sure").click(function () {
            var url = "<?php echo url('addSave'); ?>";
            var contents = $("#contents").val();
            var playback_sequence = $("#playback_sequence").val();alert(playback_sequence)
            var status = $("input[name='status']").val();
            if(contents==""){
                layer.msg('<span style="margin-left: 30px;">文本内容不能为空,请必须输入文本内容!</span>', {icon: 2,time: 2500});
            }
            else if(playback_sequence==""){
                layer.msg('<span style="margin-left: 30px;">播放顺序不能为空,请必须输入播放顺序!</span>', {icon: 2,time: 2500});
            }
            else {
                $.ajax({
                    type:'post',
                    url:url,
                    data:{contents:contents,playback_sequence:playback_sequence,status:status},
                    dataType:'json',
                    success:function (data) {
                        parent.layer.closeAll();
                        parent.location.href="<?php echo url('index'); ?>";alert("成功")
                        //console.log("success");
                    },
                    error:function () { alert("失败")
                        //console.log("fail");
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
        <script src="/fastadmin_revision1/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/fastadmin_revision1/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>