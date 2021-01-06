$(document).ready(function () {
  let code = window.location.pathname.split("/")[2];
  var socket = io();
  socket.emit("join room", code);

  let word = "";

  function renderWord() {
    $("#main-word").text("[" + word + "]");
  }

  // check word function
  function checkWord() {
    var success = false;
    axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`).then((res) => 
    {
      console.log(res);
      if (word !== res.data[0].word) {
        console.log("This is a misspelled word");
      } else {
        console.log("This is a word");
        success = true;
      }
      socket.emit("check word", code, success);
    }).catch((error) => {
      console.log("This is not a word");
      socket.emit("check word", code, success);
    });
  }

  socket.on("word checked", (success) => {
    $("#debug").html(`${success ? "This is a word!" : "This is not a word!"}`);
  });

  socket.on("load word", (str) => {
    word = str;
    renderWord();
  });

  // loads the list of players in the room
  socket.on("load player list", (arr) => {
    $("#player-list").empty();
    for (i of arr) {
      $("#player-list").append(`<li>${i}</li>`);
    }
  });

  socket.on("start game", () => {
    location.reload();
  });

  $("#submit-before").on("click", (e) => {
    e.preventDefault();
    socket.emit("letter before", $("#letter").val() + word, code);
    $("#letter").val("");
  });

  $("#submit-after").on("click", (e) => {
    e.preventDefault();
    socket.emit("letter after", word + $("#letter").val(), code);
    $("#letter").val("");
  });

  $("#reset-word").on("click", (e) => {
    e.preventDefault();
    socket.emit("reset word", code);
    $("#letter").val("");
  });

  $("#start-game").on("click", (e) => {
    e.preventDefault();
    socket.emit("start game", code);
  });

  // check word
  $("#check-word").on("click", (e) => {
    e.preventDefault();
    checkWord();
    socket.emit("check word", word, code);
  });
});
