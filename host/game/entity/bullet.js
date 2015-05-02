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
  this.setPos(new THREE.Vector3(position.x,position.y,position.z - 5));
  var shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
  var body = new CANNON.Body({mass: 10});
  body.addShape(shape);
  var dir = (new THREE.Vector3()).subVectors(global.game.camera.lookAtPos,global.game.camera.position).normalize().multiplyScalar(3);
  body.velocity.set(dir.x, dir.y, dir.z);
  body.angularDamping = 0.0;
  this.setPhysicsBody(body);
  this.setCollisionGroup(global.cgroup.BULLET);
  this.setCollisionMask(global.cgroup.WORLD | global.cgroup.ENEMY);
  this.setGravity(0);
  setTimeout((function(){
    if (this) {
      this.remove();
    }
  }).bind(this), Bullet.LIVE_TIME_MS);
};

Bullet.prototype = Object.create( Entity.prototype );

Bullet.LIVE_TIME_MS = 1500;
Bullet.IMPACT_DAMAGE = 100;

Bullet.prototype.onCollide = function(e) {
  if (e.body && e.body.entity && e.body.entity.applyDamage) {
    console.log('Bullet colliding with: ', e.body.entity);
    e.body.entity.applyDamage(Bullet.IMPACT_DAMAGE);
  }
  this.remove();
};

module.exports = Bullet;
