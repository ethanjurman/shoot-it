var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');
var global = require('../global');

var Asteroid = function(xPos, yPos, zPos, size) {
  size = size || 1;
  //Y position should be 0
  Damageable.call(this, 100);
  // base square ... not in use anymore?
  this.setGeometry(
      new THREE.SphereGeometry( size, 10),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  var shape = new CANNON.Sphere(size);
  var body = new CANNON.Body({mass: 100});
  body.addShape(shape);
  // body.angularVelocity.set(Math.random(),0,Math.random());
  body.angularDamping = 0.5;
  this.setPhysicsBody(body);
  this.setCollisionGroup(global.cgroup.WORLD);
  this.setGravity(0);
  this.setPos(new THREE.Vector3(xPos,yPos,zPos));
  var type = Math.ceil(Math.random()*2)+1; // random type
  // this.setModel('resources/asteroid'+type+'0.obj','resources/asteroid'+type+'0.mtl',function(){});
  // this.mesh.scale.set(size,size,size);
  // this.rotation = new THREE.Vector3(Math.random()*10,Math.random()*10,Math.random()*10);
};

Asteroid.prototype = Object.create( Damageable.prototype );
Asteroid.prototype.userId = -1;

Asteroid.prototype.think = function() {

};

module.exports = Asteroid;
