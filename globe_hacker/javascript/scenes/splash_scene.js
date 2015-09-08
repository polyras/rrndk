function SplashScene(options) {
  Cane.Scene.call(this, options)
  var backgroundLayer = this.buildLayer(Cane.Sprite)
  backgroundLayer.image = this.images['menu_bg.jpg']
  backgroundLayer.x = backgroundLayer.image.width/2
  backgroundLayer.y = backgroundLayer.image.height/2
  this.addChild(backgroundLayer)
  var photo = this.buildLayer(Cane.Sprite)
  photo.image = this.images['photo.png']
  photo.x = 880
  photo.y = 65
  this.addChild(photo)
}

SplashScene.prototype = Object.create(Cane.Scene.prototype)

SplashScene.prototype.update = function(timeDelta) {
  Cane.Scene.prototype.update.call(this, timeDelta)
  if(this.keyboard.keysPressed.space || this.mouse.pressed) {
    this.completed = true
  }
}

SplashScene.prototype.draw = function(timeDelta) {
  Cane.Scene.prototype.draw.call(this, timeDelta)
  this.drawTitle()
  this.drawAuthor()
  this.drawDescription()
}

SplashScene.prototype.drawTitle = function() {
  this.context.shadowColor = 'rgba(0, 0, 0, 1)'
  this.context.shadowOffsetX = 0
  this.context.shadowOffsetY = 0
  this.context.shadowBlur = 30
  this.context.fillStyle = '#fff'
  this.context.font = "bold 140px Arial"
  this.context.textAlign = 'center'
  this.context.fillText('Globe Hacker', this.images['menu_bg.jpg'].width/2, this.images['menu_bg.jpg'].height/2+14)
}

SplashScene.prototype.drawAuthor = function() {
  this.context.shadowColor = 'rgba(0, 0, 0, 1)'
  this.context.shadowOffsetX = 0
  this.context.shadowOffsetY = 0
  this.context.shadowBlur = 10
  this.context.fillStyle = '#fff'
  this.context.font = "bold 23px Arial"
  this.context.textAlign = 'center'
  this.context.fillText('A strategy game by Rasmus Ronn Nielsen', this.images['menu_bg.jpg'].width/2, 348)
}

SplashScene.prototype.drawDescription = function() {
  this.context.shadowColor = 'rgba(0, 0, 0, 1)'
  this.context.shadowOffsetX = 0
  this.context.shadowOffsetY = 0
  this.context.shadowBlur = 10
  this.context.fillStyle = '#fff'
  this.context.font = "bold 23px Arial"
  this.context.textAlign = 'center'
  this.context.fillText("Everything, including idea, design, sounds, story, music, graphics, code and", this.images['menu_bg.jpg'].width/2, 488)
  this.context.fillText('testing, was done in less than 48 hours for the Ludum Dare competition', this.images['menu_bg.jpg'].width/2, 518)
}
