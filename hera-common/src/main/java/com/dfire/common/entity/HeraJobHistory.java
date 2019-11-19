package com.dfire.common.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author: <a href="mailto:lingxiao@2dfire.com">凌霄</a>
 * @time: Created in 17:31 2018/1/11
 * @desc
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HeraJobHistory {
   // @Select("select round(TIMESTAMPDIFF(second,his.start_time,his.end_time),2) run_time,


    //from hera_action_history where job_id = #{jobId} order by id desc limit #{offset,jdbcType=INTEGER},#{pageSize,jdbcType=INTEGER} ")


    String properties;

    private String runTime;  // run_time

    private String id;  // id,
    private String actionId; // action_id,
    private Integer jobId; // job_id,
    private Date startTime; // start_time,
    private Date endTime;// end_time,
    private String executeHost;// execute_host,
    private String operator; // operator,
    private String status;// status,
    private Integer triggerType;// trigger_type,
    private String illustrate; // illustrate,
    private Date statisticEndTime;
    private String log;
    private String timezone;
    private String cycle;
    private int hostGroupId;// host_group_id

    @Override
    public String toString() {
        return "HeraJobHistory{" +
                "properties='" + properties + '\'' +
                ", id='" + id + '\'' +
                ", actionId='" + actionId + '\'' +
                ", jobId=" + jobId +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", executeHost='" + executeHost + '\'' +
                ", operator='" + operator + '\'' +
                ", status='" + status + '\'' +
                ", triggerType=" + triggerType +
                ", illustrate='" + illustrate + '\'' +
                ", statisticEndTime=" + statisticEndTime +
                ", log='" + log + '\'' +
                ", timezone='" + timezone + '\'' +
                ", cycle='" + cycle + '\'' +
                ", hostGroupId=" + hostGroupId +
                '}';
    }
}
