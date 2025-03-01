-- 创建数据库
CREATE DATABASE IF NOT EXISTS dormitory_management;
USE dormitory_management;

-- 导入现有的 SQL 文件内容
SOURCE /docker-entrypoint-initdb.d/dormitory_management.sql;