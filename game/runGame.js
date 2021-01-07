const io = require("../app").io;
const db = require("../helpers/db");
const cookies = require("../helpers/cookies");
const helpers = require("./gameHelpers");
// const axios = require('axios');

// functions and listeners pertaining to the game
function runGame() {
  // updates the word in the database
  // fires the 'load word' event to update the current word for all sockets
  async function loadWord(code, str) {
    try {
      response = await db.updateWord(str, code);
      io.to(code).emit("load word", response);
    } catch (error) {
      console.error(err);
    }
  }

  // testing the word check function
//   async function checkWord(str, code) {
    // try {
    //   axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${str}`, {
    //     })
    //     .then((res) => {
    //         if (res.status !== 200) {
    //             //throw new Error()
    //             if (res.status === 404) {
    //                 //setResponseObj("This is not a word")
    //                 console.log("This is not a word");
    //             }
    //         } else {
    //             if (str !== res.str){
    //                 //setResponseObj("This is a misspelled word")
    //                 console.log("This is a misspelled word");
    //             } else {
    //               console.log("This is a word")
    //             }
    //           //setResponseObj(res)
                
    //             //setLoading(false)
    //         }   
    //     })
    //     .catch((error) => {
    //       setError(true);
    //       setLoading(false);
    //       console.log(error.message);
    //       console.error(error)
    //   })

//     io.to(code).emit("check word", response);

    // } catch (error) {
    //     console.error(error)
    // }
//   } 
  

  io.on('connection', function onConnect (socket) {

    /* __________GENERAL GAME SETUP LISTENERS___________ */

    // listener for when client joins a room 
    socket.on('join room', async function joinRoom (code) {
      socket.join(code);
      try {
        // update socketId in database
        await db.editSocketId(code, cookies.getSession(socket), socket.id);

        // get the game info
        const { state, player_info, current_word, turn_index } = await db.getGameByCode(code);

        // if game has started, update the word
        if (state == 1) {
          socket.emit("load word", current_word);
          if (helpers.isCurrentTurn(code, socket, player_info, turn_index)) {
            socket.emit("start turn");
          }
        }

        // gets all player names and emit the list
        const names = await helpers.getPlayerNames(player_info);
        io.to(code).emit("load player list", names.sort());
      } catch (error) {
        console.log("Could not get player names. " + error);
      }
    });
    
    // Listener for game start
    // emits the 'start game event' to everyone in the room
    socket.on('start game', async (code) => {
      await db.startGame(code);
      
      const { player_info } = await db.getGameByCode(code);
      const nextSID = await helpers.getNextPlayer(code, player_info);
      
      const socketId = player_info[nextSID].socketId;

      io.to(code).emit('start game');
      io.to(socketId).emit('start turn');
    })

    // Listener for when a player makes a move
    // Emits to next player the "start turn" event 
    socket.on('finish turn', async function (code, letter, position) {
      // get session ID of next player
      let word = await db.addLetter(code, letter, position);
      const { player_info } = await db.getGameByCode(code);
      const nextSID = await helpers.getNextPlayer(code, player_info);
      
      // get the socketId of the next player
      const socketId = player_info[nextSID].socketId;

      loadWord(code, word);
      io.to(socketId).emit("start turn");
    })
    
    /* _______CHAT LISTENERS____________ */

    // for when we implement chats
    socket.on("chat message", (code, msg) => {
      io.to(code).emit("chat message", msg);
    })

    // TODO

    /* _______CHALLENGE LISTENERS____________*/
    
    // Listener for challenger choosing "isWord" challenge
    socket.on("challenge", async function (code, type) {
      // emits to everyone but the sender
      const { player_info, turn_index } = await db.getGameByCode(code);
      const challenger = cookies.getSession(socket);
      const challenged = helpers.getPreviousPlayer(player_info, turn_index);
      socket.to(code).emit("challenge pending", challenger, challenged, type);
    });

    // gets whether was challenge was successful
    socket.on("challenge complete", (code, successful) => {
      // TODO
      /* Frontend handles whether or not the word was a phony or not, and after some delay,
      backend emits to everyone whether the challenge was successful or not 
      Then edits score and starts a new round by emitting "new round" to everyone */
      if (successful) {
        // TODO: add point to previous player
      } else {
        // TODO: add point to sender
      }
      
      io.to(code).emit("challenge complete", successful);
      setTimeout(() => {
        loadWord(code, "");
      }, 3000);
    });

    
    // LEGACY LISTENERS __________________
    
    // when a client adds a letter, update it for everyone
    socket.on('letter before', (word, code) => {
      loadWord(code, word);
    });
  
    socket.on('letter after', (word, code) => {
      loadWord(code, word);
    });
  
    // reset the word
    socket.on('reset word', (code) => {
      loadWord(code, "");
    });

    // check word 
    socket.on('check word', (code, success) => {
      io.to(code).emit("word checked", success)
    })
  });
}


module.exports = runGame;