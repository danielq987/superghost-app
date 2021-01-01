let randomString = require("randomstring");
const db = require("./db");

function generateRoomKey() {
  // get all currently active codes
  let codeArray = [];
  db.getActiveCodes().then(response => {
    codeArray = response;
  }).catch(err => {
    console.error("Could not get active game codes: " + err)
  });
  let unique = false;
  let str = "";
  while (!unique) {
    str = randomString.generate({
      length: 6,
      charset: "alphabetic",
      capitalization: "uppercase"
    })
    if (!(codeArray.includes(str))) {
      unique = !unique;
    }
  }
  return str;
}

module.exports = {
  generateRoomKey: generateRoomKey
};

