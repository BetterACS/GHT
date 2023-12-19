CREATE SCHEMA GHT;
USE GHT;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `email` varchar(255) NOT NULL,
  `username` varchar(16) NOT NULL,
  `password` varchar(60) NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `verification_token` varchar(255) DEFAULT NULL,
  `verification_token_expires` timestamp NULL DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` timestamp NULL DEFAULT NULL,
  `is_verified` boolean DEFAULT false,
  PRIMARY KEY (`email`)
);


DROP TABLE IF EXISTS `quest`;
CREATE TABLE `quest` (
  `quest_id` int NOT NULL AUTO_INCREMENT,
  `quest_name` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `last_update_date` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `due_date` datetime NOT NULL,
  `status` varchar(45) NOT NULL,
  `item_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`quest_id`),
  KEY `email` (`email`),
  CONSTRAINT `quest_ibfk_1` FOREIGN KEY (`email`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE RESTRICT
);

DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(45) NOT NULL,
  `tag_color` varchar(45) NOT NULL DEFAULT 'ffffff',
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`tag_id`),
  KEY `email` (`email`),
  CONSTRAINT `tag_ibfk_1` FOREIGN KEY (`email`) REFERENCES `user` (`email`) ON DELETE CASCADE ON UPDATE RESTRICT
);

DROP TABLE IF EXISTS `contain`;
CREATE TABLE `contain` (
  `Contain_id` int NOT NULL AUTO_INCREMENT,
  `tag_id` int NOT NULL,
  `quest_id` int NOT NULL,
  PRIMARY KEY (`Contain_id`),
  KEY `tag_id_idx` (`tag_id`),
  KEY `quest_id_idx` (`quest_id`),
  CONSTRAINT `fk_tag_contain` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`tag_id`) ON DELETE CASCADE,
  CONSTRAINT `quest_id` FOREIGN KEY (`quest_id`) REFERENCES `quest` (`quest_id`) ON DELETE CASCADE ON UPDATE RESTRICT
);