const express = require("express");
const router = express.Router();
const cookies = require("../helpers/cookies");

const db = require("../helpers/db");
const runGame = require("../helpers/socketio");

// function to check if player is authorized to access that game room
async function isAuth(gameId) {
  // checks if game code is active
  let activeCodes = await db.getActiveCodes();
  return activeCodes.includes(gameId);
}

router.use(cookies.assignSID);

// renders the game view
router.get('/:gameId', async (req, res, next) => {
  const code = req.params.gameId;
  const SID = req.session.SID;
  let auth = await isAuth(code);

  // check if game exists
  if (auth) {
    let gameInfo = await db.getGameInfo(code);
    // if player id not in database, add it
    if (!(gameInfo.player_ids.includes(SID))) {
      db.addPlayerToGame(code, SID);
    }
    res.render("game", { title: "Game", name: req.session.name});
  }
  // game does not exist
  else {
    next();
  }
});

runGame();

module.exports = router;