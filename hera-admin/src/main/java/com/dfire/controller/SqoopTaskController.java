package com.dfire.controller;

import com.dfire.common.constants.Constants;
import com.dfire.common.entity.*;
import com.dfire.common.entity.model.JsonResponse;
import com.dfire.common.service.EmailService;
import com.dfire.common.service.HeraJobMonitorService;
import com.dfire.common.service.HeraSqoopTaskService;
import com.dfire.common.service.HeraUserService;
import com.dfire.common.util.WeiChatUtil;
import com.dfire.config.HeraGlobalEnvironment;
import com.dfire.core.tool.RunShell;
import com.dfire.core.util.NetUtils;
import com.dfire.logs.ErrorLog;
import com.dfire.logs.HeraLog;
import com.dfire.logs.MonitorLog;
import com.dfire.logs.ScheduleLog;
import com.dfire.util.ReadHdfsFile;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.mail.MessagingException;
import java.util.*;

import static com.dfire.common.util.HeraTodayDateUtil.*;

/**
 * @author:
 * @time: Created in 16:50 2019/10/25
 * @desc 调度中心sqoop监控
 */
@Controller
@RequestMapping("/sqoopTaskCenter")
public class SqoopTaskController {


    @Autowired
    private HeraSqoopTaskService heraSqoopTaskService;


    @RequestMapping("/sqoopTaskDetail")
    public String getMetadataMonitor() {
        return "sqoopTaskDetail/sqoopTaskDetail.index";
    }


    public static String host ;
    static {
        host = NetUtils.getLocalAddress();
        //System.err.println(host);
    }


    @RequestMapping(value = "/initHeraSqoopTask", method = RequestMethod.GET)
    @ResponseBody
    @Scheduled(cron = "0 31 7 * * ?")
    public JsonResponse initHeraSqoopTask() {

        if (null != host && !("188.166.1.90".equals(host))) {
            MonitorLog.info("initHeraSqoopTask只能在指定节点执行.");
            return null;
        }

        int j = heraSqoopTaskService.truncateTable();
        List<HeraSqoopTask> allSqoopTasks = heraSqoopTaskService.getAllSqoopTasks();
        String script;
        String path;
        String todayTime = getTodayTime();
        int size = allSqoopTasks.size();
        //System.err.println("任务数量：" + size);
        try {
            for (HeraSqoopTask heraSqoopTask : allSqoopTasks) {
                script = heraSqoopTask.getScript();
                if (script.indexOf("download[hdfs://") > -1) {
                    path = script.split("download\\[hdfs://")[1].split(" ")[0];
                    heraSqoopTask.setScript(ReadHdfsFile.hdfsCat(path).trim());
                }
                if (heraSqoopTask.getScript().indexOf("--hive-import") > -1 || heraSqoopTask.getScript().indexOf("/bin/sqoop import") > -1) {
                    heraSqoopTask.setUpdateDirection(0);
                } else {
                    heraSqoopTask.setUpdateDirection(1);
                }
                if ((heraSqoopTask.getScript().indexOf("--hive-import") > -1 || heraSqoopTask.getScript().indexOf("/bin/sqoop import") > -1) && heraSqoopTask.getScript().indexOf("--hive-overwrite") > -1) {
                    heraSqoopTask.setUpdateType(0);
                } else {
                    heraSqoopTask.setUpdateType(3);
                }
                if ((heraSqoopTask.getScript().indexOf("--hive-import") > -1 || heraSqoopTask.getScript().indexOf("/bin/sqoop import") > -1)
                        &&
                        heraSqoopTask.getScript().indexOf("--incremental") > -1
                        &&
                        heraSqoopTask.getScript().indexOf("lastmodified") > -1
                        &&
                        heraSqoopTask.getScript().indexOf("--last-value") > -1
                        &&
                        heraSqoopTask.getScript().indexOf("--merge-key") > -1) {
                    heraSqoopTask.setUpdateType(1);
                }
                heraSqoopTask.setInsertDay(todayTime);
                heraSqoopTask.setRunDay(heraSqoopTask.getEndTime().split(" ")[0]);
                heraSqoopTaskService.insert(heraSqoopTask);
            }
        } catch (Exception e) {
            e.printStackTrace();
            MonitorLog.info("HeraSqoopTask数据初始化错误");
            return new JsonResponse(false, "HeraSqoopTask数据初始化错误");
        }
        //批量插入到hera_sqoop_task中
        //int i = heraSqoopTaskService.batchInsert(t1);
        MonitorLog.info("HeraSqoopTask 数据初始化完成，数据量:{}", size);
        getSqoopTableInfo();
        getAlarmInfo();
        return new JsonResponse(true, "数据监控详情页数据更新完成");
    }


    @RequestMapping(value = "/getSqoopTableInfo", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getSqoopTableInfo() {
        MonitorLog.info("HeraSqoopTable今日数据初始化开始");

        //处理全量导入的任务
        List<HeraSqoopTask> sqoopTasksImportFull = heraSqoopTaskService.getSqoopTasksImportFull();
        List<HeraSqoopTable> sqoopTables = new ArrayList<>();
        String today = getToday();

        int i = heraSqoopTaskService.deleteHeraSqoopTableByRunDay(today);


        for (HeraSqoopTask heraSqoopTask : sqoopTasksImportFull) {
            if (heraSqoopTask.getTabNum() > 1) {
                getInfoBatch(heraSqoopTask, sqoopTables);
            } else {
                getInfoSingle(heraSqoopTask, sqoopTables);
            }
        }
        List<HeraSqoopTask> sqoopTasksImportIncrement = heraSqoopTaskService.getSqoopTasksImportIncrement();
        for (HeraSqoopTask heraSqoopTask : sqoopTasksImportIncrement) {
            if (heraSqoopTask.getTabNum() > 1) {
                getInfoBatchIncrement(heraSqoopTask, sqoopTables);
            } else {
                getInfoSingleIncrement(heraSqoopTask, sqoopTables);
            }
        }
        //System.err.println("size :" + sqoopTables.size());
        for (HeraSqoopTable heraSqoopTable : sqoopTables) {
            heraSqoopTaskService.insertSqoopTable(heraSqoopTable);
        }
        MonitorLog.info("HeraSqoopTable删除今日已有数据" + i + "条,插入" + sqoopTables.size() + "条。");
        return new JsonResponse(true, "插入成功", "删除的行:" + i + ",插入的行：" + sqoopTables.size());
    }


    public void getInfoSingle(HeraSqoopTask heraSqoopTask, List<HeraSqoopTable> sqoopTables) {

        String log = heraSqoopTask.getLog();
        formatAll(log, heraSqoopTask, sqoopTables);
    }

    public void formatAll(String log, HeraSqoopTask heraSqoopTask, List<HeraSqoopTable> sqoopTables) {
        String size = null;
        String spendTime = null;
        String speed = null;
        String records = null;
        String target = null;
        String source = null;
        String comment;
        String yesterdayRecords;
        String avgRecords;
        String incrementRecords;
        try {
            size = log.split("INFO mapreduce.ImportJobBase: Transferred")[1].split("in")[0].trim();
        } catch (Exception e) {
            size = "";
        }
        try {
            spendTime = log.split("INFO mapreduce.ImportJobBase: Transferred")[1].split("in")[1].split("seconds")[0].trim();
        } catch (Exception e) {
            spendTime = "";
        }
        try {
            //  speed = log.split("INFO mapreduce.ImportJobBase: Transferred")[1].split("in")[1].split(" ")[1].split("\\)")[0].trim();
            speed = log.split("INFO mapreduce.ImportJobBase: Transferred")[1].split("in")[1].split("\\(")[1].split("\\)")[0].trim();

        } catch (Exception e) {
            speed = "";
        }
        try {
            records = log.split("INFO mapreduce.ImportJobBase: Retrieved")[1].split("records")[0].trim();
        } catch (Exception e) {
            records = "";
        }
        try {
            if (log.indexOf("Loading data to table") > -1) {
                target = log.split("Loading data to table")[1].split("<br>")[0].trim();
            } else if (log.indexOf("Beginning import of") > -1) {
                target = log.split("Beginning import of")[1].split("<br>")[0].trim();
            } else {
                target = "";
            }
        } catch (Exception e) {
            target = "";
        }
        try {
            source = log.split("INFO manager.SqlManager: Executing SQL statement:")[1].split("from")[1].trim().split(" ")[0].trim().replace("`", "");
        } catch (Exception e) {
            source = "";
        }
        try {
            if (log.indexOf("Caused by:") > -1) {
                comment = log.split("Caused by:")[1].split("</font>")[0].trim();
            } else if (log.indexOf("ERROR ") > -1) {
                comment = log.split("ERROR ")[1].split("</font>")[0].trim();
            } else {
                comment = "";
            }
        } catch (Exception e) {
            comment = "";
        }

        if (source.equals("where") || (source.length() < 2 && comment.length() < 2)) {
            return;
        }
        HeraSqoopTable heraSqoopTable = new HeraSqoopTable();
        heraSqoopTable.setJobId(heraSqoopTask.getJobId());
        heraSqoopTable.setSource(source);
        heraSqoopTable.setTarget(target);
        heraSqoopTable.setFileSize(size);
        heraSqoopTable.setSpendTime(spendTime);
        heraSqoopTable.setSpeed(speed);
        heraSqoopTable.setRecords(records);
        String yesterday = getYesterday();

        yesterdayRecords = heraSqoopTaskService.getYesterdayRecords(yesterday, heraSqoopTask.getJobId(), source);
        heraSqoopTable.setYesterdayRecords(yesterdayRecords);

        try {
            incrementRecords = (Integer.parseInt(records) - Integer.parseInt(yesterdayRecords)) + "";
        } catch (NumberFormatException e) {
            if (comment.length() > 1) {
                incrementRecords = "0";
            } else {
                incrementRecords = "-0.5";
            }
        }

        heraSqoopTable.setIncrementRecords(incrementRecords);

        avgRecords = heraSqoopTaskService.getAvgRecords(heraSqoopTask.getJobId(), source);
        heraSqoopTable.setAvgRecords(avgRecords);

        heraSqoopTable.setUpdateDirection(heraSqoopTask.getUpdateDirection());
        heraSqoopTable.setUpdateType(heraSqoopTask.getUpdateType());
        heraSqoopTable.setRunDay(heraSqoopTask.getRunDay());
        heraSqoopTable.setComment(comment);

        if (heraSqoopTable.getComment().length() > 1) {
            heraSqoopTable.setStatus("failed");
        } else {
            heraSqoopTable.setStatus("success");
        }
        sqoopTables.add(heraSqoopTable);
    }

    public void getInfoBatch(HeraSqoopTask heraSqoopTask, List<HeraSqoopTable> sqoopTables) {
        String[] arr = heraSqoopTask.getLog().split("INFO sqoop.Sqoop: Running Sqoop version:");
        for (int i = 1; i < arr.length; i++) {
            String log = arr[i];
            formatAll(log, heraSqoopTask, sqoopTables);
        }
    }

    public void getInfoSingleIncrement(HeraSqoopTask heraSqoopTask, List<HeraSqoopTable> sqoopTables) {
        String log = heraSqoopTask.getLog();
        formatIncrement(heraSqoopTask, log, sqoopTables);
    }

    public void getInfoBatchIncrement(HeraSqoopTask heraSqoopTask, List<HeraSqoopTable> sqoopTables) {
        String[] arr = heraSqoopTask.getLog().split("INFO sqoop.Sqoop: Running Sqoop version:");
        for (int i = 1; i < arr.length; i++) {
            String log = arr[i];
            formatIncrement(heraSqoopTask, log, sqoopTables);
        }
    }

    public void formatIncrement(HeraSqoopTask heraSqoopTask, String log, List<HeraSqoopTable> sqoopTables) {

        String size = null;
        String spendTime = null;
        String speed = null;
        String records = null;
        String target = null;
        String source = null;
        String comment;
        String yesterdayRecords;
        String avgRecords;
        String incrementRecords;
        try {
            size = log.split("INFO mapreduce.ImportJobBase: Transferred")[1].split("in")[0].trim();
        } catch (Exception e) {
            size = "";
        }
        try {
            spendTime = log.split("INFO mapreduce.ImportJobBase: Transferred")[1].split("in")[1].split("seconds")[0].trim();
        } catch (Exception e) {
            spendTime = "";
        }
        try {
            speed = log.split("INFO mapreduce.ImportJobBase: Transferred")[1].split("in")[1].split("\\(")[1].split("\\)")[0].trim();
        } catch (Exception e) {
            speed = "";
        }
        try {
            //records = log.split("INFO mapreduce.ImportJobBase: Retrieved")[1].split("records")[0].trim();
            records = log.split("Reduce input groups=")[1].trim().split("<br>")[0];
        } catch (Exception e) {
            records = "";
        }
        try {
            /*if (log.indexOf("Loading data to table") > -1) {
                target = log.split("Loading data to table")[1].split("<br>")[0].trim();
            } else if (log.indexOf("Beginning import of") > -1) {
                target = log.split("Beginning import of")[1].split("<br>")[0].trim();
            } else {
                target = "";
            }*/
            if (log.indexOf("Beginning import of") > -1) {
                target = log.split("Beginning import of")[1].split("<br>")[0].trim();
            } else if (log.indexOf("Loading data to table") > -1) {
                target = log.split("Loading data to table")[1].split("<br>")[0].trim();
            } else {
                target = "";
            }

        } catch (Exception e) {
            target = "";
        }
        try {
            //   source = log.split("INFO manager.SqlManager: Executing SQL statement:")[1].split("from")[1].trim().split(" ")[0].trim().replace("`", "");
            if (log.indexOf("INFO manager.SqlManager: Executing SQL statement:") > -1 && log.split("INFO manager.SqlManager: Executing SQL statement:")[1].indexOf("FROM") > -1) {
                source = log.split("INFO manager.SqlManager: Executing SQL statement:")[1].split("FROM")[1].trim().split(" ")[0].trim().replace("`", "");
            } else if (log.indexOf("INFO manager.SqlManager: Executing SQL statement:") > -1 && log.split("INFO manager.SqlManager: Executing SQL statement:")[1].indexOf("from") > -1) {
                source = log.split("INFO manager.SqlManager: Executing SQL statement:")[1].split("from")[1].trim().split(" ")[0].trim().replace("`", "");
            } else {
                source = "";
            }
        } catch (Exception e) {
            source = "";
        }
        try {
            if (log.indexOf("Caused by:") > -1) {
                comment = log.split("Caused by:")[1].split("</font>")[0].trim();
            } else if (log.indexOf("ERROR ") > -1) {
                comment = log.split("ERROR ")[1].split("</font>")[0].trim();
            } else {
                //comment = log.split("<font style=\"color:red\">")[1].split("</font>")[0];
                comment = "";
            }
        } catch (Exception e) {
            comment = "";
        }

        /*if (source.equals("where") || (source.length() < 2 && comment.length() < 2)) {
            return;
        }*/
        HeraSqoopTable heraSqoopTable = new HeraSqoopTable();
        heraSqoopTable.setJobId(heraSqoopTask.getJobId());
        heraSqoopTable.setSource(source);
        heraSqoopTable.setTarget(target);
        heraSqoopTable.setFileSize(size);
        heraSqoopTable.setSpendTime(spendTime);
        heraSqoopTable.setSpeed(speed);
        heraSqoopTable.setRecords(records);
        String yesterday = getYesterday();

        yesterdayRecords = heraSqoopTaskService.getYesterdayRecords(yesterday, heraSqoopTask.getJobId(), source);
        heraSqoopTable.setYesterdayRecords(yesterdayRecords);

        try {
            incrementRecords = (Integer.parseInt(records) - Integer.parseInt(yesterdayRecords)) + "";
        } catch (NumberFormatException e) {
            if (comment.length() > 1) {
                incrementRecords = "0";
            } else {
                incrementRecords = "-0.5";
            }
        }
        heraSqoopTable.setIncrementRecords(incrementRecords);

        avgRecords = heraSqoopTaskService.getAvgRecords(heraSqoopTask.getJobId(), source);
        heraSqoopTable.setAvgRecords(avgRecords);

        heraSqoopTable.setUpdateDirection(heraSqoopTask.getUpdateDirection());
        heraSqoopTable.setUpdateType(heraSqoopTask.getUpdateType());
        heraSqoopTable.setRunDay(heraSqoopTask.getRunDay());
        heraSqoopTable.setComment(comment);

        if (heraSqoopTable.getComment().length() > 1) {
            heraSqoopTable.setStatus("failed");
        } else {
            heraSqoopTable.setStatus("success");
        }
        sqoopTables.add(heraSqoopTable);

    }

    @RequestMapping(value = "/findSqoopTableByStatus", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse findSqoopTableByStatus(@RequestParam("status") String status, String dt) {
        //System.err.println("fdfdfdfdfdfd");
        return heraSqoopTaskService.findSqoopTableByStatus(status, dt);
        //System.err.println("status :" +status);
        //return jobManageService.findJobHistoryByStatus(status, dt);
    }

/*    @RequestMapping(value = "/ttt", method = RequestMethod.GET)
    @ResponseBody
    public void ttt() {
        String hdfsUploadPath = HeraGlobalEnvironment.getHdfsUploadPath();

        System.out.println(hdfsUploadPath);

    }*/


    @Autowired
    private HeraJobMonitorService heraJobMonitorService;

    @Autowired
    private HeraUserService heraUserService;

    @Autowired
    private EmailService emailService;


    @RequestMapping(value = "/alarm", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getAlarmInfo() {

        MonitorLog.info("sqoop任务异常报警开始");

        List<HeraSqoopTable> result = heraSqoopTaskService.getAlarmInfo();
        List<String> jobIdLists = new ArrayList<>();
        if (result == null) {
            return new JsonResponse(false, "今日无异常数据");
        }
        for (HeraSqoopTable h : result) {
            jobIdLists.add(h.getJobId());
        }
        jobIdLists = new ArrayList<>(new LinkedHashSet<>(jobIdLists));//[22, 58, 26, 210, 146, 204, 20, 32]
        // System.err.println(jobIdLists);

        // text.append("数据监控异常信息");
        for (int i = 0; i < jobIdLists.size(); i++) {
            StringBuilder text = new StringBuilder();
            //  text.append("数据监控异常信息");
            text.append("调度任务" + jobIdLists.get(i) + "中的异常信息有：\n");
            String jobId = null;
            for (HeraSqoopTable h : result) {
                if (h.getJobId().equalsIgnoreCase(jobIdLists.get(i))) {
                    jobId = h.getJobId();
                    text.append("源表:" + h.getSource());
                    if (h.getStatus().equalsIgnoreCase("failed")) {
                        text.append(",备注:" + h.getComment() + "。");
                    } else if (h.getIncrementRecords().equalsIgnoreCase("-0.5")) {
                        text.append(",备注:昨日数据量获取异常，可能是今日新增的同步任务。");
                    } else if (Integer.parseInt(h.getIncrementRecords()) < 0) {
                        text.append(",备注:数据量较之前减少" + h.getIncrementRecords().replace("-", "") + "条。");
                    } else {
                        text.append(h);
                    }
                    text.append("\n");
                }
            }
            // System.err.println(jobId+"_"+text.substring(0,text.length()-1));
            sqoopAlarm(jobId, text.toString());
        }
        return new JsonResponse("报警成功", true, "success");
    }


    public void sqoopAlarm(String jobId, String text) {//String actionId,

        HeraJob heraJob = null;
        try {
            heraJob = heraSqoopTaskService.findHeraUserById(jobId);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("sqoopAlarm出错");
        }

        StringBuilder address = new StringBuilder();
        try {
            HeraJobMonitor monitor = heraJobMonitorService.findByJobId(heraJob.getId());
            if (monitor == null && Constants.PUB_ENV.equals(HeraGlobalEnvironment.getEnv())) {
                ScheduleLog.info("任务无监控人，发送给owner：{}", heraJob.getId());
                HeraUser user = heraUserService.findByName(heraJob.getOwner());
                address.append(user.getEmail().trim());
                WeiChatUtil.sendWeiChatMessage(user, text, text);
            } else if (monitor != null) {
                String ids = monitor.getUserIds();
                String[] id = ids.split(Constants.COMMA);
                for (String anId : id) {
                    if (StringUtils.isBlank(anId)) {
                        continue;
                    }
                    HeraUser user = heraUserService.findById(Integer.parseInt(anId));
                    if (user != null && user.getEmail() != null) {
                        address.append(user.getEmail()).append(Constants.SEMICOLON);
                    }
                    WeiChatUtil.sendWeiChatMessage(user, "数据同步任务(id=" + heraJob.getId() + ")异常", text);
                }
            }
            emailService.sendEmail("数据同步任务(id=" + heraJob.getId() + ")异常",
                    text.replace("\n", "<br/>"),
                    address.toString());
        } catch (MessagingException e) {
            e.printStackTrace();
            ErrorLog.error("发送邮件失败");
        }
    }


    @RequestMapping(value = "/getSqoopFailedNum", method = RequestMethod.GET)
    @ResponseBody
    public String getSqoopFailedNum() {

        return heraSqoopTaskService.getSqoopFailedNum();
    //  return null;

    }





}




