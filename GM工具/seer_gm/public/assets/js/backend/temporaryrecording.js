define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'temporaryrecording/index',
                    multi_url: 'temporaryrecording/multi',
                    table: 'temporary_recording'
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'temporary_recording.id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'time', title: __('时间'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'content', title: __('内容'),operate: 'LIKE'},
                        {field: 'playback_number', title: __('播放次数'),operate: 'LIKE',sortable: true},
                        {field: 'username', title: __('操作人'),operate: 'LIKE'},
                        {field: 'log', title: __('操作日志'),operate: 'LIKE'}
                    ]
                ],
                search: true,
                commonSearch: true,
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