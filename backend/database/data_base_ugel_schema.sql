-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         13.0.2-MariaDB - MariaDB Server
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.20.0.7320
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para data_base_ugel
CREATE DATABASE IF NOT EXISTS `data_base_ugel` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `data_base_ugel`;

-- Volcando estructura para tabla data_base_ugel.cargo_trabajador
CREATE TABLE IF NOT EXISTS `cargo_trabajador` (
  `cod_cargo` int(11) NOT NULL AUTO_INCREMENT,
  `cargo_trabajador` varchar(255) DEFAULT NULL,
  `subtipo_trabajador` int(11) NOT NULL,
  PRIMARY KEY (`cod_cargo`),
  KEY `fk_cargo_trabajador_subtipo_trabajador1_idx` (`subtipo_trabajador`),
  CONSTRAINT `fk_cargo_trabajador_subtipo_trabajador1` FOREIGN KEY (`subtipo_trabajador`) REFERENCES `subtipo_trabajador` (`cod_subtipo`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.categoria
CREATE TABLE IF NOT EXISTS `categoria` (
  `cod_categoria` int(11) NOT NULL,
  `categoria` varchar(255) DEFAULT NULL,
  `tipo_trabajador` int(11) NOT NULL,
  PRIMARY KEY (`cod_categoria`),
  KEY `fk_categoria_tipo_trabajador1_idx` (`tipo_trabajador`),
  CONSTRAINT `fk_categoria_tipo_trabajador1` FOREIGN KEY (`tipo_trabajador`) REFERENCES `tipo_trabajador` (`cod_tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.distrito
CREATE TABLE IF NOT EXISTS `distrito` (
  `cod_distrito` int(11) NOT NULL,
  `distrito` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_distrito`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.escalafon
CREATE TABLE IF NOT EXISTS `escalafon` (
  `esc_cod` int(11) NOT NULL AUTO_INCREMENT,
  `esc_exp` int(11) NOT NULL,
  `esc_trabajador` int(11) NOT NULL,
  `esc_dni` char(8) DEFAULT NULL,
  `esc_ape_pat` varchar(255) DEFAULT NULL,
  `esc_ape_mat` varchar(255) DEFAULT NULL,
  `esc_nombres` varchar(255) DEFAULT NULL,
  `esc_tipo_trabajador` varchar(255) DEFAULT NULL,
  `esc_subtipo_trabajador` varchar(255) DEFAULT NULL,
  `esc_cargo_trabajador` varchar(255) DEFAULT NULL,
  `esc_categoria` varchar(255) DEFAULT NULL,
  `esc_colegio` varchar(255) DEFAULT NULL,
  `esc_registro` date DEFAULT NULL,
  `esc_inicio` date DEFAULT NULL,
  `esc_fin` date DEFAULT NULL,
  `esc_total` int(11) DEFAULT NULL,
  `permiso` int(11) NOT NULL,
  `esc_codigo_permiso` varchar(255) DEFAULT NULL,
  `tipo_permiso` int(11) NOT NULL,
  PRIMARY KEY (`esc_cod`),
  KEY `fk_escalafon_permiso1_idx` (`permiso`),
  KEY `fk_escalafon_tipo_permiso1_idx` (`tipo_permiso`),
  KEY `fk_escalafon_trabajador1_idx` (`esc_trabajador`),
  CONSTRAINT `fk_escalafon_permiso1` FOREIGN KEY (`permiso`) REFERENCES `permiso` (`cod_permiso`),
  CONSTRAINT `fk_escalafon_tipo_permiso1` FOREIGN KEY (`tipo_permiso`) REFERENCES `tipo_permiso` (`cod_tipo_permiso`),
  CONSTRAINT `fk_escalafon_trabajador1` FOREIGN KEY (`esc_trabajador`) REFERENCES `trabajador` (`cod_trabajador`)
) ENGINE=InnoDB AUTO_INCREMENT=3608 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.estado
CREATE TABLE IF NOT EXISTS `estado` (
  `cod_estado` int(11) NOT NULL AUTO_INCREMENT,
  `estado` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.gestion
CREATE TABLE IF NOT EXISTS `gestion` (
  `cod_gestion` int(11) NOT NULL,
  `gestion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_gestion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.institucion
CREATE TABLE IF NOT EXISTS `institucion` (
  `cod_mod` varchar(255) NOT NULL,
  `institucion` varchar(255) DEFAULT NULL,
  `distrito` int(11) NOT NULL,
  `zona` int(11) NOT NULL,
  `tipo_institucion` int(11) NOT NULL,
  `gestion` int(11) NOT NULL,
  `eib` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_mod`),
  KEY `fk_institucion_zona1_idx` (`zona`),
  KEY `fk_institucion_tipo_institucion1_idx` (`tipo_institucion`),
  KEY `fk_institucion_gestion1_idx` (`gestion`),
  KEY `fk_institucion_distrito1_idx` (`distrito`),
  CONSTRAINT `fk_institucion_distrito1` FOREIGN KEY (`distrito`) REFERENCES `distrito` (`cod_distrito`),
  CONSTRAINT `fk_institucion_gestion1` FOREIGN KEY (`gestion`) REFERENCES `gestion` (`cod_gestion`),
  CONSTRAINT `fk_institucion_tipo_institucion1` FOREIGN KEY (`tipo_institucion`) REFERENCES `tipo_institucion` (`cod_tipo_institucion`),
  CONSTRAINT `fk_institucion_zona1` FOREIGN KEY (`zona`) REFERENCES `zona` (`cod_zona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.ley
CREATE TABLE IF NOT EXISTS `ley` (
  `cod_ley` int(11) NOT NULL,
  `ley` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_ley`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.nivel_edu
CREATE TABLE IF NOT EXISTS `nivel_edu` (
  `cod_nivel` int(11) NOT NULL,
  `nivel` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_nivel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.permiso
CREATE TABLE IF NOT EXISTS `permiso` (
  `cod_permiso` int(11) NOT NULL,
  `nom_permiso` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`cod_permiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.remunerciones
CREATE TABLE IF NOT EXISTS `remunerciones` (
  `rem_cod` int(11) NOT NULL AUTO_INCREMENT,
  `rem_exp` int(11) NOT NULL,
  `rem_trabajador` int(11) NOT NULL,
  `rem_dni` char(8) DEFAULT NULL,
  `rem_ape_pat` varchar(255) DEFAULT NULL,
  `rem_ape_mat` varchar(255) DEFAULT NULL,
  `rem_nombres` varchar(255) DEFAULT NULL,
  `rem_tipo_trabajador` varchar(255) DEFAULT NULL,
  `rem_subtipo_trabajador` varchar(255) DEFAULT NULL,
  `rem_cargo_trabajador` varchar(255) DEFAULT NULL,
  `rem_categoria` varchar(255) DEFAULT NULL,
  `rem_colegio` varchar(255) DEFAULT NULL,
  `rem_registro` date DEFAULT NULL,
  `rem_inicio` date DEFAULT NULL,
  `rem_fin` date DEFAULT NULL,
  `rem_total` int(11) DEFAULT NULL,
  `permiso` int(11) NOT NULL,
  `rem_cod_permiso` varchar(255) DEFAULT NULL,
  `tipo_permiso` int(11) NOT NULL,
  `rem_dias` int(11) DEFAULT NULL,
  `rem_pendientes` int(11) DEFAULT NULL,
  `rem_subcidio` int(11) NOT NULL,
  `rem_exp_dias` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rem_cod`),
  KEY `fk_remunerciones_subcidio1_idx` (`rem_subcidio`),
  KEY `fk_remunerciones_permiso1_idx` (`permiso`),
  KEY `fk_remunerciones_tipo_permiso1_idx` (`tipo_permiso`),
  KEY `fk_remunerciones_trabajador1_idx` (`rem_trabajador`),
  CONSTRAINT `fk_remunerciones_permiso1` FOREIGN KEY (`permiso`) REFERENCES `permiso` (`cod_permiso`),
  CONSTRAINT `fk_remunerciones_subcidio1` FOREIGN KEY (`rem_subcidio`) REFERENCES `subcidio` (`cod_subcidio`),
  CONSTRAINT `fk_remunerciones_tipo_permiso1` FOREIGN KEY (`tipo_permiso`) REFERENCES `tipo_permiso` (`cod_tipo_permiso`),
  CONSTRAINT `fk_remunerciones_trabajador1` FOREIGN KEY (`rem_trabajador`) REFERENCES `trabajador` (`cod_trabajador`)
) ENGINE=InnoDB AUTO_INCREMENT=1126 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.rol
CREATE TABLE IF NOT EXISTS `rol` (
  `cod_rol` int(11) NOT NULL,
  `nom_rol` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.subcidio
CREATE TABLE IF NOT EXISTS `subcidio` (
  `cod_subcidio` int(11) NOT NULL,
  `subcicio` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_subcidio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.subtipo_trabajador
CREATE TABLE IF NOT EXISTS `subtipo_trabajador` (
  `cod_subtipo` int(11) NOT NULL AUTO_INCREMENT,
  `subtipo_trabajador` varchar(255) DEFAULT NULL,
  `tipo_trabajador` int(11) NOT NULL,
  PRIMARY KEY (`cod_subtipo`),
  KEY `fk_subtipo_trabajador_tipo_trabajador_idx` (`tipo_trabajador`),
  CONSTRAINT `fk_subtipo_trabajador_tipo_trabajador` FOREIGN KEY (`tipo_trabajador`) REFERENCES `tipo_trabajador` (`cod_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.tipo_institucion
CREATE TABLE IF NOT EXISTS `tipo_institucion` (
  `cod_tipo_institucion` int(11) NOT NULL,
  `tipo_institucion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_tipo_institucion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.tipo_permiso
CREATE TABLE IF NOT EXISTS `tipo_permiso` (
  `cod_tipo_permiso` int(11) NOT NULL,
  `nom_tipo_permiso` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`cod_tipo_permiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.tipo_trabajador
CREATE TABLE IF NOT EXISTS `tipo_trabajador` (
  `cod_tipo` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_trabajador` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.trabajador
CREATE TABLE IF NOT EXISTS `trabajador` (
  `cod_trabajador` int(11) NOT NULL AUTO_INCREMENT,
  `dni` char(8) DEFAULT NULL,
  `ape_pat` varchar(255) DEFAULT NULL,
  `ape_mat` varchar(255) DEFAULT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `cod_plaza` varchar(255) DEFAULT NULL,
  `nivel_edu` int(11) NOT NULL,
  `tipo_trabajador` int(11) NOT NULL,
  `subtipo_trabajador` int(11) NOT NULL,
  `cargo_trabajador` int(11) NOT NULL,
  `categoria` int(11) NOT NULL,
  `estado` int(11) NOT NULL,
  `ley` int(11) NOT NULL,
  `distrito` int(11) NOT NULL,
  `institucion` varchar(255) NOT NULL,
  `jornada` int(11) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_final` date DEFAULT NULL,
  PRIMARY KEY (`cod_trabajador`),
  KEY `fk_trabajador_tipo_trabajador1_idx` (`tipo_trabajador`),
  KEY `fk_trabajador_subtipo_trabajador1_idx` (`subtipo_trabajador`),
  KEY `fk_trabajador_cargo_trabajador1_idx` (`cargo_trabajador`),
  KEY `fk_trabajador_nivel_edu1_idx` (`nivel_edu`),
  KEY `fk_trabajador_estado1_idx` (`estado`),
  KEY `fk_trabajador_categoria1_idx` (`categoria`),
  KEY `fk_trabajador_ley1_idx` (`ley`),
  KEY `fk_trabajador_distrito1_idx` (`distrito`),
  KEY `fk_trabajador_institucion1_idx` (`institucion`),
  CONSTRAINT `fk_trabajador_cargo_trabajador1` FOREIGN KEY (`cargo_trabajador`) REFERENCES `cargo_trabajador` (`cod_cargo`),
  CONSTRAINT `fk_trabajador_categoria1` FOREIGN KEY (`categoria`) REFERENCES `categoria` (`cod_categoria`),
  CONSTRAINT `fk_trabajador_distrito1` FOREIGN KEY (`distrito`) REFERENCES `distrito` (`cod_distrito`),
  CONSTRAINT `fk_trabajador_estado1` FOREIGN KEY (`estado`) REFERENCES `estado` (`cod_estado`),
  CONSTRAINT `fk_trabajador_institucion1` FOREIGN KEY (`institucion`) REFERENCES `institucion` (`cod_mod`),
  CONSTRAINT `fk_trabajador_ley1` FOREIGN KEY (`ley`) REFERENCES `ley` (`cod_ley`),
  CONSTRAINT `fk_trabajador_nivel_edu1` FOREIGN KEY (`nivel_edu`) REFERENCES `nivel_edu` (`cod_nivel`),
  CONSTRAINT `fk_trabajador_subtipo_trabajador1` FOREIGN KEY (`subtipo_trabajador`) REFERENCES `subtipo_trabajador` (`cod_subtipo`),
  CONSTRAINT `fk_trabajador_tipo_trabajador1` FOREIGN KEY (`tipo_trabajador`) REFERENCES `tipo_trabajador` (`cod_tipo`)
) ENGINE=InnoDB AUTO_INCREMENT=6889 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `cod_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(255) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `rol` int(11) DEFAULT NULL,
  `dni` varchar(8) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`cod_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- Volcando estructura para tabla data_base_ugel.zona
CREATE TABLE IF NOT EXISTS `zona` (
  `cod_zona` int(11) NOT NULL,
  `zona` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cod_zona`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
