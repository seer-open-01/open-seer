define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'gamemodule/shopset/index',
                    //add_url: 'user/user/add',
                    edit_url: 'gamemodule/shopset/edit',
                    //del_url: 'user/user/del',
                    multi_url: 'gamemodule/shopset/multi',
                    table: 'shop_config'
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'itemId',
                sortName: 'shop_config.itemId',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'itemId', title: __('商品编号'), sortable: true,operate: 'LIKE'},
                        {field: 'whether', title: __('当前商品状态'),operate: 'LIKE'},
                        {field: 'cards', title: __('房卡数量'),operate: 'LIKE'},
                        {field: 'giveBean', title: __('赠送金贝'),operate: 'LIKE'},
                        {field: 'rmbPrice', title: __('人民币价格'),operate: 'LIKE'},
                        {field: 'giveDiamond', title: __('赠送钻石'),operate: 'LIKE'},
                        /*{field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}*/
                        {field: 'uid', title: __('操作'), table: table, buttons: [
                            {name: 'detail', text: '编辑', title: '编辑',icon: 'fa fa-pencil', classname: 'btn btn-xs btn-primary btn-dialog', url: 'gamemodule/shopset/edit', callback:function(data){}}
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