CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    rol_id INT REFERENCES global_roles(id),
    username VARCHAR(50) NOT NULL CHECK (char_length(username) >= 3),
    password TEXT NOT NULL,
    profile_photo TEXT,
    phone text,
    email VARCHAR(50),
    short_description_us VARCHAR(80),
    short_description_es VARCHAR(80),
    job_title VARCHAR(60) NOT NULL,
    public BOOLEAN NOT NULL,
    banned BOOLEAN NOT NULL,
    deleted BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS users_username_active_key
ON users(username)
WHERE deleted = FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_active_key
ON users(email)
WHERE deleted = FALSE;

CREATE INDEX IF NOT EXISTS idx_users_username_trgm
ON users USING gin (username gin_trgm_ops);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();