var calibration = {x:0,y:0,z:0,rate:0.1}; // for calibrating zeros
var invert = {x:false,y:false,z:false};
var count = 0; // trigger an event if the count
if (window.DeviceMotionEvent != undefined) {
  var motion = {}
  var socket = io();
  window.ondevicemotion = function(e) {
    count++;
    motion.x = (invert.x ? -1 : 1) * (e.accelerationIncludingGravity.x*2) - calibration.x;
    motion.y = (invert.y ? -1 : 1) * (e.accelerationIncludingGravity.y*2) - calibration.y;
    motion.z = (invert.z ? -1 : 1) * (e.accelerationIncludingGravity.z*2) - calibration.z;
    motion.alpha = (e.rotationRate.alpha*10);
    motion.beta = (e.rotationRate.beta*10);
    motion.gamma = (e.rotationRate.gamma*10);
    motion.rate = (Math.abs(motion.alpha) + Math.abs(motion.beta) + Math.abs(motion.gamma));
    document.getElementById("x").innerHTML = 0 || motion.x;
    document.getElementById("y").innerHTML = 0 || motion.y;
    document.getElementById("z").innerHTML = 0 || motion.z;
    document.getElementById("rate").innerHTML = 0 || motion.rate;
    if ( motion.rate > calibration.rate){
      // threshold for updating plane and we're due for a update
      updatePlane(motion);
    }
    document.getElementById("interval").innerHTML = 0 || e.interval;
    document.getElementById("count").innerHTML = 0 || count;
  }
}

function invertX(){
  invert.x = !invert.x;
}
function invertY(){
  invert.y = !invert.y;
}
function invertZ(){
  invert.z = !invert.z;
}

var fireTimer = null;
function fire(){
  var socket = io();
  socket.emit("fire");
  var fireButton = document.getElementById("fire");
  fireButton.style.background = "darkblue";
  window.setTimeout(function(){
    fireButton.style.background = "darkred";
  },250);
}
// If fire event can be triggered when held down, maybe we can do this
function startFire(evt){
  evt.preventDefault();
  fireTimer = setInterval("fire()",250);
}
function stopFire(evt){
  evt.preventDefault();
  window.clearInterval(fireTimer)
}
function updatePlane(motion){
  socket.emit("update plane",motion); // this goes to index.js
}

function calibrate(){
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

function calibrateRate(){
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
