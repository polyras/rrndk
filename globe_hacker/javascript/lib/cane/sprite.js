(function() {
  function Sprite(options) {
    Cane.Layer.call(this, options)
    if(options.image) this.image = options.image
    this.images = options.images
  }

  Sprite.prototype = Object.create(Cane.Layer.prototype)

  Sprite.prototype.update = function(timeDelta) {
    if(this.animation) {
      this.animation.update(timeDelta)
      this.image = this.animation.image
    }
  }

  Sprite.prototype.draw = function() {
    this.context.drawImage(this.image, -this.image.width/2, -this.image.height/2)
  }

  Cane.Sprite = Sprite
})()
