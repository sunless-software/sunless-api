CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    rol_id INT REFERENCES global_roles(id),
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    profile_photo TEXT,
    phone BIGINT,
    email VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();