define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {

    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'gamemodule/gamecard/index',
                    //del_url: 'gamemodule/gamecard/set',
                    multi_url: 'gamemodule/gamecard/multi',
                    table: 'game_card'
                }
            });

            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'id',
                sortName: 'game_card.id',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'id', title: __('卡号'), sortable: true,operate: 'LIKE'},
                        {field: 'uid', title: __('玩家uid'),operate: 'LIKE'},
                        {field: 'card_number1', title: __('序列号'),operate: 'LIKE'},
                        {field: 'batch', title: __('批次'),operate: 'LIKE'},
                        {field: 'generation_time', title: __('游戏卡生成时间'),operate: 'LIKE'},
                        {field: 'whether', title: __('状态'),operate: 'LIKE'}
                    ]
                ],
                showExport: true
            });

            // 为表格绑定事件
            Table.api.bindevent(table);

            // 监听事件
            $(document).on("click", ".btn-myexcel-export", function () { //监听刚刚的按钮btn-myexcel-export的动作
                var myexceldata=table.bootstrapTable('getSelections');//获取选中的项目的数据 格式是json
                myexceldata=JSON.stringify(myexceldata);//数据转成字符串作为参数
                //直接url访问，不能使用ajax，因为ajax要求返回数据，和PHPExcel一会浏览器输出冲突！将数据作为参数
                //top.location.href="gamecard/export";
                var msg = '确定是否要导出数据为Excel表，导出数据大的话可能会花费一些时间，在未导出成功之前请勿对页面进行任何操作!';
                var msgcolor = '<span style="color: red;">'+msg+'</span>';
                parent.layer.alert(msgcolor, {
                         skin: 'layui-layer-molv' //样式类名  自定义样式
                     ,closeBtn: 1    // 是否显示关闭按钮
                     ,anim: 1 //动画类型
                     ,btn: ['确定','取消'] //按钮
                     ,icon: 6    // icon
                     ,yes:function(){
                         //layer.msg('点击的是确定导出按钮')
                         parent.layer.closeAll();
                         top.location.href="gamecard/export";
                     }
                     ,btn2:function(){
                          //layer.msg('点击的是取消按钮')
                            parent.layer.closeAll();
                     }});
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