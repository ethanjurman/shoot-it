var Player = require('./entity/player');
var store = { players: [] };

store.create = function() {
  var p = new Player();
  store.players.push(p);
  return p;
};

store.remove = function(player) {
  var index = store.players.indexOf(player);
  if (index > -1) {
    store.players.splice(index, 1);
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