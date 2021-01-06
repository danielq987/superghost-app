const io = require("../app").io;
const db = require("../helpers/db");
const cookies = require("../helpers/cookies");
const helpers = require("./gameHelpers");

// functions and listeners pertaining to the game
function runGame() {
  // updates the word in the database
  // fires the 'load word' event to update the current word for all sockets
  async function loadWord(str, code) {
    try {
      response = await db.updateWord(str, code);
      io.to(code).emit("load word", response);
    } catch (error) {
      console.error(err);
    }
  }
  
  io.on('connection', function onConnect (socket) {

    /* __________GENERAL GAME SETUP LISTENERS___________ */

    // listener for when client joins a room 
    socket.on('join room', async function joinRoom (code) {
      socket.join(code);
      try {
        // update socketId in database
        await db.editSocketId(code, cookies.getSession(socket), socket.id);

        // get the game info
        const { state, player_info, current_word } = await db.getGameByCode(code);

        // if game has started, update the word
        if (state == 1) {
          socket.emit("load word", current_word);
        }

        // gets all player names and emit the list
        const names = await helpers.getPlayerNames(player_info);
        io.to(code).emit("load player list", names.sort());

        // Get session ID
        let SID = cookies.getSession(socket);
        // Get username of player sending the message
        const userName = player_info[SID]['name'];

        // Emits welcome message in the chat
        socket.emit('message', {user: "admin", text: `${userName}, welcome to the room.`});

      } catch (error) {
        console.log("Could not get player names. " + error);
      }
    });
    
    // Listener for game start
    // emits the 'start game event' to everyone in the room
    socket.on('start game', async (code) => {
      await db.startGame(code);
      // io.to(socketId).emit("current turn");
      io.to(code).emit('start game');
    })

    // Listener for when a player makes a move
    // Emits to next player the "current turn" event 
    socket.on('next turn', async function (code) {
      // get session ID of next player
      const { player_info, turn_index } = db.getGameByCode(code);
      
      // get the socketId of the next player
      socketId = // TODO

      loadWord(word, code);
      io.to(socketId).emit("current turn");
    })
    
    /* _______CHAT LISTENERS____________ */

    // for when we implement chats

    socket.on('sendMessage', (message, callback) => {
      // Get session ID
      let SID = cookies.getSession(socket);

      // Get username of player sending the message
      const { player_info } = db.getGameByCode(code);
      const userName = player_info[SID]['name'];

      io.to(code).emit('message', {user: userName, text: message});
      callback();
    });

    // TODO

    /* _______CHALLENGE LISTENERS____________*/
    
    // Listener for challenger choosing "isWord" challenge
    socket.on("isword challenge", (code, successful) => {
      // TODO
      /* Emits to everyone that a player challenged 
      After some delay, announce to everyone whether the challenge was successful or not (handled by front-end)
      by emitting "challenge success" or "challenge fail"
      Then starts a new round by emitting "new round" to everyone
      */
    });


    // Listener for challenger choosing "prompt" challenge
    socket.on("prompt challenge", (code) => {
      // TODO
      /* Emits to everyone that a player challenged 
      Emit to the player being challenged "prompt" event.

      */
    });

    socket.on("prompt", (code, successful) => {
      // TODO
      /* Frontend handles whether or not the word was a phony or not, and after some delay,
      backend emits to everyone whether the challenge was successful or not 
      Then edits score and starts a new round by emitting "new round" to everyone */
    });

    
    // LEGACY LISTENERS __________________
    
    // when a client adds a letter, update it for everyone
    socket.on('letter before', (word, code) => {
      loadWord(word, code);
    });
  
    socket.on('letter after', (word, code) => {
      loadWord(word, code);
    });
  
    // reset the word
    socket.on('reset word', (code) => {
      loadWord("", code);
    })
  });
}


module.exports = runGame;