-- Create Database
CREATE DATABASE IF NOT EXISTS Imedtag;
USE Imedtag;

-- ========================
-- User Table
-- ========================
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- ========================
-- Project Table
-- ========================
CREATE TABLE Project (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    tag VARCHAR(100),
    type VARCHAR(100),
    labeled_status BOOLEAN DEFAULT FALSE,
    favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- ========================
-- Image Table
-- ========================
CREATE TABLE Image (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    image_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(512) NOT NULL,
    labeled_status TINYINT(1) DEFAULT 0,
    width INT NOT NULL,
    height INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- ========================
-- Project-Image Junction Table
-- ========================
CREATE TABLE ProjectImage (
    project_image_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_id INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES Image(image_id) ON DELETE CASCADE
);

-- ========================
-- Label Table
-- ========================
CREATE TABLE Label (
    label_id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    label_name VARCHAR(100) NOT NULL,
    label_color VARCHAR(50),
    label_category VARCHAR(100) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE
);

-- ========================
-- Image-Label Junction Table
-- ========================
CREATE TABLE ImageLabel (
    imagelabel_id INT AUTO_INCREMENT PRIMARY KEY,
    image_id INT NOT NULL,
    label_id INT NOT NULL,
    FOREIGN KEY (image_id) REFERENCES Image(image_id) ON DELETE CASCADE,
    FOREIGN KEY (label_id) REFERENCES Label(label_id) ON DELETE CASCADE
);

-- ========================
-- Annotation Table
-- ========================
CREATE TABLE Annotation (
    annotation_id INT AUTO_INCREMENT PRIMARY KEY,
    imagelabel_id INT NOT NULL,
    x_min FLOAT NOT NULL,
    x_max FLOAT NOT NULL,
    y_min FLOAT NOT NULL,
    y_max FLOAT NOT NULL,
    segmentation TEXT DEFAULT NULL,
    FOREIGN KEY (imagelabel_id) REFERENCES ImageLabel(imagelabel_id) ON DELETE CASCADE
);

-- ========================
-- Data Fix: File Path Backfill
-- ========================
SET SQL_SAFE_UPDATES = 0;
UPDATE Image 
SET file_path = CONCAT('/uploads/', image_name)
WHERE (file_path IS NULL OR file_path = '') 
  AND image_name IS NOT NULL;
SET SQL_SAFE_UPDATES = 1;
