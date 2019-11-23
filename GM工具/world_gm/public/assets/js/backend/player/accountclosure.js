define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'player/accountclosure/index',
                    edit_url: 'player/accountclosure/edit',
                    multi_url: 'player/accountclosure/multi',
                    table: 'account_closure'
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'uid',
                sortName: 'account_closure.uid',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'uid', title: __('游戏ID'), sortable: true,operate: 'LIKE'},
                        {field: 'wx_name', title: __('微信昵称'),operate: 'LIKE'},
                        {field: 'diamonds', title: __('钻石数量'),operate: 'LIKE'},
                        {field: 'beans', title: __('金豆数量'),operate: 'LIKE'},
                        {field: 'band_beans', title: __('保险箱金豆'),operate: 'LIKE'},
                        {field: 'regisder_time', title: __('注册时间'), formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'regisder_ip', title: __('注册IP'),operate: 'LIKE'},
                        {field: 'last_login_time', title: __('最后登陆时间'),formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'last_login_ip', title: __('最后登陆IP'),operate: 'LIKE'},
                        {field: 'cur_fixing', title: __('当前设备'),operate: 'LIKE'},
                        {field: 'whether', title: __('禁止登陆'),operate: 'LIKE'},
                        {field: 'whether1', title: __('禁止游戏'),operate: 'LIKE'},
                        {field: 'whether2', title: __('立即踢下线'),operate: 'LIKE'},
                        {field: 'create_time', title: __('最后操作状态日期'),operate: 'LIKE'},
                        {field: 'uid', title: __('操作'), table: table, buttons: [
                        {name: 'detail', text: '编辑', title: '编辑',icon: 'fa fa-pencil', classname: 'btn btn-xs btn-primary btn-dialog', url: 'player/accountclosure/edit', callback:function(data){}},
                        {name: 'detail', text: '移除', title: '移除',icon: 'fa fa-trash', classname: 'btn btn-xs btn-primary btn-dialog',style:'background-color:red;', url: 'player/accountclosure/del', callback:function(data){}}
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

/**
 *
 *{field: 'id', title: __('按钮'), table: table, buttons: [
    {name: 'detail', text: '弹窗', title: '弹窗标题', icon: 'fa fa-list', classname: 'btn btn-xs btn-primary btn-dialog', url: 'page/detail', callback:function(data){}},
    {name: 'detail', text: 'Ajax', title: 'Ajax标题', icon: 'fa fa-flash', classname: 'btn btn-xs btn-success btn-ajax', url: 'page/detail', success:function(data, ret){}, error:function(){}},
    {name: 'detail', text: '选项卡', title: '选项卡标题', icon: 'fa fa-flash', classname: 'btn btn-xs btn-info btn-addtabs', url: 'page/detail'}
], operate:false, formatter: Table.api.formatter.buttons}
 * 
 */