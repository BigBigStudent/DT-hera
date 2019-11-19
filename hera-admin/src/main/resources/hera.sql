SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS hera;
CREATE DATABASE hera
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;


USE hera;

DROP TABLE IF EXISTS `hera_action`;
CREATE TABLE `hera_action` (
  `id`                   BIGINT(20)   NOT NULL
  COMMENT '任务对应的唯一18位数字版本号',
  `job_id`               BIGINT(20)   NOT NULL
  COMMENT '版本对应的任务id',
  `auto`                 TINYINT(2)                   DEFAULT NULL,
  `configs`              TEXT COMMENT '任务的配置的变量',
  `cron_expression`      VARCHAR(256)                 DEFAULT NULL
  COMMENT '当前版本对应的cron表达式',
  `cycle`                VARCHAR(256)                 DEFAULT NULL
  COMMENT '是否为循环任务',
  `dependencies`         TEXT COMMENT '依赖任务的版本号，逗号分隔',
  `job_dependencies`     VARCHAR(2048)                DEFAULT NULL
  COMMENT '依赖任务的id,逗号分隔',
  `description`          VARCHAR(256)                 DEFAULT NULL
  COMMENT '版本描述',
  `gmt_create`           DATETIME                     DEFAULT CURRENT_TIMESTAMP,
  `gmt_modified`         DATETIME                     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `group_id`             INT(11)      NOT NULL
  COMMENT '版本可运行分发的机器组',
  `history_id`           BIGINT(20)                   DEFAULT NULL
  COMMENT '当前版本运行的history id',
  `host`                 VARCHAR(32)                  DEFAULT NULL
  COMMENT '执行机器ip ',
  `last_end_time`        DATETIME                     DEFAULT NULL,
  `last_result`          VARCHAR(256)                 DEFAULT NULL,
  `name`                 VARCHAR(256) NOT NULL        DEFAULT ''
  COMMENT '任务描述',
  `offset`               TINYINT(2) UNSIGNED ZEROFILL DEFAULT NULL,
  `owner`                VARCHAR(32)  NOT NULL
  COMMENT '任务的owner',
  `post_processors`      VARCHAR(256)                 DEFAULT NULL,
  `pre_processors`       VARCHAR(256)                 DEFAULT NULL,
  `ready_dependency`     TEXT COMMENT '上游任务已完成的版本号',
  `resources`            TEXT COMMENT '任务上传的资源配置',
  `run_type`             VARCHAR(16)                  DEFAULT NULL
  COMMENT '任务触发类型(shell, hive)',
  `schedule_type`        TINYINT(2)                   DEFAULT NULL
  COMMENT '任务调度类型(1,依赖调度，2，被依赖调度)',
  `script`               MEDIUMTEXT COMMENT '任务对应的脚本',
  `start_time`           BIGINT(20)                   DEFAULT NULL,
  `start_timestamp`      BIGINT(20)                   DEFAULT NULL,
  `statistic_end_time`   DATETIME                     DEFAULT NULL,
  `statistic_start_time` DATETIME                     DEFAULT NULL,
  `status`               VARCHAR(16)                  DEFAULT NULL
  COMMENT '当前版本的运行状态，job_history完成后，会写更新此状态',
  `timezone`             VARCHAR(32)                  DEFAULT NULL,
  `host_group_id`        TINYINT(2)                   DEFAULT NULL
  COMMENT '任务可分配的执行服务器组',
  `down_actions`         VARCHAR(16)                  DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ind_action_groupid` (`group_id`),
  KEY `ind_actionjobid` (`job_id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = 'job版本记录表';

DROP TABLE IF EXISTS `hera_action_history`;
CREATE TABLE `hera_action_history` (
  `id`                 BIGINT(20) NOT NULL AUTO_INCREMENT,
  `job_id`             BIGINT(20)          DEFAULT NULL
  COMMENT 'hera任务id',
  `action_id`          BIGINT(20)          DEFAULT NULL
  COMMENT '任务对应的版本号，18位整数',
  `cycle`              VARCHAR(16)         DEFAULT NULL
  COMMENT '是否是循环任务',
  `end_time`           DATETIME            DEFAULT NULL
  COMMENT '任务执行结束时间',
  `execute_host`       VARCHAR(32)         DEFAULT NULL
  COMMENT '当前版本任务执行的服务器',
  `gmt_create`         DATETIME            DEFAULT CURRENT_TIMESTAMP,
  `gmt_modified`       DATETIME            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `illustrate`         VARCHAR(256)        DEFAULT NULL
  COMMENT '任务运行描述',
  `log`                LONGTEXT COMMENT '任务运行日志',
  `operator`           VARCHAR(32)         DEFAULT NULL
  COMMENT '任务运行操作人',
  `properties`         VARCHAR(6144)       DEFAULT NULL,
  `start_time`         DATETIME            DEFAULT NULL
  COMMENT '任务开始执行的时间',
  `statistic_end_time` DATETIME            DEFAULT NULL
  COMMENT '版本生成结束时间',
  `status`             VARCHAR(16)         DEFAULT NULL
  COMMENT '当前版本的任务运行状态',
  `timezone`           VARCHAR(32)         DEFAULT NULL,
  `trigger_type`       TINYINT(4)          DEFAULT NULL
  COMMENT '任务触发类型(1,自动调度,2,手动触发,3,手动恢复)',
  `host_group_id`      INT(11)             DEFAULT NULL
  COMMENT '任务可分配的执行服务器组',
  PRIMARY KEY (`id`),
  KEY `ind_acthisactionjobid` (`action_id`, `job_id`),
  KEY `idx_job_id` (`job_id`),
  KEY `ind_his_gmtcreate` (`gmt_create`),
  KEY `ind_end_time` (`end_time`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = 'Job运行日志表';
DROP TABLE IF EXISTS `hera_advice`;
CREATE TABLE `hera_advice` (
  `id`          BIGINT(20) NOT NULL AUTO_INCREMENT,
  `msg`         VARCHAR(256)        DEFAULT NULL
  COMMENT '消息',
  `address`     VARCHAR(256)        DEFAULT NULL
  COMMENT 'ip地址',
  `color`       VARCHAR(7)          DEFAULT NULL
  COMMENT '颜色',
  `create_time` VARCHAR(19)         DEFAULT NULL
  COMMENT '创建时间',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = 'hera建议表';

DROP TABLE IF EXISTS `hera_area`;

CREATE TABLE `hera_area` (
  `id`           INT(11) NOT NULL AUTO_INCREMENT
  COMMENT '区域id',
  `name`         VARCHAR(50)      DEFAULT NULL
  COMMENT '区域名',
  `timezone`     VARCHAR(25)      DEFAULT NULL
  COMMENT '时区',
  `gmt_create`   DATETIME         DEFAULT CURRENT_TIMESTAMP,
  `gmt_modified` DATETIME         DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = 'hera任务区域表';

DROP TABLE IF EXISTS `hera_debug_history`;
CREATE TABLE `hera_debug_history` (
  `id`            BIGINT(20) NOT NULL AUTO_INCREMENT,
  `end_time`      DATETIME            DEFAULT NULL
  COMMENT '运行结束时间',
  `execute_host`  VARCHAR(255)        DEFAULT NULL
  COMMENT '执行服务器',
  `file_id`       BIGINT(20)          DEFAULT NULL
  COMMENT '脚本文件id',
  `gmt_create`    DATETIME            DEFAULT CURRENT_TIMESTAMP
  COMMENT '运行日志创建时间',
  `gmt_modified`  DATETIME            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  COMMENT '运行日志修改时间',
  `log`           LONGTEXT COMMENT '脚本运行日志',
  `run_type`      VARCHAR(16)         DEFAULT NULL
  COMMENT '运行类型（hive,shell）',
  `script`        LONGTEXT COMMENT '完整运行脚本，',
  `start_time`    DATETIME            DEFAULT NULL
  COMMENT '统计开始时间',
  `status`        VARCHAR(32)         DEFAULT NULL
  COMMENT '脚本运行状态(runnin,success,failed,wait)',
  `owner`         VARCHAR(32)         DEFAULT NULL
  COMMENT '脚本owner',
  `host_group_id` TINYINT(4)          DEFAULT NULL
  COMMENT '执行机器组id',
  PRIMARY KEY (`id`),
  KEY `idx_file_id` (`file_id`) USING BTREE
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  ROW_FORMAT = COMPACT
  COMMENT = '开发中心脚本运行日志表';

DROP TABLE IF EXISTS `hera_file`;
CREATE TABLE `hera_file` (
  `id`            BIGINT(20)   NOT NULL AUTO_INCREMENT,
  `content`       MEDIUMTEXT COMMENT '脚本文件内容',
  `gmt_create`    DATETIME              DEFAULT CURRENT_TIMESTAMP
  COMMENT '脚本文件创建时间',
  `gmt_modified`  DATETIME              DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name`          VARCHAR(128) NOT NULL
  COMMENT '脚本名称',
  `owner`         VARCHAR(32)  NOT NULL
  COMMENT '脚本的owner',
  `parent`        INT(20)               DEFAULT NULL
  COMMENT '父目录id',
  `type`          TINYINT(4)   NOT NULL
  COMMENT '文件类型(1,目录,2,文件)',
  `host_group_id` TINYINT(2)            DEFAULT NULL
  COMMENT '执行机器组id',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = '开发中心脚本记录表';

DROP TABLE IF EXISTS `hera_group`;
CREATE TABLE `hera_group` (
  `id`           INT(11)      NOT NULL AUTO_INCREMENT,
  `configs`      TEXT,
  `description`  VARCHAR(500)          DEFAULT NULL,
  `directory`    INT(11)      NOT NULL,
  `gmt_create`   DATETIME              DEFAULT CURRENT_TIMESTAMP,
  `gmt_modified` DATETIME              DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name`         VARCHAR(255) NOT NULL,
  `owner`        VARCHAR(255) NOT NULL,
  `parent`       INT(11)               DEFAULT NULL,
  `resources`    TEXT,
  `existed`      INT(11)      NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `ind_heragroupparent` (`parent`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `hera_host_group`;
CREATE TABLE `hera_host_group` (
  `id`           INT(11) NOT NULL AUTO_INCREMENT,
  `name`         VARCHAR(128)     DEFAULT NULL
  COMMENT '组描述',
  `effective`    TINYINT(2)       DEFAULT '0'
  COMMENT '是否有效（1，有效，0，无效）',
  `gmt_create`   DATETIME         DEFAULT CURRENT_TIMESTAMP
  COMMENT '创建时间',
  `gmt_modified` DATETIME         DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  COMMENT '修改时间',
  `description`  VARCHAR(256)     DEFAULT NULL
  COMMENT '描述',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = '机器组记录表';

DROP TABLE IF EXISTS `hera_host_relation`;
CREATE TABLE `hera_host_relation` (
  `id`            INT(11) NOT NULL AUTO_INCREMENT,
  `host`          VARCHAR(32)      DEFAULT NULL
  COMMENT '机器ip',
  `host_group_id` INT(11)          DEFAULT NULL
  COMMENT '机器所在组id',
  `domain`        VARCHAR(16)      DEFAULT ''
  COMMENT '机器域名',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = '机器与机器组关联表';

DROP TABLE IF EXISTS `hera_job`;
CREATE TABLE `hera_job` (
  `id`                   BIGINT(30)   NOT NULL AUTO_INCREMENT
  COMMENT '任务id',
  `auto`                 TINYINT(2)            DEFAULT '0'
  COMMENT '自动调度是否开启',
  `configs`              TEXT COMMENT '配置的环境变量',
  `cron_expression`      VARCHAR(32)           DEFAULT NULL
  COMMENT 'cron表达式',
  `cycle`                VARCHAR(16)           DEFAULT NULL
  COMMENT '是否是循环任务',
  `dependencies`         VARCHAR(2000)         DEFAULT NULL
  COMMENT '依赖的任务id,逗号分隔',
  `description`          VARCHAR(2000)         DEFAULT NULL
  COMMENT '任务描述',
  `gmt_create`           DATETIME              DEFAULT CURRENT_TIMESTAMP
  COMMENT '创建时间',
  `gmt_modified`         DATETIME              DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `group_id`             INT(11)      NOT NULL
  COMMENT '所在的目录 id',
  `history_id`           BIGINT(20)            DEFAULT NULL
  COMMENT '运行历史id',
  `host`                 VARCHAR(32)           DEFAULT NULL
  COMMENT '运行服务器ip',
  `last_end_time`        DATETIME              DEFAULT NULL,
  `last_result`          VARCHAR(16)           DEFAULT NULL,
  `name`                 VARCHAR(256) NOT NULL
  COMMENT '任务名称',
  `offset`               INT(11)               DEFAULT NULL,
  `owner`                VARCHAR(256) NOT NULL,
  `post_processors`      VARCHAR(256)          DEFAULT NULL
  COMMENT '任务运行所需的后置处理',
  `pre_processors`       VARCHAR(256)          DEFAULT NULL
  COMMENT '任务运行所需的前置处理',
  `ready_dependency`     VARCHAR(16)           DEFAULT NULL
  COMMENT '任务已完成的依赖',
  `resources`            TEXT COMMENT '上传的资源文件配置',
  `run_type`             VARCHAR(16)           DEFAULT NULL
  COMMENT '运行的job类型(hive,shell)',
  `schedule_type`        TINYINT(4)            DEFAULT NULL
  COMMENT '任务调度类型',
  `script`               MEDIUMTEXT COMMENT '脚本内容',
  `start_time`           DATETIME              DEFAULT NULL,
  `start_timestamp`      BIGINT(20)            DEFAULT NULL,
  `statistic_end_time`   DATETIME              DEFAULT NULL,
  `statistic_start_time` DATETIME              DEFAULT NULL,
  `status`               VARCHAR(16)           DEFAULT NULL,
  `timezone`             VARCHAR(32)           DEFAULT NULL,
  `host_group_id`        TINYINT(2)            DEFAULT NULL
  COMMENT '分发的执行机器组id',
  `must_end_minute`      INT(2)                DEFAULT '0',
  `area_id`              VARCHAR(50)           DEFAULT '1'
  COMMENT '区域ID,多个用,分割',
  `repeat_run`           TINYINT(2)            DEFAULT '0'
  COMMENT '是否允许任务重复执行',
  PRIMARY KEY (`id`),
  KEY `ind_zeusjobgroupid` (`group_id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = 'hera的job 记录表';

DROP TABLE IF EXISTS `hera_job_monitor`;
CREATE TABLE `hera_job_monitor` (
  `job_id`   BIGINT(20)   NOT NULL,
  `user_ids` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`job_id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

DROP TABLE IF EXISTS `hera_lock`;
CREATE TABLE `hera_lock` (
  `id`            INT(11) NOT NULL AUTO_INCREMENT,
  `gmt_create`    DATETIME         DEFAULT CURRENT_TIMESTAMP
  COMMENT '创建时间',
  `gmt_modified`  DATETIME         DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  COMMENT '更新时间',
  `host`          VARCHAR(32)      DEFAULT NULL
  COMMENT '机器对应ip',
  `server_update` DATETIME         DEFAULT NULL
  COMMENT '心跳更新时间',
  `subgroup`      VARCHAR(32)      DEFAULT NULL
  COMMENT '机器所在组，',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = '分布式锁记录表';

DROP TABLE IF EXISTS `hera_permission`;
CREATE TABLE `hera_permission` (
  `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
  `gmt_create`   DATETIME            DEFAULT CURRENT_TIMESTAMP
  COMMENT '创建时间',
  `gmt_modified` DATETIME            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  COMMENT '修改时间',
  `target_id`    BIGINT(20)          DEFAULT NULL
  COMMENT '授权的任务或者组id',
  `type`         VARCHAR(32)         DEFAULT NULL
  COMMENT '授权类型(job或者group)',
  `uid`          VARCHAR(32)         DEFAULT NULL
  COMMENT '被授权着名称',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = '任务授权记录表';

DROP TABLE IF EXISTS `hera_profile`;
CREATE TABLE `hera_profile` (
  `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
  `gmt_create`   DATETIME            DEFAULT CURRENT_TIMESTAMP
  COMMENT '创建时间',
  `gmt_modified` DATETIME            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  COMMENT '修改时间',
  `hadoop_conf`  VARCHAR(2024)       DEFAULT NULL
  COMMENT 'hadoop配置信息',
  `uid`          VARCHAR(32)         DEFAULT NULL
  COMMENT '用户名称',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COMMENT = '用户配置表';

DROP TABLE IF EXISTS `hera_user`;

CREATE TABLE `hera_user` (
  `id`           BIGINT(20) NOT NULL AUTO_INCREMENT,
  `email`        VARCHAR(255)        DEFAULT NULL,
  `gmt_create`   DATETIME            DEFAULT CURRENT_TIMESTAMP,
  `gmt_modified` DATETIME            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name`         VARCHAR(255)        DEFAULT NULL,
  `phone`        VARCHAR(2000)       DEFAULT NULL,
  `uid`          VARCHAR(255)        DEFAULT NULL,
  `wangwang`     VARCHAR(255)        DEFAULT NULL,
  `password`     VARCHAR(255)        DEFAULT NULL,
  `user_type`    INT(11)             DEFAULT '0',
  `is_effective` INT(11)             DEFAULT '0',
  `description`  VARCHAR(5000)       DEFAULT NULL,
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;
BEGIN;
INSERT INTO hera_user (email, name, uid, password, user_type, is_effective)
VALUES ('1142819049@qq.com', 'hera', 'hera', 'd3886bd3bcba3d88e2ab14ba8c9326da', 0, 1);
INSERT INTO hera_area (name) VALUES ('中国');
INSERT INTO `hera_group` VALUES
  ('1', '{\"name\":\"赫拉分布式任务调度系统\"}', '', '0', '2018-12-21 15:11:39', '2018-12-28 10:46:47', 'hera分布式调度系统', 'hera', '0',
        '[]', '1'),
  ('2', '{\"qq\":\"1142819049\"}', '', '1', '2018-12-21 15:15:36', '2018-12-21 15:31:08', 'test', 'hera', '1', '[]',
        '1');
INSERT INTO hera_host_group (id, name, effective, description) VALUES (1, '默认组', 1, '机器默认组');
INSERT INTO hera_host_group (id, name, effective, description) VALUES (2, 'spark组', 1, '执行spark任务');
INSERT INTO `hera_job` VALUES ('1', '0',
                                    '{\"run.priority.level\":\"1\",\"roll.back.wait.time\":\"1\",\"roll.back.times\":\"0\",\"qqGroup\":\"965839395\"}',
                                    '0 0 3 * * ?', NULL, '', '输出测试', '2018-12-22 11:14:55', '2019-01-04 11:14:09', '2',
                                    NULL, NULL, NULL, NULL, 'echoTest', NULL, 'hera', NULL, NULL, NULL, NULL, 'shell',
                                                                                                              '0',
                                                                                                              'echo ${name}\n\necho \"当前时间戳\":${zdt.getTime()}\necho \"     明天\":${zdt.addDay(1).format(\"yyyy-MM-dd HH:mm:ss\")}\n\necho \"上个月的今天\": ${zdt.add(2,-1).format(\"yyyy-MM-dd HH:mm:ss\")}\n\necho \"真实的今天\":${zdt.getToday()}\n\n\necho \"如果需要更多时间查看HeraDateTool类,可以自定义时间\"\n\n\necho ${qqGroup}',
                                                                                                              NULL,
                                                                                                              NULL,
                                                                                                              NULL,
                                                                                                              NULL,
                                                                                                              NULL,
                                                                                                              NULL, '1',
                               NULL, '1', 0);
INSERT INTO `hera_file` VALUES ('1', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '个人文档', 'hera', NULL, '1', '0');
INSERT INTO `hera_file` VALUES ('2', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '共享文档', 'all', NULL, '1', '0');

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

