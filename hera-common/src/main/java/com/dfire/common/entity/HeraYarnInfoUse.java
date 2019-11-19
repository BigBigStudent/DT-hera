package com.dfire.common.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @ClassName HeraYarnInfoUse
 * @Description TODO
 * @Author lenovo
 * @Date 2019/9/2 15:51
 **/
public class HeraYarnInfoUse {
    private Long id;
    private String cpuUse;
    private String memUse;
    private String timePoint;
    private Date insertTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCpuUse() {
        return cpuUse;
    }

    public void setCpuUse(String cpuUse) {
        this.cpuUse = cpuUse;
    }

    public String getMemUse() {
        return memUse;
    }

    public void setMemUse(String memUse) {
        this.memUse = memUse;
    }

    public String getTimePoint() {
        return timePoint;
    }

    public void setTimePoint(String timePoint) {
        String sub=null;
        if(timePoint.length()>10){
            sub = timePoint.substring(0, timePoint.length() - 2);
        }else{
            sub=timePoint;
        }
        this.timePoint = sub;
    }

    public Date getInsertTime() {
        return insertTime;
    }

    public void setInsertTime(Date insertTime) {
        this.insertTime = insertTime;
    }
}
