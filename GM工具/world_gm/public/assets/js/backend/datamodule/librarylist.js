define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'datamodule/librarylist/index',
                    edit_url: 'datamodule/librarylist/edit',
                    multi_url: 'datamodule/librarylist/multi',
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
                        /*{field: 'tea_house_name', title: __('茶馆ID'), sortable: true,operate: 'LIKE'},*/
                        {field: 'tea_house_name', title: __('茶馆名称'),operate: 'LIKE'},
                        {field: 'uid', title: __('游戏ID'),operate: 'LIKE'},
                        {field: 'phone_number', title: __('电话号码'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'real_name', title: __('姓名'),formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'wx_name', title: __('游戏昵称'),operate: 'LIKE'},
                        {field: 'wx_number', title: __('微信号'),operate: 'LIKE'},
                        //{field: 'wx_name', title: __('微信头像'),operate: 'LIKE'},
                        {field: 'head_pic', title: __('微信头像'), formatter: Table.api.formatter.image, operate: false},
                        {field: 'whether', title: __('等级'),operate: 'LIKE'},
                        {field: 'pre_uid', title: __('上级馆主ID'),operate: 'LIKE'},
                        {field: 'cash_today_count', title: __('可提现次数'),operate: 'LIKE'},
                        {field: 'wx_name', title: __('总返利额'),operate: 'LIKE'},
                        {field: 'wx_name', title: __('待提现额'),operate: 'LIKE'},
                        {field: 'whether1', title: __('提现方式'),operate: 'LIKE'},
                        {field: 'operate', title: __('Operate'), table: table, events: Table.api.events.operate, formatter: Table.api.formatter.operate}
                    ]
                ],
                exportDataType: 'selected',
                showExport: false
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

            // 监听事件
            $(document).on("click", ".btn-myexcel-export", function () { //监听刚刚的按钮btn-myexcel-export的动作
                var myexceldata=table.bootstrapTable('getSelections');//获取选中的项目的数据 格式是json
                myexceldata=JSON.stringify(myexceldata);//数据转成字符串作为参数
                //直接url访问，不能使用ajax，因为ajax要求返回数据，和PHPExcel一会浏览器输出冲突！将数据作为参数
                top.location.href="librarylist/exportOrderExcel?data="+myexceldata;
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