var Game = require('./game/game');
var QRCode = require('./game/libs/qrcode.min');
var socket = require('./socket');


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
  var g = new Game();
};

window.onresize = function(){
	bounds = document.getElementById('play').getBoundingClientRect();
};
