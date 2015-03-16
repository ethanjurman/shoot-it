//Hooks are much like events, but operate synchronously
var events = {};

var hasSet = !!Set;

module.exports = {
  add: function(evt, func) {
    if (!hasSet) {
      events[evt] = events[evt] || {};
      func.__hashkey = Math.random(1, Math.pow(2, 50));
      events[evt][func.__hashkey] = func;
    } else {
      events[evt] = events[evt] || new Set();
      events[evt].add(func);
    }
  },
  remove: function(evt, func) {
    if (!events[evt]) return;
    if (!hasSet) {
      delete events[evt][func.__hashkey];
    } else {
      events[evt].remove(func);
    }
  },
  call: function() {
    var evt = Array.prototype.pop.call(arguments);
    if (!events[evt]) return;
    if (!hasSet) {
      for (var k in events[evt]) {
        if (events[evt][k].__hashkey) {
          events[evt][k].apply(null, arguments)
        }
      }
    } else {
      events[evt].forEach(function(elem) {
        elem.apply(null, arguments);
      });
    }
  }
};