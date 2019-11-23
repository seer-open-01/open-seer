define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'player/Pfcwithdraw/index',
                    multi_url: 'player/Pfcwithdraw/multi',
                    table: 'pfc_withdraw_log'
                }
            });
            //alert("游戏界面");
            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'pfc_withdraw_log.uid',
                sortName: 'pfc_withdraw_log.uid',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'category.wx_name', title: __('微信名'),operate: 'LIKE'},
                        {field: 'uid', title: __('游戏ID'), sortable: true,operate: 'LIKE'},
                        {field: 'to_chain', title: __('资产提现到的区块链'),operate: 'LIKE'},
                        {field: 'in_asset_name', title: __('进区块链名称'),operate: 'LIKE'},
                        {field: 'in_amount', title: __('提现金额'),operate: 'LIKE'},
                        {field: 'out_asset_name', title: __('转出资产名称'),operate: 'LIKE'},
                        {field: 'out_amount', title: __('网关实际转出金额'),operate: 'LIKE'},
                        {field: 'seq', title: __('提现编号'),operate: 'LIKE'},
                        {field: 'txid', title: __('转账交易ID'),operate: 'LIKE'},
                        {field: 'type', title: __('财务类型'), searchList: {1: __('金豆提现'), 2: __('推广提现')}, formatter: Table.api.formatter.flag},
                        {field: 'before_beans', title: __('提现前玩家身上的金豆数量'),operate: 'LIKE'},
                        {field: 'before_extend_beans', title: __('提现前玩家身上推广金豆数量'),operate: 'LIKE'},
                        {field: 'with_amount', title: __('提现金豆数'),operate: 'LIKE'},
                        {field: 'brokerage', title: __('手续费'),operate: 'LIKE'},
                        {field: 'after_beans', title: __('提现后身上金豆数量'),operate: 'LIKE'},
                        {field: 'after_extend_beans', title: __('提现后推广剩余金豆数量'),operate: 'LIKE'},
                        {field: 'time', title: __('时间'),formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'status', title: __('订单状态'), searchList: {0: __('未完成'), 1: __('已完成')}, formatter: Table.api.formatter.flag},
                        {field: 'address', title: __('提现地址'),operate: 'LIKE'}
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