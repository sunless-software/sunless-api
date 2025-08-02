CREATE TABLE IF NOT EXISTS global_role_permissions (
    global_role_id INT,
    permission_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (global_role_id, permission_id),
    CONSTRAINT FK_global_role_permissions_global_role_id FOREIGN KEY (global_role_id) REFERENCES global_roles(id),
    CONSTRAINT FK_global_role_permissions_permission_id FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
CREATE TRIGGER trg_global_role_permissions_updated_at
BEFORE UPDATE ON global_role_permissions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();