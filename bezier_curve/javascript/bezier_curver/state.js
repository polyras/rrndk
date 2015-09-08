BezierCurver.State = function() {
  this.curves = []
  this.hitTolerance = 15
  this.curvePoints = 100
}

BezierCurver.State.prototype = {
  addCurveFor: function(x1, y1, x2, y2, x3, y3, x4, y4) {
    var point1 = new Vector2(x1, y1)
    var point2 = new Vector2(x2, y2)
    var point3 = new Vector2(x3, y3)
    var point4 = new Vector2(x4, y4)

    var line1 = new Line(point1, point2)
    var line2 = new Line(point2, point3)
    var line3 = new Line(point3, point4)

    var curve = new BezierCurve(line1, line2, line3)
    this.curves.push(curve)
  },
  getPoints: function() {
    var points = []
    this.curves.forEach(function(curve) {
      curve.lines.forEach(function(line) {
        points.push(line.start)
        points.push(line.end)
      })
    })
    return points
  },
  findPointAt: function(targetPoint) {
    var point
    var points = this.getPoints()
    for(var i=0; points.length>i; i++) {
      point = points[i]
      distance = targetPoint.subtract(point).length()
      if(distance <= this.hitTolerance) return point
    }
  }
}
