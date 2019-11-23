define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'gamemodule/usegoods/index',
                    del_url: 'gamemodule/usegoods/set',
                    multi_url: 'gamemodule/usegoods/multi',
                    table: 'use_goods'
                }
            });
            var test = $("#test").val();
            //alert("这是使用物品数据界面,数据为:"+test);
            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'use_goods.id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('序号'), sortable: true,operate: 'LIKE',columns:2},
                        {field: 'order_id', title: __('订单号'),operate: 'LIKE'},
                        {field: 'uid', title: __('使用者的uid'),operate: 'LIKE'},
                        {field: 'whether1', title: __('使用的物品id'),operate: 'LIKE'},
                        {field: 'good_num', title: __('使用的物品数量'),operate: 'LIKE'},
                        {field: 'use_time', title: __('使用时间'),operate: 'LIKE'},
                        {field: 'param', title: __('其他关联的参数'),operate: 'LIKE'},
                        {field: 'descript', title: __('商品使用描述'),operate: 'LIKE'},
                        {field: 'whether', title: __('审核状态'),operate: 'LIKE'},
                        {field: 'complete_time', title: __('审核完成时间'), formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'faile_reason', title: __('失败原因'),operate: 'LIKE'},
                        {field: 'last_login_time', title: __('最后登陆时间'),formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'uid', title: __('操作'), table: table, buttons: [
                                {name: 'detail', text: '审核', title: '审核',icon: 'fa fa-pencil', classname: 'btn btn-xs btn-primary btn-dialog', url: 'gamemodule/usegoods/edit', callback:function(data){}}
                            ], operate:false, formatter: Table.api.formatter.buttons}
                    ]
                ],
                pageSize: 15,
                pageList: [15, 25, 50, 'All'],
                sortOrder:"uid asc",
                showExport: false
            });

            // 为表格绑定事件
            Table.api.bindevent(table);
        },
        add: function () {
            Controller.api.bindevent();
        },
        edit: function () {
            Controller.api.bindevent();
        },
        api: {
            bindevent: function () {
                Form.api.bindevent($("form[role=form]"));
            }
        }
    };
    return Controller;
});