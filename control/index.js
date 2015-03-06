var calibration = {x:0,y:0,z:0,rate:0.1}; // for calibrating zeros
var invert = {x:false,y:false,z:false};
var count = 0; // trigger an event if the count
if (window.DeviceMotionEvent != undefined) {
  var motion = {}
  var socket = io();
  window.ondevicemotion = function(e) {
    count++;
    motion.x = (invert.x ? -1 : 1) * (e.accelerationIncludingGravity.x*2).toFixed() - calibration.x;
    motion.y = (invert.y ? -1 : 1) * (e.accelerationIncludingGravity.y*2).toFixed() - calibration.y;
    motion.z = (invert.z ? -1 : 1) * (e.accelerationIncludingGravity.z*2).toFixed() - calibration.z;
    var alpha = (e.rotationRate.alpha*10);
    var beta = (e.rotationRate.beta*10);
    var gamma = (e.rotationRate.gamma*10);
    var rate = (Math.abs(alpha) + Math.abs(beta) + Math.abs(gamma));
    document.getElementById("x").innerHTML = 0 || motion.x;
    document.getElementById("y").innerHTML = 0 || motion.y;
    document.getElementById("z").innerHTML = 0 || motion.z;
    document.getElementById("rate").innerHTML = 0 || rate;
    if ( rate > calibration.rate){
      // threshold for updating plane and we're due for a update
      updatePlane(motion);
    }
    document.getElementById("interval").innerHTML = 0 || e.interval;
    document.getElementById("count").innerHTML = 0 || count;
  }
}
invertX = function(){
  invert.x = !invert.x;
}
invertY = function(){
  invert.y = !invert.y;
}
invertZ = function(){
  invert.z = !invert.z;
}

deviceFire = function(){
  var socket = io();
  socket.emit("fire");
  var fireButton = document.getElementById("fire");
  fireButton.style.background = "darkblue";
  window.setTimeout(function(){
    fireButton.style.background = "darkred";
  },250);
}
updatePlane = function(motion){
  socket.emit("update plane",motion); // this goes to index.js
}

calibrate = function(){
  calibration.x = 0;
  calibration.y = 0;
  calibration.z = 0;
  window.setTimeout(function(){
    calibration.x = parseInt(document.getElementById("x").innerHTML);
    calibration.y = parseInt(document.getElementById("y").innerHTML);
    calibration.z = parseInt(document.getElementById("z").innerHTML);
    document.getElementById("c-x").innerHTML = 0 || calibration.x;
    document.getElementById("c-y").innerHTML = 0 || calibration.y;
    document.getElementById("c-z").innerHTML = 0 || calibration.z;
  },500);
}

calibrateRate = function(){
  calibration.rate = 0.1;
  window.setTimeout(function(){
    calibration.rate = document.getElementById("rate").innerHTML;
    document.getElementById("c-rate").innerHTML = 0 || calibration.rate;
  });
}

window.onload = function(){
  var socket = io();
  socket.emit('add plane');
}
