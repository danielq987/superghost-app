$(document).ready(function () {
  let code = window.location.pathname.split('/')[2];
  var socket = io();
  socket.emit('join room', code);

  let word = "";

  function renderWord() {
    $("#main-word").text('[' + word + ']');
  }

  socket.on("load word", (str) => {
    word = str;
    renderWord();
  })

  // loads the list of players in the room
  socket.on("load player list", (arr) => {
    $("#player-list").empty();
    for (i of arr) {
      $("#player-list").append(`<li>${i}</li>`);
    }
  })

  socket.on("start game", () => {
    location.reload();
  })

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

});