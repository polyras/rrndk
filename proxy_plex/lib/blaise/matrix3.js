define(['./vector3'], function(Vector3) {
  function Matrix3() {
    this.components = new Float32Array(9);
    if(arguments.length === 9) {
      for(var i=0; 9>i; i++) {
        this.components[i] = arguments[i];
      }
    }
  }

  Matrix3.prototype.get = function(index) {
    return this.components[index];
  };

  Matrix3.createXRotation = function(rotation) {
      var matrix = Matrix3.createIdentity();

      var cosAngle = Math.cos(rotation);
      var sinAngle = Math.sin(rotation);

      matrix.components[4] = cosAngle;
      matrix.components[5] = sinAngle;
      matrix.components[7] = -sinAngle;
      matrix.components[8] = cosAngle;

      return matrix;
  };

  Matrix3.createYRotation = function(rotation) {
      var matrix = Matrix3.createIdentity();

      var cosAngle = Math.cos(rotation);
      var sinAngle = Math.sin(rotation);

      matrix.components[0] = cosAngle;
      matrix.components[2] = sinAngle;
      matrix.components[6] = -sinAngle;
      matrix.components[8] = cosAngle;

      return matrix;
  };

  Matrix3.createZRotation = function(rotation) {
      var matrix = Matrix3.createIdentity();

      var cosAngle = Math.cos(rotation);
      var sinAngle = Math.sin(rotation);

      matrix.components[0] = cosAngle;
      matrix.components[1] = sinAngle;
      matrix.components[3] = -sinAngle;
      matrix.components[4] = cosAngle;

      return matrix;
  };

  Matrix3.createIdentity = function() {
    var matrix = new Matrix3();
    matrix.components[0] = 1;
    matrix.components[4] = 1;
    matrix.components[8] = 1;
    return matrix;
  };

  Matrix3.multiplyMatrix = function(matrix1, matrix2) {
    var result = new Matrix3();

    var resultIndex;
    for(var row=0; 3>row; row++) {
        for(var column=0; 3>column; column++) {
            resultIndex = column*3+row;
            for(var step=0; 3>step; step++) {
                result.components[resultIndex] += matrix1.get(row+step*3) * matrix2.get(column*3+step);
            }
        }
    }

    return result;
  };

  Matrix3.multiplyVector = function(matrix, vector) {
    var result = new Vector3();

    for(var row=0; 3>row; row++) {
      for(var step=0; 3>step; step++) {
        result.components[row] += matrix.components[step*3+row] * vector.components[step];
      }
    }

    return result;
  };

  return Matrix3;
});
