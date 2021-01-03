const { v4: uuidv4 } = require("uuid");
const base64 = require("base-64");
const cookie = require("cookie"); // module

// decode cookies
// jank af
function decode(input) {
  return JSON.parse(base64.decode(input));
}

// given a socket object, get session
function getSession(socket) {
  let session = cookie.parse(socket.request.headers.cookie).session;
  return(decode(session));
}

// given a sessionID, get socket ID

function assignSID(req, res, next) {
  let cookie = req.session.SID;
  // console.log(req.session);
  console.log("cookie:" + cookie);
  if (cookie === undefined) {
    let id = uuidv4();
    req.session.SID = id;
    console.log("new SID created: " + id)
  }
  else {
    console.log("welcome back, " + cookie);
  }
  next();
}

module.exports = {
  assignSID: assignSID,
  getSession: getSession
}