-- Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS warranty_db;

-- Use the newly created database
USE warranty_db;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    userEmail VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(100) DEFAULT NULL,
    userAddress TEXT,
    userPhoneNumber VARCHAR(20) DEFAULT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY username (username),
    UNIQUE KEY email (userEmail)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create the warranties table
CREATE TABLE IF NOT EXISTS warranties (
    warrantyId INT NOT NULL AUTO_INCREMENT,
    productName VARCHAR(255) NOT NULL,
    dateOfPurchase DATE NOT NULL,
    warrantyExpireDate DATE NOT NULL,
    userId INT DEFAULT NULL,
    pdfFilePath VARCHAR(255) DEFAULT NULL,
    sellersEmail VARCHAR(255) NOT NULL,
    notified TINYINT(1) NOT NULL DEFAULT '0',
    PRIMARY KEY (warrantyId),
    KEY fk_user (userId),
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;