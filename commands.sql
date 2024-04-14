CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL, likes int DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('John Doe', 'https://example.com/blog1', 'First Blog');
INSERT INTO blogs (author, url, title) VALUES ('John Doe', 'https://example.com/blog2', 'Second Blog');