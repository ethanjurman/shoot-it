var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');
/*jshint -W079 */ var global = require('../global');
var Bullet = require('./bullet');
var global = require('../global');

var Player = function(color) {
  Damageable.call(this, 3);
  // base square ... not in use anymore?
  this.setGeometry(
      new THREE.BoxGeometry( 10, 10, 10 ),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  var shape = new CANNON.Box(new CANNON.Vec3(10, 10, 10));
  var body = new CANNON.Body({mass: 0});
  body.addShape(shape);
  body.angularVelocity.set(0,0,0);
  this.setPhysicsBody(body);
  this.setGravity(0);
  var self = this;
  this.color = color;
  this.setModel('resources/ship1.obj','resources/ship1.mtl',function(){
    self.setMaterial(new THREE.MeshLambertMaterial({ color: self.color })); // change to correct color
  });
  this.motion = {y:0,z:0};
  this.firing = false; // when set to true, do fire action, then set to false

  // starting relative position in xy space. 0,0 is the left bottom; 1,1 is right top.
  this.relativePos = {y:0,z:0};
};

Player.prototype = Object.create( Damageable.prototype );
Player.prototype.userId = -1;

Player.prototype.think = function() {
  if (this.motion) {
    // getting the camera
    var cameraPos = global.game.camera.position;
    var cameraRot = global.game.camera.rotation;

    // set the relative position based on the motion and previous relative position
    this.relativePos.y = Math.max(-1,Math.min(1,this.relativePos.y + this.motion.y / 100));
    this.relativePos.z = Math.max(-1,Math.min(1,this.relativePos.z + this.motion.z / 100));
    // y backwards?
    var forwardVector = new THREE.Vector3(this.relativePos.y*10,-this.relativePos.z*5, -10).applyEuler(cameraRot);
    this.setPos((new THREE.Vector3()).addVectors(cameraPos, forwardVector));
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
  new Bullet(this.getPos(), this.Forward);
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
