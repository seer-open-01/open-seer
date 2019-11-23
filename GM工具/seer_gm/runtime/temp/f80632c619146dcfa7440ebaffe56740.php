<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:80:"E:\PHPTutorial\WWW\seer_gm\public/../application/admin\view\task\system\add.html";i:1568015253;s:69:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\layout\default.html";i:1535699920;s:66:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\meta.html";i:1535699920;s:68:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                                <link type="text/css" rel="stylesheet" href="/seer_gm/public/newrili2/test/jeDate-test.css">
<link type="text/css" rel="stylesheet" href="/seer_gm/public/newrili2/skin/jedate.css">
<script type="text/javascript" src="/seer_gm/public/newrili2/src/jedate.js"></script>
<form id="add-form" class="form-horizontal" role="form" data-toggle="validator" method="POST" action="">
    <div class="form-group" style="width: 100%;">
        <label for="repeatType" class="control-label col-xs-12 col-sm-2" style="width: 20%;">任务类型:</label>
        <!--任务类型【repeatType】-->
        <div class="col-xs-12 col-sm-8" style="width: 80%;">
            <!--<input type="radio" name="repeatType" id="repeatType" checked value="1"> 一次性任务-->
            <input type="radio" name="repeatType" value="2" checked> 重复任务
            <input type="hidden" value="<?php echo $ip; ?>" id="ip"/>
        </div>
    </div>
    <div class="form-group" style="width: 100%;">
        <label for="repeatType" class="control-label col-xs-12 col-sm-2" style="width: 20%;">任务顺序:</label>
        <div class="col-xs-12 col-sm-8" style="width: 80%;">
            <!--任务顺序【order】-->
            <div style="width: 60%;float: left;">
                <input onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" name="order" placeholder="请输入播放顺序数字大于0的正整数" class="form-control" id="order">
            </div>
            <div style="width: 40%;float: left;">
                <span style="color: darkgray;"> (设置为0时，任务为隐藏任务) </span>
            </div>
        </div>
    </div>
    <div class="form-group" style="width: 100%;">
        <label for="repeatType" class="control-label col-xs-12 col-sm-2" style="width: 20%;">任务奖励:</label>
        <div class="col-xs-12 col-sm-8" style="width: 80%;">
            <!--奖励类型【rewardType】-->
            <div style="width: 30%;float: left;">
                <select class="form-control" id="rewardType">
                    <option value="1">金豆</option>
                </select>
            </div>
            <!--奖励数量【rewardNum】-->
            <div class="form-control" style="border: 1px solid darkgray;width: 30%;float: left;">
                <div style="width: 70%;float: left;">
                    <input type="number" -class="form-control" style="border: none;width: 100%;" id="rewardNum">
                </div>
                <div style="width: 30%;float: left;">
                    <span style="color: darkgray;"> (金豆) </span>
                </div>
            </div>
        </div>
    </div>
    <div class="form-group" style="width: 100%;">
        <label for="repeatType" class="control-label col-xs-12 col-sm-2" style="width: 20%;">任务游戏:</label>
        <div class="col-xs-12 col-sm-8" style="width: 80%;">
            <!--游戏类型限制【gameTypeLimit】-->
            <div style="width: 30%;float: left;">
                <select class="form-control" id="gameTypeLimit">
                    <option value="0">任意游戏</option>
                    <option value="1">海南麻将</option>
                    <option value="2">斗地主</option>
                    <option value="4">拼三</option>
                    <option value="5">拼十</option>
                    <option value="7">跑得快</option>
                    <option value="8">血战麻将</option>
                </select>
            </div>
            <!--游戏模式【gameSubType】-->
            <div style="width: 30%;float: left;display: none;">
                <select class="form-control" id="gameSubType" style="display: block;">
                    <option value="0">任意模式</option>
                </select>
                <select class="form-control" id="gameSubType1" style="display: none;">
                    <option value="0">任意模式</option>
                    <option value="1">二人麻将</option>
                    <option value="2">四人麻将</option>
                </select>
                <select class="form-control" id="gameSubType2" style="display: none;">
                    <option value="0">任意模式</option>
                    <option value="1">普通模式</option>
                    <option value="2">不洗牌模式</option>
                </select>
                <!--<select class="form-control" id="gameSubType3" style="display: none;">
                    <option value="0">任意模式</option>
                    <option value="1">卡牌抢庄</option>
                    <option value="2">自由抢庄</option>
                </select>-->
                <select class="form-control" id="gameSubType4" style="display: none;">
                    <option value="0">任意模式</option>
                    <option value="1">普通模式</option>
                    <option value="2">激情模式</option>
                </select>
                <select class="form-control" id="gameSubType5" style="display: none;">
                    <option value="0">任意模式</option>
                    <option value="1">卡牌抢庄</option>
                    <option value="2">自由抢庄</option>
                </select>
                <select class="form-control" id="gameSubType7" style="display: none;">
                    <option value="0">任意模式</option>
                    <option value="1">三人场</option>
                    <option value="2">四人场</option>
                </select>
            </div>
            <!--游戏规模限制【matchNameLimit】-->
            <div style="width: 30%;float: left;">
                <select class="form-control" id="matchNameLimit">
                    <option value="0">无规模限制</option>
                    <option value="1">新手场</option>
                    <option value="2">平民场</option>
                    <option value="3">小资场</option>
                </select>
            </div>

        </div>
    </div>
    <div class="form-group" style="width: 100%;">
        <label for="repeatType" class="control-label col-xs-12 col-sm-2" style="width: 20%;">任务内容:</label>
        <div class="col-xs-12 col-sm-8" style="width: 80%;">
            <!--条件类型【conditionType】-->
            <div style="width: 30%;float: left;">
                <select class="form-control" id="conditionType">
                    <option value="1">对战多少局</option>
                    <option value="2">单局达到多少分</option>
                    <option value="3">打出多少炸弹(仅对斗地主、跑得快有效)</option>
                    <option value="4">打出多少春天(仅对斗地主生效)</option>
                    <option value="5">连续赢得xx把</option>
                    <option value="6">当地主xx把(仅对斗地主生效)</option>
                    <option value="7">一天内打出xx王炸(仅对斗地主生效)</option>
                    <option value="8">一天赢得xx次大关(仅对跑得快生效)</option>
                    <option value="9">一天赢得xx次小关(仅对跑得快生效)</option>
                    <option value="10">自摸xx次(仅对麻将生效)</option>
                    <option value="11">清一色胡xx次(仅对麻将生效)</option>
                    <option value="12">七对胡x次(仅对麻将生效)</option>
                    <option value="13">抢杠胡x次(仅对麻将生效)</option>
                    <option value="14">十三幺胡x次(仅对麻将生效)</option>
                    <option value="15">碰碰胡x次(仅对麻将生效)</option>
                    <option value="16">一天累计胡幺九xx次</option>
                    <option value="17">一天累计胡将对xx次</option>
                    <option value="18">一天累计胡门清xx次</option>
                    <option value="19">一天累计胡中张xx次</option>
                    <option value="20">一天累计胡金钩钓xx次</option>
                    <option value="21">一天累计天胡xx次</option>
                    <option value="22">一天累计地胡xx次</option>
                </select>
            </div>

            <!--对应条件对应的数量【conditionNum】-->
            <div class="form-control" style="width: 30%;border: 1px solid darkgray;float: left;">
                <div style="width: 90%;float: left;">
                    <input type="number" -class="form-control" style="border: none;width: 100%;" id="conditionNum">
                </div>
                <div style="width: 10%;float: left;">
                    <span style="color: darkgray;"> (局) </span>
                </div>
            </div>
        </div>
    </div>
    <div class="form-group" style="width: 100%;">
        <label for="repeatType" class="control-label col-xs-12 col-sm-2" style="width: 20%;">时间范围:</label>
        <div class="col-xs-12 col-sm-8" style="width: 80%;">
            <div class="jeitem" style="width: 100%;">
                <!--重复任务-->
                <div class="jeinpbox" id="shijian" style="display: none;"><input type="text" class="jeinput time" id="test11B" placeholder="请选择时间" readonly value="<?php echo $time; ?>"></div>
                <!--一次性任务-->
                <div class="jeinpbox" id="shijian1" style="width: 60%;display: block;"><input type="text" class="jeinput time1" id="test11A" placeholder="请选择时间" readonly value=""></div>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="/seer_gm/public/newrili2/test/demo.js"></script>
    <div class="form-group" style="width: 100%;display: none;">
        <label for="repeatType" class="control-label col-xs-12 col-sm-2" style="width: 20%;">任务状态:</label>
        <div class="col-xs-12 col-sm-8" style="width: 80%;">
            <input type="radio" name="task_status" id="task_status" checked value="2"> 启用
            <input type="radio" name="task_status" value="1"> 禁用
        </div>
    </div>
    <div class="form-group">
        <label class="repeatType col-xs-12 col-sm-2"></label>
        <div class="col-xs-12 col-sm-8">
            <button type="button" class="btn btn-success btn-embossed" id="sure">保存</button>
            <button type="button" class="btn btn-default btn-embossed" id="dels">取消</button>
        </div>
    </div>
</form>
<script type="text/javascript" src="/seer_gm/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<!--点击弹窗中的取消-->
<!--游戏模式【加一个模式】-->
<script type="text/javascript">
    $(function () {
        $("#dels").click(function () {
            parent.layer.closeAll();
        })
    })
</script>
<!--点击游戏类型限制与游戏规模限制判断确定是否出现后面的gameSubType类型-->
<script type="text/javascript">
    $(function () {
        $("#gameTypeLimit").click(function () {
            var val = $(this).val();
            if(val=="0"){
                $("#gameSubType").css("display","block");
                $("#gameSubType1").css("display","none");
                $("#gameSubType2").css("display","none");
                $("#gameSubType3").css("display","none");
                $("#gameSubType4").css("display","none");
                $("#gameSubType5").css("display","none");
                $("#gameSubType7").css("display","none");
            }
            else if(val=="1"){
                $("#gameSubType1").css("display","block");
                $("#gameSubType").css("display","none");
                $("#gameSubType2").css("display","none");
                $("#gameSubType3").css("display","none");
                $("#gameSubType4").css("display","none");
                $("#gameSubType5").css("display","none");
                $("#gameSubType7").css("display","none");
            }
            else if(val=="2"){
                $("#gameSubType2").css("display","block");
                $("#gameSubType").css("display","none");
                $("#gameSubType1").css("display","none");
                $("#gameSubType3").css("display","none");
                $("#gameSubType4").css("display","none");
                $("#gameSubType5").css("display","none");
                $("#gameSubType7").css("display","none");
            }
            else if(val=="3"){
                $("#gameSubType3").css("display","block");
                $("#gameSubType").css("display","none");
                $("#gameSubType1").css("display","none");
                $("#gameSubType2").css("display","none");
                $("#gameSubType4").css("display","none");
                $("#gameSubType5").css("display","none");
                $("#gameSubType7").css("display","none");
            }
            else if(val=="4"){
                $("#gameSubType4").css("display","block");
                $("#gameSubType").css("display","none");
                $("#gameSubType1").css("display","none");
                $("#gameSubType2").css("display","none");
                $("#gameSubType3").css("display","none");
                $("#gameSubType5").css("display","none");
                $("#gameSubType7").css("display","none");
            }
            else if(val=="5"){
                $("#gameSubType5").css("display","block");
                $("#gameSubType4").css("display","none");
                $("#gameSubType").css("display","none");
                $("#gameSubType1").css("display","none");
                $("#gameSubType2").css("display","none");
                $("#gameSubType3").css("display","none");
                $("#gameSubType7").css("display","none");
            }
            else if(val=="7"){
                $("#gameSubType7").css("display","block");
                $("#gameSubType5").css("display","none");
                $("#gameSubType4").css("display","none");
                $("#gameSubType").css("display","none");
                $("#gameSubType1").css("display","none");
                $("#gameSubType2").css("display","none");
                $("#gameSubType3").css("display","none");
            }
        })
    })
</script>
<!--点击时间的选择-->
<script type="text/javascript">
    $(function () {
        $("#shijian").css("display","block");
        $("#shijian1").css("display","none");
        /*$("input[name='repeatType']").click(function () {
            var val = $(this).val();
            if(val=="2"){
                $("#shijian").css("display","block");
                $("#shijian1").css("display","none");
            }
            else if(val=="1"){
                $("#shijian1").css("display","block");
                $("#shijian").css("display","none");
            }
        })*/
    })
</script>
<!--点击确定保存信息-->
<script type="text/javascript">
    $(function () {
        //$repeatType,$rewardType,$rewardNum,$order,$gameTypeLimit,$matchNameLimit,$conditionType,$conditionNum,$gameSubType
        $("#sure").click(function () {
            var ip = $("#ip").val();
            var tiaourl = "http://"+ip+"/fastadmin_revision1/public/admin/task/system?ref=addtabs";
            var url = "<?php echo url('addSave'); ?>";
            var repeatType = $("input[name='repeatType']:checked").val();//alert(repeatType);
            var rewardType = $("#rewardType").val();
            var rewardNum = $("#rewardNum").val();
            var order = $("#order").val();
            var gameTypeLimit = $("#gameTypeLimit").val();
            var matchNameLimit = $("#matchNameLimit").val();
            var conditionType = $("#conditionType").val();
            var conditionNum = $("#conditionNum").val();
            var time = $(".time").val();//为一次性任务
            var time1 = $(".time1").val();//为重复任务
            var gameSubType = $("#gameSubType").val();
            var gameSubType1 = $("#gameSubType1").val();
            var gameSubType2 = $("#gameSubType2").val();
            var gameSubType3 = $("#gameSubType3").val();
            var gameSubType4 = $("#gameSubType4").val();
            var gameSubType5 = $("#gameSubType5").val();
            var gameSubType7 = $("#gameSubType7").val();
            //判断任务字段
            var type = $("input[name='repeatType']").val();
            if(order==""){
                layer.msg('<span style="margin-left: 30px;">任务顺序不能为空,请必须输入任务顺序!</span>', {icon: 2,time: 2500});
            }
            else if(rewardNum==""){
                layer.msg('<span style="margin-left: 30px;">奖励数量不能为空,请必须输入奖励数量!</span>', {icon: 2,time: 2500});
            }
            else if(conditionNum==""){
                layer.msg('<span style="margin-left: 30px;">对局数量不能为空,请必须输入对局数量!</span>', {icon: 2,time: 2500});
            }
            else {
                layer.msg('<span style="margin-left: 30px;">输入正确!</span>', {icon: 1,time: 2500});
                if(gameTypeLimit=="0"){
                    if(repeatType=="2"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time,gameSubType:gameSubType},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                    else if(repeatType=="1"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time1,gameSubType:gameSubType},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                }
                else if(gameTypeLimit=="1"){
                    if(repeatType=="2"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time,gameSubType:gameSubType1},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                    else if(repeatType=="1"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time1,gameSubType:gameSubType1},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                }
                else if(gameTypeLimit=="2"){
                    if(repeatType=="2"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time,gameSubType:gameSubType2},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                    else if(repeatType=="1"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time1,gameSubType:gameSubType2},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                }
                else if(gameTypeLimit=="3"){
                    if(repeatType=="2"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time,gameSubType:gameSubType3},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                    else if(repeatType=="1"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time1,gameSubType:gameSubType3},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                }
                else if(gameTypeLimit=="4"){
                    if(repeatType=="2"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time,gameSubType:gameSubType4},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                    else if(repeatType=="1"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time1,gameSubType:gameSubType4},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                }
                else if(gameTypeLimit=="5"){
                    if(repeatType=="2"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time,gameSubType:gameSubType5},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                    else if(repeatType=="1"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time1,gameSubType:gameSubType5},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                }
                else if(gameTypeLimit=="7"){
                    if(repeatType=="2"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time,gameSubType:gameSubType7},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                    else if(repeatType=="1"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time1,gameSubType:gameSubType7},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                }
                else if(gameTypeLimit=="8"){
                    if(repeatType=="2"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time,gameSubType:gameSubType7},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                    else if(repeatType=="1"){
                        $.ajax({
                            type:'post',
                            url:url,
                            data:{repeatType:repeatType,rewardType:rewardType,rewardNum:rewardNum,order:order,gameTypeLimit:gameTypeLimit,matchNameLimit:matchNameLimit,conditionType:conditionType,conditionNum:conditionNum,time:time1,gameSubType:gameSubType7},
                            dataType:'json',
                            success:function (data) {
                                layer.msg('<span style="margin-left: 30px;">成功!</span>', {icon: 1,time: 10000});
                                console.log(data);
                                console.log("success");
                                top.layer.closeAll();
                                //top.location.href="<?php echo url('index'); ?>";
                                top.location.href=tiaourl;
                            },
                            error:function () {
                                layer.msg('<span style="margin-left: 30px;">失败!</span>', {icon: 2,time: 10000});
                                console.log("fail");
                            }
                        })
                    }
                }
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