var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');

var Bullet = function(position, angle) {
  Damageable.call(this, 1);
  this.setGeometry(
      new THREE.BoxGeometry( 1, 1, 1 ),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  this.setPos(new THREE.Vector3(position.x,position.y,position.z - 2));
  var shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
  var body = new CANNON.Body({mass: 1});
  body.addShape(shape);
  body.initVelocity.set(angle.x + 0, angle.y + 0, angle.z + 100);
  body.angularDamping = 0.5;
  this.setPhysicsBody(body);
  this.setGravity(0);
  this.countUp = 0;
};

Bullet.prototype = Object.create( Damageable.prototype );

Bullet.prototype.think = function() {

};

module.exports = Bullet;
