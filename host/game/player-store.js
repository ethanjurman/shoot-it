var Player = require('./entity/player');
var store = { players: [] };

store.create = function(color) {
  var p = new Player(color);
  store.players.push(p);
  document.getElementById("title-gif").style.display = "none";
  return p;
};

store.remove = function(player) {
  var index = store.players.indexOf(player);
  if (index > -1) {
    store.players.splice(index, 1);
  }
  player.remove();
  if (store.players.length == 0){
    document.getElementById("title-gif").src = "";
    setTimeout(function(){
      document.getElementById("title-gif").src = "/asteroidDrive.gif";
      document.getElementById("title-gif").style.display = "";
    },2000);
  }
};

store.find = function(id) {
  for (var i=0; i<store.players.length; i++) {
    if (store.players[i].userId == id) {
      return store.players[i];
    }
  }
};

module.exports = store;
