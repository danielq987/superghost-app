const express= require('express');
const http = require('http');
const socketio = require('socket.io');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const port = process.env.PORT || 3000;
require('dotenv').config();

function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = socketio(server);

  module.exports = { io : io };

  // view engine setup
  app.set('views', './views');
  app.set('view engine', 'pug');
  app.set('trust proxy', 1);

  const index = require("./routes/index");
  const game = require("./routes/game");
  const api = require("./routes/api");

  app.use('/public', express.static('public'));
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.use(cookieSession({
    name: 'session',
    secret: "test12345",
    maxAge: 24*60*60*1000,
    httpOnly: false,
    secure: false
  }));
  app.use(cookieParser("test12345"));

  app.use('/game', game);
  app.use('/api', api);
  app.use('/', index);

  server.listen(port, function(){
    console.log('listening on *:' + port);
  });

  app.use(function err404(req, res, next) {
    res.status(404).render("404", { title: "Oops!" });
  });
}

startServer();