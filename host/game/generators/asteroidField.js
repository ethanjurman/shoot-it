var THREE = require('../libs/three');
var Asteroid = require('../entity/asteroid');
var hook = require('../hook');
var global = require('../global');

var VARIANCE = 20;
var NUMASTEROIDS = 5;

var AsteroidField = function(level, remaining) {
  var point = level.points[level.points.length-1].clone().add(new THREE.Vector3(
        Math.random()-0.5/2,
        Math.random()-0.5/2,
        Math.random()-1.5).normalize().multiplyScalar(VARIANCE));

  level.points.push(point);

  var sizes = [];
  var positions = [];
  var tempPos = [0,0,0];
  var tempSize = 0;
  var distance = 0;
  var minDistance = 0;
  var iterations = 0;
  //Making asteroids
  for(var i = 0; i < NUMASTEROIDS; i++) {
    tempSize = (Math.random()*2)+1;
    tempPos = [
      point.x+(Math.random()*(VARIANCE)-VARIANCE/2),
      point.y+(Math.random()*(VARIANCE)-VARIANCE/2),
      point.z+(Math.random()*(VARIANCE)-VARIANCE/2)];

    iterations = 0;
    for(var n = 0; n < sizes.length; n++) {
      distance = Math.sqrt(Math.pow((tempPos[0] - positions[n][0]),2) + Math.pow((tempPos[1] - positions[n][1]),2) + Math.pow((tempPos[2] - positions[n][2]),2));
      minDistance = tempSize + sizes[n];
      //console.log(tempPos);
      //console.log("Distance:",distance,"MinDistance",minDistance);
      while(distance < minDistance && iterations < 5) {
          tempSize = (Math.random()*2)+1;
          tempPos = [
            point.x+(Math.random()*(VARIANCE)-VARIANCE/2),
            point.y+(Math.random()*(VARIANCE)-VARIANCE/2),
            point.z+(Math.random()*(VARIANCE)-VARIANCE/2)];
          distance = Math.sqrt(Math.pow((tempPos[0] - positions[n][0]),2) + Math.pow((tempPos[1] - positions[n][1]),2) + Math.pow((tempPos[2] - positions[n][2]),2));
          minDistance = tempSize + sizes[n];
          n = 0;
          iterations++;
      }
    }

    var asteroid = new Asteroid(
      tempPos[0],
      tempPos[1],
      tempPos[2],
      tempSize);

    sizes.push(tempSize);
    positions.push(tempPos);
  }
  if (remaining > 0)
    AsteroidField(level, remaining - 1);

  var nodeId = global.LEVEL_SEGMENTS - (remaining+1);
  hook.add('node '+nodeId, function progressHook(level) {
    var curPos = level.getPos();
    // console.log('Reached node '+nodeId);
    // console.log(curPos);
  });
};

module.exports = AsteroidField;
