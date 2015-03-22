var Flipsnap = require('./flipsnap');
var THREE = require('../host/game/libs/three');
var Player = require('../host/game/entity/player');
var ship = null; // 3d object
var invert = {
  x:(localStorage.getItem('inv_x') === 'true') || false,
  y:(localStorage.getItem('inv_y') === 'true') || false,
  z:(localStorage.getItem('inv_z') === 'true') || false};
var currentScreen = "wizard-01"; // starting screen
var count = 0; // trigger an event if the count
if (window.DeviceMotionEvent != undefined) {
  window.ondevicemotion = function(e) {
    count++;
    motion = {};
    // TODO seems like the inverts are inverted?
    motion.x = (!invert.x ? -1 : 1) * (e.accelerationIncludingGravity.x*2).toFixed() / 5;
    motion.y = (!invert.y ? -1 : 1) * (e.accelerationIncludingGravity.y*2).toFixed() / 5;
    motion.z = (!invert.z ? -1 : 1) * (e.accelerationIncludingGravity.z*2).toFixed() / 5;
  }
}

invertX = function(){
  invert['x'] = !invert['x'];
  localStorage.setItem("inv_x",invert['x']);
}
invertY = function(){
  invert['y'] = !invert['y'];
  localStorage.setItem("inv_y",invert['y']);
}
invertZ = function(){
  invert['z'] = !invert['z'];
  localStorage.setItem("inv_z",invert['z']);
}

continueWizard = function(e){
  var target = e.target || e.srcElement;
  target.parentNode.style.display = "none";
  currentScreen = target.getAttribute("data-next");
  document.querySelector("#" + currentScreen).style.display = "";
}

load3d = function(){
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth / 2, window.innerWidth / 2 );
  renderer.setClearColor( 0xffffff, 1);
  document.querySelector('.rotate3d').appendChild( renderer.domElement );
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
  directionalLight.position.set( 1, 1, 0 );
  scene.add( directionalLight );
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.9 );
  directionalLight.position.set( -1, -1, 0 );
  scene.add( directionalLight );

  // instantiate a loader
  var loader = new THREE.OBJMTLLoader();
  // load a resource
  loader.load(
  	// resource URL
  	'../resources/ship1.obj','../resources/ship1.mtl',
  	// Function when resource is loaded
  	function ( object ) {
      ship = object;
  		scene.add( object );
      setShipColor(Number(localStorage.getItem('color') || '0x777777'));
  	}
  );
	camera.position.z = 5;

	var render = function () {
		requestAnimationFrame( render );
    if (ship && (currentScreen == "wizard-01")) {
      ship.rotation.x = 0;
      ship.rotation.y = 0;
      ship.rotation.z = motion.y;
    }
    if (ship && (currentScreen == "wizard-02")) {
      ship.rotation.z = 0;
      ship.rotation.y = 0;
      ship.rotation.x = motion.z;
    }
    if (ship && (currentScreen == "wizard-03")) {
      camera.position.set( 0, 1, 5 );
      camera.lookAt(new THREE.Vector3(0,0,0))
      ship.rotation.z = 0;
      ship.rotation.x = 0;
      ship.rotation.y += 0.01;
    }
		renderer.render(scene, camera);
	};

	render();
}

setShipColor = function(color){
  // sets the color of the 3d model
  mat = new THREE.MeshLambertMaterial({ color: color })
  ship.traverse(function(child){
    child.material = mat;
    child.material.needsUpdates = true;
  });
  localStorage.setItem('color',color);
}

generateColors = function(){
  // generates all the possible colors
  var c = ['dd','77','22'];
  for (i in c){
    for (j in c){
      for (k in c){
        var newColor = document.createElement('div');
        newColor.setAttribute('class','item');
        newColor.setAttribute('data-color',"0x"+c[i]+c[j]+c[k]);
        newColor.setAttribute('style',"background:#"+c[i]+c[j]+c[k]);
        document.querySelector('.flipsnap').appendChild(newColor);
      }
    }
  }
}

window.addEventListener("DOMContentLoaded", function() {
  generateColors();
  var flipsnap = Flipsnap('.flipsnap', {
    distance: 230,
    transitionDuration: 100
  });
  document.querySelector('.flipsnap').style.width =
    document.querySelectorAll('.item').length * 400 + "px";
  flipsnap.element.addEventListener('fstouchend', function(ev) {
    // change color of the 3d model
    var color = document.querySelectorAll('.item')[ev.newPoint];
    setShipColor(Number(color.getAttribute('data-color')));
  }, false);
  load3d();
}, false);
