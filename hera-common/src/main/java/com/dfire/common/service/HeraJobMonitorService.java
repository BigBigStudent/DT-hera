package com.dfire.common.service;

import com.dfire.common.entity.HeraJobMonitor;
import com.dfire.common.entity.HeraUser;

import java.util.List;

/**
 * @author xiaosuda
 * @date 2018/8/1
 */
public interface HeraJobMonitorService {


    boolean addMonitor(String userId, Integer jobId);

    boolean removeMonitor(String userId, Integer jobId);


    HeraJobMonitor findByJobId(Integer jobId);


    //添加主动添加关注人员逻辑
    boolean addMonitors(String userIds, Integer jobId);


    boolean removeAllMonitor(Integer jobId);
}
