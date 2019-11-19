package com.dfire.controller;

import com.alibaba.fastjson.JSONArray;
import com.dfire.common.constants.Constants;
import com.dfire.common.entity.*;
import com.dfire.common.entity.model.JsonResponse;
import com.dfire.common.entity.model.TablePageForm;
import com.dfire.common.entity.model.TableResponse;
import com.dfire.common.entity.vo.*;
import com.dfire.common.enums.JobScheduleTypeEnum;
import com.dfire.common.enums.StatusEnum;
import com.dfire.common.enums.TriggerTypeEnum;
import com.dfire.common.service.*;
import com.dfire.common.util.ActionUtil;
import com.dfire.common.util.BeanConvertUtils;
import com.dfire.common.util.NamedThreadFactory;
import com.dfire.common.util.StringUtil;
import com.dfire.common.vo.GroupTaskVo;
import com.dfire.config.HeraGlobalEnvironment;
import com.dfire.config.UnCheckLogin;
import com.dfire.core.netty.worker.WorkClient;
import com.dfire.logs.MonitorLog;
import com.dfire.protocol.JobExecuteKind;
import org.apache.commons.lang3.StringUtils;
import org.quartz.CronExpression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.async.WebAsyncTask;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * @author: <a href="mailto:lingxiao@2dfire.com">凌霄</a>
 * @time: Created in 16:50 2018/1/13
 * @desc 调度中心视图管理器
 */
@Controller
@RequestMapping("/scheduleCenter")
public class ScheduleCenterController extends BaseHeraController {

    private final String JOB = "job";
    private final String GROUP = "group";
    private final String ERROR_MSG = "抱歉，您没有权限进行此操作";
    @Autowired
    @Qualifier("heraJobMemoryService")
    private HeraJobService heraJobService;
    @Autowired
    private HeraJobActionService heraJobActionService;
    @Autowired
    @Qualifier("heraGroupMemoryService")
    private HeraGroupService heraGroupService;
    @Autowired
    private HeraJobHistoryService heraJobHistoryService;
    @Autowired
    private HeraJobMonitorService heraJobMonitorService;
    @Autowired
    private HeraUserService heraUserService;
    @Autowired
    private HeraPermissionService heraPermissionService;
    @Autowired
    private WorkClient workClient;
    @Autowired
    private HeraHostGroupService heraHostGroupService;
    @Autowired
    private HeraAreaService heraAreaService;
    private ThreadPoolExecutor poolExecutor;

    {
        poolExecutor = new ThreadPoolExecutor(
                1, Runtime.getRuntime().availableProcessors() * 4, 60L, TimeUnit.SECONDS, new LinkedBlockingQueue<>(), new NamedThreadFactory("updateJobThread"), new ThreadPoolExecutor.AbortPolicy());
        poolExecutor.allowCoreThreadTimeOut(true);
    }

    @RequestMapping()
    public String login(@RequestParam("syFlag") int syFlag,ModelMap map) {
        map.addAttribute("syFlag",syFlag);
        return "scheduleCenter/scheduleCenter.index";
    }

    @RequestMapping(value = "/init", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, List<HeraJobTreeNodeVo>> initJobTree() {
        return heraJobService.buildJobTree(getOwner());
    }

    @RequestMapping(value = "/getJobMessage", method = RequestMethod.GET)
    @ResponseBody
    public HeraJobVo getJobMessage(Integer jobId) {
        HeraJob job = heraJobService.findById(jobId);
       // System.err.println(job);

        HeraJobVo heraJobVo = BeanConvertUtils.convert(job);
        heraJobVo.setInheritConfig(getInheritConfig(job.getGroupId()));
        HeraJobMonitor monitor = heraJobMonitorService.findByJobId(jobId);
        StringBuilder focusUsers = new StringBuilder("[ ");
        if (monitor != null && StringUtils.isNotBlank(monitor.getUserIds())) {
            String ownerId = getOwnerId();
            String[] ids = monitor.getUserIds().split(Constants.COMMA);
            Arrays.stream(ids).forEach(id -> {
                if (ownerId.equals(id)) {
                    heraJobVo.setFocus(true);
                }
                if (StringUtils.isNotEmpty(id) && !id.equalsIgnoreCase("null")) {
                    //System.err.println("getJobMessage__id :"+id);
                    HeraUser heraUser = heraUserService.findById(Integer.valueOf(id));
                    focusUsers.append(heraUser.getName() + " ");
                }

            });
        }

        HeraHostGroup hostGroup = heraHostGroupService.findById(job.getHostGroupId());
        focusUsers.append("]");
        if (hostGroup != null) {
            heraJobVo.setHostGroupName(hostGroup.getName());
        }
        heraJobVo.setUIdS(getuIds(jobId));
        heraJobVo.setFocusUser(focusUsers.toString());

        //System.err.println("heraJobVo_runType :"+heraJobVo.getRunType());
        //System.err.println(""+heraJobVo);
        return heraJobVo;
    }

    /**
     * 组下搜索任务
     *
     * @param groupId  groupId
     * @param type     0：all 所有任务 1:running 运行中的任务
     * @param pageForm layui table分页参数
     * @return 结果
     */
    @RequestMapping(value = "/getGroupTask", method = RequestMethod.GET)
    @ResponseBody
    public TableResponse<List<GroupTaskVo>> getGroupTask(String groupId, Integer type, TablePageForm pageForm) {


        List<HeraGroup> group = heraGroupService.findDownStreamGroup(getGroupId(groupId));

        Set<Integer> groupSet = group.stream().map(HeraGroup::getId).collect(Collectors.toSet());
        List<HeraJob> jobList = heraJobService.getAll();
        Set<Integer> jobIdSet = jobList.stream().filter(job -> groupSet.contains(job.getGroupId())).map(HeraJob::getId).collect(Collectors.toSet());

        //TODO  先写死 只看今天
        Calendar calendar = Calendar.getInstance();
        String startDate = ActionUtil.getFormatterDate("yyyyMMdd", calendar.getTime());
        calendar.add(Calendar.DAY_OF_MONTH, +1);
        String endDate = ActionUtil.getFormatterDate("yyyyMMdd", calendar.getTime());
        List<GroupTaskVo> taskVos = heraJobActionService.findByJobIds(new ArrayList<>(jobIdSet), startDate, endDate, pageForm, type);
        return new TableResponse<>(pageForm.getCount(), 0, taskVos);

    }

    @RequestMapping(value = "/getGroupMessage", method = RequestMethod.GET)
    @ResponseBody
    public HeraGroupVo getGroupMessage(String groupId) {
        Integer id = getGroupId(groupId);
        HeraGroup group = heraGroupService.findById(id);
        HeraGroupVo groupVo = BeanConvertUtils.convert(group);
        groupVo.setInheritConfig(getInheritConfig(groupVo.getParent()));
        groupVo.setUIdS(getuIds(id));
        return groupVo;
    }


    @RequestMapping(value = "/updatePermissionSelf", method = RequestMethod.POST)
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public JsonResponse updatePermissionSelf(@RequestParam("id") String id,
                                             @RequestParam("type") boolean type,
                                             @RequestParam("uIdS") String names) {
        //System.err.println(id +":" +type +":" +names);
        //System.err.println("自动添加管理员组开始");
        Integer newId = getGroupId(id);
        //System.err.println("0");
        if (!hasPermission(newId, type ? GROUP : JOB)) {
            return new JsonResponse(false, ERROR_MSG);
        }
        //System.err.println("1");
        Integer integer = null;
        //System.err.println("1.0");
        integer = heraPermissionService.deleteByTargetId(newId);
        if (integer == null) {
            return new JsonResponse(false, "修改失败");
        }
        HeraPermission heraPermission = new HeraPermission();
        if (names != null) {
            String typeStr = type ? "group" : "job";
            Date date = new Date();
            Long targetId = Long.parseLong(String.valueOf(newId));
            String uId = names;
            heraPermission.setType(typeStr);
            heraPermission.setGmtModified(date);
            heraPermission.setGmtCreate(date);
            heraPermission.setTargetId(targetId);
            heraPermission.setUid(uId);
        }
        Integer res = heraPermissionService.insert(heraPermission);
        if (res == null) {
            //System.err.println("修改失败");
            MonitorLog.info("任务id={}【自动添加管理员】失败 管理员:{}", id, getOwner());
            return new JsonResponse(false, "修改失败");
        }
        //System.err.println("修改成功");
        MonitorLog.info("任务id={}【自动添加管理员】成功 管理员:{}", id, getOwner());
        return new JsonResponse(true, "修改成功");
    }


    @RequestMapping(value = "/updatePermission", method = RequestMethod.POST)
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public JsonResponse updatePermission(@RequestParam("id") String id,
                                         @RequestParam("type") boolean type,
                                         @RequestParam("uIdS") String names) {
        Integer newId = getGroupId(id);
        if (!hasPermission(newId, type ? GROUP : JOB)) {
            return new JsonResponse(false, ERROR_MSG);
        }
        // System.err.println(names);
        JSONArray uIdS = JSONArray.parseArray(names);
        Integer integer = heraPermissionService.deleteByTargetId(newId);
        if (integer == null) {
            return new JsonResponse(false, "修改失败");
        }
        if (uIdS != null && uIdS.size() > 0) {
            String typeStr = type ? "group" : "job";
            Date date = new Date();
            Long targetId = Long.parseLong(String.valueOf(newId));
            List<HeraPermission> permissions = new ArrayList<>(uIdS.size());
            for (Object uId : uIdS) {
                HeraPermission heraPermission = new HeraPermission();
                heraPermission.setType(typeStr);
                heraPermission.setGmtModified(date);
                heraPermission.setGmtCreate(date);
                heraPermission.setTargetId(targetId);
                heraPermission.setUid((String) uId);
                permissions.add(heraPermission);
            }
            Integer res = heraPermissionService.insertList(permissions);
            if (res == null || res != uIdS.size()) {
                return new JsonResponse(false, "修改失败");
            }
        }

        return new JsonResponse(true, "修改成功");
    }


    @RequestMapping(value = "/getJobOperator", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getJobOperator(String jobId, boolean type) {

        //System.err.println("jobId :"+jobId +"__"+"type :"+type);

        Integer groupId = getGroupId(jobId);
        if (!hasPermission(groupId, type ? GROUP : JOB)) {
            return new JsonResponse(false, ERROR_MSG);
        }
        //select * from hera_permission where target_id =#{targetId}
        List<HeraPermission> permissions = heraPermissionService.findByTargetId(groupId);
        //select name from hera_user
        List<HeraUser> all = heraUserService.findAllName();


        if (all == null || permissions == null) {
            return new JsonResponse(false, "发生错误，请联系管理员");
        }
        if (jobId.indexOf("group") > -1) {
            Map<String, Object> res = new HashMap<>(2);
            res.put("allUser", all);
            res.put("admin", permissions);
            return new JsonResponse(true, "查询成功", res);
        } else {
            String jobMonitorInfo = getJobMonitorInfo(Integer.parseInt(jobId));
            Map<String, Object> res = new HashMap<>(2);
            res.put("allUser", all);
            res.put("admin", permissions);
            res.put("monitor", jobMonitorInfo);
            return new JsonResponse(true, "查询成功", res);
        }

    }

    /**
     * 手动执行任务/手动恢复任务triggerType=2
     *
     * @param actionId
     * @return
     */
    @RequestMapping(value = "/manual", method = RequestMethod.GET)
    @ResponseBody
    public WebAsyncTask<JsonResponse> execute(String actionId, Integer triggerType, @RequestParam(required = false) String owner) {

         //System.err.println("m_actionId :" + actionId);
        if (owner == null && !hasPermission(Integer.parseInt(actionId.substring(actionId.length() - 4)), JOB)) {
            return new WebAsyncTask<>(() -> new JsonResponse(false, ERROR_MSG));
        }
        TriggerTypeEnum triggerTypeEnum;
        HeraAction heraAction = heraJobActionService.findById(actionId);
        HeraJob heraJob = heraJobService.findById(heraAction.getJobId());

        if (owner == null) {
            owner = super.getOwner();
        }
        if (owner == null) {
            throw new IllegalArgumentException("任务执行人为空");
        }
        String configs;
        configs = heraJob.getConfigs();
        //System.err.println("triggerType : " + triggerType);
        //System.err.println("1  configs : "+configs);
        if (triggerType == 2) {
            triggerTypeEnum = TriggerTypeEnum.MANUAL_RECOVER;
            try {
                configs = configs.split("\"roll.back.times\":\"[\\d]+[\"]")[0] + "\"roll.back.times\":\"0\"" + configs.split("\"roll.back.times\":\"[\\d]+[\"]")[1];
            } catch (Exception e) {
                configs = heraJob.getConfigs();
                e.printStackTrace();
            }
        } else if (triggerType == 3) {
            triggerTypeEnum = TriggerTypeEnum.MANUAL;
            configs = heraJob.getConfigs();
        } else {
            triggerTypeEnum = TriggerTypeEnum.MANUAL;
            configs = heraJob.getConfigs();
        }
        //System.err.println("2  configs : "+configs);
        HeraJobHistory actionHistory = HeraJobHistory.builder().build();
        actionHistory.setJobId(heraAction.getJobId());
        actionHistory.setActionId(heraAction.getId().toString());
        actionHistory.setTriggerType(triggerTypeEnum.getId());
        actionHistory.setOperator(heraJob.getOwner());
        actionHistory.setIllustrate(owner);
        actionHistory.setStatus(StatusEnum.RUNNING.toString());
        actionHistory.setStatisticEndTime(heraAction.getStatisticEndTime());
        actionHistory.setHostGroupId(heraAction.getHostGroupId());
        actionHistory.setProperties(configs);

        //System.err.println("actionHistory : " + actionHistory);
        heraJobHistoryService.insert(actionHistory);

        heraAction.setScript(heraJob.getScript());
        heraAction.setHistoryId(actionHistory.getId());
        heraAction.setConfigs(configs);
        heraAction.setAuto(heraJob.getAuto());
        heraAction.setHostGroupId(heraJob.getHostGroupId());

      //  System.err.println("heraAction : " + heraAction);
        heraJobActionService.update(heraAction);

        //  System.err.println("JobExecuteKind.ExecuteKind.ManualKind___" + JobExecuteKind.ExecuteKind.ManualKind + "\n"
        //          + "actionHistory.getId()___" + actionHistory.getId());

        WebAsyncTask<JsonResponse> webAsyncTask = new WebAsyncTask<>(HeraGlobalEnvironment.getRequestTimeout(), () -> {
            try {
                //System.err.println("m_" + JobExecuteKind.ExecuteKind.ManualKind + "  _   " + actionHistory.getId());
                workClient.executeJobFromWeb(JobExecuteKind.ExecuteKind.ManualKind, actionHistory.getId());
            } catch (Exception e) {
                e.printStackTrace();
            }
            return new JsonResponse(true, actionId);
        });
        webAsyncTask.onTimeout(() -> new JsonResponse(false, "执行任务操作请求中，请稍后"));
        return webAsyncTask;
    }


    @RequestMapping(value = "/forceRunGetStatusById", method = RequestMethod.GET)
    @ResponseBody
    public String forceRunGetStatusById(String taskId) {

        String status = heraJobActionService.getStatus(taskId);
        return status;

    }


    static HashSet<String> taskSet = new HashSet();

    //强制恢复
    @RequestMapping(value = "/manualForceRecovery", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse manualForce(String taskId) {

        //System.err.println("taskId 1 :" + taskId);//184
        //if (taskId.length() < 5) {
        taskId = heraJobActionService.getLatestVersionAndStatus(taskId);
        //System.err.println("taskId 1.5 :" + staskId);//
        if (!StringUtils.isNotEmpty(taskId)) {//||staskId.equalsIgnoreCase("null")
            // System.err.println(taskId +"今天没有运行过，不能强制恢复");
            return new JsonResponse(false, "强制恢复失败", "所选择的任务今天没有运行过");
        }
        //}
        // System.err.println("taskId 2 :" + taskId);//201909240240000184+failed
        if (taskId.split("\\+")[1].equalsIgnoreCase("running")) {
            // System.err.println("所选择的任务：" + taskId.split("\\+")[0] + " 正在运行，请稍后再执行强制恢复");
            return new JsonResponse(false, "强制恢复失败", "所选择的任务" + taskId.split("\\+")[0] + "正在运行,请稍后再执行强制恢复");
        }
        if (taskId.split("\\+")[1].equalsIgnoreCase("success")) {
            //System.err.println("所选择的任务：" + taskId.split("\\+")[0] + " 最近一次版本执行状态为success，直接执行");
            return new JsonResponse(false, "所选择的任务" + taskId.split("\\+")[0] + "最近一次版本执行状态为success,请直接手动恢复", taskId.split("\\+")[0]);
        }

        taskId = taskId.split("\\+")[0];

        getUpDepends(taskId);

        //System.err.println("taskMap :" + taskMap);


        if (taskMap.size() == 1) {
            System.err.println(taskId + "上游全部成功，直接运行");
            return new JsonResponse(true, taskId + "上游全部成功，请直接执行手动恢复", taskId);
        }

        List<String> sortTaskQueueTasks = SortTAskQueueTask();
        //System.err.println("sortTaskQueueTasks :" + sortTaskQueueTasks);

        RetryTaskRank = 0;
        taskSet = new HashSet();
        taskMap = new LinkedHashMap<String, String>();

        String runningTask = "";
        for (String TaskQueueTask : sortTaskQueueTasks) {
            if (heraJobActionService.getStatus(TaskQueueTask).equalsIgnoreCase("running")) {
                runningTask += TaskQueueTask + ",";
            }
        }
        if (runningTask.length() > 1) {
            System.err.println("任务：" + runningTask.substring(0, runningTask.length() - 1) + "正在运行中，请稍后再执行强制恢复");
            return new JsonResponse(false, "任务：" + runningTask.substring(0, runningTask.length() - 1) + "正在运行中，请稍后再执行强制恢复", "任务：" + runningTask.substring(0, runningTask.length() - 1) + "正在运行中，请稍后再执行强制恢复");
        } else {
            String T = "";
            for (String TaskQueueTask : sortTaskQueueTasks) {
                T += TaskQueueTask + ",";
            }
            if (T.length() > 1) {
                T = T.substring(0, T.length() - 1);
            }
            return new JsonResponse(true, "任务：" + T + "需要恢复", T);
        }
    }


    public static String[] reverse(String[] a) {
        String[] b = a;
        for (int start = 0, end = b.length - 1; start < end; start++, end--) {
            String temp = b[start];
            b[start] = b[end];
            b[end] = temp;
        }
        return b;
    }

    public List<String> SortTAskQueueTask() {

        String str = "";
        for (Object key : taskMap.keySet()) {
            //System.err.println(taskMap.get(key).getClass());
            str += key + ",";
        }
        //System.err.println("str =" + str);
       /* StringBuffer buffer = new StringBuffer(str.substring(0, str.length() - 3));
        str = buffer.reverse().toString();*/
        str = str.substring(0, str.lastIndexOf(","));
        str = str.substring(0, str.lastIndexOf(","));
        String[] keys = str.split(",");
        reverse(keys);

        //System.err.println("str =" + str);

        String taskQueue = "";
        // String[] keys = str.split(",");
        for (String k : keys) {
            if (!k.equalsIgnoreCase("")) {
                // String o = taskMap.get(Integer.parseInt(k)).toString();
                taskQueue += taskMap.get(Integer.parseInt(k)) + ",";
            }
        }
        if (taskQueue.length() > 2) {
            taskQueue = taskQueue.substring(0, taskQueue.length() - 1).replace("[", "").replace("]", "").replace(" ", "");
        }
        //System.err.println("taskQueue"+taskQueue);

        String[] taskQueueArr = taskQueue.split(",");

        List<String> list = new ArrayList<>();
        for (int i = 0; i < taskQueueArr.length; i++) {
            if (!list.contains(taskQueueArr[i])) {
                list.add(taskQueueArr[i]);
            }
        }
        //System.err.println("去除重复后的list集合\n"+list);
        return list;
    }


    static int RetryTaskRank = 0;
    static LinkedHashMap taskMap = new LinkedHashMap<String, String>();

    public boolean getUpDepends(String id) {
        // HashSet oneSet = new HashSet();

        List<String> downTasks = heraJobActionService.judgeDownDependsStatus(id);
        // System.err.println("downTasks.get(0) :"+downTasks.size());
        if (downTasks.size() == 0) {

            HashSet hs = new HashSet<String>();

            hs.add(id);
            taskMap.put(0, hs);

            //任务下游没有任务
            boolean flag = true;
            List<String> upJobs = heraJobActionService.judgeUpDependsStatus(id);

            for (String str : upJobs) {
                if (!str.split("\\+")[1].equalsIgnoreCase("success")) {//有没成功的
                    //   oneSet.add(str.split("\\+")[0]);
                    flag = false;
                }
            }
            //  taskMap.put(RetryTaskRank,oneSet);

            if (!flag) {//说明上游有失败的任务
                getUpDepends1(upJobs);
            }
            return flag;
        } else {
            boolean flag = true;
            for (String s : downTasks) {
                List<String> upJobs = heraJobActionService.judgeUpDependsStatus(s);
                for (String str : upJobs) {
                    //System.err.println("str :"+str);
                    if (!str.split("\\+")[1].equalsIgnoreCase("success")) {//有没成功的
                        //   oneSet.add(str.split("\\+")[0]);
                        flag = false;
                    }
                }
            }
            //  taskMap.put(RetryTaskRank,oneSet);
            List<String> downTaskId = heraJobActionService.judgeDownDependsId(id);
            HashSet hs = new HashSet<String>();
            hs.add(downTaskId);
            taskMap.put(0, hs);
            if (!flag) {//说明上游有失败的任务
                //System.err.println("downTasks :"+downTasks);
                getUpDepends1(downTasks);
            }
            return flag;
        }


    }


    public void getUpDepends1(List<String> upJobs) {


        boolean f = true;
        HashSet oneSet = new HashSet();
        for (String str : upJobs) {
            if (!str.split("\\+")[1].equalsIgnoreCase("success")) {//有没成功的
                f = false;
                oneSet.add(str.split("\\+")[0]);
            }
        }
        if (RetryTaskRank == 0) {
            RetryTaskRank++;
        }
        taskMap.put(RetryTaskRank, oneSet);

        if (!f) {
            taskMap.get(RetryTaskRank).toString().replace("[", "").replace("]", "");
            RetryTaskRank++;
            List<String> s = new LinkedList<>();
            for (String str : upJobs) {
                if (!str.split("\\+")[1].equalsIgnoreCase("success")) {//有没成功的
                    List<String> ss = heraJobActionService.judgeUpDependsStatus(str.split("\\+")[0]);
                    for (String s1 : ss) {
                        s.add(s1);
                    }
                }
            }
            getUpDepends1(s);
        }

    }


    @RequestMapping(value = "/updateHeraReadyDependencyBak", method = RequestMethod.GET)
    @ResponseBody
    public void getAllNoSuccessTaskBak(String taskId) {

        System.err.println("taskId 1 :" + taskId);//184
        if (taskId.length() < 5) {
            taskId = heraJobActionService.getLatestVersionAndStatus(taskId);
        }
        System.err.println("taskId 2 :" + taskId);//201909240240000184+failed
        if (taskId.split("\\+")[1].equalsIgnoreCase("running")) {
            System.err.println("所选择的任务：" + taskId.split("\\+")[0] + " 正在运行，请稍后再执行强制恢复");
            return;
        }
        if (taskId.split("\\+")[1].equalsIgnoreCase("success")) {
            System.err.println("所选择的任务：" + taskId.split("\\+")[0] + " 最近一次版本执行状态未success，直接执行");
            return;
        }

        taskId = taskId.split("\\+")[0];
        // System.err.println("taskId :" + taskId);//201909240300000007

        getAllUpDepends(taskId);

        if (taskSet.size() < 1) {
            System.err.println(taskId + "是开始任务，直接运行");
            return;
        }
        System.err.println("taskSet : " + taskSet);
        String runningTask = "";
        String retryRunTask = "";
        String allTask = "";
        for (String str : taskSet) {
            if (str.indexOf("running") > -1) {
                runningTask += str.split("\\+")[0] + ",";
            }
        }
        if (runningTask.length() > 1) {
            System.err.println(runningTask.substring(0, runningTask.length() - 1) + " 正在运行，请稍后再执行强制恢复");
            return;
        }

        for (String str : taskSet) {
            allTask += str.split("\\+")[0] + ",";
        }

        System.err.println("allTask :" + allTask);
        for (String str : taskSet) {
            //  if (str.indexOf("no") > -1 || str.indexOf("failed") > -1) {
            if (!(str.indexOf("success") > -1)) {
                retryRunTask += str.split("\\+")[0] + ",";
            }
        }


        System.err.println("retryRunTask.length() :" + retryRunTask.length());
        if (retryRunTask.length() == 0) {
            System.err.println("上游任务全部成功，直接执行任务：" + taskId);
            return;
        }
        retryRunTask = retryRunTask.substring(0, retryRunTask.length() - 1);
        System.err.println("这些任务需要强制恢复：" + retryRunTask);


        //HashMap hashMap = retryRunTaskSort(retryRunTask);
        // retryRunTaskSort(retryRunTask);
        allTask = allTask.substring(0, allTask.length() - 1);
        retryRunTaskSort(allTask);

        //System.err.println("改好 ：" + retryRunTask);

        for (Object key : taskMap.keySet()) {
            System.err.println(key + " : " + taskMap.get(key));
        }

        //hashMap = new HashMap();
        taskSet = new HashSet();
        taskMap = new LinkedHashMap<String, String>();
    }

    public void retryRunTaskSort(String retryRunTask) {
        // retryRunTask=retryRunTask.replace("[","").replace("]","");
        System.err.println("retryRunTask : " + retryRunTask);
        //201909240300000101,201909240300000002,201909240300000003,201909240300000001,201909240300000004,201909240000000100
        int i = 0;

        String[] retryRunTasks = retryRunTask.split(",");
        HashSet startTask = new HashSet();
        for (String str : retryRunTasks) {
            // System.err.println("str : "+str);
            // System.err.println(heraJobActionService.getStatus(str));
            //if (!heraJobActionService.getStatus(str).equals("success")) {
            //heraJobActionService.getUpDependsId(str);
            //System.err.println(str + "_heraJobActionService.getUpDependsId(str) :" + heraJobActionService.getUpDependsId(str));
            if (!StringUtils.isNotEmpty(heraJobActionService.getUpDependsId(str))) {
                retryRunTask = retryRunTask.replace(str, "");
                startTask.add(str);
            }
        }
        // retryRunTask = "555";
        //  System.err.println("retryRunTask : " + retryRunTask);

        taskMap.put(i, startTask);

        if (retryRunTask.replace(",", "").length() > 8) {
            /*System.err.println("结束");
            return;*/
            retryRunTaskSortDown(taskMap, i, retryRunTask);
        }

        //return taskMap;
    }


    public void retryRunTaskSortDown(HashMap taskMap, int i, String retryRunTask) {

        /*if (retryRunTask.replace(",","").length() < 8) {
            System.err.println("结束");
            return;
        }*/

        //System.err.println(i+"+"+retryRunTask);
        String[] starts = taskMap.get(i).toString().replace("[", "").replace("]", "").split(",");
        i++;
        HashSet task = new HashSet();

        for (String start : starts) {//201909240300000101,201909240000000100
            if (!StringUtils.isNotEmpty(start)) {
                return;
            }
            System.err.println(i + "_start : ____" + start.length() + "_____" + retryRunTask);
            List<String> s1 = heraJobActionService.judgeDownDependsId(start);
            System.err.println(i + "_s1 : ____" + s1);
            /*if(s1.get(0).equals("no")){
            }*/
            for (String s2 : s1) {
                if (retryRunTask.indexOf(s2) > -1) {
                    retryRunTask = retryRunTask.replace(s2, "");
                    task.add(s2);
                }
            }
            //taskMap.put(i, task);
        }
        taskMap.put(i, task);

        if (retryRunTask.replace(",", "").length() < 8) {
            System.err.println("结束");
            return;
        }

        if (retryRunTask.replace(",", "").length() > 8) {
            retryRunTaskSortDown(taskMap, i, retryRunTask);
        }
    }

    /**/
    public boolean judgeFirstTask(String id) {
        //String id="201909191400000007";
        String upJobs = heraJobActionService.getUpDependsId(id);
        if (!StringUtils.isNotEmpty(upJobs)) {
            //System.err.println(id+"找到头了");
            return true;
        }
        return false;
    }


    public boolean getAllUpDepends(String id) {

        boolean flag = true;
        List<String> upJobs = heraJobActionService.judgeUpDependsStatus(id);
        boolean b = judgeFirstTask(id);//到头为true
        if (!b) {
            for (String str : upJobs) {
                taskSet.add(str);
                getAllUpDepends(str.split("\\+")[0]);
            }
            flag = false;
        }
        return flag;
    }

    //验证下游任务的状态
    public boolean judgeDownDependsStatus(String id) {

        // String id = "201909191600000004";
        List<String> downJobs = heraJobActionService.judgeDownDependsStatus(id);
        boolean flag = true;
        System.err.println("downJobs :" + downJobs);
        for (String str : downJobs) {
            if (str.indexOf("running") > -1) {
                System.err.println(id + "的下游任务" + str.split("\\+")[0]
                        + "正在执行，终止强制恢复");
                flag = false;
            } else if (str.indexOf("no") > -1) {
                System.err.println(id + "的下游任务" + str.split("\\+")[0]
                        + "未执行，请检查 :" + str.split("\\+")[0] + "的上游依赖");
                flag = false;
            } else {
                System.err.println("下游任务 " + str.split("\\+")[0] + "满足条件");
            }
        }

        return flag;

    }

    //判断上游任务的状态
    public boolean judgeUpDependsStatus(String id) {
        //String id="201909191400000007";
        List<String> upJobs = heraJobActionService.judgeUpDependsStatus(id);
        boolean flag = true;
        System.err.println("upJobs的长度 ：" + upJobs.size());
        System.err.println("upJobs :" + upJobs);
        for (String str : upJobs) {
            if (str.indexOf("running") > -1) {
                System.err.println(id + "的上游任务" + str.split("\\+")[0]
                        + "正在执行，终止强制恢复");
                flag = false;
            } else if (str.indexOf("null") > -1) {
                System.err.println(id + "的上游任务" + str.split("\\+")[0]
                        + "未执行，请检查 :" + str.split("\\+")[0] + "的上游依赖");
                //executeForce0(str.split("\\+")[0]);
                flag = false;
            } else if (str.indexOf("success") > -1) {
                System.err.println("上游任务 " + str.split("\\+")[0] + "满足条件");
            } else {
                flag = false;
            }
        }
        return flag;
    }

    //获取上游任务的状态
    public boolean getUpDependsIdAndStatus(String id) {
        //String id="201909191400000007";
        List<String> upJobs = heraJobActionService.judgeUpDependsStatus(id);
        boolean flag = true;
        System.err.println("upJobs的长度 ：" + upJobs.size());
        System.err.println("upJobs :" + upJobs);
        for (String str : upJobs) {
            if (str.indexOf("running") > -1) {
                System.err.println(id + "的上游任务" + str.split("\\+")[0]
                        + "正在执行，终止强制恢复");
                flag = false;
            } else if (str.indexOf("null") > -1) {
                System.err.println(id + "的上游任务" + str.split("\\+")[0]
                        + "未执行，请检查 :" + str.split("\\+")[0] + "的上游依赖");
                //executeForce0(str.split("\\+")[0]);
                flag = false;
            } else if (str.indexOf("success") > -1) {
                System.err.println("上游任务 " + str.split("\\+")[0] + "满足条件");
            } else {
                flag = false;
            }
        }
        return flag;
    }

    //验证同级别任务的状态
    public boolean judgeSameLevelJobsStatus(String id) {
        //String id = "201909191600000004";
        List<String> downJobs = heraJobActionService.judgeDownDependsId(id);
        boolean flag = true;
        System.err.println("downJobs :" + downJobs);
        for (String str : downJobs) {
            List<String> strs = heraJobActionService.judgeUpDependsStatus(str);
            for (String stris : strs) {
                System.err.println(id + "同级别任务状态 ：" + stris);
                if (stris.indexOf("null") > -1) {
                    flag = false;
                } else if (stris.indexOf("running") > -1) {
                    System.err.println("同级别任务 " + stris + "正在运行，终止强制恢复");
                    flag = false;
                }
            }
        }
        System.err.println("同级别任务验证 ：flag :" + flag);
        return flag;
    }


    @RequestMapping(value = "/getJobVersion", method = RequestMethod.GET)
    @ResponseBody
    public List<HeraActionVo> getJobVersion(String jobId) {
        List<HeraActionVo> list = new ArrayList<>();
        List<String> idList = heraJobActionService.getActionVersionByJobId(Long.parseLong(jobId));
        String[] arr;
        String vId;
        String vStatus;
        for (String id : idList) {
            //System.err.println("id :"+id);
            arr = id.split("\\+");
            try {
                vId = arr[0];
                vStatus = arr[1];
            } catch (Exception e) {
                vId = id;
                vStatus = "";
            }
            list.add(HeraActionVo.builder().id(vId).status(vStatus).build());
        }
        return list;
    }

    @RequestMapping(value = "/updateJobMessage", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse updateJobMessage(HeraJobVo heraJobVo) {

        //System.err.println("/updateJobMessage heraJobVo :"+heraJobVo);

        if (!hasPermission(heraJobVo.getId(), JOB)) {
            return new JsonResponse(false, ERROR_MSG);
        }
        if (StringUtils.isBlank(heraJobVo.getDescription())) {
            return new JsonResponse(false, "描述不能为空");
        }
        try {
            new CronExpression(heraJobVo.getCronExpression());
        } catch (ParseException e) {
            return new JsonResponse(false, "定时表达式不准确，请核实后再保存");
        }

        HeraHostGroup hostGroup = heraHostGroupService.findById(heraJobVo.getHostGroupId());
        if (hostGroup == null) {
            return new JsonResponse(false, "机器组不存在，请选择一个机器组");
        }

        if (StringUtils.isBlank(heraJobVo.getAreaId())) {
            return new JsonResponse(false, "至少选择一个任务所在区域");
        }

        //如果是依赖任务
        if (heraJobVo.getScheduleType() == 1) {
            String dependencies = heraJobVo.getDependencies();
            if (StringUtils.isNotBlank(dependencies)) {
                String[] jobs = dependencies.split(Constants.COMMA);
                HeraJob heraJob;
                boolean jobAuto = true;
                StringBuilder sb = null;
                for (String job : jobs) {
                    heraJob = heraJobService.findById(Integer.parseInt(job));
                    if (heraJob == null) {
                        return new JsonResponse(false, "任务:" + job + "为空");
                    }
                    if (heraJob.getAuto() != 1) {
                        if (jobAuto) {
                            jobAuto = false;
                            sb = new StringBuilder();
                            sb.append(job);
                        } else {
                            sb.append(",").append(job);
                        }
                    }
                }
                if (!jobAuto) {
                    return new JsonResponse(false, "不允许依赖关闭状态的任务:" + sb.toString());
                }
            } else {
                return new JsonResponse(false, "请勾选你要依赖的任务");
            }
        } else if (heraJobVo.getScheduleType() == 0) {
            heraJobVo.setDependencies("");
        } else {
            return new JsonResponse(false, "无法识别的调度类型");
        }
        return heraJobService.checkAndUpdate(BeanConvertUtils.convertToHeraJob(heraJobVo));
    }

    @RequestMapping(value = "/updateGroupMessage", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse updateGroupMessage(HeraGroupVo groupVo, String groupId) {
        groupVo.setId(getGroupId(groupId));
        if (!hasPermission(groupVo.getId(), GROUP)) {
            return new JsonResponse(false, ERROR_MSG);
        }
        HeraGroup heraGroup = BeanConvertUtils.convert(groupVo);
        boolean res = heraGroupService.update(heraGroup) > 0;
        return new JsonResponse(res, res ? "更新成功" : "系统异常,请联系管理员");
    }

    @RequestMapping(value = "/deleteJob", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse deleteJob(String id, Boolean isGroup) {
        Integer xId = getGroupId(id);
        if (!hasPermission(xId, isGroup ? GROUP : JOB)) {
            return new JsonResponse(false, ERROR_MSG);
        }
        boolean res;
        String check = checkDependencies(xId, isGroup);
        if (StringUtils.isNotBlank(check)) {
            return new JsonResponse(false, check);
        }

        if (isGroup) {
            res = heraGroupService.delete(xId) > 0;
            MonitorLog.info("{}【删除】组{}成功", getOwner(), xId);
            return new JsonResponse(res, res ? "删除成功" : "系统异常,请联系管理员");

        }
        res = heraJobService.delete(xId) > 0;
        MonitorLog.info("{}【删除】任务{}成功", getOwner(), xId);
        updateJobToMaster(res, xId);
        return new JsonResponse(res, res ? "删除成功" : "系统异常,请联系管理员");
    }

    @RequestMapping(value = "/addJob", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse addJob(HeraJob heraJob, String parentId) {
        //System.err.println(heraJob);
        heraJob.setGroupId(getGroupId(parentId));
        if (!hasPermission(heraJob.getGroupId(), GROUP)) {
            return new JsonResponse(false, ERROR_MSG);
        }
        heraJob.setHostGroupId(HeraGlobalEnvironment.defaultWorkerGroup);
        heraJob.setOwner(getOwner());
        heraJob.setScheduleType(JobScheduleTypeEnum.Independent.getType());
        int insert = heraJobService.insert(heraJob);
        if (insert > 0) {
            MonitorLog.info("{}【添加】任务{}成功", heraJob.getOwner(), heraJob.getId());
            //System.err.println(String.valueOf(heraJob.getId()));
            return new JsonResponse(true, String.valueOf(heraJob.getId()));
        } else {
            return new JsonResponse(false, "新增失败");
        }
    }

    @RequestMapping(value = "/addMonitor", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse updateMonitor(Integer id) {
        boolean res = heraJobMonitorService.addMonitor(getOwnerId(), id);
        if (res) {
            MonitorLog.info("{}【关注】任务{}成功", getOwner(), id);
            return new JsonResponse(true, "关注成功");
        } else {
            return new JsonResponse(false, "系统异常，请联系管理员");
        }

    }


    @RequestMapping(value = "/delMonitor", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse deleteMonitor(Integer id) {
        boolean res = heraJobMonitorService.removeMonitor(getOwnerId(), id);
        if (res) {
            MonitorLog.info("{}【取关】任务{}成功", getOwner(), id);
            return new JsonResponse(true, "取关成功");
        } else {
            return new JsonResponse(false, "系统异常，请联系管理员");
        }
    }

    @RequestMapping(value = "/addGroup", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse addJob(HeraGroup heraGroup, String parentId) {
        heraGroup.setParent(getGroupId(parentId));
        if (!hasPermission(heraGroup.getParent(), GROUP)) {
            return new JsonResponse(false, ERROR_MSG);
        }

        Date date = new Date();
        heraGroup.setGmtModified(date);
        heraGroup.setGmtCreate(date);
        heraGroup.setOwner(getOwner());
        heraGroup.setExisted(1);

        int insert = heraGroupService.insert(heraGroup);
        if (insert > 0) {
            MonitorLog.info("{}【添加】组{}成功", getOwner(), heraGroup.getId());
            return new JsonResponse(true, String.valueOf(heraGroup.getId()));
        } else {
            return new JsonResponse(false, String.valueOf(-1));

        }
    }

    @RequestMapping(value = "/updateSwitch", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse updateSwitch(Integer id, Integer status) {
        if (!hasPermission(id, JOB)) {
            return new JsonResponse(false, ERROR_MSG);
        }

        HeraJob heraJob = heraJobService.findById(id);

        if (status.equals(heraJob.getAuto())) {
            return new JsonResponse(true, "操作成功");
        }
        //关闭动作 上游关闭时需要判断下游是否有开启任务，如果有，则不允许关闭
        if (status != 1) {
            String errorMsg;
            if ((errorMsg = getJobFromAuto(heraJobService.findDownStreamJob(id), 1)) != null) {
                return new JsonResponse(false, id + "下游存在开启状态任务:" + errorMsg);
            }
        } else { //开启动作 如果有上游任务，上游任务不能为关闭状态
            String errorMsg;
            if ((errorMsg = getJobFromAuto(heraJobService.findUpStreamJob(id), 0)) != null) {
                return new JsonResponse(false, id + "上游存在关闭状态任务:" + errorMsg);
            }
        }
        boolean result = heraJobService.changeSwitch(id, status);

        if (result) {
            MonitorLog.info("{}【切换】任务{}状态{}成功", id, status == 1 ? Constants.OPEN_STATUS : status == 0 ? "关闭" : "失效");
        }
        if (status == 1) {
            updateJobToMaster(result, id);
            return new JsonResponse(result, result ? "开启成功" : "开启失败");
        } else if (status == 0) {
            return new JsonResponse(result, result ? "关闭成功" : "关闭失败");
        } else {
            return new JsonResponse(result, result ? "成功设置为失效状态" : "设置状态失败");
        }

    }


    private String getJobFromAuto(List<HeraJob> streamJob, Integer auto) {
        boolean has = false;
        StringBuilder filterJob = null;
        for (HeraJob job : streamJob) {
            if (job.getAuto().equals(auto)) {
                if (!has) {
                    has = true;
                    filterJob = new StringBuilder();
                    filterJob.append(job.getId());
                } else {
                    filterJob.append(",").append(job.getId());
                }
            }
        }
        if (has) {
            return filterJob.toString();
        }
        return null;
    }

    @RequestMapping(value = "/generateVersion", method = RequestMethod.POST)
    @ResponseBody
    public WebAsyncTask<String> generateVersion(String jobId) {
        if (!hasPermission(Integer.parseInt(jobId), JOB)) {
            return new WebAsyncTask<>(() -> ERROR_MSG);
        }
        WebAsyncTask<String> asyncTask = new WebAsyncTask<>(HeraGlobalEnvironment.getRequestTimeout(), () ->
                workClient.generateActionFromWeb(JobExecuteKind.ExecuteKind.ManualKind, jobId));
        asyncTask.onTimeout(() -> "版本生成时间较长，请耐心等待下");
        return asyncTask;
    }


    @RequestMapping(value = "/generateAllVersion", method = RequestMethod.GET)
    @ResponseBody
    public WebAsyncTask<String> generateAllVersion() {
        if (!isAdmin(getOwner())) {
            return new WebAsyncTask<>(() -> ERROR_MSG);
        }
        WebAsyncTask<String> asyncTask = new WebAsyncTask<>(HeraGlobalEnvironment.getRequestTimeout(), () ->
                workClient.generateActionFromWeb(JobExecuteKind.ExecuteKind.ManualKind, Constants.ALL_JOB_ID));
        asyncTask.onTimeout(() -> "全量版本生成时间较长，请耐心等待下");
        return asyncTask;
    }

    /**
     * 获取任务历史版本
     *
     * @param pageHelper
     * @return
     */
    @RequestMapping(value = "/getJobHistory", method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getJobHistory(PageHelper pageHelper) {
        /*查看信息日志详情
        System.out.println(heraJobHistoryService.findLogByPage(pageHelper));
        */
        return heraJobHistoryService.findLogByPage(pageHelper);
    }

    @RequestMapping(value = "/getHostGroupIds", method = RequestMethod.GET)
    @ResponseBody
    public List<HeraHostGroup> getHostGroupIds() {
        return heraHostGroupService.getAll();
    }

    /**
     * 取消正在执行的任务
     *
     * @param jobId
     * @param historyId
     * @return
     */
    @RequestMapping(value = "/cancelJob", method = RequestMethod.GET)
    @ResponseBody
    public WebAsyncTask<String> cancelJob(String historyId, String jobId) {
        if (!hasPermission(Integer.parseInt(jobId), JOB)) {
            return new WebAsyncTask<>(() -> ERROR_MSG);
        }

        HeraJobHistory history = heraJobHistoryService.findById(historyId);
        JobExecuteKind.ExecuteKind kind;
        if (TriggerTypeEnum.parser(history.getTriggerType()) == TriggerTypeEnum.MANUAL) {
            kind = JobExecuteKind.ExecuteKind.ManualKind;
        } else {
            kind = JobExecuteKind.ExecuteKind.ScheduleKind;
        }

        WebAsyncTask<String> webAsyncTask = new WebAsyncTask<>(HeraGlobalEnvironment.getRequestTimeout(), () ->
                workClient.cancelJobFromWeb(kind, historyId));
        webAsyncTask.onTimeout(() -> "任务取消执行中，请耐心等待");
        return webAsyncTask;
    }

    @RequestMapping(value = "getLog", method = RequestMethod.GET)
    @ResponseBody
    public HeraJobHistory getJobLog(Integer id) {
        return heraJobHistoryService.findLogById(id);
    }


    @RequestMapping(value = "/execute", method = RequestMethod.GET)
    @ResponseBody
    @UnCheckLogin
    public WebAsyncTask<JsonResponse> zeusExecute(Integer id, String owner) {
        List<HeraAction> actions = heraJobActionService.findByJobId(String.valueOf(id));
        if (actions == null) {
            return new WebAsyncTask<>(() -> new JsonResponse(false, "action为空"));
        }
        return execute(actions.get(actions.size() - 1).getId().toString(), 2, owner);

    }

    private void updateJobToMaster(boolean result, Integer id) {
        if (result) {
            poolExecutor.execute(() -> {
                try {
                    workClient.updateJobFromWeb(String.valueOf(id));
                } catch (ExecutionException | InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }
    }


    private Map<String, String> getInheritConfig(Integer groupId) {
        HeraGroup group = heraGroupService.findConfigById(groupId);
        Map<String, String> configMap = new TreeMap<>();
        while (group != null && groupId != null && groupId != 0) {
            Map<String, String> map = StringUtil.convertStringToMap(group.getConfigs());
            // 多重继承相同变量，以第一个的为准
            for (Map.Entry<String, String> entry : map.entrySet()) {
                String key = entry.getKey();
                if (!configMap.containsKey(key)) {
                    configMap.put(key, entry.getValue());
                }
            }
            groupId = group.getParent();
            group = heraGroupService.findConfigById(groupId);
        }
        return configMap;
    }

    private boolean hasPermission(Integer id, String type) {
        String owner = getOwner();
        if (owner == null || id == null || type == null) {
            return false;
        }
        if (isAdmin(owner)) {
            return true;
        }
        if (JOB.equals(type)) {
            HeraJob job = heraJobService.findById(id);
            if (!(job != null && owner.equals(job.getOwner()))) {
                HeraPermission permission = heraPermissionService.findByCond(id, owner);
                if (permission == null) {
                    permission = heraPermissionService.findByCond(job.getGroupId(), owner);
                    if (permission == null) {
                        return false;
                    }
                }
            }
        } else if (GROUP.equals(type)) {
            HeraGroup group = heraGroupService.findById(id);
            if (!(group != null && owner.equals(group.getOwner()))) {
                HeraPermission permission = heraPermissionService.findByCond(id, owner);
                if (permission == null) {
                    return false;
                }
            }
        }

        return true;
    }

    private boolean isAdmin(String owner) {
        return HeraGlobalEnvironment.getAdmin().equals(owner);
    }


    private String getuIds(Integer id) {
        List<HeraPermission> permissions = heraPermissionService.findByTargetId(id);
        StringBuilder uids = new StringBuilder("[ ");
        if (permissions != null && permissions.size() > 0) {
            permissions.forEach(x -> uids.append(x.getUid()).append(" "));
        }
        uids.append("]");

        return uids.toString();
    }

    private String checkDependencies(Integer id, boolean isGroup) {
        List<HeraJob> allJobs = heraJobService.getAllJobDependencies();
        if (isGroup) {

            HeraGroup heraGroup = heraGroupService.findById(id);
            if (heraGroup == null) {
                return "组不存在";
            } else if (heraGroup.getDirectory() == 1) {
                //如果是小目录
                List<HeraJob> jobList = heraJobService.findByPid(id);
                StringBuilder openJob = new StringBuilder("无法删除存在任务的目录:[ ");
                for (HeraJob job : jobList) {
                    openJob.append(job.getId()).append(" ");
                }
                openJob.append("]");
                if (jobList.size() > 0) {
                    return openJob.toString();
                }
                return null;
            } else {
                //如果是大目录
                List<HeraGroup> parent = heraGroupService.findByParent(id);

                if (parent == null || parent.size() == 0) {
                    return null;
                }
                StringBuilder openGroup = new StringBuilder("无法删除存在目录的目录:[ ");
                for (HeraGroup group : parent) {
                    if (group.getExisted() == 1) {
                        openGroup.append(group.getId()).append(" ");
                    }
                }
                openGroup.append("]");
                return openGroup.toString();
            }

        } else {
            HeraJob job = heraJobService.findById(id);
            if (job.getAuto() == 1) {
                return "无法删除正在开启的任务";
            }
            boolean canDelete = true;
            boolean isFirst = true;
            String deleteJob = String.valueOf(job.getId());
            StringBuilder dependenceJob = new StringBuilder("任务依赖: ");
            String[] dependenceJobs;
            for (HeraJob allJob : allJobs) {
                if (StringUtils.isNotBlank(allJob.getDependencies())) {
                    dependenceJobs = allJob.getDependencies().split(",");
                    for (String jobId : dependenceJobs) {
                        if (jobId.equals(deleteJob)) {
                            if (canDelete) {
                                canDelete = false;
                            }
                            if (isFirst) {
                                isFirst = false;
                                dependenceJob.append("[").append(job.getId()).append(" -> ").append(allJob.getId()).append(" ");
                            } else {
                                dependenceJob.append(allJob.getId()).append(" ");
                            }
                            break;
                        }
                    }
                }
            }
            dependenceJob.append("]").append("\n");
            if (!canDelete) {
                return dependenceJob.toString();
            }
            return null;
        }
    }

    /**
     * 一键开启/关闭/失效 某job 的上游/下游的所有任务
     *
     * @param jobId jobId
     * @param type  0:上游  1:下游
     * @param auto  0:关闭  1:开启  2:失效
     * @return
     */
    @RequestMapping(value = "/switchAll", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getJobImpact(Integer jobId, Integer type, Integer auto) {
        List<Integer> jobList = heraJobService.findJobImpact(jobId, type);
        if (jobList == null) {
            return new JsonResponse(false, "当前任务不存在");
        }
        int size = jobList.size();
        JsonResponse response;
        if ((type == 0 && auto == 1) || (type == 1 && auto != 1)) {
            for (int i = size - 1; i >= 0; i--) {
                response = this.updateSwitch(jobList.get(i), auto);
                if (!response.isSuccess()) {
                    return response;
                }
            }
        } else if ((type == 1 && auto == 1) || (type == 0 && auto != 1)) {
            for (int i = 0; i < size; i++) {
                response = this.updateSwitch(jobList.get(i), auto);
                if (!response.isSuccess()) {
                    return response;
                }
            }
        } else {
            return new JsonResponse(false, "未知的type:" + type);
        }

        return new JsonResponse(true, "全部处理成功", jobList);
    }


    @RequestMapping(value = "/getJobImpactOrProgress", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse getJobImpactOrProgress(Integer jobId, Integer type) {
        Map<String, Object> graph = heraJobService.findCurrentJobGraph(jobId, type);

        if (graph == null) {
            return new JsonResponse(false, "当前任务不存在");
        }


        return new JsonResponse(true, "成功", graph);
    }


    @RequestMapping(value = "/getAllArea", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getAllArea() {
        List<HeraArea> heraAreas = heraAreaService.findAll();
        if (heraAreas == null) {
            return new JsonResponse(false, "查询异常");
        }
        return new JsonResponse(true, "成功", heraAreas);
    }


    @RequestMapping(value = "/check", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse check(String id) {
        if (id == null) {
            return new JsonResponse(true, "查询成功", false);
        }
        if (id.startsWith(Constants.GROUP_PREFIX)) {
            return new JsonResponse(true, "查询成功", hasPermission(getGroupId(id), GROUP));
        } else {
            return new JsonResponse(true, "查询成功", hasPermission(Integer.parseInt(id), JOB));
        }
    }

    @RequestMapping(value = "/moveNode", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse moveNode(String id, String parent, String lastParent) {
        Integer newParent = getGroupId(parent);
        Integer newId;
        if (id.startsWith(GROUP)) {
            newId = getGroupId(id);
            if (!hasPermission(newId, GROUP)) {
                return new JsonResponse(false, "无权限");
            }
            boolean result = heraGroupService.changeParent(newId, newParent);
            MonitorLog.info("组{}:发生移动 {}  --->  {}", newId, lastParent, newParent);
            return new JsonResponse(result, result ? "处理成功" : "移动失败");
        } else {
            newId = Integer.parseInt(id);
            if (!hasPermission(newId, JOB)) {
                return new JsonResponse(false, "无权限");
            }
            boolean result = heraJobService.changeParent(newId, newParent);
            MonitorLog.info("任务{}:发生移动{}  --->  {}", newId, lastParent, newParent);
            return new JsonResponse(result, result ? "处理成功" : "移动失败");
        }

    }

    private Integer getGroupId(String group) {
        String groupNum = group;
        if (group.startsWith(Constants.GROUP_PREFIX)) {
            groupNum = group.split("_")[1];
        }
        Integer res;
        try {
            res = Integer.parseInt(groupNum);
        } catch (Exception e) {
            throw new IllegalArgumentException("无法识别的groupId：" + group);
        }

        return res;
    }

    @RequestMapping(value = "/getCurrentUser", method = RequestMethod.GET)
    @ResponseBody
    public String getCurrentUser() {
        String owner = getOwner();
        /*System.err.println("owner : "+owner);*/
        MonitorLog.info("当前用户 ：{}", owner);
        return owner;
    }


    @RequestMapping(value = "/findByTargetIdSelf", method = RequestMethod.POST)
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public Boolean findByTargetIdSelf(@RequestParam("id") String id) {

        Boolean flag = true;
        String owner = getOwner().trim();
        //System.err.println("owner : "+owner);
        Integer newId = Integer.parseInt(id);
        List<HeraPermission> all = heraPermissionService.findByTargetId(newId);
        for (HeraPermission h : all) {
            //System.err.println("h.getUid() : "+h.getUid());
            if (owner.equalsIgnoreCase(h.getUid().trim())) {
                //System.err.println(owner);
                //System.err.println(h.getUid());
                flag = false;
            }
        }
        if (owner.equalsIgnoreCase("zhangbinb") || owner.equalsIgnoreCase(HeraGlobalEnvironment.getAdmin())) {
            flag = false;
        }
        //  MonitorLog.info("任务id={}【自动添加管理员】成功 管理员:{}", id, getOwner());
        //System.err.println(flag);
        return flag;

    }


/*    @RequestMapping(value = "/getDatalinkTaskInfo", method = RequestMethod.GET)
    @ResponseBody
    public String getDatalinkTaskInfo() {
        //System.err.println("getDatalinkTaskInfo ... ");
        String strURL = "http://188.166.1.90:8081/taskMonitor/initTaskMonitor";
        String params = "{\"groupId\":\"1\",\"taskId\":\"-1\",\"start\":\"0\",\"length\":\"1000\",\"draw\":\"0\"}";

        BufferedReader reader = null;
        try {
            URL url = new URL(strURL);// 创建连接
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setDoOutput(true);
            connection.setDoInput(true);
            connection.setUseCaches(false);
            connection.setInstanceFollowRedirects(true);
            connection.setRequestMethod("POST"); // 设置请求方式
            // connection.setRequestProperty("Accept", "application/json"); // 设置接收数据的格式
            connection.setRequestProperty("Content-Type", "application/json"); // 设置发送数据的格式
            connection.connect();
            //一定要用BufferedReader 来接收响应， 使用字节来接收响应的方法是接收不到内容的
            OutputStreamWriter out = new OutputStreamWriter(connection.getOutputStream(), "UTF-8"); // utf-8编码
            out.append(params);
            out.flush();
            out.close();
            // 读取响应
            reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
            String line;
            String res = "";
            while ((line = reader.readLine()) != null) {
                res += line;
            }
            reader.close();
            //System.out.println(res);
            //return res;
            return res.split("\"recordsTotal\":")[1].split(",")[0];
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "-1"; // 自定义错误信息
    }*/


    public String getJobMonitorInfo(Integer jobId) {
        HeraJobMonitor monitor = heraJobMonitorService.findByJobId(jobId);
        StringBuilder focusUsers = new StringBuilder();
        if (monitor != null && StringUtils.isNotBlank(monitor.getUserIds())) {
            String[] ids = monitor.getUserIds().split(Constants.COMMA);
            Arrays.stream(ids).forEach(id -> {
                if (StringUtils.isNotEmpty(id) && !id.equalsIgnoreCase("null")) {
                    //System.err.println("getJobMessage__id :"+id);
                    HeraUser heraUser = heraUserService.findById(Integer.valueOf(id));
                    focusUsers.append(heraUser.getName() + ",");
                }
            });
        }
        return focusUsers.toString();
    }


    @RequestMapping(value = "/addMonitorByOwner", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse addMonitorByOwner(String names, Integer id) {
        //System.err.println("开始。。。");
        names = StringUtils.strip(names, "[]");
        //System.err.println("names :"+names+"   "+names.getClass());
        //System.err.println("id :"+id);
        String ids = getHeraJobIdByName(names);
        //System.err.println("ids :"+ids);

        if (StringUtils.isNotEmpty(names) && !names.equalsIgnoreCase("null")) {
            //ids="3,4,5,";
            //System.err.println("ids :"+ids+"\n"+"id :"+id);
            boolean res = heraJobMonitorService.addMonitors(ids, id);
            if (res) {
                //MonitorLog.info("{}【关注】任务{}成功", getOwner(), id);
                return new JsonResponse(true, "关注成功");
            } else {
                return new JsonResponse(false, "系统异常，请联系管理员");
            }
        } else {
            boolean res1 = heraJobMonitorService.removeAllMonitor(id);
            if (res1) {
                MonitorLog.info("任务{}取消所有关注者", id);
                return new JsonResponse(true, "任务{" + id + "}取消所有关注者成功");
            } else {
                return new JsonResponse(false, "任务{" + id + "}取消所有关注者失败");
            }
        }

    }


    public String getHeraJobIdByName(String users) {

        //System.err.println("users :"+users);
        StringBuilder uu = new StringBuilder();
        String[] user = users.split(",");
        for (String u : user) {
            //System.err.println("u :"+u);
            uu.append(heraUserService.getHeraJobIdByName(u.replace("\"", "")) + ",");
        }
        //uu.append(",");
        return uu.toString();
    }

    @RequestMapping(value = "/getStopHeraJobInfo", method = RequestMethod.GET)
    @ResponseBody
    public Integer getStopHeraJobInfo() {
        Integer stopCount = heraJobService.getStopHeraJobInfo();
        return stopCount;
    }

    // 获取任务运行的通常时间
    @RequestMapping(value = "/getTaskCommonTime", method = RequestMethod.GET)
    @ResponseBody
    public String getTaskCommonTime(String id) {
        //System.err.println("开始。。");
        //System.err.println("id "+id);
        String commonTime = heraJobActionService.getTaskCommonTime(id);
        //System.err.println("commonTime "+commonTime);
        return commonTime;
    }


}


/*    public boolean getUpDependsNoSuccessStatus(String id, HashMap taskMap) {
        //String id="201909191400000007";
        boolean flag = true;
        List<String> upJobs = heraJobActionService.judgeUpDependsStatus(id);
        System.err.println("all upJobs :" + upJobs);
        if (upJobs.size() == 0) {
            return true;
        }
        //System.err.println("upJobs的长度 ：" + upJobs.size());
        //System.err.println("upJobs :" + upJobs);
        String task = "";
        for (String str : upJobs) {
            if (str.indexOf("running") > -1) {
                System.err.println(id + "的上游任务" + str.split("\\+")[0]
                        + "正在执行，终止强制恢复");
                flag = false;
            } else if (str.indexOf("success") > -1) {
                System.err.println("上游任务 " + str.split("\\+")[0] + "满足条件");
            } else {
                task += str.split("\\+")[0] + ",";
                flag = false;
                System.err.println("task :" + task);
            }
        }
        //taskMap.put(task.substring(0, task.length() - 1));
        return flag;
    }*/



  /*  public void getUpNoSuccessTask(String taskId) {
        //String taskId = "201909192200000007";
        String upDependIds = heraJobActionService.getUpDependsId(taskId);
        //taskMap.put(taskRank,upDependIds);
    }*/



  /*
  *     @RequestMapping(value = "/manualForce————", method = RequestMethod.GET)
    @ResponseBody
    public WebAsyncTask<JsonResponse> executeForce999999999(String jobId) {
        //judgeSameLevelJobsStatus();
        //System.err.println(jobId);//100
        String latestVersionAndStatus = heraJobActionService.getLatestVersionAndStatus(jobId);
        //System.err.println("该任务最新版本 ："+latestVersionAndStatus);
        String[] arrs = latestVersionAndStatus.split("\\+");//"201909191200000007+success";
        //System.err.println("该任务最新版本id ："+arrs[0]);201909191200000007
        //System.err.println("该任务最新版本status ："+arrs[1]);success

        if (arrs[1].equalsIgnoreCase("success")) {
            System.err.println(arrs[0] + "任务运行过，需判断下任务是成功");
            boolean b = judgeDownDependsStatus(arrs[0]);
            if (b == true) {
                System.err.println("说明下游任务跑过，直接重跑");
                updateHeraReadyDependency(arrs[0]);//先改库
                forceRun(arrs[0], getOwner());
            } else {
                System.err.println("下游任务没跑过");
                boolean b1 = judgeSameLevelJobsStatus(arrs[0]);
                if (b1) {//下游任务的所有上游都成功
                    System.err.println("说明下游任务没跑，是因为A任务，执行A任务");
                    updateHeraReadyDependency(arrs[0]);//先改库
                    forceRun(arrs[0], getOwner());
                }
            }
        } else if (arrs[1].equalsIgnoreCase("no")) {
            System.err.println(arrs[0] + "\n"
                    + "任务状态为no，说明该任务没执行过，需判断该任务上游任务");
            boolean flag = judgeUpDependsStatus(arrs[0]);
            //如果为true 则说明本任务可以重新执行 ---》 验证下级别
            if (flag) {
                System.err.println("此时需判断同级别其他任务状态，若其他均运行过，则进行改库，执行");
                boolean b = judgeDownDependsStatus(arrs[0]);
                if (b == true) {
                    System.err.println("说明下游任务跑过，直接重跑");
                    updateHeraReadyDependency(arrs[0]);//先改库
                    forceRun(arrs[0], getOwner());
                } else {
                    System.err.println("下游任务没跑过");
                    boolean b1 = judgeSameLevelJobsStatus(arrs[0]);
                    if (b1) {//下游任务的所有上游都成功
                        System.err.println("说明下游任务没跑，是因为A任务，执行A任务");
                        updateHeraReadyDependency(arrs[0]);//先改库
                        forceRun(arrs[0], getOwner());
                    }
                }

            }
            //如果为false 则提醒上游哪一个任务出问题
        } else if (arrs[1].equalsIgnoreCase("running")) {
            System.err.println(arrs[0] + "任务正在运行，终止强制恢复");
        }

        WebAsyncTask<JsonResponse> webAsyncTask = new WebAsyncTask<>(HeraGlobalEnvironment.getRequestTimeout(), () -> {
            try {
                // workClient.executeJobFromWeb(JobExecuteKind.ExecuteKind.ManualKind, actionHistory.getId());
            } catch (Exception e) {
                e.printStackTrace();
            }
            return new JsonResponse(true, jobId);
        });
        webAsyncTask.onTimeout(() -> new JsonResponse(false, "执行任务操作请求中，请稍后"));
        return webAsyncTask;
    }
  *
  *
  *
  * */



  /*public void updateHeraReadyDependency(String id) {
        //String readDependency = heraJobActionService.getReadDependency("201909191800000007");
        String readDependency = heraJobActionService.getReadDependency(id);
        System.err.println("dependencies + readDependency :" + readDependency);
        String[] arr = readDependency.split("\\+");
        //{"201909191800000002":"1568887207309","201909191800000003":"1568887208311"}

        String str = "201909191825000002";
        System.out.println(str.length());
        String s = str.substring(0, 12);
        System.out.println(s);
        String ss = "";
        String jobId = "123467";
        if (jobId.length() == 1) {
            ss = s + "00000" + jobId;
        } else if (jobId.length() == 2) {
            ss = s + "0000" + jobId;
        } else if (jobId.length() == 3) {
            ss = s + "000" + jobId;
        } else if (jobId.length() == 4) {
            ss = s + "00" + jobId;
        } else if (jobId.length() == 5) {
            ss = s + "0" + jobId;
        } else if (jobId.length() == 6) {
            ss = s + jobId;
        }

        System.out.println(ss.length() + "  " + ss
        );


    }*/


  /*    //检测本任务最近版本
    @RequestMapping(value = "/manualForce0", method = RequestMethod.GET)
    @ResponseBody
    public WebAsyncTask<JsonResponse> executeForce0(String jobId) {
        //judgeSameLevelJobsStatus();
        System.err.println(jobId);
        String latestVersionAndStatus = heraJobActionService.getLatestVersionAndStatus(jobId);
        System.err.println(latestVersionAndStatus);
        String[] arrs = latestVersionAndStatus.split("\\+");//"201909191200000007+success";

        String taskId = arrs[0];
        String taskStatus = arrs[1];
        System.err.println(taskId);
        System.err.println(taskStatus);

        if (taskStatus.equalsIgnoreCase("null")) {
            System.err.println(taskId + "\n"
                    + "任务状态为null，说明该任务没执行过，需判断该任务上游任务");
            boolean flag = judgeUpDependsStatus(taskId);
            //如果为true 则说明本任务可以重新执行 ---》 验证下级别
            if (flag) {
                System.err.println("此时需判断同级别其他任务状态，若其他均运行过，则进行改库，执行");


            }
            //如果为false 则提醒上游哪一个任务出问题
        } else if (taskStatus.equalsIgnoreCase("running")) {
            System.err.println(taskId + "任务正在运行，终止强制恢复");
        } else if (taskStatus.equalsIgnoreCase("success") || taskStatus.equalsIgnoreCase("failed")) {
            System.err.println(taskId + "任务运行过，需判断下游任务是成功");
            judgeDownDependsStatus(taskId);
        }
        WebAsyncTask<JsonResponse> jsonResponseWebAsyncTask = forceRun(taskId, getOwner());
        return jsonResponseWebAsyncTask;

    }*/


/*
    //针对上游任务为null或者failed
    public WebAsyncTask<JsonResponse> forUpNullAndFailed(String jobId) {

        List<String> upJobs = heraJobActionService.judgeUpDependsStatus(jobId);
        for (String str : upJobs) {
            if (str.split("\\+")[1].equalsIgnoreCase("running")) {
                System.err.println("forFailed " + str.split("\\+")[0] + " 任务正在运行，终止强制恢复");
            } else if (str.split("\\+")[1].equalsIgnoreCase("failed")) {
                executeForce0(str.split("\\+")[0]);
            } else if (str.split("\\+")[1].equalsIgnoreCase("null")) {
                forNull(str.split("\\+")[0]);
            }
        }

        boolean b = judgeUpDependsStatus(jobId);
        if (b) {
            WebAsyncTask<JsonResponse> webAsyncTask = new WebAsyncTask<>(HeraGlobalEnvironment.getRequestTimeout(), () -> {
                try {
                    workClient.executeJobFromWeb(JobExecuteKind.ExecuteKind.ManualKind, jobId);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return new JsonResponse(true, jobId);
            });
            webAsyncTask.onTimeout(() -> new JsonResponse(false, "执行任务操作请求中，请稍后"));
            return webAsyncTask;
        }
        return null;
    }*/
