var Damageable = require('./damageable');
var THREE = require('../libs/three');

var Player = function() {
  Damageable.call(this, null, null, 0, 100, function() {});
  this.setGeometry(
      new THREE.BoxGeometry( 10, 10, 30 ),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  this.setGravity(0);
};
Player.prototype = Object.create( Damageable.prototype );
Player.prototype.userId = -1;
  
module.exports = Player;