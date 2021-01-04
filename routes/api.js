const express = require("express");
const router = express.Router();
const db = require("../helpers/db");
const room = require("../helpers/room");

router.all('/', function (req, res, next) {
  res.json("It works!");  
});

// creates a game 
router.post('/create-game', function (req, res, next) {
  // set cookies
  let name = req.body.name;
  let SID = req.session.SID;
  let code = room.generateRoomKey();

  // insert into database and return as json
  db.createRoom(code, SID, name).then(response => res.json(response)).catch(err => console.error(err));
});

// adds 
router.put('/join-game/:code', function (req, res, next) {
  // add session id to database
  console.log(req.body.name + "name");
  db.addPlayer(req.params.code, req.session.SID, req.body.name).then(response => {console.log("aaa" + JSON.stringify(response)); res.json(response)});
})

router.put('/remove-player/:code', function (req, res, next) {
  // add session id to database
  db.removePlayer(req.params.code, req.body.name).then(response => res.json(response));
})

// gets a specific game's information
router.get('/games/:code', function (req, res, next) {
  db.getGameByCode(req.params.code).then(response => res.json(response));
});

router.get('/games/:code/players', function (req, res, next) {
  db.getGameByCode(req.params.code).then(response => res.json(response.player_info));
});

router.delete('/games/:code', async function (req, res, next) {
  res.json("todo");
});

module.exports = router;
