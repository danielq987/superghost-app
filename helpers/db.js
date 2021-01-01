/* Set up database */

const { Pool } = require('pg');
const url = require('url')

const params = new URL(process.env.DATABASE_URL);

const config = {
  user: params.username,
  password: params.password,
  host: params.hostname,
  port: params.port,
  database: params.pathname.substring(1),
  ssl: { rejectUnauthorized: false }
}

console.log(process.env.DATABASE_URL);

const pool = new Pool(config);

/* Common Database Querying Functions */

async function getActiveCodes(state) {
  let activeCodes = await pool.query("SELECT code FROM games WHERE state = 0 OR state = 1");
  let codeArray = [];
  for (i of activeCodes.rows) {
    codeArray.push(i.code);
  }
  return codeArray;
}

async function createRoom(code, creatorSID) {
  const newRoom = await pool.query(
    "INSERT INTO games (code, creator_id, admin_id, player_ids) VALUES ($1, $2, $2, $3) RETURNING *", 
    [code, creatorSID, `{${creatorSID}}`]);
  return newRoom.rows[0];
}

async function addPlayerToGame(code, playerSID) {
  try {
    const update = await pool.query("UPDATE games SET player_ids = array_append(player_ids, $1) WHERE state = 0 AND code = $2 RETURNING *",
    [playerSID, code]);
    return update.rows;
  } catch (error) {
    console.error("Error adding player to game. " + error);
  }
}

async function getGameInfo(code) {
  try {
    const gameInfo = await pool.query("SELECT * FROM games WHERE code=$1", [code]);
    return gameInfo.rows[gameInfo.rows.length - 1];
  } catch (error) {
    console.error("Error getting game information. " + error);
  }
}

async function updateWord(newWord, code) {
  try {
    const update = await pool.query("UPDATE games SET current_word = $1 WHERE (state = 0 OR state = 1) AND code = $2 RETURNING *",
    [newWord, code]);
    return update.rows[0].current_word;
  } catch (error) {
    console.error("Error updating word. " + error);
  }
}

module.exports = {
  pool: pool,
  getActiveCodes: getActiveCodes,
  createRoom: createRoom,
  addPlayerToGame: addPlayerToGame,
  getGameInfo: getGameInfo,
  updateWord: updateWord
};