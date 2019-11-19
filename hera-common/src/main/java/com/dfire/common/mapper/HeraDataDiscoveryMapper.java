package com.dfire.common.mapper;

import com.dfire.common.entity.HeraDataDict;
import com.dfire.common.entity.HeraDataDiscovery;
import com.dfire.common.entity.vo.HeraDataDictVo;
import com.dfire.common.entity.vo.HeraDataDiscoveryVo;
import com.dfire.common.mybatis.HeraSelectLangDriver;
import com.dfire.common.mybatis.HeraUpdateLangDriver;
import org.apache.ibatis.annotations.Lang;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * @author: <a href="mailto:lingxiao@2dfire.com">凌霄</a>
 * @time: Created in 23:55 2017/12/29
 * @desc
 */
public interface HeraDataDiscoveryMapper {


    @Select({"<script> " +
            "SELECT * FROM hera_data_discovery where 1=1 " +
            " <if test=\"dt!=null and dt!=''\"> and  dt=#{dt} </if> " +
            "<if test=\"queryData!=null and queryData!=''\" >" +
            "and (table_comment like  CONCAT('%',#{queryData},'%') or table_name like CONCAT('%',#{queryData},'%'))  " +
            "</if> " +
            "<if test=\"field!=null and field!=''\"> order by ${field} ${order}</if>" +
            "LIMIT #{page},#{limit} " +
            "</script>"})
    @Lang(HeraSelectLangDriver.class)
    List<HeraDataDiscovery> selectHeraDataDiscovery(HeraDataDiscoveryVo heraDataDiscovery);

    @Select({"<script> " +
            "SELECT count(*) FROM hera_data_discovery where 1=1  " +
            "<if test=\"dt!=null and dt!=''\"> and  dt=#{dt} </if> " +
            "<if test=\"queryData!=null and queryData!=''\">" +
            "and (table_comment like  CONCAT('%',#{queryData},'%') or table_name like CONCAT('%',#{queryData},'%')) " +
            "</if> " +
            "</script>"})
    @Lang(HeraSelectLangDriver.class)
    int selectHeraDataDiscoveryCount(HeraDataDiscoveryVo heraDataDiscovery);

}
