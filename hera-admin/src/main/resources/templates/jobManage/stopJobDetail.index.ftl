<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>关闭任务详情</title>
<#import "/common/common.macro.ftl" as netCommon>
<@netCommon.commonStyle />
    <link href="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="${request.contextPath}/adminlte/bootstrap/css/bootstrap-datetimepicker.min.css" rel="stylesheet" />

    <style>
        .table-hover > tbody > tr:hover {
            cursor: pointer;
        }

        #toolbar {
            margin-bottom: 4px;
        }
    </style>
</head>

<body class="hold-transition skin-black sidebar-mini">
<div class="wrapper">
    <!-- header -->
<@netCommon.commonHeader />
    <!-- left -->
<@netCommon.commonLeft "developCenter" />

    <div class="content-wrapper">
        <section class="content">
            <div class="box">
                <div class="box-body">
                    <div class="input-group form-inline col-lg-3 pull-right" style="margin-left: 100px">
                        <label class="name input-group-addon">任务状态</label><#--style="width:100px;"-->
                        <select class="form-control" id="stopJobStatus" onchange="updateStopTable()" >
                           <option value="all">全部</option>
                            <option value="failed">失败</option>
                            <option value="success" selected="selected">成功</option>
                            <option value="running">运行中</option>
                            <option value="noRun">未运行</option>
                            <option value="wait">等待</option>
                            <option value="stop" >关闭</option>
                            <option value="disabled">失效</option>
                        </select>
                        <label class="name input-group-addon">日期</label>
                        <input class="form_datetime form-control" id="stopJobDt" size="12" type="text" readonly placeholder="请选择日期"  onchange="updateStopTable()">
                        <input type="hidden" id="syFlag" name="syFlag" value="${syFlag}">
                    </div>

                    <table id="stopHistoryJobTable" class="table-striped" <#--style="display: none"-->></table>
                    <#--<table id="historyJobTable" class="table-striped" &lt;#&ndash;style="display: none"&ndash;&gt;></table>-->

                </div>
            </div>
        </section>
    </div>
</div>

<div class="modal fade" id="stopJobLog" tabindex="-1" role="dialog" aria-labelledby="stopJobLog" aria-hidden="true">
    <div class="modal-dialog" style="width: 90%">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">信息日志</h4>
            </div>

            <div class="modal-body">
                <table class="table " id="stopRunningLogDetailTable"></table>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">返回</button>
                <button type="button" class="btn btn-info add-btn" name="refreshLog">刷新</button>
            </div>
        </div>
    </div>
</div>

</body>

<@netCommon.commonScript />
<script src="${request.contextPath}/js/stopJobDetail.js"></script>
<script src="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table-zh-CN.min.js"></script>
<script src="${request.contextPath}/adminlte/bootstrap/js/bootstrap-datetimepicker.min.js"></script>
<script src="${request.contextPath}/adminlte/bootstrap/js/bootstrap-datetimepicker.zh-CN.js"></script>

<script type="text/javascript">
    $(".form_datetime").datetimepicker({
        format: "yyyy-mm-dd",
        autoclose: true,
        todayBtn: true,
        todayHighlight: true,
        language: 'zh-CN',//中文，需要引用zh-CN.js包
        startView: 2,//月视图
        minView: 2,//日期时间选择器所能够提供的最精确的时间选择视图
    });
</script>

<script>
    $(document).ready(function () {
        var time = new Date();
        var day = ("0" + time.getDate()).slice(-2);
        var month = ("0" + (time.getMonth() + 1)).slice(-2);
        var today = time.getFullYear() + "-" + (month) + "-" + (day);
        $(".form_datetime").val(today);
    })
</script>

</html>