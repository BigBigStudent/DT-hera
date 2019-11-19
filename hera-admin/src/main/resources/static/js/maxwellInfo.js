layui.use(['table', 'laytpl', 'form', 'laydate'], function () {

    let maxwellInfo = $('#maxwellInfo');
    maxwellInfo.parent().addClass('menu-open');
    maxwellInfo.parent().parent().addClass('menu-open');
    maxwellInfo.addClass('active');
    $('#MintorCenter').addClass('active');
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


    function getTableInfo() {
        /**
         　　* @Description: TODO 初始化table数据
         　　* @param
         　　* @return
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/21 15:11
         　　*/
        table.render({
            elem: '#maxwellPage'
            , height: "full"
            , url: base_url + '/selectMaxWellMonitorInfo'
            , page: {
                curr: 1
                , limits: [10]
            }
            , cols: [[ //表头
                {field: 'id', title: '序列', fixed: 'left', align: 'center', type: 'numbers'}
                , {field: 'server_id', title: 'maxwell任务ID', align: 'center'}
                , {field: 'client_id', title: 'maxwell任务名称', align: 'center'}
                , {field: 'messages_succeede', title: '成功发送条数', align: 'center'}
                , {field: 'messages_failed', title: '发送失败条数', align: 'center'}
                , {field: 'row_count', title: '已处理binlog条数', align: 'center'}
                , {field: 'publish_time', title: '消息发送时间(秒/条)', align: 'center'}
                , {field: 'binlog_file', title: 'binlog文件名称', align: 'center'}
                , {field: 'binlog_position', title: 'binlog偏移量', align: 'center'}
            ]]
        });
    }
    getTableInfo();

});


