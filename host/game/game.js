var THREE = require('./libs/three');
var Physijs = require('./libs/physi');
var Entity = require('./entity/entity');

Physijs.scripts.worker = '/physijs_worker.js';
Physijs.scripts.ammo = '/ammo.js';

var Game = function() {

  this.path = [new THREE.Vector3(0,10,200), new THREE.Vector3(0,200,0), new THREE.Vector3(200,10,0)];
  this.ttl = 4000;
  
  this.initScene();

  var self = this;
  var handleResize = function() {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
  };
  window.addEventListener( 'resize', handleResize, false );
};

Game.prototype.render = function() {
  this.scene.simulate(); // run physics
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
  this.time = Date.now();
  this.renderer = new THREE.WebGLRenderer({
    devicePixelRatio: 1,
    alpha: false,
    clearColor: 0xffffff,
    antialias: true
  });
  this.renderer.setClearColor(0xffffff);
  this.renderer.setSize( window.innerWidth, window.innerHeight );

  this.scene = new Physijs.Scene();


  this.camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  this.camera.position.set( 60, 50, 60 );
  this.camera.lookAt( this.scene.position );
  this.scene.add( this.camera );

  this.scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

  this.floor = new Physijs.BoxMesh(
    new THREE.BoxGeometry( 1000, 1, 1000 ),
    new THREE.MeshPhongMaterial({ color: 0x666666 }),
    0 //0 mass, ground.
  );
  this.floor.receiveShadow = true;
  this.scene.add( this.floor );
  
  this.scene.setGravity(new THREE.Vector3(0,-15,0));

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

  Entity.setWorld(this.scene); //Set up the entity system to work with this environment
  this.requestAnimationFrame();
};

module.exports = Game;