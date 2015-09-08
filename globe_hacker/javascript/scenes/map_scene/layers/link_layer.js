(function() {
  function LinkLayer(options) {
    Cane.Layer.call(this, options)
    this.link = options.link
    this.startX = options.link.mainframes[0].x
    this.startY = options.link.mainframes[0].y
    this.endX = options.link.mainframes[1].x
    this.endY = options.link.mainframes[1].y
  }
  LinkLayer.prototype = Object.create(Cane.Layer.prototype)

  LinkLayer.prototype.draw = function() {
    this.context.strokeStyle = '#40a6d1'
    this.context.lineWidth = 4
    this.context.beginPath()
    this.context.moveTo(this.startX, this.startY)
    this.context.lineTo(this.endX, this.endY)
    this.context.stroke()
  }

  MapScene.LinkLayer = LinkLayer
})()
