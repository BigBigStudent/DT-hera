package com.dfire.controller;

import com.dfire.common.constants.TimeFormatConstant;
import com.dfire.common.entity.HeraDataDict;
import com.dfire.common.entity.HeraDataDiscovery;
import com.dfire.common.entity.model.HeraDb;
import com.dfire.common.entity.model.HeraTb;
import com.dfire.common.entity.model.JsonResponse;
import com.dfire.common.entity.model.TableResponse;
import com.dfire.common.entity.vo.HeraDataDictVo;
import com.dfire.common.entity.vo.HeraDataDiscoveryVo;
import com.dfire.common.service.HeraDataDictService;
import com.dfire.common.service.HeraDataDiscoveryService;
import com.dfire.common.util.HeraDateTool;
import com.dfire.common.util.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.collectingAndThen;
import static java.util.stream.Collectors.toCollection;


/**
 * @author: 凌霄
 * @time: Created in 16:34 2018/1/1
 * @desc 登陆控制器
 */

@Controller
@RequestMapping("/bigdataMetadata")
public class BigdataMetadataController extends BaseHeraController {

    @Autowired
    HeraDataDictService heraDataDictService;

    @Autowired
    HeraDataDiscoveryService heraDataDiscoveryService;

    @RequestMapping("/metadataMonitor")
    public String getMetadataMonitor() {
        /**
         　　* @Description: TODO 数据发现跳转
         　　* @param []
         　　* @return java.lang.String
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/7/31 14:01
         　　*/

        return "bigdataMetadata/dataDiscovery.index";
    }

    @RequestMapping(value = "/selectDataDiscovery", method = RequestMethod.GET)
    @ResponseBody
    public TableResponse<List<HeraDataDiscovery>> selectDataDictionary(HeraDataDiscoveryVo heraDataDiscoveryVo) {
        /**
         　　* @Description: TODO 数据发现查询
         　　* @param []
         　　* @return java.lang.String
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/7/31 14:01
         　　*/
        heraDataDiscoveryVo.setPage((heraDataDiscoveryVo.getPage() - 1) * heraDataDiscoveryVo.getLimit());
        List<HeraDataDiscovery> list = heraDataDiscoveryService.selectHeraDataDiscovery(heraDataDiscoveryVo);
        int i = heraDataDiscoveryService.selectHeraDataDiscoveryCount(heraDataDiscoveryVo);
        return new TableResponse<>(i, 0, list);
    }

    @RequestMapping("/dataDictionary")
    public String getDataDictionary() {
        /**
         　　* @Description: TODO 数据字典跳转
         　　* @param []
         　　* @return java.lang.String
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/7/31 14:01
         　　*/

        return "bigdataMetadata/dataDictionary.index";
    }


    @RequestMapping(value = "/initForDict", method = RequestMethod.GET)
    @ResponseBody
    public List<HeraDb> initForDict() {
        /**
         　　* @Description: TODO 初始化zTree
         　　* @param []
         　　* @return java.util.List<com.dfire.common.entity.model.HeraDb>
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/15 11:07
         　　*/
        List<HeraDataDict> heraDataDicts = heraDataDictService.selectHeraDataDictList();
        Map<String, List<HeraDataDict>> collect = heraDataDicts.stream().collect(Collectors.groupingBy(HeraDataDict::getTableSchema));
        Set<Map.Entry<String, List<HeraDataDict>>> entries = collect.entrySet();
        List<HeraDb> dbs = new ArrayList<>();
        for (Map.Entry<String, List<HeraDataDict>> entry : entries) {
            String key = entry.getKey();
            List<HeraDataDict> value = entry.getValue();
            Map<String, List<HeraDataDict>> tableGroupBy = value.stream().collect(Collectors.groupingBy(HeraDataDict::getTableName2));
            Set<Map.Entry<String, List<HeraDataDict>>> tableEntrySet = tableGroupBy.entrySet();
            HeraDb heraDb = new HeraDb();
            List<HeraTb> childern = new ArrayList<>();
            heraDb.setName(key);
            for (Map.Entry<String, List<HeraDataDict>> stringListEntry : tableEntrySet) {
                List<HeraDataDict> cList = stringListEntry.getValue();
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < cList.size(); i++) {
                    if (StringUtils.isNotBlank(cList.get(i).getColumnComment())) {
                        sb.append(cList.get(i).getColumnComment());
                    }
                    if (StringUtils.isNotBlank(cList.get(i).getTableName1()) && i == cList.size() - 1) {
                        sb.append(cList.get(i).getTableName1());
                    }
                }
                HeraTb heraTb = new HeraTb();
                heraTb.setName(stringListEntry.getKey());
                heraTb.setDs(sb.toString());
                childern.add(heraTb);
            }
            heraDb.setChildren(childern);
            dbs.add(heraDb);
        }
        return dbs;
    }


    @RequestMapping(value = "/selectDictTable", method = RequestMethod.GET)
    @ResponseBody
    public TableResponse<List<HeraDataDict>> selectDictTable(HeraDataDictVo heraDataDictVo) {
        /**
         　　* @Description: TODO 点击ztree返回表单详情
         　　* @param [pName, cName]
         　　* @return com.dfire.common.entity.model.TableResponse<java.util.List<com.dfire.common.entity.HeraDataDict>>
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/15 11:08
         　　*/
        if (heraDataDictVo.getPage() == null || heraDataDictVo.getLimit() == null) {
            heraDataDictVo.setPage(0);
            heraDataDictVo.setLimit(1);
        } else {
            heraDataDictVo.setPage((heraDataDictVo.getPage() - 1) * heraDataDictVo.getLimit());
        }
        List<HeraDataDict> heraDataDicts = heraDataDictService.selectHeraDataDictFields(heraDataDictVo);
        int i = heraDataDictService.selectHeraDataDictTableCount(heraDataDictVo);
        return new TableResponse<>(i, 0, heraDataDicts);
    }


    @RequestMapping(value = "/updateDictTable", method = RequestMethod.POST)
    @ResponseBody
    public JsonResponse updateDictTable(HeraDataDictVo heraDataDictVo) {
        /**
         　　* @Description: TODO 更新表数据
         　　* @param [pName, cName]
         　　* @return com.dfire.common.entity.model.TableResponse<java.util.List<com.dfire.common.entity.HeraDataDict>>
         　　* @throws
         　　* @author lenovo
         　　* @date 2019/8/15 11:08
         　　*/
        HeraDataDict heraDataDict = new HeraDataDict();
        BeanUtils.copyProperties(heraDataDictVo, heraDataDict);
        heraDataDict.setUpdateTime(new HeraDateTool(new Date()).addDay(0).format(TimeFormatConstant.YYYY_MM_DD_HH_MM_SS));
        String owner = getOwner();
        if (StringUtils.isNotBlank(heraDataDictVo.getColumnRename())) {//判断是否是前端
            heraDataDict.setColumnName(heraDataDictVo.getColumnRename());
        }
        heraDataDict.setTbOwner(owner);
        int i = heraDataDictService.updateHeraDataDict(heraDataDict);
        int iT = heraDataDictService.updateHeraDataDictTableStatus(heraDataDict);
        if (StringUtils.isBlank(heraDataDict.getColumnName())) {
            if (iT > 0) {
                return new JsonResponse(true, "更新成功");
            } else {
                return new JsonResponse(false, "更新失败");
            }

        } else {
            if (i > 0 && iT > 0) {
                return new JsonResponse(true, "更新成功");
            } else {
                return new JsonResponse(false, "更新失败");
            }
        }
    }
}
