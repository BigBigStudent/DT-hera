package com.dfire.common.entity.model;

import lombok.Data;

import java.util.List;

/**
 * @ClassName HeraDB
 * @Description TODO
 * @Author lenovo
 * @Date 2019/8/13 10:04
 **/
@Data
public class HeraDb {
    private String name;
    private String isParent="true";
    private int directory=0;
    private List<HeraTb> children;

}

