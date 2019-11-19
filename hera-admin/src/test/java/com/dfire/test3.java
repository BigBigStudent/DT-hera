package com.dfire;

import com.dfire.common.entity.HeraSqoopTable;
import com.dfire.common.entity.model.JsonResponse;
import com.dfire.common.service.HeraSqoopTaskService;
import com.dfire.common.service.impl.HeraSqoopTaskServiceImpl;
import org.junit.Test;

import java.util.List;

public class test3 {

    public static void main(String[] args) {
        String str="源表:t_block_level2_capital,昨日量:0,备注:tool.ImportTool: Import failed: java.io.IOException: Hive does not support the SQL type for column LEVEL2CAPITAL.\n" +
                ",源表:t_block_quote_data,昨日量:0,备注:tool.ImportTool: Import failed: java.io.IOException: Hive does not support the SQL type for column QUOTE.\n" +
                ",源表:t_level2_capital_data,昨日量:0,备注:tool.ImportTool: Import failed: java.io.IOException: Hive does not support the SQL type for column LEVEL2CAPITAL.\n" +
                ",源表:t_quote_data,昨日量:0,备注:tool.ImportTool: Import failed: java.io.IOException: Hive does not support the SQL type for column QUOTE.\n" +
                ",源表:t_simple_quote_data,昨日量:0,备注:tool.ImportTool: Import failed: java.io.IOException: Hive does not support the SQL type for column SIMPLEQUOTE.\n";
        System.out.println(str);
    }










}
