var invert = {
  x:(localStorage.getItem('inv_x') === 'true') || false,
  y:(localStorage.getItem('inv_y') === 'true') || false,
  z:(localStorage.getItem('inv_z') === 'true') || false};
var count = 0; // trigger an event if the count
if (window.DeviceMotionEvent != undefined) {
  var motion = {}
  var socket = io();
  window.ondevicemotion = function(e) {
    count++;
    motion.x = (invert.x ? -1 : 1) * (e.accelerationIncludingGravity.x*2).toFixed();
    motion.y = (invert.y ? -1 : 1) * (e.accelerationIncludingGravity.y*2).toFixed();
    motion.z = (invert.z ? -1 : 1) * (e.accelerationIncludingGravity.z*2).toFixed();
    var alpha = (e.rotationRate.alpha*10);
    var beta = (e.rotationRate.beta*10);
    var gamma = (e.rotationRate.gamma*10);
    var rate = (Math.abs(alpha) + Math.abs(beta) + Math.abs(gamma));
    if ((rate >= 1) || (rate == 0)){
      // threshold for updating plane and we're due for a update
      updatePlane(motion);
    }
  }
}

deviceFire = function(){
  var socket = io();
  socket.emit("fire");
  var fireButton = document.getElementById("fire");
  fireButton.style.background = "darkblue";
  window.navigator.vibrate(50); // vibrate for 50ms

  window.setTimeout(function(){
    fireButton.style.background = "darkred";
  },250);
}
updatePlane = function(motion){
  socket.emit("update plane",motion); // this goes to index.js
}

fullscreenToggle = function(){
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}

window.onload = function(){
  var socket = io();
  socket.emit('add plane',localStorage.getItem('color')||'0x777777');
}
