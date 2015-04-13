var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');

var Bullet = function(position, angle) {
  Damageable.call(this, 1);
  this.setGeometry(
      new THREE.BoxGeometry( 1, 1, 1 ),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  this.setPos(position);
  this.angle = angle;
  var shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
  var body = new CANNON.Body({mass: 1});
  body.addShape(shape);
  body.angularVelocity.set(0,0,0);
  body.angularDamping = 0.5;
  this.setPhysicsBody(body);
  this.setGravity(0);
  this.countUp = 0;
};

Bullet.prototype = Object.create( Damageable.prototype );

Bullet.prototype.think = function() {
  // runs every tick, timesout the bullet
  // 2.5 seconds * 60 frames per second
  if (this.countUp++ > 2.5 * 60) {
    this.remove();
  } else {
    this.setPos((new THREE.Vector3()).addVectors(this.getPos(),this.angle));
  }
};

module.exports = Bullet;
