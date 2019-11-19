package com.dfire.bean;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @ClassName MaxWellMonitorInfo
 * @Description TODO
 * @Author lenovo
 * @Date 2019/10/23 17:23
 **/
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MaxWellMonitorInfo {
    private Long  messages_succeede;//成功发送到kafka的消息数量
    private Long messages_failed;//发送失败的消息数量
    private Long row_count;//已处理的binlog行数，注意并非所有binlog都发往kafka
    private Double publish_time;//向kafka发送record所用的时间
    private String binlog_file;//binlog文件名称
    private Long binlog_position;//binlog偏移量
    private Integer server_id;//
    private String client_id;//

}
