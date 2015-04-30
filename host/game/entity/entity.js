var CANNON = require('../libs/cannon');
var THREE = require('../libs/three');
var OBJMTLLoader = require('../libs/loaders/OBJMTLLoader');
var hook = require('../hook');
var global = require('../global');
/*
Entity.js - A Wrapper around Cannon.js and Three.js that provides a
  game-esque 3d entity system
*/



if (!String.prototype.endsWith) { //Polyfill
  String.prototype.endsWith = function(subs) {
    return (this.indexOf(subs)>-1) && (this.indexOf(subs)===(this.length-subs.length));
  };
}


/**
* Construct a generic physically simulated entity object
*/
var Entity = function() {
  Entity._registry.push(this);
};

/**
* Set the entity's model, optional callback for when complete
*/
Entity.prototype.setModel = function(path, cb, cb2) {
  var mtlurl = null;
  if (!(cb instanceof Function)) {
    mtlurl = cb; cb = cb2;
  }
  var self = this;
  var loader;
  if (path.endsWith('.js') || path.endsWith('.json')) {
    loader = new THREE.JSONLoader(); //Will error if loader isn't defined
    loader.load(path, function(geometry, mats) {
      self.setGeometry(geometry, mats);
      if (cb) cb(self);
    });
  } else if (path.endsWith('.obj')) {
    if (mtlurl) {
      loader = new THREE.OBJMTLLoader(); //Special, textured, snowflake
      loader.load(path, mtlurl, function(object) {
        if (self.mesh) {
          object.position.copy(self.mesh.position);
          object.rotation.copy(self.mesh.rotation);
          Entity.scene.remove(self.mesh);
        }
        self.mesh = object; //Add w/o physics simulation
        self.mesh.castShadow = true;
        Entity.scene.add(self.mesh);
        if (cb) cb(self);
      });
    } else {
      loader = new THREE.OBJLoader();
      loader.load(path, function(geometry, mats) {
        self.setGeometry(geometry, mats);
        if (cb) cb(self);
      });
    }
  } else if (path.endsWith('.dae')) {
    loader = new THREE.ColladaLoader();
    loader.load(path, function(geometry, mats) {
      self.setGeometry(geometry, mats);
      if (cb) cb(self);
    });
  }
};

/**
* Set the raw geometry object being used in the entity
*/
Entity.prototype.setGeometry = function(geom, mats) {
  var facemat = new THREE.MeshLambertMaterial({ color: 0xdedede });
  if (mats && mats.length>0) {
    facemat = mats[0];
  }

  var tGeom = null;
  if (geom instanceof THREE.Geometry) {
    tGeom = geom;
  } else {
    tGeom = geom.children[0].geometry; //Need to check if there's a situation where this is incorrect to assume
  }

  if (this.mesh) {
    var pos = this.getPos();
    var rot = this.getRotation();
    Entity.scene.remove(this.mesh);
    this.mesh = new THREE.Mesh(tGeom, facemat);
    Entity.scene.add(this.mesh);
    this.setPos(pos);
    this.setRotation(rot);
  } else {
    this.mesh = new THREE.Mesh(tGeom, facemat); //Assume worst case for phys meshes
    Entity.scene.add(this.mesh);
    this.setPos(this.pos || new THREE.Vector3());
    this.setRotation(this.rot || new THREE.Quaternion());
  }
  this.mesh = new THREE.Mesh(tGeom, facemat); //Assume worst case for phys meshes
  Entity.scene.add(this.mesh);
  this.setPos(this.pos || new THREE.Vector3());
  this.setRotation(this.rot || new THREE.Quaternion());
  this.mesh.castShadow = true;
};

Entity.prototype.setMaterial = function( mat ) {
  this.mesh.traverse(function(child){
    child.material = mat;
    child.material.needsUpdates = true;
  });
};

Entity.prototype.setPhysicsBody = function(body) {
  if (this.body) {
      Entity.world.removeBody(this.body);
      body.gravity = this.body.gravity;
  }
  body.position.copy(this.mesh.position);
  body.quaternion.copy(this.mesh.quaternion);
  this.body = body;
  body.entity = this;

  body.addEventListener("collide",function(e){
      //console.log("Collided with body:",e.body);
      //console.log("Contact between bodies:",e.contact);
      //console.log(e.body.entity);
      //e.body.entity.remove();
  });

  Entity.world.addBody(this.body);
};

/**
* Set the physobj's mass
*/
Entity.prototype.setMass = function(mass) {
  this.mass = mass;
  if (this.body)
    this.body.mass = mass;
};

/**
* Set the scene entities are added to on a global basis
*/
Entity.setWorld = function(o) {
  Entity.world = o;
};

/**
* Set the scene entities are added to on a global basis
*/
Entity.setScene = function(o) {
  Entity.scene = o;
};

Entity._registry = [];
hook.add('think', function(deltatime) {
  for (var i=0; i<Entity._registry.length; i++) {
    var ent = Entity._registry[i];
    if (ent.mesh && ent.body) {
        ent.mesh.position.copy(ent.body.position);
        ent.mesh.quaternion.copy(ent.body.quaternion);
    }
  }

  for (var i=0; i<Entity._registry.length; i++) {
    var ent2 = Entity._registry[i];
    if (ent2.think) {
      ent2.think(deltatime);
    }
  }
});

/**
* Set the entity's position
*/
Entity.prototype.setPos = function(vec) {
  this.pos = vec;
  if (this.mesh) {
    this.mesh.position.set(vec.x, vec.y, vec.z);
  }
  if (this.body) {
    this.body.position.set(vec.x, vec.y, vec.z);
  }
};

/**
* Get the entity's position (may error if physobj hasn't loaded yet)
*/
Entity.prototype.getPos = function() {
  return this.mesh.position;
};

/**
* Set the entity's rotation
*/
Entity.prototype.setRotation = function(quat) {
  this.rot = quat;
  if (this.body) {
    this.body.quaternion.copy(quat);
  }
  if (this.mesh) {
    this.mesh.quaternion.copy(quat);
  }
};

/**
* Get the entity's rotation (may error if the physobj hasn't been loaded yet)
*/
Entity.prototype.getRotation = function() {
  return this.mesh.quaternion;
};

/**
* Remove the entity from the world
*/
Entity.prototype.remove = function() {

  if (this.onRemove)
    this.onRemove();

  Entity._registry.splice(Entity._registry.indexOf(this), 1);

  Entity.world.remove(this.body);
  Entity.scene.remove(this.mesh);
};

/**
* Apply a central force to the object
*/
Entity.prototype.applyForce = function(vec) {
  if (this.body) {
    this.body.applyCentralForce(vec); //may not be right
  }
};

/**
* Set the gravitational force applied ot the object
*/
Entity.prototype.setGravity = function(g) {
  this.gravity = g;
  if (this.body)
    this.body.gravity = g;
};

/**
* Get the forward vector of the object in world coordinates
*/
Entity.prototype.Forward = function() {
  var local = global.forward.clone();
  var world = local.applyMatrix4(this.mesh.matrixWorld);
  var dir = world.sub(this.mesh.position).normalize();

  return dir;
};

module.exports = Entity;
