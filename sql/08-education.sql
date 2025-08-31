CREATE TABLE IF NOT EXISTS educations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    institution VARCHAR(50) NOT NULL,
    field VARCHAR(60) NOT NULL,
    location VARCHAR(60) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_education_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TRIGGER trg_education_updated_at
BEFORE UPDATE ON educations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();