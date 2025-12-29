-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: gateway01.ap-southeast-1.prod.aws.tidbcloud.com    Database: test
-- ------------------------------------------------------
-- Server version	8.0.11-TiDB-v7.5.2-serverless

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `entries`
--

DROP TABLE IF EXISTS `entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_name` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `grade` varchar(20) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `term` varchar(20) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `workbook` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `count` varchar(20) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `remark` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `submitted_by` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `submitted_at` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `delivered` varchar(10) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci AUTO_INCREMENT=150079;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entries`
--

LOCK TABLES `entries` WRITE;
/*!40000 ALTER TABLE `entries` DISABLE KEYS */;
INSERT INTO `entries` VALUES (4,'Riverdale High','Bangalore','Grade 4','Term 2','Social Studies Workbook','25','Damaged copies found','Teacher D','2025-09-04 12:45:00','No'),(18,'Sunshine Public','Jaipur','8','Term 2','Math','24','Poor','Teacher2','2025-09-10 14:30:00','No'),(19,'Elite Academy','Lucknow','9','Term 1','Science','26','Good','Admin','2025-09-11 08:55:00','Yes'),(20,'Springfield School','Patna','10','Term 2','English','23','Average','Teacher3','2025-09-12 13:10:00','No'),(21,'Bright Future School','Bhopal','5','Term 1','Math','30','Good','Admin','2025-09-13 10:05:00','Yes'),(22,'Global Public School','Indore','6','Term 2','Science','28','Excellent','Teacher1','2025-09-14 11:25:00','Yes'),(23,'Mount View School','Nagpur','7','Term 1','English','27','Average','Admin','2025-09-15 09:15:00','No'),(28,'City Public School','Vadodara','6','Term 2','Science','31','Excellent','Teacher1','2025-09-20 11:45:00','Yes'),(29,'Bright Minds Academy','Nagpur','7','Term 1','English','26','Good','Admin','2025-09-21 09:05:00','Yes'),(30,'Sunflower School','Kochi','8','Term 2','Math','30','Good','Teacher2','2025-09-22 14:10:00','Yes'),(31,'Future Stars School','Trivandrum','9','Term 1','Science','24','Average','Admin','2025-09-23 08:50:00','No'),(33,'Sunrise International','Bhubaneswar','5','Term 1','Math','29','Excellent','Admin','2025-09-25 10:30:00','Yes'),(34,'Maple Leaf School','Ranchi','6','Term 2','Science','27','Average','Teacher1','2025-09-26 11:35:00','No'),(35,'Oakwood School','Shimla','7','Term 1','English','25','Good','Admin','2025-09-27 09:25:00','Yes'),(36,'Pearl Academy','Dehradun','8','Term 2','Math','32','Excellent','Teacher2','2025-09-28 14:20:00','Yes'),(37,'Hillside School','Guwahati','9','Term 1','Science','22','Poor','Admin','2025-09-29 08:40:00','No'),(38,'Lakeside School','Shillong','10','Term 2','English','30','Good','Teacher3','2025-09-30 13:15:00','Yes'),(39,'Starlight Academy','Patiala','5','Term 1','Math','28','Average','Admin','2025-10-01 10:15:00','No'),(58,'Apeejay School - Greater Noida','Greater Noida','2/3','3','Simple motorised Structure-1','6','hnj ','test2@onmyowntechnology.com','2025-09-24 07:00:35','No'),(59,'Apeejay School - Panchsheel Park','Panchsheel Park','2','2','Fun with Shapes-2','6','vb gf','test2@onmyowntechnology.com','2025-09-24 07:00:48','No'),(60,'H.C. Valia School','Mumbai','4','1','Omotools Explorer- Omotools Nanobit','6','hgtyht','test2@onmyowntechnology.com','2025-09-24 07:01:09','No'),(61,'Aditya Birla World Academy','Mumbai','2/3','2','Simple motorised Structure-1','6','gbhgf','test3@onmyowntechnology.com','2025-09-24 07:21:34','No'),(62,'Apeejay School - Greater Noida','Greater Noida','2','1','Omotools Electrokraft -2','6','fcgbf','test3@onmyowntechnology.com','2025-09-24 08:41:19','No'),(64,'Abhishek International School, Pune','Pune','1/2','3','3D adventure','3','ghch','admin@onmyowntechnology.com','2025-09-24T09:20:41.798Z','No'),(67,'Academic Heights World School','Delhi','1/2','2','3D adventure','11','test test ','test3@onmyowntechnology.com','2025-09-24T15:06:31.914362','No'),(68,'Apeejay School - Kharghar, Mumbai','Kharghar, Mumbai','2','3','Early Mechanix-2','5','thudiufcvjuhdyhcvzknjb','test3@onmyowntechnology.com','2025-09-24T15:07:05.849658','No'),(69,'Agarwadi School','Saphale, Mumbai','5','1','Omotools Explorer- Omotools Mini Electronics','5','bbbbbbbbbb','test3@onmyowntechnology.com','2025-09-24T15:16:00.544706','No'),(70,'Academic Heights Public School','Pune','3/4','1','Spike Building with motor','5','dddddddddd','test3@onmyowntechnology.com','2025-09-24T15:16:28.081172','No'),(71,'Abhishek International School, Pune','Pune','2','2','Early Mechanix-2','4','vvb','test3@onmyowntechnology.com','2025-09-25T12:02:17.230392','No'),(72,'Arya Vidya Mandir - Bandra (East)','Mumbai','2','2','Early Mechanix-2','6','testing.....','test3@onmyowntechnology.com','2025-09-25T15:12:40.995513','No'),(73,'Academic Heights World School','Delhi','5/6','1','Omotools Nanobit','20','testing','test3@onmyowntechnology.com','2025-09-25T15:13:28.708163','No'),(74,'Sanskruti School - Undri','Pune','4','2','Omotools Early Electronics -2','7','kl','muhammed.shaikh@onmyowntechnology.com','2025-09-25T15:23:57.746506','No'),(75,'Apeejay School - Noida','Noida','2','1','Fun with Shapes-2','3','ds','admin@onmyowntechnology.com','2025-09-29T10:32:29.486827','No'),(76,'Aditya Birla World Academy','Mumbai','8','2','Omotools IOT','20','Testing','ismail.shaikh@onmyowntechnology.com','2025-09-29T10:43:09.806244','No'),(77,'Aditya Birla World Academy','Mumbai','2','3','Omotools Explorer- Omotools Makerkraft','20','testing...','ismail.shaikh@onmyowntechnology.com','2025-09-29T10:43:51.414885','No'),(78,'Aditya Birla World Academy','Mumbai','6','2','Omotools Explorer- Omotools Jr Robotronics','7','gfjh','muhammed.shaikh@onmyowntechnology.com','2025-09-29T11:08:01.189166','No'),(30079,'Academic Heights Public School','Pune','9','1','Game Development ZimJs -2','8','new entry','test1@onmyowntechnology.com','2025-10-01T12:37:39.250746','No'),(30080,'Apeejay School - Saket','Saket','8','1','Python Syntax-1','10','Good','test1@onmyowntechnology.com','2025-10-01T12:39:02.554305','No'),(60079,'Apeejay School - Saket','Saket','8','1','Python Syntax-1','10','nill','test1@onmyowntechnology.com','2025-10-01T13:34:07.819566','No'),(90079,'Agarwadi School','Saphale, Mumbai','2','2','Early Mechanix-2','10','New Entry','muhammed.shaikh@onmyowntechnology.com','2025-10-01T14:30:03.801977','No'),(120079,'Academic Heights World School','Delhi','4','2','Click Drag Design -2','10','new','muhammed.shaikh@onmyowntechnology.com','2025-10-01T14:51:38.081838','No');
/*!40000 ALTER TABLE `entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reset_tokens`
--

DROP TABLE IF EXISTS `reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reset_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `token` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `expires_at` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci AUTO_INCREMENT=150070;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_tokens`
--

LOCK TABLES `reset_tokens` WRITE;
/*!40000 ALTER TABLE `reset_tokens` DISABLE KEYS */;
INSERT INTO `reset_tokens` VALUES (1,'test3@onmyowntechnology.com','_nNG2xx_V3AIctM31eokVTuhjTgFvgvc','2025-09-24T10:57:14.547704'),(2,'ismail.shaikh@onmyowntechnology.com','UYaeuKf2eU7wzdR3aQnsZD8HwdOlI7ee','2025-09-24T11:01:31.644919'),(3,'ismail.shaikh@onmyowntechnology.com','DXDb6SyxlB4Wq-kD-VrgMMCzaMqKmpaS','2025-09-24T11:02:40.194749'),(4,'muhammed.shaikh@onmyowntechnology.com','axCoMD6HU5W3rjtoTJuzI0Sj6bC_xFwJ','2025-09-24T11:07:05.221959'),(5,'muhammed.shaikh@onmyowntechnology.com','37u6WqU-b6TYR0n65eLqKXQ3oAvtXSiv','2025-09-24T11:08:15.675043'),(6,'muhammed.shaikh@onmyowntechnology.com','NQqZ-v54U0WqauUDscp0Cyw4SWeDf6ni','2025-09-24T11:09:06.497475'),(7,'muhammed.shaikh@onmyowntechnology.com','brIYVy2yi60gBLo7p9B1w7Efp0lSgPwF','2025-09-24T11:30:39.896388'),(8,'ismail.shaikh@onmyowntechnology.com','nrfp5p3yRrZJ6GQt8V7wNdXN9bp-urJ5','2025-09-24T11:38:47.639827'),(13,'ismail.shaikh@onmyowntechnology.com','VFIBhFTA5JXBwiLjk_aolNIiw0v13owZ','2025-09-24T12:01:32.553159'),(14,'test3@onmyowntechnology.com','ZUdI3AqCvfhO4zVj0XVZjCz1z4Bxyx2A','2025-09-25T09:27:26.490391'),(15,'test3@onmyowntechnology.com','7pcwFqriBCAwKTHnWf3DEgsCdqYvLALq','2025-09-25T09:27:28.357976'),(21,'muhammed.shaikh@onmyowntechnology.com','kPwrOVxB6VfxsYXsN8krvY7MOyzQ9sJN','2025-09-25T12:19:57.786923'),(22,'muhammed.shaikh@onmyowntechnology.com','kCP_DZ_1GBIldWx2nlNSx10pIsn6Pe3D','2025-09-25T12:51:04.005419'),(23,'muhammed.shaikh@onmyowntechnology.com','hUFoaPB_wL-8YMbYLxX-TB04EKWljOoY','2025-09-25T12:52:01.850068'),(24,'muhammed.shaikh@onmyowntechnology.com','Qx2mzIyu9QG_hLs17ys_tozdFtFbMFWw','2025-09-25T12:54:40.988292'),(25,'muhammed.shaikh@onmyowntechnology.com','GuzMeXwI8bjdoUSPQGSlniRauoyRQ0_3','2025-09-25T12:55:59.722944'),(26,'muhammed.shaikh@onmyowntechnology.com','bEBdmrdoytPyPztBwvmmpBm5rE8Tk-gh','2025-09-25T12:57:29.370630'),(27,'muhammed.shaikh@onmyowntechnology.com','HoDAr4a0UEGPdr4nQQ3FU5uytd5G77L4','2025-09-25T12:59:16.378700'),(28,'muhammed.shaikh@onmyowntechnology.com','fVIcwz0VVQGAvWMGRmBcHrZQbibltFkO','2025-09-25T12:59:42.987109'),(29,'muhammed.shaikh@onmyowntechnology.com','poqQZUMkwKE9wD3jTLe8yMgrJzb2YcP8','2025-09-25T13:01:05.332036'),(30,'muhammed.shaikh@onmyowntechnology.com','MDr3yLpOO5aZF8bQiqIns4TyusxCLIMb','2025-09-25T13:01:55.570977'),(31,'muhammed.shaikh@onmyowntechnology.com','LUvlJsJpUMeV_xcJ-qljt0ox4xpetre2','2025-09-25T13:05:59.859894'),(35,'muhammed.shaikh@onmyowntechnology.com','F9TtiG_w3WymsD-37jMvQ3_SObTcdsui','2025-09-26T05:01:07.411872'),(36,'muhammed.shaikh@onmyowntechnology.com','YVnPxQV-YSYttieDLWU6bUAekAkA-Ykz','2025-09-26T05:03:52.154858'),(38,'muhammed.shaikh@onmyowntechnology.com','q_rJbcqvDVO1AAE07dZ8_Slc4FB_rqpa','2025-09-29T05:45:07.669711'),(39,'muhammed.shaikh@onmyowntechnology.com','M-qYzgl3OsegaM2DpftObxfD6gHQFqHd','2025-09-29T05:45:10.260508'),(40,'muhammed.shaikh@onmyowntechnology.com','znl92pDKm0eUuU0-lrFFEtJ94mAvmKv7','2025-09-29T05:45:34.311141'),(41,'muhammed.shaikh@onmyowntechnology.com','v1SLNnMNz4ewnDzYaI9JBCvoQ9YAzBSA','2025-09-29T05:46:02.460072'),(42,'muhammed.shaikh@onmyowntechnology.com','tTbRuezNwcqY5P11qoNChJo2BclgFCWc','2025-09-29T05:46:23.142744'),(43,'muhammed.shaikh@onmyowntechnology.com','fPwaq6rLv5K6S1DvAsURf88DuM75YKJk','2025-09-29T05:46:31.550053'),(44,'muhammed.shaikh@onmyowntechnology.com','9TQYOdhB-0uB0vExtqlPE99zLiS9Gsw6','2025-09-29T05:57:37.866396'),(45,'muhammed.shaikh@onmyowntechnology.com','EoBm3nw7fGjbJhOhmDzZuBpLh-eWi7bj','2025-09-29T05:57:39.748574'),(46,'muhammed.shaikh@onmyowntechnology.com','zXaEQRZzdNX1vc-vjVC2Jb41QlM2htDr','2025-09-29T05:57:40.587485'),(47,'muhammed.shaikh@onmyowntechnology.com','pa7OJD9ofalpoeaxYqti0LNXSHUEpMfV','2025-09-29T05:57:41.635489'),(48,'muhammed.shaikh@onmyowntechnology.com','5cUF6k8npnZnCIY8YqoSQHIr5FTQ2wDx','2025-09-29T05:57:42.531558'),(49,'muhammed.shaikh@onmyowntechnology.com','VJ7wyjTW0hEVfYTcALKIO2mjxjgQP0BC','2025-09-29T05:57:43.454449'),(50,'muhammed.shaikh@onmyowntechnology.com','Wp87KQN3HlwuxMjU1KidJmrN4LqzfDx-','2025-09-29T05:57:44.452344'),(51,'muhammed.shaikh@onmyowntechnology.com','nY8lhOMVQSzRn-rq52iXVhqsXpce6s0e','2025-09-29T06:02:26.231224'),(52,'muhammed.shaikh@onmyowntechnology.com','ePwMQYO5MM-j0RwAvMcci5bf7GyBd3Yu','2025-09-29T06:10:19.406578'),(53,'muhammed.shaikh@onmyowntechnology.com','kjMZBD7CysdLa1aMGgDmpUSo-9SrYZAx','2025-09-29T07:12:24.260368'),(54,'muhammed.shaikh@onmyowntechnology.com','FzzjLObas-EatYSRx8wk-ZvQAQMLqf_6','2025-09-29T07:12:28.967081'),(55,'muhammed.shaikh@onmyowntechnology.com','4jj05t5VYF87BI15torIG5OMru1Jiaro','2025-09-29T07:12:30.018020'),(56,'muhammed.shaikh@onmyowntechnology.com','LLzj7UC4jMUXkV0aEaGllzd6Tdz67lkS','2025-09-29T07:12:30.728047'),(57,'muhammed.shaikh@onmyowntechnology.com','VZ6rETLMfvFpyZn-ittKK76hRxJ09oF5','2025-09-29T07:12:32.847391'),(58,'muhammed.shaikh@onmyowntechnology.com','qt023LE1c654z5Fttd59dxoWkKXRfO4q','2025-09-29T07:12:52.009376'),(59,'muhammed.shaikh@onmyowntechnology.com','zAE4eDd4sFT1NW5Y2Y9dkToEm7a63-HI','2025-09-29T07:14:35.815248'),(60,'muhammed.shaikh@onmyowntechnology.com','08u9_OWPznmpfPUZLBg57wgJbmEXY3My','2025-09-29T07:14:54.005370'),(61,'muhammed.shaikh@onmyowntechnology.com','pmYtgm4XbUbtRl0VS8aVfWukRXSMPPY6','2025-09-29T07:16:07.380860'),(62,'muhammed.shaikh@onmyowntechnology.com','zEvm81x58cwMB-SBt5_FMdqC7App-loJ','2025-09-29T07:16:11.953178'),(63,'muhammed.shaikh@onmyowntechnology.com','V8w6Fka_yuAAtZjBXFEIA0cDjlR2dMTK','2025-09-29T07:18:14.088431'),(64,'muhammed.shaikh@onmyowntechnology.com','E1YmB158I16I_N-r7V_G8zNeu1JxOH5F','2025-09-29T07:18:18.665062'),(65,'muhammed.shaikh@onmyowntechnology.com','_YMP-3QWinUukGpy7SQTrZ1QJs0q8Vq6','2025-09-29T07:21:18.332488'),(66,'muhammed.shaikh@onmyowntechnology.com','ywTVM19fOUHma3g-ZJ-DXhRabHbUH_tT','2025-09-29T07:21:45.217941'),(67,'muhammed.shaikh@onmyowntechnology.com','DYut38lTdZwJ8tGt8wCuwJN28yMKe20g','2025-09-29T07:21:47.830914'),(68,'muhammed.shaikh@onmyowntechnology.com','AJ59PNiCMHh3G-DmrJiF4sqcQrTToTbs','2025-09-29T07:21:48.366910'),(69,'muhammed.shaikh@onmyowntechnology.com','EVNZpta_mRO-HWod0baysf0hD6b3nzbl','2025-09-29T07:21:49.550738'),(30070,'test3@onmyowntechnology.com','cIDAmr4i-xZjkQlTtFARBv4byja8EPOg','2025-09-30 13:06:10.396058'),(30071,'muhammed.shaikh@onmyowntechnology.com','mejN1ZxuoE5PY1zBgXDf4UNZMRlRf9Dr','2025-09-30 13:06:35.358297'),(30072,'muhammed.shaikh@onmyowntechnology.com','zrpbbBtn0sLtaFvPV-TLHHzwnxZbLIDO','2025-09-30 13:08:18.020745'),(60070,'muhammed.shaikh@onmyowntechnology.com','BbXxpYxXr91k1EI2x9W9U68n1XjmCIRy','2025-10-01 07:10:17.455069'),(60071,'muhammed.shaikh@onmyowntechnology.com','h6OOrG04e_bXOhCc-pdnnM4MygkP3dNj','2025-10-01 07:12:00.490578'),(60072,'muhammed.shaikh@onmyowntechnology.com','SgPsfsXjP5mkNdjNiUyn18qKESi1B35M','2025-10-01 07:38:13.056112'),(60073,'muhammed.shaikh@onmyowntechnology.com','QEk_yoBJ5PU5vWg4g2slbjrVvYmAbzmR','2025-10-01 07:44:12.167048'),(60074,'muhammed.shaikh@onmyowntechnology.com','xXfzY56aerTG8qJNGcxtyQPbSmnTFGLB','2025-10-01 08:07:50.368306');
/*!40000 ALTER TABLE `reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school_data`
--

DROP TABLE IF EXISTS `school_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_name` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `reporting_branch` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `num_students` varchar(20) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci AUTO_INCREMENT=60115;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school_data`
--

LOCK TABLES `school_data` WRITE;
/*!40000 ALTER TABLE `school_data` DISABLE KEYS */;
INSERT INTO `school_data` VALUES (1,'Abhishek International School, Pune','Pune','Pune','800'),(2,'Academic Heights Public School','Pune','Pune','800'),(3,'Academic Heights World School','Delhi','Delhi','200'),(4,'Aditya Birla World Academy','Mumbai','Mumbai','50'),(5,'Agarwadi School','Saphale, Mumbai','Mumbai','0'),(6,'Apeejay School - Greater Noida','Greater Noida','Delhi','100'),(7,'Apeejay School - Jalandhar 1','Jalandhar','Delhi','100'),(8,'Apeejay School - Jalandhar 2','Jalandhar','Delhi','100'),(9,'Apeejay School - Kharghar, Mumbai','Kharghar, Mumbai','Mumbai','100'),(10,'Apeejay School - Nerul','Nerul','Mumbai','100'),(11,'Apeejay School - Noida','Noida','Delhi','100'),(12,'Apeejay School - Panchsheel Park','Panchsheel Park','Delhi','100'),(13,'Apeejay School - Pitampura','Pitampura','Delhi','350'),(14,'Apeejay School - Saket','Saket','Delhi','100'),(15,'Arya Vidya Mandir - Bandra (East)','Mumbai','Mumbai','550'),(16,'Arya Vidya Mandir - Bandra (West)','Mumbai','Mumbai','450'),(17,'Arya Vidya Mandir - Juhu','Mumbai','Mumbai','700'),(18,'Arya Vidya Mandir - Santacruz','Mumbai','Mumbai','270'),(19,'Bal Bharti School','Mumbai','Mumbai','0'),(20,'Beacon High School','Pune','Pune','1150'),(21,'Bharati Vidyapeeth Rabindranath Tagore School of Excellence','Pune','Pune','968'),(22,'Bhavan\'s Shri A.K. Doshi Vidyalaya - Jamnagar','GUJARAT','Mumbai','-'),(23,'Billabong High International School - Pune','Pune','Pune','15'),(24,'Bloomfield House of Knowledge','Pune','Pune','500'),(25,'Blossom Public School - Narhe','Pune','Pune','100'),(26,'Blossom Public School - Tathawade','Pune','Pune','100'),(27,'BLS World School','Delhi','Delhi','1200'),(28,'Bombay Scottish School - Mahim','Mumbai','Mumbai','100'),(29,'Bombay Scottish School - Powai','Mumbai','Mumbai','670'),(30,'Boston World School','Pune','Pune','48'),(31,'Bunts Sangha Mumbai - Leelavati Hegde School','Mumbai','Mumbai','-'),(32,'Cambria International School & Jr. College','Mumbai','Mumbai','585'),(33,'Chatrabhuj Narsee School - Pune','Pune','Pune','1000'),(34,'Clara Global School - Sinhagad','Pune','Pune','850'),(35,'CM International School','Pune','Pune','529'),(36,'Cresmonde - Kalyan','Mumbai','Mumbai','22'),(37,'Cresmonde School - Mumbai','Mumbai','Mumbai','nan'),(38,'Cygnet Public School - Hadapsar','Pune','Pune','100'),(39,'Cygnet Public School - Narhe','Pune','Pune','100'),(40,'Cygnus World School','GUJARAT','Mumbai','-'),(41,'Dayawati Modi Academy','Meerut','Delhi','-'),(42,'Delhi Public School - Nagpur','Nagpur','Mumbai','500'),(43,'Delhi Public School - Pune','Pune','Pune','500'),(44,'Delhi Public World International School','Noida','Delhi','215'),(45,'Dhruv Global School - Sus, Pune','Pune','Pune','500'),(46,'DPS - Varanasi','Varanasi','Delhi','600'),(47,'Dreamtime International School - Pune','Pune','Pune','250'),(48,'Dreamtime Learning Pvt Ltd - Hydrabad','Hyderabad','Mumbai','50'),(49,'DSP School','Kamothe, Mumbai','Mumbai','0'),(50,'Eicher School - Faridabad','Faridabad','Delhi','50'),(51,'Fortune World School','Noida','Delhi','25'),(52,'Fravashi International Academy','Nashik','Mumbai','-'),(53,'GES English Medium School','Nashik','Mumbai','550'),(54,'GK Gurukul','Pune','Pune','1100'),(55,'Goenka Shikshan Foundation (Finland School - Mumbai)','Mumbai','Mumbai','25'),(56,'Gopi Birla Memorial School','Mumbai','Mumbai','30'),(57,'Gyaanam School','Pune','Pune','200'),(58,'H.C. Valia School','Mumbai','Mumbai','211'),(59,'HDFC School - Bangalore','Bangalore','Mumbai','800'),(60,'HDFC School - Pune','Pune','Pune','1100'),(61,'Hillgreen High School','Mumbai','Mumbai','1000'),(62,'Ivy World School - Jalandhar','Delhi','Delhi','600'),(63,'Jamnabai Narsee International School','Mumbai','Mumbai','324'),(64,'Jamnabai Narsee School','Mumbai','Mumbai','-'),(65,'Jaywant Public School - Hadapsar','Pune','Pune','100'),(66,'JBCN International School','Mumbai','Mumbai','1350'),(67,'Kothari International School - Kharadi, Pune','Pune','Pune','800'),(68,'Kothari International School - Panvel','Panvel','Mumbai','210'),(69,'Kunjir Public School','Pune','Pune','-'),(70,'Little Millennium - Katraj','Pune','Pune','30'),(71,'Little Millennium - Undri','Pune','Pune','30'),(72,'Little Millennium - Vanaveri','Pune','Pune','30'),(73,'Made Easy School','Indore','Mumbai','180'),(74,'Mahaveer Public School','Jodhpur','Delhi','90'),(75,'Mahesh Vidyalaya School','Pune','Pune','495'),(76,'Mansukhbhai Kothari National School - Kondhwa','Pune','Pune','1000'),(77,'Methibai Devraj Gundecha Foundation’s Chatrabhuj Narsee School','Mumbai','Mumbai','1352'),(78,'Millennium World School','Delhi','Delhi','600'),(79,'MIS International School','Indore','Mumbai','-'),(80,'MIT - Viswajyothi International School','Pune','Pune','-'),(81,'Mount St. Ann High School','Mumbai','Mumbai','60'),(82,'Navodaya Central School','Raichur','Delhi','0'),(83,'Nikos Public School','Pune','Pune','400'),(84,'Oxford World School','Pune','Pune','65'),(85,'P.P. Gagangiri Maharaj International School','Mumbai','Mumbai','51'),(86,'Pacific World School','Greater Noida','Delhi','1300'),(87,'Pawar Public School','Pune','Pune','650'),(88,'Priyadarshini School','Pune','Pune','500'),(89,'Prodigy Public School - Wagholi','Pune','Pune','100'),(90,'Puruliya School','Kolkata','Mumbai','-'),(91,'Rajhans Vidyalaya','Mumbai','Mumbai','10'),(92,'Ram & Ashok Education Society','Mumbai','Mumbai','100'),(93,'Raman Munjal Vidya Mandir - Gurugram','Gurugram','Delhi','600'),(94,'Rancho Gurukul','Mumbai','Mumbai','400'),(95,'Redwood International School','Mumbai','Mumbai','0'),(96,'Rejoice International School - Malad','Mumbai','Mumbai','29'),(97,'RIMS International School','Pune','Pune','220'),(98,'RN Shah International School','Mumbai','Mumbai','189'),(99,'RNS International School','Bangalore','Mumbai','710'),(100,'Sanskruti School - Bhukum','Pune','Pune','70'),(101,'Sanskruti School - Undri','Pune','Pune','650'),(102,'Sanskruti School - Wagholi','Pune','Pune','70'),(103,'Saraswati School','Mumbai','Mumbai','0'),(104,'SCD Barfiwala School','Mumbai','Mumbai','1000'),(105,'Shemford Futuristic School','Gurugram','Delhi','73'),(106,'Shiva Valley School','Pune','Pune','500'),(107,'St. Angel\'s School','Delhi','Delhi','0'),(108,'St. Paul School','Darjeeling','Mumbai','490'),(109,'Trinity International School - Pune','Pune','Pune','0'),(110,'Universal Public School','Pune','Pune','83'),(111,'Utpal Shanghvi Global School','Mumbai','Mumbai','1100'),(112,'Venkateshwar School','Delhi','Delhi','450'),(113,'Vishwakarma Kaushal Kendra Public School','Rajasthan','Delhi','0'),(114,'Vivekananda Kendra Vidyalaya','Rajasthan','Delhi','0'),(30115,'Example','Mumbai','Mumbai','800');
/*!40000 ALTER TABLE `school_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `role` varchar(50) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci AUTO_INCREMENT=60344;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Muhammed','admin@onmyowntechnology.com','scrypt:32768:8:1$3cb3DObOXdifi7ZH$c89758fccd0ff1d929734ce325bd491a1ebec1818aa55fc6445a91e9ccad222ddf8b829072022e92a4096e2019ea3c19079cc528cace7301bedaf928f68a1ad0','admin'),(55,'OMOTEC TEST 1','test1@onmyowntechnology.com','scrypt:32768:8:1$vtOxpaxzM392Ds8H$5cf79471d6d907818242b983f01750c44315af143110f3d21c3b272eb757b2b2eb952476426e083240f7265cac5a3defabb235b9cbb8abdc5a949c111fd532c6','user'),(164,'OMOTEC ADMIN 1','admin1@onmyowntechnology.com','scrypt:32768:8:1$rVjT4Zm4GPVEemfS$d7210eca7c4b057e7f28c73c8c354154337d82c3c244610725e228a35bc1c94bdab06e83f25974db55d0c855348eca61af1b5286ab555f8f4ca0f33e63e6b2fb','admin'),(165,'OMOTEC ADMIN 2','admin2@onmyowntechnology.com','scrypt:32768:8:1$Sqx29ZLlW2iFOL1Z$964bd861fc0b8c1b1ee33983917746e2c540f9f68db9dfb1509f52924ad396c60cb076a668976366eed4d4f7a235a4641691b323bbc8850607fcc30ad46b22e0','admin'),(211,'Twinkle Kothari','twinkle.kothari@onmyowntechnology.com','scrypt:32768:8:1$tCEsxq7o8Uow5ZcV$ca4467613b75ba5c0141b0e83c28e9544cd0d4bdac618c0f6f28efd6877bffda3d3b48e4eb52fb39c3c8e26fef16ea8af91fa13d65b50a79d6555dc6f7aaa222','user'),(212,'Sheetal Gandhi','sheetalgandhi@onmyowntechnology.com','scrypt:32768:8:1$a7996VZO0zZaDlQp$812459e7c1cddb930b31926735f07e69d819e71422d46b212202d228073fbe9b68f6e754fae64b0d2bcd155db9d6fe708d4256ca150e418ee64192dbf238ae6a','user'),(242,'Muhammed Shaikh','muhammed.shaikh@onmyowntechnology.com','scrypt:32768:8:1$RnhW7fpZ77G4hqxv$520c0f44ff3257890255896e16e503b97fcf3312be10f1f0a031379e4e48cd08ac0bddf07e704f941d0d9c543b2c66b5e48c64612022636c7abcf2b38dc0d1fc','user'),(30344,'Gopal','gopal.vishvakarma@onmyowntechnology.com','scrypt:32768:8:1$GWwVZTy4dmyraiKy$fb83cb9a51e4100172728f5e53d463b5afdf61558fcc305e97c2a7c61c39015419755adacaee688fe2902f9ec914b15e4ae1c2b370ca5342aaab2d269cbfe1bf','user'),(30346,'TEST','testomo@onmyowntechnology.com','scrypt:32768:8:1$p68jc302TxbndFiL$bcff7f542ab5b01f10eedddd23fd5e0a72ae26900a45a6e4b7573c9137877222f2e14c856e434ffa1a7d8b78e8b7736e37868a83da06a6893154b3970481a9ea','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workbook_status`
--

DROP TABLE IF EXISTS `workbook_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workbook_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grade` varchar(20) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `workbook_name` varchar(255) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci AUTO_INCREMENT=60086;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workbook_status`
--

LOCK TABLES `workbook_status` WRITE;
/*!40000 ALTER TABLE `workbook_status` DISABLE KEYS */;
INSERT INTO `workbook_status` VALUES (1,'PP','Programmable Mouse Bot',51),(2,'1','Omotools Electrokraft-1',42),(3,'1','Omotools Funtrons-1',55),(4,'1','Early Mechanix-1',38),(5,'1','Fun with shapes -1',47),(6,'1','Coding Fun-1',55),(7,'2','Omotools Electrokraft -2',51),(8,'2','Omotools Funtrons-2',45),(9,'2','Early Mechanix-2',580),(10,'2','Fun with Shapes-2',40),(11,'2/3','Simple motorised Structure-1',58),(12,'2/3','Simple motorised Structure-2',49),(13,'2','Coding fun-2',136),(14,'2/3','Fun with coding games',63),(15,'3','Omotools Early Electronics-1',44),(16,'3','Omotools Junior Electronics-1',55),(17,'3','Omotools Robokraft',68),(18,'3','Simple Machines to Complex-1',41),(19,'3/4','Spike Building with motor',53),(20,'3/4','Spike building with Motor and Sensor',65),(21,'3','Click Drag Design-1',39),(22,'3/4','Code for Hackathon',56),(23,'3','Animation Game Design - 1',47),(24,'4','Omotools Early Electronics -2',62),(25,'4','Omotools Junior Electronics-2',59),(26,'4','Simple Machines to Complex- 2',48),(27,'4','Click Drag Design -2',37),(28,'4/5','Scratch Math',42),(29,'4','Animation Game Design - 2',64),(30,'5','Omotools Mini Electronics-1',103),(31,'5','Omotools Robobuillders',70),(32,'5','HTML Web Designing -1',36),(33,'5','Python Block Coding-1',52),(34,'5','Mechanism in motion',44),(35,'5','Mech building with automation - I',61),(36,'5','Mathematical 3D design -1',39),(37,'5','AI with Blocks- 1',46),(38,'6','Omotools Mini Electronics- 2',55),(39,'6','App Development',71),(40,'6','HTML Web Designing -2',50),(41,'6','Python Block Coding -2',62),(42,'6','MEch building with automation - II',58),(43,'6','AI with blocks -2',48),(44,'6','Mech building with Remote',135),(45,'6','Mathematical 3D design -2',67),(46,'6','Omotools Jr Robotronix',59),(47,'7','Mech building with autmation-III',63),(48,'7','Omotools Arduino -1',41),(49,'7','School Game coder -  Python Syntax',54),(50,'7','AI with blocks and circuits',66),(51,'7/8','Idea to Object',45),(52,'8','Omotools Arduino - 2',52),(53,'7','Omotools Sr robotronix',47),(54,'8','Omotools IOT',69),(55,'8','Omotools Autobot-1',56),(56,'8','Python Syntax-1',61),(57,'8','Game coder - Java Processing',42),(58,'8','Java Syntax-1',39),(59,'8','Programming with C++ - 1',46),(60,'8','Game Development ZimJs -1',53),(61,'8','Python  image processing -1',49),(62,'9','Omotools Pico-pi',58),(63,'9','Omotools Autobot-2',63),(64,'9','Java Syntax -2',44),(65,'9','Programming with C++ - 2',52),(66,'9','Game Development ZimJs -2',55),(67,'9','Python  image processing -2',61),(68,'5/6','Omotools Nanobit',42),(69,'9','python syntax-2',60),(70,'1/2','3D adventure',48),(71,'9','AI/ML Data Analytics-1',66),(72,'8/9','Autonomous Robot with Arduino',59),(73,'8','Drone Technology',74),(74,'7','Satellite Communication',39),(75,'5','Aeromodelling',45),(76,'6','Rover Quest',57),(77,'1','Omotools Explorer- Omotools Electrokraft',53),(78,'2','Omotools Explorer- Omotools Makerkraft',47),(79,'3','Omotools Explorer- Omotools Robokraft',61),(80,'4','Omotools Explorer- Omotools Nanobit',49),(81,'5','Omotools Explorer- Omotools Mini Electronics',56),(82,'6','Omotools Explorer- Omotools Jr Robotronics',58),(83,'7','Omotools Explorer- Omotools Sr Robotronics',62),(84,'8','Omotools Explorer- Omotools Mini IOT',65),(85,'9','Omotools Explorer- Omotools Mini Pico-PI',51),(30086,'6','example',4);
/*!40000 ALTER TABLE `workbook_status` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-01 15:21:15
