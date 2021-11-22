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

INSERT INTO users
  VALUES    ('johnDoe123', 'password1', 'John', 'Doe', '1234567890', CURRENT_TIMESTAMP, null),
            ('janeSmith123', 'password2', 'Jane', 'Smith', '0987654321', CURRENT_TIMESTAMP, null),
            ('chadMcChaddy321', 'chadword', 'Chad', 'McChaddy', '6543217890', CURRENT_TIMESTAMP, null);

INSERT INTO messages (from_username, to_username, body, sent_at, read_at)
  VALUES ('johnDoe123', 'janeSmith123', 'I love you!', CURRENT_TIMESTAMP, null),
         ('johnDoe123', 'janeSmith123', 'I REALLY love you!', CURRENT_TIMESTAMP, null),
         ('janeSmith123', 'johnDoe123', 'Im sorry but Im not interested!', CURRENT_TIMESTAMP, null),
         ('janeSmith123', 'chadMcChaddy321', 'But I do love you.', CURRENT_TIMESTAMP, null);