var THREE = require('../libs/three');
var Building = require('../entity/building');
var hook = require('../hook');

var VARIANCE = 5;

var Random = function(level, remaining) {
  var point = level.points[level.points.length-1].clone().add(new THREE.Vector3(Math.random()-0.5,Math.random()-0.5,Math.random()-1).normalize().multiplyScalar(VARIANCE));
  level.points.push(point);
  //Making asteroids
  var asteroid = new Building(point.x-5, point.y, point.z);
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
