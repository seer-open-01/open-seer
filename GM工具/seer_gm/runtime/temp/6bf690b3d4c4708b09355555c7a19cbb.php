<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:92:"E:\PHPTutorial\WWW\fastadmin_revision1\public/../application/admin\view\dashboard\index.html";i:1535699920;s:81:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\layout\default.html";i:1535699920;s:78:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\meta.html";i:1535699920;s:80:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                                <h1 style="text-align: center;">欢迎<?php echo $admin['nickname']; ?>来到棋牌游戏后台</h1>
<h4 style="color: black;font-weight: 900;">平台相关规则说明：</h4>
<h4 style="color: black;font-weight: 900;">一、代理激活规则：</h4>
<p>1、待激活一级代理累计消费金额达到 60.00 元便会自动激活</p>
<h4 style="color: black;font-weight: 900;">二、提现规则：</h4>
<p>1、剩余可提现金额必须达到 1.00 元才可以申请提现；</p>
<p> 2、每次提现金额不能低于 1.00 元</p>
<h4 style="color: black;font-weight: 900;">三、代理注册规则：</h4>
<p>注册代理时，可以选择填写推荐人游戏ID，若没填写，默认成为未激活的一级代理，可以充值，不可发展下级代理。</p>
<p>若填写了推荐人游戏ID，系统自动判断此游戏ID是一级/二级代理，申请人成为此人的二级/三级代理</p>
<p>若推荐人的游戏ID为三级代理，则不能成为推荐人，不能发展下级代理。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="/fastadmin_revision1/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/fastadmin_revision1/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>