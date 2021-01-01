const express = require("express");
const router = express.Router();
const cookies = require("../helpers/cookies");
const io = require("../app").io;
const room = require("../helpers/room");
const axios = require("axios").default;

// function to check if player is authorized to access that game room
async function isAuth(SID, gameId) {
  try {
    // checks if game code is active
    let activeCodes = await room.getActiveCodes();
    isValidRoom = activeCodes.includes(gameId);
    
    if (!isValidRoom) {
      return false;
    }

    // check if client SID is in database
    // NOTE: the proxy is needed to be set or else it throws a ECONNREFUSED error ??
    const response = await axios.get(`/api/games/${gameId}`, {
      proxy: {host: 'localhost', port: 3000}
    });
    isValidPlayer = response.data.player_ids.includes(SID);
    return (isValidPlayer);
  } catch (error) {
    console.error(`Error checking authorization. ${error}`)
    return false;
  }
}

router.use(cookies.assignSID);

// renders the game view
router.get('/:gameId', async (req, res, next) => {
  const code = req.params.gameId;
  isAuth(req.session.SID, code).then(response => {
    if (response) {
      res.render("game", { title: "Game", name: req.session.name});
    }
    else {
      next();
    }
  })
});

// any listeners, game actions, will reside in this function
function runGame() {
  let word = "";

  function loadWord(str) {
    // fires the 'load word' event to update the current word for all sockets
    io.emit('load word', str);
  }

  io.on('connection', function onConnect (socket){
    console.log(`User connected, id: ${socket.id}`);
    // loads the current word to the client's screen when connected
    loadWord(word);
    // when a client adds a letter, update it for everyone
    socket.on('letter before', function addLetterBefore (letter) {
      word = letter + word;
      loadWord(word);
    });

    socket.on('letter after', function addLetterAfter(letter) {
      word = word + letter;
      loadWord(word);
    });

    // reset the word
    socket.on('reset word', function resetWord() {
      word = "";
      loadWord(word);
    })
  });
}
runGame();

module.exports = router;