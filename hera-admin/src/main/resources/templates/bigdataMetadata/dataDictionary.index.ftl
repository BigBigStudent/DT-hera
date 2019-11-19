<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html" xmlns="http://www.w3.org/1999/html"
      xmlns="http://www.w3.org/1999/html">
<head>
    <title>任务调度平台</title>
<#import "/common/common.macro.ftl" as netCommon>
<@netCommon.commonStyle />
    <link href="${request.contextPath}/plugins/ztree/css/metroStyle/metroStyle.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/lib/codemirror.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/addon/hint/show-hint.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/eclipse.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/lucario.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/3024-day.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/3024-night.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/ambiance.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/base16-dark.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/base16-light.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/bespin.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/blackboard.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/colorforth.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/dracula.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/duotone-dark.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/duotone-light.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/erlang-dark.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/gruvbox-dark.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/mbo.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/material.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/solarized.css" rel="stylesheet">
    <link href="${request.contextPath}/plugins/codemirror/theme/base16-light.css" rel="stylesheet">
    <link href="${request.contextPath}/adminlte/plugins/bootstrap-fileinput/fileinput.min.css" rel="stylesheet">
    <link href="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table.min.css" rel="stylesheet">
    <link rel="stylesheet" href="${request.contextPath}/plugins/bootstrap-select/bootstrap-select.min.css">
    <link rel="stylesheet" href="${request.contextPath}/css/scheduleCenter.css">
    <script type="text/css">
        body .layer_bg .layui-layer-content{
            background-color: #eaf3fd;
        }
    </script>

<#--自己添加-->
<#--<link href="${request.contextPath}/css/developCenter.css" rel="stylesheet">-->
</head>


<body class="hold-transition skin-black sidebar-mini">
<div class="wrapper">
    <!-- header -->
<@netCommon.commonHeader />
    <!-- left -->
<@netCommon.commonLeft "developCenter" />

    <div class="content-wrapper">

        <section class="content">
            <div class="row">
                <div class="col-md-3 col-sm-3 col-lg-3 colStyle" style="border: none" id="treeCon">
                    <div class="height-self left-bar" style="overflow: auto;">
                        <div class="box-header left-bar-head">
                            <button class="btn  btn-sm btn-primary btn-block" type="button" id="allScheBtn">数据字典
                            </button>
                        </div>
                        <div class="box-body" style="height: 100%;padding-bottom: 10px;">
                            <div>
                                <input type="text" class="form-control" id="keyWords" placeholder="请输入关键词(空格分割,回车搜索)">
                                <p id="searchInfo" style="display: none">查找中，请稍候...</p>
                                <div class="scroll-box">
                                    <ul id="allTree" class="ztree"></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-9 col-sm-9 col-lg-9 colStyle height-self"
                     style="" id="showAllModal">
                    <div class="my-box" style="margin-top: 0">
                        <div id="tableMessage" class="box-body text-center" style="display: none">
                            <label class="info-title">数据描述</label>
                            <div class="box-tools pull-right" style="margin-top: 20px;margin-right: 20px">
                                <button class="btn  btn-xs btn-primary btn-block" type="button" name="edit">编辑
                                </button>
                            </div>

                            <form class="form-horizontal form-group-sm">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group">
                                            <label class="control-label input-sm col-sm-1">表名中文名:</label>
                                            <div class="col-sm-5">
                                                <input class="form-control" type="text" name="tableName1" readonly>
                                            </div>
                                            <label class="control-label input-sm col-sm-1">表英文名:</label>
                                            <div class="col-sm-5">
                                                <input class="form-control" type="text" name="tableName2"
                                                       id="out-info-title-name" readonly>
                                            </div>

                                        </div>

                                        <div class="form-group">
                                            <label class="control-label input-sm col-sm-1">创建时间:</label>
                                            <div class="col-sm-5">
                                                <input class="form-control" type="text" name="createTime" readonly>
                                            </div>

                                            <label class="control-label input-sm col-sm-1">最后修改时间:</label>
                                            <div class="col-sm-5">
                                                <input class="form-control" type="text" name="updateTime" readonly>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label class="control-label input-sm col-sm-1">修改人:</label>
                                            <div class="col-sm-5">
                                                <input class="form-control" type="text" name="tbOwner" readonly>
                                            </div>
                                            <label class="control-label input-sm col-sm-1">表状态:</label>
                                            <div class="col-sm-5">
                                                <select class="form-control" name="tableStatus" readonly>
                                                    <option value="1" selected="selected">可用</option>
                                                    <option value="0">废弃</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label input-sm col-sm-1">业务描述:</label>
                                            <div class="col-sm-5">
                                                <textarea class="form-control" type="text" name="business" readonly></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div id="tableField" class="box box-body text-center" style="display:none">
                            <label class="info-title" style="margin-right: 60px;">字段展示</label>
                            <table id="tableForHive" lay-filter="tableForHive"></table>
                        </div>
                        <div id="editTm" class="box-body text-center" style="display: none">
                            <label class="info-title">数据描述修改</label>
                            <div class="box-tools pull-right" style="margin-top: 20px;margin-right: 20px">
                                <div class="layui-input-inline">
                                    <button class="btn  btn-xs btn-primary btn-block" type="button" name="keep">保存
                                    </button>
                                </div>
                                <div class="layui-input-inline">
                                    <button class="btn  btn-xs btn-primary btn-block" type="button" name="back">返回
                                    </button>
                                </div>
                            </div>
                            <form class="form-horizontal form-group-sm">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="form-group">
                                            <label class="control-label input-sm col-sm-1">表名中文名:</label>
                                            <div class="col-sm-5">
                                                <input class="form-control" type="text" name="tableName1">
                                            </div>
                                            <label class="control-label input-sm col-sm-1">表英文名:</label>
                                            <div class="col-sm-5">
                                                <input class="form-control" type="text" name="tableName2"
                                                       id="out-info-title-name" readonly>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label input-sm col-sm-1">创建时间:</label>
                                            <div class="col-sm-5">
                                                <input class="form-control" type="text" name="createTime" readonly>
                                            </div>
                                            <label class="control-label input-sm col-sm-1">最后修改时间:</label>
                                            <div class="col-sm-5">
                                                <input class="form-control" type="text" name="updateTime" readonly>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label input-sm col-sm-1">修改人:</label>
                                            <div class="col-sm-5">
                                                <input class="form-control" type="text" name="tbOwner" readonly>
                                            </div>
                                            <label class="control-label input-sm col-sm-1">表状态:</label>
                                            <div class="col-sm-5">
                                                <select id="selectTStatus"
                                                        class="form-control" name="tableStatus">
                                                    <option value="1" selected="selected">可用</option>
                                                    <option value="0">废弃</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="control-label input-sm col-sm-1">业务描述:</label>
                                            <div class="col-sm-5">
                                                <textarea class="form-control" type="text" name="business"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

</div>

<#--定时表达式模态框-->
<!-- /.modal -->


<script>

    //id="addWheelFunc"
    //item
    //$('#addWheelFunc').addEventListener("wheel", addWheelFunc())


</script>


<@netCommon.commonScript />

<script src="${request.contextPath}/plugins/ztree/js/jquery.ztree.core.min.js"></script>
<script src="${request.contextPath}/plugins/ztree/js/jquery.ztree.exedit.min.js"></script>
<script src="${request.contextPath}/plugins/ztree/js/jquery.ztree.excheck.min.js"></script>
<script src="${request.contextPath}/plugins/ztree/js/jquery.ztree.exhide.min.js"></script>
<script src="${request.contextPath}/plugins/codemirror/lib/codemirror.js"></script>
<script src="${request.contextPath}/plugins/codemirror/mode/shell/shell.js"></script>
<script src="${request.contextPath}/plugins/codemirror/addon/hint/anyword-hint.js"></script>
<script src="${request.contextPath}/plugins/codemirror/addon/hint/show-hint.js"></script>
<script src="${request.contextPath}/plugins/codemirror/addon/hint/sql-hint.js"></script>
<script src="${request.contextPath}/plugins/codemirror/addon/hint/active-line.js"></script>
<script src="${request.contextPath}/plugins/codemirror/mode/python/python.js"></script>
<script src="${request.contextPath}/plugins/codemirror/mode/sql/sql.js"></script>
<script src="${request.contextPath}/adminlte/plugins/bootstrap-fileinput/fileinput.min.js"></script>
<script src="${request.contextPath}/adminlte/plugins/bootstrap-fileinput/zh.min.js"></script>

<script src="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="${request.contextPath}/adminlte/plugins/bootstrap-table/bootstrap-table-zh-CN.min.js"></script>
<script src="${request.contextPath}/plugins/d3/dagre-d3.js"></script>
<script src="${request.contextPath}/plugins/d3/d3.v3.min.js"></script>
<script src="${request.contextPath}/plugins/bootstrap-select/bootstrap-select.min.js"></script>
<script src="${request.contextPath}/js/taskGraph.js?v=2"></script>
<script src="${request.contextPath}/js/dataDictionary.js"></script>
<script src="${request.contextPath}/js/common.js"></script>

<#--自己添加-->
<#--<script src="${request.contextPath}/js/developCenter.js?v=1"></script>-->


</body>

</html>


