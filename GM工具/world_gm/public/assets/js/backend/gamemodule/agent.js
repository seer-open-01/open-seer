define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'gamemodule/agent/index',
                    del_url: 'gamemodule/agent/set',
                    multi_url: 'gamemodule/agent/multi',
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
                        {field: 'phone_number', title: __('手机号码'),operate: 'LIKE'},
                        {field: 'tea_house_name', title: __('所属茶楼'),operate: 'LIKE'},
                        {field: 'pre_uid', title: __('上级馆主ID'),operate: 'LIKE'},
                        {field: 'room_cards', title: __('房卡数量'),operate: 'LIKE'},
                        {field: 'diamonds', title: __('钻石数量'),operate: 'LIKE'},
                        {field: 'beans', title: __('金贝数量'),operate: 'LIKE'},
                        {field: 'band_beans', title: __('银行金贝数量'),operate: 'LIKE'},
                        {field: 'regisder_time', title: __('注册时间'), formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'regisder_ip', title: __('注册IP'),operate: 'LIKE'},
                        {field: 'last_login_time', title: __('最后登陆时间'),formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'apply_time', title: __('最后登陆IP'),operate: 'LIKE'},
                        {field: 'cur_fixing', title: __('当前设备'),operate: 'LIKE'},
                        //{field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate},
                        /*{field: 'uid', title: __('按钮'), table: table, buttons: [
                                {name: 'detail', text: '', title: '设置代理', icon: 'fa fa-magic', classname: "btn btn-xs btn-danger btn-delone {:$auth->check('gamemodule/agent/set')?'':'hide'}", url: 'gamemodule/agent/set', success:function(data, ret){
                                        parent.location.href=url1;
                                    }, error:function(){}}
                            ], operate:false, formatter: Table.api.formatter.buttons}*/
                    ]
                ],
                showExport: true
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