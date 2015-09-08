BezierCurver.MouseHandler = function(canvasEl, delegate, state) {
  this.canvasEl = canvasEl
  canvasEl.addEventListener('mousedown', this.mouseDown.bind(this))
  canvasEl.addEventListener('mousemove', this.mouseMove.bind(this))
  canvasEl.addEventListener('mouseup', this.mouseUp.bind(this))
  this.state = state
  this.delegate = delegate
}

BezierCurver.MouseHandler.prototype = {
  mouseDown: function(e) {
    var point = new Vector2(e.layerX, e.layerY)
    var hit =  this.state.findPointAt(point)
    if(hit) {
      this.draggingPoint = hit
    }
  },
  mouseMove: function(e) {
    var position = new Vector2(e.layerX, e.layerY)
    if(this.draggingPoint) {
      this.delegate.drag(this.draggingPoint, position)
    } else {
      var hit =  this.state.findPointAt(position)

      if(this.hoverPoint) {
        if(!hit) {
          this.delegate.pointOut(this.hoverPoint)
          this.hoverPoint = null
        }
      } else {
        if(hit) {
          this.hoverPoint = hit
          this.delegate.pointOver(hit)
        }
      }
    }
  },
  mouseUp: function() {
    this.draggingPoint = null
    this.currentPosition = null
  }
}