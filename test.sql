CREATE TABLE users (
  user_id SERIAL NOT NULL PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE games (
  game_id SERIAL NOT NULL PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  created_on TIMESTAMP NOT NULL,
  creator_id VARCHAR(20) NOT NULL,
  admin_id VARCHAR(20) NOT NULL,
  player_ids VARCHAR(20) []
)

ALTER TABLE games
ALTER COLUMN created_on SET DEFAULT CURRENT_TIMESTAMP;

INSERT INTO games (code, creator_id, admin_id, player_ids)
  VALUES ('BBBBBB', 'A', 'A', '{"A"}');
