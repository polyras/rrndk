function BezierCurver(canvasEl) {
  this.canvasEl = canvasEl
  this.state = new BezierCurver.State
  this.drawer = new BezierCurver.Drawer(this.state, this.canvasEl)
  this.mouse = new BezierCurver.MouseHandler(canvasEl, this, this.state)
  this.state.currentCurvePointIndex = 0
  this.timeUntilCurvePointIndexIncrease = 0
  this.curvePointIndexIncreaseInterval = 50

  this.state.addCurveFor(350, 500, 50, 250, 350, 50, 400, 300)
  this.state.addCurveFor(400, 300, 450, 50, 850, 450, 350, 500)
}

BezierCurver.prototype = {
  initialize: function() {
    this.tick()
  },
  nextTick: function() {
    requestAnimationFrame(this.tick.bind(this))
  },
  tick: function(timestamp) {
    if(this.lastTickAt) {
      var timeDelta = timestamp-this.lastTickAt
      if(timeDelta < 200) {
        this.update(timeDelta)
        this.draw()
      }
    }
    this.lastTickAt = timestamp
    this.nextTick()
  },
  update: function(timeDelta) {
    if(this.timeUntilCurvePointIndexIncrease < 0) {
      this.timeUntilCurvePointIndexIncrease += this.curvePointIndexIncreaseInterval
      this.state.currentCurvePointIndex++
      if(this.state.currentCurvePointIndex > this.state.curvePoints) this.state.currentCurvePointIndex = 0
    }
    this.timeUntilCurvePointIndexIncrease -= timeDelta
  },
  draw: function() {
    this.drawer.draw()
  },
  drag: function(point, position) {
    point.x = position.x
    point.y = position.y
  },
  pointOver: function(point) {
    this.canvasEl.style.cursor = 'pointer'
  },
  pointOut: function() {
    this.canvasEl.style.cursor = ''
  }
}
