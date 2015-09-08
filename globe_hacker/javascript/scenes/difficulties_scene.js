function DifficultiesScene(options) {
  Cane.Scene.call(this, options)
  var backgroundLayer = this.buildLayer(Cane.Sprite)
  backgroundLayer.image = this.images['menu_bg.jpg']
  backgroundLayer.x = backgroundLayer.image.width/2
  backgroundLayer.y = backgroundLayer.image.height/2
  this.addChild(backgroundLayer)

  var chooseLayer = this.buildLayer(DifficultiesScene.ChooseLayer, { element: this.element })
  this.addChild(chooseLayer)

  var buttonsLayer = this.buildLayer(Cane.Sprite)
  buttonsLayer.image = this.images['difficulties.png']
  buttonsLayer.x = buttonsLayer.image.width/2 + 161
  buttonsLayer.y = 350
  this.addChild(buttonsLayer)
}

DifficultiesScene.prototype = Object.create(Cane.Scene.prototype)

DifficultiesScene.prototype.update = function() {
  if(this.mouse.pressed) {
    if(this.mouse.x > 228 && this.mouse.x < 727) {
      if(this.mouse.y > 175 && this.mouse.y < 294) {
        this.difficulty = 'easy'
      }
      else if(this.mouse.y > 294 && this.mouse.y < 407) {
        this.difficulty = 'medium'
      }
      else if(this.mouse.y > 410 && this.mouse.y < 527) {
        this.difficulty = 'hard'
      }
    }
    if(this.difficulty) this.completed = true
  }
}
