var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');

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
  var color = color;
  this.setModel('resources/ship1.obj','resources/ship1.mtl',function(){
    self.mesh.scale.set(3,3,3);
    self.setMaterial(new THREE.MeshLambertMaterial({ color: color })); // change to correct color
  });
};
Player.prototype = Object.create( Damageable.prototype );
Player.prototype.userId = -1;

Player.prototype.think = function() {
  //console.log(this.getPos());
};

module.exports = Player;
