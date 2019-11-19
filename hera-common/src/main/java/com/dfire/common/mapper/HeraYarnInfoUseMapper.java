package com.dfire.common.mapper;

import com.dfire.common.entity.HeraFile;
import com.dfire.common.entity.HeraYarnInfoUse;
import com.dfire.common.mybatis.HeraInsertLangDriver;
import com.dfire.common.mybatis.HeraSelectLangDriver;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * @ClassName HeraYarnInfoUseMapper
 * @Description TODO
 * @Author lenovo
 * @Date 2019/9/2 17:43
 **/
public interface HeraYarnInfoUseMapper {
    @Insert("insert into hera_yarn_info_use (#{heraYarnInfoUse})")
    @Lang(HeraInsertLangDriver.class)
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    Integer insertHeraYarnInfoUse(HeraYarnInfoUse heraYarnInfoUse);

    @Select("select * from hera_yarn_info_use where date(time_point)=#{timePoint}")
    @Lang(HeraSelectLangDriver.class)
    List<HeraYarnInfoUse> selectHeraYarnInfoUseList(HeraYarnInfoUse heraYarnInfoUse);

}
