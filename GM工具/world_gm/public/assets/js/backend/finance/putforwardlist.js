define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'finance/putforwardlist/index',
                    table: 'user_list'
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'uid',
                sortName: 'user_list.uid',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'wx_name', title: __('馆主ID'), sortable: true,operate: 'LIKE'},
                        {field: 'wx_name', title: __('微信昵称'),operate: 'LIKE'},
                        {field: 'uid', title: __('馆主姓名'),operate: 'LIKE'},
                        {field: 'phone_number', title: __('茶馆ID'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'real_name', title: __('茶馆名称'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'order_number', title: __('订单号'),operate: 'LIKE'},
                        {field: 'whether1', title: __('订单状态'),operate: 'LIKE'},
                        {field: 'order_money', title: __('订单金额'),operate: 'LIKE'},
                        {field: 'cash_withdraw', title: __('已经提现的金额'),operate: 'LIKE'},
                        {field: 'whether', title: __('提现方式'),operate: 'LIKE'},
                        {field: 'wx_name', title: __('银行名称'),operate: 'LIKE'},
                        {field: 'bank_card', title: __('银行卡号'),operate: 'LIKE'},
                        {field: 'bank_username', title: __('开户人姓名'),operate: 'LIKE'},
                        {field: 'phone_number', title: __('联系手机号'),operate: 'LIKE'},
                        {field: 'apply_time', title: __('申请时间'),operate: 'LIKE'},
                        {field: 'uid', title: __('操作'), table: table, buttons: [
                            {name: 'detail', text: '查看', title: '提现详情',icon: 'fa fa-pencil', classname: 'btn btn-xs btn-primary btn-dialog', url: 'finance/putforwardlist/see', callback:function(data){}}
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