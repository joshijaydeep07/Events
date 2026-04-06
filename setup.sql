-- ============================================================
--  UniEvents — PostgreSQL Setup Script (OPTIONAL)
--  The server.js auto-creates this — run manually only if needed
-- ============================================================

-- Run this in psql as superuser:
CREATE DATABASE unievents;
\c unievents;

CREATE TABLE IF NOT EXISTS registrations (
  id          SERIAL PRIMARY KEY,
  full_name   VARCHAR(150)  NOT NULL,
  student_id  VARCHAR(50)   NOT NULL,
  email       VARCHAR(200)  NOT NULL,
  event_name  VARCHAR(150)  NOT NULL,
  department  VARCHAR(100)  NOT NULL,
  phone       VARCHAR(20)   NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Sample data (optional)
INSERT INTO registrations (full_name, student_id, email, event_name, department, phone) VALUES
  ('Arjun Mehta',  'STU-2024-001', 'arjun@uni.edu', 'Tech Fest 2025',          'Computer Science',      '+91 9876543210'),
  ('Priya Sharma', 'STU-2024-002', 'priya@uni.edu', 'Cloud Computing Workshop', 'Information Technology','+91 9123456789'),
  ('Rohan Patel',  'STU-2024-003', 'rohan@uni.edu', 'Cultural Evening',         'Management',            '+91 9988776655');
