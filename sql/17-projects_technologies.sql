CREATE TABLE IF NOT EXISTS projects_technologies (
    project_id INT,
    technology_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, technology_id),
    CONSTRAINT FK_projects_technologies_project_id FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT FK_projects_technologies_technology_id FOREIGN KEY (technology_id) REFERENCES technologies(id)
);
CREATE TRIGGER trg_projects_technologies_updated_at
BEFORE UPDATE ON projects_technologies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();