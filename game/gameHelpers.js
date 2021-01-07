const cookies = require("../helpers/cookies"); // own helper
const db = require("../helpers/db");

// iterates through all the active games and check to see if they should be closed
setTimeout(() => {
  // TODO
}, 1000 * 60);

// returns whether the client connected to the socket is the admin of the game room
function verifyAdmin(socket, code) {
  let SID = cookies.getSession(socket);
  let adminId = db.getGameByCode(code).admin_id;
  return SID == adminId;
}

// from the database, get a list of player names for the game
async function getPlayerNames(player_info) {
  try {
    let names = [];
    // console.log(player_info)
    for (player in player_info) {
      names.push(player_info[player].name);
    }
    console.log("names: " + names);
    return names;
  } catch (error) {
    console.error("Could not get game info. " + error)
  }
}

// returns the SID of the next player in line
// sorts the session ID's in alphabetical order to generate the order
async function getNextPlayer(code, player_info) {
  const turn_index = await db.incrementTurn(code);
  // console.log(turn_index);
  const numPlayers = Object.keys(player_info).length;
  return Object.keys(player_info).sort()[turn_index % numPlayers];
}

// returns a boolean,
// for the client who is connected to <socket>, return whether it is their turn to move
function isCurrentTurn(socket, player_info, turn_index) {
  const numPlayers = Object.keys(player_info).length;
  const currentSID = Object.keys(player_info).sort()[turn_index % numPlayers];
  // compare socketID of the current player vs the socket given

  return player_info[currentSID].socketId == socket.socketId;
}

// returns the SID of the previous player
function getPreviousPlayer(player_info, turn_index) {
  const numPlayers = Object.keys(player_info).length;
  return Object.keys(player_info).sort()[(turn_index - 1) % numPlayers]
}

module.exports = {
  verifyAdmin: verifyAdmin,
  getPlayerNames: getPlayerNames,
  getNextPlayer: getNextPlayer,
  isCurrentTurn: isCurrentTurn,
  getPreviousPlayer: getPreviousPlayer
}