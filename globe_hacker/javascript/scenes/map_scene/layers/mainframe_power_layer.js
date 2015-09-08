(function() {
  function MainframePowerLayer(options) {
    this.state = options.state
    Cane.Layer.call(this, options)
    this.mainframe = options.mainframe
    if(options.mainframe.size == 1) {
      this.image = this.images['mainframes/small_power.png']
      this.x = -13
      this.y = -14
    } else {
      this.image = this.images['mainframes/large_power.png']
      this.x = -20
      this.y = -20
    }
    this.percentage = this.mainframe.getPowerPercentage()
  }
  MainframePowerLayer.prototype = Object.create(Cane.Layer.prototype)

  MainframePowerLayer.prototype.update = function(timeDelta) {
    this.percentage += (this.mainframe.getPowerPercentage()-this.percentage)*timeDelta/16*0.1
    if(this.mainframe.getPowerPercentage() > 1 && Math.random() < 0.05) {
      console.log(this.mainframe.name, this.percentage, this.mainframe.getPowerPercentage(), this.mainframe.power, this.mainframe.maxPower)
    }
  }

  MainframePowerLayer.prototype.draw = function() {
    var height = this.image.height*this.percentage
    var heightOffset = this.image.height-height

    this.context.drawImage(this.image, 0, heightOffset, this.image.width, height, 0, heightOffset, this.image.width, height)
  }

  MapScene.MainframePowerLayer = MainframePowerLayer
})()
