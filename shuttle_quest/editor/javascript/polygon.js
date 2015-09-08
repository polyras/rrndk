function Polygon(type) {
  this.points = [];
  this.type = type;
}

Polygon.prototype.hasPoint = function(point) {
  return this.points.indexOf(point) !== -1;
};

Polygon.prototype.isValid = function() {
  var point;
  var indexes = [];
  for(var i=0; this.points.length-2>i; i++) {
    indexes.push([i, i+1, i+2]);
  }
  indexes.push([i, i+1, 0]);
  indexes.push([i+1, 0, 1]);

  var crossProducts = [];
  for(i=0; indexes.length>i; i++) {
    crossProducts.push(this.getCrossProduct(
      indexes[i][0],
      indexes[i][1],
      indexes[i][2]
    ));
  }

  var sign, crossProduct;
  for(i=0; crossProducts.length>i; i++) {
    crossProduct = crossProducts[i];
    crossProductSign = crossProduct/Math.abs(crossProduct);
    if(!sign) {
      sign = crossProductSign;
    }
    else if(sign != crossProductSign) {
      return false;
    }
  }

  return true;
};

Polygon.prototype.getCrossProduct = function(index1, index2, index3) {
  var point1 = this.points[index1];
  var point2 = this.points[index2];
  var point3 = this.points[index3];

  var vector1 = Voy.Vector2.subtract(point2, point1);
  var vector2 = Voy.Vector2.subtract(point3, point2);

  var crossProduct = vector1.getCrossProduct(vector2);
  return crossProduct;
};
