function LossScene(options) {
  Cane.Scene.call(this, options)
  var backgroundLayer = this.buildLayer(Cane.Sprite)
  backgroundLayer.image = this.images['menu_bg.jpg']
  backgroundLayer.x = backgroundLayer.image.width/2
  backgroundLayer.y = backgroundLayer.image.height/2
  this.addChild(backgroundLayer)

  var youLostLayer = this.buildLayer(LossScene.YouLostLayer, { element: this.element })
  this.addChild(youLostLayer)

  var playtimeLayer = this.buildLayer(LossScene.PlaytimeLayer, { element: this.element, playtime: options.playtime })
  this.addChild(playtimeLayer)

  var clickToContinueLayer = this.buildLayer(LossScene.ClickToContinueLayer, { element: this.element })
  this.addChild(clickToContinueLayer)
}

LossScene.prototype = Object.create(Cane.Scene.prototype)

LossScene.prototype.update = function() {
  if(this.mouse.pressed) this.completed = true
}
