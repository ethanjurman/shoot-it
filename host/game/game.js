var THREE = require('./libs/three');
var CANNON = require('./libs/cannon');
var Entity = require('./entity/entity');
var Level = require('./level');
var hook = require('./hook');
var players = require('./player-store');
var Asteroid = require('./entity/asteroid');
var global = require('./global');

var Score = function(initials, score){
  this.initials = initials;
  this.score = score;
}

var Game = function() {
  this.initPhysics();
  this.initScene();
  this.initStarfield();
  this.scores = [];

  this.level = new Level(this, Math.random(), new THREE.Vector3(0,0,0));

  var self = this;
  var handleResize = function() {
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
  };
  window.addEventListener( 'resize', handleResize, false );

  hook.add('level done', function levelReset() {
    self.betweenLevel();
  });
};

Game.prototype.addScore = function(initials, score){
  this.scores.push(new Score(initials, score));
  this.scores.sort(function(a,b){return a.score - b.score});
};

Game.prototype.betweenLevel = function() {
  var self = this;
  var pos = self.level.points[global.LEVEL_SEGMENTS -1];
  this.level.remove();
  var highscoreDiv = document.getElementById('highscores');
  highscoreDiv.innerHTML = "";
  highscoreDiv.style.display = "";
  var scoreIndex = self.scores.length;
  var loadScores = setInterval(function(){
    var s = self.scores[--scoreIndex];
    var score = document.createElement("div");
    score.setAttribute("class","score");
    score.setAttribute("data-initials",s.initials);
    score.setAttribute("data-score",s.score);
    highscoreDiv.appendChild(score);
    if (scoreIndex == 0) {window.clearInterval(loadScores);}
  },750);
  var timer = document.getElementById("timer");
  timer.style.display = "";
  var t = 10;
  var loadLevel = setInterval(function(){
    timer.innerHTML = t--;
    console.log(t);
    if (t == 0) {
      self.level = new Level(self, Math.random(), pos);
      highscoreDiv.style.display = "none";
      timer.style.display = "none";
      window.clearInterval(loadLevel);
    }
  },1000);
}

Game.prototype.initStarfield = function() {
    // Starfield
    var stars = new THREE.Geometry();
    for (var i=0; i<10000; i++) {
      var vec = new THREE.Vector3(
        Math.random()-0.5,
        Math.random()-0.5,
        Math.random()-0.5
      ).normalize().multiplyScalar(30000);
      stars.vertices.push(vec);
    }
    var star_stuff = new THREE.PointCloudMaterial({sizeAttenuation: true, size: 100.0, fog: false, color: 0xffffff});
    var star_system = new THREE.PointCloud(stars, star_stuff);
    this.scene.add(star_system);
};

Game.prototype.render = function() {
  this.level.velocity = players.players.length === 0 ? 0 : 0.003;
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
    85, //FPS FOV, any higher adds lensing artifacts
    window.innerWidth / window.innerHeight,
    1,
    10000000
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
