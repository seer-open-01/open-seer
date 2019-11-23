define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'player/Companyprofit/index',
                    multi_url: 'player/companyprofit/multi',
                    table: 'company_profit'
                }
            });
            //alert("游戏界面");
            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'company_profit.uid',
                sortName: 'company_profit.uid',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'category.wx_name', title: __('微信名'),operate: 'LIKE'},
                        {field: 'uid', title: __('游戏ID'), sortable: true,operate: 'LIKE'},
                        {field: 'num', title: __('服务费'),operate: 'LIKE'},
                        {field: 'profit_time', title: __('游戏产生服务费时间'),formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'time', title: __('公司其他支出时间'),formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'finance_type', title: __('财务类型'), searchList: {1: __('比赛服务费(入账)'), 2: __('公司内部充值(入账)') ,3: __('节点奖励(出账)'),4: __('提现服务费(入账)'),5: __('抽奖消耗(入账)'),6: __('抽奖获得(出账)'),7: __('任务奖励(出账)'),8: __('大喇叭(入账)')}, formatter: Table.api.formatter.flag}
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