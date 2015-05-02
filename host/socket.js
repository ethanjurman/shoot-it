var players = require('./game/player-store');
var THREE = require('./game/libs/three');

var socket = io();

socket.on('add plane', function(player){
  console.log(player);
	var color = Number(player.color);
	console.log(color);
	localStorage[player.playerId] = player.color;
  var ply = players.create(color, player.initials);
  ply.userId = player.playerId;
  console.log("%c ADDED PLAYER "+ply.userId,"color: #"+color.toString(16));
  ply.setPos(new THREE.Vector3(0,0,0));
});

socket.on('update plane', function(data){
  var id = data[0],
      motion = data[1],
      ply = players.find(id);
  // if (!ply) throw new Error('Got update for nonexistant player id:'+ id +'');
  if (!ply) {
		// if the player doesn't exit, add them (and use the color we stored earlier)
	  var color = Number(localStorage[id]) || 0xffffff*Math.random();
		console.log(color);
		var ply = players.create(color);
	  ply.userId = id;
	  console.log("%c ADDED PLAYER "+ply.userId,"color: #"+color.toString(16));
	  ply.setPos(new THREE.Vector3(0,0,0));
	}
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
