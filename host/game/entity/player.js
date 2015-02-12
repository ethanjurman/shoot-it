var Damageable = require('./damageable');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');

var Player = function() {
  Damageable.call(this, 100);
  this.setGeometry(
      new THREE.BoxGeometry( 10, 10, 30 ),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  var shape = new CANNON.Box(new CANNON.Vec3(10, 10, 30));
  var body = new CANNON.Body({mass: 100});
  body.addShape(shape);
  body.angularVelocity.set(0,0,0);
  body.angularDamping = 0.5;
  this.setPhysicsBody(body);
  this.setGravity(0);
};
Player.prototype = Object.create( Damageable.prototype );
Player.prototype.userId = -1;

Player.prototype.think = function() {
  //console.log(this.getPos());
};
  
module.exports = Player;