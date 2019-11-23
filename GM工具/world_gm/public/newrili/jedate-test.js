/**
 * jeDate 演示
 */
$(function () {
    //常规选择
    $("#test01").jeDate({
        format: "YYYY"
    });
    $("#test02").jeDate({
        format: "YYYY-MM"
    });
    $("#test03").jeDate({
        format: "YYYY-MM-DD"
    });
    $("#test04").jeDate({
        format: "YYYY-MM-DD hh:mm:ss"
    });
    $("#test05").jeDate({
        format: "hh:mm:ss"
    });
    //开始时间时分秒
    $("#start_time").jeDate({
        format: "hh:mm:ss"
    });
    //结束时间时分秒
    $("#end_time").jeDate({
        format: "hh:mm:ss"
    });
    //区域范围选择
    $("#test06").jeDate({
        format: "YYYY",
        range:" ~ "
    });
    $("#test07").jeDate({
        format: "YYYY-MM",
        range:" To "
    });
    $("#test08").jeDate({
        format: "YYYY-MM-DD",
        range:" 至 "
    });
    //区域范围双面板选择
    $("#test09").jeDate({
        format: "YYYY",
        multiPane:false,
        range:" ~ "
    });
    $("#test10").jeDate({
        format: "YYYY-MM",
        multiPane:false,
        range:" To "
    });
    $("#test11").jeDate({
        format: "YYYY-MM-DD",
        multiPane:false,
        range:" 至 "
    });
    jeDate("#test11B",{
        minDate:"03:02:04",//最小日期
        maxDate:"14:30:45",
        format: "hh:mm:ss",
        multiPane:false,
        range:" 至 "
    });
    //自定义格式选择
    $("#test12").jeDate({
        format: "YYYY年MM月DD日"
    });
    $("#test13").jeDate({
        format: "MM-DD-YYYY"
    });
    $("#test14").jeDate({
        format: "DD/MM/YYYY"
    });
    //一次绑定多个选择
    $(".moredate").each(function(){
        var mat = "hh:mm:ss";
        $(this).jeDate({
            format: "hh:mm:ss"
        });
    });
    
    //有效、无效日期限制
    $("#test20").jeDate({
        valiDate:["0[4-7]$,1[1-5]$,2[58]$",true],
        format: "YYYY年MM月DD日"
    });
    $("#test21").jeDate({
        valiDate:["0[4-7]$,1[1-5]$,2[58]$",false],
        format: "YYYY年MM月DD日"
    });
    $("#test22").jeDate({
        valiDate:["1$,3$,6$,9$",true],
        format: "YYYY年MM月DD日"
    });
    $("#test23").jeDate({
        valiDate:["1$,3$,6$,9$",false],
        format: "YYYY年MM月DD日"
    });
    $("#test24").jeDate({
        valiDate:["%1,%3,%6,%9,%12,%15,%25",true],
        format: "YYYY年MM月DD日"
    });
    $("#test25").jeDate({
        valiDate:["%1,%3,%6,%9,%12,%15,%25",false],
        format: "YYYY年MM月DD日"
    });
});