package com.dfire.common.entity.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @ClassName HeraDataDictMapper
 * @Description TODO
 * @Author lenovo
 * @Date 2019/8/12 17:58
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HeraDataDictVo {
    private Integer id;
    private String tableSchema;
    private String tableName1;
    private String tableName2;
    private String columnName;
    private String columnType;
    private String columnComment;
    private Integer isNull;
    private Integer tableStatus;
    private Integer columnStatus;
    private String createTime;
    private String updateTime;
    private String tbOwner;
    private String business;
    private String columnRename;
    private Integer page;
    private Integer limit;

}
