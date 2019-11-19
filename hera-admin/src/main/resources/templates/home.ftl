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
            <div class="row" style="">
                <div class="col-lg-12">
                    <div class="box box-warning">
                        <div class="box-header with-border">
                            <h3 class="box-title">工作台</h3>
                            <div class="box-tools pull-right">
                                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                        class="fa fa-minus"></i></button>
                                <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                                        class="fa fa-times"></i></button>
                            </div>
                        </div>
                        <div class="box-body" style="height:120px;margin-top: 20px">
                            <div class="col-lg-1" style="height: 100px;margin-top: 0px">
                                <img src="${request.contextPath}/images/t2.png" style="height: 100px">
                            </div>
                            <div class="col-lg-5" style="margin-top: 10px">
                                <h3 id="userNameInfo">
                                </h3>
                                <div style="height: 30px"></div>
                                <h style="font-size: 15px">大数据 | 盈亚证劵咨询－杭州分公司－产品部－大数据组</h>
                            </div>
                            <div class="col-lg-3">
                            </div>
                            <div class="col-lg-3" style="margin-top: 20px">
                                <div>
                                    <table style="" class="table table-striped">
                                        <tbody>
                                        <tr>
                                            <td style="text-align: center">创建任务数</td>
                                            <td style="text-align: center">管理任务数</td>
                                            <td style="text-align: center">失败任务数</td>
                                        </tr>
                                        <tr>
                                            <td style="text-align: center"><a id="tdJobCount" href="${request.contextPath}/scheduleCenter?syFlag=1"></a></td>
                                            <td style="text-align: center" id="tdManJobCount"></td>
                                            <td style="text-align: center" ><a id="tdFailedJobCount" href="${request.contextPath}/stopJobDetail?syFlag=1"></a></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row" style="">
                <div class="col-lg-8">
                    <div class="box box-warning">
                        <div class="box-header with-border">
                            <h3 class="box-title">数据监测</h3>
                            <div class="box-tools pull-right">
                                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                        class="fa fa-minus"></i></button>
                                <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                                        class="fa fa-times"></i></button>
                            </div>
                        </div>
                        <div class="box-body" style="height: 350px">
                            <!-- small box -->
                            <div class="col-lg-4" style="margin-top: 30px;">
                                <div class="small-box bg-yellow-gradient">
                                    <div class="inner">
                                        <h3 id="allJobsNum">&nbsp;</h3>
                                        <p>离线任务开启数</p>
                                    </div>
                                    <div class="icon">
                                    <#--<i class="iconfont icon-home">&#xe668;</i>-->
                                        <i class="layui-icon layui-icon-rate-solid" style="font-size: 50px;"></i>
                                    </div>
                                    <a href="${request.contextPath}/stopJobDetail?syFlag=0" class="small-box-footer">More info <i
                                            class="fa fa-arrow-circle-right"></i></a>
                                </div>
                                <!-- ./col -->
                                <!-- small box -->
                                <div class="small-box bg-yellow-gradient" style="margin-top: 40px">
                                    <div class="inner">
                                        <h3 id="failedNum">&nbsp;</h3>
                                        <p>离线任务失败数</p>
                                    </div>
                                    <div class="icon">
                                    <#--<i class="iconfont icon-home">&#xe668;</i>-->
                                        <i class="layui-icon layui-icon-snowflake" style="font-size: 50px;"></i>
                                    </div>
                                    <a href="${request.contextPath}/stopJobDetail?syFlag=1" class="small-box-footer">More info <i
                                            class="fa fa-arrow-circle-right"></i></a>
                                </div>

                                <!-- small box -->


                            <#--<div class="col-lg-3 col-xs-6" style="margin-top: 10px;">
                                <!-- small box &ndash;&gt;
                                <div class="small-box bg-green">
                                    <div class="inner">
                                        <h3 id="datalinkTaskNum">&nbsp;</h3>
                                        <p>实时运行任务数</p>
                                    </div>
                                    <div class="icon">
                                        <i class="iconfont icon-home">&#xe6a4;</i>
                                    </div>
                                    <a href="${request.contextPath}/datalinkMintor" class="small-box-footer">实时任务详情<i
                                            class="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>-->
                            </div>
                            <div class="col-lg-4" style="margin-top: 30px;">
                                <div class="small-box bg-yellow-gradient">
                                    <div class="inner">
                                        <h3 id="dataFindNum">0</h3>
                                        <p>数据发现</p>
                                    </div>
                                    <div class="icon">
                                    <#--<i class="iconfont icon-home">&#xe668;</i>-->
                                        <i class="layui-icon layui-icon-search" style="font-size: 50px;"></i>
                                    </div>
                                    <a href="${request.contextPath}/bigdataMetadata/metadataMonitor" class="small-box-footer">More info <i
                                            class="fa fa-arrow-circle-right"></i></a>
                                </div>

                                <div class="small-box bg-yellow-gradient" style="margin-top: 40px">
                                    <div class="inner">
                                        <h3 id="maxwellCount"></h3>
                                        <p>实时任务监控</p>
                                    </div>
                                    <div class="icon">
                                    <#--<i class="iconfont icon-home">&#xe668;</i>-->
                                        <i class="layui-icon layui-icon-engine" style="font-size: 50px;"></i>
                                    </div>
                                    <a href="${request.contextPath}/maxwellInfo" class="small-box-footer">More info <i
                                            class="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                            <div class="col-lg-4" style="margin-top: 30px;">
                                <div class="small-box bg-yellow-gradient">
                                    <div class="inner">
                                        <h3 id="SqoopFailedCount"></h3>
                                        <p>数据质量</p>
                                    </div>
                                    <div class="icon">
                                    <#--<i class="iconfont icon-home">&#xe668;</i>-->
                                        <i class="layui-icon layui-icon-flag" style="font-size: 50px;"></i>
                                    </div>
                                    <a href="${request.contextPath}/sqoopTaskCenter/sqoopTaskDetail" class="small-box-footer">More info <i
                                            class="fa fa-arrow-circle-right"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="box box-warning">
                        <div class="box-header with-border">
                            <h3 class="box-title">实时任务状态</h3>
                            <div class="box-tools pull-right">
                                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                        class="fa fa-minus"></i></button>
                                <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                                        class="fa fa-times"></i></button>
                            </div>
                        </div>
                        <div id="jobStatus" class="box-body" style="height: 350px"></div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6">
                    <div class="box box-warning">
                        <div class="box-header with-border">
                            <h3 class="box-title">任务执行状态</h3>
                            <div class="box-tools pull-right">
                                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                        class="fa fa-minus"></i></button>
                                <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                                        class="fa fa-times"></i></button>
                            </div>
                        </div>
                        <div id="lineJobStatus" class="box-body" style="height: 500px"></div>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="box box-warning">
                        <div class="box-header with-border">
                            <h3 class="box-title">任务时长TOP10</h3>
                            <div class="box-tools pull-right">
                                <button type="button" class="btn btn-box-tool" data-widget="collapse"><i
                                        class="fa fa-minus"></i></button>
                                <button type="button" class="btn btn-box-tool" data-widget="remove"><i
                                        class="fa fa-times"></i></button>
                            </div>
                        </div>
                        <div id="jobTop" class="box-body" style="height: 500px"></div>
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

<script src="${request.contextPath}/js/home.js"></script>

</body>
</html>
