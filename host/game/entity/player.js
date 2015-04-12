var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');
var global = require('../global');

var Player = function(color) {
  Damageable.call(this, 100);
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
  this.motion = new THREE.Vector3();
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
};

Player.prototype.fire = function(){
  // fires a laser bullet thingy
  console.log("FIRING");
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
