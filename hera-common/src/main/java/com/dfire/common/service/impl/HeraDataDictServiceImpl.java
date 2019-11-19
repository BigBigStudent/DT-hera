package com.dfire.common.service.impl;

import com.dfire.common.entity.HeraDataDict;
import com.dfire.common.entity.vo.HeraDataDictVo;
import com.dfire.common.mapper.HeraDataDictMapper;
import com.dfire.common.service.HeraDataDictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @ClassName HeraDataDictServiceImpl
 * @Description TODO
 * @Author lenovo
 * @Date 2019/8/12 20:06
 **/
@Service("heraDataDictServiceImpl")
public class HeraDataDictServiceImpl implements HeraDataDictService {
    @Autowired
    HeraDataDictMapper heraDataDictMapper;
    @Override
    public List<HeraDataDict> selectHeraDataDictList() {
        return  heraDataDictMapper.selectHeraDataDictList();
    }

    @Override
    public List<HeraDataDict> selectHeraDataDictFields(HeraDataDictVo heraDataDictVo) {

        return  heraDataDictMapper.selectHeraDataDictFields(heraDataDictVo);
    }

    @Override
    public int updateHeraDataDict(HeraDataDict heraDataDict) {
        return heraDataDictMapper.updateHeraDataDict(heraDataDict);
    }

    @Override
    public int updateHeraDataDictTableStatus(HeraDataDict heraDataDict) {
        return heraDataDictMapper.updateHeraDataDictTableStatus(heraDataDict);
    }

    @Override
    public int selectHeraDataDictTableCount(HeraDataDictVo heraDataDict) {
        return heraDataDictMapper.selectHeraDataDictTableCount(heraDataDict);
    }
}
