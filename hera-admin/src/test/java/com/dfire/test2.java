package com.dfire;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.junit.Test;

import java.util.*;

/**
 * Created by E75 on 2019/9/23.
 */
public class test2 {

    public static void main(String[] args) {
        String str = "201909191825000002";
        System.out.println(str.length());
        String s = str.substring(0, 12);
        System.out.println(s);
        String ss = "";
        String jobId = "123467";
        if (jobId.length() == 1) {
            ss = s + "00000" + jobId;
        } else if (jobId.length() == 2) {
            ss = s + "0000" + jobId;
        } else if (jobId.length() == 3) {
            ss = s + "000" + jobId;
        } else if (jobId.length() == 4) {
            ss = s + "00" + jobId;
        } else if (jobId.length() == 5) {
            ss = s + "0" + jobId;
        } else if (jobId.length() == 6) {
            ss = s + jobId;
        }

        System.out.println(ss.length() + "  " + ss
        );


    }

    @Test
    public void test() {
        //201909191800000004,201909191800000002,201909191800000003+{}

        //String readDependency = "201909191800000004,201909191800000002,201909191800000003+{\"201909191800000002\":\"1568887207309\",\"201909191800000003\":\"1568887208311\"}";
        String readDependency = "201909191800000004,201909191800000002,201909191800000003+{}";
        String[] arr = readDependency.split("\\+");
        String ready = arr[1];
        System.err.println(arr[1].length());
        if (ready.length() > 2) {
            JSONObject job1 = JSON.parseObject(ready);//将json字符串转换为json对象
            //JSONObject job1 = JSONObject.parseObject(ready);
            Iterator<String> its = job1.keySet().iterator();
            while (its.hasNext()) {
                String key = its.next().toString();
                //String value = job1.getString(key);
                System.out.println("key : " + key);
            }
        }
    }


    @Test
    public void test1() {

        Map taskMap = new HashMap<String, String>();

        taskMap.put(1, "a");
        taskMap.put(2, "b");
        taskMap.put(3, "c");
        taskMap.put(4, "d");

        System.out.println(taskMap.get(1));


    }

    @Test
    public void test2() {

        String task = "123456";
        String s = task.substring(0, task.length() - 1);
        System.out.println(s);

    }

    /* taskMap :{0=[201909250240000184], 1=[201909250240000183], 2=[201909250240000141], 3=[201909250240000108], 4=[201909250240000052, 201909250240000014, 201909250240000047], 5=[201909250240000047, 201909250240000111], 6=[201909250240000052, 201909250240000047], 7=[201909250240000047], 8=[]}

         0 : [201909250240000184]
         1 : [201909250240000183]
         2 : [201909250240000141]
         3 : [201909250240000108]
         4 : [201909250240000052, 201909250240000014, 201909250240000047]
         5 : [201909250240000047, 201909250240000111]
         6 : [201909250240000052, 201909250240000047]
         7 : [201909250240000047]
         8 : []
     */
    @Test
    public void test3() {
        HashSet oneSet = new HashSet();
        LinkedHashMap taskMap = new LinkedHashMap<String, String>();
        oneSet.add("201909250240000184");
        taskMap.put(0,oneSet);
        oneSet = new HashSet();
        oneSet.add("201909250240000183");
        taskMap.put(1,oneSet);
        oneSet = new HashSet();
        oneSet.add("201909250240000141");
        taskMap.put(2, oneSet);
        oneSet = new HashSet();
        oneSet.add("201909250240000108");
        taskMap.put(3, oneSet);
        oneSet = new HashSet();
        oneSet.add("201909250240000052");
        oneSet.add("201909250240000014");
        oneSet.add("201909250240000047");
        taskMap.put(4, oneSet);
        oneSet = new HashSet();
        oneSet.add("201909250240000047");
        oneSet.add("201909250240000111");
        taskMap.put(5, oneSet);
        oneSet = new HashSet();
        oneSet.add("201909250240000052");
        oneSet.add("201909250240000047");
        taskMap.put(6, oneSet);
        oneSet = new HashSet();
        oneSet.add("201909250240000047");
        taskMap.put(7, oneSet);
        oneSet = new HashSet();
        taskMap.put(8, oneSet);

       System.err.println("taskMap :"+taskMap);

        String str="";
        for (Object key : taskMap.keySet()) {
            //System.err.println(taskMap.get(key).getClass());
            str+=key+",";
        }
        System.err.println("str ="+str);
        StringBuffer buffer = new StringBuffer(str.substring(0,str.length()-3));
        str=buffer.reverse().toString();
        System.err.println("str ="+str);

        String taskQueue="";
        String[] keys = str.split(",");
        for (String k:keys) {
            String o = taskMap.get(Integer.parseInt(k)).toString();
            taskQueue+=taskMap.get(Integer.parseInt(k))+",";
        }
        taskQueue=taskQueue.substring(0,taskQueue.length()-1).replace("[","").replace("]","").replace(" ","");
        System.err.println("taskQueue"+taskQueue);

        String[] taskQueueArr = taskQueue.split(",");

        List<String> list = new ArrayList<>();
        for (int i=0; i<taskQueueArr.length; i++) {
            if(!list.contains(taskQueueArr[i])) {
                list.add(taskQueueArr[i]);
            }
        }
        System.err.println("去除重复后的list集合\n"+list);

    }



    @Test
    public void test4() {

        String task = "0,1,2,3,4,5,6,7,8,9,10,11,12,11113,";

        task=task.substring(0,task.lastIndexOf(","));
        task=task.substring(0,task.lastIndexOf(","));

        String[] as = task.split(",");
        for (String a :as) {
            System.out.print(a+",");
        }
        System.out.println();
        String[] reverse = reverse(as);

        for (String a :as) {
            System.out.print(a+",");
        }
        System.out.println();
        for (String a :reverse) {
            System.out.print(a+",");
        }



    }
    public static String[] reverse(String[] a) {
        String[] b=a;
        for(int start=0,end=b.length-1;start<end;start++,end--) {
            String temp=b[start];
            b[start]=b[end];
            b[end]=temp;
        }
        return b;
    }


}


