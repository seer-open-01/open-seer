define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'gamemodule/xiangqi/index',
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
                        {field: 'uid', title: __('玩家id'), sortable: true,operate: 'LIKE'},
                        {field: 'wx_name', title: __('微信昵称'),operate: 'LIKE'},
                        {field: 'whether', title: __('场次名称')},
                        {field: 'round_id', title: __('牌局号'),operate: 'LIKE'},
                        {field: 'cur_round', title: __('当前局'),operate: 'LIKE'},
                        {field: 'whether1', title: __('关联物品名称'),operate: 'LIKE'},
                        {field: 'num', title: __('关联物品数量'),operate: 'LIKE'},
                        {field: 'plus_cards', title: __('剩余房卡'),operate: 'LIKE'},
                        {field: 'plus_beans', title: __('剩余金豆'),operate: 'LIKE'},
                        {field: 'plus_diamonds', title: __('剩余钻石'),operate: 'LIKE'},
                        {field: 'whether2', title: __('事件名称'),operate: 'LIKE'},
                        {field: 'time', title: __('时间'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true}
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