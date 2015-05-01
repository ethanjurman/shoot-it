var Entity = require('./entity');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');
var global = require('../global');

var Bullet = function(position, angle) {
  Entity.call(this);
  this.setGeometry(
      new THREE.BoxGeometry( 1, 1, 1 ),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  this.setPos(new THREE.Vector3(position.x,position.y,position.z - 2));
  var shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
  var body = new CANNON.Body({mass: 1});
  body.addShape(shape);
  body.initVelocity.set(angle.x + 0, angle.y + 0, angle.z + 100);
  body.velocity.set(0, 0, -1);
  body.angularDamping = 0.0;
  this.setPhysicsBody(body);
  this.setCollisionGroup(global.cgroup.BULLET);
  this.setCollisionMask(global.cgroup.WORLD);
  this.setGravity(0);
  setTimeout((function(){
    if (this) {
      this.remove();
    }
  }).bind(this), Bullet.LIVE_TIME_MS);
};

Bullet.prototype = Object.create( Entity.prototype );

Bullet.LIVE_TIME_MS = 1500;
Bullet.IMPACT_DAMAGE = 20;

Bullet.prototype.onCollide = function(e) {
  if (e.body && e.body.entity && e.body.entity.applyDamage) {
    console.log(e);
    e.body.entity.applyDamage(Bullet.IMPACT_DAMAGE);
    this.remove();
  }
};

module.exports = Bullet;
