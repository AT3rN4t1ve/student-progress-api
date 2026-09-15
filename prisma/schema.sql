-- Student Progress Management API
-- Raw SQL schema (MySQL) — equivalent to prisma/schema.prisma
-- This file is provided for reference / manual setup.
-- Normally the schema is created via `npm run prisma:migrate`.

CREATE DATABASE IF NOT EXISTS student_progress_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_progress_db;

CREATE TABLE IF NOT EXISTS students (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  phone      VARCHAR(50)  NULL,
  major      VARCHAR(255) NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS progresses (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject    VARCHAR(255) NOT NULL,
  status     ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
  note       TEXT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  CONSTRAINT fk_progress_student
    FOREIGN KEY (student_id) REFERENCES students(id)
    ON DELETE CASCADE,
  CONSTRAINT uq_student_subject UNIQUE (student_id, subject),
  INDEX idx_progress_status (status)
) ENGINE=InnoDB;
