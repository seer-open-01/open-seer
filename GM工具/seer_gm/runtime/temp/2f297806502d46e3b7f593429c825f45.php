<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:90:"E:\PHPTutorial\WWW\seer_gm\public/../application/admin\view\gamemodule\recharge\index.html";i:1562921350;s:69:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\layout\default.html";i:1535699920;s:66:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\meta.html";i:1535699920;s:68:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                                <style type="text/css">
    #saiya_account_id,#amount,#sig,#asset_name,#address_type,#seq,#tx_from,#tx_to,#tx_hash{width: 50%;}
</style>
<input class="form-control" type="text" id="saiya_account_id" placeholder="请输入充值账号"/>
<input class="form-control" type="text" id="amount" placeholder="请输入充值数量"/>
<input class="form-control" type="text" id="sig" placeholder="请输入签名验证"/>
<input class="form-control" type="text" id="asset_name" placeholder="请输入资产名称"/>
<input class="form-control" type="text" id="address_type" placeholder="请输入地址类型"/>
<input class="form-control" type="text" id="tx_from" placeholder="请输入本次充值来自哪个钱包地址"/>
<input class="form-control" type="text" id="tx_to" placeholder="请输入本次充值到哪个钱包去"/>
<input class="form-control" type="text" id="tx_hash" placeholder="请输入本次充值的hash表"/>
<input type="button" class="btn" value="提交" id="tijiao">
<script type="text/javascript" src="/seer_gm/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<script type="text/javascript">
    $(function () {
       $("#tijiao").click(function () {
           var url = "<?php echo url('setSave'); ?>";
           var saiya_account_id = $("#saiya_account_id").val();
           var amount = $("#amount").val();
           var sig = $("#sig").val();
           var asset_name = $("#asset_name").val();
           var address_type = $("#address_type").val();
           var tx_from = $("#tx_from").val();
           var tx_to = $("#tx_to").val();
           var tx_hash = $("#tx_hash").val();
           $.ajax({
               type:"post",
               url:url,
               data:{saiya_account_id:saiya_account_id,amount:amount,sig:sig,asset_name:asset_name,address_type:address_type,tx_from:tx_from,tx_to:tx_to,tx_hash:tx_hash},
               dataType:"",
               success:function (data) {
                   console.log("success");
                   alert("充值成功")
               },
               error:function () {
                   alert("请求失败");
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
        <script src="/seer_gm/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/seer_gm/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>