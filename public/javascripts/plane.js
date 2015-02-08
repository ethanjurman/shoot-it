// x = Roll
// y
// z = pitch

var calibration = {x:0,y:0,z:0,rate:0.1}; // for calibrating zeros
if (window.DeviceMotionEvent != undefined) {
  var motion = {}
  var socket = io();
  window.ondevicemotion = function(e) {
    motion.x = (e.accelerationIncludingGravity.x*10).toFixed(2) - calibration.x;
    motion.y = (e.accelerationIncludingGravity.y*10).toFixed(2) - calibration.y;
    motion.z = (e.accelerationIncludingGravity.z*10).toFixed(2) - calibration.z;
    motion.alpha = (e.rotationRate.alpha*10).toFixed(2);
    motion.beta = (e.rotationRate.beta*10).toFixed(2);
    motion.gamma = (e.rotationRate.gamma*10).toFixed(2);
    motion.rate = (Math.abs(motion.alpha) + Math.abs(motion.beta) + Math.abs(motion.gamma));
    document.getElementById("x").innerHTML = 0 || motion.x;
    document.getElementById("y").innerHTML = 0 || motion.y;
    document.getElementById("z").innerHTML = 0 || motion.z;
    document.getElementById("rate").innerHTML = 0 || motion.rate;
    if ( motion.rate > calibration.rate){
      // threshold for updating target
      updateTarget(motion);
    }
    document.getElementById("interval").innerHTML = 0 || e.interval;
  }
}

window.onkeydown = function(key){
  var motion = {};
  motion.x = parseInt(document.getElementById("x").innerHTML);
  motion.y = parseInt(document.getElementById("y").innerHTML);
  if (key.keyIdentifier == "Right"){
    motion.x = motion.x + 5;
  }
  if (key.keyIdentifier == "Left"){
    motion.x = motion.x - 5;
  }
  if (key.keyIdentifier == "Down"){
    motion.y = motion.y - 5;
  }
  if (key.keyIdentifier == "Up"){
    motion.y = motion.y + 5;
  }
  document.getElementById("x").innerHTML = motion.x;
  document.getElementById("y").innerHTML = motion.y;
  updateTarget(motion);
}

function fire(){
  var socket = io();
  socket.emit("fire");
}

function updateTarget(motion){
  socket.emit("update target",motion); // this goes to index.js
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
  socket.emit('add target');
}
