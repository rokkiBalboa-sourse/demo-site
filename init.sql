-- PostgreSQL Schema and Seed Data for SudoStudy Student Reporting Service
-- Specialty 09.02.06 "Network and System Administration"
-- Structure: 3 Modules, 32 Tasks (11 in Mod 1, 11 in Mod 2, 10 in Mod 3)

-- 1. Types & Enums
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE submission_status AS ENUM ('pending', 'reviewed', 'rejected');

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(128) NOT NULL,
    group_name VARCHAR(32) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_group ON users(group_name);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(64) NOT NULL UNIQUE,
    module_id VARCHAR(32) NOT NULL, -- 'module-1', 'module-2', 'module-3'
    task_number INTEGER NOT NULL,   -- 1..11
    title VARCHAR(128) NOT NULL,
    module_code VARCHAR(32) NOT NULL, -- 'Модуль 1', 'Модуль 2', 'Модуль 3'
    description TEXT,
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    theory JSONB NOT NULL DEFAULT '[]'::jsonb,
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    script_command TEXT NOT NULL,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    max_score INTEGER NOT NULL DEFAULT 10,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_module ON tasks(module_id);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks(order_index);

-- 4. Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE RESTRICT,
    log_output TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    status submission_status NOT NULL DEFAULT 'pending',
    score INTEGER CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    is_passed BOOLEAN DEFAULT NULL,
    feedback TEXT,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMPTZ,
    
    CONSTRAINT uq_user_task UNIQUE (user_id, task_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_task_id ON submissions(task_id);

-- 5. Seed Users
INSERT INTO users (id, username, password_hash, full_name, group_name, role) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'admin', 'admin123', 'Кузнецов Валерий Сергеевич', 'STAFF', 'admin'),
    ('a0000000-0000-0000-0000-000000000002', 'ivanov', 'student123', 'Иванов Иван Иванович', '9СА-421', 'student'),
    ('a0000000-0000-0000-0000-000000000003', 'petrov', 'student123', 'Петров Алексей Владимирович', '9СА-421', 'student'),
    ('a0000000-0000-0000-0000-000000000004', 'alekseev', 'student123', 'Алексеев Максим Дмитриевич', '9СА-421', 'student'),
    ('a0000000-0000-0000-0000-000000000005', 'sidorov', 'student123', 'Сидоров Денис Михайлович', '9СА-42', 'student'),
    ('a0000000-0000-0000-0000-000000000006', 'smirnov', 'student123', 'Смирнов Кирилл Павлович', '9СА-42', 'student'),
    ('a0000000-0000-0000-0000-000000000007', 'fedorov', 'student123', 'Федоров Роман Игоревич', '9СА-42', 'student')
ON CONFLICT (username) DO NOTHING;
