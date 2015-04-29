var generators = require('./generators/all');
var THREE = require('./libs/three');
var Entity = require('./entity/entity');
var hook = require('./hook');
var global = require('./global');
var Asteroid = require('./entity/asteroid');

var LEVEL_SEGMENTS = 60;

//TODO: Generators that aren't full random, but have theme and cohesion, ala minecraft biomes
var Level = function(gameObject, seed) {
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

  this.plane = { position: new THREE.Vector3(), rotation: new THREE.Quaternion() }
  this.plane.position.set(0,0,0);
  this.plane.rotation.set(0,0,0,0);

  this.distance = 0;
  this.velocity = 0.001;
  this.timescale = 1/100;
  var self = this;
  var box = new Asteroid(0,0,0);
  hook.add('think', function levelThink(delta) {
    self.distance += (delta * self.velocity);
    var t = self.distance*self.timescale;
    if (t>1) {
      //level complete
      console.log('level done');
      hook.remove('think', levelThink);
    }
    self.plane.position = self.path.getPoint(t);
    self.plane.rotation.setFromUnitVectors(global.forward, self.path.getTangent(t));
    gameObject.camera.position.set(self.plane.position.x, self.plane.position.y, self.plane.position.z);

    //debug box
    var t2 = (self.distance+1)*self.timescale;

    var boxPos = self.path.getPoint(t2);
    box.setPos(boxPos);
    var quat = new THREE.Quaternion();
    quat.setFromUnitVectors(global.forward, self.path.getTangent(t2));
    box.setRotation(quat);
    // gameObject.camera.lookAt(boxPos);

    hook.call('progress', t);
  });

  window.addEventListener("keyup", function(event) {
    if(event.keyCode == '32'){
      self.velocity = self.velocity === 0 ? 0.001 : 0;
    }
  })
};

Level.prototype = {};

Level.prototype.remove = function() {

  Entity.scene.remove(this.line);
};

module.exports = Level;
