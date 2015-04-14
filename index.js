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

app.get('/config', function(req, res){
  res.sendFile(__dirname + '/control/config.html');
});

app.get('/main.css', function(req, res){
  res.sendFile(__dirname + '/host/main.css');
});

app.get('/control/main.css', function(req, res){
  res.sendFile(__dirname + '/control/main.css');
});

app.get('/host.js', browserify('./host/index.js', {transforms: [to5ify]}));
app.get('/index.js', browserify('./control/index.js', {transforms: [to5ify]}));
app.get('/config.js', browserify('./control/config.js', {transforms: [to5ify]}));

app.get('/manifest.json', function(req, res){
  res.sendFile(__dirname + '/manifest.json');
});

app.use(express.static(path.join(__dirname, 'static')));

var playerCount = 0;
io.on('connection', function(socket){
  var playerId = ++playerCount;
  socket.on('add plane', function(color){
    console.log(playerId + " joined");
    var player = {playerId:playerId,color:color};
    io.emit('add plane',player);
  });
  socket.on('disconnect', function(){
    console.log(playerId + " left");
    io.emit('remove plane',playerId);
  });
  socket.on('fire', function(){
    io.emit('fire',playerId);
  });
  socket.on('update plane', function(motion){
    io.emit('update plane',[playerId,motion]); // this goes to index.js on host
  });
});

http.listen(3000, function(){
  console.log('listening on *:80');
});
