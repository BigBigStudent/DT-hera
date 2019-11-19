package com.dfire.common.service.impl;

import com.dfire.common.constants.Constants;
import com.dfire.common.entity.*;
import com.dfire.common.entity.model.JsonResponse;
import com.dfire.common.mapper.HeraJobActionMapper;
import com.dfire.common.mapper.HeraSqoopTaskMapper;
import com.dfire.common.service.HeraSqoopTaskService;
import com.dfire.common.util.WeiChatUtil;
import com.dfire.config.HeraGlobalEnvironment;
import com.dfire.logs.ErrorLog;
import com.dfire.logs.ScheduleLog;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.List;
import java.util.stream.Collectors;


/**
 * Created by E75 on 2019/10/28.
 */
@Service("HeraSqoopTaskServiceImpl")
public class HeraSqoopTaskServiceImpl implements HeraSqoopTaskService {


    @Autowired
    private HeraSqoopTaskMapper heraSqoopTaskMapper;

    @Override
    public int truncateTable() {
        return heraSqoopTaskMapper.truncateTable();
    }

    @Override
    public int insert(HeraSqoopTask heraSqoopTask) {
        return heraSqoopTaskMapper.insert(heraSqoopTask);
    }

    @Override
    public int deleteHeraSqoopTableByRunDay(String RunDay) {
        return heraSqoopTaskMapper.deleteHeraSqoopTableByRunDay(RunDay);
    }

    @Override
    public int insertSqoopTable(HeraSqoopTable heraSqoopTable) {
        return heraSqoopTaskMapper.insertSqoopTable(heraSqoopTable);
    }

    @Override
    public List<HeraSqoopTask> getAllSqoopTasks() {
        return  heraSqoopTaskMapper.getAllSqoopTasks();
    }

    /*@Override
    public List<HeraSqoopTask> getAllHdfsScriptTasks() {
        List<HeraSqoopTask> hdfsScriptTasks = heraSqoopTaskMapper.getHdfsScriptTasks();
        return hdfsScriptTasks;
    }

    @Override
    public List<HeraSqoopTask> getAllRealScriptTasks() {
        List<HeraSqoopTask> realScriptTasks = heraSqoopTaskMapper.getRealScriptTasks();
        return realScriptTasks;
    }

    @Override
    public int insertTasks(List<HeraSqoopTask> hst) {
        return heraSqoopTaskMapper.insertTasks(hst);
    }

    @Override
    public int updateTasks(List<HeraSqoopTask> hst) {
        return 0;
    }*/

    @Override
    public int batchInsert(List<HeraSqoopTask> hst) {
        return heraSqoopTaskMapper.batchInsert(hst);
    }

    @Override
    public List<HeraSqoopTask> getSqoopTasksImportFull() {
        return heraSqoopTaskMapper.getSqoopTasksImportFull();
    }

    @Override
    public List<HeraSqoopTask> getSqoopTasksImportIncrement() {
        return heraSqoopTaskMapper.getSqoopTasksImportIncrement();
    }

    @Override
    public String getYesterdayRecords(String yesterday, String jobId, String source) {
        return  heraSqoopTaskMapper.getYesterdayRecords(yesterday,jobId,source);
    }

    @Override
    public String getAvgRecords(String jobId, String source) {
        return  heraSqoopTaskMapper.getAvgRecords(jobId,source);
    }

    @Override
    public JsonResponse findSqoopTableByStatus(String status, String dt) {
        List<HeraSqoopTable> result = heraSqoopTaskMapper.findSqoopTableByStatus(status,dt);
        //System.err.println("result.size() :"+result.size());
        //System.err.println("status() :"+status);
        //System.err.println("dt() :"+dt);
        if (result == null) {
            return new JsonResponse(false, "今日同步数据为空");
        }
        return new JsonResponse("查询成功", true, result);
    }

    @Override
    public List<HeraSqoopTable> getAlarmInfo() {
        return heraSqoopTaskMapper.getAlarmInfo();
    }

    @Override
    public HeraJob findHeraUserById(String jobId) {

       // System.err.println("Impl jobId :"+jobId);
        return heraSqoopTaskMapper.findHeraUserById(jobId);
    }


    //getSqoopFailedNum

    @Override
    public String getSqoopFailedNum() {

        // System.err.println("Impl jobId :"+jobId);
        return heraSqoopTaskMapper.getSqoopFailedNum();
    }
}
