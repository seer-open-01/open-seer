<?php if (!defined('THINK_PATH')) exit(); /*a:1:{s:76:"E:\PHPTutorial\WWW\seer_gm\public/../application/index\view\index\index.html";i:1569485647;}*/ ?>
<!DOCTYPE html>
<html>

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>FastAdmin - <?php echo __('The fastest framework based on ThinkPHP5 and Bootstrap'); ?></title>

    <!-- Bootstrap Core CSS -->
    <link href="//cdn.bootcss.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <link href="/seer_gm/public/assets/css/index.css" rel="stylesheet">

    <!-- Plugin CSS -->
    <link href="//cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="//cdn.bootcss.com/simple-line-icons/2.4.1/css/simple-line-icons.min.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="//cdn.bootcss.com/html5shiv/3.7.0/html5shiv.min.js"></script>
    <script src="//cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body id="page-top">

<nav id="mainNav" class="navbar navbar-default navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <!--<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-menu">
                <span class="sr-only">Toggle navigation</span><i class="fa fa-bars"></i>
            </button>
            <a class="navbar-brand page-scroll" href="#page-top"><img src="/seer_gm/public/assets/img/logo.png" style="width:200px;" alt=""></a>-->
        </div>

        <div class="collapse navbar-collapse" id="navbar-collapse-menu">
            <!--<ul class="nav navbar-nav navbar-right">
                <li><a href="https://www.fastadmin.net" target="_blank"><?php echo __('Home'); ?></a></li>
                <li><a href="https://www.fastadmin.net/store.html" target="_blank"><?php echo __('Store'); ?></a></li>
                <li><a href="https://www.fastadmin.net/service.html" target="_blank"><?php echo __('Services'); ?></a></li>
                <li><a href="https://www.fastadmin.net/download.html" target="_blank"><?php echo __('Download'); ?></a></li>
                <li><a href="https://www.fastadmin.net/demo.html" target="_blank"><?php echo __('Demo'); ?></a></li>
                <li><a href="https://www.fastadmin.net/donate.html" target="_blank"><?php echo __('Donation'); ?></a></li>
                <li><a href="https://forum.fastadmin.net" target="_blank"><?php echo __('Forum'); ?></a></li>
                <li><a href="https://doc.fastadmin.net" target="_blank"><?php echo __('Docs'); ?></a></li>
            </ul>-->
        </div>
        <!-- /.navbar-collapse -->
    </div>
    <!-- /.container-fluid -->
</nav>

<header>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div class="header-content">
                    <div class="header-content-inner">
                        <!--<h1>FastAdmin</h1>
                        <h3><?php echo __('The fastest framework based on ThinkPHP5 and Bootstrap'); ?></h3>-->
                        <h2>前往seer管理后台中心</h2>
                        <a href="<?php echo url('admin/index/login'); ?>" class="btn btn-warning btn-xl page-scroll"><?php echo __('Go to Dashboard'); ?></a>
                        <!--<a href="<?php echo url('index/user/index'); ?>" class="btn btn-outline btn-xl page-scroll"><?php echo __('Go to Member center'); ?></a>-->
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>



<!-- jQuery -->
<script src="//cdn.bootcss.com/jquery/2.1.4/jquery.min.js"></script>

<!-- Bootstrap Core JavaScript -->
<script src="//cdn.bootcss.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>

<!-- Plugin JavaScript -->
<script src="//cdn.bootcss.com/jquery-easing/1.4.1/jquery.easing.min.js"></script>

<script>
    $(function () {
        $(window).on("scroll", function () {
            $("#mainNav").toggleClass("affix", $(window).height() - $(window).scrollTop() <= 50);
        });

        //发送版本统计信息
        try {
            var installed = localStorage.getItem("installed");
            if (!installed) {
                $.ajax({
                    url: "<?php echo \think\Config::get('fastadmin.api_url'); ?>/statistics/installed",
                    data: {
                        version: "<?php echo config('fastadmin.version'); ?>",
                        os: "<?php echo PHP_OS; ?>",
                        sapi: "<?php echo PHP_SAPI; ?>",
                        tpversion: "<?php echo THINK_VERSION; ?>",
                        phpversion: "<?php echo PHP_VERSION; ?>",
                        software: "<?php echo \think\Request::instance()->server('SERVER_SOFTWARE'); ?>",
                        url: location.href,
                    },
                    dataType: 'jsonp',
                });
                localStorage.setItem("installed", true);
            }
        } catch (e) {

        }

    });
</script>

<script>
    var _hmt = _hmt || [];
    (function () {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?f8d0a8c400404989e195270b0bbf060a";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();
</script>

</body>

</html>