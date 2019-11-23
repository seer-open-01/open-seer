<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:101:"E:\PHPTutorial\WWW\fastadmin_revision1\public/../application/admin\view\gamemodule\shopset\index.html";i:1535699920;s:81:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\layout\default.html";i:1535699920;s:78:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\meta.html";i:1535699920;s:80:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                        <?php echo build_toolbar('refresh'); ?>
                        <div class="dropdown btn-group <?php echo $auth->check('gamemodule/shopset/batchEdit')?'':'hide'; ?>" style="background-color: #18BC9C;color: white;width: 62px;height: 30px;text-align: center;line-height: 30px;" onclick="edit()">
                            <a -class="btn btn-success btn-edit" title="编辑" id="edit" style="color: white;cursor: pointer;">
                                <i class="fa fa-pencil"></i>
                                编辑
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
<script type="text/javascript" src="/fastadmin_revision1/public//assets/libs/jcrop/js/jquery.mim.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none")
    })
</script>
<!--移除-->
<script type="text/javascript">
    function edit() {
        //获取所有被选中的记录
        var rows = $("#table").bootstrapTable('getSelections');
        if (rows.length==0) {
            alert("请先选择要编辑的记录!");
            return;
        }
        else {
            if(confirm("是否确定要编辑?")){
                var ids = '';
                for (var i = 0; i < rows.length; i++) {
                    ids += rows[i]['itemId'] + ",";
                }
                ids = ids.substring(0, ids.length - 1);
                //deleteUser(ids);
                console.log(ids);
                //跳转弹窗
                var modurl = "<?php echo url('batchEdit'); ?>?itemId="+ids;
                layer.open({
                    type: 2,
                    closeBtn: 1,
                    skin: 'layui-layer-demo',
                    title: '批量修改商城信息',
                    maxmin: false,
                    shadeClose: true,
                    area : ['800px', '550px'],
                    offset : ['20px', ''],
                    content: modurl
                })
            }
        }
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