CREATE TABLE IF NOT EXISTS collaborators (
    project_id INT,
    user_id INT,
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (project_id, user_id),
    CONSTRAINT FK_collaborators_project_id FOREIGN KEY (project_id) REFERENCES projects(id),
    CONSTRAINT FK_collaborators_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_collaborators_role_id FOREIGN KEY (role_id) REFERENCES project_roles(id)
);
CREATE TRIGGER trg_collaborators_updated_at
BEFORE UPDATE ON collaborators
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();