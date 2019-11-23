/**
 * FastAdmin通用搜索
 *
 * @author: pppscn <35696959@qq.com>
 * @update 2017-05-07 <https://gitee.com/pp/fastadmin>
 *
 * @author: Karson <karsonzhang@163.com>
 * @update 2018-04-05 <https://gitee.com/karson/fastadmin>
 */

!function ($) {
    'use strict';
    var ip = $("#ip").val();
    var ColumnsForSearch = [];

    var sprintf = $.fn.bootstrapTable.utils.sprintf;

    var initCommonSearch = function (pColumns, that) {
        var vFormCommon = createFormCommon(pColumns, that);

        var vModal = sprintf("<div class=\"commonsearch-table %s\">", that.options.searchFormVisible ? "" : "hidden");
        vModal += vFormCommon;
        vModal += "</div>";
        that.$container.prepend($(vModal));
        that.$commonsearch = $(".commonsearch-table", that.$container);
        var form = $("form.form-commonsearch", that.$commonsearch);

        require(['form'], function (Form) {
            Form.api.bindevent(form);
            form.validator("destroy");
        });

        // 表单提交
        form.on("submit", function (event) {
            event.preventDefault();
            that.onCommonSearch();
            $("#form-search-uid").val($("#uid").val());
            $("#form-search-wx_name").val($("#wx_name").val());
            $("#form-search-match_id").val($("#match_id").val());
            $("#form-search-num").val($("#num").val());
            $("#form-search-plus_diamonds").val($("#plus_diamonds").val());
            $("#form-search-time").val($("#time").val());
            var ip = $("#ip").val();
            //计算服务费记录的总和
            var url = "http://"+ip+"/fastadmin_revision1/public/admin/player/servicerecord/sum"
            $.ajax({
                type:"post",
                url:url,
                data:{uid:$("#uid").val(),wx_name:$("#wx_name").val(),match_id:$("#match_id").val(),num:$("#num").val(),plus_diamonds:$("#plus_diamonds").val(),time:$("#time").val()},
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    console.log("数据为:"+data);
                    $("#servicenum").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });
            var url2 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/companyprofitSum";
            //公司盈亏总和
            $.ajax({
                type:"post",
                url:url2,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),num:$("#num").val(),profit_time:$("#profit_time").val(),time:$("#time").val(),finance_type:$('select[name="finance_type"]').val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    console.log("数据为:"+data);
                    $("#companyprofitnum").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });


            //1、比赛服务费(入账)
            var url11 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/bsfwfrz";
            $.ajax({
                type:"post",
                url:url11,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),num:$("#num").val(),profit_time:$("#profit_time").val(),time:$("#time").val(),finance_type:$('select[name="finance_type"]').val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    $("#bsfwfrz").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });
            //2、公司内部充值(入账)
            var url22 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/gsnbczrz";
            $.ajax({
                type:"post",
                url:url22,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),num:$("#num").val(),profit_time:$("#profit_time").val(),time:$("#time").val(),finance_type:$('select[name="finance_type"]').val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    $("#gsnbczrz").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });
            //3、节点奖励(出账)
            var url33 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/jdjlcz";
            $.ajax({
                type:"post",
                url:url33,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),num:$("#num").val(),profit_time:$("#profit_time").val(),time:$("#time").val(),finance_type:$('select[name="finance_type"]').val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    $("#jdjlcz").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });
            //4、提现服务费(入账)
            var url44 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/txfwfrz";
            $.ajax({
                type:"post",
                url:url44,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),num:$("#num").val(),profit_time:$("#profit_time").val(),time:$("#time").val(),finance_type:$('select[name="finance_type"]').val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    $("#txfwfrz").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });
            //5、抽奖消耗(入账)
            var url55 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/cjxhrz";
            $.ajax({
                type:"post",
                url:url55,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),num:$("#num").val(),profit_time:$("#profit_time").val(),time:$("#time").val(),finance_type:$('select[name="finance_type"]').val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    $("#cjxhrz").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });
            //6、抽奖获得(出账)
            var url66 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/cjxhcz";
            $.ajax({
                type:"post",
                url:url66,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),num:$("#num").val(),profit_time:$("#profit_time").val(),time:$("#time").val(),finance_type:$('select[name="finance_type"]').val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    $("#cjxhcz").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });
            //7、任务奖励(出账)
            var url77 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/rwjlcz";
            $.ajax({
                type:"post",
                url:url77,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),num:$("#num").val(),profit_time:$("#profit_time").val(),time:$("#time").val(),finance_type:$('select[name="finance_type"]').val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    $("#rwjlcz").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });
            //8、大喇叭(入账)
            var url88 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/dlbrz";
            $.ajax({
                type:"post",
                url:url88,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),num:$("#num").val(),profit_time:$("#profit_time").val(),time:$("#time").val(),finance_type:$('select[name="finance_type"]').val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    $("#dlbrz").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });

            //pfc充值记录总和
            var urlrecharge = "http://"+ip+"/fastadmin_revision1/public/admin/player/Pfcrecharge/sum";
            $.ajax({
                type:"post",
                url:urlrecharge,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),account_id:$("#account_id").val(),asset_name:$("#asset_name").val(),address_type:$("#address_type").val(),amount:$("#amount").val(),seq:$("#seq").val(),tx_from:$("#tx_from").val(),tx_to:$("#tx_to").val(),tx_hash:$("#tx_hash").val(),ts:$("#ts").val(),time:$("#time").val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    $("#pfcrechargenum").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });
            //计算有多少人充值了
            var urlrechargesumpeople = "http://"+ip+"/fastadmin_revision1/public/admin/player/Pfcrecharge/sumpeople";
            $.ajax({
                type:"post",
                url:urlrechargesumpeople,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),account_id:$("#account_id").val(),asset_name:$("#asset_name").val(),address_type:$("#address_type").val(),amount:$("#amount").val(),seq:$("#seq").val(),tx_from:$("#tx_from").val(),tx_to:$("#tx_to").val(),tx_hash:$("#tx_hash").val(),ts:$("#ts").val(),time:$("#time").val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    $("#pfcrechargesumpeople").text(data);
                },
                error:function () {
                    console.log("失败充值记录");
                }
            });

            //pfc提现记录总和
            var urlwidthdraw = "http://"+ip+"/fastadmin_revision1/public/admin/player/Pfcwithdraw/sum";
            $.ajax({
                type:"post",
                url:urlwidthdraw,
                data:{uid:$("#uid").val(),wx_name:$(".row div .col-xs-8 input:eq(1)").val(),to_chain:$("#to_chain").val(),in_asset_name:$("#in_asset_name").val(),in_amount:$("#in_amount").val(),out_asset_name:$("#out_asset_name").val(),out_amount:$("#out_amount").val(),seq:$("#seq").val(),txid:$("#txid").val(),type:$('select[name="type"]').val(),before_beans:$("#before_beans").val(),before_extend_beans:$("#before_extend_beans").val(),with_amount:$("#with_amount").val(),brokerage:$("#brokerage").val(),after_beans:$("#after_beans").val(),after_extend_beans:$("#after_extend_beans").val(),time:$("#time").val(),status:$('select[name="status"]').val(),address:$("#address").val()},//
                dataType:"json",
                success:function (data) {
                    console.log("成功");
                    $("#pfcwidthdrawnum").text(data);
                },
                error:function () {
                    console.log("失败");
                }
            });

            return false;
        });

        // 重置搜索
        form.on("click", "button[type=reset]", function (event) {

            //计算服务费记录的总和
            var url = "http://"+ip+"/fastadmin_revision1/public/admin/player/servicerecord/sum"
            $.ajax({
                type:"post",
                url:url,
                data:{uid:"",wx_name:"",match_id:"",num:"",plus_diamonds:"",time:""},
                dataType:"json",
                success:function (data) {
                    $("#servicenum").text(data);
                },
                error:function () {

                }
            });
            //公司盈亏总和
            var url2 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/companyprofitSum";
            $.ajax({
                type:"post",
                url:url2,
                data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
                dataType:"json",
                success:function (data) {
                    $("#companyprofitnum").text(data);
                },
                error:function () {

                }
            });

            //1、比赛服务费(入账)
            var url11 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/bsfwfrz";
            $.ajax({
                type:"post",
                url:url11,
                data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
                dataType:"json",
                success:function (data) {
                    $("#bsfwfrz").text(data);
                },
                error:function () {

                }
            });
            //2、公司内部充值(入账)
            var url22 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/gsnbczrz";
            $.ajax({
                type:"post",
                url:url22,
                data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
                dataType:"json",
                success:function (data) {
                    $("#gsnbczrz").text(data);
                },
                error:function () {

                }
            });
            //3、节点奖励(出账)
            var url33 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/jdjlcz";
            $.ajax({
                type:"post",
                url:url33,
                data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
                dataType:"json",
                success:function (data) {
                    $("#jdjlcz").text(data);
                },
                error:function () {

                }
            });
            //4、提现服务费(入账)
            var url44 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/txfwfrz";
            $.ajax({
                type:"post",
                url:url44,
                data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
                dataType:"json",
                success:function (data) {
                    $("#txfwfrz").text(data);
                },
                error:function () {

                }
            });
            //5、抽奖消耗(入账)
            var url55 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/cjxhrz";
            $.ajax({
                type:"post",
                url:url55,
                data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
                dataType:"json",
                success:function (data) {
                    $("#cjxhrz").text(data);
                },
                error:function () {

                }
            });
            //6、抽奖获得(出账)
            var url66 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/cjxhcz";
            $.ajax({
                type:"post",
                url:url66,
                data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
                dataType:"json",
                success:function (data) {
                    $("#cjxhcz").text(data);
                },
                error:function () {

                }
            });
            //7、任务奖励(出账)
            var url77 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/rwjlcz";
            $.ajax({
                type:"post",
                url:url77,
                data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
                dataType:"json",
                success:function (data) {
                    $("#rwjlcz").text(data);
                },
                error:function () {

                }
            });
            //8、大喇叭(入账)
            var url88 = "http://"+ip+"/fastadmin_revision1/public/admin/player/Companyprofit/dlbrz";
            $.ajax({
                type:"post",
                url:url88,
                data:{uid:"",wx_name:"",num:"",profit_time:"",time:"",finance_type:""},//
                dataType:"json",
                success:function (data) {
                    $("#dlbrz").text(data);
                },
                error:function () {

                }
            });

            //pfc充值记录总和
            var urlrecharge = "http://"+ip+"/fastadmin_revision1/public/admin/player/Pfcrecharge/sum";
            $.ajax({
                type:"post",
                url:urlrecharge,
                data:{uid:"",wx_name:"",account_id:"",asset_name:"",address_type:"",amount:"",seq:"",tx_from:"",tx_to:"",tx_hash:"",ts:"",time:""},
                dataType:"json",
                success:function (data) {
                    $("#pfcrechargenum").text(data);
                },
                error:function () {

                }
            });
            //计算有多少人充值了
            var urlrechargesumpeople = "http://"+ip+"/fastadmin_revision1/public/admin/player/Pfcrecharge/sumpeople";
            $.ajax({
                type:"post",
                url:urlrechargesumpeople,
                data:{uid:"",wx_name:"",account_id:"",asset_name:"",address_type:"",amount:"",seq:"",tx_from:"",tx_to:"",tx_hash:"",ts:"",time:""},
                dataType:"json",
                success:function (data) {
                    $("#pfcrechargesumpeople").text(data);
                },
                error:function () {

                }
            });

            //pfc提现记录总和
            var urlwidthdraw = "http://"+ip+"/fastadmin_revision1/public/admin/player/Pfcwithdraw/sum";
            $.ajax({
                type:"post",
                url:urlwidthdraw,
                data:{uid:"",wx_name:"",to_chain:"",in_asset_name:"",in_amount:"",out_asset_name:"",out_amount:"",seq:$("#seq").val(),txid:"",type:"",before_beans:"",before_extend_beans:"",with_amount:"",brokerage:"",after_beans:"",after_extend_beans:"",time:"",status:"",address:""},//
                dataType:"json",
                success:function (data) {
                    $("#pfcwidthdrawnum").text(data);
                },
                error:function () {

                }
            });

            form[0].reset();
            that.onCommonSearch();
        });

    };

    var createFormCommon = function (pColumns, that) {
        // 如果有使用模板则直接返回模板的内容
        if (that.options.searchFormTemplate) {
            return Template(that.options.searchFormTemplate, {columns: pColumns, table: that});
        }
        var htmlForm = [];
        htmlForm.push(sprintf('<form class="form-horizontal form-commonsearch" novalidate method="post" action="%s" >', that.options.actionForm));
        htmlForm.push('<fieldset>');
        if (that.options.titleForm.length > 0)
            htmlForm.push(sprintf("<legend>%s</legend>", that.options.titleForm));
        htmlForm.push('<div class="row">');
        for (var i in pColumns) {
            var vObjCol = pColumns[i];
            if (!vObjCol.checkbox && vObjCol.field !== 'operate' && vObjCol.searchable && vObjCol.operate !== false) {
                var query = Fast.api.query(vObjCol.field);
                var operate = Fast.api.query(vObjCol.field + "-operate");

                vObjCol.defaultValue = that.options.renderDefault && query ? query : (typeof vObjCol.defaultValue === 'undefined' ? '' : vObjCol.defaultValue);
                vObjCol.operate = that.options.renderDefault && operate ? operate : (typeof vObjCol.operate === 'undefined' ? '=' : vObjCol.operate);
                ColumnsForSearch.push(vObjCol);

                htmlForm.push('<div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-3">');
                htmlForm.push(sprintf('<label for="%s" class="control-label col-xs-4">%s</label>', vObjCol.field, vObjCol.title));
                htmlForm.push('<div class="col-xs-8">');

                vObjCol.operate = vObjCol.operate ? vObjCol.operate.toUpperCase() : '=';
                htmlForm.push(sprintf('<input type="hidden" class="form-control operate" name="%s-operate" data-name="%s" value="%s" readonly>', vObjCol.field, vObjCol.field, vObjCol.operate));

                var addClass = typeof vObjCol.addClass === 'undefined' ? (typeof vObjCol.addclass === 'undefined' ? 'form-control' : 'form-control ' + vObjCol.addclass) : 'form-control ' + vObjCol.addClass;
                var extend = typeof vObjCol.extend === 'undefined' ? '' : vObjCol.extend;
                var style = typeof vObjCol.style === 'undefined' ? '' : sprintf('style="%s"', vObjCol.style);
                extend = typeof vObjCol.data !== 'undefined' && extend == '' ? vObjCol.data : extend;
                if (vObjCol.searchList) {
                    if (typeof vObjCol.searchList === 'function') {
                        htmlForm.push(vObjCol.searchList.call(this, vObjCol));
                    } else {
                        var optionList = [sprintf('<option value="">%s</option>', that.options.formatCommonChoose())];
                        if (typeof vObjCol.searchList === 'object' && typeof vObjCol.searchList.then === 'function') {
                            (function (vObjCol, that) {
                                $.when(vObjCol.searchList).done(function (ret) {
                                    var searchList = [];
                                    if (ret.data && ret.data.searchlist && $.isArray(ret.data.searchlist)) {
                                        searchList = ret.data.searchlist;
                                    } else if (ret.constructor === Array || ret.constructor === Object) {
                                        searchList = ret;
                                    }
                                    var optionList = createOptionList(searchList, vObjCol, that);
                                    $("form.form-commonsearch select[name='" + vObjCol.field + "']", that.$container).html(optionList.join(''));
                                });
                            })(vObjCol, that);
                        } else {
                            optionList = createOptionList(vObjCol.searchList, vObjCol, that);
                        }
                        htmlForm.push(sprintf('<select class="%s" name="%s" %s %s>%s</select>', addClass, vObjCol.field, style, extend, optionList.join('')));
                    }
                } else {
                    var placeholder = typeof vObjCol.placeholder === 'undefined' ? vObjCol.title : vObjCol.placeholder;
                    var type = typeof vObjCol.type === 'undefined' ? 'text' : vObjCol.type;
                    var defaultValue = typeof vObjCol.defaultValue === 'undefined' ? '' : vObjCol.defaultValue;
                    if (/BETWEEN$/.test(vObjCol.operate)) {
                        var defaultValueArr = defaultValue.toString().match(/\|/) ? defaultValue.split('|') : ['', ''];
                        var placeholderArr = placeholder.toString().match(/\|/) ? placeholder.split('|') : [placeholder, placeholder];
                        htmlForm.push('<div class="row row-between">');
                        htmlForm.push(sprintf('<div class="col-xs-6"><input type="%s" class="%s" name="%s" value="%s" placeholder="%s" id="%s" data-index="%s" %s %s></div>', type, addClass, vObjCol.field, defaultValueArr[0], placeholderArr[0], vObjCol.field, i, style, extend));
                        htmlForm.push(sprintf('<div class="col-xs-6"><input type="%s" class="%s" name="%s" value="%s" placeholder="%s" id="%s" data-index="%s" %s %s></div>', type, addClass, vObjCol.field, defaultValueArr[1], placeholderArr[1], vObjCol.field, i, style, extend));
                        htmlForm.push('</div>');
                    } else {
                        htmlForm.push(sprintf('<input type="%s" class="%s" name="%s" value="%s" placeholder="%s" id="%s" data-index="%s" %s %s>', type, addClass, vObjCol.field, defaultValue, placeholder, vObjCol.field, i, style, extend));
                    }
                }

                htmlForm.push('</div>');
                htmlForm.push('</div>');
            }
        }
        htmlForm.push('<div class="form-group col-xs-12 col-sm-6 col-md-4 col-lg-3">');
        htmlForm.push(createFormBtn(that).join(''));
        htmlForm.push('</div>');
        htmlForm.push('</div>');
        htmlForm.push('</fieldset>');
        htmlForm.push('</form>');

        return htmlForm.join('');
    };

    var createFormBtn = function (that) {
        var htmlBtn = [];
        var searchSubmit = that.options.formatCommonSubmitButton();
        var searchReset = that.options.formatCommonResetButton();
        htmlBtn.push('<div class="col-sm-8 col-xs-offset-4">');
        htmlBtn.push(sprintf('<button type="submit" class="btn btn-success" formnovalidate>%s</button> ', searchSubmit));
        htmlBtn.push(sprintf('<button type="reset" class="btn btn-default" >%s</button> ', searchReset));
        htmlBtn.push('</div>');
        return htmlBtn;
    };

    var createOptionList = function (searchList, vObjCol, that) {
        var isArray = searchList.constructor === Array;
        var optionList = [];
        optionList.push(sprintf('<option value="">%s</option>', that.options.formatCommonChoose()));
        $.each(searchList, function (key, value) {
            if (value.constructor === Object) {
                key = value.id;
                value = value.name;
            } else {
                key = isArray ? value : key;
            }
            optionList.push(sprintf("<option value='" + key + "' %s>" + value + "</option>", key == vObjCol.defaultValue ? 'selected' : ''));
        });
        return optionList;
    };

    var isSearchAvailble = function (that) {

        //只支持服务端搜索
        if (!that.options.commonSearch || that.options.sidePagination != 'server' || !that.options.url) {
            return false;
        }

        return true;
    };

    var getSearchQuery = function (that, removeempty) {
        var op = {};
        var filter = {};
        var value = '';
        $("form.form-commonsearch .operate", that.$commonsearch).each(function (i) {
            var name = $(this).data("name");
            var sym = $(this).is("select") ? $("option:selected", this).val() : $(this).val().toUpperCase();
            var obj = $("[name='" + name + "']", that.$commonsearch);
            if (obj.size() == 0)
                return true;
            var vObjCol = ColumnsForSearch[i];
            var process = !that.options.searchFormTemplate && vObjCol && typeof vObjCol.process == 'function' ? vObjCol.process : null;
            if (obj.size() > 1) {
                if (/BETWEEN$/.test(sym)) {
                    var value_begin = $.trim($("[name='" + name + "']:first", that.$commonsearch).val()),
                        value_end = $.trim($("[name='" + name + "']:last", that.$commonsearch).val());
                    if (value_begin.length || value_end.length) {
                        if (process) {
                            value_begin = process(value_begin, 'begin');
                            value_end = process(value_end, 'end');
                        }
                        value = value_begin + ',' + value_end;
                    } else {
                        value = '';
                    }
                    //如果是时间筛选，将operate置为RANGE
                    if ($("[name='" + name + "']:first", that.$commonsearch).hasClass("datetimepicker")) {
                        sym = 'RANGE';
                    }
                } else {
                    value = $("[name='" + name + "']:checked", that.$commonsearch).val();
                    value = process ? process(value) : value;
                }
            } else {
                value = process ? process(obj.val()) : obj.val();
            }
            if (removeempty && (value == '' || value == null || ($.isArray(value) && value.length == 0)) && !sym.match(/null/i)) {
                return true;
            }

            op[name] = sym;
            filter[name] = value;
        });
        return {op: op, filter: filter};
    };

    var getQueryParams = function (params, searchQuery, removeempty) {
        params.filter = typeof params.filter === 'Object' ? params.filter : (params.filter ? JSON.parse(params.filter) : {});
        params.op = typeof params.op === 'Object' ? params.op : (params.op ? JSON.parse(params.op) : {});

        params.filter = $.extend({}, params.filter, searchQuery.filter);
        params.op = $.extend({}, params.op, searchQuery.op);
        //移除empty的值
        if (removeempty) {
            $.each(params.filter, function (i, j) {
                if ((j == '' || j == null || ($.isArray(j) && j.length == 0)) && !params.op[i].match(/null/i)) {
                    delete params.filter[i];
                    delete params.op[i];
                }
            });
        }
        params.filter = JSON.stringify(params.filter);
        params.op = JSON.stringify(params.op);
        return params;
    };

    $.extend($.fn.bootstrapTable.defaults, {
        commonSearch: false,
        titleForm: "Common search",
        actionForm: "",
        searchFormTemplate: "",
        searchFormVisible: true,
        searchClass: 'searchit',
        showSearch: true,
        renderDefault: true,
        onCommonSearch: function (field, text) {
            return false;
        },
        onPostCommonSearch: function (table) {
            return false;
        }
    });

    $.extend($.fn.bootstrapTable.defaults.icons, {
        commonSearchIcon: 'glyphicon-search'
    });

    $.extend($.fn.bootstrapTable.Constructor.EVENTS, {
        'common-search.bs.table': 'onCommonSearch',
        'post-common-search.bs.table': 'onPostCommonSearch'
    });
    $.extend($.fn.bootstrapTable.locales[$.fn.bootstrapTable.defaults.locale], {
        formatCommonSearch: function () {
            return "Common search";
        },
        formatCommonSubmitButton: function () {
            return "Submit";
        },
        formatCommonResetButton: function () {
            return "Reset";
        },
        formatCommonCloseButton: function () {
            return "Close";
        },
        formatCommonChoose: function () {
            return "Choose";
        }
    });

    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initHeader = BootstrapTable.prototype.initHeader,
        _initToolbar = BootstrapTable.prototype.initToolbar,
        _load = BootstrapTable.prototype.load,
        _initSearch = BootstrapTable.prototype.initSearch;

    BootstrapTable.prototype.initHeader = function () {
        _initHeader.apply(this, Array.prototype.slice.apply(arguments));
        this.$header.find('th[data-field]').each(function (i) {
            var column = $(this).data();
            if (typeof column['width'] !== 'undefined') {
                $(this).css("min-width", column['width']);
            }
        });
    };
    BootstrapTable.prototype.initToolbar = function () {
        _initToolbar.apply(this, Array.prototype.slice.apply(arguments));

        if (!isSearchAvailble(this)) {
            return;
        }

        var that = this,
            html = [];
        if (that.options.showSearch) {
            html.push(sprintf('<div class="columns-%s pull-%s" style="margin-top:10px;margin-bottom:10px;">', this.options.buttonsAlign, this.options.buttonsAlign));
            html.push(sprintf('<button class="btn btn-default%s' + '" type="button" name="commonSearch" title="%s">', that.options.iconSize === undefined ? '' : ' btn-' + that.options.iconSize, that.options.formatCommonSearch()));
            html.push(sprintf('<i class="%s %s"></i>', that.options.iconsPrefix, that.options.icons.commonSearchIcon))
            html.push('</button></div>');
        }
        if (that.$toolbar.find(".pull-right").size() > 0) {//alert(11);
            //搜索是根据form表单提交搜索和search自定义搜索合并的结果
            $('.pull-right input').bind('input propertychange', function() {
                $(".pull-right input[type=text]").each(function () {
                    $("#custom-search").val(this.value);
                    //alert(this.value);
                })
            });
            $(html.join('')).insertBefore(that.$toolbar.find(".pull-right:first"));
        } else {//alert(11);
            that.$toolbar.append(html.join(''));
        }

        initCommonSearch(that.columns, that);

        that.$toolbar.find('button[name="commonSearch"]')
            .off('click').on('click', function () {
            that.$commonsearch.toggleClass("hidden");
            return;
        });

        that.$container.on("click", "." + that.options.searchClass, function () {
            var obj = $("form [name='" + $(this).data("field") + "']", that.$commonsearch);
            if (obj.size() > 0) {
                var value = $(this).data("value");
                if (obj.is("select")) {
                    $("option[value='" + value + "']", obj).prop("selected", true);
                } else if (obj.size() > 1) {
                    $("form [name='" + $(this).data("field") + "'][value='" + value + "']", that.$commonsearch).prop("checked", true);
                } else {
                    obj.val(value);
                }
                obj.trigger("change");
                $("form", that.$commonsearch).trigger("submit");
            }
        });
        var queryParams = that.options.queryParams;
        //匹配默认搜索值
        this.options.queryParams = function (params) {
            return queryParams(getQueryParams(params, getSearchQuery(that, true)));
        };
        this.trigger('post-common-search', that);

    };

    BootstrapTable.prototype.onCommonSearch = function () {
        var searchQuery = getSearchQuery(this);
        this.trigger('common-search', this, searchQuery);
        this.options.pageNumber = 1;
        this.refresh({});
    };

    BootstrapTable.prototype.load = function (data) {
        _load.apply(this, Array.prototype.slice.apply(arguments));

        if (!isSearchAvailble(this)) {
            return;
        }
    };

    BootstrapTable.prototype.initSearch = function () {
        _initSearch.apply(this, Array.prototype.slice.apply(arguments));

        if (!isSearchAvailble(this)) {
            return;
        }

        var that = this;
        var fp = $.isEmptyObject(this.filterColumnsPartial) ? null : this.filterColumnsPartial;
        this.data = fp ? $.grep(this.data, function (item, i) {
            for (var key in fp) {
                var fval = fp[key].toLowerCase();
                var value = item[key];
                value = $.fn.bootstrapTable.utils.calculateObjectValue(that.header,
                    that.header.formatters[$.inArray(key, that.header.fields)],
                    [value, item, i], value);

                if (!($.inArray(key, that.header.fields) !== -1 &&
                        (typeof value === 'string' || typeof value === 'number') &&
                        (value + '').toLowerCase().indexOf(fval) !== -1)) {
                    return false;
                }
            }
            return true;
        }) : this.data;
    };
}(jQuery);
