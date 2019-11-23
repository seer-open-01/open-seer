define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'gamemodule/phone/index',
                    //add_url: 'user/user/add',
                    edit_url: 'gamemodule/phone/editts',
                    //del_url: 'user/user/del',
                    multi_url: 'gamemodule/phone/multi',
                    table: 'phone_card'
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'phone_card.id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('序号'), sortable: true,operate: 'LIKE'},
                        {field: 'order_id', title: __('订单号'),operate: 'LIKE'},
                        {field: 'uid', title: __('玩家uid'),operate: 'LIKE'},
                        {field: 'wx_name', title: __('微信名称'),operate: 'LIKE'},
                        {field: 'phone', title: __('充值电话号码'),operate: 'LIKE'},
                        {field: 'rmb', title: __('充值的金额'),operate: 'LIKE'},
                        {field: 'whether', title: __('状态'),operate: 'LIKE'},
                        {field: 'start_time', title: __('开始时间'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'end_time', title: __('结束时间'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'id', title: __('操作'), table: table, buttons: [
                                {name: 'detail', text: '编辑', title: '编辑',icon: 'fa fa-pencil', classname: 'btn btn-xs btn-primary btn-dialog', url: 'gamemodule/phone/edit', callback:function(data){}}
                            ], operate:false, formatter: Table.api.formatter.buttons}
                    ]
                ],
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