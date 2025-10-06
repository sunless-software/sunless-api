CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    user_id INT,
    company_name VARCHAR(50) NOT NULL,
    role_us VARCHAR(60) NOT NULL,
    role_es VARCHAR(60),
    description_us VARCHAR(255) NOT NULL,
    description_es VARCHAR(255),
    location_us VARCHAR(255) NOT NULL,
    location_es VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    company_logo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_experiences_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TRIGGER trg_experiences_updated_at
BEFORE UPDATE ON experiences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();