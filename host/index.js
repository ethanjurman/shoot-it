var Game = require('./game/game');

var socket = io();
var bounds;
window.onload = function(){
	socket.emit('update plane');
	bounds = document.getElementById('play').getBoundingClientRect();
};

window.onresize = function(){
	bounds = document.getElementById('play').getBoundingClientRect();
};

socket.on('add plane', function(playersInfo){
	addPlane(playersInfo); // player added
});

socket.on('update plane', function(p){
	updatePlane(p[0],p[1]); // playerId and motion
});

socket.on('remove plane', function(p){
	removePlane(p);
});

socket.on('fire', function(playerId){
	var plane = document.querySelector('.plane[player-id="'+playerId+'"]');
	plane.setAttributeNS(null,"fill","blue");
	window.setTimeout(function(){
		plane.setAttributeNS(null,"fill","red");
	},250);
});

function addPlane(playerId){
	var play = document.getElementById("play");
	console.log("ADDED PLAYER");
	var svgNS = "http://www.w3.org/2000/svg";
	var plane = document.createElementNS(svgNS,"circle");
	plane.setAttributeNS(null,"class","plane")
	plane.setAttributeNS(null,"player-id",playerId);
	plane.setAttributeNS(null,"cx","50%");
	plane.setAttributeNS(null,"cy","50%");
	plane.setAttributeNS(null,"r",20);
	plane.setAttributeNS(null,"transform","translate(0 0)");
	plane.setAttributeNS(null,"stroke","black");
	plane.setAttributeNS(null,"stroke-width",3);
	plane.setAttributeNS(null,"fill","red");
	plane.setAttributeNS(null,"pos-x",0); // keep track of x position
	plane.setAttributeNS(null,"pos-y",0); // keep track of y position
	var target = document.createElementNS(svgNS,"circle");
	target.setAttributeNS(null,"class","target");
	target.setAttributeNS(null,"player-id",playerId);
	target.setAttributeNS(null,"cx","50%");
	target.setAttributeNS(null,"cy","50%");
	target.setAttributeNS(null,"r",15);
	target.setAttributeNS(null,"transform","translate(0 0)");
	target.setAttributeNS(null,"stroke","black");
	target.setAttributeNS(null,"stroke-width",1);
	target.setAttributeNS(null,"fill","none");
	play.appendChild(plane);
	play.appendChild(target);
};

function updatePlane(playerId,motion){
	var plane = document.querySelector('.plane[player-id="'+playerId+'"]');
	var target = document.querySelector('.target[player-id="'+playerId+'"]');
	if (plane){
		var x = Math.min(bounds.width/2,Math.max(-bounds.width/2,(parseInt(plane.getAttribute("pos-x")) + motion.y)));
		var y = Math.min(bounds.height/2,Math.max(-bounds.height/2,(parseInt(plane.getAttribute("pos-y")) + motion.z)));
		plane.setAttribute("transform", "translate(" + x + " " + y + ")");
		target.setAttribute("transform", "translate(" + (x + motion.y*3) + " " + (y + motion.z*5) + ")");
		plane.setAttribute("pos-x", x);
		plane.setAttribute("pos-y", y);
	}
};

function removePlane(playerId){
	var plane = document.querySelector('.plane[player-id="'+playerId+'"]');
	plane.parentNode.removeChild(plane);
	var target = document.querySelector('.target[player-id="'+playerId+'"]');
	target.parentNode.removeChild(target);
};

window.onload = function() {
  var g = new Game();
};
