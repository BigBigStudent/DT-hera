package com.dfire.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.dfire.bean.MaxWellMonitorInfo;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @title JDBC工具类
 *      连接数据库
 *      执行SQL
 *      查询对象
 *      查询集合
 * @author Xingbz
 */
public class JdbcUtil {


    /** 驱动名称 */
    private static final String DRIVER_NAME = "com.mysql.jdbc.Driver";
    /** 数据库链接地址 */
    private static final String url = "jdbc:mysql://nfbigdata-54:3306/maxwell";
    /** 用户名 */
    private static final String userName = "root";
    /** 密码 */
    private static final String password = "111111";
 
    /** 定义连接 */
    private static Connection conn;
    /** 定义STMT */
    private static PreparedStatement stmt;
    /** 定义结果集 */
    private static ResultSet rs;
 
    /** 初始化加载链接 */
    static {
//        Properties prop = new Properties();//从配置文件中读取信息
        try {
//            prop.load(DBUtil.class.getClassLoader().getResourceAsStream("jdbc.properties"));
//            String driver = prop.getProperty("driver");
//            String url = prop.getProperty("url");
//            String userName = prop.getProperty("userName");
//            String password = prop.getProperty("password");
            Class.forName(DRIVER_NAME);
            conn = DriverManager.getConnection(url, userName, password);
        } catch (ClassNotFoundException e) {
            System.err.println("驱动加载失败");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("数据库链接异常");
            e.printStackTrace();
        }
    }
 
    /** 获取链接 */
    public static void getConn() {
        try {
//            prop.load(DBUtil.class.getClassLoader().getResourceAsStream("jdbc.properties"));
//            String driver = prop.getProperty("driver");
//            String url = prop.getProperty("url");
//            String userName = prop.getProperty("userName");
//            String password = prop.getProperty("password");
            Class.forName(DRIVER_NAME);
            conn = DriverManager.getConnection(url, userName, password);
        } catch (ClassNotFoundException e) {
            System.err.println("驱动加载失败");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("数据库链接异常");
            e.printStackTrace();
        }
    }
 
    /** 关闭链接,释放资源 */
    public static void close() {
        try {
            if (rs != null) {
                rs.close();
                rs = null;
            }
            if (stmt != null) {
                stmt.close();
                stmt = null;
            }
 
            if (conn != null) {
                conn.close();
                conn = null;
            }
        } catch (SQLException e) {
            System.err.println("资源释放发生异常");
        }
    }
 
    /**
     * 获取指定数据库下所有的表名
     * @param dbNm
     * @return
     */
    public static List<String> getAllTableName(String dbNm) {
        List<String> result = new ArrayList<String>();
        Statement st = null;
        try {
            st = conn.createStatement();
            ResultSet rs = st.executeQuery("SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES  WHERE TABLE_SCHEMA='" + dbNm + "'");
            while (rs.next()) {
                result.add(rs.getString(1));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            if (st != null) {
                try {
                    st.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            close();
        }
        return result;
    }
 
    /** 执行SQL返回ResultSet */
    public static ResultSet executeSql(String sql, Object... args) {
        try {
//            System.out.println("准备执行SQL : \n" + sql);
            getConn();
            stmt = conn.prepareStatement(sql);
            if (null != args && args.length != 0) {
                for (int i = 0; i < args.length; i++) {
                    stmt.setObject(i + 1, args[i]);
                }
            }
 
            rs = stmt.executeQuery();
        } catch (SQLException e) {
            System.err.println("数据查询异常");
            e.printStackTrace();
        }
        return rs;
    }
 
    /**
     * @title 查询数据结果 , 并封装为对象
     * @author Xingbz
     */
    public static <T> T excuteQuery(Class<T> klass, String sql, Object... args) {
        try {
            rs = executeSql(sql, args);
            ResultSetMetaData metaData = rs.getMetaData();
 
            Map<String, Object> resultMap = new HashMap<>();
            if (rs.next()) {
                for (int i = 1; i <= metaData.getColumnCount(); i++) {
                    String columnname = metaData.getColumnLabel(i);
                    Object obj = rs.getObject(i);
                    resultMap.put(columnname, obj);
                }
            }
 
            return JSON.parseObject(JSON.toJSONString(resultMap), klass);
        } catch (Exception e) {
            System.err.println("数据查询异常");
            e.printStackTrace();
        } finally {
            close();
        }
        return JSON.toJavaObject(new JSONObject(), klass);
    }
 
    /**
     * @title 查询数据结果 , 并封装为List
     * @author Xingbz
     */
    public static <T> List<T> excuteQueryToList(Class<T> klass, String sql, Object... args) {
        try {
            rs = executeSql(sql, args);
            List<Map<String, String>> resultList = new ArrayList<>();
            Map<String, String> resultMap = new HashMap<>();
            while (rs.next()) {
                ResultSetMetaData metaData = rs.getMetaData();
                int columnCount = metaData.getColumnCount();
                for (int i = 1; i <= columnCount; i++) {
                    resultMap.put(metaData.getColumnName(i), rs.getString(i));
                }
                resultList.add(resultMap);
            }
 
            return JSON.parseArray(JSON.toJSONString(resultList), klass);
        } catch (Exception e) {
            System.err.println("数据查询异常");
            e.printStackTrace();
        } finally {
            close();
        }
        return JSON.parseArray("[]", klass);
    }

    public static void main(String[] args) {
        List<MaxWellMonitorInfo> maxWellMonitorInfos = excuteQueryToList(MaxWellMonitorInfo.class, "select server_id,binlog_file,binlog_position,client_id from positions");
        System.out.println(maxWellMonitorInfos.size());
        for (MaxWellMonitorInfo maxWellMonitorInfo : maxWellMonitorInfos) {
            System.out.println(maxWellMonitorInfo.getBinlog_file());
        }
    }
}