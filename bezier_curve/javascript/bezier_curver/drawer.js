BezierCurver.Drawer = function(state, canvasEl) {
  this.state = state
  this.canvasEl = canvasEl
  this.context = canvasEl.getContext('2d')
}

BezierCurver.Drawer.prototype = {
  draw: function() {
    this.clear()
    this.state.curves.forEach(this.drawCurveWithLinesAndPoints.bind(this))
  },
  clear: function() {
    this.context.fillStyle = '#249ed0'
    this.context.fillRect(0 , 0, this.canvasEl.width, this.canvasEl.height)
  },
  drawPoint: function(point, options) {
    options = options || {}
    this.context.fillStyle = options.color || '#f8b500'
    this.context.beginPath()
    
    var radius = options.radius || 15
    this.context.arc(point.x, point.y, radius, 0, Math.PI*2, true)
    this.context.closePath()
    this.context.fill()
  },
  drawLine: function(line, options) {
    options = options || {}
    this.context.strokeStyle = options.color || '#1d7ba2'
    this.context.lineWidth = options.lineWidth || 4
    this.context.beginPath()
    this.context.moveTo(line.start.x, line.start.y)
    this.context.lineTo(line.end.x, line.end.y)
    this.context.stroke()
  },
  drawPointsForLines: function(lines) {
    var points = []
    lines.forEach(function(line) {
      points.push(line.start)
      points.push(line.end)
    })
    points.forEach(this.drawPoint.bind(this))
  },
  drawCurveWithLinesAndPoints: function(curve) {
    curve.lines.forEach(this.drawLine.bind(this))
    this.drawCurve(curve)
    this.drawPointsForLines(curve.lines)
  },
  drawCurve: function(curve) {
    var line1 = new Line
    var line2 = new Line
    var line3 = new Line
    var progress
    var points = []
    var currentCurvePoint

    for(var i=0; this.state.curvePoints>=i; i++) {
      progress = i/this.state.curvePoints
      line1.start = curve.lines[0].interpolate(progress)
      line1.end = curve.lines[1].interpolate(progress)

      line2.start = curve.lines[1].interpolate(progress)
      line2.end = curve.lines[2].interpolate(progress)

      line3.start = line1.interpolate(progress)
      line3.end = line2.interpolate(progress)

      point = line3.interpolate(progress)
      points.push(point)

      if(i == this.state.currentCurvePointIndex) {
        var lineOptions = { lineWidth: 2, color: '#765b4e' }
        var pointOptions = { radius: 5, color: '#5f3722' }

        this.drawLine(line1, lineOptions)
        this.drawLine(line2, lineOptions)
        this.drawLine(line3, lineOptions)
        this.drawPoint(line1.start, pointOptions)
        this.drawPoint(line1.end, pointOptions)
        this.drawPoint(line2.end, pointOptions)
        this.drawPoint(line3.start, pointOptions)
        this.drawPoint(line3.end, pointOptions)
        currentCurvePoint = point.duplicate()
      }
    }

    var options = { lineWidth: 8, color: '#304363' }
    this.drawLinesBetweenPoints(points, options)
    this.drawPoint(currentCurvePoint, { radius: 10, color: '#f2e13c' })
  },
  drawLinesBetweenPoints: function(points, options) {
    var lastPoint
    var currentPoint
    var line

    for(var i=0; points.length>i; i++) {
      currentPoint = points[i]
      if(lastPoint) {
        line = new Line(lastPoint, currentPoint);
        this.drawLine(line, options)
      }
      lastPoint = currentPoint
    }
  }
}
