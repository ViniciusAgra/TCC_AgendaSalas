CREATE DATABASE IF NOT EXISTS DBSAS;
USE DBSAS;
	
CREATE TABLE IF NOT EXISTS `usuario` (
  `Prontuario` varchar(10) NOT NULL,
  `Nome` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `Senha` varchar(45) NOT NULL,
  `ADM` tinyint NOT NULL,
  PRIMARY KEY (`Prontuario`)
);

CREATE TABLE IF NOT EXISTS `turma` (
  `ID_Turma` int NOT NULL AUTO_INCREMENT,
  `Periodo_ou_ano` int NOT NULL,
  `Curso` varchar(50) NOT NULL,
  PRIMARY KEY (`ID_Turma`)
);

CREATE TABLE IF NOT EXISTS `sala` (
  `ID_Sala` int NOT NULL,
  `Bloco` int NOT NULL,
  `Nome` varchar(30) NOT NULL,
  PRIMARY KEY (`ID_Sala`)
);

CREATE TABLE IF NOT EXISTS `reserva` (
  `ID_Reserva` int NOT NULL AUTO_INCREMENT,
  `Sala` int NOT NULL,
  `Turma` int NOT NULL,
  `Dia` date NOT NULL,
  `Professor` varchar(10) NOT NULL,
  `Professor_2` varchar(10) DEFAULT NULL,
  `Inicio` time NOT NULL,
  `Fim` time NOT NULL,
  `Descricao` varchar(45) NOT NULL,
  PRIMARY KEY (`ID_Reserva`),
  KEY `ID_Sala_idx` (`Sala`),
  KEY `ID_Turma_idx` (`Turma`),
  KEY `Professor_idx` (`Professor`),
  KEY `Professor_2_idx` (`Professor_2`),
  CONSTRAINT `ID_Sala` FOREIGN KEY (`Sala`) REFERENCES `sala` (`ID_Sala`),
  CONSTRAINT `ID_Turma` FOREIGN KEY (`Turma`) REFERENCES `turma` (`ID_Turma`),
  CONSTRAINT `Professor` FOREIGN KEY (`Professor`) REFERENCES `usuario` (`Prontuario`),
  CONSTRAINT `Professor_2` FOREIGN KEY (`Professor_2`) REFERENCES `usuario` (`Prontuario`)
);
