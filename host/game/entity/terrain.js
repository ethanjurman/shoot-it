var Entity = require('./entity');
var THREE = require('../libs/three');
var CANNON = require('../libs/cannon');
var global = require('../global');

var Terrain = function(xPos, yPos, zPos, xSize, ySize, zSize) {
  //Y position should be 0
  Entity.call(this);
  // base square ... not in use anymore?
  this.setGeometry(
      new THREE.BoxGeometry(xSize, ySize, zSize),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
  );
  var shape = new CANNON.Box(new CANNON.Vec3(xSize/2, ySize/2, zSize/2));
  var body = new CANNON.Body({mass: 10000, angularDamping: 0, linearDamping: 0});
  body.addShape(shape);
  this.setPhysicsBody(body);
  this.setCollisionGroup(global.cgroup.WORLD);
  this.setCollisionMask(global.cgroup.PLAYER | global.cgroup.BULLET);
  this.setGravity(0);
  this.setPos(new THREE.Vector3(xPos,yPos,zPos));
};

Terrain.prototype = Object.create( Entity.prototype );

module.exports = Terrain;
