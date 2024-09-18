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
  `Nome_Turma` varchar(40) NOT NULL,
  PRIMARY KEY (`Nome_Turma`)
);

CREATE TABLE `sala` (
  `Nome_Sala` varchar(40) NOT NULL,
  PRIMARY KEY (`Nome_Sala`)
);

CREATE TABLE `reserva` (
  `ID_Reserva` int NOT NULL AUTO_INCREMENT,
  `Sala` varchar(40) NOT NULL,
  `Turma` varchar(40) NOT NULL,
  `Dia` date NOT NULL,
  `Professor` varchar(10) NOT NULL,
  `Professor_2` varchar(10) DEFAULT NULL,
  `Inicio` time NOT NULL,
  `Fim` time NOT NULL,
  `Descricao` varchar(45) NOT NULL,
  PRIMARY KEY (`ID_Reserva`),
  KEY `Nome_Sala_idx` (`Sala`),
  KEY `Nome_Turma_idx` (`Turma`),
  KEY `Professor_idx` (`Professor`),
  KEY `Professor_2_idx` (`Professor_2`),
  CONSTRAINT `Nome_Sala` FOREIGN KEY (`Sala`) REFERENCES `sala` (`Nome_Sala`),
  CONSTRAINT `Nome_Turma` FOREIGN KEY (`Turma`) REFERENCES `turma` (`Nome_Turma`),
  CONSTRAINT `Professor` FOREIGN KEY (`Professor`) REFERENCES `usuario` (`Prontuario`),
  CONSTRAINT `Professor_2` FOREIGN KEY (`Professor_2`) REFERENCES `usuario` (`Prontuario`)
);
