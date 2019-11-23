<?php if (!defined('THINK_PATH')) exit(); /*a:4:{s:107:"E:\PHPTutorial\WWW\fastadmin_revision1\public/../application/admin\view\gamemodule\agentconfig\configs.html";i:1564041843;s:81:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\layout\default.html";i:1535699920;s:78:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\meta.html";i:1535699920;s:80:"E:\PHPTutorial\WWW\fastadmin_revision1\application\admin\view\common\script.html";i:1535699920;}*/ ?>
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
                                <link rel="stylesheet" href="/fastadmin_revision1/public//combo/combo.select.css">
<script src="/fastadmin_revision1/public//combo/jquery-1.11.3.min.js"></script>
<script src="/fastadmin_revision1/public//combo/jquery.combo.select.js"></script>
<style type="text/css">
    .inputnull{
        border: none;
        background-color: white;
        color: red;
        font-weight: 900;
    }
</style>
<form id="add-form" class="form-horizontal" role="form" data-toggle="validator" method="POST" action="">
    <textarea id="data" style="display: none;"><?php echo $data; ?></textarea>
    <div class="form-group">
        <label for="bs3Select" class="control-label col-xs-12 col-sm-2">

        </label>
        <div class="col-xs-12 col-sm-8">
            <textarea id="day_val" class="form-control" style="display: none;"></textarea>
            <div class="addel wai">
                <!--<div>
                    <span style="color: red;font-weight: 900;font-size: 18px;">节点设置表示方法【推广玩家:该接点需要给公司产生多少收益:该节点达到了条件 最大分红比例: 该节点的名称:分红类型(1:节点分红,2:公司分红):基础玩家每日最大提币限制】</span>
                </div>-->
                <div style="height: 25px;"></div>
                <div class='neizhan' style='-margin-left:-41%;'><table><tbody><tr><td><span style='display: block;float: left;font-weight: bold;color: black;font-size: 18px;'>提现的手续费:</span><input type="text" value="<?php echo $brokerage; ?>" class="form-control" name="brokerage" style="width: 100px;display: block;float: left;"><span style='color: red;display: block;float: left;font-size: 18px;'>请提现手续费必须是0-1之间的数字</span></td></tr>    <tr><td><span style='display: block;float: left;font-weight: bold;color: black;font-size: 18px;'>基础玩家每日最大提币限制:</span><input type="text" value="<?php echo $baseMaxWithDraw; ?>" class="form-control" name="baseMaxWithDraw" style="width: 100px;display: block;float: left;"><span style='color: red;display: block;float: left;font-size: 18px;'>* 请必须填写该值</span></td></tr>    <tr><td colspan="2"><hr style="background-color:red;"/></td></tr>     <tr><td colspan="2"><div class="form-group target dfsdfasas23wds">

                <tr><td colspan="2"><div class="form-group target sads"><div class="dsad" style="margin-top: 5px;"><table style="position:relative;"><tbody><tr><td> 节点设置表示方法【 <span style="color: red;font-weight: 900;font-size: 18px;">推广玩家--该接点需要给公司产生多少收益--该节点达到了条件 最大分红比例--该节点的名称--分红类型--基础玩家每日最大提币限制</span> 】  </td></tr></tbody></table></div>

                </div><div style="float: right;"></div></td></tr>     <tr><td colspan="2"><div class="form-group target wn"></div><div style="float: right;"><button type="button" class="form-control adc" style="width:auto;float:left;" id="zanding1">+</button></div></td></tr><tr><td colspan="2"><hr style="background-color:blue;"/></td></tr></tbody></table></div>
            </div>
        </div>
    </div>

    <div class="form-group">
        <label class="control-label col-xs-12 col-sm-2"></label>
        <div class="col-xs-12 col-sm-8">
            <button type="button" class="btn btn-success btn-embossed" id="sure">保存</button>
            <button type="button" class="btn btn-default btn-embossed" id="dels">取消</button>
        </div>
    </div>
</form>
<script type="text/javascript" src="/fastadmin_revision1/public//assets/libs/jcrop/js/jquery.min.js"></script>
<script type="text/javascript">
    $(function () {
        $("#ribbon").css("display","none");
    })
</script>
<!--点击弹窗中的取消-->
<script type="text/javascript">
    $(function () {
        $("#dels").click(function () {
            parent.layer.closeAll();
        })
    })
</script>

<!--代理配置设置-->
<script type="text/javascript">
    //'<td>'+djonlyss+"<input type='number' name='maxWithDraw[]' style='width:80px;' placeholder='基础玩家每日最大提币限制' value='1' class='form-control' id='"+ses5+"'/>"+'</td>'
    $(function () {
        var columName = $("#data").val();
        var columName = JSON.parse(columName);
        var djonlyss = "";
        for(var i =0;i<columName.length; i++){
            if(columName[i].redType=="1"){
                $(".wn").append(
                    "<div class='nei' style='margin-top: 5px;'>"
                    +'<table style="position:relative;"><tbody><tr style="-margin-top: 10px;">'
                    +'<td>'
                    +djonlyss
                    +"<input type='number' name='numP[]' style='width:80px;' placeholder='推广玩家数量' value='"
                    +columName[i].numP
                    +"' class='form-control shull'/>"
                    +'</td>'
                    +'<td>'
                    +"<input type='number' name='needProfit[]' style='width:80px;' placeholder='收益量' value='"
                    +columName[i].needProfit
                    +"' class='form-control'"
                    +"/>"
                    +'</td>'
                    +'<td>'
                    +djonlyss
                    +"<input type='number' name='maxProp[]' style='width:80px;' placeholder='最大分红比例' value='"
                    +columName[i].maxProp
                    +"' class='form-control'"
                    +"/>"
                    +'</td>'
                    +'<td>'
                    +djonlyss
                    +"<input type='text' name='name[]' style='width:80px;' placeholder='节点名称' value='"
                    +columName[i].name
                    +"' class='form-control'"
                    +"/>"
                    +'</td>'
                    +'<td>'
                    +'</td>'
                    +'<td>'
                    +djonlyss
                    +'<select class="form-control" name="redType[]">'
                    +'<option value="1" selected>节点分红</option><option value="2">公司分红</option>'
                    +'</select>'
                    +'</td>'
                    +'<td>'
                    +'</td>'
                    +'<td>'
                    +djonlyss
                    +"<input type='number' name='maxWithDraw[]' style='width:80px;' placeholder='基础玩家每日最大提币限制' value='"
                    +columName[i].maxWithDraw
                    +"' class='form-control'/>"
                    +'</td>'
                    +'<td>'
                    +'</td>'
                    +'<td><button type="button" class="btn btn-danger delss" style="margin-top:-35%;">-</button></td>'
                    +"<td class='asd' style='position:absolute;margin-top:2.5%;width:70%;'></td>"
                    +'<tr><tbody><table>'
                    +"</div>"
                );
            }
            else {
                $(".wn").append(
                    "<div class='nei' style='margin-top: 5px;'>"
                    +'<table style="position:relative;"><tbody><tr style="-margin-top: 10px;">'
                    +'<td>'
                    +djonlyss
                    +"<input type='number' name='numP[]' style='width:80px;' placeholder='推广玩家数量' value='"
                    +columName[i].numP
                    +"' class='form-control shull'/>"
                    +'</td>'
                    +'<td>'
                    +"<input type='number' name='needProfit[]' style='width:80px;' placeholder='收益量' value='"
                    +columName[i].needProfit
                    +"' class='form-control'"
                    +"/>"
                    +'</td>'
                    +'<td>'
                    +djonlyss
                    +"<input type='number' name='maxProp[]' style='width:80px;' placeholder='最大分红比例' value='"
                    +columName[i].maxProp
                    +"' class='form-control'"
                    +"/>"
                    +'</td>'
                    +'<td>'
                    +djonlyss
                    +"<input type='text' name='name[]' style='width:80px;' placeholder='节点名称' value='"
                    +columName[i].name
                    +"' class='form-control'"
                    +"/>"
                    +'</td>'
                    +'<td>'
                    +'</td>'
                    +'<td>'
                    +djonlyss
                    +'<select class="form-control" name="redType[]">'
                    +'<option value="1">节点分红</option><option value="2" selected>公司分红</option>'
                    +'</select>'
                    +'</td>'
                    +'<td>'
                    +'</td>'
                    +'<td>'
                    +djonlyss
                    +"<input type='number' name='maxWithDraw[]' style='width:80px;' placeholder='基础玩家每日最大提币限制' value='"
                    +columName[i].maxWithDraw
                    +"' class='form-control'/>"
                    +'</td>'
                    +'<td>'
                    +'</td>'
                    +'<td><button type="button" class="btn btn-danger delss" style="margin-top:-35%;">-</button></td>'
                    +"<td class='asd' style='position:absolute;margin-top:2.5%;width:70%;'></td>"
                    +'<tr><tbody><table>'
                    +"</div>"
                );
            }
        }
        //添加节点
        $(document).on("click", "#zanding1", function() {
            var str = $(".shull").last().attr("id");
            var strs = String(str);
            var cd = strs.length;
            var arr = strs.substring(5,cd);
            var arrs = Number(arr)+1;
            if(strs=="undefined"){ //alert("未定义");
                var num = $(".nei").length+1;console.log("数量:"+num);
                var mails = $(".wn"),
                    divs = "search_input_div" + num,
                    sesa = "select" + num,
                    ses = "input" + num,
                    ses1 = "input1" + num,
                    ses2 = "input2" + num,
                    ses3 = "input3" + num,
                    ses4 = "input4" + num,
                    ses5 = "input5" + num,
                    divnum = "充值档次"+num+":",
                    ids = "jia"+num,
                    jia = "加"+num,
                    jiadj = "jias"+num,
                    djonly = num+"档位",
                    dds = num,
                    djonlyss = "",
                    divs = "search_input_div" + num;
                var s_strs = "<div class='nei' style='margin-top: 5px;'>"+'<table style="position:relative;"><tbody><tr style="-margin-top: 10px;">'+'<td>'+djonlyss+"<input type='number' name='numP[]' style='width:80px;' placeholder='推广玩家数量' value='1' class='form-control shull'/>"+'</td>'+'<td>'+djonlyss+"<input type='number' name='needProfit[]' style='width:80px;' placeholder='收益量' value='1' class='form-control' id='"+ses2+"'/>"+'</td>'+'<td>'+djonlyss+"<input type='number' name='maxProp[]' style='width:80px;' placeholder='最大分红比例' value='1' class='form-control' id='"+ses3+"'/>"+'</td>'+'<td>'+djonlyss+"<input type='text' name='name[]' style='width:80px;' placeholder='节点名称' value='1' class='form-control' id='"+ses4+"'/>"+'</td>'+'<td>'+'</td>'+'<td>'+djonlyss+'<select class="form-control" name="redType[]"><option value="1">节点分红</option><option value="2">公司分红</option></select>'+'</td>'+'<td>'+djonlyss+"<input type='number' name='maxWithDraw[]' style='width:80px;' placeholder='基础玩家每日最大提币限制' value='1' class='form-control' id='"+ses5+"'/>"+'</td>'+'<td>'+'</td>'+'<td><button type="button" class="btn btn-danger delss" style="margin-top:-35%;">-</button></td>'+"<td class='asd' style='position:absolute;margin-top:2.5%;width:70%;'></td>"+'<tr><tbody><table>'+"</div>";
                var storeNum = $(".nei").length+1;
                $("#zksdnrNum").html(storeNum);
                mails.append(s_strs);
            }
            else { //alert("大于1");
                var num = Number(arrs);//alert(num);
                var mails = $(".wn"),
                    divs = "search_input_div" + num,
                    sesa = "select" + num,
                    ses = "input" + num,
                    ses1 = "input1" + num,
                    ses2 = "input2" + num,
                    ses3 = "input3" + num,
                    ses4 = "input4" + num,
                    ses5 = "input5" + num,
                    divnum = "充值档次"+num+":",
                    ids = "jia"+num,
                    jia = "加"+num,
                    jiadj = "jias"+num,
                    djonly = num+"档位",
                    dds = num,
                    djonlyss = "",
                    divs = "search_input_div" + num;
                var s_strs = "<div class='nei' style='margin-top: 5px;'>"+'<table style="position:relative;"><tbody><tr style="-margin-top: 10px;">'+'<td>'+djonlyss+"<input type='number' name='numP[]' style='width:80px;' placeholder='推广玩家数量' value='1' class='form-control shull'/>"+'</td>'+'<td>'+djonlyss+"<input type='number' name='needProfit[]' style='width:80px;' placeholder='收益量' value='1' class='form-control' id='"+ses2+"'/>"+'</td>'+'<td>'+djonlyss+"<input type='number' name='maxProp[]' style='width:80px;' placeholder='最大分红比例' value='1' class='form-control' id='"+ses3+"'/>"+'</td>'+'<td>'+djonlyss+"<input type='text' name='name[]' style='width:80px;' placeholder='节点名称' value='1' class='form-control' id='"+ses4+"'/>"+'</td>'+'<td>'+'</td>'+'<td>'+djonlyss+'<select class="form-control" name="redType[]"><option value="1">节点分红</option><option value="2">公司分红</option></select>'+'</td>'+'<td>'+djonlyss+"<input type='number' name='maxWithDraw[]' style='width:80px;' placeholder='基础玩家每日最大提币限制' value='1' class='form-control' id='"+ses5+"'/>"+'</td>'+'<td>'+'</td>'+'<td><button type="button" class="btn btn-danger delss" style="margin-top:-35%;">-</button></td>'+"<td class='asd' style='position:absolute;margin-top:2.5%;width:70%;'></td>"+'<tr><tbody><table>'+"</div>";
                var storeNum = $(".nei").length+1;
                $("#zksdnrNum").html(storeNum);
                mails.append(s_strs);
            }
        })
        //删除 dels、delss
        $(document).on('click', '.delss', function() {
            var _this = $(this);
            if(_this.parent().parent().parent().parent().parent().index() == $(".jdjgdj").length - 1){
            }
            _this.parent().parent().parent().parent().parent().remove();
        })
    })
</script>
<!--点击保存数据按钮-->
<script type="text/javascript">
    $(function () {
        $("#sure").on('click',function () {
            var url = "<?php echo url('addSave'); ?>";
            var brokerage = $("input[name='brokerage']").val();
            var baseMaxWithDraw = $("input[name='baseMaxWithDraw']").val();
            var result=[];
            var numP = "";
            jQuery("input[name^='numP']").each(function(i){
                result[i]=jQuery(this).val();
                numP += jQuery(this).val()+",";
            });
            numP=numP.substring(0,numP.length-1);//得到推广玩家数量值
            var needProfit = "";
            jQuery("input[name^='needProfit']").each(function(i){
                result[i]=jQuery(this).val();
                needProfit += jQuery(this).val()+",";
            });
            needProfit=needProfit.substring(0,needProfit.length-1);//得到收益值
            var maxProp = "";
            jQuery("input[name^='maxProp']").each(function(i){
                result[i]=jQuery(this).val();
                maxProp += jQuery(this).val()+",";
            });
            maxProp=maxProp.substring(0,maxProp.length-1);//得到最大分红比例
            var name = "";
            jQuery("input[name^='name']").each(function(i){
                result[i]=jQuery(this).val();
                name += jQuery(this).val()+",";
            });
            name=name.substring(0,name.length-1);//得到节点名称
            var redType = "";
            jQuery("select[name^='redType']").each(function(i){
                result[i]=jQuery(this).val();
                redType += jQuery(this).val()+",";
            });
            redType=redType.substring(0,redType.length-1);//得到分红类型
            var maxWithDraw = "";
            jQuery("input[name^='maxWithDraw']").each(function(i){
                result[i]=jQuery(this).val();
                maxWithDraw += jQuery(this).val()+",";
            });
            maxWithDraw=maxWithDraw.substring(0,maxWithDraw.length-1);//得到每日最大提币限制
            $.ajax({
                type:"post",
                url:url,
                data:{brokerage:brokerage,baseMaxWithDraw:baseMaxWithDraw,numP:numP,needProfit:needProfit,maxProp:maxProp,name:name,redType:redType,maxWithDraw:maxWithDraw},
                dataType:"json",
                success:function (data) {
                    var data = data;
                    //console.log("成功");
                    if(data=="0"){
                        alert("提现手续费为空");
                    }
                    else if(data=="-1"){
                        alert("推广玩家数量组中含有空值");
                    }
                    else if(data=="-2"){
                        alert("收益量组中含有空值");
                    }
                    else if(data=="-3"){
                        alert("最大分红比例组中含有空值");
                    }
                    else if(data=="-4"){
                        alert("节点名称组中含有空值");
                    }
                    else if(data=="-5"){
                        alert("请至少添加一个节点");
                    }
                    else if(data=="-6"){
                        alert("提现手续费必须在0到1之间的小数");
                    }
                    else if(data=="-7"){
                        alert("最大分红比例组中必须是在0到1之间的数");
                    }
                    else if(data=="-8"){
                        alert("基础玩家每日最大提币限制为空");
                    }
                    else if(data=="-9"){
                        alert("每日最大提币限制组中含有空值");
                    }
                    else {
                        alert("设置成功");
                        //console.log(data);
                        parent.layer.closeAll();
                        parent.location.href="<?php echo url('index'); ?>";
                    }
                },
                error:function () {
                    console.log("失败");
                }
            });
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