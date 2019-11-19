package com.dfire.util;

import com.dfire.config.HeraGlobalEnvironment;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataInputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Created by E75 on 2019/10/28.
 */
public class ReadHdfsFile {

    public static String hdfsCat(String hdfsFilePath) {
        Configuration conf = new Configuration();

        String hdfsUploadPath = HeraGlobalEnvironment.getHdfsUploadPath();
        //"hdfs://192.168.153.11:9000"
        String Fs = hdfsUploadPath.split("/hera/")[0];

        conf.set("fs.defaultFS", Fs);

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

    public static void main(String[] args) {

        /*String hdfsFilePath = "/hera/hdfs-upload-dir/runFinal_db_sscf-20190307-094752.sh"; // HDFS路径
        try {
            String cat = hdfsCat(hdfsFilePath);
            System.out.println("cat :\n"+cat);
        } catch (Exception e) {
            e.printStackTrace();
        }*/
        String hdfsUploadPath ="hdfs://192.168.153.11:9000/hera/hdfs-upload-dir/";
        //"hdfs://192.168.153.11:9000"
        System.out.println(hdfsUploadPath.split("/hera/")[0]);


    }


}
