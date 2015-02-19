var generators = require('./generators/all');
var THREE = require('./libs/three');
var Entity = require('./entity/entity');

var LEVEL_SEGMENTS = 60;

//TODO: Generators that aren't full random, but have theme and cohesion, ala minecraft biomes
var Level = function(seed) {
  this.points = [new THREE.Vector3(0,0,0)];
  generators.Random(this, LEVEL_SEGMENTS - 2);
  
  this.path = new THREE.SplineCurve3(this.points);
  
  var geometry = new THREE.Geometry();
  geometry.vertices = this.path.getPoints(LEVEL_SEGMENTS * 20);
  
  // material
  var material = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 8 } );

  // line
  this.line = new THREE.Line( geometry, material );
  
  Entity.scene.add(this.line);
};

Level.prototype = {};

Level.prototype.remove = function() {
  
  Entity.scene.remove(this.line);
};

module.exports = Level;