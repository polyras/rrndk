(function() {
  function ChooseLayer(options) {
    Cane.Layer.call(this, options)
    this.x = options.element.width/2
    this.y = options.element.height*0.2
  }
  ChooseLayer.prototype = Object.create(Cane.Layer.prototype)

  ChooseLayer.prototype.draw = function() {
    this.context.shadowColor = 'rgba(0, 0, 0, 1)'
    this.context.shadowOffsetX = 0
    this.context.shadowOffsetY = 0
    this.context.shadowBlur = 26
    this.context.fillStyle = '#fff'
    this.context.font = "bold 90px Arial"
    this.context.textAlign = 'center'
    this.context.fillText('Choose a difficulty', 0, 0)
  }

  DifficultiesScene.ChooseLayer = ChooseLayer
})()
