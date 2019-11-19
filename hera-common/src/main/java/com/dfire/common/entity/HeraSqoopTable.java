package com.dfire.common.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by E75 on 2019/10/30.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HeraSqoopTable {

   // private String id;
    private String jobId;//任务id
    private String source;//源表
    private String target;//目标表
    private String fileSize;//文件大小
    private String spendTime;//耗时
    private String speed;//网速
    private String records;//同步条数
    private String yesterdayRecords;//昨日同步条数
    private String avgRecords;//前6天平均同步条数
    private String incrementRecords;//增长条数
    private int updateDirection;//同步方向，0：导入，1：导出
    private int updateType;//同步类型，0：全量，1：增量
    private String runDay;//任务运行时间
    private String comment;//备注
    private String status;//状态



    @Override
    public String toString() {
        return "HeraSqoopTable{" +
                "jobId='" + jobId + '\'' +
                ", source='" + source + '\'' +
                ", target='" + target + '\'' +
                ", fileSize='" + fileSize + '\'' +
                ", spendTime='" + spendTime + '\'' +
                ", speed='" + speed + '\'' +
                ", records='" + records + '\'' +
                ", yesterdayRecords='" + yesterdayRecords + '\'' +
                ", updateDirection=" + updateDirection +
                ", updateType=" + updateType +
                ", runDay='" + runDay + '\'' +
                ", comment='" + comment + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
