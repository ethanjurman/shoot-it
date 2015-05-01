var THREE = require('./libs/three');
var CANNON = require('./libs/cannon');
var Entity = require('./entity/entity');
var Level = require('./level');
var hook = require('./hook');
var players = require('./player-store');
var Asteroid = require('./entity/asteroid');

var Game = function() {
  this.initPhysics();
  this.initScene();
  this.initStarfield();
  //this.initLevel();
  //this.makeGrid();

  this.level = new Level(this, Math.random());

  var self = this;
  var handleResize = function() {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
  };
  window.addEventListener( 'resize', handleResize, false );
};

Game.prototype.initStarfield = function() {
    // Starfield    
    var stars = new THREE.Geometry();
    for (var i=0; i<1000; i++) {
      stars.vertices.push(new THREE.Vector3(
        1e3 * Math.random() - 5e2,
        1e3 * Math.random() - 5e2,
        -1e2
      ));
    }
    var star_stuff = new THREE.PointCloudMaterial();
    var star_system = new THREE.PointCloud(stars, star_stuff);
    this.scene.add(star_system);
};

Game.prototype.render = function() {
  this.level.velocity = players.players.length === 0 ? 0 : 0.005;
  var delta = Date.now() - this.time;
  this.world.step(delta/16.666);

  hook.call('think', delta); //Copy all physcoords to world coords, call any think hooks

  this.renderer.render(this.scene, this.camera);

  this.time = Date.now();
  this.requestAnimationFrame();
};

Game.prototype.requestAnimationFrame = function() {
  var self = this;
  requestAnimationFrame( function() {
    self.render();
  });
};

Game.prototype.makeGrid = function() {
  var a = [];
  for(var i = 0; i < 20; i++) {
    a[i] = [];
    for(var j = 0; j < 20; j++) {
      a[i][j] = new Asteroid((i-10)*1.5,-8,(j-10)*1.5);
    }
  }
}

Game.prototype.initLevel = function() {
  //var Asteroid1 = new Asteroid(0);
  var Asteroid2 = new Asteroid(-100);
}

Game.prototype.initScene = function() {
  var self = this;
  this.renderer = new THREE.WebGLRenderer({
    devicePixelRatio: 1,
    antialias: true,
    logarithmicDepthBuffer: true
  });
  this.renderer.setClearColor(0x0000000);
  this.renderer.setSize( window.innerWidth, window.innerHeight );

  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  this.camera.position.set( 0, 0, 50 );
  //this.camera.lookAt( new THREE.Vector3(0, 0, 0) );
  this.scene.add( this.camera );

  this.scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  //Lighting
  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x777777, 0.6 );
  hemiLight.position.set( 0, 500, 0 );
  this.scene.add( hemiLight );
  // Direction Lighting
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
  directionalLight.position.set( 0, 1, 0 );
  this.scene.add( directionalLight );

  this.renderer.shadowMapEnabled = true;
  this.renderer.shadowMapSoft = true;
  this.renderer.sortObjects = false;

  this.time = Date.now();

  document.querySelector( 'body' ).appendChild( this.renderer.domElement );

  Entity.setScene(this.scene); //Set up the entity system to work with this environment
  this.requestAnimationFrame();
};

Game.prototype.initPhysics = function() {
  this.time = Date.now();
  this.world = new CANNON.World();
  this.world.gravity.set(0,0,0);
  this.world.broadphase = new CANNON.NaiveBroadphase();
  this.world.solver.iterations = 10;

  Entity.setWorld(this.world);

};

module.exports = Game;
