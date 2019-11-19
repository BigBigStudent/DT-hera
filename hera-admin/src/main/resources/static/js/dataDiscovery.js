layui.use(['table', 'laytpl', 'form', 'laydate'], function () {

    let metadataMonitor = $('#metadataMonitor');
    metadataMonitor.parent().addClass('menu-open');
    metadataMonitor.parent().parent().addClass('menu-open');
    metadataMonitor.addClass('active');
    $('#bigdataMetadata').addClass('active');
    let table = layui.table, laytpl = layui.laytpl, form = layui.form, laydate = layui.laydate;

    let dateTime, queryData;


    function judgeFieldStatus(v) {
        if (v !== "" && v !== undefined && v !== null) {
            return true;
        } else {
            return false;
        }
    };

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
    let dateFlag = true


    function getTableInfo(dateVal) {
        /**
         　　* @Description: TODO 初始化table数据
         　　* @param
         　　* @return
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/21 15:11
         　　*/
        if (dateVal != undefined) {
            dateTime = dateVal
        }
        if (dateFlag) {
            dateTime = getDate()
            $("#dateTime").val(getDate())
            dateFlag = false
        }
        queryData = $("#queryData").val();
        table.render({
            elem: '#dataDiscovery'
            , height: "full"
            , url: base_url + '/bigdataMetadata/selectDataDiscovery'
            , where: {
                dt: dateTime
                , queryData: queryData
            }
            , page: {
                curr: 1
                , limits: [10, 50, 100]
            }
            , cols: [[ //表头
                {field: 'id', title: '序列', fixed: 'left', align: 'center', type: 'numbers'}
                , {field: 'tableSchema', title: '数据库名称', align: 'center'}
                , {field: 'tableName', title: '表名称', align: 'center'}
                , {
                    field: 'status', title: '状态', align: 'center', templet: function (d) {
                        if (d.status == "ins") {
                            return "新增"
                        } else {
                            return "更新"
                        }
                    }
                    , sort: true
                }
                , {field: 'dt', title: '发现时间', align: 'center', sort: true}
                , {field: 'tableComment', title: '表注释', align: 'center'}
            ]]
        });
    }

    table.on('sort(dataDiscovery)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        console.log(obj.field); //当前排序的字段名
        console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
        console.log(this); //当前排序的 th 对象
        table.reload('dataDiscovery', {
            initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。 layui 2.1.1 新增参数
            , where: { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
                field: obj.field //排序字段   在接口作为参数字段  field order
                , order: obj.type //排序方式   在接口作为参数字段  field order
            }
        });
    });
    getTableInfo();
    laydate.render({
        /**
         　　* @Description: TODO 初始化时间插件
         　　* @param
         　　* @return
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/21 15:11
         　　*/
        elem: '#dateTime'
        , min: -6
        , max: 0
        , done: function (value, date) {
            getTableInfo(value);
        }
    });

    $(function () {
        document.onkeydown = function (e) {
            var ev = document.all ? window.event : e;
            if (ev.keyCode == 13) {
                getTableInfo();
            }
        }
    });
});


