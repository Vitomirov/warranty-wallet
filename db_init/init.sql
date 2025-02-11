CREATE DATABASE IF NOT EXISTS warranty_db;
USE warranty_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    userEmail VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(100),
    userAddress TEXT,
    userPhoneNumber VARCHAR(20)
);

CREATE TABLE warranties (
    warrantyId INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(255) NOT NULL,
    dateOfPurchase DATE NOT NULL,
    warrantyExpireDate DATE NOT NULL,
    userId INT NOT NULL,
    pdfFilePath VARCHAR(255),
    sellersEmail VARCHAR(255),
    FOREIGN KEY (userId) REFERENCES users(id)
);
