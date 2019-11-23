define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'player/Pfcrecharge/index',
                    multi_url: 'player/Pfcrecharge/multi',
                    table: 'pfc_recharge_log'
                }
            });
            //alert("游戏界面");
            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'pfc_recharge_log.uid',
                sortName: 'pfc_recharge_log.uid',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'category.wx_name', title: __('微信名'),operate: 'LIKE'},
                        {field: 'uid', title: __('游戏ID'), sortable: true,operate: 'LIKE'},
                        {field: 'account_id', title: __('玩家账户'),operate: 'LIKE'},
                        {field: 'asset_name', title: __('资产名称'),operate: 'LIKE'},
                        {field: 'address_type', title: __('地址类型'),operate: 'LIKE'},
                        {field: 'amount', title: __('充值数量'),operate: 'LIKE'},
                        {field: 'seq', title: __('订单号'),operate: 'LIKE'},
                        {field: 'tx_from', title: __('交易中的源地址'),operate: 'LIKE'},
                        {field: 'tx_to', title: __('交易中的目的地址'),operate: 'LIKE'},
                        {field: 'tx_hash', title: __('交易的hash'),operate: 'LIKE'},
                        {field: 'ts', title: __('交易时的时间戳'),operate: 'LIKE'},
                        {field: 'time', title: __('本条记录存储的时间'),formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true}
                    ]
                ],
                pageSize: 15,
                pageList: [15, 25, 50, 'All'],
                showExport: true,
                search:false
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