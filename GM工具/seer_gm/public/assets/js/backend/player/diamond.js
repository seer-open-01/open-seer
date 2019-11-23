define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'player/diamond/index',
                    multi_url: 'player/diamond/multi',
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
                        {field:'name',title: __('原因'),operate: 'LIKE'},
                        {field: 'num', title: __('消耗数量'),operate: 'LIKE'},
                        {field: 'plus_diamonds', title: __('剩余数量'),operate: 'LIKE'},
                        {field: 'time', title: __('消耗时间'),operate: 'LIKE',formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true}
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