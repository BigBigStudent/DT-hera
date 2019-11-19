package com.dfire;

import org.apache.commons.io.IOUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Created by E75 on 2019/10/28.
 */
public class testGetRealScript {

    public static void main(String[] args) {

        String hdfsFilePath = "/hera/hdfs-upload-dir/runFinal_db_sscf-20190307-094752.sh"; // HDFS路径
        try {
            //System.out.println("读取文件\n\n" + hdfsFilePath);
            String cat = cat(hdfsFilePath).trim();
            System.out.println("cat :\n"+cat);
            //System.out.println("\n读取完成");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Test
    public void getRealScript() {
        String hdfsFilePath = "/hera/hdfs-upload-dir/runFinal_db_sscf-20190307-094752.sh"; // HDFS路径
        try {
            System.out.println("读取文件\n\n" + hdfsFilePath);
            String cat = cat(hdfsFilePath).trim();
            System.out.println("cat :"+cat);
            System.out.println("\n读取完成");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    public static String cat(String hdfsFilePath) {
        Configuration conf = new Configuration();
        conf.set("fs.defaultFS", "hdfs://192.168.153.11:9000");
        FileSystem fs = null;
        FSDataInputStream in = null;
        BufferedReader d = null;
        StringBuffer sb = new StringBuffer();
        try {
            fs = FileSystem.get(conf);
            Path remotePath = new Path(hdfsFilePath);
            in = fs.open(remotePath);
            d = new BufferedReader(new InputStreamReader(in));
            String line = null;
            while ((line = d.readLine()) != null) {
                sb.append(line);
                sb.append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                d.close();
                in.close();
                fs.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }



    @Test
    public void getPath(){
        String str="download[hdfs:///hera/hdfs-upload-dir/t_advertise_banner-20190715-132550.sh t_advertise_banner.sh]\n" +
                "export JAVA_HOME=/usr/java/jdk1.8.0_144\n" +
                "sh t_advertise_banner.sh";
        String s = str.split("download\\[hdfs://")[1].split(" ")[0];

        System.out.println(s);

        System.out.println("download[hdfs:"+str.indexOf("download[hdfs://"));
        System.out.println("--hive-import:"+str.indexOf("--hive-import"));
        System.out.println("--hive-import:"+str.indexOf("--hive-import"));

    }
}