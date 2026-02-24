CREATE DATABASE IF NOT EXISTS just_bump_db;

USE just_bump_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    account_type ENUM('personal', 'business') DEFAULT 'personal',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_phone (phone_number)
);

CREATE TABLE calling_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(100),
    company VARCHAR(100),
    headline VARCHAR(255),
    address TEXT,
    profile_image_url VARCHAR(512),
    slug VARCHAR(50) NOT NULL UNIQUE,
    sharing_id CHAR(36) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_card_slug (slug),
    INDEX idx_card_sharing (sharing_id)
);

CREATE TABLE card_bios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    label VARCHAR(50) NOT NULL,
    bio_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES calling_cards (id) ON DELETE CASCADE,
    INDEX idx_bio_card (card_id)
);

CREATE TABLE card_contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    contact_value VARCHAR(255) NOT NULL,
    action_type ENUM('call', 'message', 'both') DEFAULT 'both',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES calling_cards (id) ON DELETE CASCADE,
    INDEX idx_contacts_card (card_id)
);

CREATE TABLE card_banking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    payment_provider VARCHAR(100) NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    branch_code VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES calling_cards (id) ON DELETE CASCADE,
    INDEX idx_banking_card (card_id)
);

CREATE TABLE card_socials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    platform_name VARCHAR(50) NOT NULL,
    handle VARCHAR(100) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES calling_cards (id) ON DELETE CASCADE,
    INDEX idx_socials_card (card_id)
);

CREATE TABLE card_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    video_source TEXT NOT NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES calling_cards (id) ON DELETE CASCADE,
    INDEX idx_videos_card (card_id)
);

CREATE TABLE card_external_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    label VARCHAR(100) NOT NULL,
    url VARCHAR(512) NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES calling_cards (id) ON DELETE CASCADE,
    INDEX idx_ext_links_card (card_id)
);

CREATE TABLE card_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    viewer_ip VARCHAR(45),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES calling_cards (id) ON DELETE CASCADE,
    INDEX idx_analytics_card (card_id)
);

CREATE TABLE connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    visitor_name VARCHAR(100) NOT NULL,
    visitor_email VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES calling_cards (id) ON DELETE CASCADE,
    INDEX idx_connections_card (card_id)
);


