var Damageable = require('./damageable');

var Player = function(model, phys, mass, health, cb) {
  Damageable.call(this, model, phys, mass, health, cb);
};
Player.prototype = Object.create( Damageable.prototype );
  
module.exports = Player;