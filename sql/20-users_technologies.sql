CREATE TABLE IF NOT EXISTS users_technologies (
    user_id INT,
    technology_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, technology_id),
    CONSTRAINT FK_users_technologies_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_users_technologies_technology_id FOREIGN KEY (technology_id) REFERENCES technologies(id)
);
CREATE TRIGGER trg_users_technologies_updated_at
BEFORE UPDATE ON users_technologies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();