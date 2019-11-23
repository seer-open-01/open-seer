define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'player/monitor/index',
                    add_url: 'player/monitor/add',
                    del_url: 'player/monitor/del',
                    multi_url: 'player/monitor/multi',
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
                        {field: 'uid', title: __('游戏ID'), sortable: true,operate: 'LIKE'},
                        {field: 'wx_name', title: __('微信昵称'),operate: 'LIKE'},
                        {field: 'room_cards', title: __('房卡数量'),operate: 'LIKE'},
                        {field: 'diamonds', title: __('钻石数量'),operate: 'LIKE'},
                        {field: 'beans', title: __('金贝数量'),operate: 'LIKE'},
                        {field: 'band_beans', title: __('银行金贝数量'),operate: 'LIKE'},
                        {field: 'regisder_time', title: __('注册时间'), formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'regisder_ip', title: __('注册IP'),operate: 'LIKE'},
                        {field: 'last_login_time', title: __('最后登陆时间'),formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'apply_time', title: __('最后登陆IP'),operate: 'LIKE'},
                        {field: 'cur_fixing', title: __('当前设备'),operate: 'LIKE'}
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