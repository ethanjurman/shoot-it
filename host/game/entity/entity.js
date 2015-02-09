var Physijs = require('../libs/physi');
var THREE = require('../libs/three');
var OBJMTLLoader = require('../libs/loaders/OBJMTLLoader');
/*
Entity.js - A Wrapper around Physi.js and Three.js that provides a
  game-esque 3d entity system
*/

/**
* Construct a generic physically simulated entity object
*/
var Entity = function(model, phys, mass, cb) {
  var self = this;
  this.setMeshType(phys || Physijs.BoxMesh);
  if (model) this.setModel(model, cb);
  this.setMass(mass || 0);
};


if (!String.prototype.endsWith) { //Polyfill
  console.log('Polyfill for endsWith enabled');
  String.prototype.endsWith = function(subs) {
    return (this.indexOf(subs)>-1) && (this.indexOf(subs)===(this.length-subs.length));
  };
}

Entity.prototype.setMeshType = function(cfunc) {
  this.meshcon = cfunc;
};

/**
* Set the entity's model, optional callback for when complete
*/
Entity.prototype.setModel = function(path, cb, cb2) {
  var mtlurl = null;
  if (cb2) {
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
        self._physobj = object; //Add w/o physics simulation
        self._physobj.castShadow = true;
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
  var facemat = null;
  if (mats && mats.length>0) {
    facemat = mats[0];
  } else {
    facemat = new THREE.MeshLambertMaterial({ color: 0xdedede });
  }

  var tGeom = null;
  if (geom instanceof THREE.Geometry) {
    tGeom = geom;
  } else {
    tGeom = geom.children[0].geometry; //Need to check if there's a situation where this is incorrect to assume
  }

  if (this._physobj) {
    var pos = this.getPos();
    var rot = this.getRotation();
    this.world.remove(this._physobj);
    this._physobj = new this.meshcon(tGeom, facemat);
    this.addToWorld();
    this.setPos(pos);
    this.setRotation(rot);
    this.setGravity(this.gravity);
  } else {
    this._physobj = new this.meshcon(tGeom, facemat); //Assume worst case for phys meshes
    this.addToWorld();
    this.setPos(this.pos || new THREE.Vector3());
    this.setRotation(this.rot || new THREE.Quaternion());
    this._physobj.gravity = this.gravity;
  }
  this._physobj.mass = this.mass;
  this._physobj.castShadow = true;
  //this._physobj.recieveShadow = true; //Self-shadowing makes it slow on bad machines
};

/**
* Set the physobj's mass
*/
Entity.prototype.setMass = function(mass) {
  this.mass = mass;
  if (this._physobj)
    this._physobj.mass = mass;
};

/**
* Set the scene entities are added to on a global basis
*/
var world = null;
Entity.setWorld = function(scene) {
  world = scene;
};

/**
* Add the entity to the world/given scene
*/
Entity.prototype.addToWorld = function(scene) {
  if (scene) {
    scene.add(this._physobj);
    this.world = scene;
  } else if (world) {
    world.add(this._physobj);
    this.world = world;
  }

  var self = this;
  this._physobj.entity = this;
  var handler = function(otherthing, linvel, angvel, normal) {
    if (self.onCollision) {
      self.onCollision(otherthing.entity || "world", linvel, angvel, normal);
    }
  }

  this._physobj.traverse(function(obj) {
    obj.entity = self;
    obj.addEventListener('collision', function(event) {
      handler(event.object, event.linvel, event.angvel, event.normal);
    }, false);
  });
};

/**
* Set the entity's position
*/
Entity.prototype.setPos = function(vec) {
  this.pos = vec;
  if (this._physobj) {
    this._physobj.position = vec;
    this._physobj.__dirtyPosition = true;
  }
};

/**
* Get the entity's position (may error if physobj hasn't loaded yet)
*/
Entity.prototype.getPos = function() {
  return this._physobj.position;
};

/**
* Set the entity's rotation
*/
Entity.prototype.setRotation = function(quat) {
  this.rot = quat;
  if (this._physobj) {
    this._physobj.quaternion = quat;
    this._physobj.__dirtyRotation = true;
  }
};  

/**
* Get the entity's rotation (may error if the physobj hasn't been loaded yet)
*/
Entity.prototype.getRotation = function() {
  return this._physobj.quaternion;
};

/**
* Remove the entity from the world
*/
Entity.prototype.remove = function() {

  if (this.onRemove)
    this.onRemove();

  this.world.remove(this._physobj);
};

/**
* Apply a central force to the object
*/
Entity.prototype.applyForce = function(vec) {
  if (this._physobj) {
    this._physobj.applyCentralForce(vec);
  }
};

/**
* Set the gravitational force applied ot the object
*/
Entity.prototype.setGravity = function(g) {
  this.gravity = g;
  if (this._physobj)
    this._physobj.gravity = g;
};

/**
* Get the forward vector of the object in world coordinates
*/
Entity.prototype.Forward = function() {
  var local = new THREE.Vector3(0,0,-1);
  var world = local.applyMatrix4(this._physobj.matrixWorld);
  var dir = world.sub(this._physobj.position).normalize();

  return dir;
};

module.exports = Entity;