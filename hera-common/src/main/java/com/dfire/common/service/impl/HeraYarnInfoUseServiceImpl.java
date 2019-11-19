package com.dfire.common.service.impl;

import com.dfire.common.entity.HeraYarnInfoUse;
import com.dfire.common.mapper.HeraYarnInfoUseMapper;
import com.dfire.common.service.HeraYarnInfoUseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @ClassName HeraYarnInfoUseServiceImpl
 * @Description TODO
 * @Author lenovo
 * @Date 2019/9/2 17:55
 **/
@Service("heraYarnInfoUseServiceImpl")
public class HeraYarnInfoUseServiceImpl implements HeraYarnInfoUseService {

    @Autowired
    HeraYarnInfoUseMapper heraYarnInfoUseMapper;
    @Override
    public Integer insertHeraYarnInfoUse(HeraYarnInfoUse heraYarnInfoUse) {
        Integer integer = heraYarnInfoUseMapper.insertHeraYarnInfoUse(heraYarnInfoUse);
        return integer;
    }

    @Override
    public List<HeraYarnInfoUse> selectHeraYarnInfoUseList(HeraYarnInfoUse heraYarnInfoUse) {
        return heraYarnInfoUseMapper.selectHeraYarnInfoUseList(heraYarnInfoUse);
    }
}
