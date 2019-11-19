package com.dfire.common.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @ClassName UserJobInfo
 * @Description TODO
 * @Author lenovo
 * @Date 2019/11/7 14:17
 **/
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserJobInfo {
    Integer jobCount;
    Integer manJobCount;
    Integer failedJobCount;
}
