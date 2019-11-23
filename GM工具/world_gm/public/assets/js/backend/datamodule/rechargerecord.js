define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'datamodule/rechargerecord/index',
                    //add_url: 'user/user/add',
                    //del_url: 'user/user/del',
                    multi_url: 'datamodule/rechargerecord/multi',
                    table: 'goods_log'
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'uid',
                sortName: 'goods_log.uid',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'uid', title: __('游戏ID'), sortable: true,operate: 'LIKE'},
                        {field: 'wx_name', title: __('微信昵称'),operate: 'LIKE'},
                        {field: 'whether', title: __('充值方式'),operate: 'LIKE'},
                        {field: 'order_number', title: __('订单号'),operate: 'LIKE'},
                        {field: 'recharge_amount', title: __('充值金额'),operate: 'LIKE'},
                        {field: 'pre_recharge_cards', title: __('充值前房卡'),operate: 'LIKE'},
                        {field: 'after_recharge_cards', title: __('充值后房卡'),operate: 'LIKE'},
                        {field: 'pre_recharge_diamonds', title: __('充值前钻石'),operate: 'LIKE'},
                        {field: 'after_recharge_diamonds', title: __('充值后钻石'),operate: 'LIKE'},
                        {field: 'pre_recharge_beans', title: __('充值前金贝'),operate: 'LIKE'},
                        {field: 'after_recharge_beans', title: __('充值后金贝'),operate: 'LIKE'},
                        {field: 'purchase_time', title: __('购买时间'),operate: 'LIKE'},
                        {field: 'payment_time', title: __('到账时间'),operate: 'LIKE'},
                        {field: 'whether1', title: __('购买状态'),operate: 'LIKE'}
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