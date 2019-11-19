layui.use(['table', 'laytpl', 'form', 'laydate'], function () {
//$(function () {
    let workManage = $('#offlineTaskMonitoring');
    workManage.parent().addClass('menu-open');
    workManage.parent().parent().addClass('menu-open');
    workManage.addClass('active');
    $('#MintorCenter').addClass('active');
    let table = layui.table, laytpl = layui.laytpl, form = layui.form, laydate = layui.laydate;

    let tableIns;
    let taskSv = $("#taskStatus").val();
    let dateVal = $("#dateInput").val();
    let userVal = $("#userInput").val();


    tableIns = table.render({
        elem: '#offlineTaskInfo'
        , height: "full"
        , url: base_url + '/offlineTaskMonitoring/taskInfo'
        , where: {
            taskSv: taskSv
            , dateVal: dateVal
            , userVal: userVal
        }
        , page: true //开启分页
        //, toolbar: '#toolbar'
        //, defaultToolbar: ['filter', 'print', 'exports']
        , cols: [[ //表头
            {field: 'id', title: '任务id', fixed: 'left', align: 'center'}
            , {field: 'user', title: '用户名称', align: 'center'}
            , {field: 'name', title: '任务名称', align: 'center'}
            , {field: 'applicationType', title: '任务类型', align: 'center'}
            , {field: 'startedTime', title: '开始时间', align: 'center'}
            , {field: 'allocatedVCores', title: '使用核数', align: 'center', sort: true}
            , {field: 'allocatedMB', title: '使用内存', align: 'center', sort: true}
            , {field: 'progress', title: '进程', align: 'center'}
        ]]
    });

    //TODO  无效 需check
    form.verify({
        ip: [
            /^(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|[1-9])(\.(1\d{2}|2[0-4]\d|25[0-5]|[1-9]\d|\d)){3}$/
            , '密码必须6到12位，且不能出现空格'
        ]
    });

    $("#taskStatus").change(function (e) {
        getTable()
    });


    laydate.render({
        elem: '#dateInput'
        , min: -6
        , max: 0
        , done: function (value, date) {
            getTable(value);
        }
    });

    $(function () {
        document.onkeydown = function (e) {
            var ev = document.all ? window.event : e;
            if (ev.keyCode == 13) {
                getTable();
            }
        }
    })


    function getTable(v) {
        dateVal = $("#dateInput").val();
        taskSv = $("#taskStatus").val()
        userVal = $("#userInput").val();
        if (taskSv == 1) {
            tableIns.reload({
                where: {
                    taskSv: taskSv
                    , dateVal: dateVal
                    , userVal: userVal
                }
                , page: {
                    curr: 1
                }
                , initSort: {
                    field: 'spendTime'
                }
                , cols: [[ //表头
                    {field: 'id', title: '任务id', fixed: 'left', align: 'center'}
                    , {field: 'user', title: '用户名称', align: 'center'}
                    , {field: 'name', title: '任务名称', align: 'center'}
                    , {field: 'applicationType', title: '任务类型', align: 'center'}
                    , {field: 'startedTime', title: '开始时间', align: 'center'}
                    , {field: 'finishedTime', title: '完成时间', align: 'center'}
                    , {field: 'spendTime', title: '运行时间', align: 'center', sort: true}
                ]]
            })
        } else if (taskSv == 0 && v == undefined) {
            tableIns.reload({
                where: {
                    taskSv: taskSv
                    , dateVal: dateVal
                    , userVal: userVal
                }
                , page: {
                    curr: 1
                }
                , initSort: {
                    field: 'allocatedMB'
                    , field: 'allocatedVCores'
                }
                , cols: [[ //表头
                    {field: 'id', title: '任务id', fixed: 'left', align: 'center'}
                    , {field: 'user', title: '用户名称', align: 'center'}
                    , {field: 'name', title: '任务名称', align: 'center'}
                    , {field: 'applicationType', title: '任务类型', align: 'center'}
                    , {field: 'startedTime', title: '开始时间', align: 'center'}
                    , {field: 'allocatedVCores', title: '使用核数', align: 'center', sort: true}
                    , {field: 'allocatedMB', title: '使用内存', align: 'center', sort: true}
                    , {field: 'progress', title: '进程', align: 'center'}
                ]]
            })
        }
    }
});


$(function () {

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

    let dateStr = getDate();
    $("#timePoint").val(dateStr);
    layui.use(['laydate'], function () {
        let laydate = layui.laydate
        laydate.render({
            elem: '#timePoint'
            , min: -6
            , max: 0
            , done: function (value, date) {
                initPic(value);
            }
        });
    })

    function lineRow(name, data) {
        this.name = name;
        this.type = 'line';
        this.smooth=0.3
        this.data = data;
        this.markPoint = {
            data: [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'}
            ]
        };
    }

    function boom(date) {
        this.startValue = date
        this.start=88
        this.end=100
    }

    function initOption() {
        option.series = [];
        option.dataZoom = [];
        option.title = {};
        option.legend = {};
        option.xAxis = {};
        option.tooltip = {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        };
    }

    var option = {
        title: {
            show: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: [],
            selected: {}
        },
        grid:{
            x:100,
            x2:100,
        },
        toolbox: {
            show: false,
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        xAxis: [],
        yAxis: [],
        dataZoom: [],
        series: []
    };


    function initLineYarnInfo(data) {
        initOption();
        option.xAxis.boundaryGap = false;
        option.xAxis.type = "category";
        option.legend.data = ['cpu使用率', 'mem使用率'];

        option.yAxis = {
            type: 'value',
            axisLabel: {
                formatter: '{value}%'
            }
        };

        var xData = new Array();
        var cpuUse = new Array();   //cpu使用率
        var memUse = new Array();   //mem使用率
        data.forEach(function (one, index) {
            xData[index] = one.timePoint;
            cpuUse[index] = Math.round(one.cpuUse * 100);
            memUse[index] = Math.round(one.memUse * 100);
        })
        option.xAxis.data = xData
        option.series[0] = new lineRow('cpu使用率', cpuUse);
        option.series[1] = new lineRow('mem使用率', memUse);
        if (data.length != 0) {
            option.dataZoom[0] = new boom(dateStr)
        } else {
            delete option.dataZoom;
        }
        var myChart = echarts.init(document.getElementById('yarnInfoUse'));
        myChart.setOption(option,true)
    }


    function initPic(date) {
        if (date != undefined && date != '' && date != null) {
            dateStr = date
        } else {
            dateStr = getDate()
        }
        jQuery.ajax({
            url: base_url + "/offlineTaskMonitoring/selectHeraYarnInfoUseList",
            type: "get",
            data: "timePoint=" + dateStr,
            success: function (data) {
                if (data.success == false) {
                    //layer.msg(data.message);
                    console.log(data.message)
                    return;
                }
                initLineYarnInfo(data.data);
            }
        });
    }

    //todo 初始化折线图
    initPic();

})

$(function () {

    var info = {};
    var ramOption = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
            {
                name: '内存使用情况',
                type: 'gauge',
                detail: {formatter: '{value}%'},
                data: [{value: 50, name: '内存占用'}]
            }
        ]
    };

//内存仪表板
    function initMachine() {
        $.ajax({
            url: base_url + '/offlineTaskMonitoring/list',
            type: 'get',
            success: function (data) {
                //机器选择
                initInfo(data);
            }
        })
    }

    function initInfo(data) {
        console.log(data)
        var pM = (data.data[0].allocatedMB / data.data[0].totalMB) * 100
        var pC = (1 - data.data[0].allocatedVirtualCores / data.data[0].totalVirtualCores) * 100
        //系统概况
        ramOption.series[0].data[0].value = Math.round(pM);
        var myChart = echarts.init(document.getElementById('ramGauge'));
        myChart.setOption(ramOption, true);


        $('#CPUPercent').easyPieChart({
            animate: 1000,
            barColor: '#1DB0B8',
            onStep: function (from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            },
            size: 200,
            lineWidth: 10,
            scaleColor: '#666'
        });
        $('#CPUPercent').data('easyPieChart').update(0);
        $('#CPUPercent').data('easyPieChart').update(parseInt(pC));
    }

    initMachine();
})

