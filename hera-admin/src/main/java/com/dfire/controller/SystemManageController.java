package com.dfire.controller;

import com.dfire.bean.AppInfos;
import com.dfire.bean.ClusterMetrics;
import com.dfire.bean.MaxWellMonitorInfo;
import com.dfire.common.entity.HeraHostRelation;
import com.dfire.common.entity.HeraYarnInfoUse;
import com.dfire.common.entity.model.JsonResponse;
import com.dfire.common.entity.model.TableResponse;
import com.dfire.common.entity.vo.HeraActionVo;
import com.dfire.common.entity.vo.HeraDataDiscoveryVo;
import com.dfire.common.entity.vo.HeraJobVo;
import com.dfire.common.service.*;
import com.dfire.common.util.HeraDateTool;
import com.dfire.common.vo.UserJobInfo;
import com.dfire.config.HeraGlobalEnvironment;
import com.dfire.core.netty.worker.WorkClient;
import com.dfire.logs.ErrorLog;
import com.dfire.monitor.service.JobManageService;
import com.dfire.util.AppInfoDateUtil;
import com.dfire.util.HtmlUnitCommon;
import com.dfire.util.MaxWellForInfoUtil;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.async.WebAsyncTask;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

/**
 * @author: <a href="mailto:lingxiao@2dfire.com">凌霄</a>
 * @time: Created in 16:52 2018/1/13
 * @desc 系统管理
 */
@Controller
public class SystemManageController extends BaseHeraController {

    @Autowired
    private JobManageService jobManageService;

    @Autowired
    private HeraJobActionService heraJobActionService;

    @Autowired
    private HeraHostRelationService heraHostRelationService;

    @Autowired
    private WorkClient workClient;

    @Autowired
    HeraDataDiscoveryService heraDataDiscoveryService;
    @Autowired
    HeraYarnInfoUseService heraYarnInfoUseService;

    @Autowired
    HeraJobService heraJobService;

    @RequestMapping("/userManage")
    public String userManage() {
        if (checkAdmin()) {
            return "systemManage/userManage.index";
        }
        return "home";
    }

    @RequestMapping("/workManage")
    public String workManage() {
        if (checkAdmin()) {
            return "systemManage/workManage.index";
        }
        return "home";
    }


    @RequestMapping("/offlineTaskMonitoring")
    public String offlineTaskMonitoring() {
        /**
         　　* @Description: TODO 离线任务监控跳转
         　　* @param []
         　　* @return java.lang.String
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/7/31 14:01
         　　*/

        return "systemManage/offlineTaskMonitoring.index";
    }

    @RequestMapping("/maxwellInfo")
    public String maxwellInfo() {
        /**
         　　* @Description: TODO 离线任务监控跳转
         　　* @param []
         　　* @return java.lang.String
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/7/31 14:01
         　　*/

        return "systemManage/maxwellInfo.index";
    }

    @RequestMapping("/hostGroupManage")
    public String hostGroupManage() {
        if (checkAdmin()) {
            return "systemManage/hostGroupManage.index";
        }
        return "home";
    }

    @RequestMapping("/jobDetail")
    public String jobManage() {
        return "jobManage/stopJobDetail.index";
    }
    /*public String jobManage() {
        return "jobManage/jobDetail.index";
    }*/


    @RequestMapping("/stopJobDetail")
    public String stopJobManage(@RequestParam("syFlag") int syFlag,ModelMap map) {
        map.addAttribute("syFlag",syFlag);
        return "jobManage/stopJobDetail.index";
    }


    @RequestMapping("/jobDag")
    public String jobDag() {
        return "jobManage/jobDag.index";
    }

    @RequestMapping("/machineInfo")
    public String machineInfo() {
        return "machineInfo";
    }

    @RequestMapping(value = "/workManage/list", method = RequestMethod.GET)
    @ResponseBody
    public TableResponse<List<HeraHostRelation>> workManageList() {
        List<HeraHostRelation> hostRelations = heraHostRelationService.getAll();
        if (hostRelations == null) {
            return new TableResponse<>(-1, "查询失败");
        }
        return new TableResponse<>(hostRelations.size(), 0, hostRelations);
    }


    @RequestMapping(value = "/offlineTaskMonitoring/list", method = RequestMethod.GET)
    @ResponseBody
    public TableResponse<List<ClusterMetrics>> offlineTaskMonitoringList() {
        /**
         　　* @Description: TODO 离线任务查询_资源使用概况
         　　* @param []
         　　* @return com.dfire.common.entity.model.TableResponse<java.util.List<com.dfire.common.entity.HeraHostRelation>>
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/7/31 14:02
         　　*/
        ClusterMetrics clusterMetrics = HtmlUnitCommon.selectClusterMetrics();
        List<ClusterMetrics> list = new ArrayList<>();
        list.add(clusterMetrics);
        return new TableResponse<>(list.size(), 0, list);
    }

    @RequestMapping(value = "/offlineTaskMonitoring/selectHeraYarnInfoUseList", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse selectHeraYarnInfoUseList(HeraYarnInfoUse heraYarnInfoUse) {
        /**
         　　* @Description: TODO 获取时间点监控数据
         　　* @param []
         　　* @return com.dfire.common.entity.model.TableResponse<java.util.List<com.dfire.common.entity.HeraHostRelation>>
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/7/31 14:02
         　　*/
        List<HeraYarnInfoUse> heraYarnInfoUses = heraYarnInfoUseService.selectHeraYarnInfoUseList(heraYarnInfoUse);
        return new JsonResponse(true, "成功",heraYarnInfoUses);
    }



    @RequestMapping(value = "/offlineTaskMonitoring/taskInfo", method = RequestMethod.GET)
    @ResponseBody
    public TableResponse<List<AppInfos>> offlineTaskMonitoringTaskInfo(@RequestParam("taskSv") String taskSv
            , @RequestParam("limit") int limit
            , @RequestParam("page") int page
            , @RequestParam("dateVal") String dateVal
            , @RequestParam("userVal") String userVal) {
        /**
         　　* @Description: TODO 离线任务查询_任务详情
         　　* @param []
         　　* @return com.dfire.common.entity.model.TableResponse<java.util.List<com.dfire.common.entity.HeraHostRelation>>
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/7/31 14:02
         　　*/

        int start = (page - 1) * limit;
        int end = (page - 1) * limit + limit;

        if (taskSv.equals("0")) {//运行中
            List<AppInfos> list = HtmlUnitCommon.selectTaskInfoForRUNNING(userVal);
            if (list.size() < end) {
                end = list.size();
            }
            List<AppInfos> list1 = list.subList(start, end);
            for (AppInfos infos : list1) {
                String startedTime = infos.getStartedTime();
                String allocatedMB = infos.getAllocatedMB();
                String progress = infos.getProgress();
                infos.setStartedTime(AppInfoDateUtil.timeStamp2Date(startedTime, null));
                infos.setAllocatedMB(allocatedMB + "MB");
                int i = progress.indexOf(".");
                infos.setProgress(progress.substring(0, i) + "%");
            }
            return new TableResponse<>(list.size(), 0, list1);
        } else if (taskSv.equals("1")) {//已完成
            List<AppInfos> appInfos = HtmlUnitCommon.selectTaskInfoForFinish(dateVal, userVal);
            if (appInfos.size() < end) {
                end = appInfos.size();
            }
            List<AppInfos> list1 = appInfos.subList(start, end);
            for (AppInfos infos : list1) {
                String startedTime = infos.getStartedTime();
                String finishedTime = infos.getFinishedTime();
                infos.setStartedTime(AppInfoDateUtil.timeStamp2Date(startedTime, null));
                infos.setFinishedTime(AppInfoDateUtil.timeStamp2Date(finishedTime, null));
                infos.setSpendTime(AppInfoDateUtil.getSpendTime2(AppInfoDateUtil.timeStamp2Date(startedTime, null), AppInfoDateUtil.timeStamp2Date(finishedTime, null)));
            }
            return new TableResponse<>(appInfos.size(), 0, list1);
        } else {
            List<AppInfos> list = new ArrayList<>();
            return new TableResponse<>(list.size(), 0, list);
        }
    }

    @RequestMapping(value = "/selectMaxWellMonitorInfo", method = RequestMethod.GET)
    @ResponseBody
    public TableResponse<List<MaxWellMonitorInfo>> selectMaxWellMonitorInfo() {
        /**
         　　* @Description: TODO 查询maxwell相关信息
         　　* @param []
         　　* @return com.dfire.common.entity.model.TableResponse<java.util.List<com.dfire.bean.MaxWellMonitorInfo>>
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/10/24 14:38
         　　*/
        List<MaxWellMonitorInfo> list=new ArrayList<>();
        MaxWellMonitorInfo info = MaxWellForInfoUtil.getInfo();
        list.add(info);
        return new TableResponse<List<MaxWellMonitorInfo>>(list.size(), 0,list);
    }


    @RequestMapping(value = "/workManage/add", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse workManageAdd(HeraHostRelation heraHostRelation) {
        int insert = heraHostRelationService.insert(heraHostRelation);
        if (insert > 0) {
            return new JsonResponse(true, "插入成功");
        }
        return new JsonResponse(false, "插入失败");

    }

    @RequestMapping(value = "/workManage/del", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse workManageDel(Integer id) {
        int delete = heraHostRelationService.delete(id);
        if (delete > 0) {
            return new JsonResponse(true, "删除成功");
        }
        return new JsonResponse(false, "删除失败");

    }

    @RequestMapping(value = "/workManage/update", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse workManageUpdate(HeraHostRelation heraHostRelation) {
        int update = heraHostRelationService.update(heraHostRelation);
        if (update > 0) {
            return new JsonResponse(true, "更新成功");
        }
        return new JsonResponse(false, "更新失败");

    }

    /**
     * 任务管理页面今日任务详情
     *
     * @param status
     * @return
     */
   /* @RequestMapping(value = "/jobManage/findJobHistoryByStatus", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse findJobHistoryByStatus(@RequestParam("status") String status) {
       *//* //TODO 检测返回数据
        System.out.println("++++++++++++++");
        System.out.println(jobManageService.findJobHistoryByStatus(status));
        System.out.println("++++++++++++++");*//*
        return jobManageService.findJobHistoryByStatus(status);
    }*/
    @RequestMapping(value = "/jobManage/findJobHistoryByStatus", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse findJobHistoryByStatus(@RequestParam("status") String status, String dt) {
        return jobManageService.findJobHistoryByStatus(status, dt);
    }

    @RequestMapping(value = "/jobManage/findStopJobHistoryByStatus", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse findStopJobHistoryByStatus(@RequestParam("status") String status) {
        //System.err.println("status :" +status);
        switch (status) {
            case "stop": {
                //System.err.println("关闭");
                return jobManageService.findStopJobHistoryByStatus("0");
            }
            case "disabled": {
                //System.err.println("失效");
                return jobManageService.findStopJobHistoryByStatus("2");
                //  break;
            }
            default: {
                //System.err.println("其他");
                return jobManageService.findStopJobHistoryByStatus("0");
                //  break;
            }
        }
        //    return jobManageService.findStopJobHistoryByStatus(status);
    }




    //findNoRunJobHistoryByStatus
    @RequestMapping(value = "/jobManage/findNoRunJobHistoryByStatus", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse findNoRunJobHistoryByStatus() {

        return jobManageService.findNoRunJobHistoryByStatus();

    }



    /**
     * 首页任务运行top10
     *
     * @return
     */
    @RequestMapping(value = "/homePage/findJobRunTimeTop10", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse findJobRunTimeTop10() {
        return jobManageService.findJobRunTimeTop10();
    }


    /**
     * 今日所有任务状态，初始化首页饼图
     *
     * @return
     */
    @RequestMapping(value = "/homePage/findAllJobStatus", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse findAllJobStatus() {
        return jobManageService.findAllJobStatus();
    }


    /**
     * 今日所有任务状态明细，线形图初始化
     *
     * @return
     */
    @RequestMapping(value = "/homePage/findAllJobStatusDetail", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse findAllJobStatusDetail() {
        return jobManageService.findAllJobStatusDetail();
    }

    /**
     * 今日所有任务状态明细，线形图初始化
     *
     * @return
     */
    @RequestMapping(value = "/homePage/getJobQueueInfo", method = RequestMethod.GET)
    @ResponseBody
    public WebAsyncTask getJobQueueInfo() {

        return new WebAsyncTask<>(HeraGlobalEnvironment.getRequestTimeout(), () -> {
            try {
                return workClient.getJobQueueInfoFromWeb();
            } catch (ExecutionException | InterruptedException e) {
                e.printStackTrace();
            }
            return null;
        });
    }

    /**
     * 今日所有任务状态明细，线形图初始化
     *
     * @return
     */
    @RequestMapping(value = "/homePage/getNotRunJob", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getNotRunJob() {
        List<HeraActionVo> scheduleJob = heraJobActionService.getNotRunScheduleJob();
        return new JsonResponse(true, "查询成功", scheduleJob);
    }

    /**
     * 今日所有任务状态明细，线形图初始化
     *
     * @return
     */
    @RequestMapping(value = "/homePage/getFailJob", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getScheduleFailJob() {
        List<HeraActionVo> failedJob = heraJobActionService.getFailedJob();
        return new JsonResponse(true, "查询成功", failedJob);
    }

    @RequestMapping(value = "/homePage/getAllWorkInfo", method = RequestMethod.GET)
    @ResponseBody
    public WebAsyncTask getAllWorkInfo() {

        WebAsyncTask webAsyncTask = new WebAsyncTask<>(HeraGlobalEnvironment.getRequestTimeout(), () -> workClient.getAllWorkInfo());

        webAsyncTask.onTimeout(() -> {
            ErrorLog.error("获取work信息超时");
            return null;
        });
        return webAsyncTask;
    }


    @RequestMapping(value = "/homePage/getDataFindNum", method = RequestMethod.GET)
    @ResponseBody
    public int getDataFindNum() {
        HeraDataDiscoveryVo h= new HeraDataDiscoveryVo();
        h.setDt(HeraDateTool.getToday());
        return heraDataDiscoveryService.selectHeraDataDiscoveryCount(h);
    }

    @RequestMapping(value = "/homePage/getUserJobInfo", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse getUserJobInfo(HeraJobVo heraJobVo) {
        /**
        　　* @Description: TODO 首页userJobInfo
        　　* @param [heraJobVo]
        　　* @return com.dfire.common.entity.model.JsonResponse
        　　* @throws
        　　* @author lenovo
        　　* @date 2019/11/7 14:34
        　　*/
        UserJobInfo userJobInfo=new UserJobInfo();
        Integer integer = heraJobService.selectJobCountByUserName(heraJobVo);
        Integer integer1 = heraJobService.selectManJobCountByUserName(heraJobVo);
        Integer integer2 = heraJobService.selectfailedCountByUserName(heraJobVo);
        userJobInfo.setJobCount(integer);
        userJobInfo.setManJobCount(integer1);
        userJobInfo.setFailedJobCount(integer2);
        return new JsonResponse(true, "查询成功", userJobInfo);
    }


    @RequestMapping(value = "/homePage/getMaxwellCount", method = RequestMethod.GET)
    @ResponseBody
    public int getMaxwellCount(){
        return MaxWellForInfoUtil.getMaxWellCount();
    }



    @RequestMapping(value = "/isAdmin", method = RequestMethod.GET)
    @ResponseBody
    public JsonResponse isAdmin() {
        boolean isAdmin = checkAdmin();
        return new JsonResponse(true, isAdmin ? "是" : "否", isAdmin);
    }

    private boolean checkAdmin() {
        //System.err.println("HeraGlobalEnvironment.getAdmin() : "+HeraGlobalEnvironment.getAdmin());
        return (getOwner().equals(HeraGlobalEnvironment.getAdmin())) || (getOwner().equals("zhangbinb"));
    }


}
