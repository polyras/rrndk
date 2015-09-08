define(['lib/blaise/vector2', 'lib/blaise/matrix3'], function(Vector2, Matrix3) {
  function Transformation2D() {
    this.position = new Vector2();
    this.orientation = 0;
    this._scale = 1;
  }

  Transformation2D.prototype = {
    move: function(translation) {
      this.position.add(translation);
    },
    getX: function() {
      return this.position.get(0);
    },
    getY: function() {
      return this.position.get(1);
    },
    scale: function(scaling) {
      this._scale += scaling;
      this._scale = Math.min(1, this._scale);
      this._scale = Math.max(0, this._scale);
    },
    getMatrix: function() {
      var matrix = new Matrix3(
        Math.cos(this.orientation)*this._scale, Math.sin(this.orientation), 0,
        -Math.sin(this.orientation), Math.cos(this.orientation)*this._scale, 0,
        this.position.get(0), this.position.get(1), 1
      );
      return matrix;
    },
    getInverseMatrix: function() {
      var matrix = new Matrix3(
        Math.cos(-this.orientation), Math.sin(-this.orientation), 0,
        -Math.sin(-this.orientation), Math.cos(-this.orientation), 0,
        -this.position.get(0), -this.position.get(1), 1
      );
      return matrix;
    },
    rotate: function(rotation) {
      this.orientation += rotation;
    }
  };



  return Transformation2D;
});
