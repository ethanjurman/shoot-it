var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var playerCount = 0;
io.on('connection', function(socket){
  var playerId = ++playerCount;
  socket.on('add plane', function(){
    console.log(playerId + " joined");
    io.emit('add plane',playerId);
  });
  socket.on('disconnect', function(){
    console.log(playerId + " left");
    io.emit('remove plane',playerId);
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
