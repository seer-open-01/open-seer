<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:90:"E:\PHPTutorial\WWW\seer_gm\public/../application/admin\view\gamemodule\createsc\index.html";i:1569404892;s:69:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\layout\default.html";i:1535699920;s:66:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\meta.html";i:1535699920;s:68:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                                <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta charset="utf8">
    <style type="text/css">
        .mytable {
            table-layout: fixed;
            width: 100% ;
            margin: 0px;
        }
        th,td{
            -width:1000px;
            height:40px;
            border :1px solid black;
            font-size:12px;
            text-align :center;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow:hidden;
        }
    </style>
    <script src="/seer_gm/public//layer/layer.js"></script>
    <script src="/seer_gm/public//layer/extend/layer.ext.js"></script>
</head>

<!--搜索-->
<input type="hidden" value="<?php echo $ip; ?>" id="ip"/>
<input type="button" value="创建平台" id="add" class="form-control"/>
    <br><br><br>
    <table class="mytable">
        <thead>
        <tr>
            <th style="width: 10%;">平台id</th>
            <th style="width: 10%;">平台创建者</th>
            <th style="width: 10%;">平台描述</th>
            <th style="width: 20%;">保证金</th>
            <th style="width: 10%;">平台状态</th>
            <th style="width: 10%;">平台划转的用户数量</th>
            <th style="width: 10%;">操作</th>
        </tr>
        </thead>
        <tbody>
        <?php if(($code == 400)): else: if(is_array($plist) || $plist instanceof \think\Collection || $plist instanceof \think\Paginator): if( count($plist)==0 ) : echo "" ;else: foreach($plist as $key=>$vol): ?>
            <tr>
                <td style="width: 10%;"><?php echo $vol['scId']; ?></td>
                <td style="width: 10%;"><?php echo $vol['owner']; ?></td>
                <td style="width: 15%;"><?php echo $vol['description']; ?></td>
                <td style="width: 15%;"><?php echo $vol['guaranty']; ?></td>
                <td style="width: 10%;">
                    <?php if(($vol['status'] == 0)): ?> 停止新用户划转
                    <?php else: ?> 启动新用户划转
                    <?php endif; ?>
                </td>
                <td style="width: 10%;"><?php echo $vol['users']; ?></td>
                <td style="width: 10%;">
                    <a class="moduserEdit" style="cursor:pointer;text-decoration:none;" modurla="<?php echo $vol['scId']; ?>" modurl="<?php echo url('edit',array('scId'=>$vol['scId'])); ?>">编辑</a>
                </td>
            </tr>
            <?php endforeach; endif; else: echo "" ;endif; endif; ?>

        </tbody>
    </table>
    <div align="right">

    </div>


<script type="text/javascript" src="/seer_gm/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<script type="text/javascript">
    $(function () {
        $("#add").click(function () {
            var modurl = "<?php echo url('create'); ?>";
            layer.open({
                type: 2,
                closeBtn: 1,
                skin: 'layui-layer-demo',
                title: '平台创建',
                maxmin: false,
                shadeClose: true,
                area : ['800px', '550px'],
                offset : ['20px', ''],
                content: modurl
            })
        })
    })
</script>
<!--显示修改页面弹窗-->
<script type="text/javascript">
    $('.moduserEdit').on('click', function(){
        var modurl = $(this).attr("modurl");
        var id = $(this).attr("modurla");
        parent.layer.open({
            type: 2,
            title: '修改平台',
            maxmin: true,
            shadeClose: true,
            area : ['800px', '460px'],
            offset : ['100px', ''],
            content: modurl
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