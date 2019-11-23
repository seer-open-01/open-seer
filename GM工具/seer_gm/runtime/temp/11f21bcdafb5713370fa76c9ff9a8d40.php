<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:100:"E:\PHPTutorial\WWW\fastadmin_revision1\public/../application/admin\view\player\gamerecord\index.html";i:1541472734;s:81:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\layout\default.html";i:1535699920;s:78:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\meta.html";i:1535699920;s:80:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
    <script src="/fastadmin_revision1/public//layer/layer.js"></script>
    <script src="/fastadmin_revision1/public//layer/extend/layer.ext.js"></script>
</head>
<body>

<!--搜索-->
<form action="<?php echo url('index'); ?>" method="post">
    <div align="left">
        <input type="text" class="form-control" placeholder="请输入你想查询的牌局号" name="uid" style="width: 200px;float: left;" value="<?php echo $uid; ?>">
        <input type="submit" value="搜索" class="form-control" style="width: 50px;float: left;margin-left: 25px;">
    </div>

    <br><br><br>
    <table class="mytable">
        <thead>
        <tr>
            <th style="width: 10%;">牌局号</th>
            <th style="width: 20%;">时间</th>
            <th style="width: 10%;">Match ID</th>
            <th style="width: 15%;">昵称</th>
            <th style="width: 10%;">玩家ID</th>
            <th style="width: 25%;">牌型</th>
            <th style="width: 10%;">输赢分</th>
        </tr>
        </thead>
        <tbody>
        <!--第一条数据-->


        <?php if(is_array($plist) || $plist instanceof \think\Collection || $plist instanceof \think\Paginator): if( count($plist)==0 ) : echo "" ;else: foreach($plist as $key=>$vol): ?>
        <tr>
            <td rowspan="<?php echo $vol['frequency']; ?>" style="width: 10%;"><?php echo $vol['round_id']; ?></td>
            <td rowspan="<?php echo $vol['frequency']; ?>" style="width: 20%;"><?php echo $vol['end_time']; ?></td>
            <td rowspan="<?php echo $vol['frequency']; ?>" style="width: 10%;"><?php echo $vol['match_id']; ?></td>
            <td style="width: 15%;"><?php echo $vol['uid'][0]; ?></td>
            <td style="width: 10%;"><?php echo $vol['uids'][0]; ?></td>
            <td style="width: 25%;cursor:pointer;" title="<?php echo $vol['playerList'][0]; ?>" class="moduser" modurlb="<?php echo $vol['playerList'][0]; ?>" modurlc="<?php echo $vol['round_id']; ?>" onclick=getData2(this)>
                <?php echo $vol['playerList'][0]; ?>
            </td>
            <td style="width: 10%;"><?php echo $vol['uidss'][0]; ?></td>
        </tr>
        <?php $__FOR_START_1039348948__=1;$__FOR_END_1039348948__=$vol['frequency'];for($i=$__FOR_START_1039348948__;$i < $__FOR_END_1039348948__;$i+=1){ ?>
        <tr>
            <td style="width: 15%;"><?php echo $vol['uid'][$i]; ?></td>
            <td style="width: 10%;"><?php echo $vol['uids'][$i]; ?></td>
            <td style="width: 25%;cursor:pointer;" title="<?php echo $vol['playerList'][$i]; ?>" class="moduser" modurlb1="<?php echo $vol['playerList'][$i]; ?>" modurlc1="<?php echo $vol['round_id']; ?>" onclick=getData21(this)>
                <?php echo $vol['playerList'][$i]; ?>
            </td>
            <td style="width: 10%;"><?php echo $vol['uidss'][$i]; ?></td>
        </tr>
        <?php } endforeach; endif; else: echo "" ;endif; ?>

        </tbody>
    </table>
    <div align="right">
        <?php echo $plistpage; ?>
    </div>
</form>
</body>
</html>
<script type="text/javascript" src="/fastadmin_revision1/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css('display','none');
    })
</script>
<!--牌型弹窗详情-->
<script type="text/javascript">
    function getData2(element){
        var ids = $(element).attr("modurlb");
        var round_id = $(element).attr("modurlc");//牌局号
        var url = "<?php echo url('details'); ?>";
        $.ajax({
            type:'post',
            url:url,
            data:{ids:ids},
            dataType:'json',
            success:function (data) {
                console.log("success");
                console.log(data);
                parent.layer.open({
                    type: 1,
                    title: '牌局号为'+'<span style="color: red;font-weight: 900;font-size: 20px;">'+round_id+'</span>'+'的牌型信息',
                    maxmin: true,
                    shadeClose: true,
                    area: ['800px', '500px'],
                    content: '<h3>'+data+'</h3>'
                })
            },
            error:function () {
                console.log("fail1");
            }
        })
    }
    function getData21(element){
        var ids = $(element).attr("modurlb1");
        var round_id = $(element).attr("modurlc1");//牌局号
        var url = "<?php echo url('details'); ?>";
        $.ajax({
            type:'post',
            url:url,
            data:{ids:ids},
            dataType:'json',
            success:function (data) {
                console.log("success");
                parent.layer.open({
                    type: 1,
                    title: '牌局号为'+'<span style="color: red;font-weight: 900;font-size: 20px;">'+round_id+'</span>'+'的牌型信息',
                    maxmin: true,
                    shadeClose: true,
                    area: ['800px', '500px'],
                    content: '<h3>'+data+'</h3>'
                })
            },
            error:function () {
                console.log("fail1");
            }
        })
    }
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