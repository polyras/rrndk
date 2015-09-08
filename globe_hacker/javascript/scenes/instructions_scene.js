function InstructionsScene(options) {
  Cane.Scene.call(this, options)
  var backgroundLayer = this.buildLayer(Cane.Sprite)
  backgroundLayer.image = this.images['menu_bg.jpg']
  backgroundLayer.x = backgroundLayer.image.width/2
  backgroundLayer.y = backgroundLayer.image.height/2
  this.addChild(backgroundLayer)

  this.textLayer = this.buildLayer(Cane.Sprite)
  this.textLayer.image = this.images['texts/instructions.png']
  this.textLayer.x = backgroundLayer.image.width/2
  this.textLayer.y = backgroundLayer.image.height/2+50
  this.addChild(this.textLayer)
}

InstructionsScene.prototype = Object.create(Cane.Scene.prototype)

InstructionsScene.prototype.update = function(timeDelta) {
  if(this.keyboard.keysPressed.space || this.mouse.pressed) {
    this.completed = true
  }
}

InstructionsScene.prototype.draw = function(timeDelta) {
  Cane.Scene.prototype.draw.call(this, timeDelta)
  this.context.shadowColor = 'rgba(0, 0, 0, 1)'
  this.context.shadowOffsetX = 0
  this.context.shadowOffsetY = 0
  this.context.shadowBlur = 30
  this.context.fillStyle = '#fff'
  this.context.font = "bold 72px Arial"
  this.context.textAlign = 'center'
  this.context.fillText('How to play', this.images['menu_bg.jpg'].width/2, 160)
}
