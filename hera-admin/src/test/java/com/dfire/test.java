package com.dfire;

import org.apache.commons.lang3.StringUtils;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by E75 on 2019/6/17.
 */
public class test {

    public static void main(String[] args) {
        String message = "hdfs://192.168.153.11:9000/hera/hdfs-upload-dir/test-20190617-155247.sh";
        //    String path1 = message.substring(message.indexOf("/hera") + 1);
        String na1 = message.substring(message.lastIndexOf("/") + 1);

        String name = na1.substring(0, na1.lastIndexOf("-"));
        name = na1.substring(0, name.lastIndexOf("-"));

        System.out.println("2----name:" + name);
        String suff = na1.substring(na1.lastIndexOf("."));
        System.out.println("suff:" + suff);
        String script = "";
        if (suff != null && suff.equalsIgnoreCase(".sh")) {
            script = "download[hdfs:///" + message.substring(message.indexOf("/hera") + 1) + " " + name + suff + "]" + "\n"
                    + "export JAVA_HOME=/usr/java/jdk1.8.0_144" + "\n"
                    + "sh " + name + suff;
        } else if (suff != null && suff.equalsIgnoreCase(".sql")) {
            script = "download[hdfs:///" + message.substring(message.indexOf("/hera") + 1) + " " + name + suff + "]" + "\n"
                    + "hive -f " + name + suff;
        } else if (suff != null && suff.equalsIgnoreCase(".hive")) {
            script = "download[hdfs:///" + message.substring(message.indexOf("/hera") + 1) + " " + name + suff + "]" + "\n"
                    + "hive -f " + name + suff;
        } else if (suff != null && suff.equalsIgnoreCase(".py")) {
            script = "download[hdfs:///" + message.substring(message.indexOf("/hera") + 1) + " " + name + suff + "]" + "\n"
                    + "python3 " + name + suff;
        } else {
            script = "download[hdfs:///" + message.substring(message.indexOf("/hera") + 1) + " " + name + suff + "]" + "\n"
                    + "需自行指定执行方式 " + name + suff;
        }

        //System.out.println(path1);
        System.out.println("------------");
        System.out.println(script);
        System.out.println("-------");
        String s = script.replaceAll("\n", "</br>");
        System.out.println(s);

        s = script.replaceAll("\n", "</br>");
        System.out.println(s);

    }

    @Test
    public void test() {

        String configs = "{\"run.priority.level\":\"1\",\"roll.back.wait.time\":\"1\",\"roll.back.times\":\"2\"}";
        configs = "{\"run.priority.level\":\"1\",\"roll.back.wait.time\":\"1\",\"roll.back.times\":\"58\",\"qqGroup\":\"965839395\"}";

//        String s1 = configs.split("\"roll.back.times\":\"[\\d]+[\"]")[0];
//        String s2 = configs.split("\"roll.back.times\":\"[\\d]+[\"]")[1];

        configs = configs.split("\"roll.back.times\":\"[\\d]+[\"]")[0] + "\"roll.back.times\":\"0\"" + configs.split("\"roll.back.times\":\"[\\d]+[\"]")[1];

        System.out.println(configs);

    }

    @Test
    public void test1() {

       /* List<String> list=new ArrayList<>(3);
        list.add("1");
        list.add("2");
        list.add("3");
        list.add("4");
        String s1 = list.toString().substring(1);
        System.out.println(s1.substring(0,s1.length()-1));*/

        List<String> downDependencies = new ArrayList<>(3);
        downDependencies.add("none");
        downDependencies.add("1");
        downDependencies.add("2");
        //String str=downDependencies.toString().substring(0).substring(0,downDependencies.toString().substring(0).length()-1);

        String str = StringUtils.strip(downDependencies.toString(), "[]");
        System.out.println(str);
        String[] arr;

    }

    @Test
    public void test2() {

        String[] arr ;
        String str = "201909041330002039+success";
        arr = str.split("\\+");
        for (String s :arr) {
            System.out.println(s);
        }
    }

    @Test
    public void test3(){
        String[] a;
        String str = "201909041330002039+success";
        a = str.split("\\+");
        for (String s :a) {
            System.out.println(s);
        }
    }






}


