layui.use(['table'], function () {
    $('#StopJobDetailMenu').addClass('active');
    $('#StopJobDetailMenu').parent().addClass('menu-open');
    $('#StopJobDetailMenu').parent().parent().addClass('menu-open');
    $('#jobManage').addClass('active');
    updateStopTable()
    if ($('#stopJobStatus').val() == "stop" || $('#stopJobStatus').val() == "disabled") {
        $('#stopHistoryJobTable').bootstrapTable('destroy')
        var TableInit = function () {
            var oTableInit = new Object();
            oTableInit.init = function () {
                var table = $('#stopHistoryJobTable');
                table.bootstrapTable({
                    url: base_url + '/jobManage/findStopJobHistoryByStatus',
                    method: 'get',
                    pagination: true,
                    cache: false,
                    clickToSelect: true,
                    toolTip: "",
                    striped: false,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    pageNumber: 1,              //初始化加载第一页，默认第一页
                    pageSize: 20,                //每页的记录行数（*）
                    pageList: [40, 60, 80],
                    queryParams: stopParams,
                    search: true,
                    uniqueId: 'id',
                    sidePagination: "client",
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    onClickRow: function (row) {
                        // console.log(row)
                        $('#stopRunningLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#stopJobLog').modal('show');
                    },
                    columns: [
                        {
                            field: '',
                            title: '序号',
                            formatter: function (val, row, index) {
                                return index + 1;
                            },
                            width: "1%"
                        }, {
                            field: 'id',
                            title: '任务ID',
                            formatter: function (val) {
                                return '<a href = "#">' + val + '</a>';
                            },
                            width: "1%",
                            sortable: true
                        }, {
                            field: 'name',
                            title: '任务名称',
                            sortable: true
                        },
                        {
                            field: 'description',
                            title: '任务描述',
                            sortable: true
                        },

                        {
                            field: 'gmtCreate',
                            title: '创建时间',
                            formatter: function (val) {
                                return getLocalTime(val);
                            },
                            sortable: true
                        },
                        {
                            field: 'gmtModified',
                            title: '更新时间',
                            formatter: function (val) {
                                return getLocalTime(val);
                            },
                            sortable: true
                        },
                        {
                            field: 'owner',
                            title: '创建人',
                            sortable: true
                        },


                        {
                            field: 'dependencies',
                            title: '依赖的任务id',
                            sortable: true
                        },
                        {
                            field: 'runType',
                            title: '任务类型',
                            sortable: true
                        },
                    ],
                    // data:info.data
                });
            }
            // oTableInit= new Object();
            return oTableInit;
        }
        var oTable = new TableInit();
        oTable.init();
        $('#stopHistoryJobTable').bootstrapTable('hideLoading');
        function stopParams(params) {
            var temp = {
                status: $('#stopJobStatus').val(),
            };
            return temp;
        }
    }
    else if ($('#stopJobStatus').val() == "noRun") {
        $('#stopHistoryJobTable').bootstrapTable('destroy')
        var TableInit = function () {
            var oTableInit = new Object();
            oTableInit.init = function () {
                var table = $('#stopHistoryJobTable');
                table.bootstrapTable({
                    url: base_url + '/jobManage/findNoRunJobHistoryByStatus',
                    method: 'get',
                    pagination: true,
                    cache: false,
                    clickToSelect: true,
                    toolTip: "",
                    striped: false,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    pageNumber: 1,              //初始化加载第一页，默认第一页
                    pageSize: 20,                //每页的记录行数（*）
                    pageList: [40, 60, 80],
                    queryParams: noRunParams,
                    search: true,
                    uniqueId: 'jobId',
                    sidePagination: "client",
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    onClickRow: function (row) {
                        // console.log(row)
                        $('#stopRunningLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#stopJobLog').modal('show');
                    },
                    columns: [
                        {
                            field: '',
                            title: '序号',
                            formatter: function (val, row, index) {
                                return index + 1;
                            },
                            width: "3%"
                        }, {
                            field: 'jobId',
                            title: '任务ID',
                            formatter: function (val) {
                                return '<a href = "#">' + val + '</a>';
                            },
                            width: "3%",
                            sortable: true
                        },{
                            field: 'id',
                            title: '版本号',
                            width: "15%",
                            sortable: true
                        },
                        {
                            field: 'name',
                            title: '任务名称',
                        }, {
                            field: 'description',
                            title: '任务描述',
                        },
                        /*{
                         field: 'jobDependencies',
                         title: '上游依赖',
                         /!*formatter: function (val) {
                         val=val.replace(/,/g,"\n");
                         return val;
                         },*!/
                         // width: "4%",
                         },
                         /!*{
                         field: 'jobDependencies',
                         title: 'jobDependencies',
                         },*!/
                         {
                         field: 'readyDependency',
                         title: '已完成依赖',
                         formatter: function (val) {
                         return getLocalTime(val);
                         },

                         },*/
                        /*{
                         field: 'statisticEndTime',
                         title: '结束时间',
                         formatter: function (val) {
                         return getLocalTime(val);
                         },
                         width: "10%",
                         sortable: true
                         },*/
                        /*{
                         field: 'runType',
                         title: '类型',
                         sortable: true,
                         },*/ /*{
                         field: 'scheduleType',
                         title: '调度类型',
                         sortable: true
                         },*/
                        /*{
                         field: 'status',
                         title: '状态'
                         }
                         ,*/ {
                            field: 'owner',
                            title: '任务创建人',
                            sortable: true
                        },
                        /* {
                         field: 'id',
                         title: '正常开始时间',
                         sortable: true,
                         formatter: function (val) {
                         let t;
                         $.ajax({
                         url: base_url + "/scheduleCenter/getTaskCommonTime.do",
                         type: "get",
                         async:false,
                         data: {
                         id:val,
                         },
                         success: function (data) {
                         //alert(data)
                         t= data;
                         }
                         })
                         return t;
                         },
                         sortable: true,
                         }*/
                    ],
                    // data:info.data
                });
            }
            return oTableInit;
        }

        var oTable = new TableInit();
        oTable.init();
        $('#stopHistoryJobTable').bootstrapTable('hideLoading');


        function noRunParams(params) {
            var temp = {
                status: $('#stopJobStatus').val(),
                dt: $('#stopJobDt').val(),
            };
            return temp;
        }

        var JobLogTable = function (jobId) {
            var parameter = {jobId: jobId};
            var actionRow;
            var oTableInit = new Object();
            var onExpand = -1;
            var table = $('#stopRunningLogDetailTable');
            var timerHandler = null;


            function scheduleLog() {

                $.ajax({
                    url: base_url + "/scheduleCenter/getLog.do",
                    type: "get",
                    data: {
                        id: actionRow.id,
                    },
                    success: function (data) {
                        if (data.status != 'running') {
                            window.clearInterval(timerHandler);
                        }
                        var logArea = $('#log_' + actionRow.id);
                        logArea[0].innerHTML = data.log;
                        logArea.scrollTop(logArea.prop("scrollHeight"), 200);
                        actionRow.log = data.log;
                        actionRow.status = data.status;
                    }
                })
            }

            $('#stopJobLog').on('hide.bs.modal', function () {
                if (timerHandler != null) {
                    window.clearInterval(timerHandler)
                }
            });

            $('#stopJobLog [name="refreshLog"]').on('click', function () {
                table.bootstrapTable('refresh');
                table.bootstrapTable('expandRow', onExpand);
            });

            oTableInit.init = function () {
                table.bootstrapTable({
                    url: base_url + "/scheduleCenter/getJobHistory.do",
                    queryParams: parameter,
                    pagination: true,
                    showPaginationSwitch: false,
                    search: false,
                    cache: false,
                    pageNumber: 1,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    sidePagination: "server",
                    queryParamsType: "limit",
                    queryParams: function (params) {
                        var tmp = {
                            pageSize: params.limit,
                            offset: params.offset,
                            jobId: jobId
                        };
                        return tmp;
                    },
                    pageList: [10, 25, 40, 60],
                    columns: [
                        {
                            field: "id",
                            title: "id"
                        }, {
                            field: "actionId",
                            title: "版本号"
                        }, {
                            field: "jobId",
                            title: "任务ID"
                        }, {
                            field: "executeHost",
                            title: "执行机器ip"
                        }, {
                            field: "status",
                            title: "执行状态",
                            formatter: function (val) {
                                if (val === 'running') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;">' + val + '</a>';
                                }
                                if (val === 'success') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#2f8f42" >' + val + '</a>';
                                }
                                if (val === 'wait') {
                                    return '<a class="layui-btn layui-btn-xs layui-btn-warm" style="width: 100%;">' + val + '</a>';
                                }
                                return '<a class="layui-btn layui-btn-xs layui-btn-danger" style="width: 100%;" >' + val + '</a>'
                            },
                            sortable: true
                        }, {
                            field: "operator",
                            title: "执行人"
                        }, {
                            field: "startTime",
                            title: "开始时间",
                            width: "10%"
                        }, {
                            field: "endTime",
                            title: "结束时间",
                            width: "10%"
                        }, {
                            field: "runTime",
                            title: "运行时间",
                            sortable: true,
                            formatter: function (val) {
                                var longFloat = parseFloat(val);
                                if (longFloat >= 3600) {
                                    var h = Math.floor(longFloat / 3600);
                                    var m = Math.floor(longFloat % 3600 / 60);
                                    var s = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    if (m == 0 && s == 0) {
                                        return h + '时';
                                    } else {
                                        return h + '时' + m + '分' + s;
                                    }
                                } else if (3600 > longFloat && longFloat > 60) {
                                    var mm = Math.floor(longFloat % 3600 / 60);
                                    var ss = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    return mm + '分' + ss;
                                } else if (longFloat <= 60) {
                                    return longFloat + '秒';
                                } else {
                                    return val;
                                }
                            },
                            width: "7%",
                            sortable: true
                        },


                        {
                            field: "illustrate",
                            title: "说明",
                            formatter: function (val) {
                                if (val == null) {
                                    return val;
                                }
                                return "<span class='label label-info' data-toggle='tooltip' title='" + val + "' >" + val.slice(0, 6) + "</span>";
                            }
                        },
                        {
                            field: "triggerType",
                            title: "触发类型",
                            width: "8%",
                            formatter: function (value, row) {
                                if (row['triggerType'] == 1) {
                                    return "自动调度";
                                }
                                if (row['triggerType'] == 2) {
                                    return "手动触发";
                                }
                                if (row['triggerType'] == 3) {
                                    return "手动恢复";
                                }
                                return value;
                            }
                        },
                        {
                            field: "status",
                            title: "操作",
                            width: "10%",
                            formatter: function (index, row) {
                                var html = '<a href="javascript:cancelJob(\'' + row['id'] + '\',\'' + row['jobId'] + '\')">取消任务</a>';
                                if (row['status'] == 'running') {
                                    return html;
                                }
                            }
                        }
                    ],
                    detailView: true,
                    detailFormatter: function (index, row) {
                        var html = '<form role="form">' + '<div class="form-group">' + '<div class="form-control"  style="overflow:scroll; word-break: break-all; word-wrap:break-word; height:600px; white-space:pre-line;font-family:Microsoft YaHei;background:#2D4761; color:#FFF" id="log_' + row.id + '">'
                            + '日志加载中。。' +
                            '</div>' + '<form role="form">' + '<div class="form-group">';
                        return html;
                    },
                    onExpandRow: function (index, row) {
                        actionRow = row;
                        if (index != onExpand) {
                            table.bootstrapTable("collapseRow", onExpand);
                        }
                        onExpand = index;
                        if (row.status == "running") {
                            scheduleLog();
                            timerHandler = window.setInterval(scheduleLog, 3000);
                        } else {
                            scheduleLog();
                        }
                    },
                    onCollapseRow: function (index, row) {
                        window.clearInterval(timerHandler)
                    }
                });
            };
            return oTableInit;
        };


        function cancelJob(historyId, jobId) {
            var url = base_url + "/scheduleCenter/cancelJob.do";
            var parameter = {historyId: historyId, jobId: jobId};
            $.get(url, parameter, function (data) {
                layer.msg(data);
                $('#stopJobLog [name="refreshLog"]').trigger('click');
            });
        }


    }
    else {
        $('#stopHistoryJobTable').bootstrapTable('destroy')
        var TableInit = function () {
            var oTableInit = new Object();
            oTableInit.init = function () {
                var table = $('#stopHistoryJobTable');
                table.bootstrapTable({
                    url: base_url + '/sqoopTaskCenter/findJobHistoryByStatus',
                    method: 'get',
                    pagination: true,
                    cache: false,
                    clickToSelect: true,
                    toolTip: "",
                    striped: false,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    pageNumber: 1,              //初始化加载第一页，默认第一页
                    pageSize: 20,                //每页的记录行数（*）
                    pageList: [40, 60, 80],
                    queryParams: params,
                    search: true,
                    uniqueId: 'id',
                    sidePagination: "client",
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    onClickRow: function (row) {
                        // console.log(row)
                        $('#stopRunningLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#stopJobLog').modal('show');
                    },
                    columns: [
                        {
                            field: '',
                            title: '序号',
                            formatter: function (val, row, index) {
                                return index + 1;
                            },
                            width: "1%"
                        }, {
                            field: 'jobId',
                            title: '任务ID',
                            formatter: function (val) {
                                return '<a href = "#">' + val + '</a>';
                            },
                            width: "1%",
                            sortable: true
                        }, {
                            field: 'jobName',
                            title: '任务名称',
                            sortable: true
                        }, {
                            field: 'description',
                            title: '任务描述',
                            sortable: true
                        }, {
                            field: 'startTime',
                            title: '开始时间',
                            formatter: function (val) {
                                return getLocalTime(val);
                            },
                            width: "10%",
                            sortable: true
                        }, {
                            field: 'endTime',
                            title: '结束时间',
                            formatter: function (val) {
                                return getLocalTime(val);
                            },
                            width: "10%",
                            sortable: true
                        },
                        {
                            field: 'runTime',
                            title: '运行时间',
                            sortable: true,
                            formatter: function (val) {
                                var longFloat = parseFloat(val);
                                if (longFloat >= 3600) {
                                    var h = Math.floor(longFloat / 3600);
                                    var m = Math.floor(longFloat % 3600 / 60);
                                    var s = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    if (m == 0 && s == 0) {
                                        return h + '时';
                                    } else {
                                        return h + '时' + m + '分' + s;
                                    }
                                } else if (3600 > longFloat && longFloat > 60) {
                                    var mm = Math.floor(longFloat % 3600 / 60);
                                    var ss = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    return mm + '分' + ss;
                                } else if (longFloat <= 60) {
                                    return longFloat + '秒';
                                } else {
                                    return val;
                                }
                            },
                            width: "6%",
                            sortable: true,
                        },
                        {
                            field: 'times',
                            title: '执行次数',
                            sortable: true,
                            width: "5%"
                        }, {
                            field: 'executeHost',
                            title: '执行服务器',
                            sortable: true,
                        }, {
                            field: 'status',
                            title: '执行状态',
                            sortable: true
                        }, {
                            field: 'operator',
                            title: '执行人',
                            sortable: true
                        }
                    ],
                    // data:info.data
                });
            }
            return oTableInit;
        }

        var oTable = new TableInit();
        oTable.init();
        $('#stopHistoryJobTable').bootstrapTable('hideLoading');


        function params(params) {
            var temp = {
                status: $('#stopJobStatus').val(),
                dt: $('#stopJobDt').val(),
            };
            return temp;
        }

        var JobLogTable = function (jobId) {
            var parameter = {jobId: jobId};
            var actionRow;
            var oTableInit = new Object();
            var onExpand = -1;
            var table = $('#stopRunningLogDetailTable');
            var timerHandler = null;


            function scheduleLog() {

                $.ajax({
                    url: base_url + "/scheduleCenter/getLog.do",
                    type: "get",
                    data: {
                        id: actionRow.id,
                    },
                    success: function (data) {
                        if (data.status != 'running') {
                            window.clearInterval(timerHandler);
                        }
                        var logArea = $('#log_' + actionRow.id);
                        logArea[0].innerHTML = data.log;
                        logArea.scrollTop(logArea.prop("scrollHeight"), 200);
                        actionRow.log = data.log;
                        actionRow.status = data.status;
                    }
                })
            }

            $('#stopJobLog').on('hide.bs.modal', function () {
                if (timerHandler != null) {
                    window.clearInterval(timerHandler)
                }
            });

            $('#stopJobLog [name="refreshLog"]').on('click', function () {
                table.bootstrapTable('refresh');
                table.bootstrapTable('expandRow', onExpand);
            });

            oTableInit.init = function () {
                table.bootstrapTable({
                    url: base_url + "/scheduleCenter/getJobHistory.do",
                    queryParams: parameter,
                    pagination: true,
                    showPaginationSwitch: false,
                    search: false,
                    cache: false,
                    pageNumber: 1,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    sidePagination: "server",
                    queryParamsType: "limit",
                    queryParams: function (params) {
                        var tmp = {
                            pageSize: params.limit,
                            offset: params.offset,
                            jobId: jobId
                        };
                        return tmp;
                    },
                    pageList: [10, 25, 40, 60],
                    columns: [
                        {
                            field: "id",
                            title: "id"
                        }, {
                            field: "actionId",
                            title: "版本号"
                        }, {
                            field: "jobId",
                            title: "任务ID"
                        }, {
                            field: "executeHost",
                            title: "执行机器ip"
                        }, {
                            field: "status",
                            title: "执行状态",
                            formatter: function (val) {
                                if (val === 'running') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;">' + val + '</a>';
                                }
                                if (val === 'success') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#2f8f42" >' + val + '</a>';
                                }
                                if (val === 'wait') {
                                    return '<a class="layui-btn layui-btn-xs layui-btn-warm" style="width: 100%;">' + val + '</a>';
                                }
                                return '<a class="layui-btn layui-btn-xs layui-btn-danger" style="width: 100%;" >' + val + '</a>'
                            },
                            sortable: true
                        }, {
                            field: "operator",
                            title: "执行人"
                        }, {
                            field: "startTime",
                            title: "开始时间",
                            width: "10%"
                        }, {
                            field: "endTime",
                            title: "结束时间",
                            width: "10%"
                        }, {
                            field: "runTime",
                            title: "运行时间",
                            sortable: true,
                            formatter: function (val) {
                                var longFloat = parseFloat(val);
                                if (longFloat >= 3600) {
                                    var h = Math.floor(longFloat / 3600);
                                    var m = Math.floor(longFloat % 3600 / 60);
                                    var s = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    if (m == 0 && s == 0) {
                                        return h + '时';
                                    } else {
                                        return h + '时' + m + '分' + s;
                                    }
                                } else if (3600 > longFloat && longFloat > 60) {
                                    var mm = Math.floor(longFloat % 3600 / 60);
                                    var ss = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    return mm + '分' + ss;
                                } else if (longFloat <= 60) {
                                    return longFloat + '秒';
                                } else {
                                    return val;
                                }
                            },
                            width: "7%",
                            sortable: true
                        },


                        {
                            field: "illustrate",
                            title: "说明",
                            formatter: function (val) {
                                if (val == null) {
                                    return val;
                                }
                                return "<span class='label label-info' data-toggle='tooltip' title='" + val + "' >" + val.slice(0, 6) + "</span>";
                            }
                        },
                        {
                            field: "triggerType",
                            title: "触发类型",
                            width: "8%",
                            formatter: function (value, row) {
                                if (row['triggerType'] == 1) {
                                    return "自动调度";
                                }
                                if (row['triggerType'] == 2) {
                                    return "手动触发";
                                }
                                if (row['triggerType'] == 3) {
                                    return "手动恢复";
                                }
                                return value;
                            }
                        },
                        {
                            field: "status",
                            title: "操作",
                            width: "10%",
                            formatter: function (index, row) {
                                var html = '<a href="javascript:cancelJob(\'' + row['id'] + '\',\'' + row['jobId'] + '\')">取消任务</a>';
                                if (row['status'] == 'running') {
                                    return html;
                                }
                            }
                        }
                    ],
                    detailView: true,
                    detailFormatter: function (index, row) {
                        var html = '<form role="form">' + '<div class="form-group">' + '<div class="form-control"  style="overflow:scroll; word-break: break-all; word-wrap:break-word; height:600px; white-space:pre-line;font-family:Microsoft YaHei;background:#2D4761; color:#FFF" id="log_' + row.id + '">'
                            + '日志加载中。。' +
                            '</div>' + '<form role="form">' + '<div class="form-group">';
                        return html;
                    },
                    onExpandRow: function (index, row) {
                        actionRow = row;
                        if (index != onExpand) {
                            table.bootstrapTable("collapseRow", onExpand);
                        }
                        onExpand = index;
                        if (row.status == "running") {
                            scheduleLog();
                            timerHandler = window.setInterval(scheduleLog, 3000);
                        } else {
                            scheduleLog();
                        }
                    },
                    onCollapseRow: function (index, row) {
                        window.clearInterval(timerHandler)
                    }
                });
            };
            return oTableInit;
        };


        function cancelJob(historyId, jobId) {
            var url = base_url + "/scheduleCenter/cancelJob.do";
            var parameter = {historyId: historyId, jobId: jobId};
            $.get(url, parameter, function (data) {
                layer.msg(data);
                $('#stopJobLog [name="refreshLog"]').trigger('click');
            });
        }
    }
    updateStopTable();
});

function updateStopTable() {

    //$('#stopJobStatus').selectpicker('val', "stop");

    if ($('#stopJobStatus').val() == "stop" || $('#stopJobStatus').val() == "disabled") {
        $('#stopHistoryJobTable').bootstrapTable('destroy')
        var TableInit = function () {
            var oTableInit = new Object();
            oTableInit.init = function () {
                var table = $('#stopHistoryJobTable');
                table.bootstrapTable({
                    url: base_url + '/jobManage/findStopJobHistoryByStatus',
                    method: 'get',
                    pagination: true,
                    cache: false,
                    clickToSelect: true,
                    toolTip: "",
                    striped: false,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    pageNumber: 1,              //初始化加载第一页，默认第一页
                    pageSize: 20,                //每页的记录行数（*）
                    pageList: [40, 60, 80],
                    queryParams: stopParams,
                    search: true,
                    uniqueId: 'id',
                    sidePagination: "client",
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    onClickRow: function (row) {
                        // console.log(row)
                        $('#stopRunningLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#stopJobLog').modal('show');
                    },
                    columns: [
                        {
                            field: '',
                            title: '序号',
                            formatter: function (val, row, index) {
                                return index + 1;
                            },
                            width: "1%"
                        }, {
                            field: 'id',
                            title: '任务ID',
                            formatter: function (val) {
                                return '<a href = "#">' + val + '</a>';
                            },
                            width: "1%",
                            sortable: true
                        }, {
                            field: 'name',
                            title: '任务名称',
                            sortable: true
                        },
                        {
                            field: 'description',
                            title: '任务描述',
                            sortable: true
                        },

                        {
                            field: 'gmtCreate',
                            title: '创建时间',
                            formatter: function (val) {
                                return getLocalTime(val);
                            },
                            sortable: true
                        },
                        {
                            field: 'gmtModified',
                            title: '更新时间',
                            formatter: function (val) {
                                return getLocalTime(val);
                            },
                            sortable: true
                        },
                        {
                            field: 'owner',
                            title: '创建人',
                            sortable: true
                        },


                        {
                            field: 'dependencies',
                            title: '依赖的任务id',
                            sortable: true
                        },
                        {
                            field: 'runType',
                            title: '任务类型',
                            sortable: true
                        },
                    ],
                    // data:info.data
                });
            }
            // oTableInit= new Object();
            return oTableInit;
        }
        var oTable = new TableInit();
        oTable.init();
        $('#stopHistoryJobTable').bootstrapTable('hideLoading');
        function stopParams(params) {
            var temp = {
                status: $('#stopJobStatus').val(),
            };
            return temp;
        }
    }
    else if ($('#stopJobStatus').val() == "noRun") {
        $('#stopHistoryJobTable').bootstrapTable('destroy')
        var TableInit = function () {
            var oTableInit = new Object();
            oTableInit.init = function () {
                var table = $('#stopHistoryJobTable');
                table.bootstrapTable({
                    url: base_url + '/jobManage/findNoRunJobHistoryByStatus',
                    method: 'get',
                    pagination: true,
                    cache: false,
                    clickToSelect: true,
                    toolTip: "",
                    striped: false,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    pageNumber: 1,              //初始化加载第一页，默认第一页
                    pageSize: 20,                //每页的记录行数（*）
                    pageList: [40, 60, 80],
                    queryParams: noRunParams,
                    search: true,
                    uniqueId: 'jobId',
                    sidePagination: "client",
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    onClickRow: function (row) {
                        // console.log(row)
                        $('#stopRunningLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#stopJobLog').modal('show');
                    },
                    columns: [
                        {
                            field: '',
                            title: '序号',
                            formatter: function (val, row, index) {
                                return index + 1;
                            },
                            width: "3%"
                        }, {
                            field: 'jobId',
                            title: '任务ID',
                            formatter: function (val) {
                                return '<a href = "#">' + val + '</a>';
                            },
                            width: "3%",
                            sortable: true
                        },{
                            field: 'id',
                            title: '版本号',
                            width: "15%",
                            sortable: true
                        },
                        {
                            field: 'name',
                            title: '任务名称',
                        }, {
                            field: 'description',
                            title: '任务描述',
                        },
                        /*{
                            field: 'jobDependencies',
                            title: '上游依赖',
                            /!*formatter: function (val) {
                                val=val.replace(/,/g,"\n");
                                return val;
                            },*!/
                           // width: "4%",
                        },
                        /!*{
                            field: 'jobDependencies',
                            title: 'jobDependencies',
                        },*!/
                        {
                            field: 'readyDependency',
                            title: '已完成依赖',
                            formatter: function (val) {
                                return getLocalTime(val);
                            },

                        },*/
                        /*{
                            field: 'statisticEndTime',
                            title: '结束时间',
                            formatter: function (val) {
                                return getLocalTime(val);
                            },
                            width: "10%",
                            sortable: true
                        },*/
                        /*{
                            field: 'runType',
                            title: '类型',
                            sortable: true,
                        },*/ /*{
                            field: 'scheduleType',
                            title: '调度类型',
                            sortable: true
                        },*/
                        /*{
                            field: 'status',
                            title: '状态'
                        }
                        ,*/ {
                            field: 'owner',
                            title: '任务创建人',
                            sortable: true
                        },
                       /* {
                            field: 'id',
                            title: '正常开始时间',
                            sortable: true,
                            formatter: function (val) {
                                let t;
                                $.ajax({
                                    url: base_url + "/scheduleCenter/getTaskCommonTime.do",
                                    type: "get",
                                    async:false,
                                    data: {
                                        id:val,
                                    },
                                    success: function (data) {
                                        //alert(data)
                                        t= data;
                                    }
                                })
                                return t;
                            },
                            sortable: true,
                        }*/
                    ],
                    // data:info.data
                });
            }
            return oTableInit;
        }

        var oTable = new TableInit();
        oTable.init();
        $('#stopHistoryJobTable').bootstrapTable('hideLoading');


        function noRunParams(params) {
            var temp = {
                status: $('#stopJobStatus').val(),
                dt: $('#stopJobDt').val(),
            };
            return temp;
        }

        var JobLogTable = function (jobId) {
            var parameter = {jobId: jobId};
            var actionRow;
            var oTableInit = new Object();
            var onExpand = -1;
            var table = $('#stopRunningLogDetailTable');
            var timerHandler = null;


            function scheduleLog() {

                $.ajax({
                    url: base_url + "/scheduleCenter/getLog.do",
                    type: "get",
                    data: {
                        id: actionRow.id,
                    },
                    success: function (data) {
                        if (data.status != 'running') {
                            window.clearInterval(timerHandler);
                        }
                        var logArea = $('#log_' + actionRow.id);
                        logArea[0].innerHTML = data.log;
                        logArea.scrollTop(logArea.prop("scrollHeight"), 200);
                        actionRow.log = data.log;
                        actionRow.status = data.status;
                    }
                })
            }

            $('#stopJobLog').on('hide.bs.modal', function () {
                if (timerHandler != null) {
                    window.clearInterval(timerHandler)
                }
            });

            $('#stopJobLog [name="refreshLog"]').on('click', function () {
                table.bootstrapTable('refresh');
                table.bootstrapTable('expandRow', onExpand);
            });

            oTableInit.init = function () {
                table.bootstrapTable({
                    url: base_url + "/scheduleCenter/getJobHistory.do",
                    queryParams: parameter,
                    pagination: true,
                    showPaginationSwitch: false,
                    search: false,
                    cache: false,
                    pageNumber: 1,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    sidePagination: "server",
                    queryParamsType: "limit",
                    queryParams: function (params) {
                        var tmp = {
                            pageSize: params.limit,
                            offset: params.offset,
                            jobId: jobId
                        };
                        return tmp;
                    },
                    pageList: [10, 25, 40, 60],
                    columns: [
                        {
                            field: "id",
                            title: "id"
                        }, {
                            field: "actionId",
                            title: "版本号"
                        }, {
                            field: "jobId",
                            title: "任务ID"
                        }, {
                            field: "executeHost",
                            title: "执行机器ip"
                        }, {
                            field: "status",
                            title: "执行状态",
                            formatter: function (val) {
                                if (val === 'running') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;">' + val + '</a>';
                                }
                                if (val === 'success') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#2f8f42" >' + val + '</a>';
                                }
                                if (val === 'wait') {
                                    return '<a class="layui-btn layui-btn-xs layui-btn-warm" style="width: 100%;">' + val + '</a>';
                                }
                                return '<a class="layui-btn layui-btn-xs layui-btn-danger" style="width: 100%;" >' + val + '</a>'
                            },
                            sortable: true
                        }, {
                            field: "operator",
                            title: "执行人"
                        }, {
                            field: "startTime",
                            title: "开始时间",
                            width: "10%"
                        }, {
                            field: "endTime",
                            title: "结束时间",
                            width: "10%"
                        }, {
                            field: "runTime",
                            title: "运行时间",
                            sortable: true,
                            formatter: function (val) {
                                var longFloat = parseFloat(val);
                                if (longFloat >= 3600) {
                                    var h = Math.floor(longFloat / 3600);
                                    var m = Math.floor(longFloat % 3600 / 60);
                                    var s = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    if (m == 0 && s == 0) {
                                        return h + '时';
                                    } else {
                                        return h + '时' + m + '分' + s;
                                    }
                                } else if (3600 > longFloat && longFloat > 60) {
                                    var mm = Math.floor(longFloat % 3600 / 60);
                                    var ss = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    return mm + '分' + ss;
                                } else if (longFloat <= 60) {
                                    return longFloat + '秒';
                                } else {
                                    return val;
                                }
                            },
                            width: "7%",
                            sortable: true
                        },


                        {
                            field: "illustrate",
                            title: "说明",
                            formatter: function (val) {
                                if (val == null) {
                                    return val;
                                }
                                return "<span class='label label-info' data-toggle='tooltip' title='" + val + "' >" + val.slice(0, 6) + "</span>";
                            }
                        },
                        {
                            field: "triggerType",
                            title: "触发类型",
                            width: "8%",
                            formatter: function (value, row) {
                                if (row['triggerType'] == 1) {
                                    return "自动调度";
                                }
                                if (row['triggerType'] == 2) {
                                    return "手动触发";
                                }
                                if (row['triggerType'] == 3) {
                                    return "手动恢复";
                                }
                                return value;
                            }
                        },
                        {
                            field: "status",
                            title: "操作",
                            width: "10%",
                            formatter: function (index, row) {
                                var html = '<a href="javascript:cancelJob(\'' + row['id'] + '\',\'' + row['jobId'] + '\')">取消任务</a>';
                                if (row['status'] == 'running') {
                                    return html;
                                }
                            }
                        }
                    ],
                    detailView: true,
                    detailFormatter: function (index, row) {
                        var html = '<form role="form">' + '<div class="form-group">' + '<div class="form-control"  style="overflow:scroll; word-break: break-all; word-wrap:break-word; height:600px; white-space:pre-line;font-family:Microsoft YaHei;background:#2D4761; color:#FFF" id="log_' + row.id + '">'
                            + '日志加载中。。' +
                            '</div>' + '<form role="form">' + '<div class="form-group">';
                        return html;
                    },
                    onExpandRow: function (index, row) {
                        actionRow = row;
                        if (index != onExpand) {
                            table.bootstrapTable("collapseRow", onExpand);
                        }
                        onExpand = index;
                        if (row.status == "running") {
                            scheduleLog();
                            timerHandler = window.setInterval(scheduleLog, 3000);
                        } else {
                            scheduleLog();
                        }
                    },
                    onCollapseRow: function (index, row) {
                        window.clearInterval(timerHandler)
                    }
                });
            };
            return oTableInit;
        };


        function cancelJob(historyId, jobId) {
            var url = base_url + "/scheduleCenter/cancelJob.do";
            var parameter = {historyId: historyId, jobId: jobId};
            $.get(url, parameter, function (data) {
                layer.msg(data);
                $('#stopJobLog [name="refreshLog"]').trigger('click');
            });
        }


    }
    else {
        $('#stopHistoryJobTable').bootstrapTable('destroy')
        var TableInit = function () {
            var oTableInit = new Object();
            oTableInit.init = function () {
                var table = $('#stopHistoryJobTable');
                table.bootstrapTable({
                    url: base_url + '/jobManage/findJobHistoryByStatus',
                    method: 'get',
                    pagination: true,
                    cache: false,
                    clickToSelect: true,
                    toolTip: "",
                    striped: false,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    pageNumber: 1,              //初始化加载第一页，默认第一页
                    pageSize: 20,                //每页的记录行数（*）
                    pageList: [40, 60, 80],
                    queryParams: params,
                    search: true,
                    uniqueId: 'id',
                    sidePagination: "client",
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    onClickRow: function (row) {
                        // console.log(row)
                        $('#stopRunningLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#stopJobLog').modal('show');
                    },
                    columns: [
                        {
                            field: '',
                            title: '序号',
                            formatter: function (val, row, index) {
                                return index + 1;
                            },
                            width: "1%"
                        }, {
                            field: 'jobId',
                            title: '任务ID',
                            formatter: function (val) {
                                return '<a href = "#">' + val + '</a>';
                            },
                            width: "1%",
                            sortable: true
                        }, {
                            field: 'jobName',
                            title: '任务名称',
                            sortable: true
                        }, {
                            field: 'description',
                            title: '任务描述',
                            sortable: true
                        }, {
                            field: 'startTime',
                            title: '开始时间',
                            formatter: function (val) {
                                return getLocalTime(val);
                            },
                            width: "10%",
                            sortable: true
                        }, {
                            field: 'endTime',
                            title: '结束时间',
                            formatter: function (val) {
                                return getLocalTime(val);
                            },
                            width: "10%",
                            sortable: true
                        },
                        {
                            field: 'runTime',
                            title: '运行时间',
                            sortable: true,
                            formatter: function (val) {
                                var longFloat = parseFloat(val);
                                if (longFloat >= 3600) {
                                    var h = Math.floor(longFloat / 3600);
                                    var m = Math.floor(longFloat % 3600 / 60);
                                    var s = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    if (m == 0 && s == 0) {
                                        return h + '时';
                                    } else {
                                        return h + '时' + m + '分' + s;
                                    }
                                } else if (3600 > longFloat && longFloat > 60) {
                                    var mm = Math.floor(longFloat % 3600 / 60);
                                    var ss = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    return mm + '分' + ss;
                                } else if (longFloat <= 60) {
                                    return longFloat + '秒';
                                } else {
                                    return val;
                                }
                            },
                            width: "6%",
                            sortable: true,
                        },
                        {
                            field: 'times',
                            title: '执行次数',
                            sortable: true,
                            width: "5%"
                        }, {
                            field: 'executeHost',
                            title: '执行服务器',
                            sortable: true,
                        }, {
                            field: 'status',
                            title: '执行状态',
                            sortable: true
                        }, {
                            field: 'operator',
                            title: '执行人',
                            sortable: true
                        }
                    ],
                    // data:info.data
                });
            }
            return oTableInit;
        }

        var oTable = new TableInit();
        oTable.init();
        $('#stopHistoryJobTable').bootstrapTable('hideLoading');


        function params(params) {
            var temp = {
                status: $('#stopJobStatus').val(),
                dt: $('#stopJobDt').val(),
            };
            return temp;
        }

        var JobLogTable = function (jobId) {
            var parameter = {jobId: jobId};
            var actionRow;
            var oTableInit = new Object();
            var onExpand = -1;
            var table = $('#stopRunningLogDetailTable');
            var timerHandler = null;


            function scheduleLog() {

                $.ajax({
                    url: base_url + "/scheduleCenter/getLog.do",
                    type: "get",
                    data: {
                        id: actionRow.id,
                    },
                    success: function (data) {
                        if (data.status != 'running') {
                            window.clearInterval(timerHandler);
                        }
                        var logArea = $('#log_' + actionRow.id);
                        logArea[0].innerHTML = data.log;
                        logArea.scrollTop(logArea.prop("scrollHeight"), 200);
                        actionRow.log = data.log;
                        actionRow.status = data.status;
                    }
                })
            }

            $('#stopJobLog').on('hide.bs.modal', function () {
                if (timerHandler != null) {
                    window.clearInterval(timerHandler)
                }
            });

            $('#stopJobLog [name="refreshLog"]').on('click', function () {
                table.bootstrapTable('refresh');
                table.bootstrapTable('expandRow', onExpand);
            });

            oTableInit.init = function () {
                table.bootstrapTable({
                    url: base_url + "/scheduleCenter/getJobHistory.do",
                    queryParams: parameter,
                    pagination: true,
                    showPaginationSwitch: false,
                    search: false,
                    cache: false,
                    pageNumber: 1,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    sidePagination: "server",
                    queryParamsType: "limit",
                    queryParams: function (params) {
                        var tmp = {
                            pageSize: params.limit,
                            offset: params.offset,
                            jobId: jobId
                        };
                        return tmp;
                    },
                    pageList: [10, 25, 40, 60],
                    columns: [
                        {
                            field: "id",
                            title: "id"
                        }, {
                            field: "actionId",
                            title: "版本号"
                        }, {
                            field: "jobId",
                            title: "任务ID"
                        }, {
                            field: "executeHost",
                            title: "执行机器ip"
                        }, {
                            field: "status",
                            title: "执行状态",
                            formatter: function (val) {
                                if (val === 'running') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;">' + val + '</a>';
                                }
                                if (val === 'success') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#2f8f42" >' + val + '</a>';
                                }
                                if (val === 'wait') {
                                    return '<a class="layui-btn layui-btn-xs layui-btn-warm" style="width: 100%;">' + val + '</a>';
                                }
                                return '<a class="layui-btn layui-btn-xs layui-btn-danger" style="width: 100%;" >' + val + '</a>'
                            },
                            sortable: true
                        }, {
                            field: "operator",
                            title: "执行人"
                        }, {
                            field: "startTime",
                            title: "开始时间",
                            width: "10%"
                        }, {
                            field: "endTime",
                            title: "结束时间",
                            width: "10%"
                        }, {
                            field: "runTime",
                            title: "运行时间",
                            sortable: true,
                            formatter: function (val) {
                                var longFloat = parseFloat(val);
                                if (longFloat >= 3600) {
                                    var h = Math.floor(longFloat / 3600);
                                    var m = Math.floor(longFloat % 3600 / 60);
                                    var s = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    if (m == 0 && s == 0) {
                                        return h + '时';
                                    } else {
                                        return h + '时' + m + '分' + s;
                                    }
                                } else if (3600 > longFloat && longFloat > 60) {
                                    var mm = Math.floor(longFloat % 3600 / 60);
                                    var ss = (longFloat % 60) == 0 ? "" : (longFloat % 60) + "秒";
                                    return mm + '分' + ss;
                                } else if (longFloat <= 60) {
                                    return longFloat + '秒';
                                } else {
                                    return val;
                                }
                            },
                            width: "7%",
                            sortable: true
                        },


                        {
                            field: "illustrate",
                            title: "说明",
                            formatter: function (val) {
                                if (val == null) {
                                    return val;
                                }
                                return "<span class='label label-info' data-toggle='tooltip' title='" + val + "' >" + val.slice(0, 6) + "</span>";
                            }
                        },
                        {
                            field: "triggerType",
                            title: "触发类型",
                            width: "8%",
                            formatter: function (value, row) {
                                if (row['triggerType'] == 1) {
                                    return "自动调度";
                                }
                                if (row['triggerType'] == 2) {
                                    return "手动触发";
                                }
                                if (row['triggerType'] == 3) {
                                    return "手动恢复";
                                }
                                return value;
                            }
                        },
                        {
                            field: "status",
                            title: "操作",
                            width: "10%",
                            formatter: function (index, row) {
                                var html = '<a href="javascript:cancelJob(\'' + row['id'] + '\',\'' + row['jobId'] + '\')">取消任务</a>';
                                if (row['status'] == 'running') {
                                    return html;
                                }
                            }
                        }
                    ],
                    detailView: true,
                    detailFormatter: function (index, row) {
                        var html = '<form role="form">' + '<div class="form-group">' + '<div class="form-control"  style="overflow:scroll; word-break: break-all; word-wrap:break-word; height:600px; white-space:pre-line;font-family:Microsoft YaHei;background:#2D4761; color:#FFF" id="log_' + row.id + '">'
                            + '日志加载中。。' +
                            '</div>' + '<form role="form">' + '<div class="form-group">';
                        return html;
                    },
                    onExpandRow: function (index, row) {
                        actionRow = row;
                        if (index != onExpand) {
                            table.bootstrapTable("collapseRow", onExpand);
                        }
                        onExpand = index;
                        if (row.status == "running") {
                            scheduleLog();
                            timerHandler = window.setInterval(scheduleLog, 3000);
                        } else {
                            scheduleLog();
                        }
                    },
                    onCollapseRow: function (index, row) {
                        window.clearInterval(timerHandler)
                    }
                });
            };
            return oTableInit;
        };


        function cancelJob(historyId, jobId) {
            var url = base_url + "/scheduleCenter/cancelJob.do";
            var parameter = {historyId: historyId, jobId: jobId};
            $.get(url, parameter, function (data) {
                layer.msg(data);
                $('#stopJobLog [name="refreshLog"]').trigger('click');
            });
        }
    }



    $('#stopHistoryJobTable').bootstrapTable('refresh');

}
/*
 $('#stopJobStatus').change(function (e) {

 if($('#stopJobStatus').val()=="stop" ||$('#stopJobStatus').val()=="disabled" ) {
 alert("updateStopTable start")
 updateStopTable()
 alert("updateStopTable start")
 }else{
 alert("updateTable start")
 updateTable()
 alert("updateTable start")
 }
 })*/

$(function () {
    let syFlag = $("#syFlag").val();
    if(syFlag==1){
        $("#stopJobStatus").val("failed")
    }else{
        $("#stopJobStatus").val("all")
    }
    $("#syFlag").val("");
})

