<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:84:"E:\PHPTutorial\WWW\seer_gm\public/../application/admin\view\mail\sendmail\index.html";i:1536029463;s:69:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\layout\default.html";i:1535699920;s:66:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\meta.html";i:1535699920;s:68:"E:\PHPTutorial\WWW\seer_gm\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                                
<!--<script type="text/javascript" src="http://www.daimajiayuan.com/download/jquery/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="http://cdn.bootcss.com/bootstrap-select/2.0.0-beta1/js/bootstrap-select.js"></script>
<link rel="stylesheet" type="text/css" href="http://cdn.bootcss.com/bootstrap-select/2.0.0-beta1/css/bootstrap-select.css">
<link href="http://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet">-->
<script type="text/javascript" src="/seer_gm/public//mail/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="/seer_gm/public//mail/bootstrap-select.js"></script>
<link rel="stylesheet" type="text/css" href="/seer_gm/public//mail/bootstrap-select.css">
<link href="/seer_gm/public//mail/bootstrap.min.css" rel="stylesheet">
<script type="text/javascript">
    $(window).on('load', function () {
        $('.selectpicker').selectpicker({
            'selectedText': 'cat'
        });
        $('.selectpicker').click(function () {
            var a = $("#bs3Select").val();//console.log(a);
            $("#a").val(a);
            $("#ad").val(a);
        });
    });
</script>

<form id="add-form" class="form-horizontal" role="form" data-toggle="validator" method="POST" action="">

    <div class="form-group">
        <label for="c-pid" class="control-label col-xs-12 col-sm-2">请选择游戏ID:</label>
        <div class="col-xs-12 col-sm-8">
            <select id="bs3Select" class="selectpicker show-tick form-control" multiple data-live-search="true" name="uids">
                <?php if(is_array($list) || $list instanceof \think\Collection || $list instanceof \think\Paginator): $i = 0; $__LIST__ = $list;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$data): $mod = ($i % 2 );++$i;?>
                <option value="<?php echo $data['uid']; ?>(<?php echo $data['wx_name']; ?>)"><?php echo $data['uid']; ?>+<?php echo $data['wx_name']; ?></option>
                <?php endforeach; endif; else: echo "" ;endif; ?>
            </select>
        </div>
    </div>
    <div class="form-group">
        <label for="c-pid" class="control-label col-xs-12 col-sm-2">选择的结果:</label>
        <div class="col-xs-12 col-sm-8">
            <textarea rows="5" cols="50" disabled id="a" name="uids" class="form-control"></textarea>
        </div>
    </div>
    <div class="form-group">
        <label for="bs3Select" class="col-lg-2 control-label">数量</label>
        <div class="col-lg-10" id="mails">
            <div class="addel wai">
                <div class="form-group target wn">

                </div>
                <a style="text-decoration:none;color:red;"> (* 金豆数量+房卡数量...)(最多只能加六个)</a>
                <input type="button" class="form-control" id="adds" value="+">
            </div>
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-xs-12 col-sm-2"></label>
        <div class="col-xs-12 col-sm-8">
            <button type="button" class="btn btn-success btn-embossed <?php echo $auth->check('mail/sendmail/set')?'':'hide'; ?>" id="sendMail">发送</button>
        </div>
    </div>
</form>
<!-- <script type="text/javascript" src="/seer_gm/public//assets/libs/jcrop/js/jquery.min.js"></script> -->
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<script type="text/javascript">
    //增加,判断输入的数量是否为空
    $(document).on("click", "#adds", function() {
        var str = $(".shul").last().attr("id");
        var strs = String(str);
        var cd = strs.length;
        var arr = strs.substring(5,cd);
        var arrs = Number(arr)+1;

        if(strs=="undefined"){
            var num = $(".nei").length+1;
            var mails = $(".wn"),
                divs = "search_input_div" + num,
                sesa = "select" + num,
                ses = "input" + num;
            /*var s_strs = "<div class='nei' style='-margin-left:-41%;'>"+'<table style="position:relative;"><tbody><tr>'+'<td>'+"<input type='number' name='contactt[]' style='width:100%;border: 1px #ccc solid;border-radius: 3px;height:40px;margin-bottom: 15px;' placeholder='请输入金豆数量' value='1' class='shul' id='"+ses+"'/>"+'</td>'+'<td>'+"<input type='number' name='contactt1[]' style='width:100%;border: 1px #ccc solid;border-radius: 3px;height:40px;margin-bottom: 15px;' placeholder='请输入房卡数量' value='1' class='shul' id='"+ses+"'/>"+'</td>'+'<td><button type="button" class="btn btn-danger dels" style="margin-top:-35%;">-</button></td>'+"<td class='asd' style='position:absolute;margin-top:2.5%;width:70%;'></td>"+'<tr><tbody><table>'+"</div>";*/
            var s_strs = "<div class='nei' style='-margin-left:-41%;'>"+'<table style="position:relative;"><tbody><tr>'+'<td>'+'<select name="contactt[]" style="width:100%;border: 1px #ccc solid;border-radius: 3px;height:40px;margin-bottom: 15px;"><option value="1">金豆</option><option value="2">房卡</option><option value="3">钻石</option></select>'+'</td>'+'<td>'+"<input type='number' name='contactt1[]' style='width:100%;border: 1px #ccc solid;border-radius: 3px;height:40px;margin-bottom: 15px;' placeholder='请输入房卡数量' value='1' class='shul' id='"+ses+"'/>"+'</td>'+'<td><button type="button" class="btn btn-danger dels" style="margin-top:-35%;">-</button></td>'+"<td class='asd' style='position:absolute;margin-top:2.5%;width:70%;'></td>"+'<tr><tbody><table>'+"</div>";
            var neiDiv = $(".nei").size();
            if(neiDiv>6){
                alert("最多只能添加6个");
            }
            else {
                mails.append(s_strs);
                var count = 100;
                for(var i=1;i<count;i++){
                    $('#select'+i).comboSelect();
                }
            }
            $("input[name='contactt[]']:eq(0)").blur(function(){
                var val = $(this).val();
                var len = val.length;
                var arr = val.split('.');console.log(arr);
                if(val=""){
                    $(".asd:eq(0)").text('× 道具数量不能为空或者含有非法字符');
                    $(".asd:eq(0)").css({
                        'color':'red',
                        'font-size':'14px'
                    });
                    num1 = false;
                }
                else if(val!=""){
                    var point = /^\d{1,}$/;
                    if(point.test(val) && val.substring(0,1)!=="0"){
                        $(".asd:eq(0)").text('√ 输入正确');
                        $(".asd:eq(0)").css({
                            'color':'green',
                            'font-size':'14px'
                        });
                        num1 = true;

                    }
                    else {
                        $(".asd:eq(0)").text('× 首位数字必须大于零且不能输入小数');
                        $(".asd:eq(0)").css({
                            'color':'red',
                            'font-size':'14px'
                        });
                        num1 = false;
                    }
                }
            })
        }
        else {
            var num = Number(arrs);
            var mails = $(".wn"),
                divs = "search_input_div" + num,
                sesa = "select" + num,
                ses = "input" + num;
            /*var s_strs = "<div class='nei' style='-margin-left:-41%;'>"+'<table style="position:relative;"><tbody><tr>'+'<td>'+"<input type='number' name='contactt[]' style='width:100%;border: 1px #ccc solid;border-radius: 3px;height:40px;margin-bottom: 15px;' placeholder='请输入金豆数量' value='1' class='shul' id='"+ses+"'/>"+'</td>'+'<td>'+"<input type='number' name='contactt1[]' style='width:100%;border: 1px #ccc solid;border-radius: 3px;height:40px;margin-bottom: 15px;' placeholder='请输入房卡数量' value='1' class='shul' id='"+ses+"'/>"+'</td>'+'<td><button type="button" class="btn btn-danger dels" style="margin-top:-35%;">-</button></td>'+"<td class='asd' style='position:absolute;margin-top:2.5%;width:70%;'></td>"+'<tr><tbody><table>'+"</div>";*/
            var s_strs = "<div class='nei' style='-margin-left:-41%;'>"+'<table style="position:relative;"><tbody><tr>'+'<td>'+'<select name="contactt[]" style="width:100%;border: 1px #ccc solid;border-radius: 3px;height:40px;margin-bottom: 15px;"><option value="1">金豆</option><option value="2">房卡</option><option value="3">钻石</option></select>'+'</td>'+'<td>'+"<input type='number' name='contactt1[]' style='width:100%;border: 1px #ccc solid;border-radius: 3px;height:40px;margin-bottom: 15px;' placeholder='请输入房卡数量' value='1' class='shul' id='"+ses+"'/>"+'</td>'+'<td><button type="button" class="btn btn-danger dels" style="margin-top:-35%;">-</button></td>'+"<td class='asd' style='position:absolute;margin-top:2.5%;width:70%;'></td>"+'<tr><tbody><table>'+"</div>";
            var neiDiv = $(".nei").size();
            if(neiDiv>5){
                alert("最多只能添加6个");
            }
            else {
                mails.append(s_strs);
                var count = 100;
                for(var i=1;i<count;i++){
                    $('#select'+i).comboSelect();
                }
            }

        }
    })
    //删除
    $(document).on('click', '.dels', function() {
        var _this = $(this);
        if(_this.parent().parent().parent().parent().parent().index() == $(".nei").length - 1){
        }
        _this.parent().parent().parent().parent().parent().remove();
    })
</script>
<!--$(function(){
$("input[name='sort[]']").each(function(index,item){
alert($(this).val())
}
);
});-->
<!--提交测试-->
<script type="text/javascript">
    $("#sendMail").click(function () {
        var url = "<?php echo url('set'); ?>";
        var uids = $("textarea[name='uids']").val();//玩家集合
        var beannum = $("input[name='contactt[]']").val();//金豆数量集合
        var roomnum = $("input[name='contactt1[]']").val();
        var div = $(".wn").html();
        var beannums="";
        $("select[name='contactt[]']").each(function(index,item){
                beannums+=+$(this).val()+",";
            }

        );
        beannums=beannums.substring(0,beannums.length-1);//得到的是金豆数量的集合
        console.log("金豆数量集合"+beannums);
        var roomnums="";
        $("input[name='contactt1[]']").each(function(index,item){
            roomnums+=+$(this).val()+",";
            }

        );
        roomnums=roomnums.substring(0,roomnums.length-1);//得到房卡数量的集合
        console.log("房卡数量集合"+roomnums);
        //console.log(beannum);
        //alert(div);
        var beannum1 = $("input[name='contactt1[]']:eq(0)").val();
        var beannum2 = $("input[name='contactt1[]']:eq(1)").val();
        var beannum3 = $("input[name='contactt1[]']:eq(2)").val();
        var beannum4 = $("input[name='contactt1[]']:eq(3)").val();
        var beannum5 = $("input[name='contactt1[]']:eq(4)").val();
        var beannum6 = $("input[name='contactt1[]']:eq(5)").val();
        //console.log($("input[name='contactt[]']").length);
        if(uids==""){
            //alert("玩家不能为空");
            layer.msg('<span style="margin-left: 30px;">玩家不能为空为空,请至少选择一个玩家!</span>', {icon: 2,time: 2500});
        }
        //class名下面为wn为空的时候一样的保存不了
        /*else if(div==""){
            layer.msg('<span style="margin-left: 30px;">请至少添加一个数量!</span>', {icon: 2,time: 2500});
        }*/
        else if($("input[name='contactt1[]']").length==0){
            layer.msg('<span style="margin-left: 30px;">请至少添加一个数量!</span>', {icon: 2,time: 2500});
        }
        else if(beannum1==""){
            //alert("金豆数量为空");
            layer.msg('<span style="margin-left: 30px;">数量不能为空,请必须输入金豆数量!</span>', {icon: 2,time: 2500});
        }
        else if(beannum2==""){
            //alert("金豆数量为空");
            layer.msg('<span style="margin-left: 30px;">数量不能为空,请必须输入金豆数量!</span>', {icon: 2,time: 2500});
        }
        else if(beannum3==""){
            //alert("金豆数量为空");
            layer.msg('<span style="margin-left: 30px;">数量不能为空,请必须输入金豆数量!</span>', {icon: 2,time: 2500});
        }
        else if(beannum4==""){
            //alert("金豆数量为空");
            layer.msg('<span style="margin-left: 30px;">数量不能为空,请必须输入金豆数量!</span>', {icon: 2,time: 2500});
        }
        else if(beannum5==""){
            //alert("金豆数量为空");
            layer.msg('<span style="margin-left: 30px;">数量不能为空,请必须输入金豆数量!</span>', {icon: 2,time: 2500});
        }
        else if(beannum6==""){
            //alert("金豆数量为空");
            layer.msg('<span style="margin-left: 30px;">数量不能为空,请必须输入金豆数量!</span>', {icon: 2,time: 2500});
        }
        else {
            layer.msg('<span style="margin-left: 30px;">正确!</span>', {icon: 1,time: 2500});
            $.ajax({
                url:url,
                type:"post",
                data:{uids:uids,beannums:beannums,roomnums:roomnums},
                dataType:"json",
                success:function (data) {
                    console.log(data);
                },
                error:function () {
                    console.log("fail");
                }
            })
        }
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