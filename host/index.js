var Game = require('./game/game');
var players = require('./game/player-store');
var THREE = require('./game/libs/three');
var QRCode = require('./game/libs/qrcode.min');

var socket = io();
var bounds;
window.onload = function(){
	// var qrcode = window.location.href + "control";
	// new QRCode(document.getElementById("qr_code_play"), qrcode);
	// document.getElementById("qr_code_play").appendChild(document.createTextNode(qrcode));
	var qrcodeControl = window.location.href + "control";
	var qrcodeConfig = window.location.href + "config";
	var qrEleControl = document.getElementById("qr_code_play");
	var qrEleConfig = document.getElementById("qr_code_config");
	new QRCode(qrEleControl, qrcodeControl);
	qrEleControl.appendChild(document.createTextNode(qrcodeControl));
	new QRCode(qrEleConfig, qrcodeConfig);
	qrEleConfig.appendChild(document.createTextNode(qrcodeConfig));
	bounds = document.getElementById('play').getBoundingClientRect();
    var g = new Game();
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
	// A player (playerId) hit FIRE!!
	players.find(playerId).fire();
});

function addPlane(playerId){
	var color = Math.floor(0xffffff*Math.random()); // random player color
  var ply = players.create(color); // random color new player
	console.log("%c ADDED PLAYER","color: #"+color.toString(16));
  ply.userId = playerId;
  ply.setPos(new THREE.Vector3(0,0,0));
};

function updatePlane(playerId,motion){
	// TODO lots of magic numbers
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
  var ply = players.find(playerId);
    if (ply) {
      var planebound = {width: 100, height: 80};
      var x = Math.min(planebound.width/2,Math.max(-planebound.width/2,(ply.getPos().x + motion.y/10)));
      var y = Math.min(planebound.height/2,Math.max(-planebound.height/2,(ply.getPos().y - motion.z/10)));
      var pos = new THREE.Vector3(x, y, 0);
      var target = new THREE.Vector3(motion.z, 0, motion.y);
			ply.setPos(pos);
			if (ply.mesh) {
				var quat = new THREE.Quaternion();
				quat.setFromAxisAngle(target.normalize(), -Math.PI/4);
				ply.setRotation(quat);
			}
    }
};

function removePlane(playerId){
	players.remove(players.find(playerId));
};
