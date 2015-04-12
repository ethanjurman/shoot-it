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
      events[evt].delete(func);
    }
  },
  call: function(evt, arg1, arg2, arg3) {
    if (!events[evt]) return;
    if (!hasSet) {
      for (var k in events[evt]) {
        if (events[evt][k].__hashkey) {
          events[evt][k](arg1, arg2, arg3)
        }
      }
    } else {
      events[evt].forEach(function(elem) {
        elem(arg1, arg2, arg3);
      });
    }
  }
};
