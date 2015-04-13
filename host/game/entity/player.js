var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');
/*jshint -W079 */ var global = require('../global');
var Bullet = require('./bullet');

var Player = function(color) {
  Damageable.call(this, 3);
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
  this.color = color;
  this.setModel('resources/ship1.obj','resources/ship1.mtl',function(){
    self.mesh.scale.set(3,3,3);
    self.setMaterial(new THREE.MeshLambertMaterial({ color: self.color })); // change to correct color
  });
  this.motion = null;
  this.firing = false; // when set to true, do fire action, then set to false
};

Player.prototype = Object.create( Damageable.prototype );
Player.prototype.userId = -1;

Player.prototype.think = function() {
  if (this.motion) {

    var t = (global.game.level.distance+2)*global.game.level.timescale;
    var point = global.game.level.path.getPoint(t);

    // set bounding movement
    var planebound = {width: 100, height: 80};
    var x = Math.min(planebound.width/2,Math.max(-planebound.width/2,(this.getPos().x - point.x + this.motion.y/10)));
    var y = Math.min(planebound.height/2,Math.max(-planebound.height/2,(this.getPos().y - point.y - this.motion.z/10)));

    this.setPos((new THREE.Vector3()).addVectors(point, new THREE.Vector3(x,y,0)));
  }
  if (this.firing) {
    this.fireProjectile();
    this.firing = false;
  }
};

Player.prototype.fire = function(){
  // sets the player to fire a projectile
  this.firing = true;
};

Player.prototype.fireProjectile = function(){
  // fires the projectile once
  new Bullet(this.getPos(), new THREE.Vector3(this.motion.y,-this.motion.z,-5).normalize());
};

Player.prototype.applyMotion = function(motion) {
  var x = motion.y;
  var y = motion.z;
  var target = new THREE.Vector3(motion.z, 0, motion.y);
  if (this.mesh) {
      var quat = new THREE.Quaternion();
      quat.setFromAxisAngle(target.normalize(), -Math.PI/4);
      this.setRotation(quat);
  }
  this.motion = motion;
};

module.exports = Player;
