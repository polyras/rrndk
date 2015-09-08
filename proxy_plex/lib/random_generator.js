define(function() {
  function RandomGenerator(seed) {
    this.seed = seed;
  }

  RandomGenerator.prototype = {
    get: function() {
      var x = Math.sin(this.seed++) * 10000;
      return x - Math.floor(x);
    }
  };

  return RandomGenerator;
});
