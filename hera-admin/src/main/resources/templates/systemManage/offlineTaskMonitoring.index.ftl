<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html">
<head>
    <title>任务调度平台
    </title>
<#import "/common/common.macro.ftl" as netCommon>
<@netCommon.commonStyle />
    <link rel="stylesheet" href="${request.contextPath}/plugins/easyPie/style.css">
    <link href="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
</head>

<style>
    .my-easy-pie {
        text-align: center;
        margin-top: 50px;
        font-size: 20px;
        color: #666;
    }

    .btn-default {
        background-color: #fff !important;
        color: #444;
        border-color: #ddd;
    }

    .box-header {
        padding: 12px;
    }

    .table-hover > tbody > tr:hover {
        background-color: #fff;
    }

   /* #taskStatus {
        width: auto;
        display: inline;
    }*/

    #user {
        width: auto;
        display: inline;
    }


</style>

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

            <!--------------------------
              | Your Page Content Here |
              -------------------------->
            <div class="row">
                <div class="col-lg-12">
                    <div class="box box-danger">
                        <div class="box-header with-border">
                            <h3 class="box-title">集群资源使用概况</h3>
                            <div class="box-tools pull-right">
                                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                        class="fa fa-minus"></i></button>
                                <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                                        class="fa fa-times"></i></button>
                            </div>
                        </div>
                        <div class="box-body">
                            <div class="row">
                                <div class="col-md-2 col-sm-2 col-lg-2 my-easy-pie">
                                <#-- <div id="SysPercent" class="chart" data-percent="0">
                                        <span class="percent"></span>
                                    </div>
                                    <p>系统占用</p>-->
                                </div>
                                <div class="col-md-4 col-lg-4 col-sm-4">
                                    <div id="ramGauge" style="height: 450px;"></div>
                                </div>
                                <div class="col-md-2 col-sm-2 col-lg-2 my-easy-pie">
                                <#-- <div id="SysPercent" class="chart" data-percent="0">
                                        <span class="percent"></span>
                                    </div>
                                    <p>系统占用</p>-->
                                </div>
                                <div class="col-md-2 col-sm-2 col-lg-2 my-easy-pie">
                                    <div id="CPUPercent" class="chart" data-percent="0">
                                        <span class="percent"></span>
                                    </div>
                                    <p>CPU空闲</p>
                                </div>
                                <div class="col-md-2 col-sm-2 col-lg-2 my-easy-pie">
                                <#--<div id="SwapPercent" class="chart" data-percent="0">
                                        <span class="percent"></span>
                                    </div>
                                    <p>Swap空闲</p>-->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="box box-success">
                        <div class="box-header with-border">
                            <h3 class="box-title">资源使用详情</h3>
                            <div class="box-tools pull-right">
                                <div class="layui-input-inline">
                                    <input type="text" class="form-control" id="timePoint" placeholder="请选择日期"  readonly="true">
                                </div>
                                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                        class="fa fa-minus"></i></button>
                                <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                                        class="fa fa-times"></i></button>
                            </div>
                        </div>
                        <div id="yarnInfoUse" class="box-body" style="height: 500px;width: 100%;"></div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-lg-12">
                    <div class="box box-info">
                        <div class="box-header with-border">
                            <h3 class="box-title">任务资源使用详情</h3>
                            <div class="box-tools pull-right">
                                <div class="layui-input-inline">
                                    <input type="text" name="title" id="userInput" placeholder="请输入用户名" class="form-control">
                                </div>
                                <div class="layui-input-inline">
                                    <select id="taskStatus"
                                            class="form-control">
                                        <option value="0" selected="selected">执行中</option>
                                        <option value="1">已完成</option>
                                    </select>
                                </div>
                                <div class="layui-input-inline">
                                    <input type="text" class="form-control" id="dateInput" placeholder="请选择日期"  readonly="true">
                                </div>
                                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                        class="fa fa-minus"></i>
                                </button>
                                <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                                        class="fa fa-times"></i></button>
                            </div>
                        <#--<div class="box-tools pull-left">
                            <input type="text" name="title" required lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
                        </div>-->
                        </div>
                        <!-- /.box-header -->
                        <div class="box-body table-responsive">
                            <div id="processMonitor">
                                <table id="offlineTaskInfo" lay-filter="offlineTaskInfo"></table>
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
<@netCommon.commonScript />

<script src="${request.contextPath}/js/offlineTaskMonitoring.js"></script>
<script src="${request.contextPath}/plugins/easyPie/jquery.easypiechart.min.js"></script>
<script src="${request.contextPath}/plugins/echarts/echarts.min.js"></script>
<script src="${request.contextPath}/plugins/echarts/PercentPie.js"></script>
<script src="${request.contextPath}/plugins/echarts/macarons.js"></script>
<script src="${request.contextPath}/plugins/echarts/shine.js"></script>
<script src="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table-zh-CN.min.js"></script>
</body>

</html>


