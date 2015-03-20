var Flipsnap = require('./flipsnap');
var invert = {
  x:(localStorage.getItem('inv_x') === 'true') || false,
  y:(localStorage.getItem('inv_y') === 'true') || false,
  z:(localStorage.getItem('inv_z') === 'true') || false};
var count = 0; // trigger an event if the count
if (window.DeviceMotionEvent != undefined) {
  window.ondevicemotion = function(e) {
    count++;
    motion = {};
    motion.x = (invert.x ? -1 : 1) * (e.accelerationIncludingGravity.x*2).toFixed();
    motion.y = (invert.y ? -1 : 1) * (e.accelerationIncludingGravity.y*2).toFixed();
    motion.z = (invert.z ? -1 : 1) * (e.accelerationIncludingGravity.z*2).toFixed();
    var alpha = (e.rotationRate.alpha*10);
    var beta = (e.rotationRate.beta*10);
    var gamma = (e.rotationRate.gamma*10);
    var rate = (Math.abs(alpha) + Math.abs(beta) + Math.abs(gamma));
    document.getElementById("x").innerHTML = 0 || motion.x;
    document.getElementById("y").innerHTML = 0 || motion.y;
    document.getElementById("z").innerHTML = 0 || motion.z;
    var ball = document.getElementById("gauge-ball");
    ball.style.left = Math.max(0,Math.min(180,(10*motion.y) + 90));
    ball.style.top = Math.max(0,Math.min(180,(10*motion.z) + 90));
    document.getElementById("rate").innerHTML = 0 || rate;
    document.getElementById("interval").innerHTML = 0 || e.interval;
    document.getElementById("count").innerHTML = 0 || count;
  }
}

invertX = function(){
  invert['x'] = !invert['x'];
  localStorage.setItem("inv_x",invert['x']);
}
invertY = function(){
  invert['y'] = !invert['y'];
  localStorage.setItem("inv_y",invert['y']);
}
invertZ = function(){
  invert['z'] = !invert['z'];
  localStorage.setItem("inv_z",invert['z']);
}

selectItem = function(e){
  // selecting the colors
  var target = e.target || e.srcElement;
  if (target.getAttribute("data-selected") == "true"){
    console.log("UNSELECT");
    target.setAttribute("data-selected","false");
    target.classList.remove("selected");
  } else {
    console.log("SELECT");
    target.setAttribute("data-selected","true");
    target.classList.add("selected");
  }
}

window.addEventListener("DOMContentLoaded", function() {
  Flipsnap('.flipsnap', {
    distance: 230,
    transitionDuration: 250
  });
}, false);
