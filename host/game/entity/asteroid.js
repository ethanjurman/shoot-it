var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');

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
  body.angularVelocity.set(0,0,0);
  body.angularDamping = 0.5;
  this.setPhysicsBody(body);
  this.setGravity(0);
  this.setPos(new THREE.Vector3(xPos,yPos,zPos));
};

Asteroid.prototype = Object.create( Damageable.prototype );
Asteroid.prototype.userId = -1;

Asteroid.prototype.think = function() {

};

module.exports = Asteroid;
