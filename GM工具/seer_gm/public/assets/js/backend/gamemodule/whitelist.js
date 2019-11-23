define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'gamemodule/whitelist/index',
                    add_url: 'gamemodule/whitelist/add',
                    //edit_url: 'gamemodule/whitelist/edit',
                    del_url: 'gamemodule/whitelist/delBatch',
                    //multi_url: 'gamemodule/whitelist/delbatch',
                    table: 'user_list'
                }
            });

            var table = $("#table");
            var url1 = window.location.pathname+"?ref=addtabs";

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
                        {field: 'serverState', title: __('状态'),operate: 'LIKE'},
                        /*{
                            field: 'operate',
                            title: __('Operate'),
                            table: table,
                            events: Table.api.events.operate,
                            formatter: Table.api.formatter.operate
                        },
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: function (value, row, index) {
                            return '<a href="/admin/gamemodule/whitelist/del' + '" class="btn btn-xs btn-danger btn-delone" title=""><i class="fa fa-trash"></i></a> ';
                        }},*/
                        /*{field: 'uid', title: __('操作'), table: table, buttons: [
                            {name: 'detail', text: '删除', title: '删除',icon: 'fa fa-trash', classname: 'btn btn-xs btn-primary btn-dialog delOne',style:'background-color:red;', url: 'gamemodule/whitelist/del', callback:function(data){
                                parent.layer.closeAll();
                                parent.location.href="{:url('index')}";
                            }}
                        ], operate:true, formatter: Table.api.formatter.operate},*/
                        {field: 'uid', title: __('按钮'), table: table, buttons: [
                            {name: 'detail', text: '', title: '单个删除', icon: 'fa fa-trash', classname: "btn btn-xs btn-danger btn-delone {:$auth->check('gamemodule/whitelist/del')?'':'hide'}", url: 'gamemodule/whitelist/del', success:function(data, ret){
                                parent.location.href=url1;
                            }, error:function(){}}
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