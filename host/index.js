var Game = require('./game/game');
var QRCode = require('./game/libs/qrcode.min');
var socket = require('./socket');
var controller = require('./controller');
var global = require('./game/global');


var bounds;
window.onload = function(){
	var qrcodeControl = window.location.href + "control";
	var qrcodeConfig = window.location.href + "config";
	var qrEleControl = document.getElementById("qr_code_play");
	var qrEleConfig = document.getElementById("qr_code_config");
	new QRCode(qrEleControl, qrcodeControl);
	qrEleControl.appendChild(document.createTextNode(qrcodeControl));
	new QRCode(qrEleConfig, qrcodeConfig);
	qrEleConfig.appendChild(document.createTextNode(qrcodeConfig));
	bounds = document.getElementById('play').getBoundingClientRect();
  global.game = new Game();
	global.game.addScore("PAC",999);
	global.game.addScore("MAN",750);
	global.game.addScore("DOG",600);
	global.game.addScore("TAN",500);
	global.game.addScore("CAN",350);
	global.game.addScore("BAN",250);
	global.game.addScore("BOB",150);
	setTimeout(function(){
		document.getElementById("title-gif").style.display = "";
	}, 2000);
};

window.onresize = function(){
	bounds = document.getElementById('play').getBoundingClientRect();
};
