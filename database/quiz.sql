-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: quiz
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `rel_chapter_question`
--
CREATE SCHEMA IF NOT EXISTS `quiz` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `quiz` ;

DROP TABLE IF EXISTS `rel_chapter_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rel_chapter_question` (
  `chapter_id` int NOT NULL,
  `question_id` int NOT NULL,
  PRIMARY KEY (`chapter_id`,`question_id`),
  KEY `R_21` (`question_id`),
  CONSTRAINT `rel_chapter_question_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `t_chapter` (`chapter_id`),
  CONSTRAINT `rel_chapter_question_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `t_question` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rel_chapter_question`
--

LOCK TABLES `rel_chapter_question` WRITE;
/*!40000 ALTER TABLE `rel_chapter_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `rel_chapter_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rel_examination_question`
--

DROP TABLE IF EXISTS `rel_examination_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rel_examination_question` (
  `examination_id` int NOT NULL,
  `question_id` int NOT NULL,
  PRIMARY KEY (`examination_id`,`question_id`),
  KEY `R_30` (`question_id`),
  CONSTRAINT `rel_examination_question_ibfk_1` FOREIGN KEY (`examination_id`) REFERENCES `t_examination` (`examination_id`),
  CONSTRAINT `rel_examination_question_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `t_question` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rel_examination_question`
--

LOCK TABLES `rel_examination_question` WRITE;
/*!40000 ALTER TABLE `rel_examination_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `rel_examination_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rel_role_permission`
--

DROP TABLE IF EXISTS `rel_role_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rel_role_permission` (
  `role_id` int NOT NULL,
  `action_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`action_id`),
  KEY `R_7` (`action_id`),
  CONSTRAINT `rel_role_action_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`role_id`),
  CONSTRAINT `rel_role_action_ibfk_2` FOREIGN KEY (`action_id`) REFERENCES `t_permission` (`action_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rel_role_permission`
--

LOCK TABLES `rel_role_permission` WRITE;
/*!40000 ALTER TABLE `rel_role_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `rel_role_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_mark`
--

DROP TABLE IF EXISTS `t_mark`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_mark` (
  `examination_id` int DEFAULT NULL,
  `score` int NOT NULL,
  `subject_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `mark_id` int NOT NULL,
  PRIMARY KEY (`mark_id`),
  KEY `R_46` (`subject_id`),
  KEY `fk_t_mark_t_student_detail1_idx` (`user_id`),
  KEY `t_mark_ibfk_2` (`examination_id`),
  CONSTRAINT `fk_t_mark_t_student_detail1` FOREIGN KEY (`user_id`) REFERENCES `t_student_detail` (`user_id`),
  CONSTRAINT `t_mark_ibfk_2` FOREIGN KEY (`examination_id`) REFERENCES `t_examination` (`examination_id`),
  CONSTRAINT `t_mark_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `t_subject` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_mark`
--

LOCK TABLES `t_mark` WRITE;
/*!40000 ALTER TABLE `t_mark` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_mark` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_answer`
--

DROP TABLE IF EXISTS `t_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_answer` (
  `answer_id` int NOT NULL,
  `content` text NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `question_id` int DEFAULT NULL,
  PRIMARY KEY (`answer_id`),
  KEY `R_24` (`question_id`),
  CONSTRAINT `t_answer_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `t_question` (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_answer`
--

LOCK TABLES `t_answer` WRITE;
/*!40000 ALTER TABLE `t_answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_answer_record`
--

DROP TABLE IF EXISTS `t_answer_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_answer_record` (
  `answer_record_id` int NOT NULL AUTO_INCREMENT,
  `question_record_id` int DEFAULT NULL,
  `correct_option` varchar(255) NOT NULL,
  PRIMARY KEY (`answer_record_id`),
  KEY `R_43` (`question_record_id`),
  CONSTRAINT `t_answer_record_ibfk_1` FOREIGN KEY (`question_record_id`) REFERENCES `t_question_record` (`question_record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_answer_record`
--

LOCK TABLES `t_answer_record` WRITE;
/*!40000 ALTER TABLE `t_answer_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_answer_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_chapter`
--

DROP TABLE IF EXISTS `t_chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_chapter` (
  `chapter_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` int NOT NULL,
  `subject_id` int DEFAULT NULL,
  PRIMARY KEY (`chapter_id`),
  KEY `R_18` (`subject_id`),
  CONSTRAINT `t_chapter_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `t_subject` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_chapter`
--

LOCK TABLES `t_chapter` WRITE;
/*!40000 ALTER TABLE `t_chapter` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_class`
--

DROP TABLE IF EXISTS `t_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_class` (
  `class_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_class`
--

LOCK TABLES `t_class` WRITE;
/*!40000 ALTER TABLE `t_class` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_class_group`
--

DROP TABLE IF EXISTS `t_class_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_class_group` (
  `count` int NOT NULL,
  `class_id` int NOT NULL,
  PRIMARY KEY (`class_id`),
  CONSTRAINT `fk_t_class_group_t_class1` FOREIGN KEY (`class_id`) REFERENCES `t_class` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_class_group`
--

LOCK TABLES `t_class_group` WRITE;
/*!40000 ALTER TABLE `t_class_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_class_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_examination`
--

DROP TABLE IF EXISTS `t_examination`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_examination` (
  `examination_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `duration` int NOT NULL,
  `code` varchar(255) NOT NULL,
  `status` int NOT NULL,
  `type` int NOT NULL,
  PRIMARY KEY (`examination_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_examination`
--

LOCK TABLES `t_examination` WRITE;
/*!40000 ALTER TABLE `t_examination` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_examination` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_level`
--

DROP TABLE IF EXISTS `t_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_level` (
  `level_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `point` int NOT NULL,
  PRIMARY KEY (`level_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_level`
--

LOCK TABLES `t_level` WRITE;
/*!40000 ALTER TABLE `t_level` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_permission`
--

DROP TABLE IF EXISTS `t_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_permission` (
  `action_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`action_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_permission`
--

LOCK TABLES `t_permission` WRITE;
/*!40000 ALTER TABLE `t_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_question`
--

DROP TABLE IF EXISTS `t_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_question` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `status` int NOT NULL,
  `level_id` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  PRIMARY KEY (`question_id`),
  KEY `R_22` (`level_id`),
  KEY `R_35` (`subject_id`),
  CONSTRAINT `t_question_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `t_level` (`level_id`),
  CONSTRAINT `t_question_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `t_subject` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_question`
--

LOCK TABLES `t_question` WRITE;
/*!40000 ALTER TABLE `t_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_question_record`
--

DROP TABLE IF EXISTS `t_question_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_question_record` (
  `question_record_id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `option_a` varchar(255) NOT NULL,
  `option_b` varchar(255) NOT NULL,
  `option_c` varchar(255) NOT NULL,
  `option_d` varchar(255) NOT NULL,
  `examination_id` int DEFAULT NULL,
  PRIMARY KEY (`question_record_id`),
  KEY `R_42` (`examination_id`),
  CONSTRAINT `t_question_record_ibfk_1` FOREIGN KEY (`examination_id`) REFERENCES `t_examination` (`examination_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_question_record`
--

LOCK TABLES `t_question_record` WRITE;
/*!40000 ALTER TABLE `t_question_record` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_question_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_role`
--

DROP TABLE IF EXISTS `t_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_role` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_role`
--

LOCK TABLES `t_role` WRITE;
/*!40000 ALTER TABLE `t_role` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_sem`
--

DROP TABLE IF EXISTS `t_sem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_sem` (
  `sem_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`sem_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_sem`
--

LOCK TABLES `t_sem` WRITE;
/*!40000 ALTER TABLE `t_sem` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_sem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_status`
--

DROP TABLE IF EXISTS `t_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_status` (
  `status_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_status`
--

LOCK TABLES `t_status` WRITE;
/*!40000 ALTER TABLE `t_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_student_answer`
--

DROP TABLE IF EXISTS `t_student_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_student_answer` (
  `student_answer_id` int NOT NULL AUTO_INCREMENT,
  `select_option` varchar(255) NOT NULL,
  `question_record_id` int DEFAULT NULL,
  `mark_id` int DEFAULT NULL,
  PRIMARY KEY (`student_answer_id`),
  KEY `R_44` (`question_record_id`),
  KEY `R_45` (`mark_id`),
  CONSTRAINT `t_student_answer_ibfk_1` FOREIGN KEY (`question_record_id`) REFERENCES `t_question_record` (`question_record_id`),
  CONSTRAINT `t_student_answer_ibfk_2` FOREIGN KEY (`mark_id`) REFERENCES `t_mark` (`mark_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_student_answer`
--

LOCK TABLES `t_student_answer` WRITE;
/*!40000 ALTER TABLE `t_student_answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_student_answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_student_detail`
--

DROP TABLE IF EXISTS `t_student_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_student_detail` (
  `roll_portal` varchar(255) NOT NULL,
  `roll_number` varchar(255) NOT NULL,
  `status_id` int DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `R_37` (`status_id`),
  KEY `R_41` (`class_id`),
  CONSTRAINT `fk_t_student_detail_t_user1` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`),
  CONSTRAINT `t_student_detail_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `t_status` (`status_id`),
  CONSTRAINT `t_student_detail_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `t_class` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_student_detail`
--

LOCK TABLES `t_student_detail` WRITE;
/*!40000 ALTER TABLE `t_student_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_student_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_subject`
--

DROP TABLE IF EXISTS `t_subject`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_subject` (
  `subject_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `status` int NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `sem_id` int DEFAULT NULL,
  PRIMARY KEY (`subject_id`),
  KEY `R_39` (`sem_id`),
  CONSTRAINT `t_subject_ibfk_1` FOREIGN KEY (`sem_id`) REFERENCES `t_sem` (`sem_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_subject`
--

LOCK TABLES `t_subject` WRITE;
/*!40000 ALTER TABLE `t_subject` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_subject` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_user`
--

DROP TABLE IF EXISTS `t_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `status` int NOT NULL,
  `role_id` int DEFAULT NULL,
  `gender` int NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `R_11` (`role_id`),
  CONSTRAINT `t_user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user`
--

DROP TABLE IF EXISTS `t_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `t_contact` (
  `contact_id` int NOT NULL ,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  PRIMARY KEY (`contact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_user`
--

LOCK TABLES `t_user` WRITE;
/*!40000 ALTER TABLE `t_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-05  9:54:58
