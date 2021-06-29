DROP TABLE IF EXISTS urls CASCADE;
CREATE TABLE urls
(
  id             SERIAL PRIMARY KEY       NOT NULL,
  short_url      VARCHAR(255) UNIQUE      NOT NULL,
  long_url       VARCHAR(255) UNIQUE      NOT NULL,
  user_id        VARCHAR(255) REFERENCES  users(id) ON DELETE CASCADE
);
