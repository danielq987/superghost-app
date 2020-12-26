var express= require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

let word = "";

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

function loadWord(str) {
  // fires the 'load word' event to update the current word for all sockets
  io.emit('load word', str);
}

io.on('connection', function(socket){
  // loads the current word to the client's screen when connected
  loadWord(word);
  
  // when a client adds a letter, update it for everyone
  socket.on('letter before', function(letter){
    word = letter + word;
    loadWord(word);
  });

  socket.on('letter after', function(letter){
    word = word + letter;
    loadWord(word);
  });

  // reset the word
  socket.on('reset word', () => {
    word = "";
    loadWord(word);
  })
  
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
