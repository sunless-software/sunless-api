CREATE TABLE IF NOT EXISTS projects_media (
    id SERIAL PRIMARY KEY,
    url TEXT,
    type_id INT,
    project_id INT NOT NULL,
    deleted BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_projects_media_type_id FOREIGN KEY (type_id) REFERENCES media_types(id),
    CONSTRAINT FK_projects_media_project_id FOREIGN KEY (project_id) REFERENCES projects(id)
);
CREATE TRIGGER trg_projects_media_updated_at
BEFORE UPDATE ON projects_media
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();