let randomString = require("randomstring");
const pool = require("./db");

async function getActiveCodes() {
  let activeCodes = await pool.query("SELECT code FROM games WHERE state = 0 OR state = 1");
  let codeArray = [];
  for (i of activeCodes.rows) {
    codeArray.push(i.code);
  }
  return codeArray;
}

function generateRoomKey() {
  // get all currently active codes
  let codeArray = [];
  getActiveCodes().then(response => {
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
  getActiveCodes: getActiveCodes,
  generateRoomKey: generateRoomKey
};

