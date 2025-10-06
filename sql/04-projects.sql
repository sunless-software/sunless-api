CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_hash CHAR(64) NOT NULL,
    short_description_us TEXT,
    long_description_us TEXT,
    short_description_es TEXT,
    long_description_es TEXT,
    logo TEXT,
    status project_status NOT NULL,
    public BOOLEAN NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    estimated_end DATE,
    key TEXT NOT NULL UNIQUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS projects_name_hash_active_key
ON projects(name_hash)
WHERE deleted = FALSE;

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();