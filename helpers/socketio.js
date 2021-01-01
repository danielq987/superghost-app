const io = require("../app").io;
const cookie = require("cookie");
const cookies = require("./cookies");
const db = require("./db");

function runGame() {

  // returns a javascript object, gets header cookies from a socket
  function getCookies(socket) {
    let session = cookie.parse(socket.request.headers.cookie).session;
    return(cookies.decode(session));
  }
  
  function loadWord(str, code) {
    // fires the 'load word' event to update the current word for all sockets
    db.updateWord(str, code).then(response => {
      io.to(code).emit("load word", response);
    }).catch(err => {
      console.error(err);
    });
  }

  // get all player names in a room
  // socketio api was an absolute pain to work with here
  async function getPlayerNames(code) {
    let names = [];
    let response = await io.of('/').in(code).allSockets();
    let sockets = io.of('/').sockets;
    for (const socketId of response) {
      names.push(getCookies(sockets.get(socketId)).name); // <- yuck
    }
    return names;
  }

  io.on('connection', function onConnect (socket) {
    // console.log(`User connected, id: ${socket.id} rooms: ${JSON.stringify(socket.rooms)}`);
    
    // client joins the room    
    socket.on('join room', async function joinRoom (code) {
      socket.join(code);
      // updates the word based on the value in the database
      db.getGameInfo(code).then(response => {
        socket.emit("load word", response.current_word);
      }).catch(err => {
        console.error(err)
      })
      let names = await getPlayerNames(code);
      console.log(names);
      io.to(code).emit("load player list", names.sort());
    });

    // when a client adds a letter, update it for everyone
    socket.on('letter before', function addLetterBefore (word, code) {
      loadWord(word, code);
    });
  
    socket.on('letter after', function addLetterAfter(word, code) {
      loadWord(word, code);
    });
  
    // reset the word
    socket.on('reset word', function resetWord(code) {
      loadWord("", code);
    })
  });
}


module.exports = runGame;