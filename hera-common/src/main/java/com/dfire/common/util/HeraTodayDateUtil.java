package com.dfire.common.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by E75 on 2019/10/29.
 */
public class HeraTodayDateUtil {

    public static String getTodayTime() {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
        return df.format(new Date());
    }

    public static String getToday() {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");//设置日期格式
        return df.format(new Date());
    }

    public static String getYesterday() {
        DateFormat dateFormat=new SimpleDateFormat("yyyy-MM-dd");
        Calendar calendar=Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY,-24);
        return dateFormat.format(calendar.getTime());
    }


    public static void main(String[] args) {
        System.out.println(getTodayTime());
        System.out.println(getToday());
        System.out.println(getYesterday());


    }


}
