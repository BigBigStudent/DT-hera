/*layui.use(['table'], function () {
    $('#sqoopTaskDetail').addClass('active');
    $('#sqoopTaskDetail').parent().addClass('menu-open');
    $('#sqoopTaskDetail').parent().parent().addClass('menu-open');
    $('#bigdataMetadata').addClass('active');
/!*    if ($('#stopJobStatus').val() == "stop" || $('#stopJobStatus').val() == "disabled") {
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
                        $('#sqoopLogDetailTable').bootstrapTable("destroy");
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
                        $('#sqoopLogDetailTable').bootstrapTable("destroy");
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
                        /!*{
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

                         },*!/
                        /!*{
                         field: 'statisticEndTime',
                         title: '结束时间',
                         formatter: function (val) {
                         return getLocalTime(val);
                         },
                         width: "10%",
                         sortable: true
                         },*!/
                        /!*{
                         field: 'runType',
                         title: '类型',
                         sortable: true,
                         },*!/ /!*{
                         field: 'scheduleType',
                         title: '调度类型',
                         sortable: true
                         },*!/
                        /!*{
                         field: 'status',
                         title: '状态'
                         }
                         ,*!/ {
                            field: 'owner',
                            title: '任务创建人',
                            sortable: true
                        },
                        /!* {
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
                         }*!/
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
                dt: $('#sqoopJobDt').val(),
            };
            return temp;
        }

        var JobLogTable = function (jobId) {
            var parameter = {jobId: jobId};
            var actionRow;
            var oTableInit = new Object();
            var onExpand = -1;
            var table = $('#sqoopLogDetailTable');
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
                        $('#sqoopLogDetailTable').bootstrapTable("destroy");
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
                dt: $('#sqoopJobDt').val(),
            };
            return temp;
        }

        var JobLogTable = function (jobId) {
            var parameter = {jobId: jobId};
            var actionRow;
            var oTableInit = new Object();
            var onExpand = -1;
            var table = $('#sqoopLogDetailTable');
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

            $('#sqoopJobLog').on('hide.bs.modal', function () {
                if (timerHandler != null) {
                    window.clearInterval(timerHandler)
                }
            });

            $('#sqoopJobLog [name="refreshLog"]').on('click', function () {
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
                $('#sqoopJobLog [name="refreshLog"]').trigger('click');
            });
        }
    }*!/

    laydate.render({
        /!**
         　　* @Description: TODO 初始化时间插件
         　　* @param
         　　* @return
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/21 15:11
         　　*!/
        elem: '#dateTime'
        , min: -6
        , max: 0
        , done: function (value, date) {
           // getTableInfo(value);
            $("#dateTime").val(getDate())
        }
    });

    function getDate() {
        /!**
         　　* @Description: TODO 获取时间(yyyy-MM-dd)
         　　* @param
         　　* @return
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/21 16:05
         　　*!/
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth();//得到月份
        var date = now.getDate();//得到日期
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        var time = "";
        time = year + "-" + month + "-" + date;
        return time;
    };



});

function updateStopTable() {


/!*    if ($('#stopJobStatus').val() == "stop" || $('#stopJobStatus').val() == "disabled") {
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
                        $('#sqoopLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#sqoopJobLog').modal('show');
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
                        $('#sqoopLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#sqoopJobLog').modal('show');
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
                        /!*{
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

                        },*!/
                        /!*{
                            field: 'statisticEndTime',
                            title: '结束时间',
                            formatter: function (val) {
                                return getLocalTime(val);
                            },
                            width: "10%",
                            sortable: true
                        },*!/
                        /!*{
                            field: 'runType',
                            title: '类型',
                            sortable: true,
                        },*!/ /!*{
                            field: 'scheduleType',
                            title: '调度类型',
                            sortable: true
                        },*!/
                        /!*{
                            field: 'status',
                            title: '状态'
                        }
                        ,*!/ {
                            field: 'owner',
                            title: '任务创建人',
                            sortable: true
                        },
                       /!* {
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
                        }*!/
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
                dt: $('#sqoopJobDt').val(),
            };
            return temp;
        }

        var JobLogTable = function (jobId) {
            var parameter = {jobId: jobId};
            var actionRow;
            var oTableInit = new Object();
            var onExpand = -1;
            var table = $('#sqoopLogDetailTable');
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

            $('#sqoopJobLog').on('hide.bs.modal', function () {
                if (timerHandler != null) {
                    window.clearInterval(timerHandler)
                }
            });

            $('#sqoopJobLog [name="refreshLog"]').on('click', function () {
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
                $('#sqoopJobLog [name="refreshLog"]').trigger('click');
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
                        $('#sqoopLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#sqoopJobLog').modal('show');
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
                dt: $('#sqoopJobDt').val(),
            };
            return temp;
        }

        var JobLogTable = function (jobId) {
            var parameter = {jobId: jobId};
            var actionRow;
            var oTableInit = new Object();
            var onExpand = -1;
            var table = $('#sqoopLogDetailTable');
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

            $('#sqoopJobLog').on('hide.bs.modal', function () {
                if (timerHandler != null) {
                    window.clearInterval(timerHandler)
                }
            });

            $('#sqoopJobLog [name="refreshLog"]').on('click', function () {
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
                $('#sqoopJobLog [name="refreshLog"]').trigger('click');
            });
        }
    }*!/

    $('#stopHistoryJobTable').bootstrapTable('refresh');

}*/


layui.use(['table', 'laytpl', 'form', 'laydate'], function () {
    $('#sqoopTaskDetail').addClass('active');
    $('#sqoopTaskDetail').parent().addClass('menu-open');
    $('#sqoopTaskDetail').parent().parent().addClass('menu-open');
    $('#bigdataMetadata').addClass('active');

    var laydate = layui.laydate;
    // let params;
//直接嵌套显示
//常规用法
    laydate.render({
        elem: '#runday'
        , min: -6
        , max: 0
        , value: getDate()
        , done: function () {
            updateSqoopTable()
        }
    });

/*
    $('#sqoopTablesTable').bootstrapTable('destroy')
    var TableInit = function () {
        var oTableInit = new Object();
        oTableInit.init = function () {
            var table = $('#sqoopTablesTable');
            table.bootstrapTable({
                url: base_url + '/sqoopTaskCenter/findSqoopTableByStatus',
                method: 'get',
                pagination: true,
                cache: false,
                clickToSelect: true,
                toolTip: "",
                striped: false,
                showRefresh: true,           //是否显示刷新按钮
                showPaginationSwitch: false,  //是否显示选择分页数按钮
                pageNumber: 1,              //初始化加载第一页，默认第一页
                pageSize: 15,                //每页的记录行数（*）
                pageList: [10, 15, 20, 40, 60, 80],
                queryParams: params,
                search: true,
                uniqueId: 'jobId',
                sidePagination: "client",
                searchAlign: 'left',
                buttonsAlign: 'left',
                onClickRow: function (row) {
                    $('#sqoopLogDetailTable').bootstrapTable("destroy");
                    var tableObject = new JobLogTable(row.jobId);
                    tableObject.init();
                    $('#sqoopJobLog').modal('show');
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
                    },
                    {
                        field: 'status',
                        title: '状态',
                        sortable: true,
                        formatter: function (val) {
                            if (val == 'failed') {
                                return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#FF0000;color: white;" >' + val + '</a>';
                            } else {
                                return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#3CB371;color: white;" >' + val + '</a>';
                              //  return  val ;
                            }
                        },
                    },

                    {
                        field: 'source',
                        title: '源表',
                        sortable: true
                    },
                    {
                        field: 'target',
                        title: '目标表',
                        sortable: true
                    },
                    {
                        field: 'fileSize',
                        title: '文件大小',
                        sortable: true
                    },

                    {
                        field: 'spendTime',
                        title: '耗时(秒)',
                        sortable: true
                    },
                    {
                        field: 'speed',
                        title: '网速',
                        sortable: true
                    },
                    {
                        field: 'avgRecords',
                        title: '平均数量',
                        sortable: true
                    },

                    {
                        field: 'yesterdayRecords',
                        title: '昨日数量',
                        sortable: true,
                        formatter:function (val,row) {
                            //alert('val'+val)
                            if(val==null && row['status']=='success'){
                                return "NULL"
                            }else{
                                return val
                            }
                        }
                    },
                    {
                        field: 'records',
                        title: '今日数量',
                        sortable: true
                    },
                    {
                        field: 'incrementRecords',
                        title: '增长',
                        formatter: function (val) {

                            if (val == '-0.5') {
                                return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#CD950C" >' + '数据异常' + '</a>';
                            } else if (val < '0') {
                                return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:red" >' + val + '</a>';
                            } else {
                                return val;
                            }

                        },
                        sortable: true
                    },
                    /!*{
                        field: 'updateDirection',
                        title: '同步方向',
                        formatter: function (value, row) {
                            if (row['updateDirection'] == 0) {
                                return "导入";
                            }
                            if (row['updateDirection'] == 1) {
                                return "导出";
                            }
                            return value;
                        },
                        sortable: true
                    },*!/
                    {
                        field: 'updateType',
                        title: '类型',
                        formatter: function (value, row) {
                            if (row['updateType'] == 0) {
                                return "全量";
                            }else
                            if (row['updateType'] == 1) {
                                return "增量";
                            }
                            return value;
                        },
                        sortable: true
                    },
                    {
                        field: 'comment',
                        title: '备注',
                        sortable: true,
                        formatter: function (value, row) {
                            if ((row['yesterdayRecords'] == null||row['yesterdayRecords'] == '') && row['status'] == 'success' ) {
                                return "昨日数据量异常，有可能是今日新增任务";
                            }else if(row['incrementRecords'] < '0' && row['status'] == 'success' ){
                                return "今日数据量较之前减少，请检查任务";
                            } else{
                                return value;
                            }
                        },
                    },


                ],
                // data:info.data
            });
        }
        return oTableInit;
    }
    var oTable = new TableInit();
    oTable.init();
    $('#stopHistoryJobTable').bootstrapTable('hideLoading');
*/
    updateSqoopTable()

});


function updateSqoopTable() {

    if ($('#sqoopTableStatus').val() == 'failed') {
        $('#sqoopTablesTable').bootstrapTable('destroy')
        var TableInit = function () {
            var oTableInit = new Object();
            oTableInit.init = function () {
                var table = $('#sqoopTablesTable');
                table.bootstrapTable({
                    url: base_url + '/sqoopTaskCenter/findSqoopTableByStatus',
                    method: 'get',
                    pagination: true,
                    cache: false,
                    clickToSelect: true,
                    toolTip: "",
                    striped: false,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    pageNumber: 1,              //初始化加载第一页，默认第一页
                    pageSize: 15,                //每页的记录行数（*）
                    pageList: [10, 15, 20, 40, 60, 80],
                    queryParams: params,
                    search: true,
                    uniqueId: 'jobId',
                    sidePagination: "client",
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    onClickRow: function (row) {
                        $('#sqoopLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#sqoopJobLog').modal('show');
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
                        },
                        /*{
                            field: 'status',
                            title: '状态',
                            sortable: true
                        },*/
                        {
                            field: 'source',
                            title: '源表',
                            sortable: true
                        },
                        {
                            field: 'target',
                            title: '目标表',
                            sortable: true
                        },

                        {
                            field: 'incrementRecords',
                            title: '增长',
                            formatter: function (val) {
                                if (val == '-0.5') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#DCDCDC;color: black;" >' + '数据异常' + '</a>';
                                } else if (val < '0') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#DCDCDC;color: black;" >' + val + '</a>';
                                } else {
                                    return val;
                                }
                            },
                            sortable: true
                        },
                        {
                            field: 'comment',
                            title: '备注',
                            sortable: true,
                            formatter: function (val,row) {
                                if(val.length>1){
                                    return val;
                                }else if (row['incrementRecords'] == '-0.5') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#DCDCDC;color: black;" >' + '数据异常' + '</a>';
                                }else if (row['incrementRecords'] < '0') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#DCDCDC;color: black;" >' + '数据量较之前减少' + '</a>';
                                } else {
                                    return val;
                                }
                            },
                        },

                        /*{
                            field: 'updateDirection',
                            title: '同步方向',
                            formatter: function (value, row) {
                                if (row['updateDirection'] == 0) {
                                    return "导入";
                                }
                                if (row['updateDirection'] == 1) {
                                    return "导出";
                                }
                                return value;
                            },
                            sortable: true
                        },*/
                        {
                            field: 'avgRecords',
                            title: '平均数量',
                            sortable: true
                        },

                        {
                            field: 'yesterdayRecords',
                            title: '昨日数量',
                            sortable: true
                        },
                        {
                            field: 'records',
                            title: '今日数量',
                            sortable: true
                        },
                        {
                            field: 'updateType',
                            title: '类型',
                            formatter: function (value, row) {
                                if (row['updateType'] == 0) {
                                    return "全量";
                                }
                                if (row['updateType'] == 1) {
                                    return "增量";
                                }
                                return value;
                            },
                            sortable: true
                        },

                        {
                            field: 'fileSize',
                            title: '文件大小',
                            sortable: true
                        },

                        {
                            field: 'spendTime',
                            title: '耗时(秒)',
                            sortable: true
                        },
                        {
                            field: 'speed',
                            title: '网速',
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
    }

    else if ($('#sqoopTableStatus').val() == 'success'){
        $('#sqoopTablesTable').bootstrapTable('destroy')
        var TableInit = function () {
            var oTableInit = new Object();
            oTableInit.init = function () {
                var table = $('#sqoopTablesTable');
                table.bootstrapTable({
                    url: base_url + '/sqoopTaskCenter/findSqoopTableByStatus',
                    method: 'get',
                    pagination: true,
                    cache: false,
                    clickToSelect: true,
                    toolTip: "",
                    striped: false,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    pageNumber: 1,              //初始化加载第一页，默认第一页
                    pageSize: 15,                //每页的记录行数（*）
                    pageList: [10, 15, 20, 40, 60, 80],
                    queryParams: params,
                    search: true,
                    uniqueId: 'jobId',
                    sidePagination: "client",
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    onClickRow: function (row) {
                        $('#sqoopLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#sqoopJobLog').modal('show');
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
                        },
                        {
                            field: 'source',
                            title: '源表',
                            sortable: true
                        },
                        {
                            field: 'target',
                            title: '目标表',
                            sortable: true
                        },
                        {
                            field: 'fileSize',
                            title: '文件大小',
                            sortable: true
                        },

                        {
                            field: 'spendTime',
                            title: '耗时(秒)',
                            sortable: true
                        },
                        {
                            field: 'speed',
                            title: '网速',
                            sortable: true
                        },
                        {
                            field: 'avgRecords',
                            title: '平均数量',
                            sortable: true
                        },

                        {
                            field: 'yesterdayRecords',
                            title: '昨日数量',
                            sortable: true,
                            formatter:function (val,row) {
                                //alert('val'+val)
                                if(val==null && row['status']=='success'){
                                    return "NULL"
                                }else{
                                    return val
                                }
                            }
                        },
                        {
                            field: 'records',
                            title: '今日数量',
                            sortable: true
                        },
                        {
                            field: 'incrementRecords',
                            title: '增长',
                            formatter: function (val) {

                                if (val == '-0.5') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#CD950C" >' + '数据异常' + '</a>';
                                } else if (val < '0') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:red" >' + val + '</a>';
                                } else {
                                    return val;
                                }

                            },
                            sortable: true
                        },
                        /*{
                            field: 'updateDirection',
                            title: '同步方向',
                            formatter: function (value, row) {
                                if (row['updateDirection'] == 0) {
                                    return "导入";
                                }
                                if (row['updateDirection'] == 1) {
                                    return "导出";
                                }
                                return value;
                            },
                            sortable: true
                        },*/
                        {
                            field: 'updateType',
                            title: '类型',
                            formatter: function (value, row) {
                                if (row['updateType'] == 0) {
                                    return "全量";
                                }else
                                if (row['updateType'] == 1) {
                                    return "增量";
                                }
                                return value;
                            },
                            sortable: true
                        },
                        {
                            field: 'comment',
                            title: '备注',
                            sortable: true,
                            formatter: function (value, row) {

                                if ((row['yesterdayRecords'] == null||row['yesterdayRecords'] == '' )&& row['status'] == 'success' ) {
                                    return "昨日数据量异常，有可能是今日新增任务";
                                }else if(row['incrementRecords'] < '0' && row['status'] == 'success' ){
                                    return "今日数据量较之前减少，请检查任务";
                                }
                                else{
                                    return value;
                                }
                            },
                        },


                    ],
                    // data:info.data
                });
            }
            return oTableInit;
        }
        var oTable = new TableInit();
        oTable.init();
        $('#stopHistoryJobTable').bootstrapTable('hideLoading');
    }

    else {
        $('#sqoopTablesTable').bootstrapTable('destroy')
        var TableInit = function () {
            var oTableInit = new Object();
            oTableInit.init = function () {
                var table = $('#sqoopTablesTable');
                table.bootstrapTable({
                    url: base_url + '/sqoopTaskCenter/findSqoopTableByStatus',
                    method: 'get',
                    pagination: true,
                    cache: false,
                    clickToSelect: true,
                    toolTip: "",
                    striped: false,
                    showRefresh: true,           //是否显示刷新按钮
                    showPaginationSwitch: false,  //是否显示选择分页数按钮
                    pageNumber: 1,              //初始化加载第一页，默认第一页
                    pageSize: 15,                //每页的记录行数（*）
                    pageList: [10, 15, 20, 40, 60, 80],
                    queryParams: params,
                    search: true,
                    uniqueId: 'jobId',
                    sidePagination: "client",
                    searchAlign: 'left',
                    buttonsAlign: 'left',
                    onClickRow: function (row) {
                        $('#sqoopLogDetailTable').bootstrapTable("destroy");
                        var tableObject = new JobLogTable(row.jobId);
                        tableObject.init();
                        $('#sqoopJobLog').modal('show');
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
                        },
                        {
                            field: 'status',
                            title: '状态',
                            sortable: true,
                            formatter: function (val) {
                                if (val == 'failed') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#FF0000;color: white;" >' + val + '</a>';
                                } else {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#3CB371;color: white;" >' + val + '</a>';
                                    //  return  val ;
                                }
                            },
                        },

                        {
                            field: 'source',
                            title: '源表',
                            sortable: true
                        },
                        {
                            field: 'target',
                            title: '目标表',
                            sortable: true
                        },
                        {
                            field: 'fileSize',
                            title: '文件大小',
                            sortable: true
                        },

                        {
                            field: 'spendTime',
                            title: '耗时(秒)',
                            sortable: true
                        },
                        {
                            field: 'speed',
                            title: '网速',
                            sortable: true
                        },
                        {
                            field: 'avgRecords',
                            title: '平均数量',
                            sortable: true
                        },

                        {
                            field: 'yesterdayRecords',
                            title: '昨日数量',
                            sortable: true,
                            formatter:function (val,row) {
                                //alert('val'+val)
                                if(val==null && row['status']=='success'){
                                    return "NULL"
                                }else{
                                    return val
                                }
                            }
                        },
                        {
                            field: 'records',
                            title: '今日数量',
                            sortable: true
                        },
                        {
                            field: 'incrementRecords',
                            title: '增长',
                            formatter: function (val) {

                                if (val == '-0.5') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:#CD950C" >' + '数据异常' + '</a>';
                                } else if (val < '0') {
                                    return '<a class="layui-btn layui-btn-xs" style="width: 100%;background-color:red" >' + val + '</a>';
                                } else {
                                    return val;
                                }

                            },
                            sortable: true
                        },
                        /*{
                            field: 'updateDirection',
                            title: '同步方向',
                            formatter: function (value, row) {
                                if (row['updateDirection'] == 0) {
                                    return "导入";
                                }
                                if (row['updateDirection'] == 1) {
                                    return "导出";
                                }
                                return value;
                            },
                            sortable: true
                        },*/
                        {
                            field: 'updateType',
                            title: '类型',
                            formatter: function (value, row) {
                                if (row['updateType'] == 0) {
                                    return "全量";
                                }else
                                if (row['updateType'] == 1) {
                                    return "增量";
                                }
                                return value;
                            },
                            sortable: true
                        },
                        {
                            field: 'comment',
                            title: '备注',
                            sortable: true,
                            formatter: function (value, row) {
                                if ((row['yesterdayRecords'] == null||row['yesterdayRecords'] == '' )&& row['status'] == 'success' ) {
                                    return "昨日数据量异常，有可能是今日新增任务";
                                }else if(row['incrementRecords'] < '0' && row['status'] == 'success' ){
                                    return "今日数据量较之前减少，请检查任务";
                                }
                                else{
                                    return value;
                                }
                            },
                        },


                    ],
                    // data:info.data
                });
            }
            return oTableInit;
        }
        var oTable = new TableInit();
        oTable.init();
        $('#stopHistoryJobTable').bootstrapTable('hideLoading');
    }


}


function params(params) {

    if ($('#runday').val() == '') {
        $('#runday').val(getDate())
    }

    var temp = {
        status: $('#sqoopTableStatus').val(),
        dt: $('#runday').val(),
    };
    return temp;
}

function getDate() {
    /**
     　　* @Description: TODO 获取时间(yyyy-MM-dd)
     　　* @param
     　　* @return
     　　* @throws
     　　* @author lenovo
     　　* @date 2019/8/21 16:05
     　　*/
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth();//得到月份
    var date = now.getDate();//得到日期
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    var time = "";
    time = year + "-" + month + "-" + date;
    return time;
};

let JobLogTable = function (jobId) {
    let parameter = {jobId: jobId};
    let actionRow;
    let oTableInit = new Object();
    let onExpand = -1;
    let table = $('#sqoopLogDetailTable');
    let timerHandler = null;

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
                let logArea = $('#log_' + actionRow.id);
                logArea[0].innerHTML = data.log;
                logArea.scrollTop(logArea.prop("scrollHeight"), 200);
                actionRow.log = data.log;
                actionRow.status = data.status;
            }
        })
    }

    $('#sqoopJobLog').on('hide.bs.modal', function () {
        if (timerHandler != null) {
            window.clearInterval(timerHandler)
        }
    });

    $('#sqoopJobLog [name="refreshLog"]').on('click', function () {
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
                let tmp = {
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
                    title: "id",
                    width: "4%",
                    sortable: true
                }, {
                    field: "actionId",
                    title: "版本号",
                    width: "10%",
                    sortable: true
                }, {
                    field: "jobId",
                    title: "任务ID",
                    width: "6%",
                    sortable: true
                }, {
                    field: "executeHost",
                    title: "执行机器ip",
                    /* width: "8%",*/
                    sortable: true
                }, {
                    field: "status",
                    title: "执行状态",
                    /* width: "8%",*/
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
                    title: "执行人",
                    width: "8%",
                    sortable: true
                }, {
                    field: "startTime",
                    title: "开始时间",
                    /* width: "12%"*/
                    sortable: true
                }, {
                    field: "endTime",
                    title: "结束时间",
                    /*  width: "12%"*/
                    sortable: true
                }, {
                    field: 'runTime',
                    title: '运行时间',
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
                    sortable: true
                },

                {
                    field: "illustrate",
                    title: "说明",
                    /*width: "8%",*/
                    formatter: function (val) {
                        if (val == null) {
                            return val;
                        }
                        return '<label class="label label-default" style="width: 100%;" data-toggle="tooltip" title="' + val + '" >' + val.slice(0, 6) + '</label>';
                    },
                    sortable: true
                },
                {
                    field: "triggerType",
                    title: "触发类型",
                    /* width: "8%",*/
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
                    },
                    sortable: true
                },
                {
                    field: "status",
                    title: "操作",
                    /*  width: "10%",*/
                    sortable: true,
                    formatter: function (index, row) {
                        let html = '<a href="javascript:cancelJob(\'' + row['id'] + '\',\'' + row['jobId'] + '\')">取消任务</a>';
                        if (row['status'] == 'running') {
                            return html;
                        }
                    }
                }
            ],
            detailView: true,
            detailFormatter: function (index, row) {      /*background: #2c4762;*/
                let html = '<form role="form">' + '<div class="form-group" style="min-height:600px; overflow:scroll; background:#2D4761; color:#FFF; ">'
                    + '<div class="form-control"  style="border:none; height:600px; word-break: break-all; word-wrap:break-word; white-space:pre-line;font-family:Microsoft YaHei;background:#2D4761; color:#FFF" id="log_' + row.id + '">'
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

