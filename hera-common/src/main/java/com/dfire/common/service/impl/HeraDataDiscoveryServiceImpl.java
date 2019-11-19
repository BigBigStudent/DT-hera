package com.dfire.common.service.impl;

import com.dfire.common.entity.HeraDataDiscovery;
import com.dfire.common.entity.vo.HeraDataDiscoveryVo;
import com.dfire.common.mapper.HeraDataDiscoveryMapper;
import com.dfire.common.service.HeraDataDictService;
import com.dfire.common.service.HeraDataDiscoveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @ClassName HeraDataDiscoveryServiceImpl
 * @Description TODO
 * @Author lenovo
 * @Date 2019/8/21 14:41
 **/
@Service("heraDataDiscoveryServiceImpl")
public class HeraDataDiscoveryServiceImpl implements HeraDataDiscoveryService {
    @Autowired
    HeraDataDiscoveryMapper heraDataDiscoveryMapper;


    @Override
    public List<HeraDataDiscovery> selectHeraDataDiscovery(HeraDataDiscoveryVo heraDataDiscoveryVo) {
        return heraDataDiscoveryMapper.selectHeraDataDiscovery(heraDataDiscoveryVo);
    }

    @Override
    public int selectHeraDataDiscoveryCount(HeraDataDiscoveryVo heraDataDiscoveryVo) {
        int i = heraDataDiscoveryMapper.selectHeraDataDiscoveryCount(heraDataDiscoveryVo);
        return i;
    }
}
