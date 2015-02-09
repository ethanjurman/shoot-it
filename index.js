var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var browserify = require('browserify-middleware');
var to5ify = require("6to5ify");

app.get('/', function(req, res){
  res.sendFile(__dirname + '/host/index.html');
});

app.get('/control', function(req, res){
  res.sendFile(__dirname + '/control/index.html');
});

app.get('/main.css', function(req, res){
  res.sendFile(__dirname + '/host/main.css');
});

app.get('/control/main.css', function(req, res){
  res.sendFile(__dirname + '/control/main.css');
});

app.get('/host.js', browserify('./host/index.js', {transforms: [to5ify]}));
app.get('/control.js', browserify('./control/index.js', {transforms: [to5ify]}));

app.get('/manifest.json', function(req, res){
  res.sendFile(__dirname + '/manifest.json');
});


app.use(express.static(path.join(__dirname, 'host/game/libs')));

var playerCount = 0;
io.on('connection', function(socket){
  var playerId = ++playerCount;
  socket.on('add plane', function(){
    console.log(playerId + " joined");
    io.emit('add plane',playerId);
  });
  socket.on('disconnect', function(){
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
