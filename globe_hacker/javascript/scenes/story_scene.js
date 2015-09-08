function StoryScene(options) {
  Cane.Scene.call(this, options)
  var backgroundLayer = this.buildLayer(Cane.Sprite)
  backgroundLayer.image = this.images['menu_bg.jpg']
  backgroundLayer.x = backgroundLayer.image.width/2
  backgroundLayer.y = backgroundLayer.image.height/2
  this.addChild(backgroundLayer)
  
  this.textLayer = this.buildLayer(Cane.Sprite)
  this.textLayer.image = this.images['texts/story1.png']
  this.textLayer.x = backgroundLayer.image.width/2
  this.textLayer.y = backgroundLayer.image.height/2
  this.addChild(this.textLayer)
}

StoryScene.prototype = Object.create(Cane.Scene.prototype)

StoryScene.prototype.update = function(timeDelta) {
  if(this.keyboard.keysPressed.space || this.mouse.pressed) {
    if(this.atPage2) {
      this.completed = true
    } else {
      this.mouse.pressed = false
      this.atPage2 = true
      this.textLayer.image = this.images['texts/story2.png']
    }
  }
}
