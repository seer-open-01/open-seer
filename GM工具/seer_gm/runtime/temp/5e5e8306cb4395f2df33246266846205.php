<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:101:"E:\PHPTutorial\WWW\fastadmin_revision1\public/../application/admin\view\player\resourcesid\index.html";i:1535699920;s:81:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\layout\default.html";i:1535699920;s:78:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\meta.html";i:1535699920;s:80:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                        <div class="dropdown btn-group <?php echo $auth->check('player/resourcesid/tiao')?'':'hide'; ?>" style="background-color: #18BC9C;color: white;width: 80px;height: 30px;text-align: center;line-height: 30px;" onclick="edit()">
                            <a -class="btn btn-success btn-add" title="资源编辑" id="edit" style="color: white;cursor: pointer;">
                                <i class="fa fa-pencil"></i>
                                资源编辑
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

<script type="text/javascript" src="/fastadmin_revision1/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<!--<script type="text/javascript">
    $(function () {
        $("#edit").click(function () {
            var modurl = "<?php echo url('tiao'); ?>";
            layer.open({
                type: 2,
                closeBtn: 1,
                skin: 'layui-layer-demo',
                title: '资源增减',
                maxmin: false,
                shadeClose: true,
                area : ['800px', '460px'],
                offset : ['100px', ''],
                content: modurl
            })
        })
    })
</script>-->
<script type="text/javascript">
    function edit() {
        //获取所有被选中的记录
        var rows = $("#table").bootstrapTable('getSelections');
        if (rows.length==0) {
            alert("请先选择要编辑资源的记录!");
            return;
        }
        else {
            if(confirm("是否确定要编辑资源?")){
                var ids = '';
                for (var i = 0; i < rows.length; i++) {
                    ids += rows[i]['uid'] + ",";
                    //console.log(rows[i]['uid']);
                }
                ids = ids.substring(0, ids.length - 1);
                //deleteUser(ids);
                //console.log(ids);
                //跳转弹窗
                var modurl = "<?php echo url('tiao'); ?>?uids="+ids;
                layer.open({
                    type: 2,
                    closeBtn: 1,
                    skin: 'layui-layer-demo',
                    title: '资源增减',
                    maxmin: false,
                    shadeClose: true,
                    area : ['800px', '550px'],
                    offset : ['20px', ''],
                    /*btn: ['保存', '取消'],
                    btnAlign: 'c',*/
                    content: modurl
                    /*yes:function(index,layero){
                        //alert("按钮1");
                    },
                    btn2:function(index,layero){
                        //alert("按钮2");
                    }*/
                })
            }
        }
        /*var ids = '';
         for (var i = 0; i < rows.length; i++) {
         ids += rows[i]['id'] + ",";
         }
         ids = ids.substring(0, ids.length - 1);
         deleteUser(ids);*/
    }
</script>
<script type="text/javascript">
    $(function () {
        $("#table tbody").attr('id','user');
    })
</script>



<!--layer弹窗-->
<!--
    layer.open({
    type: 6,   // 6可以使表单超出部分不被遮挡
    title: '绑定负责人',
    area: ['400px', '280px'],
    btn: ['确认', '取消'],
    btnAlign: 'c',   // 按钮居中
    content: $('#bindPage').html(),
    success: function(layero, index){
        form.render();    // 表单渲染
        form.on('submit(bind)', function(data){     // 打印data就可以看到form表单提交的数据
            if(data.field.user_id == ''){
                layer.msg('请选择负责人')
                return false;
            }
            axios.post('/admin/user/bind_bear', {
                user_id: data.field.user_id,
                customer_id: id
            })
            .then(function (res) {
                if(res.data.code == 1){
                    layer.close(index);   // 关闭弹窗
                    layer.msg('绑定完成', {icon:1})
                }else {
                    layer.msg(res.data.msg, {icon:5})
                }
            })
            //return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
    },
    yes: function(index, layero){
        layero.find('.sub-bindbtn').click();    // 这一句就是点击确认按钮触发form的隐藏提交
    }
});
-->



                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="/fastadmin_revision1/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/fastadmin_revision1/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>