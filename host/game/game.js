var THREE = require('./libs/three');
var CANNON = require('./libs/cannon');
var Entity = require('./entity/entity');
var Level = require('./level');

var Game = function() {
  this.initPhysics();
  this.initScene();
  
  this.level = new Level();

  var self = this;
  var handleResize = function() {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
  };
  window.addEventListener( 'resize', handleResize, false );
};

Game.prototype.render = function() {
  this.world.step((Date.now() - this.time)/16.666);
  
  Entity._think(); //Copy all physcoords to world coords, call any think hooks
  
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

Game.prototype.initScene = function() {
  var self = this;
  this.renderer = new THREE.WebGLRenderer({
    devicePixelRatio: 1,
    antialias: true,
    logarithmicDepthBuffer: true
  });
  this.renderer.setClearColor(0xffffffff);
  this.renderer.setSize( window.innerWidth, window.innerHeight );

  this.scene = new THREE.Scene();

  this.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  this.camera.position.set( 0, 0, 50 );
  this.camera.lookAt( new THREE.Vector3(0, 0, 0) );
  this.scene.add( this.camera );

  this.scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  //Lighting
  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemiLight.color.setHSL( 0.6, 0.75, 0.5 );
  hemiLight.groundColor.setHSL( 0.095, 0.5, 0.5 );
  hemiLight.position.set( 0, 500, 0 );
  this.scene.add( hemiLight );

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
  this.world.gravity.set(0,10,0);
  this.world.broadphase = new CANNON.NaiveBroadphase();
  this.world.solver.iterations = 10;  
  
  Entity.setWorld(this.world);
  
};

module.exports = Game;