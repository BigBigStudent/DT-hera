package com.dfire.api;

import com.dfire.common.util.ActionUtil;

import java.util.Calendar;

/**
 * Created by E75 on 2019/5/27.
 */
public class TestParamters {
    public static void main(String[] args) {

        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_YEAR, -6);
        Long lastDate = Long.parseLong(ActionUtil.getActionVersionByDate(calendar.getTime()));
        System.out.println(lastDate);//201905210000000000
    }
}
