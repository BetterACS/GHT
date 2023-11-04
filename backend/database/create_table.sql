
CREATE DATABASE gmt;
USE gmt;
CREATE TABLE `gmt`.`userid` (
  `email` VARCHAR(255) NOT NULL,
  `username` VARCHAR(60) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`email`));