package com.dfire.util;

import org.apache.commons.lang3.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * @ClassName AppInfoDateUtil
 * @Description TODO
 * @Author lenovo
 * @Date 2019/8/6 13:56
 **/
public class AppInfoDateUtil {
    public static String timeStamp2Date(String time, String format) {
        /**
         　　* @Description: TODO 将时间戳格式转化str
         　　* @param [time, format]
         　　* @return java.lang.String
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/6 15:42
         　　*/
        if (StringUtils.isBlank(time)) {
            return null;
        }
        if (time.length() < 13) {
            time = time + "000";
        }
        if (StringUtils.isBlank(format)) {
            format = "yyyy-MM-dd HH:mm:ss";
        }
        SimpleDateFormat sdf = new SimpleDateFormat(format);
        String dateStr = sdf.format(new Date(Long.valueOf(time)));
        return dateStr;
    }

    public static Long getTodayZeroPointTimestamps() {
        /**
         　　* @Description: TODO 获取当天的0点时间戳
         　　* @param []
         　　* @return java.lang.Long
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/6 15:42
         　　*/
        Long currentTimestamps = System.currentTimeMillis();
        Long oneDayTimestamps = Long.valueOf(60 * 60 * 24 * 1000);
        return currentTimestamps - (currentTimestamps + 60 * 60 * 8 * 1000) % oneDayTimestamps;
    }

    public static String getSpendTime(String start, String end) {
        long l = Long.valueOf(end.trim()) - Long.valueOf(start.trim());
        return formatDateTime(l);
    }

    public static String getStartTime(String dateVal){
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date date = sdf.parse(dateVal);
            return  date.getTime()+"";
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }
    public static String getEndTime(String dateVal){
        Calendar instance = Calendar.getInstance();
        try {
            Date parse = new SimpleDateFormat("yyyy-MM-dd").parse(dateVal);
            instance.setTime(parse);
            int day = instance.get(Calendar.DATE);
            instance.set(Calendar.DATE, day+1);
            return instance.getTime().getTime()+"";
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }


    public static String getSpendTime2(String start ,String end){
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String s=null;
        try {
            Long begin = sdf.parse(start).getTime();
            Long over = sdf.parse(end).getTime();
            s= formatDateTime(over - begin);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }

        return s;
    }

    public static String formatDateTime(long mss) {
        long days = mss / (24 * 60 * 60 * 1000);
        long hours = (mss / (60 * 60 * 1000) - days * 24);
        long minutes = ((mss / (60 * 1000)) - days * 24 * 60 - hours * 60);
        long seconds = (mss / 1000 - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60);
        String dateTimes = "";
        if (days > 0) {
            dateTimes = days + "天" + hours + "小时" + minutes + "分钟" + seconds + "秒";
        } else if (hours > 0) {
            dateTimes = hours + "小时" + minutes + "分钟" + seconds + "秒";
        } else if (minutes > 0) {
            dateTimes = minutes + "分钟" + seconds + "秒";
        } else {
            dateTimes = seconds + "秒";
        }
        return dateTimes;
    }

    public static void main(String[] args) {
        String s = timeStamp2Date("1565141877000", null);
        System.out.println(s);
    }

}
