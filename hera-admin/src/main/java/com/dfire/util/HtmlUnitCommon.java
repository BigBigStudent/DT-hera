package com.dfire.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.dfire.bean.AppInfos;
import com.dfire.bean.AppObject;
import com.dfire.bean.Apps;
import com.dfire.bean.ClusterMetrics;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.util.*;

/**
 * @ClassName HtmlUnitCommon
 * @Description TODO
 * @Author lenovo
 * @Date 2019/7/31 15:17
 **/
public class HtmlUnitCommon {


    public static ClusterMetrics selectClusterMetrics() {
        /**
         　　* @Description: TODO 获取集群资源概况数据
         　　* @param []
         　　* @return com.dfire.bean.ClusterMetrics
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/7 10:32
         　　*/
        String sendGet = HttpRequest.sendGet("http://master:8088/ws/v1/cluster/metrics", "");
        JSONObject jsonObject = JSON.parseObject(sendGet);
        String str = jsonObject.getString("clusterMetrics");
        ClusterMetrics clusterMetrics1 = JSON.parseObject(str, ClusterMetrics.class);
        return clusterMetrics1;
    }


    public static List<AppInfos> selectTaskInfoForFinish(String dateVal, String userVal) {
        /**
         　　* @Description: TODO 获取已完成任务详情
         　　* @param []
         　　* @return java.util.List<com.dfire.bean.AppInfos>
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/6 19:16
         　　*/
        List<AppInfos> appInfos = new ArrayList<>();
        try {
            String finishedTimeBegin = AppInfoDateUtil.getTodayZeroPointTimestamps() + "";
            String finishedTimeEnd = "" + new Date().getTime();
            if (StringUtils.isNotBlank(dateVal)) {
                finishedTimeBegin = AppInfoDateUtil.getStartTime(dateVal);
                finishedTimeEnd = AppInfoDateUtil.getEndTime(dateVal);
            }
            String temp = "&state=FINISHED&finishedTimeBegin=" + finishedTimeBegin + "&finishedTimeEnd=" + finishedTimeEnd;
            if (StringUtils.isNotBlank(userVal)) {
                temp += "&user=" + userVal;
            }
            String dataStr = HttpRequest.sendGet("http://master:8088/ws/v1/cluster/apps", temp);
            AppObject appObject = JSON.parseObject(dataStr, AppObject.class);
            Apps apps = appObject.getApps();
            if (apps==null){
                return appInfos;
            }
            appInfos = apps.getApp();
            Collections.sort(appInfos, (s1, s2) -> {
                return s2.getStartedTime().compareTo(s1.getStartedTime());
            });
            return appInfos;
        } catch (Exception e) {
            e.printStackTrace();
            return appInfos;
        }
    }

    public static List<AppInfos> selectTaskInfoForRUNNING(String userVal) {
        /**
         　　* @Description: TODO 获取运行中任务详情
         　　* @param []
         　　* @return java.util.List<com.dfire.bean.AppInfos>
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/6 19:17
         　　*/
        List<AppInfos> appInfos = new ArrayList<>();
        String temp = "limit=100&state=RUNNING";
        if (StringUtils.isNotBlank(userVal)) {
            temp += "&user=" + userVal;
        }
        try {
            String s = HttpRequest.sendGet("http://master:8088/ws/v1/cluster/apps", temp);
            JSONObject jsonObject = JSON.parseObject(s);
            JSONObject apps = jsonObject.getJSONObject("apps");
            String app = apps.getString("app");
            appInfos = JSON.parseArray(app, AppInfos.class);
            return appInfos;
        } catch (Exception e) {
            e.printStackTrace();
            return appInfos;
        }
    }

    public static float getNum(String string) {
        try {
            String[] split = string.split(" ");
            return Float.parseFloat(split[0].trim());
        } catch (NumberFormatException e) {
            e.printStackTrace();
            return 0;
        }
    }

    public static void main(String[] args) throws Exception {
        /*List<AppInfos> appInfos = selectTaskInfoForFinish();
        for (AppInfos appInfo : appInfos) {
            System.out.println(appInfo.getStartedTime());
        }*/
    }
}
