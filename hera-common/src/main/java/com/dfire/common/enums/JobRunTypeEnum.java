package com.dfire.common.enums;

/**
 * @author: <a href="mailto:lingxiao@2dfire.com">凌霄</a>
 * @time: Created in 14:31 2018/3/22
 * @desc
 */
public enum JobRunTypeEnum {

    Shell("shell"),
    Hive("hive"),
    Spark("spark"),
    Impala("impala"),
    Spark2("spark2");

    private final String id;

    JobRunTypeEnum(String s) {
        this.id = s;
    }

    public static JobRunTypeEnum parser(String v) {
        for (JobRunTypeEnum type : JobRunTypeEnum.values()) {
            if (type.toString().equals(v)) {
                return type;
            }
        }
        return null;
    }

    public static void main(String[] args) {
        System.out.println(JobRunTypeEnum.Shell.toString());
    }

    @Override
    public String toString() {
        return id;
    }
}
