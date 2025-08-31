CREATE TABLE IF NOT EXISTS projects_media (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    type media_type NOT NULL,
    project_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_projects_media_project_id FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT projects_media_url_project_key UNIQUE (project_id, url)
);
CREATE TRIGGER trg_projects_media_updated_at
BEFORE UPDATE ON projects_media
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();