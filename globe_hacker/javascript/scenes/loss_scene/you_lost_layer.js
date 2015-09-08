(function() {
  function YouLostLayer(options) {
    Cane.Layer.call(this, options)
    this.x = options.element.width/2
    this.y = options.element.height*0.46
  }
  YouLostLayer.prototype = Object.create(Cane.Layer.prototype)

  YouLostLayer.prototype.draw = function() {
    this.context.shadowColor = 'rgba(0, 0, 0, 1)'
    this.context.shadowOffsetX = 0
    this.context.shadowOffsetY = 0
    this.context.shadowBlur = 30
    this.context.fillStyle = '#fff'
    this.context.font = "bold 100px Arial"
    this.context.textAlign = 'center'
    this.context.fillText('You lost :-(', 0, 0)
  }

  LossScene.YouLostLayer = YouLostLayer
})()
