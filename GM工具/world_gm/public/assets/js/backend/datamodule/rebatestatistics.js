define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'datamodule/rebatestatistics/index',
                    multi_url: 'datamodule/rebatestatistics/multi',
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
                        /*{field: 'id', title: __('茶馆ID'), sortable: true,operate: 'LIKE'},*/
                        {field: 'tea_house_name', title: __('茶馆名称'),operate: 'LIKE'},
                        {field: 'house_master_time', title: __('茶馆创建时间'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'uid', title: __('游戏ID'),operate: 'LIKE',sortable: true},
                        {field: 'wx_name', title: __('游戏昵称'),operate: 'LIKE'},
                        {field: 'regisder_time', title: __('账号注册时间'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'pre_uid', title: __('直属上级馆主ID'),operate: 'LIKE'},
                        {field: 'profit', title: __('玩家收益'),operate: false},
                        {field: 'pre_profit', title: __('一级代理收益'),operate: false},
                        {field: 'pre_pre_profit', title: __('二级代理收益'),operate: false},
                        {field: 'sum', title: __('合计收益'),operate:false}
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