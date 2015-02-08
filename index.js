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
  socket.on('add target', function(){
    console.log(playerId + " joined");
    io.emit('add target',[playerId,playerCount]);
  });
  socket.on('disconnect', function(){
    playerCount--;
    console.log(playerId + " left");
  });
  socket.on('fire', function(){
    console.log("fire from " + playerId)
    io.emit('fire',playerId);
  });
  socket.on('update target', function(motion){
    console.log("update target for player "+playerId);
    console.log(motion);
    io.emit('update target',[playerId,motion]); // this goes to main.js
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
