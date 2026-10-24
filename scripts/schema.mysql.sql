-- =============================================================================
-- SudoStudy (demo-practics) - MySQL Database Schema
-- UTF-8 (utf8mb4) support for Cyrillic student names, task logs, and emojis
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `demo_practics`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `demo_practics`;

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `group_name` VARCHAR(100) NOT NULL,
  `role` ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `two_factor_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `two_factor_secret` VARCHAR(128) NULL DEFAULT NULL,
  `two_factor_temp_secret` VARCHAR(128) NULL DEFAULT NULL,
  `created_at` VARCHAR(32) NOT NULL,
  `updated_at` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_username` (`username`),
  KEY `idx_users_group_name` (`group_name`),
  KEY `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: tasks
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` VARCHAR(64) NOT NULL,
  `slug` VARCHAR(128) NOT NULL,
  `module_id` VARCHAR(64) NOT NULL,
  `task_number` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `module_code` VARCHAR(64) NOT NULL,
  `description` TEXT NOT NULL,
  `assignment` TEXT NULL,
  `video_url` VARCHAR(512) NULL DEFAULT NULL,
  `nodes` JSON NULL,
  `theory` JSON NULL,
  `steps` JSON NULL,
  `script_command` TEXT NULL,
  `questions` JSON NULL,
  `max_score` INT NOT NULL DEFAULT 5,
  `order_index` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` VARCHAR(32) NOT NULL,
  `updated_at` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_tasks_slug` (`slug`),
  KEY `idx_tasks_module_id` (`module_id`),
  KEY `idx_tasks_order_index` (`order_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: submissions
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `task_id` VARCHAR(64) NOT NULL,
  `log_output` MEDIUMTEXT NOT NULL,
  `answers` JSON NOT NULL,
  `status` ENUM('pending', 'reviewed', 'rejected') NOT NULL DEFAULT 'pending',
  `score` INT NULL DEFAULT NULL,
  `is_passed` TINYINT(1) NULL DEFAULT NULL,
  `feedback` TEXT NULL DEFAULT NULL,
  `reviewed_by` VARCHAR(64) NULL DEFAULT NULL,
  `submitted_at` VARCHAR(32) NOT NULL,
  `reviewed_at` VARCHAR(32) NULL DEFAULT NULL,
  `allow_retake` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_submissions_user_task` (`user_id`, `task_id`),
  KEY `idx_submissions_user_id` (`user_id`),
  KEY `idx_submissions_task_id` (`task_id`),
  KEY `idx_submissions_status` (`status`),
  KEY `idx_submissions_reviewed_by` (`reviewed_by`),
  CONSTRAINT `fk_submissions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_submissions_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_submissions_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
