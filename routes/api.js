const express = require("express");
const router = express.Router();
const db = require("../helpers/db");
const room = require("../helpers/room");
const cookies = require("../helpers/cookies");
const { spawn } = require("child_process");

router.all("/", function (req, res, next) {
  res.json("It works!");
});

// creates a game, returns the game information
router.post("/create-game", function (req, res, next) {
  // set cookies
  let name = req.body.name;
  let SID = req.session.SID;
  let code = room.generateRoomKey();

  // insert into database and return as json
  db.createRoom(code, SID, name)
    .then((response) => res.json(response))
    .catch((err) => console.error(err));
});

// adds a player to the game, using the request's cookies and body
router.put("/join-game/:code", function (req, res, next) {
  // add session id to database
  console.log(req.body.name + "name");
  db.addPlayer(req.params.code, req.session.SID, req.body.name).then(
    (response) => {
      console.log("aaa" + JSON.stringify(response));
      res.json(response);
    }
  );
});

// kick a player from the room
router.put("/remove-player/:code", function (req, res, next) {
  // add session id to database
  db.removePlayer(req.params.code, req.body.name).then((response) =>
    res.json(response)
  );
});

// gets a specific game's information
router.get("/game/:code", function (req, res, next) {
  db.getGameByCode(req.params.code).then((response) => {
    response.current_player_SID = Object.keys(response.player_info).sort()[
      response.turn_index
    ];
    res.json(response);
  });
});

// get player infos of all players in the room
router.get("/game/:code/players", function (req, res, next) {
  db.getGameByCode(req.params.code).then((response) =>
    res.json(response.player_info)
  );
});

// get a specific player information, given their session id
router.get("/game/:code/player/:SID", function (req, res, next) {
  db.getGameByCode(req.params.code).then((response) => {
    res.json(response.player_info[SID]);
  });
});

router.get("/ai/:str", function (req, res, next) {
  let process = spawn("python", ["./game.py", req.params.str]);

  process.stdout.on("data", function (data) {
    res.send(data.toString());
  });
});
// idk yet
router.delete("/game/:code", async function (req, res, next) {
  res.json("todo");
});

module.exports = router;
