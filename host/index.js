var Game = require('./game/game');
var QRCode = require('./game/libs/qrcode.min');
var socket = require('./socket');


var bounds;
window.onload = function(){
	var qrcode = window.location.href + "control";
	new QRCode(document.getElementById("qr_code"), qrcode);
	document.getElementById("qr_code").appendChild(
		document.createTextNode(qrcode));
	socket.emit('update plane');
	bounds = document.getElementById('play').getBoundingClientRect();
    var g = new Game();
};

window.onresize = function(){
	bounds = document.getElementById('play').getBoundingClientRect();
};
