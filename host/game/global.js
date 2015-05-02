var THREE = require('./libs/three');

module.exports = {
  forward: new THREE.Vector3(0, 0, 1),
  up: new THREE.Vector3(0, 1, 0),
  left: new THREE.Vector3(1, 0, 0),
  zero: new THREE.Vector3(0, 0, 0),

  cgroup: {
    PLAYER: 1,
    BULLET: 2,
    WORLD: 4,
    ENEMY: 8,
    NONBULLET: 1 | 2 | 8,
    NONPLAYER: 2 | 4 | 8,
    ALL: 1 | 2 | 4 | 8
  },

  LEVEL_SEGMENTS: 30
};
