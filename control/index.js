var calibration = {
  motionInUpDirection: function(vec) {
    return Math.min(Math.max(vec.z/12, -1), 1);
  },
  motionInRightDirection: function(vec) {
    return Math.min(Math.max(vec.y/12, -1), 1);
  },
  rate:0.1
};

var invert = {x:false,y:false,z:false};
var count = 0; // trigger an event if the count


if (window.DeviceMotionEvent != undefined) {
  var motion = {}
  var socket = io();
  window.ondevicemotion = function(e) {
    count++;
    motion.x = (invert.x ? -1 : 1) * (e.accelerationIncludingGravity.x*2).toFixed();
    motion.y = (invert.y ? -1 : 1) * (e.accelerationIncludingGravity.y*2).toFixed();
    motion.z = (invert.z ? -1 : 1) * (e.accelerationIncludingGravity.z*2).toFixed();

    var newY = calibration.motionInRightDirection(motion);
    var newZ = calibration.motionInUpDirection(motion);
    motion.y = newY*15; // TODO don't have to multiply these by 12
    motion.z = newZ*15; //      this is done for compatability's sake

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
  alert('called');
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

// Begins motion calibration. Starts by asking the user to move all the way
// forward
window.calibrateMotionStart = function calibrateMotionStart() {
  var button = document.getElementById('motion-calibrate');
  var originalButtonText = button.innerHTML;
  button.innerHTML = 'Press when all the way up';

  var startPos = getCurrentMotion();
  button.onclick = function() {
    var upPos = getCurrentMotion();
    button.innerHTML = 'Press when all the way down';

    button.onclick = function() {
      var downPos = getCurrentMotion();
      button.innerHTML = 'Press when all the way left';

      button.onclick = function() {
        var leftPos = getCurrentMotion();
        button.innerHTML = 'Press when all the way right';

        button.onclick = function() {
          var rightPos = getCurrentMotion();
          button.innerHTML = originalButtonText;
          button.onclick = calibrateMotionStart;

          calibrateFromParams(startPos, upPos, downPos, leftPos, rightPos);
        }
      }
    }
  }
}


// Calibrates the controller's motion given vectors representing the device's
// motion while centered, all the way up, all the way down, all the way left,
// and all the way right
// args: center, up, down, left, right
//         - all objects of form {x:<int>, y:<int>, z:<int>}
function calibrateFromParams(center, up, down, left, right) {
  var normCenter = normalize(
    add(center, add(up, add(down, add(left, right))))
  );

  // -- Figure out which way is 'up' --
  // project 'up' and 'down' into the plane that has center as its normal
  var upPrime = normalize(subtract(normalize(up), normCenter));
  var downPrime = normalize(subtract(normalize(down), normCenter));
  // negate down's direction and average it with up to get the unit up
  // direction
  var upAvg = normalize(add(upPrime, negate(downPrime)));
  // Get the max/min values of up and down
  var maxUp = dot(upAvg, up);
  var maxDown = dot(upAvg, down);
  calibration.motionInUpDirection = function(pos) {
    // dot the given position with the average 'up'
    var dotted = dot(pos, upAvg);
    var perc = (dotted - maxDown) / (maxUp - maxDown);
    var ret = perc*2-1;
    return -Math.min(Math.max(ret, -1), 1); // TODO figure out why this is negative
  }

  // -- Figure out which way is 'left' --
  // proceed by the same method as above
  var leftPrime = normalize(subtract(normalize(left), normCenter));
  var rightPrime = normalize(subtract(normalize(right), normCenter));
  var rightAvg = normalize(add(rightPrime, negate(leftPrime)));
  var maxLeft = dot(rightAvg, left);
  var maxRight = dot(rightAvg, right);
  calibration.motionInRightDirection = function(pos) {
    var dotted = dot(pos, rightAvg);
    var perc = (dotted - maxLeft) / (maxRight - maxLeft);
    var ret = perc*2-1;
    return Math.min(Math.max(ret, -1), 1);
  }
}


// Returns the dot product of two vectors
function dot(vec1, vec2) {
  return vec1.x * vec2.x +
         vec1.y * vec2.y +
         vec1.z * vec2.z;
}


// Normalizes a vector (x, y, z). Returns the normalized vector.
function normalize(vec) {
  var len = Math.sqrt(vec.x*vec.x + vec.y*vec.y + vec.z*vec.z);
  return {
    x: vec.x/len,
    y: vec.y/len,
    z: vec.z/len
  }
}


// Subtracts vec2 from vec1. Returns the difference.
function subtract(vec1, vec2) {
  return add(vec1, negate(vec2));
}


// Adds two vectors. Returns the sum.
function add(vec1, vec2) {
  return {
    x: vec1.x + vec2.x,
    y: vec1.y + vec2.y,
    z: vec1.z + vec2.z
  }
}


// Negates a vector. Returns the negated vector.
function negate(vec) {
  return {
    x: -vec.x,
    y: -vec.y,
    z: -vec.z
  }
}

// Returns the current device's motion as
// {x: <int>, y: <int>, z: <int>}
function getCurrentMotion() {
  return {
    x: parseInt(document.getElementById('x').innerHTML),
    y: parseInt(document.getElementById('y').innerHTML),
    z: parseInt(document.getElementById('z').innerHTML)
  }
}


window.onload = function(){
  var socket = io();
  socket.emit('add plane');
}
