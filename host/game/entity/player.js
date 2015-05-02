var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');
/*jshint -W079 */ var global = require('../global');
var Bullet = require('./bullet');
var Score = require('../score');

var Player = function(color, initials) {
  Damageable.call(this, Player.MAX_HEALTH);
  // base square ... not in use anymore?
  this.setGeometry(
      new THREE.BoxGeometry( 5, 5, 5 ),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  var shape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
  var body = new CANNON.Body({mass: 0});
  body.addShape(shape);
  body.angularVelocity.set(0,0,0);
  this.setPhysicsBody(body);
  this.setCollisionGroup(global.cgroup.PLAYER);
  this.setCollisionMask(global.cgroup.WORLD);
  this.setGravity(0);
  this.score = 0;
  var self = this;
  this.color = color;
  this.setModel('resources/ship1.obj','resources/ship1.mtl',function(){
    self.setMaterial(new THREE.MeshLambertMaterial({ color: self.color })); // change to correct color
  });
  this.motion = {y:0,z:0};
  this.firing = false; // when set to true, do fire action, then set to false

  // starting relative position in xy space. 0,0 is the left bottom; 1,1 is right top.
  this.relativePos = {y:0,z:0};
  this.score = new Score(initials, 0);
};

Player.prototype = Object.create( Damageable.prototype );
Player.prototype.userId = -1;

Player.prototype.think = function() {
  if (this.motion) {
    // getting the camera
    var cameraPos = global.game.camera.position;
    var cameraRot = global.game.camera.rotation;

    // set the relative position based on the motion and previous relative position
    this.relativePos.y = Math.max(-1.5,Math.min(1.5,this.relativePos.y + this.motion.y / 500));
    this.relativePos.z = Math.max(-1.5,Math.min(1.5,this.relativePos.z + this.motion.z / 300));
    // y backwards?
    var forwardVector = new THREE.Vector3(this.relativePos.y*10,-this.relativePos.z*5, -10).applyEuler(cameraRot);
    var positionVector = (new THREE.Vector3()).addVectors(cameraPos, forwardVector);
    this.setPos(new THREE.Vector3(positionVector.x, positionVector.y, cameraPos.z - 10));
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
  new Bullet(
    this, 
    this.getPos(), 
    (new THREE.Vector3()).subVectors(global.game.camera.lookAtPos,global.game.camera.position).normalize().multiplyScalar(3)
  );
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

Player.prototype.onCollide = function(e) {
  if (e.body && e.body.entity && e.body.entity.applyDamage) {
    console.log('Player colliding with: ', e.body.entity);
    e.body.entity.applyDamage(200);
    this.applyDamage(50); 
    this.score.add(-50);
  }
};

Player.prototype.applyDamage = function(damage) {
  /*this.setHealth(this.getHealth()-damage);
  if (this.getHealth()<=0) {
    this.setHealth(0);
    console.log('Player '+this.userId+' destroyed');
    this.setHealth(Player.MAX_HEALTH);
  }*/
  console.log('Player assigned '+damage+' damage.');
};

Player.prototype.onDestroy = function() {
  throw new Error('Player onDestroy should never be called?');
};

Player.MAX_HEALTH = 100;

module.exports = Player;
