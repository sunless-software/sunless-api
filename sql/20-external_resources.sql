CREATE TABLE IF NOT EXISTS external_resources (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_external_resources_id FOREIGN KEY (id) REFERENCES projects(id)
);
CREATE TRIGGER trg_external_resources_updated_at
BEFORE UPDATE ON external_resources
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();