package com.dfire.common.util;

import com.dfire.common.entity.HeraUser;
import com.dfire.logs.DebugLog;

/**
 * @ClassName WeiChatUtil
 * @Description TODO
 * @Author lenovo
 * @Date 2019/8/29 14:40
 **/
public class WeiChatUtil {


    public static void sendWeiChatMessage(HeraUser heraUser, String text, String desp) {
        /**
        　　* @Description: TODO 发送微信消息警告
        　　* @param [heraUser, text, desp]
        　　* @return void
        　　* @throws
        　　* @author lenovo
        　　* @date 2019/8/29 14:57
        　　*/
        DebugLog.info("向{}发送预警消息到微信",heraUser.getName());
        HttpRequest.sendPost("https://sc.ftqq.com/"+ heraUser.getScKey() + ".send", "text=" + text + "&desp=" + desp);
    }
}
