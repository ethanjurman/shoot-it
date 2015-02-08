var socket = io();
var bounds;
window.onload = function(){
	socket.emit('update target');
	bounds = document.getElementById('play').getBoundingClientRect();
	console.log(bounds);
}
window.onresize = function(){
	bounds = document.getElementById('play').getBoundingClientRect();
}
socket.on('add target', function(p){
	addTarget(p[0],p[1]);
});
socket.on('update target', function(p){
	console.log("player update: "+p[0]);
	updateTarget(p[0],p[1]); // playerId and motion
});
socket.on('fire', function(playerId){
	var target = document.querySelector('circle[player-id="'+playerId+'"]');
	target.setAttributeNS(null,"fill","blue");
	window.setTimeout(function(){
		target.setAttributeNS(null,"fill","red");
	},250);
});
function addTarget(playerNumber,numberOfPlayers){
	console.log(playerNumber + " " + numberOfPlayers);
	var play = document.getElementById("play");
	play.innerHTML = "";
	for (var i = 0; i < numberOfPlayers; i++){
		console.log("ADDED PLAYER");
		var svgNS = "http://www.w3.org/2000/svg";
		var target = document.createElementNS(svgNS,"circle");
		target.setAttributeNS(null,"player-id",i+1);
		target.setAttributeNS(null,"cx","50%");
		target.setAttributeNS(null,"cy","50%");
		target.setAttributeNS(null,"r",20);
		target.setAttributeNS(null,"transform","translate(0 0)");
		target.setAttributeNS(null,"stroke","black");
		target.setAttributeNS(null,"stroke-width",3);
		target.setAttributeNS(null,"fill","red");
		target.setAttributeNS(null,"pos-x",0);
		target.setAttributeNS(null,"pos-y",0);
		play.appendChild(target);
	}
}
function updateTarget(playerId,motion){
	var target = document.querySelector('circle[player-id="'+playerId+'"]');
	if (target){
		var x = Math.min(bounds.width/2,Math.max(-bounds.width/2,(parseInt(target.getAttribute("pos-x")) + motion.y)));
		var y = Math.min(bounds.height/2,Math.max(-bounds.height/2,(parseInt(target.getAttribute("pos-y")) + motion.z)));
		target.setAttribute("transform", "translate(" + x + " " + y + ")");
		target.setAttribute("pos-x", x);
		target.setAttribute("pos-y", y);
	}
}
