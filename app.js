const express= require('express');
const http = require('http');
const socketio = require('socket.io');

const pool = require("./helpers/db.js");

const port = process.env.PORT || 3000;
// let word = "";

function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = socketio(server);

  module.exports = { io : io , pool : pool};

  // view engine setup
  app.set('views', './views');
  app.set('view engine', 'pug');

  const index = require("./routes/index");
  const game = require("./routes/game");

  app.use(express.static('public'));

  app.use('/', index);
  app.use('/game', game);

  server.listen(port, function(){
    console.log('listening on *:' + port);
  });

  app.use(function err404(req, res, next) {
    res.status(404).render("404", { title: "Oops!" });
  });
}

startServer();
