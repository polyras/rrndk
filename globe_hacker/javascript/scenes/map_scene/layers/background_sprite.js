(function() {
  function BackgroundSprite(options) {
    Cane.Sprite.call(this, options)
    this.image = this.images['world.jpg']
  }
  BackgroundSprite.prototype = Object.create(Cane.Sprite.prototype)

  MapScene.BackgroundSprite = BackgroundSprite
})()
