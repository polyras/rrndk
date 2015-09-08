define(function() {
  function Vector3(x, y, z) {
    if(!x) x = 0;
    if(!y) y = 0;
    if(!z) z = 0;

    this.components = [x, y, z];
  }

  Vector3.prototype = {
    get: function(index) {
      return this.components[index];
    }
  };

  return Vector3;
});
