package com.dfire.common.mapper;

import com.dfire.common.entity.HeraAction;
import com.dfire.common.entity.vo.HeraActionVo;
import com.dfire.common.mybatis.HeraInsertLangDriver;
import com.dfire.common.mybatis.HeraListInLangDriver;
import com.dfire.common.mybatis.HeraSelectLangDriver;
import com.dfire.common.mybatis.HeraUpdateLangDriver;
import com.dfire.common.mybatis.action.HeraActionBatchInsertDriver;
import com.dfire.common.mybatis.action.HeraActionBatchUpdateDriver;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

/**
 * @author: <a href="mailto:lingxiao@2dfire.com">凌霄</a>
 * @time: Created in 上午11:03 2018/5/16
 * @desc 版本运行历史查询
 */
public interface HeraJobActionMapper {

    @Insert("insert into hera_action (#{heraAction})")
    @Lang(HeraInsertLangDriver.class)
    int insert(HeraAction heraAction1);

    @Insert("insert into hera_action (#{list})")
    @Lang(HeraActionBatchInsertDriver.class)
    int batchInsert(@Param("list") List<HeraAction> list);


    @Insert("update hera_action (#{list})")
    @Lang(HeraActionBatchUpdateDriver.class)
    int batchUpdate(@Param("list") List<HeraAction> list);

    @Delete("delete from hera_action where id = #{id}")
    int delete(@Param("id") String id);

    @Update("update hera_action (#{heraJobHistory}) where id = #{id}")
    @Lang(HeraUpdateLangDriver.class)
    int update(HeraAction heraJobHistory);

    @Select("select * from hera_action")
    List<HeraAction> getAll();

    @Select("select * from hera_action where id = #{id}")
    @Lang(HeraSelectLangDriver.class)
    HeraAction findById(HeraAction heraAction);


    @Select("select * from hera_action where job_id = #{jobId} order by id desc limit 1")
    HeraAction findLatestByJobId(String jobId);

    @Select("select * from hera_action where job_id = #{jobId} order by id")
    List<HeraAction> findByJobId(String jobId);

    @Update("update hera_action set status = #{status} where id = #{id}")
    Integer updateStatus(HeraAction heraAction);

    @Update("update hera_action set status = #{status},ready_dependency=#{readyDependency} where id = #{id}")
    Integer updateStatusAndReadDependency(HeraAction heraAction);

    @Select("select * from hera_action where id >= #{action}")
    List<HeraAction> selectAfterAction(long action);

    /**
     * 根据JobId 获取版本
     *
     * @param jobId
     * @return
     */
    //@Select("select id from hera_action where job_id = #{jobId} order by id desc limit 24")
    //@Select("select id from hera_action where job_id = #{jobId} AND STATUS !=\"NULL\" order by id desc ")
    //@Select("SELECT CONCAT(id,\"+\",STATUS) id FROM hera_action WHERE job_id = #{jobId} AND STATUS !=\"NULL\" ORDER BY id  DESC")
    //@Select("SELECT CONCAT(id,\"+\",IFNULL(STATUS,\"no\")) id FROM hera_action WHERE job_id = #{jobId} AND auto = \"1\" AND STATUS !=\"NULL\" ORDER BY id  DESC limit 120 ")
    //@Select("SELECT CONCAT(id,\"+\",IFNULL(STATUS,\"no\")) id FROM hera_action WHERE job_id = #{jobId} AND  LEFT(id, 12) < DATE_FORMAT(NOW(),'%Y%m%d%h%i')   ORDER BY id  DESC limit 60")
   //正式使用@Select("SELECT CONCAT(id,\"+\",IFNULL(STATUS,\"no\")) id FROM hera_action WHERE job_id = #{jobId} AND  LEFT(id, 12) <= DATE_FORMAT(NOW(),'%Y%m%d%H%i') AND LEFT(id, 12)>=DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 2 DAY),'%Y%m%d%H%i')  ORDER BY id  DESC limit 60")
    @Select("SELECT CONCAT(id,\"+\",IFNULL(STATUS,\"no\")) id FROM hera_action WHERE job_id = #{jobId} AND  LEFT(id, 12)>=DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 DAY),'%Y%m%d%H%i')  ORDER BY id  DESC limit 60")
    List<String> getActionVersionByJobId(Long jobId);

    @Select("select id,job_id,owner,auto from hera_action where id <= CURRENT_TIMESTAMP()* 10000 and id >= CURRENT_DATE () * 10000000000 and schedule_type = 0 and auto = 1 and status != 'success' group by job_id")
    List<HeraActionVo> getNotRunScheduleJob();

    @Select("select id,job_id,owner,auto from hera_action where id <= CURRENT_TIMESTAMP()* 10000 and id >= CURRENT_DATE () * 10000000000  and status = 'failed' and auto = 1 group by job_id")
    List<HeraActionVo> getFailedJob();


    /**
     * selectList 只能传递一个参数  需要封装为map或者对象
     *
     * @param params
     * @return
     */
    @Select("select id,job_id,status,ready_dependency,dependencies,schedule_type,last_result,name from hera_action where job_id in (#{list}) and id &gt;= #{startDate} * 10000000000 and id &lt;= #{endDate} * 10000000000 " +
            "<if test=\"status != null\" > and status=#{status} </if> " +
            " limit #{page},#{limit}")
    @Lang(HeraListInLangDriver.class)
    List<HeraAction> findByJobIdsAndPage(Map<String, Object> params);

    @Select("select count(1) from hera_action where job_id in (#{list}) and id &gt;= #{startDate} * 10000000000 and id &lt;= #{endDate} * 10000000000 " +
            "<if test=\"status != null\" > and status=#{status} </if> ")
    @Lang(HeraListInLangDriver.class)
    Integer findByJobIdsCount(Map<String, Object> params);

    //获取最近版本的id和状态

    //@Select("SELECT CONCAT(id,\"+\",IFNULL(STATUS,\"no\")) id FROM hera_action WHERE job_id = #{jobId} AND  LEFT(id, 12)>=DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 DAY),'%Y%m%d%H%i')  ORDER BY id  DESC limit 60")
    @Select("SELECT CONCAT(id,\"+\",IFNULL(STATUS,\"no\")) id FROM hera_action WHERE job_id = #{jobId} " +
            "AND  LEFT(id, 12) <= DATE_FORMAT(NOW(),'%Y%m%d%H%i') " +
            "AND LEFT(id, 8)>=DATE_FORMAT(NOW(),'%Y%m%d') " +
            "ORDER BY id  DESC LIMIT 1")
    String getLatestVersionAndStatus(String jobId);
    //getStatus
    @Select("SELECT IFNULL(STATUS,\"no\") STATUS FROM hera_action WHERE id =#{id}")
    String getStatus(String id);

    @Select("SELECT id FROM hera_action WHERE job_id = #{jobId} " +
            "AND  LEFT(id, 12) <= DATE_FORMAT(NOW(),'%Y%m%d%H%i') " +
            "AND LEFT(id, 8)>=DATE_FORMAT(NOW(),'%Y%m%d') " +
            "ORDER BY id  DESC LIMIT 1")
    String getLatestVersionId(String jobId);


    //@Select("select * from hera_action where job_id = #{jobId} order by id desc limit 1")
    //HeraAction findLatestByJobId(String jobId);

/* @Select("SELECT CONCAT(id,\"+\",IFNULL(STATUS,\"no\")) id FROM hera_action WHERE job_id = #{jobId} " +
    "AND  LEFT(id, 12) <= DATE_FORMAT(NOW(),'%Y%m%d%H%i') " +
    "AND LEFT(id, 8)>=DATE_FORMAT(NOW(),'%Y%m%d') " +
    "ORDER BY id  DESC LIMIT 1")*/

    //获取上游任务的状态
    @Select("SELECT CONCAT(id,\"+\",IFNULL(STATUS,\"no\")) id FROM hera_action WHERE FIND_IN_SET( id , (SELECT dependencies FROM hera_action WHERE id =#{id}))")
    List<String> judgeUpDependsStatus(String id);


    //获取上游任务的id
    //@Select("SELECT id FROM hera_action WHERE FIND_IN_SET( id , (SELECT dependencies FROM hera_action WHERE id =#{id}))")
    @Select("SELECT dependencies FROM hera_action WHERE id =#{id}")
    String getUpDependsId(String id);
    //List<String> getUpDependsId(String id);

    //获取下游任务的Id和状态
    @Select("SELECT CONCAT(id,\"+\",IFNULL(STATUS,\"no\")) id FROM hera_action WHERE FIND_IN_SET(#{id}, dependencies);")
    List<String> judgeDownDependsStatus(String id);

    //获取下游任务的ID
    @Select("SELECT IFNULL(id,\"no\" ) id FROM hera_action WHERE FIND_IN_SET(#{id}, dependencies);")
    List<String> judgeDownDependsId(String id);


    //获取上游任务的本版本依赖和本版本已准备好的依赖
    @Select("select CONCAT(dependencies,\"+\",IFNULL(ready_dependency,\"no\")) s  from hera_action where id =#{id}")
    String getReadDependency(String id);

    //获取任务运行的常规时间
   // @Select("SELECT statistic_start_time FROM (SELECT id,statistic_end_time,statistic_start_time,STATUS FROM hera_action WHERE job_id = #{id} AND  LEFT(id, 12) <= DATE_FORMAT(NOW(),'%Y%m%d%H%i') ORDER BY statistic_start_time  DESC LIMIT 5) a ORDER BY RIGHT(statistic_start_time,8) LIMIT 2,1")
   @Select("SELECT RIGHT(statistic_start_time,8) commonTime FROM (SELECT id,statistic_end_time,statistic_start_time,STATUS FROM hera_action WHERE id LIKE  (SELECT CONCAT('%',RIGHT (#{id}, 10)))  AND  LEFT(id, 12) <= DATE_FORMAT(NOW(),'%Y%m%d%H%i') ORDER BY statistic_start_time  DESC LIMIT 5\n" +
           ") a ORDER BY RIGHT(statistic_start_time,8) limit 2,1")
    String getTaskCommonTime(String id);

}
