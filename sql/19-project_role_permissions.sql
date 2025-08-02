CREATE TABLE IF NOT EXISTS project_role_permissions (
    project_role_id INT,
    permission_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_role_id, permission_id),
    CONSTRAINT FK_project_role_permissions_project_role_id FOREIGN KEY (project_role_id) REFERENCES project_roles(id),
    CONSTRAINT FK_project_role_permissions_permission_id FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
CREATE TRIGGER trg_project_role_permissions_updated_at
BEFORE UPDATE ON project_role_permissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();