CREATE TABLE IF NOT EXISTS project_tags (
    tag_id INT,
    project_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tag_id, project_id),
    CONSTRAINT FK_project_tags_tag_id FOREIGN KEY (tag_id) REFERENCES tags(id),
    CONSTRAINT FK_project_tags_project_id FOREIGN KEY (project_id) REFERENCES projects(id)
);
CREATE TRIGGER trg_project_tags_updated_at
BEFORE UPDATE ON project_tags
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();