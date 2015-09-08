(function() {
  function ClickToContinueLayer(options) {
    Cane.Layer.call(this, options)
    this.x = options.element.width/2
    this.y = options.element.height*0.9
  }
  ClickToContinueLayer.prototype = Object.create(Cane.Layer.prototype)

  ClickToContinueLayer.prototype.draw = function() {
    this.context.shadowColor = 'rgba(0, 0, 0, 1)'
    this.context.shadowOffsetX = 0
    this.context.shadowOffsetY = 0
    this.context.shadowBlur = 30
    this.context.fillStyle = '#fff'
    this.context.font = "bold 18px Arial"
    this.context.textAlign = 'center'
    this.context.fillText('Try an easier level. Click to continue!', 0, 0)
  }

  LossScene.ClickToContinueLayer = ClickToContinueLayer
})()
