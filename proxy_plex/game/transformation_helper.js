define(['lib/blaise/matrix3', 'lib/blaise/vector2'], function(Matrix3, Vector2) {
  function resolveWorldMatrix(entity) {
    var aspects = entity.aspects;
    var local = aspects.transformation2D.getMatrix();

    if(aspects.parenting && aspects.parenting.parent) {
      var parent = resolveWorldMatrix(aspects.parenting.parent);
      return Matrix3.multiplyMatrix(parent, local)
    } else {
      return local;
    }
  }

  function resolveInverseWorldMatrix(entity) {
    var aspects = entity.aspects;
    var local = aspects.transformation2D.getInverseMatrix();

    if(aspects.parenting && aspects.parenting.parent) {
      var parent = resolveInverseWorldMatrix(aspects.parenting.parent);
      return Matrix3.multiplyMatrix(local, parent)
    } else {
      return local;
    }
  }

  function resolveWorldPosition(entity) {
    var matrix = resolveWorldMatrix(entity);
    var position = new Vector2(matrix.get(6), matrix.get(7));
    return position;
  }

  return {
    resolveWorldMatrix: resolveWorldMatrix,
    resolveInverseWorldMatrix: resolveInverseWorldMatrix,
    resolveWorldPosition: resolveWorldPosition
  };
});
