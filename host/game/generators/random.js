var THREE = require('../libs/three');
var Asteroid = require('../entity/asteroid');
var hook = require('../hook');

var VARIANCE = 20;

var Random = function(level, remaining) {
  var point = level.points[level.points.length-1].clone().add(new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-1).normalize().multiplyScalar(VARIANCE));
  level.points.push(point);
  //Making asteroids
  for(var i = 0; i < 10; i++) {
    var asteroid = new Asteroid(
      point.x+(Math.random()*(VARIANCE)-VARIANCE/2),
      point.y+(Math.random()*(VARIANCE)-VARIANCE/2),
      point.z+(Math.random()*(VARIANCE)-VARIANCE/2),
      (Math.random()*2)+1);
  }
  if (remaining > 0)
    Random(level, remaining - 1);
/*
  hook.add('progress', function progressHook(t) {
    if (t - ((60 - remaining)/60) <= 0.001) {
      console.log(remaining, ((60 - remaining)/60), t);
      hook.remove('progress', progressHook);
    }
  });
  */
};

module.exports = Random;
