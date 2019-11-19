package com.dfire.common.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 *
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HeraSqoopTask  {

    private String id;
    private String jobId;
    private String actionId;
    private String log;
    private int updateDirection;//同步方向(0:导入,1:导出)
    private int updateType;   //0为全量，1为增量
    private String script;
    private String status;//任务状态
    private String insertDay;//数据插入日期
    private String runDay;//任务发生日期/天
    private String endTime;//任务结束时间
    private int tabNum;

    @Override
    public String toString() {
        return "HeraSqoopTask{" +
                "id='" + id + '\'' +
                ", jobId='" + jobId + '\'' +
                ", actionId='" + actionId + '\'' +
                ", log='" + log + '\'' +
                ", updateDirection=" + updateDirection +
                ", updateType=" + updateType +
                ", script='" + script + '\'' +
                ", status='" + status + '\'' +
                ", insertDay='" + insertDay + '\'' +
                ", runDay='" + runDay + '\'' +
                ", endTime='" + endTime + '\'' +
                ", tabNum=" + tabNum +
                '}';
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getActionId() {
        return actionId;
    }

    public void setActionId(String actionId) {
        this.actionId = actionId;
    }

    public String getLog() {
        return log;
    }

    public void setLog(String log) {
        this.log = log;
    }

    public int getUpdateDirection() {
        return updateDirection;
    }

    public void setUpdateDirection(int updateDirection) {
        this.updateDirection = updateDirection;
    }

    public int getUpdateType() {
        return updateType;
    }

    public void setUpdateType(int updateType) {
        this.updateType = updateType;
    }

    public String getScript() {
        return script;
    }

    public void setScript(String script) {
        this.script = script;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getInsertDay() {
        return insertDay;
    }

    public void setInsertDay(String insertDay) {
        this.insertDay = insertDay;
    }

    public String getRunDay() {
        return runDay;
    }

    public void setRunDay(String runDay) {
        this.runDay = runDay;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public int getTabNum() {
        return tabNum;
    }

    public void setTabNum(int tabNum) {
        this.tabNum = tabNum;
    }
}
