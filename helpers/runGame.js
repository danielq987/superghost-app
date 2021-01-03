const io = require("../app").io;
const cookies = require("./cookies"); // own helper
const db = require("./db");


// functions and listeners pertaining to the game
function runGame() {

  // iterates through all the active games and check to see if they should be closed
  setTimeout(() => {
    // TODO
  }, 1000 * 60);

  // returns whether the client connected to the socket is the admin of the game room
  function verifyAdmin(socket, code) {
    let SID = cookies.getSession(socket).SID;
    let adminId = db.getGameByCode(code).admin_id;
    return SID == adminId;
  }

  function getSocketIdFromSID(SID, code) {

  }

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

  // from the database, get a list of player names for the game
  async function getPlayerNames(player_info) {
    try {
      let names = [];
      for (player in player_info) {
        names.push(player_info[player].name);
      }
      return names;
    } catch (error) {
      console.error("Could not get game info. " + error)
    }
  }

  io.on('connection', function onConnect (socket) {

    /* __________GENERAL GAME SETUP LISTENERS___________ */

    // listener for when client joins a room 
    socket.on('join room', async function joinRoom (code) {
      socket.join(code);
      try {
        // update socketId in database
        await db.editSocketId(code, socket.id);

        // get the game info
        const { state, player_info, current_word } = await db.getGameByCode(code);

        // if game has started, update the word
        if (state == 1) {
          socket.emit("load word", current_word);
        }

        // gets all player names and emit the list
        const names = await getPlayerNames(code, player_info);
        io.to(code).emit("load player list", names.sort());
      } catch (error) {
        console.log("Could not get player names. " + error);
      }
    });
    
    // Listener for game start
    // emits the 'start game event' to everyone in the room
    socket.on('start game', async (code) => {
      await db.startGame(code);
      io.to(socketId).emit("current turn");
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
    socket.on("chat message", (code, msg) => {
      io.to(code).emit("chat message", msg);
    })

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