var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');
var Bullet = require('./bullet');

var Enemy = function(type) {
  // type = 2 - firing ship
  // type = 3 - drone
  // type = 4 - boss?
  Damageable.call(this, 1);
  // base square ... not in use anymore?
  this.setGeometry(
      new THREE.BoxGeometry( 10, 10, 10 ),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  var shape = new CANNON.Box(new CANNON.Vec3(10, 10, 10));
  var body = new CANNON.Body({mass: 100});
  body.addShape(shape);
  body.angularVelocity.set(0,0,0);
  body.angularDamping = 0.5;
  this.setPhysicsBody(body);
  this.setGravity(0);
  var self = this;
  this.setModel('resources/ship'+type+'.obj','resources/ship'+type+'.mtl',function(){
    self.mesh.scale.set(3,3,3);
  });
  this.motion = null;
  this.firing = false; // when set to true, do fire action, then set to false
};

Enemy.prototype = Object.create( Damageable.prototype );
Enemy.prototype.userId = -1;

Enemy.prototype.think = function() {
  if (this.motion) {
    // set position
  }
  if (this.firing) {
    this.fireProjectile();
    this.firing = false;
  }
};

Enemy.prototype.fire = function(){
  // sets the Enemy to fire a projectile
  this.firing = true;
};

Enemy.prototype.fireProjectile = function(){
  // fires the projectile once
  new Bullet(this.getPos(), new THREE.Vector3(this.motion.x,this.motion.y,5).normalize());
}


module.exports = Enemy;
