<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:82:"E:\PHPTutorial\WWW\seer_gm\public/../application/admin\view\task\system\index.html";i:1568712212;s:69:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\layout\default.html";i:1535699920;s:66:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\meta.html";i:1535699920;s:68:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
<form action="<?php echo url('index'); ?>" method="post">
    <div align="left" style="float: left;width: 50%;">
        <!--<input type="text" class="form-control" placeholder="请输入任务序号" name="uid" style="width: 200px;float: left;" value="<?php echo $uid; ?>">
        <input type="submit" value="搜索" class="form-control" style="width: 50px;float: left;margin-left: 25px;">-->
        <div class="dropdown btn-group <?php echo $auth->check('gamemodule/horseset/add')?'':'hide'; ?>" style="background-color: #18BC9C;color: white;width: 70px;height: 30px;text-align: center;line-height: 30px;margin-left: 25px;">
            <a -class="btn btn-success btn-edit" title="任务设置" id="add" style="color: white;cursor: pointer;">
                <i class="fa fa-plus"></i>
                任务设置
            </a>
        </div>
    </div>
    <div align="right" style="float: left;width: 50%;">
        <!--<p style="color: red;">编辑按钮只有在晚上零点过后才有用</p>
        <p style="color: red;">1、一次性任务: 必须在时间结束才能删除；2、重复任务:随时可以删除，但是只有等到第二天才生效</p>-->
        <input type="hidden" value="<?php echo $ip; ?>" id="ip"/>
    </div>

    <br><br><br>
    <table class="mytable">
        <thead>
        <tr>
            <th style="width: 10%;">任务序号</th>
            <th style="width: 10%;">任务类型</th>
            <th style="width: 10%;">任务顺序</th>
            <th style="width: 20%;">任务奖励类型</th>
            <th style="width: 10%;">任务奖励数量</th>
            <!--th style="width: 15%;">任务游戏类型</th>-->
            <th style="width: 10%;">游戏类型</th>
            <th style="width: 25%;">游戏场次</th>
            <th style="width: 10%;">任务内容类型</th>
            <th style="width: 10%;">任务内容数量</th>
            <th style="width: 10%;">开始时间</th>
            <th style="width: 10%;">结束时间</th>
            <th style="width: 10%;">删除状态</th>
            <th style="width: 10%;">操作</th>
        </tr>
        </thead>
        <tbody>
        <?php if(is_array($plist) || $plist instanceof \think\Collection || $plist instanceof \think\Paginator): if( count($plist)==0 ) : echo "" ;else: foreach($plist as $key=>$vol): ?>
        <tr>
            <td style="width: 10%;"><?php echo $vol['id']; ?></td>
            <td style="width: 10%;"><!--<?php echo $vol['type']; ?>-->
                <?php if(($vol['type'] == 1)): ?> 一次性任务
                <?php else: ?> 重复任务
                <?php endif; ?>
            </td>
            <td style="width: 15%;"><?php echo $vol['order']; ?></td>
            <td style="width: 20%;"><!--<?php echo $vol['reward']['type']; ?>-->
                <?php if(($vol['reward']['type'] == 1)): ?> 金豆
                <?php else: ?> 彩票积分
                <?php endif; ?>
            </td>
            <td style="width: 10%;"><?php echo $vol['reward']['num']; ?></td>
            <td style="width: 10%;"><!--<?php echo $vol['game']['type']; ?>-->
                <?php if($vol['game']['type'] == 0): ?> 任意游戏
                <?php elseif($vol['game']['type'] == 1): ?>海南麻将
                <?php elseif($vol['game']['type'] == 2): ?>斗地主
                <?php elseif($vol['game']['type'] == 4): ?>拼三张
                <?php elseif($vol['game']['type'] == 5): ?>拼十
                <?php elseif($vol['game']['type'] == 7): ?>跑得快
                <?php else: ?> 血战麻将
                <?php endif; ?>
            </td>
            <!--<td style="width: 10%;">&lt;!&ndash;<?php echo $vol['game']['subType']; ?>&ndash;&gt;
                <?php if($vol['game']['type'] == 0): ?>
                任意模式
                <?php elseif($vol['game']['type'] == 1): if($vol['game']['subType'] == 0): ?> 任意模式
                <?php elseif($vol['game']['subType'] == 1): ?>二人麻将
                <?php else: ?> 四人麻将
                <?php endif; elseif($vol['game']['type'] == 2): if($vol['game']['subType'] == 0): ?> 任意模式
                <?php elseif($vol['game']['subType'] == 1): ?>普通模式
                <?php else: ?> 不洗牌模式
                <?php endif; elseif($vol['game']['type'] == 5): if($vol['game']['subType'] == 0): ?> 任意模式
                <?php elseif($vol['game']['subType'] == 1): ?>卡牌抢庄
                <?php else: ?> 自由抢庄
                <?php endif; elseif($vol['game']['type'] == 7): if($vol['game']['subType'] == 0): ?> 任意模式
                <?php elseif($vol['game']['subType'] == 1): ?>三人场
                <?php else: ?> 四人场
                <?php endif; else: if($vol['game']['subType'] == 0): ?> 任意模式
                <?php elseif($vol['game']['subType'] == 1): ?>普通模式
                <?php else: ?> 激情模式
                <?php endif; endif; ?>
            </td>-->
            <td style="width: 10%;"><!--<?php echo $vol['game']['matchName']; ?>-->
                <?php if($vol['game']['matchName'] == 0): ?> 无规模限制
                <?php elseif($vol['game']['matchName'] == 1): ?>新手场
                <?php elseif($vol['game']['matchName'] == 2): ?>平民场
                <?php else: ?> 小资场
                <?php endif; ?>
            </td>
            <td style="width: 10%;"><!--<?php echo $vol['condition']['type']; ?>-->
                <?php if($vol['condition']['type'] == 1): ?> 对战多少局
                <?php elseif($vol['condition']['type'] == 2): ?> 单局达到多少分
                <?php elseif($vol['condition']['type'] == 3): ?> 打出多少炸弹(仅对斗地主、跑得快有效)
                <?php elseif($vol['condition']['type'] == 4): ?> 打出多少春天(仅对斗地主生效)
                <?php elseif($vol['condition']['type'] == 5): ?> 连续赢得xx把
                <?php elseif($vol['condition']['type'] == 6): ?> 当地主xx把(仅对斗地主生效)
                <?php elseif($vol['condition']['type'] == 7): ?> 一天内打出xx王炸(仅对斗地主生效)
                <?php elseif($vol['condition']['type'] == 8): ?> 一天赢得xx次大关(仅对跑得快生效)
                <?php elseif($vol['condition']['type'] == 9): ?> 一天赢得xx次小关(仅对跑得快生效)
                <?php elseif($vol['condition']['type'] == 10): ?> 自摸xx次(仅对麻将生效)
                <?php elseif($vol['condition']['type'] == 11): ?> 清一色胡xx次(仅对麻将生效)
                <?php elseif($vol['condition']['type'] == 12): ?> 七对胡x次(仅对麻将生效)
                <?php elseif($vol['condition']['type'] == 13): ?> 抢杠胡x次(仅对麻将生效)
                <?php elseif($vol['condition']['type'] == 14): ?> 十三幺胡x次(仅对麻将生效)
                <?php elseif($vol['condition']['type'] == 15): ?> 碰碰胡x次(仅对麻将生效)
                <?php elseif($vol['condition']['type'] == 16): ?> 一天累计胡幺九xx次
                <?php elseif($vol['condition']['type'] == 17): ?> 一天累计胡将对xx次
                <?php elseif($vol['condition']['type'] == 18): ?> 一天累计胡门清xx次
                <?php elseif($vol['condition']['type'] == 19): ?> 一天累计胡中张xx次
                <?php elseif($vol['condition']['type'] == 20): ?> 一天累计胡金钩钓xx次
                <?php elseif($vol['condition']['type'] == 21): ?> 一天累计天胡xx次
                <?php else: ?> 一天累计地胡xx次
                <?php endif; ?>
            </td>
            <td style="width: 10%;"><?php echo $vol['condition']['num']; ?></td>
            <td style="width: 10%;cursor: pointer;" title="<?php echo $vol['startTimeStr']; ?>" class="startTimeStr" modurla="<?php echo $vo['id']; ?>" modurl="<?php echo url('getStartTimeStr',array('id'=>$vol['id'],'startTimeStr'=>$vol['startTimeStr'])); ?>">
                <?php echo $vol['startTimeStr']; ?>
            </td>
            <td style="width: 10%;cursor: pointer;" title="<?php echo $vol['endTimeStr']; ?>" class="endTimeStr" modurla="<?php echo $vo['id']; ?>" modurl="<?php echo url('getEndTimeStr',array('id'=>$vol['id'],'endTimeStr'=>$vol['endTimeStr'])); ?>">
                <?php echo $vol['endTimeStr']; ?>
            </td>
            <td style="width: 10%;"><!--<?php echo $vol['deleteIng']; ?>-->
                <?php if($vol['deleteIng'] == true): ?> <a>正在删除中</a>
                <?php elseif($vol['deleteIng'] == false): ?> <a>正常状态</a>
                <?php else: ?> false1
                <?php endif; ?>
            </td>
            <td style="width: 10%;">
                <!--查看时间年月日时分秒【即是一次性任务】是否过期-->
                <a class="moduserEdit" style="cursor:pointer;text-decoration:none;" modurla="<?php echo $vol['id']; ?>" modurl="<?php echo url('edit',array('id'=>$vol['id'])); ?>">编辑</a>
                <!--<a class="moduserDel" modurla="<?php echo $vol['id']; ?>" id="del" style="text-decoration: none;cursor:pointer;">删除</a>-->
                <a class="moduserDel" modurla="<?php echo $vol['id']; ?>" id="del" style="text-decoration: none;cursor:pointer;">删除</a>
                <!--<?php if(($vol['type'] == 1)): ?> &lt;!&ndash;一次性任务&ndash;&gt;
                    <?php if($vol['deleteIng'] == true): ?>
                    <a class="moduserDel" modurla="<?php echo $vol['id']; ?>" id="del" style="text-decoration: none;cursor:pointer;">删除</a>
                    <?php elseif($vol['deleteIng'] == false): ?>
                    <a style="color: red;text-decoration: none;cursor:pointer;">不能删除</a>
                    <?php else: ?> false1
                    <?php endif; else: ?>
                    <a class="moduserDel" modurla="<?php echo $vol['id']; ?>" id="dell" style="text-decoration: none;cursor:pointer;">删除</a>
                <?php endif; ?>-->

            </td>
        </tr>
        <?php endforeach; endif; else: echo "" ;endif; ?>
        </tbody>
    </table>
    <div align="right">
        <?php echo $plistpage; ?>
    </div>
</form>


<script type="text/javascript" src="/seer_gm/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<!--点击显示开始时间-->
<script type="text/javascript">
    $(".startTimeStr").on('click',function () {
        var modurl = $(this).attr("modurl");
        var id = $(this).attr("modurla");
        parent.layer.open({
            type: 2,
            title: 'id为'+id+'的开始时间',
            maxmin: true,
            shadeClose: true,
            area : ['800px', '460px'],
            offset : ['100px', ''],
            content: modurl
        })
    })
</script>
<!--点击显示结束时间-->
<script type="text/javascript">
    $(".endTimeStr").on('click',function () {
        var modurl = $(this).attr("modurl");
        var id = $(this).attr("modurla");
        parent.layer.open({
            type: 2,
            title: 'id为'+id+'的结束时间',
            maxmin: true,
            shadeClose: true,
            area : ['800px', '460px'],
            offset : ['100px', ''],
            content: modurl
        })
    })
</script>
<!--新增任务-->
<script type="text/javascript">
    $(function () {
        $("#add").click(function () {
            var modurl = "<?php echo url('add'); ?>";
            layer.open({
                type: 2,
                closeBtn: 1,
                skin: 'layui-layer-demo',
                title: '任务设置',
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
            title: '修改数据',
            maxmin: true,
            shadeClose: true,
            area : ['800px', '460px'],
            offset : ['100px', ''],
            content: modurl
        })
    })
</script>
<!--删除操作-->
<script type="text/javascript">
    $('.moduserDel').on('click', function(){
        var url = "<?php echo url('del'); ?>";
        var ip = $("#ip").val();
        var tiaourl = "http://"+ip+"/fastadmin_revision1/public/admin/task/system?ref=addtabs";
        var id = $(this).attr("modurla");
        var msg = "<font style='color:red;'>是否选择要删除该项的任务</font>";
        layer.alert(msg, {
            skin: 'layui-layer-molv',
            closeBtn: 1,
            anim: 1,
            btn: ['确定','取消'], //按钮
            icon: 6,
            yes:function(){ //点击确定就是执行删除操作
                $.ajax({
                    type:"post",
                    url:url,
                    dataType:"json",
                    data:{id:id},
                    success:function (data) {
                        layer.msg('<span style="margin-left: 30px;">data</span>', {icon: 1,time: 10000});
                        console.log(data);
                        console.log("success");
                        parent.layer.closeAll();
                        parent.location.href=tiaourl;
                    },
                    error:function () {
                        console.log("fail");
                    }
                })
            }
            ,btn2:function(){
                layer.closeAll();
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
        <script src="/seer_gm/public/assets/js/require<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js" data-main="/seer_gm/public/assets/js/require-backend<?php echo \think\Config::get('app_debug')?'':'.min'; ?>.js?v=<?php echo $site['version']; ?>"></script>
    </body>
</html>