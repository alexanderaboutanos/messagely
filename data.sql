DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    phone text NOT NULL,
    join_at timestamp without time zone NOT NULL,
    last_login_at timestamp with time zone
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    from_username text NOT NULL REFERENCES users,
    to_username text NOT NULL REFERENCES users,
    body text NOT NULL,
    sent_at timestamp with time zone NOT NULL,
    read_at timestamp with time zone
);

/** IF YOU WANT TO SEED DATA**/

-- with a single round of bcrypt work factor, I used the following three passwords to generate these hashed passwords: password1, password 2, password3
INSERT INTO users
  VALUES    ('johnDoe123', '$2a$04$.EYyUFn8tLfx84dGgZfYKuQ9jp9pSVNWCPh8RCFJJolWnwDQPu0dW', 'John', 'Doe', '1234567890', CURRENT_TIMESTAMP, null),
            ('janeSmith123', '$2a$04$79iBGX7rfU6P.W7RngGAnOptCejoOxgYeXUw6O5UrY5a6E/Bpmg3y', 'Jane', 'Smith', '0987654321', CURRENT_TIMESTAMP, null),
            ('chadMcChaddy321', '$2a$04$NHhVPjZg/UIU37izdDmbkOOCqaFXgIQPczcOuHNppa4mXB./jlqxO', 'Chad', 'McChaddy', '6543217890', CURRENT_TIMESTAMP, null);

INSERT INTO messages (from_username, to_username, body, sent_at, read_at)
  VALUES ('johnDoe123', 'janeSmith123', 'I love you!', CURRENT_TIMESTAMP, null),
         ('johnDoe123', 'janeSmith123', 'I REALLY love you!', CURRENT_TIMESTAMP, null),
         ('janeSmith123', 'johnDoe123', 'Im sorry but Im not interested!', CURRENT_TIMESTAMP, null),
         ('janeSmith123', 'chadMcChaddy321', 'But I do love you.', CURRENT_TIMESTAMP, null);