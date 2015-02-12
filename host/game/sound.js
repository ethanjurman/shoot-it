
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var sounds = {};
var hooks = {};
var Add = function(file) {
  if (sounds[file]) return;

  sounds[file] = 'unloaded';
  var request = new XMLHttpRequest();
  request.open("GET", file, true);
  request.responseType = "arraybuffer";

  var loader = this;
  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          console.log('error decoding file data: ' + file);
          return;
        }
        sounds[file] = buffer;
        if (!hooks[file]) {return;}
        for (var i=0; i<hooks[file].length; i++) {
            hooks[file][i](sounds[file]);
        }
      },
      function(error) {
        console.log('decodeAudioData error', error);
      }
    );
  };

  request.onerror = function(e) {
    console.log('Audio XHR Error.', e);
  };

  request.send();
};

var Get = function(file, cb) {
  if (!sounds[file]) return;
  if (sounds[file]==='unloaded') {
      if (!hooks[file]) {hooks[file] = [];}
      hooks[file] += cb;
  } else {
      cb(sounds[file]);
  }
};

var Play = function(path) {
  var play = function(sound) {
      var source = context.createBufferSource();
          source.buffer = sound;
          source.connect(context.destination);
          source.start(0);
  }
  Get(path, function(sound) {
      if (!sound) {
        Add(path);
        Get(path, play);
      } else {
          play(sound);
      }
  });
}

module.exports = { Add, Get, Play };