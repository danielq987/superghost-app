const { v4: uuidv4 } = require("uuid");
const base64 = require("base-64");

// decode cookies
// jank af
function decode(input) {
  return JSON.parse(base64.decode(input));
}

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
  decode: decode
}