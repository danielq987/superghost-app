$(function () {
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

  /* $('form').submit(function(){
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  }); */
});