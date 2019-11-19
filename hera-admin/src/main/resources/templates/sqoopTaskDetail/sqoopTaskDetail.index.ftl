<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>数据监控详情</title>
    <#import "/common/common.macro.ftl" as netCommon>
    <@netCommon.commonStyle />
    <link href="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link href="${request.contextPath}/adminlte/bootstrap/css/bootstrap-datetimepicker.min.css" rel="stylesheet"/>

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
        <!-- Content Header (Page header) -->

        <!-- Main content -->
        <section class="content container-fluid">

            <div class="row">
                <div class="col-lg-12">
                    <div class="box box-info">
                        <div class="box-header with-border">
                            <h3 class="box-title">数据监控详情</h3>
                            <div class="box-tools pull-right">
                                <#--<div class="layui-input-inline">
                                    <input type="text" class="form-control"  id="SqoopTaskKey" placeholder="请输入查询关键字" >
                                </div>-->

                                <label class="layui-label">调度状态:</label><#--style="width:100px;"-->
                                <div class="layui-input-inline">
                                    <select class="form-control" id="sqoopTableStatus"  onchange="updateSqoopTable()" ><#-- onchange="updateSqoopTable()"-->
                                        <option value="all" selected>全部</option>
                                        <option value="failed">异常</option>
                                        <option value="success" >正常</option>
                                    </select>                                </div>
                                &nbsp;
                                <label class="layui-label">日期:</label>
                                <div class="layui-input-inline">
                                    <input type="text" class="form-control" name="runday" id="runday" placeholder="请选择日期" readonly="true" onchange="updateSqoopTable()" >
                                </div>
                                <#--<button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                            class="fa fa-minus"></i>
                                </button>
                                <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                                            class="fa fa-times"></i></button>-->
                            </div>
                        </div>
                        <!-- /.box-header -->
                        <div class="box-body table-responsive">
                            <div >
                                <table id="sqoopTablesTable" class="table text-nowrap" <#--class="table-striped"--> ></table>
                            </div>
                        </div>
                        <!-- /.box-body -->
                    </div>
                </div>
            </div>
        </section>
    </div>

    <#--content-wrapper-->
</div>


<div class="modal fade" id="sqoopJobLog" tabindex="-1" role="dialog" aria-labelledby="sqoopJobLog" aria-hidden="true">
    <div class="modal-dialog" style="width: 90%">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">信息日志</h4>
            </div>

            <div class="modal-body">
                <table class="table " id="sqoopLogDetailTable"></table>
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
<script src="${request.contextPath}/js/sqoopTask/sqoopTaskDetail.js"></script>
<script src="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table-zh-CN.min.js"></script>


</html>