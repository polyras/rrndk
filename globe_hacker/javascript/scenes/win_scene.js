function WinScene(options) {
  Cane.Scene.call(this, options)
  var backgroundLayer = this.buildLayer(Cane.Sprite)
  backgroundLayer.image = this.images['menu_bg.jpg']
  backgroundLayer.x = backgroundLayer.image.width/2
  backgroundLayer.y = backgroundLayer.image.height/2
  this.addChild(backgroundLayer)

  var youWonLayer = this.buildLayer(WinScene.YouWonLayer, { element: this.element })
  this.addChild(youWonLayer)

  var playtimeLayer = this.buildLayer(WinScene.PlaytimeLayer, { element: this.element, playtime: options.playtime })
  this.addChild(playtimeLayer)

  var difficultyLayer = this.buildLayer(WinScene.DifficultyLayer, { element: this.element, difficulty: options.difficulty })
  this.addChild(difficultyLayer)

  var clickToContinueLayer = this.buildLayer(WinScene.ClickToContinueLayer, { element: this.element })
  this.addChild(clickToContinueLayer)
}

WinScene.prototype = Object.create(Cane.Scene.prototype)

WinScene.prototype.update = function() {
  if(this.mouse.pressed) this.completed = true
}
