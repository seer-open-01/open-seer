define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'gamemodule/horseset/index',
                    //add_url: 'user/user/add',
                    edit_url: 'gamemodule/horseset/editts',
                    //del_url: 'user/user/del',
                    multi_url: 'gamemodule/horseset/multi',
                    table: 'notice_config'
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'notice_config.id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'playback_sequence', title: __('播放顺序'), sortable: true,operate: 'LIKE'},
                        {field: 'content', title: __('内容'),operate: 'LIKE'},
                        {field: 'whether', title: __('状态'),operate: 'LIKE'},
                        {field: 'start_time', title: __('开始时间'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'end_time', title: __('结束时间'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        //{field: 'playback_interval', title: __('时隔秒数'),operate: 'LIKE'},
                        /*{field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate},*/
                        {field: 'uid', title: __('操作'), table: table, buttons: [
                            {name: 'detail', text: '编辑', title: '编辑',icon: 'fa fa-pencil', classname: 'btn btn-xs btn-primary btn-dialog', url: 'gamemodule/horseset/edit', callback:function(data){}}
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