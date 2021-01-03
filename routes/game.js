const express = require("express");
const router = express.Router();
const cookies = require("../helpers/cookies");

const db = require("../helpers/db");
const runGame = require("../helpers/runGame");

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
    let { player_info: playerInfo } = await db.getGameByCode(code);
    
    if (playerInfo[SID].name === undefined) {
      res.redirect('../');
    }
    // add the player to the database
    db.addPlayer(code, SID);
    res.render("start", { title: "Start" });
  }
  // game does not exist
  else {
    next();
  }
});

runGame();

module.exports = router;