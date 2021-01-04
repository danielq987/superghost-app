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
  console.log("test");

  // check if game exists
  if (auth) {
    try {
      let { player_info: playerInfo, state } = await db.getGameByCode(code);
      // console.log(playerInfo);
      if (!playerInfo[SID] || !playerInfo[SID].name) {
        res.redirect('/');
      } else if (state == 1) {
        res.render("game", { title: "Game" })
      } else {
        res.render("start", { title: "Start" });
      }
    } catch (error) {
      console.error("Could not get game info." + error);
    }
  }
  // game does not exist
  else {
    next();
  }
});

runGame();

module.exports = router;