const express = require("express");
const router = express.Router();
const pool = require("../helpers/db");
const room = require("../helpers/room");
const { route } = require(".");

router.all('/', function (req, res, next) {
  res.json("It works!");  
});

// creates a game 
router.post('/create-game', async function (req, res, next) {
  try {
    // set the game cookie
    let SID = req.session.SID;
    req.session.name = req.body.name;
    let code = room.generateRoomKey();

    // insert into database
    const newRoom = await pool.query(
    "INSERT INTO games (code, creator_id, admin_id, player_ids) VALUES ($1, $2, $2, $3) RETURNING *", 
    [code, SID, `{${SID}}`]);

    console.log(newRoom.rows[0]);
    res.json(newRoom.rows[0]);
  } catch (err) {
    console.error("Error INSERTING INTO:" + err);
  }
});

// adds 
router.put('/join-game/:gameId', async function (req, res, next) {
  req.session.name = req.body.name;
  try {
    // add session id to database
    const update = await pool.query("UPDATE games SET player_ids = array_append(player_ids, $1) WHERE state = 0 AND code = $2 RETURNING *",
    [req.session.SID, req.params.gameId]);
    res.json(update.rows);
  } catch (error) {
    console.error("Could not put " + error);
  }
})

// gets a specific game's information
router.get('/games/:gameId', async function (req, res, next) {
  try {
    let q = await pool.query("SELECT * FROM games WHERE code=$1", [req.params.gameId]);
    console.log(`Got ${req.params.gameId}`)
    res.json(q.rows[q.rows.length - 1]);
  } catch (error) {
    console.error("Error getting game information. " + error);
  }
});

router.delete('/games/:gameID', async function (req, res, next) {
  res.json("todo");
});

module.exports = router;
