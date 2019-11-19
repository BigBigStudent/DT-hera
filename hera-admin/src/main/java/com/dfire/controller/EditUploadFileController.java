package com.dfire.controller;

import com.dfire.config.HeraGlobalEnvironment;
import com.dfire.logs.MonitorLog;
import org.apache.commons.lang.StringUtils;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FSDataOutputStream;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author: <a href="mailto:lingxiao@2dfire.com">凌霄</a>
 * @time: Created in 16:34 2018/1/13
 * @desc 开发中心
 */
@Controller
@RequestMapping("/editUploadFile")
public class EditUploadFileController extends BaseHeraController {

   /* @RequestMapping(value = "/script2HdfsFile", method = RequestMethod.GET)
    @ResponseBody
    public String script2HdfsFileUUU(String name, String selfScript) {
        System.err.println("name  : " + name);
        System.err.println("selfScript  : " + selfScript);
        String heraFileName = name;
        String heraFilecontent = selfScript;
        System.err.println("heraFileName + heraFilecontent : " + heraFileName + "\t" + heraFilecontent);
        //文件上传逻辑
        String newFileName = "";
        //  File file = null;
        String prefix = StringUtils.substringBefore(heraFileName, ".");
        String suffix = StringUtils.substringAfter(heraFileName, ".");
        newFileName = prefix + "-" + new SimpleDateFormat("yyyyMMdd-HHmmss").format(new Date()) + "." + suffix;
        //  newFilePath = HeraGlobalEnvironment.getWorkDir() + File.separator + newFileName;
        //  file = new File(newFilePath);
        //   System.err.println("file : " + file);
        // String absolutePath = file.getAbsolutePath();
        String hdfsUploadPath = HeraGlobalEnvironment.getHdfsUploadPath();

        //     System.err.println("newFileName : " + newFileName);
        //newFileName : test-20190626-132518.sh
        //System.err.println("absolutePath : " + absolutePath);
        //absolutePath : D:\00工作目录\2019-06-13-hera上传文件优化\20190623\hera-2.3.1\55-20190626-132238.sh

        //   System.err.println("hdfsUploadPath : " + hdfsUploadPath);
        //hdfsUploadPath : hdfs://192.168.153.11:9000/hera/hdfs-upload-dir/

        String hdfsFilePath = hdfsUploadPath + newFileName;
        MonitorLog.info("hdfs文件上传路径hdfsFilePath:" + hdfsFilePath);
        //    System.out.println("hdfsFilePath : " + hdfsFilePath);
        //   System.out.println("/editUploadFile/script2HdfsFile.do+++++++++++++++++++++++++");
        return saveAsHdfsFile(hdfsFilePath, heraFilecontent, heraFileName);

        //hdfs://192.168.153.11:9000/hera/hdfs-upload-dir/test-20190626-133311.sh

        //  System.err.println("heraFile : " + heraFile);

        //  return "方法返回的结果";
    }*/

    public String saveAsHdfsFile(String hdfsFilePath, String heraFilecontent, String heraFileName) {

        //System.err.println(" heraFilecontent : " + heraFilecontent);
        //String hdfsFilePath ="  hdfs://192.168.153.11:9000/hera/hdfs-upload-dir/test-20190626-133311.sh";

        int i = hdfsFilePath.indexOf("/hera/hdfs-upload-dir");
        String hdfs = hdfsFilePath.substring(0, i);
        //System.out.println("hdfs : "+hdfs);
        String hpath = hdfsFilePath.substring(i);
        //System.out.println("hpath : "+hpath);

        Configuration conf = new Configuration();
        conf.set("fs.defaultFS", hdfs);
        conf.set("hadoop.job.ugi", "hdfs");
        conf.set("fs.hdfs.impl", "org.apache.hadoop.hdfs.DistributedFileSystem");
        FileSystem fs = null;
        FSDataOutputStream out = null;
        Path filenamePath = new Path(hpath);

        try {
            fs = FileSystem.get(conf);
            if (fs.exists(new Path(hpath))) {
                fs.delete(new Path(hpath), true);//决定是否删除原有文件夹
                System.out.println("文件存在，删除原文件");
            }
            out = fs.create(filenamePath);
            //System.out.println("文件(" + hdfs + filenamePath + ")创建成功");
            //System.err.println("文件(" + hdfs + filenamePath + ")创建成功");
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            out.write((heraFilecontent).getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
        //   System.out.println("写入" + hdfs + filenamePath + ",执行结束...");
        MonitorLog.info("写入" + hdfs + filenamePath + ",执行结束...");
        try {
            if (fs != null) {
                fs.close();
            }
            if (out != null) {
                out.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        int i1 = hpath.lastIndexOf(".");
        String stuff = hpath.substring(i1);
        //      System.out.println("stuff : "+stuff);

        if (stuff != null && (stuff.equalsIgnoreCase(".sh"))) {
//            System.out.println("download[hdfs://"+hpath +" "+heraFileName+"];\n" +
//                    "sh "+heraFileName);
            return "download[hdfs://" + hpath + " " + heraFileName + "]\n" +
                    "export JAVA_HOME=/usr/java/jdk1.8.0_144\n" +
                    "sh " + heraFileName;
        } else if (stuff != null && (stuff.equalsIgnoreCase(".sql"))) {

//            System.out.println("download[hdfs://"+hpath +" "+heraFileName+"];\n" +
//                    "hive -f "+heraFileName);
            return "download[hdfs://" + hpath + " " + heraFileName + "]\n" +
                    "hive -f " + heraFileName;
        } else if (stuff != null && (stuff.equalsIgnoreCase(".py"))) {

//            System.out.println("download[hdfs://"+hpath +" "+heraFileName+"];\n" +
//                    "hive -f "+heraFileName);
            return "download[hdfs://" + hpath + " " + heraFileName + "]\n" +
                    "python3 " + heraFileName;
        }else {
            return "文件路径" + hpath + "\n" +
                    "脚本生成错误";
        }
    }


    @RequestMapping(value = "/return", method = RequestMethod.POST)
    @ResponseBody
    public String script2HdfsFile(String name, String selfScript) {
        //     System.err.println("name  : "+name);
        //     System.err.println("selfScript  : "+selfScript);

        String heraFileName = name;
        String heraFilecontent = selfScript;
        //      System.err.println("heraFileName + heraFilecontent : " + heraFileName + "\t" + heraFilecontent);
        //文件上传逻辑
        String newFileName = "";
        //  File file = null;
        String prefix = StringUtils.substringBefore(heraFileName, ".");
        String suffix = StringUtils.substringAfter(heraFileName, ".");
        newFileName = prefix + "-" + new SimpleDateFormat("yyyyMMdd-HHmmss").format(new Date()) + "." + suffix;
        //  newFilePath = HeraGlobalEnvironment.getWorkDir() + File.separator + newFileName;
        //  file = new File(newFilePath);
        //   System.err.println("file : " + file);
        // String absolutePath = file.getAbsolutePath();
        String hdfsUploadPath = HeraGlobalEnvironment.getHdfsUploadPath();

        //     System.err.println("newFileName : " + newFileName);
        //newFileName : test-20190626-132518.sh
        //System.err.println("absolutePath : " + absolutePath);
        //absolutePath : D:\00工作目录\2019-06-13-hera上传文件优化\20190623\hera-2.3.1\55-20190626-132238.sh

        //   System.err.println("hdfsUploadPath : " + hdfsUploadPath);
        //hdfsUploadPath : hdfs://192.168.153.11:9000/hera/hdfs-upload-dir/

        String hdfsFilePath = hdfsUploadPath + newFileName;
        MonitorLog.info("hdfs文件上传路径hdfsFilePath:" + hdfsFilePath);
        //    System.out.println("hdfsFilePath : " + hdfsFilePath);
        //   System.out.println("/editUploadFile/script2HdfsFile.do+++++++++++++++++++++++++");
        return saveAsHdfsFile(hdfsFilePath, heraFilecontent, heraFileName);

    }
}
