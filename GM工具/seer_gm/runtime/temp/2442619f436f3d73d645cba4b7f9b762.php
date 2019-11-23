<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:105:"E:\PHPTutorial\WWW\fastadmin_revision1\public/../application/admin\view\gamemodule\agentconfig\index.html";i:1563504141;s:81:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\layout\default.html";i:1535699920;s:78:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\meta.html";i:1535699920;s:80:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script type="text/javascript" src="http://d1.lashouimg.com/static/js/release/jquery-1.4.2.min.js"></script>
    <script src="/fastadmin_revision1/public//layer/layer.js"></script>
    <script src="/fastadmin_revision1/public//layer/extend/layer.ext.js"></script>
    <title>代理配置管理</title>
    <style type="text/css">
        .menuTree
        {
            margin-left: -30px;
        }
        .menuTree div
        {
            padding-left: 30px;
        }
        .menuTree div ul
        {
            overflow: hidden;
            display: none;
            height: auto;
        }
        .menuTree span
        {
            display: block;
            height: 25px;
            line-height: 25px;
            padding-left: 5px;
            margin: 1px 0;
            cursor: pointer;
            border-bottom: 1px solid #CCC;
        }
        .menuTree span:hover
        {
            background-color: #e6e6e6;
            color: #cf0404;
        }
        .menuTree a
        {
            color: #333;
            text-decoration: none;
        }
        .menuTree a:hover
        {
            color: #06F;
        }
        .btn
        {
            height: 30px;
            margin-top: 10px;
            border-bottom: 1px solid #CCC;
        }
    </style>
</head>
<body>
<textarea rows="10" cols="20" id="nas" style="display: none;"><?php echo $list; ?></textarea>

<div align="left" style="float: left;width: 50%;">
    <div class="dropdown btn-group <?php echo $auth->check('gamemodule/agentconfig/config')?'':'hide'; ?>" style="background-color: #18BC9C;color: white;width: 100px;height: 30px;text-align: center;line-height: 30px;margin-left: 25px;display: block;" id="configdiv">
        <a -class="btn btn-success btn-edit" title="代理配置" id="config" style="color: white;cursor: pointer;">
            <i class="fa fa-plus"></i>
            代理配置
        </a>
    </div>
</div>
<br><br><br>
<div style="width: 100%;">
    <div style="width: 50%;float: left;">
        <span style="font-weight: 900;font-size: 18px;color: black;">提现的手续费:</span>
        <span style="font-weight: 900;font-size: 18px;color: red;"><?php echo $brokerage; ?></span>
    </div>
    <div style="width: 50%;float: left;">
        <span style="font-weight: 900;font-size: 18px;color: black;">基础玩家每日最大提币限制:</span>
        <span style="font-weight: 900;font-size: 18px;color: red;"><?php echo $baseMaxWithDraw; ?></span>
    </div>
</div>
<div class="btn">
    <input name="" type="button" id="btn_open" value="全部展开" />
    <input name="" type="button" id="btn_close" value="全部收缩" />
</div>
<div id="menuTree" class="menuTree">
</div>
</body>
</html>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<!--配置按钮-->
<script type="text/javascript">
    $(function () {
        var url = "<?php echo url('judge'); ?>";
        var val = "1";
        $.ajax({
            type:"post",
            url:url,
            data:{val:val},
            dataType:"json",
            success:function (data) {
                if(data==0){ //显示添加页面
                    $("#config").click(function () {
                        var modurl = "<?php echo url('config'); ?>";
                        layer.open({
                            type: 2,
                            closeBtn: 1,
                            skin: 'layui-layer-demo',
                            title: '新增配置',
                            maxmin: true,
                            shadeClose: true,
                            area : ['800px', '550px'],
                            offset : ['20px', ''],
                            content: modurl
                        })
                    })
                }
                else if(data==1){ //显示修改页面
                    $("#config").click(function () {
                        var modurl = "<?php echo url('configs'); ?>";
                        layer.open({
                            type: 2,
                            closeBtn: 1,
                            skin: 'layui-layer-demo',
                            title: '修改或继续添加配置',
                            maxmin: true,
                            shadeClose: true,
                            area : ['800px', '550px'],
                            offset : ['20px', ''],
                            content: modurl
                        })
                    })
                }
            },
            error:function () {
                console.log("fail");
            }
        })
    })
</script>
<script type="text/javascript">
    /*递归实现获取无级树数据并生成DOM结构*/
    var json = <?php echo $list;?>;
    var str = "";
    var forTree = function (o) {
        var urlstr = "";
        var keys = new Array();
        for (var key in o) {
            keys.push(key);
        }
        for (var j = 0; j < keys.length; j++) {
            k = keys[j];
            if (typeof o[k] == "object") {
                urlstr = "<div><span>" + k + "</span><ul>";
            } else {
                urlstr = "<div><span>" + k + "=" + o[k] + "</span><ul>";
            }
            str += urlstr;
            var kcn = 0;
            if (typeof o[k] == "object") {
                for (var kc in o[k]) {
                    kcn++;
                }
            }
            if (kcn > 0) {
                forTree(o[k]);
            }
            str += "</ul></div>";
        }
        return str;
    }
    /*添加无级树*/
    document.getElementById("menuTree").innerHTML = forTree(json);
    /*树形菜单*/
    var menuTree = function () {
//给有子对象的元素加[+-]
        $("#menuTree ul").each(function (index, element) {
            var ulContent = $(element).html();
            var spanContent = $(element).siblings("span").html();
            if (ulContent) {
                $(element).siblings("span").html("[+] " + spanContent)
            }
        });


        $("#menuTree").find("div span").click(function () {
            var ul = $(this).siblings("ul");
            var spanStr = $(this).html();
            var spanContent = spanStr.substr(3, spanStr.length);
            if (ul.find("div").html() != null) {
                if (ul.css("display") == "none") {
                    ul.show(300);
                    $(this).html("[-] " + spanContent);
                } else {
                    ul.hide(300);
                    $(this).html("[+] " + spanContent);
                }
            }
        })
    } ()

    /*展开*/
    $("#btn_open").click(function () {
        $("#menuTree ul").show(300);
        curzt("-");
    })
    /*收缩*/
    $("#btn_close").click(function () {
        $("#menuTree ul").hide(300);
        curzt("+");
    })
    function curzt(v) {
        $("#menuTree span").each(function (index, element) {
            var ul = $(this).siblings("ul");
            var spanStr = $(this).html();
            var spanContent = spanStr.substr(3, spanStr.length);
            if (ul.find("div").html() != null) {
                $(this).html("[" + v + "] " + spanContent);
            }
        });
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