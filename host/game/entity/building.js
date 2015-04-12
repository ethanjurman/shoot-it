var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');

var Building = function(xPos, yPos, zPos) {
  //Y position should be 0
  Damageable.call(this, 100);
  // base square ... not in use anymore?
  this.setGeometry(
      new THREE.BoxGeometry( 1, 1, 1 ),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  var shape = new CANNON.Box(new CANNON.Vec3(10, 10, 10));
  var body = new CANNON.Body({mass: 100});
  body.addShape(shape);
  body.angularVelocity.set(0,0,0);
  body.angularDamping = 0.5;
  this.setPhysicsBody(body);
  this.setGravity(0);
  this.setPos(new THREE.Vector3(xPos,yPos,zPos));
};

Building.prototype = Object.create( Damageable.prototype );
Building.prototype.userId = -1;

Building.prototype.think = function() {

};

module.exports = Building;
