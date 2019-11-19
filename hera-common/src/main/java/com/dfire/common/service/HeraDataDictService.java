package com.dfire.common.service;

import com.dfire.common.entity.HeraDataDict;
import com.dfire.common.entity.vo.HeraDataDictVo;
import com.dfire.common.mapper.HeraDataDictMapper;

import java.util.List;

/**
 * @ClassName HeraDataDictService
 * @Description TODO
 * @Author lenovo
 * @Date 2019/8/12 20:04
 **/
public interface HeraDataDictService {
    List<HeraDataDict> selectHeraDataDictList();

    List<HeraDataDict> selectHeraDataDictFields(HeraDataDictVo heraDataDictVo);

    int updateHeraDataDict(HeraDataDict heraDataDict);

    int updateHeraDataDictTableStatus(HeraDataDict heraDataDict);

    int selectHeraDataDictTableCount(HeraDataDictVo heraDataDict);
}