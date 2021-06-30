
-- CREATE TABLE users
-- (
--   id            SERIAL PRIMARY KEY       NOT NULL,
--   email         VARCHAR(255) UNIQUE      NOT NULL,
--   password      VARCHAR(255)             NOT NULL
-- );


-- CREATE TABLE urls
-- (
--   id             SERIAL PRIMARY KEY       NOT NULL,
--   short_url      VARCHAR(255) UNIQUE      NOT NULL,
--   long_url       VARCHAR(255) UNIQUE      NOT NULL,
--   user_id        VARCHAR(255) REFERENCES  users(id) ON DELETE CASCADE
-- );

DROP TABLE IF EXISTS urls CASCADE;   
CREATE TABLE urls
(
  id        SERIAL NOT NULL,
  short_url VARCHAR NULL    ,
  long_url  VARCHAR NULL    ,
  user_id   INTEGER NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users
(
  id       SERIAL NOT NULL,
  email    VARCHAR NULL    ,
  password VARCHAR NULL    ,
  PRIMARY KEY (id)
);

ALTER TABLE urls
  ADD CONSTRAINT FK_users_TO_urls
    FOREIGN KEY (user_id)
    REFERENCES users (id);

        
      