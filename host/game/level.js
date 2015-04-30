var generators = require('./generators');
var THREE = require('./libs/three');
var Entity = require('./entity/entity');

var LEVEL_SEGMENTS = 60;

//TODO: Generators that aren't full random, but have theme and cohesion, ala minecraft biomes
var Level = function(seed) {
  this.points = [new THREE.Vector3(0,0,0)];
  generators.Random(this, LEVEL_SEGMENTS - 2);
  
  var spline = new THREE.SplineCurve3(this.points);
  
  var geometry = new THREE.Geometry();
  geometry.vertices = spline.getPoints(LEVEL_SEGMENTS * 20);
  
  // material
  var material = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } );

  // line
  this.line = new THREE.Line( geometry, material );
  
  Entity.scene.add(this.line);
};

Level.prototype = {};

Level.prototype.remove = function() {
  
  Entity.scene.remove();
};

module.exports = Level;