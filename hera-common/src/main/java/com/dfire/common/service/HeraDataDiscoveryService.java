package com.dfire.common.service;

import com.dfire.common.entity.HeraDataDiscovery;
import com.dfire.common.entity.vo.HeraDataDictVo;
import com.dfire.common.entity.vo.HeraDataDiscoveryVo;

import java.util.List;

public interface HeraDataDiscoveryService {
    List<HeraDataDiscovery> selectHeraDataDiscovery(HeraDataDiscoveryVo heraDataDiscoveryVo);

    int selectHeraDataDiscoveryCount(HeraDataDiscoveryVo heraDataDiscoveryVo);
}
