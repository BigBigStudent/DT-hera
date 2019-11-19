package com.dfire.common.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @ClassName HeraDataDiscovery
 * @Description TODO
 * @Author lenovo
 * @Date 2019/8/21 14:02
 **/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HeraDataDiscovery {
    private String tableSchema;
    private String tableName;
    private String status;
    private String dt;
    private String tableComment;

}
