(function() {
  function ResistanceLayer(options) {
    Cane.GroupLayer.call(this, options)
    this.ai = options.ai
    this.x = 736
    this.y = 35

    this.backgroundLayer = this.buildLayer(Cane.Sprite)
    this.backgroundLayer.image = this.images['resistance/background.png']
    this.addChild(this.backgroundLayer)

    this.images['resistance/green.png']
  }
  ResistanceLayer.prototype = Object.create(Cane.GroupLayer.prototype)

  ResistanceLayer.prototype.draw = function(timeDelta) {
    Cane.GroupLayer.prototype.draw.call(this, timeDelta)
    var width = this.images['resistance/green.png'].width*this.ai.resistance

    this.context.drawImage(
      this.images['resistance/green.png'],
      0,
      0,
      width,
      this.images['resistance/green.png'].height,
      -63,
      -30,
      width,
      this.images['resistance/green.png'].height
    )

    this.context.globalAlpha = this.ai.resistance
    this.context.drawImage(
      this.images['resistance/red.png'],
      0,
      0,
      width,
      this.images['resistance/red.png'].height,
      -63,
      -30,
      width,
      this.images['resistance/red.png'].height
    )
    this.context.globalAlpha = 1

    /*
    this.context.shadowColor = 'rgba(0, 0, 0, 0.5)'
    this.context.shadowOffsetX = 0
    this.context.shadowOffsetY = 0
    this.context.shadowBlur = 4
    this.context.fillStyle = '#fff'
    this.context.font = "bold 15px Arial"
    this.context.fillText("Resistance: " + Math.round(this.ai.resistance*1000)/1000, 10, 20)
    */
  }

  MapScene.ResistanceLayer = ResistanceLayer
})()
