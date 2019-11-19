package com.dfire.common.service;

import com.dfire.common.entity.HeraYarnInfoUse;

import java.util.List;

public interface HeraYarnInfoUseService {
    Integer insertHeraYarnInfoUse(HeraYarnInfoUse heraYarnInfoUse);
    List<HeraYarnInfoUse> selectHeraYarnInfoUseList(HeraYarnInfoUse heraYarnInfoUse);
}
