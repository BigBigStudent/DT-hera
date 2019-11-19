package com.dfire.common.mapper;

import com.dfire.common.entity.HeraJob;
import com.dfire.common.entity.HeraSqoopTable;
import com.dfire.common.entity.HeraSqoopTask;
import com.dfire.common.mybatis.HeraInsertLangDriver;
import com.dfire.common.mybatis.HeraUpdateLangDriver;
import com.dfire.common.mybatis.action.HeraActionBatchUpdateDriver;
import com.dfire.common.mybatis.sqoopTask.HeraSqoopTaskBatchInsertDriver;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * Created by E75 on 2019/10/28.
 */
public interface HeraSqoopTaskMapper {

    @Update("truncate table hera_sqoop_task")
    @Lang(HeraUpdateLangDriver.class)
    int truncateTable();

    //拿到今天所有的任务
    @Select("SELECT a.`job_id`,a.`action_id`,a.`log`,a.`status`,a.`end_time`,b.`script`" +
            ",0 + CAST( (LENGTH(a.`log`) - LENGTH(REPLACE (a.`log`, \"INFO sqoop.Sqoop: Running Sqoop version: 1.4.6-cdh5.15.1\", \"\"))) \n" +
            "       / LENGTH(\"INFO sqoop.Sqoop: Running Sqoop version: 1.4.6-cdh5.15.1\")   AS CHAR) AS tab_num  " +
            "FROM hera_job b  LEFT JOIN hera_action_history a\n" +
            "ON a.`job_id`=b.id WHERE   a.LOG LIKE '%sqoop%' AND b.auto='1' AND  LEFT(a.action_id,8)>=DATE_FORMAT(NOW(),'%Y%m%d')  AND a.`status` != 'running' ORDER BY a.`job_id`")
/*
    @Select("SELECT a.`job_id`,a.`action_id`,a.`log`,a.`status`,a.`end_time`,b.`script`" +
            ",0 + CAST( (LENGTH(a.`log`) - LENGTH(REPLACE (a.`log`, \"INFO sqoop.Sqoop: Running Sqoop version: 1.4.6-cdh5.15.1\", \"\"))) \n" +
            "       / LENGTH(\"INFO sqoop.Sqoop: Running Sqoop version: 1.4.6-cdh5.15.1\")   AS CHAR) AS tab_num  " +
            "FROM hera_job b  LEFT JOIN hera_action_history a\n" +
            "ON a.`job_id`=b.id WHERE   a.LOG LIKE '%sqoop%' AND LEFT(a.action_id,8)>=DATE_FORMAT(DATE_SUB(CURDATE(),INTERVAL 1 DAY),'%Y%m%d')  AND a.`status` != 'running' ORDER BY a.`job_id`")
*/
    List<HeraSqoopTask> getAllSqoopTasks();


    //查找脚本为hdfs文件的sqoop任务，未区分导入和导出
    @Select("SELECT a.`job_id`,a.`action_id`,a.`log`,a.`status`,a.`end_time`,b.`script` FROM hera_job b LEFT JOIN hera_action_history a ON a.`job_id`=b.id WHERE   a.LOG LIKE '%sqoop%' AND b.script LIKE '%download[hdfs%' AND LEFT(a.action_id,8)>=DATE_FORMAT(NOW(),'%Y%m%d')")
    List<HeraSqoopTask> getHdfsScriptTasks();

    //查找脚本为shell文本的sqoop任务
    @Select("SELECT a.`job_id`,a.`action_id`,a.`log`,a.`status`,a.`end_time`,b.`script` FROM hera_job b  LEFT JOIN hera_action_history a ON a.`job_id`=b.id WHERE   a.LOG LIKE '%sqoop%' AND b.script NOT LIKE '%download[hdfs%'  AND LEFT(a.action_id,8)>=DATE_FORMAT(NOW(),'%Y%m%d')")
    List<HeraSqoopTask> getRealScriptTasks();

    //单个插入
    @Insert("insert into hera_sqoop_task (#{heraAction})")
    @Lang(HeraInsertLangDriver.class)
    int insert(HeraSqoopTask heraSqoopTask);

    //批量插入
    @Insert("insert into hera_sqoop_task (#{list})")
    @Lang(HeraSqoopTaskBatchInsertDriver.class)
    int batchInsert(@Param("list") List<HeraSqoopTask> list);


    //将转换好的真实脚本的HeraSqoopTask插入到数据表hera_sqoop中
    //批量更新
    @Insert("update hera_sqoop_task (#{list})")
    @Lang(HeraActionBatchUpdateDriver.class)
    int insertTasks(@Param("list") List<HeraSqoopTask> list);

    //单个更新/根据id更新
    @Update("update hera_sqoop_task (#{heraJobHistory}) where id = #{id}")
    @Lang(HeraUpdateLangDriver.class)
    int update(HeraSqoopTask heraJobHistory);


    //批量更新hera_sqoop表
    @Insert("update hera_sqoop_task (#{list})")
    @Lang(HeraSqoopTaskBatchInsertDriver.class)
    int batchUpdate(@Param("list") List<HeraSqoopTask> list);


    //查找全量导入sqoop任务
    @Select("SELECT * FROM hera_sqoop_task WHERE update_direction='0' AND update_type='0' AND LEFT(action_id,8)>=DATE_FORMAT(NOW(),'%Y%m%d') AND status='success'")
    //@Select("SELECT * FROM hera_sqoop_task WHERE update_direction='0' AND update_type='0' AND LEFT(action_id,8)>=DATE_FORMAT(date_sub(curdate(),interval 1 day),'%Y%m%d') AND status='success'")
    List<HeraSqoopTask> getSqoopTasksImportFull();

    //查找增量导入sqoop任务
    @Select("SELECT * FROM hera_sqoop_task WHERE update_direction='0' AND update_type='1' AND LEFT(action_id,8)>=DATE_FORMAT(NOW(),'%Y%m%d') AND status='success'")
    //@Select("SELECT * FROM hera_sqoop_task WHERE update_direction='0' AND update_type='1' AND LEFT(action_id,8)>=DATE_FORMAT(date_sub(curdate(),interval 1 day),'%Y%m%d') AND status='success'")
    List<HeraSqoopTask> getSqoopTasksImportIncrement();


    //单个插入heraSqoopTable
    @Insert("insert into hera_sqoop_table (#{heraSqoopTable})")
    @Lang(HeraInsertLangDriver.class)
    int insertSqoopTable(HeraSqoopTable heraSqoopTable);

    @Delete("delete from hera_sqoop_table where run_day = #{runDay}")
    int deleteHeraSqoopTableByRunDay(String runDay);


    @Select("SELECT MAX(records) FROM hera_sqoop_table where run_day = #{0} and job_id = #{1} and source = #{2} ")
    String getYesterdayRecords(String yesterday, String jobId, String source);

    //取前六天的平均值
    //SELECT ROUND(AVG(records)) FROM hera_sqoop_table WHERE job_id = '15' AND source = 't_user_product' ORDER BY run_day DESC LIMIT 6;

    //@Select("SELECT records FROM hera_sqoop_table where run_day = #{0} and job_id = #{1} and source = #{2} ")
    @Select("SELECT ROUND(AVG(records)) FROM hera_sqoop_table WHERE job_id = #{0} and source = #{1} ORDER BY run_day DESC LIMIT 6 ")
    String getAvgRecords(String jobId, String source);

    /*@Select("select * from hera_sqoop_table "
            + " WHERE (run_day>=CAST(#{dt,jdbcType=VARCHAR} AS date) and  run_day< ADDDATE(CAST(#{dt,jdbcType=VARCHAR} AS date) ,1) ) "
            + " and ( status = #{status,jdbcType=VARCHAR}  or 'all' =  #{status,jdbcType=VARCHAR} ) " +
            "order by status,job_id "
            )*/

    @Select("SELECT * FROM hera_sqoop_table " +
            "WHERE (run_day>=CAST(#{dt,jdbcType=VARCHAR} AS date) and  run_day< ADDDATE(CAST(#{dt,jdbcType=VARCHAR} AS date) ,1) )" +
            "and ( status = #{status,jdbcType=VARCHAR}  or 'all' =  #{status,jdbcType=VARCHAR} )" +
            "ORDER BY STATUS,-increment_records desc,job_id ")
    List<HeraSqoopTable> findSqoopTableByStatus(@Param("status") String status, @Param("dt") String dt);


  //@Select("SELECT * FROM hera_sqoop_table WHERE run_day=DATE_FORMAT(NOW(),'%Y-%m-%d')  AND (STATUS='failed' OR increment_records < 0) ORDER BY status,job_id")
    @Select("SELECT * FROM hera_sqoop_table WHERE run_day=DATE_FORMAT(NOW(),'%Y-%m-%d')  AND STATUS='failed' ORDER BY status,job_id")
    List<HeraSqoopTable> getAlarmInfo();

    @Select("SELECT * FROM hera_job WHERE id = #{jobId} limit 1")
    HeraJob findHeraUserById( String jobId);


    @Select("SELECT count(*) FROM hera_sqoop_table WHERE run_day=DATE_FORMAT(NOW(),'%Y-%m-%d')  AND (STATUS='failed' OR increment_records < 0) ORDER BY status,job_id")
    String getSqoopFailedNum();

}
