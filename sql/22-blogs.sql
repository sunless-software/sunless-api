CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    project_id INT,
    title_us TEXT NOT NULL,
    body_us TEXT NOT NULL,
    title_es TEXT,
    body_es TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_blogs_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_blogs_project_id FOREIGN KEY (project_id) REFERENCES projects(id)
);
CREATE TRIGGER trg_blogs_updated_at
BEFORE UPDATE ON blogs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();