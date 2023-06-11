/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:3306
 Source Schema         : xiangqi

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 10/06/2023 23:32:14
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for endgames
-- ----------------------------
DROP TABLE IF EXISTS `endgames`;
CREATE TABLE `endgames`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `arrangement` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of endgames
-- ----------------------------
INSERT INTO `endgames` VALUES (1, 'Opening', 'opening', 'chariot,red,9,0;horse,red,9,1;elephant,red,9,2;advisor,red,9,3;general,red,9,4;advisor,red,9,5;elephant,red,9,6;horse,red,9,7;chariot,red,9,8;cannon,red,7,1;cannon,red,7,7;pawn,red,6,0;pawn,red,6,2;pawn,red,6,4;pawn,red,6,6;pawn,red,6,8;pawn,black,3,0;pawn,black,3,2;pawn,black,3,4;pawn,black,3,6;pawn,black,3,8;cannon,black,2,1;cannon,black,2,7;chariot,black,0,0;horse,black,0,1;elephant,black,0,2;advisor,black,0,3;general,black,0,4;advisor,black,0,5;elephant,black,0,6;horse,black,0,7;chariot,black,0,8');
INSERT INTO `endgames` VALUES (2, 'Everlasting Life', '', 'chariot,black,0,4;general,black,0,5;pawn,red,1,3;elephant,black,2,4;pawn,red,2,5;pawn,black,7,4;cannon,red,7,8;pawn,black,8,3;pawn,black,8,5;horse,black,7,7;chariot,red,7,8;general,red,9,4;chariot,red,9,6');

SET FOREIGN_KEY_CHECKS = 1;
