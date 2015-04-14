
var players = require('./game/player-store');
var THREE = require('./game/libs/three');
console.log("I am looking for controllers");
var Controller = function() {

}
/*
Look for controller
We're going to add a player
go to game
*/

//check for the pushed buttons
function buttonPushed(controller){
	var pushedButtons = [];
	for(i in controller.buttons){
		if(controller.buttons[i].pressed){
			pushedButtons.push(i);
		}
	}
	return pushedButtons;
}
setInterval(getGameInput, 500);
var controllerPlayers = [false, false, false, false];

function getGameInput(){
	for(var i =0; i < controllerPlayers.length; i++){
		//Adding a player to the controllerPlayers
		if((!controllerPlayers[i]) && (navigator.getGamepads()[i] != undefined) && (buttonPushed(navigator.getGamepads()[i]).length > 0)){
			var player = {color: 0xff0000, playerId: -i};
			var color = Number(player.color);
			var ply = players.create(color);
			ply.userId = player.playerId;
			controllerPlayers[i] = true;
			console.log("%c ADDED PLAYER "+ply.userId,"color: #"+color.toString(16));
			ply.setPos(new THREE.Vector3(0,0,0));
		}
	}

}

// socket.on('update plane', function(data){
//   var id = data[0],
//       motion = data[1],
//       ply = players.find(id);
//   if (!ply) throw new Error('Got update for nonexistant player id:'+ id +'');
//   ply.applyMotion(motion);
// });

// socket.on('remove plane', function(id){
//   players.remove(players.find(id));
// });

// socket.on('fire', function(id){
//   // A player (playerId) hit FIRE!!
//   players.find(id).fire();
// });
module.exports = Controller;
