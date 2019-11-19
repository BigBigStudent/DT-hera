package com.dfire.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.dfire.bean.MaxWellMonitorInfo;
import com.dfire.logs.DebugLog;

/**
 * @ClassName MaxWellForInfoUtil
 * @Description TODO
 * @Author lenovo
 * @Date 2019/10/24 14:52
 **/
public class MaxWellForInfoUtil {
    public static MaxWellMonitorInfo getInfo(){
        MaxWellMonitorInfo maxWellMonitorInfo = JdbcUtil.excuteQuery(MaxWellMonitorInfo.class, "select server_id,binlog_file,binlog_position,client_id from positions");
        String str = HttpRequest.sendGet("http://nfbigdata-82:8080/metrics?useSSl=false");
        JSONObject jsonObject = JSON.parseObject(str);
        JSONObject counters = jsonObject.getJSONObject("counters");
        JSONObject timers = jsonObject.getJSONObject("timers");
        JSONObject publish = timers.getJSONObject("MaxwellMetrics.message.publish.time");
        JSONObject failed = counters.getJSONObject("MaxwellMetrics.messages.failed");
        JSONObject succeeded = counters.getJSONObject("MaxwellMetrics.messages.succeeded");
        JSONObject row = counters.getJSONObject("MaxwellMetrics.row.count");
        double mean = publish.getDoubleValue("mean");
        maxWellMonitorInfo.setMessages_failed(failed.getLongValue("count"));
        maxWellMonitorInfo.setMessages_succeede(succeeded.getLongValue("count"));
        maxWellMonitorInfo.setRow_count(row.getLongValue("count"));
        maxWellMonitorInfo.setPublish_time(mean);
        return maxWellMonitorInfo;
    }

    public static int getMaxWellCount(){
        String str = HttpRequest.sendGet("http://nfbigdata-82:8080/metrics?useSSl=false");
        JSONObject jsonObject = JSON.parseObject(str);
        JSONObject counters = jsonObject.getJSONObject("counters");
        JSONObject failed = counters.getJSONObject("MaxwellMetrics.messages.failed");
        return failed.getIntValue("count");
    }


    public static void main(String[] args) {
        getInfo();
    }
}
