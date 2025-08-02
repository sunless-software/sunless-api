CREATE TABLE IF NOT EXISTS blogs_media (
    id SERIAL PRIMARY KEY,
    url TEXT,
    type_id INT,
    blog_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_blogs_media_type_id FOREIGN KEY (type_id) REFERENCES media_types(id),
    CONSTRAINT FK_blogs_media_blog_id FOREIGN KEY (blog_id) REFERENCES blogs(id)
);
CREATE TRIGGER trg_blogs_media_updated_at
BEFORE UPDATE ON blogs_media
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();