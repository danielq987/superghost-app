$(document).ready(function () {
  let code = window.location.pathname.split('/')[2];
  var socket = io();
  socket.emit('join room', code);

  let word = "";

  function renderWord() {
    $("#main-word").text('[' + word + ']');
  }

  // check word function
  function checkWord(e) {
    e.preventDefault();
    
    axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
        })
        .then((res) => {
            
            if (res.status !== 200) {
                
                if (res.status === 404) {
                    console.log("This is not a word")
                }
            } else {
                if (word !== res.word){
                    console.log("This is a misspelled word")
                } else {
                  console.log("This is a word")
                }
            }
            
        })
        .catch((error) => {
            console.log(error.message);
            //console.error(error)
        })


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

  // check word
  $("#check-word").on("click", (e) => {
    e.preventDefault();
    checkWord();
    //socket.emit("check word", word, code);
  });

});

