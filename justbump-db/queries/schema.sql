CREATE DATABASE IF NOT EXISTS jbdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER DATABASE jbdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE jbdb;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('jbuser', 'jbadmin') DEFAULT 'jbuser',
    email_verified TINYINT(1) DEFAULT 0,
    phone_number_verified TINYINT(1) DEFAULT 0,
    failed_attempts INT DEFAULT 0,
    lockout_until TIMESTAMP NULL DEFAULT NULL,
    last_login TIMESTAMP NULL DEFAULT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL,
    UNIQUE KEY email (email),
    INDEX idx_user_email (email),
    INDEX idx_user_phone (phone_number),
    CONSTRAINT fk_users_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_users_updated_by FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_users_deleted_by FOREIGN KEY (deleted_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE calling_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(100) DEFAULT NULL,
    company VARCHAR(100) DEFAULT NULL,
    headline VARCHAR(255) DEFAULT NULL,
    address TEXT,
    profile_image_url VARCHAR(512) DEFAULT NULL,
    bio_label VARCHAR(50) DEFAULT NULL,
    bio_text TEXT,
    contact_value VARCHAR(255) DEFAULT NULL,
    contact_action_type ENUM('call', 'message', 'both') DEFAULT 'both',
    bank_payment_provider VARCHAR(100) DEFAULT NULL,
    bank_account_name VARCHAR(100) DEFAULT NULL,
    bank_account_number VARCHAR(50) DEFAULT NULL,
    bank_branch_code VARCHAR(20) DEFAULT NULL,
    social_platform_name VARCHAR(50) DEFAULT NULL,
    social_handle VARCHAR(100) DEFAULT NULL,
    social_display_order INT DEFAULT 0,
    video_title VARCHAR(100) DEFAULT NULL,
    video_source TEXT,
    video_description TEXT,
    video_display_order INT DEFAULT 0,
    external_link_label VARCHAR(100) DEFAULT NULL,
    external_link_url VARCHAR(512) DEFAULT NULL,
    external_link_display_order INT DEFAULT 0,
    slug VARCHAR(50) NOT NULL,
    sharing_id CHAR(36) NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_by INT NULL,
    updated_by INT NULL,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    deleted_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY slug (slug),
    UNIQUE KEY sharing_id (sharing_id),
    UNIQUE KEY uq_calling_cards_user (user_id),
    CONSTRAINT calling_cards_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_cards_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_cards_updated_by FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_cards_deleted_by FOREIGN KEY (deleted_by) REFERENCES users (id) ON DELETE SET NULL
);

CREATE TABLE physical_cards (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    card_uid VARCHAR(100) NOT NULL,
    card_type VARCHAR(50) DEFAULT 'generic',
    created_by INT NULL,
    updated_by INT NULL,
    deleted_by INT NULL,
    calling_card_id INT NULL,
    status ENUM('unassigned', 'assigned', 'active', 'blocked') DEFAULT 'unassigned',
    assigned_at TIMESTAMP NULL DEFAULT NULL,
    activated_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    UNIQUE KEY uq_physical_cards_uid (card_uid),
    INDEX idx_physical_cards_created_by (created_by),
    INDEX idx_physical_cards_updated_by (updated_by),
    INDEX idx_physical_cards_deleted_by (deleted_by),
    INDEX idx_physical_cards_calling_card (calling_card_id),
    CONSTRAINT fk_physical_cards_created_by FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_physical_cards_updated_by FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_physical_cards_deleted_by FOREIGN KEY (deleted_by) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_physical_cards_calling_card FOREIGN KEY (calling_card_id) REFERENCES calling_cards (id) ON DELETE SET NULL
);

CREATE TABLE card_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    viewer_ip VARCHAR(45) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_analytics_card (card_id),
    CONSTRAINT fk_analytics_card FOREIGN KEY (card_id) REFERENCES calling_cards (id) ON DELETE CASCADE
);

CREATE TABLE connections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT NOT NULL,
    visitor_name VARCHAR(100) NOT NULL,
    visitor_email VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_connections_card (card_id),
    CONSTRAINT fk_connections_card FOREIGN KEY (card_id) REFERENCES calling_cards (id) ON DELETE CASCADE
);


