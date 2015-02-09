var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var players = [];
var playerId = 0;
io.on('connection', function(socket){
  ++playerId;
  socket.on('add plane', function(){
    players.push(playerId); // playerId's must be unique
    console.log(playerId + " joined");
    io.emit('add plane',playerId);
  });
  socket.on('disconnect', function(){
    players.splice(players.indexOf(playerId),1);
    console.log(playerId + " left");
  });
  socket.on('fire', function(){
    console.log("fire from " + playerId)
    io.emit('fire',playerId);
  });
  socket.on('update plane', function(motion){
    io.emit('update plane',[playerId,motion]); // this goes to main.js
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
