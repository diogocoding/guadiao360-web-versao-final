-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gestao_usuarios_db
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `ocorrencia_midias`
--

DROP TABLE IF EXISTS `ocorrencia_midias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ocorrencia_midias` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `ocorrencia_id` bigint NOT NULL,
  `tipo_midia` enum('imagem','video','audio','pdf') COLLATE utf8mb4_unicode_ci NOT NULL,
  `url_arquivo` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nome_arquivo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ocorrencia_id` (`ocorrencia_id`),
  CONSTRAINT `ocorrencia_midias_ibfk_1` FOREIGN KEY (`ocorrencia_id`) REFERENCES `tb_ocorrencias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ocorrencia_midias`
--

LOCK TABLES `ocorrencia_midias` WRITE;
/*!40000 ALTER TABLE `ocorrencia_midias` DISABLE KEYS */;
/*!40000 ALTER TABLE `ocorrencia_midias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfis`
--

DROP TABLE IF EXISTS `perfis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_perfil` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome_perfil` (`nome_perfil`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfis`
--

LOCK TABLES `perfis` WRITE;
/*!40000 ALTER TABLE `perfis` DISABLE KEYS */;
INSERT INTO `perfis` VALUES (1,'ADM'),(3,'Analista'),(2,'Chefe / Supervisor'),(4,'Padrão / Operacional');
/*!40000 ALTER TABLE `perfis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_auditoria`
--

DROP TABLE IF EXISTS `tb_auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_auditoria` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `data_hora` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_matricula` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `evento_tipo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detalhes` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ocorrencia_id_relacionada` bigint DEFAULT NULL,
  `ip_origem` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_auditoria`
--

LOCK TABLES `tb_auditoria` WRITE;
/*!40000 ALTER TABLE `tb_auditoria` DISABLE KEYS */;
INSERT INTO `tb_auditoria` VALUES (1,'2023-10-26 09:15:22','admin@cbm.com.br','N/A','LOGIN','Ocorrência #2023-1005 Criada',123456,'192.168.1.10'),(2,'2023-10-26 10:05:40','ana.silva@cbm.com.br','00345678','REUNIÃO','Ocorrência #2023-1005 Criada',78910,'10.0.0.5'),(3,'2023-10-26 11:20:10','pedro.lins@cbm.com.br','00112233','EDIÇÃO_USUÁRIO','Ocorrência #2024-1234 Criada',11121314,'172.16.0.20'),(4,'2025-12-04 15:12:18','Sistema',NULL,'CRIAR_USUARIO','Usuário criado: teste (123456)',NULL,'127.0.0.1'),(5,'2025-12-04 15:12:23','Sistema',NULL,'EXCLUIR_USUARIO','Usuário excluído ID: 22',NULL,'127.0.0.1'),(6,'2025-12-04 22:28:41','Sistema',NULL,'LOGIN','Login realizado: Administrador',NULL,'127.0.0.1');
/*!40000 ALTER TABLE `tb_auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_ocorrencias`
--

DROP TABLE IF EXISTS `tb_ocorrencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_ocorrencias` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tipo_ocorrencia` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `icone_classe` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('Aberto','Pendente','Andamento','Concluído','Cancelado') COLLATE utf8mb4_unicode_ci NOT NULL,
  `localizacao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `regiao` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_hora` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_conclusao` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_ocorrencias`
--

LOCK TABLES `tb_ocorrencias` WRITE;
/*!40000 ALTER TABLE `tb_ocorrencias` DISABLE KEYS */;
INSERT INTO `tb_ocorrencias` VALUES (1,'Incêndio','fa-fire-flame-curved','Concluído','Boa Viagem, 158','Sul','2025-11-01 10:00:00','2025-11-01 11:15:00'),(2,'Incêndio','fa-faucet','Concluído','Rua Saraiva, 50','Norte','2025-11-02 11:00:00','2025-11-02 12:15:00'),(3,'Incêndio','fa-fire-flame-curved','Andamento','Rua das Flores, 123','Centro','2025-11-03 12:00:00',NULL),(4,'Acidente Veicular','fa-car-burst','Concluído','Rua dos pinhais, 153','Oeste','2025-11-04 13:00:00','2025-11-04 14:15:00'),(5,'Acidente Veicular','fa-car-burst','Cancelado','Jaboatão Centro, 206','Jaboatão','2025-11-05 14:00:00','2025-11-05 14:45:00'),(6,'Resgate','fa-person','Concluído','Ilha do retiro, 87','Centro','2025-11-06 15:00:00','2025-11-06 16:15:00'),(11,'Incêndio','fa-fire-flame-curved','Concluído','Centro do Recife, 15','Centro','2025-11-07 16:00:00','2025-11-07 17:15:00'),(12,'Resgate','fa-person','Cancelado','Boa Vista, 53','Centro','2025-11-08 17:00:00','2025-11-08 17:45:00'),(13,'Incêndio','fa-fire-flame-curved','Andamento','Av. Boa Viagem, 500','Sul','2025-12-04 15:52:42',NULL),(14,'Resgate','fa-person','Aberto','Rua da Aurora, 100','Centro','2025-12-04 15:52:42',NULL),(15,'Acidente Veicular','fa-car-burst','Pendente','BR-101, km 20','Oeste','2025-12-04 13:52:42',NULL),(16,'Incêndio','fa-fire-flame-curved','Concluído','Rua do Sol, 45','Centro','2025-12-03 15:52:42','2025-12-04 17:52:42'),(17,'Resgate','fa-person','Concluído','Praia de Piedade','Jaboatão','2025-12-02 15:52:42','2025-12-04 19:52:42'),(18,'Acidente Veicular','fa-car-burst','Concluído','Av. Caxangá, 2000','Oeste','2025-11-10 08:00:00','2025-11-10 10:30:00'),(19,'Acidente Veicular','fa-car-burst','Cancelado','Rua Imperial, 20','Centro','2025-11-12 14:00:00','2025-11-12 14:15:00'),(20,'Incêndio','fa-fire-flame-curved','Concluído','Mercado de São José','Centro','2025-11-15 22:00:00','2025-11-16 02:00:00'),(21,'Resgate','fa-person','Concluído','Parque da Jaqueira','Norte','2025-11-20 09:00:00','2025-11-20 09:45:00'),(22,'Incêndio','fa-fire-flame-curved','Concluído','Edifício Treme-Treme','Centro','2025-11-25 18:00:00','2025-11-25 20:00:00'),(23,'Resgate','fa-person','Concluído','Praia do Pina','Sul','2025-10-05 10:00:00','2025-10-05 11:00:00'),(24,'Resgate','fa-person','Concluído','Rio Capibaribe','Centro','2025-10-08 15:30:00','2025-10-08 17:00:00'),(25,'Acidente Veicular','fa-car-burst','Concluído','Av. Norte, 5000','Norte','2025-10-12 07:00:00','2025-10-12 08:15:00'),(26,'Incêndio','fa-fire-flame-curved','Cancelado','Terreno Baldio','Oeste','2025-10-20 13:00:00','2025-10-20 13:10:00'),(27,'Incêndio','fa-fire-flame-curved','Concluído','Shopping Tacaruna','Norte','2025-10-30 23:00:00','2025-10-31 01:00:00'),(28,'Acidente Veicular','fa-car-burst','Concluído','Av. Recife, 100','Sul','2025-09-02 18:00:00','2025-09-02 19:30:00'),(29,'Acidente Veicular','fa-car-burst','Concluído','Viaduto Joana Bezerra','Centro','2025-09-10 08:00:00','2025-09-10 09:00:00'),(30,'Resgate','fa-person','Concluído','Elevador Quebrado','Sul','2025-09-15 14:00:00','2025-09-15 14:40:00'),(31,'Resgate','fa-person','Concluído','Gato em Árvore','Norte','2025-09-20 10:00:00','2025-09-20 11:00:00'),(32,'Incêndio','fa-fire-flame-curved','Concluído','Restaurante X','Oeste','2025-09-25 12:00:00','2025-09-25 13:30:00'),(33,'Incêndio','fa-fire-flame-curved','Concluído','Mata Atlântica','Oeste','2025-08-05 10:00:00','2025-08-05 16:00:00'),(34,'Incêndio','fa-fire-flame-curved','Concluído','Canavial','Jaboatão','2025-08-12 11:00:00','2025-08-12 15:00:00'),(35,'Acidente Veicular','fa-car-burst','Concluído','PE-15','Norte','2025-08-18 06:00:00','2025-08-18 07:30:00'),(36,'Resgate','fa-person','Concluído','Deslizamento de Barreira','Norte','2025-08-25 04:00:00','2025-08-25 08:00:00'),(37,'Resgate','fa-person','Concluído','Alagamento','Centro','2025-07-02 09:00:00','2025-07-02 12:00:00'),(38,'Resgate','fa-person','Concluído','Alagamento','Sul','2025-07-03 10:00:00','2025-07-03 13:00:00'),(39,'Acidente Veicular','fa-car-burst','Concluído','Engavetamento','Sul','2025-07-15 18:00:00','2025-07-15 20:00:00'),(40,'Incêndio','fa-fire-flame-curved','Concluído','Apartamento','Jaboatão','2025-07-20 21:00:00','2025-07-20 23:30:00'),(41,'Incêndio','fa-fire-flame-curved','Concluído','Loja de Fogos','Oeste','2025-07-25 14:00:00','2025-07-25 18:00:00');
/*!40000 ALTER TABLE `tb_ocorrencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidades`
--

DROP TABLE IF EXISTS `unidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_unidade` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome_unidade` (`nome_unidade`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidades`
--

LOCK TABLES `unidades` WRITE;
/*!40000 ALTER TABLE `unidades` DISABLE KEYS */;
INSERT INTO `unidades` VALUES (2,'1º BBM (Zona Sul)'),(4,'2º BBM (Zona Norte)'),(6,'CBMPE'),(3,'DAT (Engenharia)'),(5,'DTI (Suporte)'),(1,'QG - Comando Geral');
/*!40000 ALTER TABLE `unidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `matricula` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `senha_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `posto_graduacao` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('Ativo','Inativo') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Ativo',
  `perfil_id` int DEFAULT NULL,
  `unidade_id` int DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletado_em` datetime DEFAULT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '123456',
  PRIMARY KEY (`id`),
  UNIQUE KEY `matricula` (`matricula`),
  KEY `perfil_id` (`perfil_id`),
  KEY `unidade_id` (`unidade_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`perfil_id`) REFERENCES `perfis` (`id`),
  CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`unidade_id`) REFERENCES `unidades` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (3,'João Victor Souza','00355443',NULL,'1º Sargento','Ativo',3,3,'2025-10-20 18:57:27','2025-10-20 18:57:27',NULL,'123456'),(4,'Lucas Ferreira Costa','00478901',NULL,'Soldado','Ativo',4,4,'2025-10-20 18:57:27','2025-10-20 18:57:27',NULL,'123456'),(5,'Marta Oliveira Dias','00565656',NULL,'Cabo','Inativo',3,5,'2025-10-20 18:57:27','2025-10-20 18:57:27',NULL,'123456'),(6,'Fernada Cibelly','00636958',NULL,'Sargento','Ativo',3,6,'2025-10-20 18:57:27','2025-10-20 18:57:27',NULL,'123456'),(20,'Ana Luiza Santos','00298765',NULL,'Capitã','Ativo',2,2,'2025-10-21 10:16:44','2025-10-21 10:16:44',NULL,'123456'),(21,'Administrador','admin',NULL,'Coronel','Ativo',1,1,'2025-12-04 16:56:15','2025-12-04 16:56:15',NULL,'admin');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-04 23:04:10
