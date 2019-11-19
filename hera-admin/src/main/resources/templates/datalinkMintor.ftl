<!DOCTYPE html>
<html>
<head>
    <title>任务调度平台</title>
<#import "/common/common.macro.ftl" as netCommon>
<@netCommon.commonStyle />
    <link rel="stylesheet" href="${request.contextPath}/plugins/easyPie/style.css">
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

        #machineList {
            width: auto;
            display: inline;
        }
    </style>
</head>


<body class="hold-transition skin-black sidebar-mini">


<div class="wrapper">

    <!-- header -->
<@netCommon.commonHeader />
    <!-- left -->
<@netCommon.commonLeft "index" />

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
        <!-- Content Header (Page header) -->

        <!-- Main content -->
        <section class="content container-fluid">

            <!--------------------------
              | Your Page Content Here |
              -------------------------->
            <div class="row" style="margin: 0px;">
                <div class="box box-info" style="overflow: hidden;">
                    <div class="box-header with-border">
                        <h3 class="box-title">实时任务监控</h3>
                        <div class="box-tools pull-right">
                        <#--<button type="button" class="btn btn-box-tool" data-widget="collapse"><i-->
                        <#--class="fa fa-minus"></i></button>-->
                        <#--<button type="button" class="btn btn-box-tool" data-widget="remove"><i-->
                        <#--class="fa fa-times"></i></button>-->
                            <button onclick="location.href='${request.contextPath}/datalinkMintor'" class="btn btn-box-tool">刷新
                            </button>
                            <#--<button onclick="location.href='${request.contextPath}/home'" class="btn btn-box-tool">关闭-->
                                <#--&lt;#&ndash;<i class="fa fa-times"></i>&ndash;&gt;</button>-->
                        </div>
                    </div>
                    <div>
                        <iframe src='http://188.166.1.90:8081/taskMonitor/taskMonitorList' style="height: 880px;width: 100%;border: 0px;">
                        <#--<iframe src='http://192.168.153.11:8080/taskMonitor/taskMonitorList' style="height: 880px;width: 100%;border: 0px;">-->
                    </div>
                </div>
            </div>


        </section>
        <!-- /.content -->
    </div>
    <!-- /.content-wrapper -->

    <!-- footer -->
<@netCommon.commonFooter />

</div>
<!-- ./wrapper -->
<@netCommon.commonScript />
<script src="${request.contextPath}/plugins/easyPie/jquery.easypiechart.min.js"></script>
<script src="${request.contextPath}/plugins/echarts/echarts.min.js"></script>
<script src="${request.contextPath}/plugins/echarts/PercentPie.js"></script>
<script src="${request.contextPath}/plugins/echarts/macarons.js"></script>
<script src="${request.contextPath}/plugins/echarts/shine.js"></script>

<#--<script src="${request.contextPath}/js/datalinkInfo.js"></script>-->

</body>
</html>
