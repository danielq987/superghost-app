$(document).ready(function () {
  var socket = io();

  let word = "";

  function renderWord() {
    $("#main-word").text('[' + word + ']');
  }

  socket.on("load word", (str) => {
    word = str;
    renderWord();
  })

  $("#submit-before").on("click", (e) => {
    e.preventDefault();
    socket.emit("letter before", $("#letter").val());
    $("#letter").val("");
  });

  $("#submit-after").on("click", (e) => {
    e.preventDefault();
    socket.emit("letter after", $("#letter").val());
    $("#letter").val("");
  });

  $("#reset-word").on("click", (e) => {
    e.preventDefault();
    socket.emit("reset word");
    $("#letter").val("");
  });

});