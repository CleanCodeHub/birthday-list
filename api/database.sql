-- Birthday Party RSVP Database Schema
-- Create this database and run this script on your MySQL server

CREATE DATABASE IF NOT EXISTS birthday_rsvp;
USE birthday_rsvp;

-- RSVP table
CREATE TABLE IF NOT EXISTS rsvps (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  adults INT DEFAULT 0,
  kids INT DEFAULT 0,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create default admin user (email: admin@birthday.com, password: admin123)
-- IMPORTANT: Change this password after first login!
INSERT INTO admin_users (email, password_hash)
VALUES ('admin@birthday.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE email=email;
