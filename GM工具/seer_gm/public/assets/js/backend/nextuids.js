define(['jquery', 'bootstrap', 'backend', 'table', 'form'], function ($, undefined, Backend, Table, Form) {
    var id = $("#id").val();
    var Controller = {
        index: function () {
            // 初始化表格参数配置
            Table.api.init({
                extend: {
                    index_url: 'nextuids/index?id='+id,
                    multi_url: 'nextuids/multi',
                    table: 'user_list'
                }
            });
            //alert("游戏界面");
            var table = $("#table");

            // 初始化表格
            table.bootstrapTable({
                url: $.fn.bootstrapTable.defaults.extend.index_url,
                pk: 'uid',
                sortName: 'user_list.uid',
                columns: [
                    [
                        {checkbox: true},
                        {field: 'uid', title: __('游戏ID'), sortable: true,operate: 'LIKE',columns:2},
                        {field: 'wx_name', title: __('微信昵称'),operate: 'LIKE'},
                        {
                            field: 'next_uids',
                            title: __('下级玩家的集合'),
                            table: table,
                            formatter: function (value, row, index) {
                                var that = this;
                                return Table.api.formatter.buttons.apply(that, [value, row, index]);
                            },
                            buttons: [
                                {
                                    name: 'view',
                                    url: 'nextuids/index?id={ids}',
                                    text: '查看相关参数',
                                    icon: 'fa fa-eye',
                                    classname: 'btn btn-xs btn-warning btn-dialog'
                                }
                            ]
                        },
                        {field: 'profit', title: __('自己玩游戏产生的收益'),operate: 'LIKE'},
                        {field: 'pre_profit', title: __('上级代理的收益'),operate: 'LIKE'},
                        {field: 'pre_pre_profit', title: __('上上级代理收益'),operate: 'LIKE'},
                        {field: 'oneday_profit', title: __('每天给公司产生的收益'),operate: 'LIKE'},
                        {field: 'week_profit', title: __('每周产生的收益'),operate: 'LIKE'},
                        {field: 'all_profit', title: __('给公司产生的总收益'),operate: 'LIKE'},
                        {field: 'node_profit', title: __('节点奖励'),operate: 'LIKE'},
                        {field: 'withdraw_record', title: __('提现记录'),operate: 'LIKE'},
                        {field: 'head_pic', title: __('微信头像'), formatter: Table.api.formatter.image, operate: false},
                        {field: 'room_cards', title: __('钻石数量'),operate: 'LIKE'},
                        {field: 'beans', title: __('金贝数量'),operate: 'LIKE'},
                        {field: 'band_beans', title: __('银行金贝数量'),operate: 'LIKE'},
                        {field: 'regisder_time', title: __('注册时间'), formatter: Table.api.formatter.date, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'regisder_ip', title: __('注册IP'),operate: 'LIKE'},
                        {field: 'last_login_ip', title: __('最后登录IP地址'),operate: 'LIKE'},
                        {field: 'last_login_time', title: __('最后登陆时间'),formatter: Table.api.formatter.datetime, operate: 'RANGE', addclass: 'datetimerange', sortable: true},
                        {field: 'apply_time', title: __('最后登陆IP'),operate: 'LIKE'},
                        {field: 'cur_fixing', title: __('当前设备'),operate: 'LIKE'},
                        {field: 'is_control', title: __('是否存在监控列表中'),searchList: {0: __('否'), 1: __('是')}, formatter: Table.api.formatter.flag},
                        {field: 'last_login_city', title: __('最后登录城市'),operate: 'LIKE'},
                        {field: 'last_login_region', title: __('最后登录的省份'),operate: 'LIKE'},
                        {field: 'pfc_address', title: __('PFC充值地址'),operate: 'LIKE'}
                    ]
                ],
                pageSize: 15,
                pageList: [15, 25, 50, 'All'],
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