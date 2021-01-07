/* Set up database */

require('dotenv').config();

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
  let activeCodes = await pool.query("SELECT code FROM games WHERE state = 0 or state = 1");
  let codeArray = [];
  for (i of activeCodes.rows) {
    codeArray.push(i.code);
  }
  return codeArray;
}

async function createRoom(code, creatorSID, name) {
  try {
    const newRooms = await pool.query(
      "INSERT INTO games (code, creator_id, player_info) VALUES ($1, $2, $3) RETURNING *", 
      [code, creatorSID, `{ "${creatorSID}" : {"name": "${name}", "points": 0}}`]);
    return newRooms.rows[0];
  } catch (error) {
    console.error("Error creating room. " + error)
  }
}

async function addPlayer(code, playerSID, name) {
  try {
    let { player_info : playerInfo } = await getGameByCode(code);
    playerInfo[playerSID] = {"name": name, "points": 0};
    const update = await pool.query("UPDATE games SET player_info = $1 WHERE state = 0 AND code = $2 RETURNING *",
    [JSON.stringify(playerInfo), code]);
    return update.rows;
  } catch (error) {
    console.error("Error adding player to game. " + error);
  }
}

async function removePlayer(code, name) {
  try {
    let { player_info : playerInfo } = await getGameByCode(code);
    for (SID in playerInfo) {
      if (playerInfo[SID].name == name) {
        delete playerInfo[SID];
        break;
      }
    }
    const update = await pool.query("UPDATE games SET player_info = $1 WHERE state = 0 AND code = $2 RETURNING *",
    [JSON.stringify(playerInfo), code]);
    return update.rows;
  } catch (error) {
    console.error("Error adding player to game. " + error);
  }
}

async function editSocketId(code, SID, socketId) {
  try {
    let { player_info : playerInfo } = await getGameByCode(code);
    console.log(playerInfo);
    playerInfo[SID].socketId = socketId;
    const update = await pool.query("UPDATE games SET player_info = $1 WHERE state = 0 AND code = $2 RETURNING *",
    [JSON.stringify(playerInfo), code]);
    return update.rows;
  } catch (error) {
    console.error("Error updating socketID. " + error);
  }
}

// returns the active game infowith a certain code
async function getGameByCode(code) {
  try {
    const gameInfo = await pool.query("SELECT * FROM games WHERE code=$1", [code]);
    return gameInfo.rows[gameInfo.rows.length - 1];
  } catch (error) {
    console.error("Error getting game information. " + error);
  }
}

async function changeState(gameId, state) {
  try {
    const update = await pool.query("UPDATE games SET state=$1 WHERE game_id=$2", [state, gameId]);
    return update.rows[0];
  } catch (error) {
    console.error("Error changing game state. " + error);
  }
}

async function startGame(code) {
  try {
    const { game_id: gameId } = await getGameByCode(code);
    const response = await changeState(gameId, 1);
    return response;
  } catch (error) {
    console.error("Error starting game." + error);
  }
}

async function endGame(code) {
  try {
    const { game_id: gameId } = await getGameByCode(code);
    const response = await changeState(gameId, 2);
    return response;
  } catch (error) {
    console.error("Error ending game." + error); 
  }
}

// updating the word with a new word
async function resetWord(code) {
  try {
    const update = await pool.query("UPDATE games SET current_word = '' WHERE (state = 0 OR state = 1) AND code = $1 RETURNING *",
    [code]);
    return update.rows[0].current_word;
  } catch (error) {
    console.error("Error updating word. " + error);
  }
}

// if position is negative, add letter before. if position is positive, add letter after.
async function addLetter(code, letter, position) {
  try {
    if (position < 0) {
      const update = await pool.query("UPDATE games SET current_word = $1 + current_word WHERE (state = 1) AND code = $2 RETURNING *",
      [letter, code]);
    } else {
      const update = await pool.query("UPDATE games SET current_word = current_word + $1 WHERE (state = 1) AND code = $2 RETURNING *",
      [letter, code]);
    }
    return update.rows[0].current_word;
  } catch (error) {
    console.error("Could not add letter. " + error);
  }
}

async function incrementTurn(code) {
  try {
    const update = await pool.query("UPDATE games SET turn_index=turn_index+1 WHERE code=$1 AND state=1", [code]);
    return update.rows[0].turn_index;
  } catch (error) {
    console.error("Could not increment the turn.");
  }
}

module.exports = {
  pool: pool,
  getActiveCodes: getActiveCodes,
  createRoom: createRoom,
  addPlayer: addPlayer,
  removePlayer: removePlayer,
  editSocketId: editSocketId,
  getGameByCode: getGameByCode,
  resetWord: resetWord,
  addLetter: addLetter,
  startGame: startGame,
  endGame: endGame,
  incrementTurn: incrementTurn
};