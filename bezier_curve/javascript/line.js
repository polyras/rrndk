function Line(startPoint, endPoint) {
  this.start = startPoint
  this.end = endPoint
}

Line.prototype = {
  interpolate: function(progress) {
    var difference = this.end.subtract(this.start)
    var point = this.start.add(difference.multiply(progress))
    return point
  }
}
