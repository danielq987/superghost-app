-- CREATE TABLE users (
--   user_id SERIAL NOT NULL PRIMARY KEY,
--   username VARCHAR(25) UNIQUE NOT NULL,
--   password_hash VARCHAR(255) NOT NULL,
--   email UNIQUE VARCHAR(50) NOT NULL,
--   created_on TIMESTAMP NOT NULL,
-- )

CREATE TABLE games (
  game_id SERIAL NOT NULL PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  created_on TIMESTAMP NOT NULL,
  creator_id VARCHAR(20) NOT NULL,
  admin_id VARCHAR(20) NOT NULL,
  player_ids VARCHAR(20) []
)