var Score = function(initials, score){
  this.initials = initials;
  this.score = score;
};

Score.prototype.add = function(num) {
  this.score += num;
};

Score.prototype.reset = function() {
  this.score = 0;
};

Score.prototype.setInitials = function(initials) {
  this.initials = initials;
};

module.exports = Score;