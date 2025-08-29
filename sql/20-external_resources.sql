CREATE TABLE IF NOT EXISTS external_resources (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    url_hash CHAR(64) NOT NULL UNIQUE,
    type external_resource_type NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_external_resources_project_id FOREIGN KEY (project_id) REFERENCES projects(id)
);
CREATE TRIGGER trg_external_resources_updated_at
BEFORE UPDATE ON external_resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();