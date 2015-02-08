if (window.DeviceMotionEvent != undefined) {
	window.ondevicemotion = function(e) {
    var motion = {}
    motion.x = (e.accelerationIncludingGravity.x*10).toFixed(2);
    motion.y = (e.accelerationIncludingGravity.y*10).toFixed(2);
    motion.z = (e.accelerationIncludingGravity.z*10).toFixed(2);
    motion.alpha = (e.rotationRate.alpha*10).toFixed(2);
    motion.beta = (e.rotationRate.beta*10).toFixed(2);
    motion.gamma = (e.rotationRate.gamma*10).toFixed(2);
		document.getElementById("acceleration-x").innerHTML = motion.x;
		document.getElementById("acceleration-y").innerHTML = motion.y;
		document.getElementById("acceleration-z").innerHTML = motion.z;

		if ( e.rotationRate ) {
			document.getElementById("rotation-a").innerHTML = motion.alpha;
			document.getElementById("rotation-b").innerHTML = motion.beta;
			document.getElementById("rotation-g").innerHTML = motion.gamma;
		}

    var square = document.getElementById("square");
    square.setAttribute("x",180 - motion.x);
    square.setAttribute("y",180 - motion.y);
	}
}
