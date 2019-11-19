package com.dfire.task;

import com.dfire.bean.ClusterMetrics;
import com.dfire.common.entity.HeraYarnInfoUse;
import com.dfire.common.service.HeraYarnInfoUseService;
import com.dfire.core.util.NetUtils;
import com.dfire.util.HtmlUnitCommon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;

@Component
@Configuration      //1.主要用于标记配置类，兼备Component的效果。
@EnableScheduling   // 2.开启定时任务
public class SaticScheduleTask {
    private static String localIp = null;

    static {
        try {
            localIp = NetUtils.getLocalAddress();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Autowired
    HeraYarnInfoUseService heraYarnInfoUseService;

    //3.添加定时任务
    @Scheduled(cron = "0 0/1 * * * ?")
    //或直接指定时间间隔，例如：5秒
    //@Scheduled(fixedRate=5000)
    private void configureTasks() {
        if (null != localIp && !"127.0.0.1".equals(localIp) && "188.166.1.90".equals(localIp)) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String format = sdf.format(new Date());
            ClusterMetrics clusterMetrics = HtmlUnitCommon.selectClusterMetrics();
            String allocatedMB = clusterMetrics.getAllocatedMB();
            String totalMB = clusterMetrics.getTotalMB();
            double mb = Double.parseDouble(allocatedMB) / Double.parseDouble(totalMB);
            String mbStr = String.format("%.2f", mb);
            String allocatedVirtualCores = clusterMetrics.getAllocatedVirtualCores();
            String totalVirtualCores = clusterMetrics.getTotalVirtualCores();
            double vc = Double.parseDouble(allocatedVirtualCores) / Double.parseDouble(totalVirtualCores);
            String vcStr = String.format("%.2f", vc);
            HeraYarnInfoUse heraYarnInfoUse = new HeraYarnInfoUse();
            heraYarnInfoUse.setCpuUse(vcStr);
            heraYarnInfoUse.setMemUse(mbStr);
            heraYarnInfoUse.setTimePoint(format);
            heraYarnInfoUseService.insertHeraYarnInfoUse(heraYarnInfoUse);
        }
    }

}