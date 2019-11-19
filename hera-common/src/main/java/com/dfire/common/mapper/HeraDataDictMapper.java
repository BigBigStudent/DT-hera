package com.dfire.common.mapper;

import com.dfire.common.entity.HeraArea;
import com.dfire.common.entity.HeraDataDict;
import com.dfire.common.entity.vo.HeraDataDictVo;
import com.dfire.common.mybatis.HeraSelectLangDriver;
import com.dfire.common.mybatis.HeraUpdateLangDriver;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @author: <a href="mailto:lingxiao@2dfire.com">凌霄</a>
 * @time: Created in 23:55 2017/12/29
 * @desc
 */
public interface HeraDataDictMapper {


    @Select("SELECT table_schema,table_name2,table_name1,column_comment FROM hera_data_dict")
    @Lang(HeraSelectLangDriver.class)
    List<HeraDataDict> selectHeraDataDictList();


    @Select("SELECT * FROM hera_data_dict where table_schema=#{tableSchema} and table_name2=#{tableName2} order by data_inx LIMIT #{page},#{limit}")
    @Lang(HeraSelectLangDriver.class)
    List<HeraDataDict> selectHeraDataDictFields(HeraDataDictVo heraDataDictVo);

    @Update("update hera_data_dict (#{heraDataDict}) where table_schema = #{tableSchema} and table_name2=#{tableName2} and column_name=#{columnName}")
    @Lang(HeraUpdateLangDriver.class)
    int updateHeraDataDict(HeraDataDict heraDataDict);

    @Update("update hera_data_dict set table_status=#{tableStatus}," +
            "update_time=#{updateTime}," +
            "tb_owner=#{tbOwner}," +
            "business=#{business}," +
            "table_name1=#{tableName1} where table_schema = #{tableSchema} and table_name2=#{tableName2}")
    @Lang(HeraUpdateLangDriver.class)
    int updateHeraDataDictTableStatus(HeraDataDict heraDataDict);

    @Select("select count(*) from hera_data_dict where  table_schema = #{tableSchema} and table_name2=#{tableName2}")
    int selectHeraDataDictTableCount(HeraDataDictVo heraDataDict);
}
