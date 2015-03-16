var players = require('./game/player-store');
var THREE = require('./game/libs/three');

var socket = io();


socket.on('add plane', function(id){

  var color = Math.floor(0xffffff*Math.random()); // random player color
  var ply = players.create(color); // random color new player
  console.log("%c ADDED PLAYER","color: #"+color.toString(16));
  ply.userId = id;
  ply.setPos(new THREE.Vector3(0,0,0));

});

socket.on('update plane', function(data){
  var id = data[0],
      motion = data[1],
      ply = players.find(id);
  if (!ply) throw new Error('Got update for nonexistant player!');
  
  ply.updateDOMHUD(motion);
  ply.applyMotion(motion);
  
});

socket.on('remove plane', function(id){
  players.remove(players.find(id));
});

socket.on('fire', function(id){
  // A player (playerId) hit FIRE!!
  players.find(id).fire();
});

module.exports = socket;