package com.dfire.common.mapper;

import com.dfire.common.entity.HeraJob;
import com.dfire.common.entity.Judge;
import com.dfire.common.entity.vo.HeraJobVo;
import com.dfire.common.mybatis.HeraInsertLangDriver;
import com.dfire.common.mybatis.HeraListInLangDriver;
import com.dfire.common.mybatis.HeraSelectLangDriver;
import com.dfire.common.mybatis.HeraUpdateLangDriver;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author: <a href="mailto:lingxiao@2dfire.com">凌霄</a>
 * @time: Created in 14:24 2017/12/30
 * @desc
 */
public interface HeraJobMapper {


    @Insert("insert into hera_job (#{heraJob})")
    @Lang(HeraInsertLangDriver.class)
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    int insert(HeraJob heraJob);

    @Delete("delete from hera_job where id = #{id}")
    int delete(@Param("id") int id);

    @Update("update hera_job (#{heraJob}) where id = #{id}")
    @Lang(HeraUpdateLangDriver.class)
    Integer update(HeraJob heraJob);

    @Select("select * from hera_job")
    @Lang(HeraSelectLangDriver.class)
    List<HeraJob> getAll();


    @Select("select id,group_id,name,owner from hera_job")
    @Lang(HeraSelectLangDriver.class)
    List<HeraJob> selectAll();

    @Select("select * from hera_job where id = #{id}")
   //@Lang(HeraSelectLangDriver.class)
    HeraJob findById(Integer id);

    @Select("select * from hera_job where id in (#{list})")
    @Lang(HeraListInLangDriver.class)
    List<HeraJob> findByIds(@Param("list") List<Integer> list);

    @Select("select * from hera_job where group_id = #{groupId}")
    List<HeraJob> findByPid(Integer groupId);


    @Update("update hera_job set auto = #{status} where id = #{id}")
    Integer updateSwitch(@Param("id") Integer id, @Param("status") Integer status);


    @Select("select max(id) from hera_job")
    Integer selectMaxId();

    @Select("select `name`,id,dependencies,auto from hera_job")
    List<HeraJob> getAllJobRelations();

    @Select("select count(*) count, max(id) maxId, max(gmt_modified) lastModified from hera_job")
    Judge selectTableInfo();


    @Update("update hera_job set group_id = #{parentId} where id = #{newId}")
    Integer changeParent(@Param("newId") Integer newId, @Param("parentId") Integer parentId);

    @Select("select repeat_run from hera_job where id = #{jobId}")
    Integer findRepeat(Integer jobId);

    @Select("select dependencies from hera_job where id = #{id}")
    String findUpDependenciesById(Integer id);

 //   查询处指定job_id的下游任务
    @Select("SELECT id FROM hera_job WHERE FIND_IN_SET(#{id}, dependencies);")
    List<String> findDownDependenciesById(Integer id);

    @Select("SELECT COUNT(id) FROM hera_job WHERE  auto != 1 ")
    Integer getStopHeraJobInfo();

    /**
    　　* @Description: TODO
    　　* @param
    　　* @return
    　　* @throws
    　　* @author lenovo
    　　* @date 2019/11/7 9:45
    　　*/
    @Select("select count(*) from hera_job where owner=#{owner} ")
    Integer selectJobCountByUserName(HeraJobVo heraJobVo);

    @Select("SELECT COUNT(*) FROM hera_permission WHERE uid=#{owner} AND type='job'")
    Integer selectManJobCountByUserName(HeraJobVo heraJobVo);

    @Select("SELECT COUNT(*) FROM (SELECT hah.job_id FROM hera_action_history hah LEFT JOIN hera_job hj ON hah.job_id=hj.id  WHERE DATE(hah.start_time) = CURDATE() AND hah.status='failed' AND hj.owner=#{owner} GROUP BY hah.job_id) a")
    Integer selectfailedCountByUserName(HeraJobVo heraJobVo);
}
