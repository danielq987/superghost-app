const express = require("express");
const router = express.Router();
const db = require("../helpers/db");
const room = require("../helpers/room");
const { route } = require(".");

router.all('/', function (req, res, next) {
  res.json("It works!");  
});

// creates a game 
router.post('/create-game', function (req, res, next) {
  // set cookies
  req.session.name = req.body.name;

  let SID = req.session.SID;
  let code = room.generateRoomKey();

  // insert into database and return as json
  db.createRoom(code, SID).then(response => res.json(response)).catch(err => console.error(error));

});

// adds 
router.put('/join-game/:gameId', function (req, res, next) {
  req.session.name = req.body.name;
  // add session id to database
  db.addPlayerToGame(req.params.gameId, req.session.SID).then(response => res.json(response));
  
})

// gets a specific game's information
router.get('/games/:gameId', function (req, res, next) {
  db.getGameInfo(req.params.gameId).then(response => res.json(response));
});

router.delete('/games/:gameID', async function (req, res, next) {
  res.json("todo");
});

module.exports = router;
