define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'player/bindphone/index',
                    multi_url: 'player/bindphone/multi',
                    table: 'authtell_log'
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'uid',
                sortName: 'authtell_log.uid',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'uid', title: __('游戏ID'), sortable: true,operate: 'LIKE'},
                        {field: 'user_name', title: __('微信昵称'),operate: 'LIKE'},
                        {field:'tell',title: __('手机号码'),operate: 'LIKE'},
                        {field: 'add_time', title: __('绑定时间'),formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true}
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