var generators = require('./');
var THREE = require('../libs/three');

var VARIANCE = 50;

var Random = function(level, remaining) {
  var point = level.points[level.points.length-1].clone().add(new THREE.Vector3(Math.random(),Math.random(),Math.random()).multiplyScalar(VARIANCE));
  level.points.push(point);
  if (remaining > 1) 
    generators.Random(level, remaining - 1);
};

module.exports = Random;