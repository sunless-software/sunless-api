CREATE TABLE IF NOT EXISTS users_skills (
    user_id INT,
    skill_id INT,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, skill_id),
    CONSTRAINT FK_users_skills_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_users_skills_skill_id FOREIGN KEY (skill_id) REFERENCES skills(id)
);
CREATE TRIGGER trg_users_skills_updated_at
BEFORE UPDATE ON users_skills
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();