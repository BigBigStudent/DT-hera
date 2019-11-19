package com.dfire.common.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author: <a href="mailto:lingxiao@2dfire.com">凌霄</a>
 * @time: Created in 13:59 2017/12/30
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HeraJob {

    private int id;

    private Integer auto;

    private String configs;

    private String cronExpression;

    private String cycle;

    private String dependencies;

    private String description;

    private Date gmtCreate;

    private Date gmtModified;

    private Integer groupId;

    private String historyId;

    private String host;

    private Date lastEndTime;

    private String lastResult;

    private String name;

    private String offset;

    private String owner;

    private String postProcessors;

    private String preProcessors;

    private String readyDependency;

    private String resources;


    private String runType;

    private Integer scheduleType;

    private String script;

    private Date startTime;

    private Long startTimestamp;

    private Date statisticEndTime;

    private Date statisticStartTime;

    private String status;

    private String timezone;

    private int hostGroupId;

    private String areaId;

    private Long mustEndMinute;

    private short repeatRun;


    public String toString1() {
        return "HeraJob{" +
                "  <br/>nid=" + id +
                ", <br/>nauto=" + auto +
                ", <br/>nconfigs='" + configs + '\'' +
                ", <br/>cronExpression='" + cronExpression + '\'' +
                ", <br/>ncycle='" + cycle + '\'' +
                ", <br/>dependencies='" + dependencies + '\'' +
                ", <br/>description='" + description + '\'' +
                ", <br/>gmtCreate=" + gmtCreate +
                ", <br/>gmtModified=" + gmtModified +
                ", <br/>groupId=" + groupId +
                ", <br/>historyId='" + historyId + '\'' +
                ", <br/>host='" + host + '\'' +
                ", <br/>lastEndTime=" + lastEndTime +
                ", <br/>lastResult='" + lastResult + '\'' +
                ", <br/>name='" + name + '\'' +
                ", <br/>offset='" + offset + '\'' +
                ", <br/>owner='" + owner + '\'' +
                ", <br/>postProcessors='" + postProcessors + '\'' +
                ", <br/>preProcessors='" + preProcessors + '\'' +
                ", <br/>readyDependency='" + readyDependency + '\'' +
                ", <br/>resources='" + resources + '\'' +
                ", <br/>runType='" + runType + '\'' +
                ", <br/>scheduleType=" + scheduleType +
                ", <br/>script='" + script + '\'' +
                ", <br/>startTime=" + startTime +
                ", <br/>startTimestamp=" + startTimestamp +
                ", <br/>statisticEndTime=" + statisticEndTime +
                ", <br/>statisticStartTime=" + statisticStartTime +
                ", <br/>status='" + status + '\'' +
                ", <br/>timezone='" + timezone + '\'' +
                ", <br/>hostGroupId=" + hostGroupId +
                ", <br/>areaId='" + areaId + '\'' +
                ", <br/>mustEndMinute=" + mustEndMinute +
                ", <br/>repeatRun=" + repeatRun +
                '}';
    }
}
