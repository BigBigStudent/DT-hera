package com.dfire.common.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author: <a href="mailto:lingxiao@2dfire.com">凌霄</a>
 * @time: Created in 14:29 2018/3/22
 * @desc
 */
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HeraDebugHistory {

    private String id;

    private Integer fileId;

    private Date startTime;

    private Date endTime;

    private String executeHost;

    private String status;

    private String owner;

    private Date gmtCreate;

    private Date gmtModified;

    private String script;

    private String runType;

    private String log;

    private int hostGroupId;

    @Override
    public String toString() {
        return "HeraDebugHistory{" +
                "id='" + id + '\'' +
                ", fileId=" + fileId +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", executeHost='" + executeHost + '\'' +
                ", status='" + status + '\'' +
                ", owner='" + owner + '\'' +
                ", gmtCreate=" + gmtCreate +
                ", gmtModified=" + gmtModified +
                ", script='" + script + '\'' +
                ", runType='" + runType + '\'' +
                ", log='" + log + '\'' +
                ", hostGroupId=" + hostGroupId +
                '}';
    }
}
