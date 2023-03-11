CREATE DATABASE  IF NOT EXISTS `mydb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mydb`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mydb
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `a`
--

DROP TABLE IF EXISTS `a`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `a` (
  `種類` varchar(255) DEFAULT NULL,
  `名稱` varchar(255) DEFAULT NULL,
  `流水號` varchar(255) DEFAULT NULL,
  `位置` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `a`
--

LOCK TABLES `a` WRITE;
/*!40000 ALTER TABLE `a` DISABLE KEYS */;
INSERT INTO `a` VALUES ('SDH','Nokia','1054','D04'),('PTN','Opnet','111','A06'),('PON','yya','222','B02');
/*!40000 ALTER TABLE `a` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aa`
--

DROP TABLE IF EXISTS `aa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aa` (
  `種類` varchar(255) DEFAULT NULL,
  `名稱` varchar(255) DEFAULT NULL,
  `流水號` varchar(255) DEFAULT NULL,
  `位置` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aa`
--

LOCK TABLES `aa` WRITE;
/*!40000 ALTER TABLE `aa` DISABLE KEYS */;
INSERT INTO `aa` VALUES ('SDH','Nokia','1054','D04'),('PTN','Opnet','111','A06'),('PON','yya','222','B02');
/*!40000 ALTER TABLE `aa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `articles`
--

DROP TABLE IF EXISTS `articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `articles`
--

LOCK TABLES `articles` WRITE;
/*!40000 ALTER TABLE `articles` DISABLE KEYS */;
INSERT INTO `articles` VALUES (1,'D先生','kkasdfa','<p>hhewwea\\\\</p><p> </p><p> </p>','2023-03-11 14:14:55'),(2,'D先生','測試標題','<h1>哈囉</h1><p><strong>這是一段內</strong><i>容</i><a href=\"https://www.youtube.com/\">https://www.youtube.com/</a></p><ul><li>a</li><li>j</li></ul><p>j</p><ol><li>a</li><li>b</li><li>c</li></ol>','2023-03-11 11:31:10'),(3,'E先生','t','<p>ssdf</p>','2023-03-11 12:35:17'),(4,'C先生','tsdsf','<p>ddd</p>','2023-03-11 12:35:23');
/*!40000 ALTER TABLE `articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fff`
--

DROP TABLE IF EXISTS `fff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fff` (
  `種類` varchar(255) DEFAULT NULL,
  `名稱` varchar(255) DEFAULT NULL,
  `流水號` varchar(255) DEFAULT NULL,
  `位置` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fff`
--

LOCK TABLES `fff` WRITE;
/*!40000 ALTER TABLE `fff` DISABLE KEYS */;
INSERT INTO `fff` VALUES ('SDH','Nokia','1054','D04'),('PTN','Opnet','111','A06'),('PON','yya','222','B02');
/*!40000 ALTER TABLE `fff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `g`
--

DROP TABLE IF EXISTS `g`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `g` (
  `種類` varchar(255) DEFAULT NULL,
  `名稱` varchar(255) DEFAULT NULL,
  `流水號` varchar(255) DEFAULT NULL,
  `位置` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `g`
--

LOCK TABLES `g` WRITE;
/*!40000 ALTER TABLE `g` DISABLE KEYS */;
INSERT INTO `g` VALUES ('SDH','Nokia','1054','D04'),('PTN','Opnet','111','A06'),('PON','yya','222','B02');
/*!40000 ALTER TABLE `g` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-03-11 22:23:41
