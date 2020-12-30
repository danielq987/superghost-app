const express = require("express");
const router = express.Router();

const io = require("../app").io;

// any listeners, game actions, will reside in this function
function runGame() {
  let word = "";

  function loadWord(str) {
    // fires the 'load word' event to update the current word for all sockets
    io.emit('load word', str);
  }

  io.setMaxListeners(5);

  io.on('connection', function onConnect (socket){
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
    


    console.log(socket.id);
  });
}
runGame();

// renders the game view
router.get('/', (req, res, next) => {
  res.render("game", { title: "Game"});
});

module.exports = router;