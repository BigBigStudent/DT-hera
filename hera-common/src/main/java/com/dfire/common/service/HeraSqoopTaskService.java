package com.dfire.common.service;

import com.dfire.common.entity.HeraJob;
import com.dfire.common.entity.HeraSqoopTable;
import com.dfire.common.entity.HeraSqoopTask;
import com.dfire.common.entity.model.JsonResponse;

import java.util.List;

public interface HeraSqoopTaskService {

    //将转换好的真实脚本的HeraSqoopTask更新到数据表hera_sqoop中
    int truncateTable();

    //单个插入
    int insert(HeraSqoopTask heraSqoopTask);

    //按天删除
    int deleteHeraSqoopTableByRunDay(String RunDay);

    //单个插入table详情
    int insertSqoopTable(HeraSqoopTable heraSqoopTable);

    //查找所有sqoop任务
    List<HeraSqoopTask> getAllSqoopTasks();

    //批量插入hera_sqoop表
    int batchInsert(List<HeraSqoopTask> hst);

    //查找全量导入sqoop任务
    List<HeraSqoopTask> getSqoopTasksImportFull();

    //查找增量导入sqoop任务
    List<HeraSqoopTask> getSqoopTasksImportIncrement();

    String getYesterdayRecords(String yesterday,String jobId,String source );

    String getAvgRecords( String jobId, String source);


    JsonResponse findSqoopTableByStatus(String status, String dt);


    List<HeraSqoopTable>  getAlarmInfo();

    HeraJob findHeraUserById(String jobId);

    String getSqoopFailedNum();

}
