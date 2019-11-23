<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:103:"E:\PHPTutorial\WWW\fastadmin_revision1\public/../application/admin\view\gamemodule\whitelist\index.html";i:1537411752;s:81:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\layout\default.html";i:1535699920;s:78:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\meta.html";i:1535699920;s:80:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                                <div class="panel panel-default panel-intro">
    <!--<?php echo build_heading(); ?>-->

    <div class="panel-body">
        <div id="myTabContent" class="tab-content">
            <div class="tab-pane fade active in" id="one">
                <div class="widget-body no-padding">
                    <div id="toolbar" class="toolbar">
                        <?php echo build_toolbar('refresh,del'); ?>
                        <div class="dropdown btn-group <?php echo $auth->check('gamemodule/whitelist/add')?'':'hide'; ?>" style="background-color: #18BC9C;color: white;width: 62px;height: 30px;text-align: center;line-height: 30px;">
                            <a -class="btn btn-success btn-add" title="添加" id="add" style="color: white;cursor: pointer;">
                                <i class="fa fa-plus"></i>
                                添加
                            </a>
                        </div>
                        <div class="dropdown btn-group <?php echo $auth->check('gamemodule/whitelist/delBatch')?'':'hide'; ?>" style="background-color: #18BC9C;color: white;width: 62px;height: 30px;text-align: center;line-height: 30px;display: none;" onclick="del()">
                            <a -class="btn btn-success btn-del" title="删除" id="del" style="color: white;cursor: pointer;">
                                <i class="fa fa-trash"></i>
                                删除1
                            </a>
                        </div>
                        <div class="dropdown btn-group <?php echo $auth->check('gamemodule/whitelist/modify')?'':'hide'; ?>" style="background-color: #18BC9C;color: white;width: 130px;height: 30px;text-align: center;line-height: 30px;">
                            <a -class="btn btn-success btn-edit" title="修改服务器的状态" id="modify" style="color: white;cursor: pointer;">
                                <i class="fa fa-pencil"></i>
                                修改服务器的状态
                            </a>
                        </div>
                    </div>
                    <table id="table" class="table table-striped table-bordered table-hover"
                           data-operate-edit="<?php echo $auth->check('user/user/edit'); ?>"
                           data-operate-del="<?php echo $auth->check('user/user/del'); ?>"
                           width="100%">
                    </table>
                </div>
            </div>

        </div>
    </div>
</div>
<!--/fastadmin_revision1/public/admin/gamemodule.whitelist-->
<script type="text/javascript" src="/fastadmin_revision1/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<!--添加按钮到新页面-->
<script type="text/javascript">
    $(function () {
        $("#add").click(function () {
            var modurl = "<?php echo url('add'); ?>";
            layer.open({
                type: 2,
                closeBtn: 1,
                skin: 'layui-layer-demo',
                title: '添加',
                maxmin: false,
                shadeClose: true,
                area : ['800px', '460px'],
                offset : ['100px', ''],
                content: modurl
            })
        })
    })
</script>
<!--批量删除-->
<script type="text/javascript">
    function del() {
        var url = "<?php echo url('delBatch'); ?>";
        //获取所有被选中的记录
        var rows = $("#table").bootstrapTable('getSelections');
        if (rows.length==0) {
            alert("请先选择要白名单记录!");
            return;
        }
        else {
            if(confirm("是否确定要删除该些白名单记录?")){
                var ids = '';
                for (var i = 0; i < rows.length; i++) {
                    ids += rows[i]['uid'] + ",";
                    //console.log(rows[i]['uid']);
                }
                ids = ids.substring(0, ids.length - 1);
                //alert(ids);
                //alert(window.location.pathname);
                $.ajax({
                    type:"post",
                    url:url,
                    data:{ids:ids},
                    dataType:"json",
                    success:function (data) {
                        parent.layer.closeAll();
                        /*var url1 = window.location.pathname+"?ref=addtabs";
                        ///fastadmin/public/admin/gamemodule/whitelist
                        //parent.location.href="<?php echo url(''); ?>"+ "?ref=addtabs";
                        parent.location.href=url1;*/
                        parent.location.href="<?php echo url(''); ?>"+ "?ref=addtabs";
                        console.log("success");
                    },
                    error:function () {
                        console.log("fail");
                    }
                })
            }
        }

    }
</script>
<!--跳转到修改服务器状态的页面-->
<script type="text/javascript">
    $(function () {
        $("#modify").click(function () {
            var modurl = "<?php echo url('modify'); ?>";
            layer.open({
                type: 2,
                closeBtn: 1,
                skin: 'layui-layer-demo',
                title: '添加',
                maxmin: false,
                shadeClose: true,
                area : ['800px', '460px'],
                offset : ['100px', ''],
                content: modurl
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