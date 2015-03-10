var Entity = require('./entity');

var Damageable = function(health) {
  Entity.call(this);
  this.setHealth(health);
};
Damageable.prototype = Object.create( Entity.prototype );

Damageable.prototype.applyDamage = function(damage) {
  this.setHealth(this.getHealth()-damage);
  if (this.getHealth()<=0) {
    this.setHealth(0);
    if (this.onDestroy)
      this.onDestroy(damage);
    this.remove();
  }
};

Damageable.prototype.getHealth = function() {
  return this.health || 0;
};

Damageable.prototype.setHealth = function(hp) {
  this.health = hp;
};

module.exports = Damageable;
