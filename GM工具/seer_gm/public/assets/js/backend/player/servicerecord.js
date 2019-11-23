define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'player/servicerecord/index',
                    multi_url: 'player/servicerecord/multi',
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
                        {field:'match_id',title: __('游戏场次'),operate: 'LIKE'},
                        {field: 'num', title: __('服务费'),operate: 'LIKE'},
                        {field: 'plus_diamonds', title: __('剩余金豆'),operate: 'LIKE'},
                        {field: 'time', title: __('游戏时间'),operate: 'LIKE',formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true}
                    ]
                ],
                pageSize: 15,
                pageList: [15, 25, 50, 'All'],
                showExport: true,
                search: false,
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