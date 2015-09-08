(function() {
  function MainframeNameLayer(options) {
    Cane.Layer.call(this, options)

    this.mainframe = options.mainframe
    this.x = options.mainframe.x
    this.y = options.mainframe.y
    if(this.mainframe.size == 1) {
      this.y += 30
    } else {
      this.y += 40
    }

    this.canvas = this.buildCanvas()
    this.canvas.width = 140
    this.canvas.height = 60
    this.drawCanvas()

  }
  MainframeNameLayer.prototype = Object.create(Cane.Layer.prototype)

  MainframeNameLayer.prototype.draw = function() {
    this.context.drawImage(this.canvas, -this.canvas.width/2, -this.canvas.height/2)
  }

  MainframeNameLayer.prototype.drawCanvas = function() {
    var context = this.canvas.getContext('2d')
    context.shadowColor = 'rgba(0, 0, 0, 0.5)'
    context.shadowOffsetX = 0
    context.shadowOffsetY = 0
    context.shadowBlur = 4
    context.fillStyle = '#fff'
    context.font = "bold 13px Arial"
    context.textAlign = 'center'
    context.fillText(this.mainframe.name, this.canvas.width/2, this.canvas.height/2)
  }

  MapScene.MainframeNameLayer = MainframeNameLayer
})()
