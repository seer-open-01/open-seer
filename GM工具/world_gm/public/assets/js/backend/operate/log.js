define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'operate/log/index',
                    multi_url: 'operate/log/multi',
                    table: 'operation_log'
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'operation_log.id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('管理员ID'), sortable: true,operate: 'LIKE'},
                        {field: 'username', title: __('管理员姓名'),operate: 'LIKE'},
                        {field: 'operation_time', title: __('上次登录时间'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'username', title: __('上次登录IP'),operate: 'LIKE'},
                        {field: 'tname', title: __('操作内容'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'username', title: __('玩家ID'),operate: 'LIKE'},
                        {field: 'content', title: __('操作日志'),operate: 'LIKE'},
                        {field: 'operation_time', title: __('操作时间'),operate: 'LIKE'}
                    ]
                ],
                showExport: false
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

            // 监听事件
            $(document).on("click", ".btn-myexcel-export", function () { //监听刚刚的按钮btn-myexcel-export的动作
                var myexceldata=table.bootstrapTable('getSelections');//获取选中的项目的数据 格式是json
                myexceldata=JSON.stringify(myexceldata);//数据转成字符串作为参数
                //直接url访问，不能使用ajax，因为ajax要求返回数据，和PHPExcel一会浏览器输出冲突！将数据作为参数
                top.location.href="log/exportOrderExcel?data="+myexceldata;
            });

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